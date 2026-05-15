import { Wallet, TrendingUp, TrendingDown, History, PieChart, Activity, ChevronLeft, ChevronRight, CheckSquare, Sparkles, Download, Edit2, ArrowDownLeft, ArrowUpRight, Trash2, Search, Calendar, Eye, EyeOff, LogOut } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Transaction } from "./Demo";
import { getAIInsightsFn } from "@/lib/ai";


export function Dashboard({ transactions = [], onClearAll, onDeleteOne, onLogout }: { transactions?: Transaction[], onClearAll?: () => void, onDeleteOne?: (index: number) => void, onLogout?: () => void }) {


  const [viewDate, setViewDate] = useState(new Date());
  const [aiInsight, setAiInsight] = useState<string>("Sedang menganalisis datamu...");
  const [paydayDay, setPaydayDay] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("wiglads_payday") : null;
    return saved ? parseInt(saved) : 25;
  });
  const [isEditingPayday, setIsEditingPayday] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  // Budgets state with localStorage persistence
  const [budgets, setBudgets] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("wiglads_budgets") : null;
    if (saved) return JSON.parse(saved);
    return {
      summary: { income: 5000000, saving: 2020000, expense: 2980000 },
      savingItems: { "Dana Darurat": 1000000, "Investasi": 1020000 },
      expenseItems: { "Kosan": 500000, "Bulanan Orang Tua": 1000000, "Persepuluhan": 500000, "Jajan": 1000000, "Internet": 130000, "Groceries": 400000, "Transport": 150000, "Skincare": 100000 }
    };
  });

  const [showBalances, setShowBalances] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("wiglads_show_balances") : null;
    return saved !== null ? saved === "true" : true;
  });

  const toggleBalances = () => {
    const newVal = !showBalances;
    setShowBalances(newVal);
    localStorage.setItem("wiglads_show_balances", newVal.toString());
  };

  const fmt = (n: number) => {
    if (!showBalances) return "Rp ••••••";
    return "Rp " + n.toLocaleString("id-ID");
  };

  const updateBudget = (section: 'summary' | 'savingItems' | 'expenseItems', key: string, value: number) => {
    const newBudgets = {
      ...budgets,
      [section]: {
        ...budgets[section as keyof typeof budgets],
        [key]: value
      }
    };
    setBudgets(newBudgets);
    localStorage.setItem("wiglads_budgets", JSON.stringify(newBudgets));
  };


  const selectedMonth = viewDate.getMonth();
  const selectedYear = viewDate.getFullYear();

  const handleSavePayday = (val: string) => {
    const d = parseInt(val);
    if (d >= 1 && d <= 31) {
      setPaydayDay(d);
      localStorage.setItem("wiglads_payday", d.toString());
      setIsEditingPayday(false);
    }
  };

  const cycleInfo = useMemo(() => {
    // If we are looking at May 2026, the cycle is April 25 to May 24
    const startDate = new Date(selectedYear, selectedMonth - 1, paydayDay);
    const endDate = new Date(selectedYear, selectedMonth, paydayDay - 1, 23, 59, 59);
    
    const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' });
    return {
      start: startDate,
      end: endDate,
      label: `${fmtDate(startDate)} - ${fmtDate(endDate)}`
    };
  }, [selectedMonth, selectedYear, paydayDay]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date);
      const isInCycle = d >= cycleInfo.start && d <= cycleInfo.end;
      const matchesSearch = t.item.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.cat === filterCategory;
      
      return isInCycle && matchesSearch && matchesCategory;
    });
  }, [transactions, cycleInfo, searchQuery, filterCategory]);



  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredTransactions.length > 0) {
        getAIInsightsFn({ data: filteredTransactions.slice(0, 15) } as any).then(res => {
          if (res.success) {
            setAiInsight(res.text || "");
          } else if (res.error?.includes("429")) {
            setAiInsight("Wiglads AI sedang istirahat sejenak (kuota limit). Saran akan muncul kembali dalam beberapa menit!");
          }
        }).catch(() => {
          setAiInsight("Gagal terhubung dengan asisten AI. Coba cek koneksi internetmu.");
        });
      } else {
        setAiInsight("Belum ada transaksi bulan ini. Mulai catat untuk dapat saran!");
      }
    }, 2000); // Wait 2 seconds before calling AI to save quota

    return () => clearTimeout(timer);
  }, [filteredTransactions.length]); // Only trigger when the number of transactions changes


  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    let saving = 0;
    const trendMap: Record<string, number> = {};
    const cycleDays: string[] = [];
    const catMap: Record<string, number> = {};
    const catLastDate: Record<string, string> = {};
    const itemMap: Record<string, number> = {};
    const savingMap: Record<string, number> = {};
    const tempDate = new Date(cycleInfo.start);
    while (tempDate <= cycleInfo.end) {
      cycleDays.push(tempDate.toISOString().split('T')[0]);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    filteredTransactions.forEach(t => {
      const cat = t.cat;
      const catLower = cat.toLowerCase();
      const item = t.item;
      const isSaving = catLower.includes("tabung") || catLower.includes("invest") || catLower.includes("saving") || catLower.includes("dana darurat") || item.toLowerCase().includes("invest");
      
      if (t.type === "income") {
        income += t.amount;
      } else if (isSaving) {
        saving += t.amount;
        savingMap[item] = (savingMap[item] || 0) + t.amount;
      } else {
        expense += t.amount;
        catMap[cat] = (catMap[cat] || 0) + t.amount;
        itemMap[item] = (itemMap[item] || 0) + t.amount;
        
        if (t.date) {
          trendMap[t.date] = (trendMap[t.date] || 0) + t.amount;
        }

        // Track latest date for this category
        if (t.date && (!catLastDate[cat] || t.date > catLastDate[cat])) {
          catLastDate[cat] = t.date;
        }
      }
    });

    const trendData = cycleDays.map(date => ({
      date,
      amount: trendMap[date] || 0,
      label: date.split('-')[2]
    }));

    const maxDailySpend = Math.max(...Object.values(trendMap), 1);
    const heatmapData = cycleDays.map(date => ({
      date,
      intensity: trendMap[date] ? Math.max(0.1, (trendMap[date] / maxDailySpend)) : 0,
      amount: trendMap[date] || 0
    }));

    const categories = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], i) => {
        const colors = ["#1e3a8a", "#1e40af", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#172554"];
        return {
          name,
          amount,
          lastDate: catLastDate[name],
          pct: expense > 0 ? Math.round((amount / expense) * 100) : 0,
          color: colors[i % colors.length]
        };
      });

    // Health Score & Projection Logic
    const savingsRatio = income > 0 ? (saving / income) * 100 : 0;
    let grade = "D";
    let statusColor = "text-red-500";
    if (savingsRatio >= 30) { grade = "A"; statusColor = "text-emerald-500"; }
    else if (savingsRatio >= 20) { grade = "B"; statusColor = "text-blue-500"; }
    else if (savingsRatio >= 10) { grade = "C"; statusColor = "text-yellow-500"; }

    // Daily Burn Rate & Projection
    const daysElapsed = Math.max(1, Math.floor((new Date().getTime() - cycleInfo.start.getTime()) / (1000 * 60 * 60 * 24)));
    const daysTotal = 30; // Average
    const daysRemaining = Math.max(0, daysTotal - daysElapsed);
    const avgDailySpend = expense / daysElapsed;
    const projectedRemainingSpend = avgDailySpend * daysRemaining;
    const isSafe = (income - saving - expense) > projectedRemainingSpend;
    const dailyRemaining = Math.max(0, Math.round(((income - saving - expense) - projectedRemainingSpend) / Math.max(1, daysRemaining)));

    return { 
      income, expense, saving, 
      balance: income - expense - saving, 
      categories, itemMap, savingMap, trendData, heatmapData,
      health: { grade, statusColor, savingsRatio },
      projection: { isSafe, projectedRemainingSpend, daysRemaining, dailyRemaining }
    };
  }, [filteredTransactions, cycleInfo]);


  const monthName = viewDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" });

  const nextMonth = () => setViewDate(new Date(selectedYear, selectedMonth + 1));
  const prevMonth = () => setViewDate(new Date(selectedYear, selectedMonth - 1));

  // Helper for progress bars
  const ProgressBar = ({ value, budget, color = "bg-primary" }: { value: number, budget: number, color?: string }) => {
    const pct = budget > 0 ? Math.min((value / budget) * 100, 100) : 0;
    return (
      <div className="w-full h-2.5 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  function ComparisonBar({ label, actual, budget, color, onEdit, hideBudgetText, hideLabel }: { label: string, actual: number, budget: number, color: string, onEdit?: (val: number) => void, hideBudgetText?: boolean, hideLabel?: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const pct = budget > 0 ? Math.min((actual / budget) * 100, 100) : 0;
    
    // Helper to format currency in input
    const [localVal, setLocalVal] = useState(budget.toLocaleString("id-ID"));

    useEffect(() => {
      setLocalVal(budget.toLocaleString("id-ID"));
    }, [budget]);

    return (
      <div className="space-y-4 group">
        {!hideLabel && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <span className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate pr-2">
              {label}
            </span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={hideBudgetText ? "text-sm font-black text-foreground" : "text-[10px] font-black text-muted-foreground"}>
                {fmt(actual)} {!hideBudgetText && <span className="opacity-30">/</span>}
              </span>
              {!hideBudgetText && (
                isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="font-black text-foreground text-xs">Rp</span>
                    <input 
                      type="text"
                      value={localVal}
                      autoFocus
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) setLocalVal("");
                        else setLocalVal(new Intl.NumberFormat("id-ID").format(parseInt(val)));
                      }}
                      onBlur={() => {
                        const clean = localVal.replace(/\./g, "");
                        onEdit?.(parseInt(clean) || 0);
                        setIsEditing(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const clean = localVal.replace(/\./g, "");
                          onEdit?.(parseInt(clean) || 0);
                          setIsEditing(false);
                        }
                      }}
                      className="w-28 bg-primary/10 border-b-2 border-primary px-1 outline-none text-right font-black text-foreground text-xs"
                    />
                  </div>
                ) : (
                  <button 
                    onClick={() => onEdit && setIsEditing(true)} 
                    className={`font-black text-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs ${onEdit ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {fmt(budget)}
                    {onEdit && <Edit2 className="h-3 w-3 text-primary/60" />}
                  </button>
                )
              )}
            </div>
          </div>
      )}
        <div className="h-3 w-full bg-muted/20 rounded-full overflow-hidden border border-white/5 shadow-inner p-[1px]">
          <div 
            className="h-full transition-all duration-1000 rounded-full glow-primary" 
            style={{ 
              width: `${pct}%`, 
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}`
            }}
          />
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ["Tanggal", "Waktu", "Item", "Kategori", "Tipe", "Jumlah"];
    const rows = filteredTransactions.map(t => [
      t.date || "",
      t.time || "",
      t.item,
      t.cat,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.amount
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Wiglads_Report_${monthName.replace(" ", "_")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <section id="dashboard" className="w-full bg-transparent min-h-screen py-10 font-sans selection:bg-primary/30">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Gen Z Hero Header */}
        <div className="relative mb-8 p-8 md:p-12 rounded-[2.5rem] overflow-hidden glass-card group">

          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            {/* Health Score Meter */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className={`h-40 w-40 rounded-[2.5rem] flex items-center justify-center text-7xl font-black shadow-2xl glass-card border-2 border-white/20 z-10 ${stats.health.statusColor} glow-primary`}>
                {stats.health.grade}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-2">
                    FINANCIAL <span className="text-gradient">STATUS</span>
                  </h1>
                  <p className="text-lg text-muted-foreground font-semibold max-w-xl leading-relaxed">
                    Skor ini nunjukin kondisi dompet lo bulan ini! Makin rajin nyisihin tabungan, makin kece skornya. 🔥🚀
                  </p>
                </div>
                <button 
                  onClick={toggleBalances}
                  className="p-4 rounded-2xl glass-card hover:bg-primary/20 transition-all text-foreground glow-primary"
                  title={showBalances ? "Hide Balances" : "Show Balances"}
                >
                  {showBalances ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
                </button>
              </div>

              {/* Quick Navigation / Cycle Info */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-2xl shadow-lg border-white/10">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Siklus</span>
                  <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="hover:text-primary transition-colors"><ChevronLeft className="h-5 w-5"/></button>
                    <span className="text-sm font-black min-w-[100px] text-center">{monthName}</span>
                    <button onClick={nextMonth} className="hover:text-primary transition-colors"><ChevronRight className="h-5 w-5"/></button>
                  </div>
                </div>
                <div className="glass-card px-6 py-3 rounded-2xl shadow-lg border-white/10 flex items-center gap-3">
                   <Calendar className="h-4 w-4 text-primary" />
                   <span className="text-xs font-black uppercase tracking-tighter">{cycleInfo.label}</span>
                   {isEditingPayday ? (
                      <input 
                        type="number"
                        min="1"
                        max="31"
                        defaultValue={paydayDay}
                        onBlur={(e) => handleSavePayday(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSavePayday((e.target as HTMLInputElement).value)}
                        autoFocus
                        className="w-10 text-[10px] bg-muted/50 dark:bg-muted/10 border-none rounded px-1 focus:ring-1 focus:ring-primary outline-none text-center font-bold"
                      />
                    ) : (
                      <button onClick={() => setIsEditingPayday(true)} className="p-1 hover:bg-muted/50 rounded transition-colors group">
                        <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projection & Primary Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Prominent Projection Card */}
          <div className={`lg:col-span-4 p-8 rounded-[2.5rem] glass-card flex flex-col justify-center items-center text-center shadow-xl border-2 ${stats.projection.isSafe ? 'border-emerald-500/30' : 'border-rose-500/30'} relative overflow-hidden group`}>
            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${stats.projection.isSafe ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <Activity className={`h-12 w-12 mb-4 ${stats.projection.isSafe ? 'text-emerald-500' : 'text-rose-500'}`} />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">STATUS DOMPET</span>
            <div className={`text-4xl font-black tracking-tighter mb-4 ${stats.projection.isSafe ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stats.projection.isSafe ? "SALDO AMAN" : "SALDO KRITIS"}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-foreground">{stats.projection.daysRemaining} HARI LAGI MENUJU GAJIAN</p>
              <div className="text-[10px] font-black text-muted-foreground uppercase opacity-40">
                Limit Jajan Harian: {fmt(stats.projection.dailyRemaining)}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Income", value: stats.income, icon: <ArrowDownLeft />, color: "text-emerald-500" },
              { label: "Saving", value: stats.saving, icon: <TrendingUp />, color: "text-primary" },
              { label: "Expenses", value: stats.expense, icon: <TrendingDown />, color: "text-rose-500" },
              { label: "Balance", value: stats.balance, icon: <Wallet />, color: "text-foreground" },
            ].map((card, i) => (
              <div key={i} className="relative group overflow-hidden p-8 rounded-[2.5rem] glass-card border-white/10 hover:border-primary/50 transition-all hover:-translate-y-2 shadow-xl flex items-center gap-6">
                <div className={`h-14 w-14 rounded-2xl glass-card flex items-center justify-center text-2xl ${card.color} shadow-lg`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">{card.label}</p>
                  <h2 className={`text-3xl font-black tracking-tighter ${card.color}`}>
                    {fmt(card.value)}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mb-20">
          
          {/* Cash flow Chart */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border-white/10 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
            <h3 className="text-sm font-black text-foreground mb-10 border-l-4 border-primary pl-4 flex items-center justify-between uppercase tracking-wider relative z-10">
              Cash flow 
              <span className="flex items-center gap-2 text-[9px] text-muted-foreground font-black"><div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></div> LIVE DATA</span>
            </h3>
            <div className="space-y-12 relative z-10">
              <ComparisonBar label="Income" actual={stats.income} budget={budgets.summary.income} color="oklch(0.70 0.20 150)" onEdit={(val) => updateBudget('summary', 'income', val)} hideBudgetText={true} />
              <ComparisonBar label="Saving" actual={stats.saving} budget={budgets.summary.saving} color="oklch(0.60 0.25 280)" onEdit={(val) => updateBudget('summary', 'saving', val)} hideBudgetText={true} />
              <ComparisonBar label="Expenses" actual={stats.expense} budget={budgets.summary.expense} color="oklch(0.60 0.25 300)" onEdit={(val) => updateBudget('summary', 'expense', val)} hideBudgetText={true} />
            </div>
          </div>

          {/* Saving Breakdown */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border-white/10 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full" />

            <h3 className="text-sm font-black text-foreground mb-10 border-l-4 border-accent pl-4 uppercase tracking-wider flex items-center justify-between relative z-10">
              Saving Allocation
              <span className="text-[10px] text-muted-foreground font-black">{Object.keys(stats.savingMap).length} Active Items</span>
            </h3>
            <div className="space-y-8 relative z-10">
              {Object.entries(stats.savingMap)
                .map(([item, amount]) => {
                  const budget = budgets.savingItems[item as keyof typeof budgets.savingItems] || 1000000;
                  const isInvestment = item.toLowerCase().includes('invest') || item.toLowerCase().includes('bibit');
                  const isEmergency = item.toLowerCase().includes('darurat') || item.toLowerCase().includes('emergency');
                  
                  return (
                    <div key={item} className="group/wallet">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl glass-card flex items-center justify-center ${isInvestment ? 'text-primary' : isEmergency ? 'text-emerald-500' : 'text-accent'}`}>
                            {isInvestment ? <TrendingUp className="h-5 w-5" /> : isEmergency ? <Activity className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-black text-foreground uppercase tracking-tight">{item}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                              {isInvestment ? 'Investment' : isEmergency ? 'Emergency Fund' : 'Savings'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-foreground">{fmt(amount)}</div>
                        </div>
                      </div>
                      <ComparisonBar 
                        label={item} 
                        actual={amount} 
                        budget={budget} 
                        color={isInvestment ? "oklch(0.70 0.25 250)" : "oklch(0.85 0.20 140)"} 
                        onEdit={(val) => updateBudget('savingItems', item, val)}
                        hideLabel={true}
                      />
                    </div>
                  );
                })}
              {Object.keys(stats.savingMap).length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                  <Activity className="h-10 w-10 text-muted/20 mx-auto mb-4" />
                  <p className="text-xs text-muted-foreground italic font-medium">Belum ada alokasi tabungan.</p>
                </div>
              )}
            </div>
          </div>

          {/* Expenses Donut */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border-white/10 flex flex-col items-center relative overflow-hidden">
            <h3 className="text-sm font-black text-foreground mb-10 border-l-4 border-rose-500 pl-4 w-full uppercase tracking-wider flex items-center justify-between relative z-10">
              Expenses
              <span className="text-[10px] text-muted-foreground font-black uppercase">{cycleInfo.label}</span>
            </h3>
            <div className="relative h-64 w-64 mb-10 z-10">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/10" />
                {stats.categories.map((c, i, arr) => {
                  const start = arr.slice(0, i).reduce((sum, item) => sum + item.pct, 0);
                  return (
                    <circle
                      key={c.name}
                      cx="18" cy="18" r="15.915"
                      fill="none"
                      stroke={c.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${c.pct} ${100 - c.pct}`}
                      strokeDashoffset={-start}
                      className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                      style={{ filter: `drop-shadow(0 0 5px ${c.color}66)` }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Spent</span>
                <span className="text-3xl font-black text-foreground tracking-tighter">{fmt(stats.expense).replace("Rp ", "")}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full relative z-10">
              {stats.categories.slice(0, 5).map((c, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 text-xs font-black text-foreground">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-lg" style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.color}66` }}></div>
                    <span className="truncate">{c.name}</span>
                    <span className="ml-auto font-black text-foreground/80">{fmt(c.amount)}</span>
                  </div>
                  {c.lastDate && (
                    <div className="pl-5 text-[9px] font-black text-muted-foreground flex items-center gap-1.5 uppercase tracking-tighter opacity-60">
                      <Calendar className="h-2.5 w-2.5" /> {(() => {
                         const [y, m, d] = (c.lastDate as string).split("-");
                         const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                         return `${d} ${months[parseInt(m)-1]}`;
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Recent Transactions List */}
        <div className="mt-12 glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border-white/10">
          <div className="bg-white/5 border-b border-white/5 px-10 py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
                <History className="h-6 w-6 text-primary" /> Recent Activity
              </h3>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{filteredTransactions.length} Transactions found</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Search Box */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari transaksi..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-72 font-medium"
                />
              </div>

              {/* Category Filter */}
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-black uppercase tracking-widest dark:bg-card dark:text-foreground"
                >
                <option value="All">All Categories</option>
                {Array.from(new Set(transactions.map(t => t.cat))).sort().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto px-4">
            {filteredTransactions.length > 0 ? [...filteredTransactions].reverse().map((t, i) => {
              const originalIndex = transactions.indexOf(t);
              return (
                <div key={i} className="px-6 py-6 flex items-center justify-between group hover:bg-white/5 transition-all rounded-3xl my-2">
                  <div className="flex items-center gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {t.type === 'income' ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="text-base font-black text-foreground tracking-tight">{t.item}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        {t.cat} • {t.date ? (() => {
                          const [y, m, d] = t.date.split("-");
                          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                          return `${d} ${months[parseInt(m)-1]}`;
                        })() : "Today"} • {t.time || '00:00'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className={`text-lg font-black tracking-tighter ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'} {fmt(t.amount)}
                    </div>
                    <button 
                      onClick={() => onDeleteOne?.(originalIndex)}
                      className="p-3 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center text-muted-foreground text-sm italic font-medium">Belum ada transaksi di siklus ini.</div>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-end gap-6 pb-20">
          <button onClick={exportToCSV} className="flex items-center gap-3 px-8 py-4 rounded-2xl glass-card text-foreground text-xs font-black hover:bg-primary/10 transition-all uppercase tracking-[0.2em]">
            <Download className="h-4 w-4 text-primary" /> Export Excel (CSV)
          </button>
          <button onClick={onClearAll} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black hover:bg-rose-500/20 transition-all uppercase tracking-[0.2em]">
            <Trash2 className="h-4 w-4" /> Reset All Data
          </button>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black hover:bg-rose-500/20 transition-all uppercase tracking-[0.2em]">
              <LogOut className="h-4 w-4" /> Keluar (Logout)
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
