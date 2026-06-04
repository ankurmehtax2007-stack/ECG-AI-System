import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import ClinicalExplainability from "./ClinicalExplainability";

const conditionMap = {
  "Normal Beat": "Normal Sinus Rhythm",
  "Supraventricular Beat": "Supraventricular Arrhythmia",
  "Ventricular Beat": "Ventricular Arrhythmia",
  "Fusion Beat": "Fusion Beat Activity",
  "Unknown Beat": "Undetermined Arrhythmic Rhythm"
};

function HistoryTable({ history, onDeleteRecord }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="card">
      <h2 className="card-title">📋 Prediction History</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--bg-input)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              overflow: "hidden",
              transition: "var(--transition)"
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                cursor: "pointer"
              }}
              onClick={() => toggleExpand(item.id)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: "15px" }}>
                  {conditionMap[item.prediction] || item.prediction}
                </span>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {new Date(item.date).toLocaleString()} • Confidence: {item.confidence}%
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  className={`badge ${
                    item.risk === "High"
                      ? "high-risk"
                      : item.risk === "Medium"
                      ? "medium-risk"
                      : "low-risk"
                  }`}
                >
                  {item.risk}
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "13px", margin: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`http://localhost:5000/reports/${item.id}`, "_blank");
                  }}
                  disabled={!item.id}
                >
                  Report
                </button>
                {onDeleteRecord && (
                  <button
                    className="btn btn-danger"
                    style={{ padding: "6px 12px", fontSize: "13px", margin: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(item.id);
                    }}
                  >
                    Delete
                  </button>
                )}
                <span style={{ color: "var(--text-secondary)", fontSize: "18px", transition: "transform 0.2s", transform: expandedId === item.id ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </div>
            </div>

            {/* Expandable Details: ECG Waveform + Grad-CAM */}
            {expandedId === item.id && (
              <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border-color)" }}>
                {/* ECG Waveform */}
                {item.signal && item.signal.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <h3 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px", fontWeight: 600 }}>
                      📈 ECG Waveform (187 samples)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={item.signal.map((v, i) => ({ point: i, value: v }))}>
                        <XAxis dataKey="point" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--bg-input)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                            borderRadius: "8px"
                          }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                 {/* Clinical Explainability Dashboard */}
                 <div style={{ marginTop: "20px" }}>
                   <ClinicalExplainability 
                     predictionId={item.id} 
                     predictionLabel={item.prediction} 
                   />
                 </div>
              </div>
            )}
          </div>
        ))}

        {history.length === 0 && (
          <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
            No prediction history found for this patient.
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryTable;