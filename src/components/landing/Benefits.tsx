import { Zap, MousePointer2Off, GraduationCap, Clock } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Lebih cepat dari Excel", desc: "Catat dalam detik, bukan menit." },
  { icon: MousePointer2Off, title: "Tanpa input manual", desc: "Gak perlu pilih dropdown atau isi kolom." },
  { icon: GraduationCap, title: "Cocok untuk pemula", desc: "Gak butuh pengetahuan finansial." },
  { icon: Clock, title: "Hemat waktu", desc: "Lebih banyak waktu buat hal yang penting." },
];

export function Benefits() {
  return (
    <section id="manfaat" className="py-24 bg-[image:var(--gradient-soft)]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Kenapa Pilih Cuanly?</h2>
          <p className="mt-4 text-muted-foreground">Bikin nyatet keuangan jadi sesimpel kirim pesan.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-[var(--shadow-soft)] transition-all">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground mb-4">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
