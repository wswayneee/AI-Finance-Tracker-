import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-12 md:p-16 text-center shadow-[var(--shadow-glow)]">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0%,transparent_40%),radial-gradient(circle_at_80%_80%,white_0%,transparent_40%)]" />
          <div className="relative max-w-2xl mx-auto text-primary-foreground">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Mulai Kelola Keuanganmu Sekarang
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg">
              Gratis untuk dicoba. Tanpa kartu kredit.
            </p>
            <div className="mt-8">
              <Button size="xl" className="bg-card text-foreground hover:bg-card/90 shadow-lg">
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
