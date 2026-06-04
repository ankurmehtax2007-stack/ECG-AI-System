import {

  ResponsiveContainer,

  LineChart,

  Line,

  XAxis,

  YAxis,

  Tooltip

} from "recharts";

function TrendChart({

  history

}) {

  const chartData =
    history.map(
      (item, index) => ({

        index:
        index + 1,

        confidence:
        item.confidence
      })
    );

  return (

    <div className="card">

      <h2 className="card-title">

        Confidence Trend

      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart
          data={chartData}
        >

          <XAxis
            dataKey="index"
          />

          <YAxis />

          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--bg-input)", 
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: "8px"
            }} 
          />

          <Line

            type="monotone"

            dataKey="confidence"

            stroke="#38bdf8"

            strokeWidth={3}

            dot={{ fill: "#38bdf8", r: 5 }}

            activeDot={{ r: 8 }}

          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default TrendChart;