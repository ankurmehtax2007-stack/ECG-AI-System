"""
Grad-CAM implementation for 1D CNN ECG Arrhythmia model.
Generates gradient-weighted class activation maps to highlight
which segments of the ECG signal the model focused on.
"""

import numpy as np
import tensorflow as tf
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import io


def _get_last_conv_layer_name(model):
    """Find the last Conv1D layer name in the model."""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv1D):
            return layer.name
    return None


def compute_cam(signal, class_id=None):
    """
    Compute the raw normalized 187-point CAM array for the given ECG signal.
    """
    from predictor import model as _model

    last_conv_name = _get_last_conv_layer_name(_model)
    if not last_conv_name:
        raise ValueError("No Conv1D layer found in model")

    signal_arr = np.array(signal, dtype=np.float32).reshape(1, 187, 1)
    input_tensor = tf.cast(tf.constant(signal_arr), tf.float32)

    # Run forward pass layer by layer under GradientTape to compute gradients
    with tf.GradientTape() as tape:
        x = input_tensor
        conv_outputs = None
        for layer in _model.layers:
            # Intercept final Dense layer to compute logit directly (bypassing softmax saturation)
            if layer.name == "dense_2" or (isinstance(layer, tf.keras.layers.Dense) and getattr(layer, "activation", None) and getattr(layer.activation, "__name__", "") == "softmax"):
                x = tf.matmul(x, layer.kernel) + layer.bias
            else:
                x = layer(x)

            if layer.name == last_conv_name:
                conv_outputs = x
                # Explicitly watch intermediate conv activations
                tape.watch(conv_outputs)
        
        predictions_logits = x
        if class_id is None:
            class_id = int(tf.argmax(predictions_logits[0]))
        loss = predictions_logits[:, class_id]

    # Gradients of the target class w.r.t. the conv layer output
    grads = tape.gradient(loss, conv_outputs)

    if grads is None:
        # Fallback: use uniform weights if gradients can't be computed
        cam = tf.reduce_mean(conv_outputs[0], axis=-1).numpy()
    else:
        # Global average pooling of gradients -> channel weights
        weights = tf.reduce_mean(grads, axis=1)  # (1, num_filters)
        # Weighted combination of conv output feature maps
        cam = tf.reduce_sum(conv_outputs[0] * weights[0], axis=-1).numpy()

    # ReLU + normalize
    cam = np.maximum(cam, 0)
    if cam.max() > 0:
        cam = cam / cam.max()

    # Interpolate cam to original signal length (187)
    original_length = 187
    cam_length = len(cam)
    if cam_length != original_length:
        x_cam = np.linspace(0, original_length - 1, cam_length)
        x_orig = np.arange(original_length)
        cam = np.interp(x_orig, x_cam, cam)

    return cam


def generate_gradcam(signal, class_id=None):
    """
    Generate a Grad-CAM heatmap plot overlay for the given 187-point ECG signal.
    """
    cam = compute_cam(signal, class_id)
    original_length = 187

    # Plot
    fig, ax = plt.subplots(figsize=(12, 4.5))
    fig.patch.set_facecolor("#0f1729")
    ax.set_facecolor("#0f1729")

    signal_1d = np.array(signal, dtype=np.float32).flatten()
    x = np.arange(original_length)

    # Plot the ECG signal
    ax.plot(x, signal_1d, color="#10b981", linewidth=1.8, alpha=0.95, zorder=3)

    # Overlay Grad-CAM heatmap as colored fill
    for i in range(len(x) - 1):
        intensity = cam[i]
        color = plt.cm.jet(intensity)
        ax.fill_between(
            x[i:i+2], signal_1d[i:i+2],
            alpha=0.5 * intensity + 0.03,
            color=color, zorder=2
        )

    # Add scatter overlay for high-activation points
    high_activation = cam > 0.6
    if np.any(high_activation):
        ax.scatter(
            x[high_activation], signal_1d[high_activation],
            c=cam[high_activation], cmap="jet", s=20, zorder=4,
            edgecolors="white", linewidths=0.5, alpha=0.8
        )

    # Colorbar
    sm = plt.cm.ScalarMappable(cmap=plt.cm.jet, norm=plt.Normalize(vmin=0, vmax=1))
    sm.set_array([])
    cbar = fig.colorbar(sm, ax=ax, pad=0.02, aspect=30)
    cbar.set_label("Activation Intensity", color="#94a3b8", fontsize=10)
    cbar.ax.yaxis.set_tick_params(color="#94a3b8")
    plt.setp(cbar.ax.yaxis.get_ticklabels(), color="#94a3b8")

    ax.set_xlabel("Sample Point", color="#94a3b8", fontsize=11)
    ax.set_ylabel("Amplitude", color="#94a3b8", fontsize=11)
    ax.set_title(
        "Grad-CAM: CNN Attention Overlay on ECG Signal",
        color="#e2e8f0", fontsize=13, fontweight="bold", pad=12
    )
    ax.tick_params(colors="#94a3b8")
    ax.spines["bottom"].set_color("#334155")
    ax.spines["left"].set_color("#334155")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(True, alpha=0.12, color="#334155")

    plt.tight_layout()

    # Save to bytes
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def get_explainability_metrics(signal, class_id, label):
    """
    Calculate explainability statistics from the CAM:
    - Most Influential Region
    - Model Attention Score (%)
    - Dynamic Clinical Interpretation
    """
    cam = compute_cam(signal, class_id)

    # Define segments (indices for 187-sample MIT-BIH heartbeat)
    # P-wave: 0-54, QRS: 55-94, ST segment: 95-129, T-wave: 130-186
    p_cam = cam[0:55]
    qrs_cam = cam[55:95]
    st_cam = cam[95:130]
    t_cam = cam[130:187]

    # Calculate average attention density to neutralize segment length differences
    avg_p = float(np.mean(p_cam)) if len(p_cam) > 0 else 0.0
    avg_qrs = float(np.mean(qrs_cam)) if len(qrs_cam) > 0 else 0.0
    avg_st = float(np.mean(st_cam)) if len(st_cam) > 0 else 0.0
    avg_t = float(np.mean(t_cam)) if len(t_cam) > 0 else 0.0

    total_avg = avg_p + avg_qrs + avg_st + avg_t
    if total_avg > 0:
        pct_p = (avg_p / total_avg) * 100
        pct_qrs = (avg_qrs / total_avg) * 100
        pct_st = (avg_st / total_avg) * 100
        pct_t = (avg_t / total_avg) * 100
    else:
        pct_p = pct_qrs = pct_st = pct_t = 25.0

    regions = [
        {"name": "P-Wave", "percentage": pct_p},
        {"name": "QRS Complex", "percentage": pct_qrs},
        {"name": "ST Segment", "percentage": pct_st},
        {"name": "T-Wave", "percentage": pct_t}
    ]

    # Find region with maximum attention density
    max_region = max(regions, key=lambda x: x["percentage"])

    # Generate clinician friendly explanation
    interpretation = f"The CNN primarily focused on the {max_region['name']} morphology when classifying this heartbeat as {label}."

    return {
        "most_influential_region": max_region["name"],
        "attention_score": round(max_region["percentage"], 1),
        "interpretation": interpretation
    }
