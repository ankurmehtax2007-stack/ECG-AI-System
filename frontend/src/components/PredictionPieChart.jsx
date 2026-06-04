import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = {
  "Normal Beat": "#10b981",
  "Supraventricular Beat": "#f59e0b",
  "Ventricular Beat": "#f43f5e",
  "Fusion Beat": "#a855f7",
  "Unknown Beat": "#64748b"
};

function PredictionPieChart({ distribution }) {
  const data = Object.keys(distribution).map(key => ({
    name: key,
    value: distribution[key]
  }));

  return (
    <div className="card">
      <h2 className="card-title">Prediction Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#3b82f6"} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--bg-input)", 
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: "8px"
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionPieChart;