import { ArrowRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const rows = [
  { item: "Kopi", cat: "F&B", type: "expense", amount: "Rp 20.000" },
  { item: "Makan", cat: "F&B", type: "expense", amount: "Rp 30.000" },
  { item: "Gaji", cat: "Income", type: "income", amount: "Rp 5.000.000" },
] as const;

export function Demo() {
  return (
    <section id="demo" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Lihat Aksinya</h2>
          <p className="mt-4 text-muted-foreground">Satu kalimat, langsung jadi data terstruktur — pemasukan & pengeluaran sekaligus.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-medium text-muted-foreground mb-3">INPUT</div>
            <div className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-4 text-base">
              "Hari ini kopi 20k, makan 30k, gaji 5 juta"
            </div>
          </div>

          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary mx-auto">
            <ArrowRight className="h-5 w-5" />
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-soft)]">
            <div className="text-xs font-medium text-muted-foreground p-6 pb-3">OUTPUT</div>
            <div className="px-2">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2.5 text-xs font-medium bg-muted/50 border-b border-border">
                  <span>Item</span><span>Kategori</span><span className="text-right">Total</span>
                </div>
                {rows.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2.5 text-sm border-b border-border last:border-0 items-center">
                    <span className="flex items-center gap-1.5">
                      {r.type === "income" ? (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-income" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-expense" />
                      )}
                      {r.item}
                    </span>
                    <span className="text-muted-foreground">{r.cat}</span>
                    <span className={`text-right font-medium ${r.type === "income" ? "text-income" : "text-expense"}`}>
                      {r.type === "income" ? "+" : "−"} {r.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              <div className="rounded-lg bg-income-soft p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Income</div>
                <div className="text-sm font-semibold text-income">Rp 5.000.000</div>
              </div>
              <div className="rounded-lg bg-expense-soft p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Expense</div>
                <div className="text-sm font-semibold text-expense">Rp 50.000</div>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Balance</div>
                <div className="text-sm font-semibold text-primary">Rp 4.950.000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
