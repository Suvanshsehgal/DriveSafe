import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-dark-card/90 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/60 mb-1 font-body">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-mono font-body">
          {entry.name}: {(entry.value * 100).toFixed(0)}%
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsChart({ data = [] }) {
  // Default data if none provided
  const chartData = data.length > 0 ? data : Array.from({ length: 20 }, (_, i) => ({
    time: `${i}s`,
    road: 0.32,
    driver: 0.18,
    fused: 0.26
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6"
      style={{ boxShadow: "0 0 30px rgba(0, 212, 255, 0.05)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#00d4ff",
            boxShadow: "0 0 8px #00d4ff",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        />
        <span className="text-xs text-white/60 uppercase tracking-widest font-medium font-body">Analytics — Rolling Trends</span>
      </div>

      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              domain={[0, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="road"
              name="Road Score"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="driver"
              name="Driver Score"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="fused"
              name="Fused Score"
              stroke="#00d4ff"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#00d4ff", strokeWidth: 0 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
