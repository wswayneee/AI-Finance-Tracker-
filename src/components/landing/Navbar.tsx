import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2 font-semibold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          Cuanly
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#cara" className="hover:text-foreground transition-colors">Cara Kerja</a>
          <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
          <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
          <a href="#manfaat" className="hover:text-foreground transition-colors">Manfaat</a>
        </nav>
        <Button variant="hero" size="sm">Coba Gratis</Button>
      </div>
    </header>
  );
}
