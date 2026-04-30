import { Wallet, TrendingUp, TrendingDown, Pencil, Trash2, Calendar, Filter, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const transactions = [
  { item: "Gaji Bulanan", cat: "Income", type: "income", amount: 5000000, time: "Hari ini, 09:12" },
  { item: "Kopi Pagi", cat: "F&B", type: "expense", amount: 20000, time: "Hari ini, 08:30" },
  { item: "Makan Siang", cat: "F&B", type: "expense", amount: 35000, time: "Hari ini, 12:45" },
  { item: "Grab ke Kantor", cat: "Transport", type: "expense", amount: 18000, time: "Kemarin, 17:20" },
  { item: "Freelance Project", cat: "Income", type: "income", amount: 1500000, time: "Kemarin, 14:00" },
];

const categories = [
  { name: "F&B", pct: 42, color: "var(--primary)" },
  { name: "Transport", pct: 24, color: "var(--sky)" },
  { name: "Hiburan", pct: 18, color: "var(--primary-glow)" },
  { name: "Lainnya", pct: 16, color: "var(--accent-foreground)" },
];

const trend = [30, 45, 38, 60, 48, 72, 55];

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

export function Dashboard() {
  return (
    <section id="dashboard" className="py-24 bg-[image:var(--gradient-soft)]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard yang Bikin Tenang</h2>
          <p className="mt-4 text-muted-foreground">Semua data keuanganmu tampil rapi — saldo, tren, kategori, sampai history.</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -inset-6 bg-[image:var(--gradient-primary)] opacity-10 blur-3xl rounded-full -z-10" />
          <div className="rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-chart-4/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                <span className="ml-2 text-xs text-muted-foreground">Cuanly Dashboard</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Oktober 2026
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stat cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Balance</span>
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">Rp 6.427.000</div>
                  <div className="mt-1 text-xs text-muted-foreground">+12,4% dari bulan lalu</div>
                </div>
                <div className="rounded-2xl bg-income-soft p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-income uppercase tracking-wide">Total Income</span>
                    <TrendingUp className="h-4 w-4 text-income" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-income">Rp 6.500.000</div>
                  <div className="mt-1 text-xs text-muted-foreground">2 transaksi bulan ini</div>
                </div>
                <div className="rounded-2xl bg-expense-soft p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-expense uppercase tracking-wide">Total Expense</span>
                    <TrendingDown className="h-4 w-4 text-expense" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-expense">Rp 73.000</div>
                  <div className="mt-1 text-xs text-muted-foreground">3 transaksi bulan ini</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-5 gap-4">
                {/* Donut */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Kategori Pengeluaran</h3>
                  </div>
                  <div className="flex items-center gap-5">
                    <div
                      className="relative h-32 w-32 rounded-full"
                      style={{
                        background: `conic-gradient(${categories[0].color} 0% 42%, ${categories[1].color} 42% 66%, ${categories[2].color} 66% 84%, ${categories[3].color} 84% 100%)`,
                      }}
                    >
                      <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">Total</span>
                        <span className="text-sm font-semibold">Rp 73K</span>
                      </div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {categories.map((c) => (
                        <li key={c.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                            {c.name}
                          </span>
                          <span className="font-medium text-foreground">{c.pct}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Line/area chart */}
                <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Tren Mingguan</h3>
                    <span className="text-xs text-muted-foreground">7 hari terakhir</span>
                  </div>
                  <svg viewBox="0 0 280 100" className="w-full h-32">
                    <defs>
                      <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.14 165)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="oklch(0.72 0.14 165)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const max = Math.max(...trend);
                      const pts = trend.map((v, i) => [i * (280 / (trend.length - 1)), 100 - (v / max) * 80] as const);
                      const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
                      const area = `${path} L280,100 L0,100 Z`;
                      return (
                        <>
                          <path d={area} fill="url(#areaFill)" />
                          <path d={path} fill="none" stroke="oklch(0.72 0.14 165)" strokeWidth="2" />
                          {pts.map((p, i) => (
                            <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="oklch(0.72 0.14 165)" />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((d) => <span key={d}>{d}</span>)}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                  <Filter className="h-3.5 w-3.5" /> Filter:
                </div>
                {["Hari ini", "Minggu", "Bulan"].map((f, i) => (
                  <button key={f} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${i === 1 ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {f}
                  </button>
                ))}
                <span className="mx-1 h-4 w-px bg-border" />
                {["Semua", "Income", "Expense"].map((f, i) => (
                  <button key={f} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${i === 0 ? "bg-accent text-accent-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {f}
                  </button>
                ))}
                <span className="mx-1 h-4 w-px bg-border" />
                {["F&B", "Transport", "Hiburan"].map((f) => (
                  <button key={f} className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
                    {f}
                  </button>
                ))}
              </div>

              {/* Transactions table */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr_auto] gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
                  <span>Transaksi</span>
                  <span>Kategori</span>
                  <span className="text-right">Jumlah</span>
                  <span>Waktu</span>
                  <span className="text-right">Aksi</span>
                </div>
                {transactions.map((t, i) => (
                  <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr_auto] gap-3 px-4 py-3 text-sm items-center border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${t.type === "income" ? "bg-income-soft text-income" : "bg-expense-soft text-expense"}`}>
                        {t.type === "income" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      </span>
                      <span className="font-medium">{t.item}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">{t.cat}</span>
                    <span className={`text-right font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "−"} {fmt(t.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">{t.time}</span>
                    <span className="flex items-center justify-end gap-1">
                      <button className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-expense-soft hover:text-expense transition-colors" aria-label="Hapus">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
