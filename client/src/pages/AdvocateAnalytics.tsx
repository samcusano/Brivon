import { useQuery } from "@tanstack/react-query";
import { Trophy, Clock, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdvocateAnalyticsData {
  totalCases: number;
  statusBreakdown: Record<string, number>;
  winRate: number;
  avgDaysToApproval: number | null;
  insurerStats: {
    name: string;
    total: number;
    won: number;
    winRate: number;
    avgDaysToResolution: number | null;
  }[];
  monthlyVolume: {
    month: string;
    total: number;
    won: number;
    lost: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#d1cdc9",
  generating: "#93c5fd",
  ready: "#fcd34d",
  approved: "#c4b5a0",
  submitted: "#86efac",
  won: "#4ade80",
  lost: "#f87171",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Queued",
  generating: "Generating",
  ready: "Needs review",
  approved: "Approved",
  submitted: "Submitted",
  won: "Won",
  lost: "Lost",
};

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export default function AdvocateAnalytics() {
  const { data, isLoading } = useQuery<AdvocateAnalyticsData>({
    queryKey: ["/api/advocate/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/advocate/analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pieData = Object.entries(data.statusBreakdown)
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
      color: STATUS_COLORS[status] ?? "#d1cdc9",
    }));

  const barData = data.monthlyVolume.map((m) => ({
    month: formatMonth(m.month),
    Total: m.total,
    Won: m.won,
    Lost: m.lost,
  }));

  return (
    <div className="px-6 py-6 space-y-8 max-w-5xl">
      <h1 className="text-xl font-heading font-semibold">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<BarChart3 className="w-4 h-4" />}
          label="Total cases"
          value={data.totalCases.toString()}
        />
        <KpiCard
          icon={<Trophy className="w-4 h-4" />}
          label="Win rate"
          value={`${data.winRate}%`}
          highlight={data.winRate >= 50}
        />
        <KpiCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Cases won"
          value={(data.statusBreakdown["won"] ?? 0).toString()}
        />
        <KpiCard
          icon={<Clock className="w-4 h-4" />}
          label="Avg days to approval"
          value={data.avgDaysToApproval !== null ? `${data.avgDaysToApproval}d` : "—"}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly volume bar chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground mb-4">Monthly volume</p>
          {barData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No monthly data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="Total" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Won" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status donut */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground mb-4">Status breakdown</p>
          {pieData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insurer leaderboard */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-foreground">Insurer performance</p>
        </div>
        {data.insurerStats.length === 0 ? (
          <p className="text-sm text-muted-foreground px-5 py-8 text-center">No insurer data yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-medium">Insurer</th>
                <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-medium">Cases</th>
                <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-medium">Won</th>
                <th className="text-right px-5 py-2.5 text-xs text-muted-foreground font-medium">Win rate</th>
                <th className="text-right px-5 py-2.5 text-xs text-muted-foreground font-medium">Avg days</th>
              </tr>
            </thead>
            <tbody>
              {data.insurerStats.map((ins, i) => (
                <tr key={ins.name} className={cn(i < data.insurerStats.length - 1 && "border-b border-border/50")}>
                  <td className="px-5 py-3 font-medium text-foreground">{ins.name}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{ins.total}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{ins.won}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={cn(
                      "font-semibold",
                      ins.winRate >= 50 ? "text-green-600" : ins.winRate > 0 ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {ins.won + (ins.total - ins.won) > 0 ? `${ins.winRate}%` : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {ins.avgDaysToResolution !== null ? `${ins.avgDaysToResolution}d` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={cn("text-2xl font-semibold", highlight && "text-green-600")}>{value}</p>
    </div>
  );
}
