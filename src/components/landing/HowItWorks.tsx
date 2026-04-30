import { MessageSquare, Brain, Table2 } from "lucide-react";

const steps = [
  { icon: MessageSquare, title: "Tulis seperti chat", desc: "Cukup ketik pengeluaranmu pakai bahasa sehari-hari." },
  { icon: Brain, title: "AI memahami & mengelompokkan", desc: "AI otomatis baca jumlah, item, dan kategori." },
  { icon: Table2, title: "Jadi tabel & ringkasan", desc: "Data langsung tersusun rapi siap dianalisis." },
];

export function HowItWorks() {
  return (
    <section id="cara" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Cara Kerjanya</h2>
          <p className="mt-4 text-muted-foreground">Tiga langkah simpel buat ngerapihin keuanganmu.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-6 right-6 text-5xl font-bold text-muted/40">0{i + 1}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground mb-5">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
