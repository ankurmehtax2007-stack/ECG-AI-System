import { useEffect, useState } from "react";
import API from "../services/api";

function ClinicalExplainability({ predictionId, predictionLabel }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!predictionId) return;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/explain/${predictionId}/metrics`);
        setMetrics(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching explainability metrics:", err);
        setError("Failed to load explainability metrics");
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [predictionId]);

  if (loading) {
    return (
      <div className="card" style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "150px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px",
            height: "30px",
            border: "3px solid rgba(56, 189, 248, 0.2)",
            borderTopColor: "var(--accent-color)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>
            Analyzing CNN Layer Activations...
          </span>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="card" style={{ padding: "20px", color: "var(--color-danger)", textAlign: "center" }}>
        <span>⚠️ {error || "Explainability data unavailable"}</span>
      </div>
    );
  }

  // Legend items configuration
  const legendItems = [
    { label: "Low Importance", color: "#1e3a8a", dotColor: "#3b82f6" }, // Blue
    { label: "Moderate Importance", color: "#065f46", dotColor: "#10b981" }, // Green
    { label: "High Importance", color: "#854d0e", dotColor: "#eab308" }, // Yellow
    { label: "Very High Importance", color: "#991b1b", dotColor: "#ef4444" } // Red
  ];

  // Glassmorphic card base styling
  const cardStyle = (index) => ({
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: hoveredCard === index 
      ? "1px solid var(--accent-color)" 
      : "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: hoveredCard === index ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hoveredCard === index 
      ? "0 10px 20px -10px var(--accent-glow)" 
      : "none"
  });

  return (
    <div className="card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", position: "relative" }}>
      <h2 className="card-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🔬 Clinical Explainability Dashboard (Grad-CAM)</span>
        <span style={{ 
          fontSize: "11px", 
          background: "var(--accent-glow)", 
          color: "var(--accent-color)", 
          padding: "4px 10px", 
          borderRadius: "20px", 
          fontWeight: 600,
          border: "1px solid rgba(56, 189, 248, 0.2)"
        }}>
          1D CNN Interpretability
        </span>
      </h2>

      <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
        This module visualizes gradient-weighted class activations mapped back onto the ECG wave. 
        It highlights the morphological features of the heartbeat that most influenced the CNN model's decision during classification.
      </p>

      {/* Main Grad-CAM Plot */}
      <div className="explain-container" style={{ position: "relative", marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src={`http://localhost:5000/explain/${predictionId}`}
          alt={`Grad-CAM explainability for ${predictionLabel}`}
          className="explain-image"
          style={{ width: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "block" }}
          onError={(e) => {
            e.target.style.display = 'none';
            console.error("Grad-CAM image loading failed.");
          }}
        />
      </div>

      {/* Interactive Color Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "center",
        padding: "12px 16px",
        background: "rgba(255, 255, 255, 0.01)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-color)",
        marginBottom: "24px"
      }}>
        {legendItems.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              fontSize: "13px", 
              fontWeight: 500, 
              color: "var(--text-secondary)",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
          >
            <span style={{ 
              width: "12px", 
              height: "12px", 
              borderRadius: "50%", 
              background: item.dotColor, 
              display: "inline-block",
              boxShadow: `0 0 8px ${item.dotColor}`
            }}></span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* 3 Compact Insight Cards */}
      <div className="grid-3">
        {/* Card 1: Most Influential Region */}
        <div 
          style={cardStyle(0)}
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            📍 Most Influential Region
          </span>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-color)", marginTop: "4px" }}>
            {metrics.most_influential_region}
          </span>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0 }}>
            The morphological region of the ECG wave that recorded the highest density of model activations.
          </p>
        </div>

        {/* Card 2: Model Attention Score */}
        <div 
          style={cardStyle(1)}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            ⚡ Model Attention Score
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              {metrics.attention_score}%
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              concentration
            </span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "3px", overflow: "hidden", marginTop: "4px" }}>
            <div style={{ 
              width: `${metrics.attention_score}%`, 
              height: "100%", 
              background: "var(--primary-gradient)", 
              borderRadius: "3px",
              boxShadow: "0 0 8px var(--accent-color)",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
            }}></div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0, marginTop: "2px" }}>
            Relative attention density concentrated within the primary region.
          </p>
        </div>

        {/* Card 3: Clinical Interpretation */}
        <div 
          style={cardStyle(2)}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            📝 Clinical Interpretation
          </span>
          <p style={{ 
            fontSize: "13px", 
            color: "var(--text-primary)", 
            fontWeight: 500, 
            lineHeight: "1.5", 
            margin: 0, 
            marginTop: "4px",
            borderLeft: "2px solid var(--accent-color)",
            paddingLeft: "10px",
            fontStyle: "italic"
          }}>
            "{metrics.interpretation}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClinicalExplainability;
