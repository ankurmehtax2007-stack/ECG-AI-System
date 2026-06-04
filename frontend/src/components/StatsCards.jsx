function StatsCards({ stats }) {
  return (
    <div className="grid-3">
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
          Registered Patients
        </h3>
        <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0 }}>
          {stats.total_patients}
        </h1>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
          Total Inferences
        </h3>
        <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0 }}>
          {stats.total_predictions}
        </h1>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "14px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
          High Risk Cases
        </h3>
        <h1 className="high-risk" style={{ fontSize: "36px", fontWeight: "800", margin: 0 }}>
          {stats.high_risk_cases}
        </h1>
      </div>
    </div>
  );
}

export default StatsCards;