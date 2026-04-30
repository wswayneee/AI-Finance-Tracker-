import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-hero)]">
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,oklch(0.88_0.10_175)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.86_0.10_220)_0%,transparent_50%)]" />
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by AI · Bahasa Indonesia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Catat Keuangan Tanpa Ribet,{" "}
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                Cukup Ngomong Aja
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Pengeluaran & pemasukan langsung tercatat otomatis dengan AI. Tulis seperti chat, biar AI yang rapikan jadi tabel, dashboard, dan ringkasan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="hero" size="xl">
                Coba Gratis <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="xl">Lihat Demo</Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div><span className="font-semibold text-foreground">10rb+</span> pengguna</div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">4.9★</span> rating</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[image:var(--gradient-primary)] opacity-20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-chart-4/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                <span className="ml-2 text-xs text-muted-foreground">Cuanly Chat</span>
              </div>
              <div className="space-y-4 py-6">
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-[image:var(--gradient-primary)] text-primary-foreground px-4 py-2.5 max-w-[80%] text-sm shadow-sm">
                    Hari ini aku beli kopi 20k dan makan 30k
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-secondary text-secondary-foreground px-4 py-3 max-w-[85%] text-sm space-y-2">
                    <p className="font-medium">Sip, udah dicatat ✨</p>
                    <div className="rounded-lg bg-card border border-border overflow-hidden">
                      <div className="grid grid-cols-3 px-3 py-2 text-xs font-medium border-b border-border bg-muted/50">
                        <span>Item</span><span>Kategori</span><span className="text-right">Total</span>
                      </div>
                      <div className="grid grid-cols-3 px-3 py-2 text-xs">
                        <span>Kopi</span><span className="text-muted-foreground">F&B</span><span className="text-right font-medium">Rp 20.000</span>
                      </div>
                      <div className="grid grid-cols-3 px-3 py-2 text-xs border-t border-border">
                        <span>Makan</span><span className="text-muted-foreground">F&B</span><span className="text-right font-medium">Rp 30.000</span>
                      </div>
                      <div className="grid grid-cols-3 px-3 py-2 text-xs border-t border-border bg-primary/5">
                        <span className="font-semibold col-span-2">Total Hari Ini</span>
                        <span className="text-right font-semibold text-primary">Rp 50.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2.5">
                <input
                  readOnly
                  placeholder="Ketik pengeluaranmu..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
