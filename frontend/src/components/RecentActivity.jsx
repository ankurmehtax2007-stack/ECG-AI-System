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

function RecentActivity({ activities, onDeleteRecord }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <h2 className="card-title">🩺 Recent Predictions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {activities.map((item) => (
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
                padding: "14px 18px",
                cursor: "pointer"
              }}
              onClick={() => toggleExpand(item.id)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px" }}>
                    {conditionMap[item.prediction] || item.prediction}
                  </span>
                  {item.patient_name && (
                    <span style={{
                      fontSize: "11px",
                      color: "var(--accent-color)",
                      background: "rgba(99, 102, 241, 0.15)",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      fontWeight: 600
                    }}>
                      {item.patient_name}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Confidence: {item.confidence}% • {new Date(item.date).toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                {onDeleteRecord && (
                  <button
                    className="btn btn-danger"
                    style={{ padding: "4px 10px", fontSize: "12px", margin: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(item.id);
                    }}
                  >
                    Delete
                  </button>
                )}
                <span style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  transition: "transform 0.2s",
                  transform: expandedId === item.id ? "rotate(180deg)" : "rotate(0)"
                }}>
                  ▼
                </span>
              </div>
            </div>

            {/* Expandable: ECG Waveform + Grad-CAM */}
            {expandedId === item.id && (
              <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--border-color)" }}>
                {/* ECG Waveform */}
                {item.signal && item.signal.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <h4 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "10px", fontWeight: 600 }}>
                      📈 ECG Waveform
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={item.signal.map((v, i) => ({ point: i, value: v }))}>
                        <XAxis dataKey="point" tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 9 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--bg-input)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                            borderRadius: "8px",
                            fontSize: "12px"
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
        {activities.length === 0 && (
          <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "10px" }}>
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;