import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer

} from "recharts";

function ECGChart({

  signal

}) {

  const data =
    signal.map(

      (value, index) => ({

        point: index,

        value
      })
    );

  return (

    <div className="card">

      <h2 className="card-title">

        ECG Waveform

      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={data}>

          <XAxis
            dataKey="point"
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

            dataKey="value"

            stroke="#10b981"

            strokeWidth={2}

            dot={false}

          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ECGChart;