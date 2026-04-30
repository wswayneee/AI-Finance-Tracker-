import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Demo } from "@/components/landing/Demo";
import { Benefits } from "@/components/landing/Benefits";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cuanly — Catat Keuangan Tanpa Ribet, Cukup Ngomong Aja" },
      { name: "description", content: "Catat pengeluaran harian pakai bahasa sehari-hari. AI otomatis ubah jadi tabel, kategori, dan ringkasan keuangan." },
      { property: "og:title", content: "Cuanly — Catat Keuangan dengan AI" },
      { property: "og:description", content: "Tulis pengeluaran seperti chat, AI yang rapikan." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
