const conditionMap = {
  "Normal Beat": {
    condition: "Normal Sinus Rhythm",
    description: "The cardiac electrical impulse is originating from the sinus node and propagating normally. No rhythm disturbances are detected."
  },
  "Supraventricular Beat": {
    condition: "Supraventricular Arrhythmia / Premature Beat",
    description: "Abnormal cardiac beats originating above the ventricles (in the atria or AV node). While often benign, frequent occurrences require clinical observation."
  },
  "Ventricular Beat": {
    condition: "Ventricular Arrhythmia / Ectopic Beat",
    description: "Abnormal cardiac beats originating in the ventricular chambers. This can disrupt normal pumping efficiency and requires immediate cardiological evaluation."
  },
  "Fusion Beat": {
    condition: "Fusion Beat Activity",
    description: "A hybrid cardiac waveform indicating concurrent ventricular pacing and normal conduction. Suggests complex pacemaker or ectopic interaction."
  },
  "Unknown Beat": {
    condition: "Undetermined Arrhythmic Rhythm",
    description: "An irregular cardiac waveform that does not fit standard beat profiles. Professional clinical review with a full 12-lead ECG is recommended."
  }
};

function PredictionCard({ label, confidence }) {
  const info = conditionMap[label] || {
    condition: "General Rhythm Anomaly",
    description: "Cardiac pattern displays ectopic or arrhythmic changes from normal sinus baseline."
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2 className="card-title" style={{ margin: 0 }}>📊 Prediction Result</h2>
      
      <div style={{ marginTop: "10px" }}>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>CLASSIFICATION</span>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-color)", margin: "4px 0" }}>{label}</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>AI Confidence:</span>
        <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>{confidence}%</span>
      </div>

      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>Condition Assessment</span>
        <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", margin: "6px 0 2px 0" }}>{info.condition}</h4>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>{info.description}</p>
      </div>
    </div>
  );
}

export default PredictionCard;