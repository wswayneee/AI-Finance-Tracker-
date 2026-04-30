import { ArrowRight } from "lucide-react";

export function Demo() {
  return (
    <section id="demo" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Lihat Aksinya</h2>
          <p className="mt-4 text-muted-foreground">Satu kalimat, langsung jadi data terstruktur.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-medium text-muted-foreground mb-3">INPUT</div>
            <div className="rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground px-5 py-4 text-base">
              "Hari ini kopi 20k, makan 30k, grab 15k"
            </div>
          </div>

          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary mx-auto">
            <ArrowRight className="h-5 w-5" />
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-soft)]">
            <div className="text-xs font-medium text-muted-foreground p-6 pb-3">OUTPUT</div>
            <div className="px-2 pb-2">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="grid grid-cols-3 px-4 py-2.5 text-xs font-medium bg-muted/50 border-b border-border">
                  <span>Item</span><span>Kategori</span><span className="text-right">Total</span>
                </div>
                {[
                  ["Kopi", "F&B", "Rp 20.000"],
                  ["Makan", "F&B", "Rp 30.000"],
                  ["Grab", "Transport", "Rp 15.000"],
                ].map((r, i) => (
                  <div key={i} className="grid grid-cols-3 px-4 py-2.5 text-sm border-b border-border last:border-0">
                    <span>{r[0]}</span>
                    <span className="text-muted-foreground">{r[1]}</span>
                    <span className="text-right font-medium">{r[2]}</span>
                  </div>
                ))}
                <div className="grid grid-cols-3 px-4 py-3 text-sm bg-primary/5">
                  <span className="font-semibold col-span-2">Total Hari Ini</span>
                  <span className="text-right font-semibold text-primary">Rp 65.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
