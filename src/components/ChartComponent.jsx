import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ChartComponent = ({ title, subtitle, data, xKey, lines }) => (
  <div className="rounded-3xl bg-white p-6 shadow-card">
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-secondary">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey={xKey} stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={3}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartComponent;

