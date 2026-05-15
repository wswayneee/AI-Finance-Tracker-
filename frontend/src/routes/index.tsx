import { createFileRoute } from "@tanstack/react-router";
import { Demo, Transaction } from "@/components/landing/Demo";
import { Dashboard } from "@/components/landing/Dashboard";
import { useState, useEffect, useRef } from "react";
import { Moon, Sun, LayoutGrid, PlusCircle, History as HistoryIcon, User } from "lucide-react";
import { toast } from "sonner";
import { WigladsLogo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase";
import { Auth } from "@/components/landing/Auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Wiglads — Control Your Money, Control Your Life" },
      { name: "description", content: "Catat pengeluaran harian pakai bahasa sehari-hari. AI otomatis ubah jadi tabel, kategori, dan ringkasan keuangan." },
      { property: "og:title", content: "Wiglads — AI Finance Tracker" },
      { property: "og:description", content: "Input pengeluaran semudah chat, AI yang rapikan." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" },
    ],
  }),
});

const initialData: Transaction[] = [
  { item: "Gaji Bulanan", cat: "Income", type: "income", amount: 7500000, date: new Date().toISOString() },
  { item: "Freelance UI Design", cat: "Income", type: "income", amount: 2000000, date: new Date().toISOString() },
  { item: "Dana Darurat", cat: "Tabungan", type: "expense", amount: 1500000, date: new Date().toISOString() },
  { item: "Investasi Bibit", cat: "Investasi", type: "expense", amount: 1000000, date: new Date().toISOString() },
  { item: "Kosan", cat: "Sewa", type: "expense", amount: 1500000, date: new Date().toISOString() },
  { item: "Bulanan Orang Tua", cat: "Bulanan Orang Tua", type: "expense", amount: 1000000, date: new Date().toISOString() },
  { item: "Starbucks Coffee", cat: "Kopi & Cemilan", type: "expense", amount: 55000, date: new Date().toISOString() },
  { item: "Nasi Goreng Pak Kumis", cat: "F&B (Makan/Minum)", type: "expense", amount: 25000, date: new Date().toISOString() },
  { item: "Gojek Ride", cat: "Transportasi", type: "expense", amount: 15000, date: new Date().toISOString() },
  { item: "Netflix Subscription", cat: "Langganan Aplikasi", type: "expense", amount: 186000, date: new Date().toISOString() },
  { item: "Internet (Indihome)", cat: "Kuota Internet", type: "expense", amount: 350000, date: new Date().toISOString() },
];

function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch from Supabase
  useEffect(() => {
    async function fetchData() {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTransactions(data);
      }
      setIsLoading(false);
    }
    if (session) {
      fetchData();
    } else {
      setTransactions([]);
    }
  }, [session]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("wiglads_dark") === "true";
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState("input");

  const demoRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("wiglads_dark", isDark.toString());
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleAddTransactions = async (newTxs: Transaction[]) => {
    if (!session?.user) return;
    const txsWithUser = newTxs.map(t => ({ ...t, user_id: session.user.id }));
    const { data, error } = await supabase
      .from('transactions')
      .insert(txsWithUser)
      .select();

    if (!error && data) {
      setTransactions((prev) => {
        const updated = [...data, ...prev];
        return updated;
      });
      toast.success("Transaksi berhasil ditambahkan!");
    } else if (error) {
      console.error("Gagal menyimpan ke Supabase:", error);
      toast.error("Gagal menyimpan data ke database. Cek console untuk detailnya.");
    }

    // Scroll to dashboard after adding
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
      setActiveTab("dashboard");
    }, 500);
  };

  const handleDeleteTransaction = async (index: number) => {
    const txToDelete = transactions[index];
    if (txToDelete && txToDelete.id) {
      await supabase.from("transactions").delete().eq("id", txToDelete.id);
      toast.success("Transaksi berhasil dihapus.");
    }
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const scrollTo = (ref: any, tab: string) => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout.");
  };

  if (!session || isRecoveringPassword) {
    return <Auth onAuthSuccess={() => setIsRecoveringPassword(false)} isRecoveryMode={isRecoveringPassword} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center transition-colors duration-300 pb-24 md:pb-0">
      {/* Desktop Mode Toggle & Logout */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 hidden md:flex">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-3 rounded-full bg-white dark:bg-card border border-border text-foreground hover:bg-muted transition-all shadow-lg backdrop-blur-md"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-white dark:bg-card border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg backdrop-blur-md"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <main className="w-full max-w-[95%] px-6 py-8 md:py-16 space-y-16">
        <div className="relative text-center space-y-8 pt-4 flex flex-col items-center">
          {/* Floating 'Wow' Illustrations */}
          <div className="absolute -left-32 top-0 w-64 h-64 md:w-[32rem] md:h-[32rem] opacity-30 md:opacity-50 pointer-events-none animate-float hidden lg:block" style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)' }}>
            <img src="/hero_floating_assets.png" alt="Floating Assets" className="w-full h-full object-contain mix-blend-lighten scale-150 blur-[2px] brightness-110" />
          </div>
          <div className="absolute -right-32 top-10 w-64 h-64 md:w-[32rem] md:h-[32rem] opacity-30 md:opacity-50 pointer-events-none animate-float-reverse hidden lg:block" style={{ maskImage: 'radial-gradient(circle, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)' }}>
            <img src="/hero_digital_wallet.png" alt="Digital Wallet" className="w-full h-full object-contain mix-blend-lighten scale-150 blur-[2px] brightness-110" />
          </div>


          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-2 relative z-10">
            ✨ AI Financial Assistant
          </div>
          <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <WigladsLogo className="h-20 md:h-24" showText={false} />
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter flex items-center justify-center gap-2">
              <span className="text-gradient">Wiglads</span><span className="text-primary animate-pulse">.</span>
            </h1>
          </div>
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <p className="text-foreground text-lg md:text-2xl font-black tracking-tight leading-none uppercase">
              Financial Freedom starts here.
            </p>
            <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
              Level up finansialmu dengan AI. Catat transaksi segampang kirim DM, <br className="hidden md:block" />
              pantau cuan tanpa ribet. Your personal AI financial co-pilot.
            </p>
          </div>
        </div>

        <div className="space-y-20">
          <div ref={demoRef} id="input-section">
            <Demo onAdd={handleAddTransactions} />
          </div>
          <div ref={dashboardRef} id="dashboard-section">
            <Dashboard 
              transactions={transactions} 
              onClearAll={async () => {
                if (confirm("Apakah Anda yakin ingin menghapus SEMUA transaksi? Data yang sudah dihapus tidak bisa dikembalikan.")) {
                  await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
                  setTransactions([]);
                  toast.success("Semua transaksi berhasil direset.");
                }
              }}
              onDeleteOne={handleDeleteTransaction}
              onLogout={handleLogout}
            />

          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-xl border-t border-border px-6 py-3 flex items-center justify-between md:hidden pb-[env(safe-area-inset-bottom)]">
        <button 
          onClick={() => scrollTo(dashboardRef, "dashboard")}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "dashboard" ? "text-primary" : "text-muted-foreground"}`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase">Stats</span>
        </button>
        
        <button 
          onClick={() => scrollTo(demoRef, "input")}
          className="relative -top-8 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 flex items-center justify-center border-4 border-background transition-transform active:scale-90"
        >
          <PlusCircle className="h-7 w-7" />
        </button>

        <button 
          onClick={() => setIsDark(!isDark)}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="text-[10px] font-bold uppercase">{isDark ? "Light" : "Dark"}</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-rose-500"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase">Logout</span>
        </button>
      </div>

      <footer className="py-12 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-t border-border w-full bg-muted/20 hidden md:block">
        <p>© 2026 Wiglads — Your Smart Finance Buddy</p>
      </footer>
    </div>
  );
}
