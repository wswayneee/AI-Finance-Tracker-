import { Sparkles, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              Cuanly
            </div>
            <p className="text-sm text-muted-foreground">Catat keuangan dengan ngobrol.</p>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Produk</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#fitur" className="hover:text-foreground">Fitur</a></li>
              <li><a href="#demo" className="hover:text-foreground">Demo</a></li>
              <li><a href="#" className="hover:text-foreground">Harga</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Tentang</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Ikuti Kami</h4>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© 2026 Cuanly. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privasi</a>
            <a href="#" className="hover:text-foreground">Syarat</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
