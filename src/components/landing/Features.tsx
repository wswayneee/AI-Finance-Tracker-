import { MessageCircle, Tags, BarChart3, LayoutDashboard } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Natural Language Input", desc: "Tulis pengeluaran kayak chat ke temen — gak perlu form ribet." },
  { icon: Tags, title: "Auto Categorization", desc: "AI otomatis kelompokin ke makanan, transport, hiburan, dll." },
  { icon: BarChart3, title: "Smart Summary", desc: "Ringkasan harian, mingguan, bulanan dalam sekejap." },
  { icon: LayoutDashboard, title: "Clean Dashboard", desc: "Tampilan rapi & minimalis biar enak dilihat tiap hari." },
];

export function Features() {
  return (
    <section id="fitur" className="py-24 bg-[image:var(--gradient-soft)]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Fitur Andalan</h2>
          <p className="mt-4 text-muted-foreground">Semua yang kamu butuhin buat tracking cuan tanpa drama.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-soft)] hover:border-primary/30 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
