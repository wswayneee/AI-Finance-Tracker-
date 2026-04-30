import { Zap, MousePointer2Off, Pencil, History, Filter } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Lebih cepat dari Excel", desc: "Catat dalam detik, bukan menit." },
  { icon: MousePointer2Off, title: "Tanpa input manual", desc: "Gak perlu pilih dropdown atau isi kolom." },
  { icon: Pencil, title: "Edit & hapus mudah", desc: "Salah catat? Tinggal klik, beres." },
  { icon: History, title: "Tercatat rapi dengan history", desc: "Setiap transaksi punya jejak waktu lengkap." },
  { icon: Filter, title: "Mudah difilter & dianalisis", desc: "Filter tanggal, kategori, atau tipe transaksi." },
];

export function Benefits() {
  return (
    <section id="manfaat" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Kenapa Pilih Cuanly?</h2>
          <p className="mt-4 text-muted-foreground">Bikin nyatet keuangan jadi sesimpel kirim pesan.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
