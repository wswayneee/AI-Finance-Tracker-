import { ArrowDownLeft, ArrowUpRight, ArrowRight, Trash2, Plus, Wallet, ShoppingCart, PiggyBank, CheckCircle2, Tag, Calendar } from "lucide-react";
import { useState } from "react";

export type Transaction = {
  id?: string;
  user_id?: string;
  item: string;
  cat: string;
  type: "expense" | "income";
  amount: number;
  time?: string;
  date?: string; // ISO String
};

const EXPENSE_CATEGORIES = [
  "F&B (Makan/Minum)", "Kopi & Cemilan", "Bahan Makanan", 
  "Transportasi", "Perawatan Diri", "Langganan Aplikasi", 
  "Hiburan", "Belanja Pakaian", "Kesehatan & Obat", 
  "Listrik", "Air", "Gas", "Pulsa", "Kuota Internet", 
  "Sewa Kos", "Sewa Rumah", "Zakat", "Sedekah", 
  "Persepuluhan", "Bulanan Orang Tua",
  "Cicilan", "Pinjaman", "Lainnya"
];
const INCOME_CATEGORIES = ["Gaji", "Bonus", "Freelance", "Investasi", "Hadiah", "Lainnya"];
const SAVING_TYPES = [
  "Dana Darurat", "Investasi", "Tabungan Bulanan", "Tabungan Nikah", 
  "Tabungan Rumah", "Tabungan Kendaraan", "Tabungan Pendidikan", 
  "Liburan / Travelling", "Pensiun", "Haji / Umroh", "Lainnya"
];
const BANK_LIST = [
  // Big Banks
  "BCA", "BNI", "BRI", "Mandiri", "BTN", "CIMB Niaga", "Danamon", "Permata", "OCBC NISP", "Maybank", "Panin", "UOB", "HSBC", "DBS / digibank",
  // Digital Banks
  "Bank Jago", "SeaBank", "Superbank", "Allo Bank", "blu by BCA Digital", "Jenius (BTPN)", "Bank Neo Commerce (BNC)", "Bank Raya", "Krom", "Hibank", "Fazz",
  // Syariah
  "BSI (Bank Syariah Indonesia)", "Bank Muamalat", "BCA Syariah", "Bank Mega Syariah", "Jago Syariah",
  // Others / Regionals
  "Bank DKI", "Bank BJB", "Bank Jateng", "Bank Jatim", "Bank Mega", "Nobu Bank", "MNC Bank", "Bank Sinarmas", "KB Bank (Bukopin)", "Commonwealth", "Standard Chartered",
  // Investment & Wallets
  "Bibit", "Ajaib", "Pluang", "Stockbit", "Gopay", "OVO", "Dana", "ShopeePay", "LinkAja", "Tunai (Cash)", "Lainnya"
];

export function Demo({ onAdd }: { onAdd?: (txs: Transaction[]) => void }) {
  const [rows, setRows] = useState<Transaction[]>([]);

  // Form States
  const today = new Date().toISOString().split('T')[0];
  const [income, setIncome] = useState({ item: "", amount: "", cat: "Gaji", date: today });
  const [saving, setSaving] = useState({ item: "", amount: "", bank: "Bank Jago", date: today });
  const [expense, setExpense] = useState({ item: "", amount: "", cat: "F&B (Makan/Minum)", date: today });

  // Bank Search States
  const [bankSearch, setBankSearch] = useState("");
  const [isBankOpen, setIsBankOpen] = useState(false);

  // Category Search States
  const [expSearch, setExpSearch] = useState("");
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [incSearch, setIncSearch] = useState("");
  const [isIncOpen, setIsIncOpen] = useState(false);
  const [savSearch, setSavSearch] = useState("");
  const [isSavOpen, setIsSavOpen] = useState(false);

  const filteredBanks = BANK_LIST.filter(b => b.toLowerCase().includes(bankSearch.toLowerCase()));
  const filteredExps = EXPENSE_CATEGORIES.filter(c => c.toLowerCase().includes(expSearch.toLowerCase()));
  const filteredIncs = INCOME_CATEGORIES.filter(c => c.toLowerCase().includes(incSearch.toLowerCase()));
  const filteredSavs = SAVING_TYPES.filter(s => s.toLowerCase().includes(savSearch.toLowerCase()));
  
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

  // Currency Formatter for Inputs
  const formatInput = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(num));
  };

  const parseInput = (val: string) => {
    return val.replace(/\./g, "");
  };

  const handleAdd = (type: "income" | "expense" | "saving") => {
    const data = type === "income" ? income : type === "saving" ? { ...saving, cat: "Tabungan" } : expense;
    const rawAmount = parseInput(data.amount);
    
    if (!data.item || !rawAmount) return;

    const now = new Date();
    const finalItem = type === "saving" ? `${data.item} (${(data as any).bank})` : data.item;

    const newTx: Transaction = {
      item: finalItem,
      amount: parseInt(rawAmount),
      type: type === "income" ? "income" : "expense",
      cat: (data as any).cat || "Lainnya",
      time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      date: data.date,
    };

    setRows([...rows, newTx]);
    
    // Reset forms
    if (type === "income") setIncome({ ...income, item: "", amount: "" });
    else if (type === "saving") setSaving({ ...saving, item: "", amount: "" });
    else setExpense({ ...expense, item: "", amount: "" });
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmAll = () => {
    if (onAdd && rows.length > 0) {
      onAdd(rows);
      setRows([]);
    }
  };

  return (
    <section id="demo" className="w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center gap-2 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
            Input Center
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter">Catat transaksi keuanganmu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* INCOME CARD */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-green-500/20 to-transparent rounded-[2rem] blur-xl opacity-25"></div>
            <div className="relative bg-card border border-border rounded-[2rem] shadow-sm flex flex-col h-full hover:border-green-500/30 transition-colors">
              <div className="bg-[#1e3a8a] py-4 px-6 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-t-[2rem]">
                <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                   <ArrowDownLeft className="h-3 w-3 text-white" />
                </div>
                Income / Pemasukan
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="relative">
                    <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      value={income.item} onChange={e => setIncome({...income, item: e.target.value})}
                      placeholder="Nama Pemasukan" className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" value={income.amount} onChange={e => setIncome({...income, amount: formatInput(e.target.value)})}
                      placeholder="Jumlah (Rp)" className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-green-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" value={income.date} onChange={e => setIncome({...income, date: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div 
                      onClick={() => setIsIncOpen(!isIncOpen)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold cursor-pointer hover:bg-muted/30 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{income.cat}</span>
                      <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform ${isIncOpen ? 'rotate-90' : ''}`} />
                    </div>

                    {isIncOpen && (
                      <div className="absolute z-50 top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-border bg-muted/30">
                          <input 
                            autoFocus value={incSearch} onChange={(e) => setIncSearch(e.target.value)}
                            placeholder="Cari kategori..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredIncs.map(c => (
                            <div 
                              key={c} onClick={() => { setIncome({...income, cat: c}); setIsIncOpen(false); setIncSearch(""); }}
                              className="px-5 py-3 text-xs font-bold hover:bg-green-500 hover:text-white cursor-pointer transition-colors"
                            >
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleAdd("income")}
                  disabled={!income.item || !income.amount}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Tambah Pemasukan
                </button>
              </div>
            </div>
          </div>

          {/* SAVING CARD */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-[2rem] blur-xl opacity-25"></div>
            <div className="relative bg-card border border-border rounded-[2rem] shadow-sm flex flex-col h-full hover:border-blue-500/30 transition-colors">
              <div className="bg-[#1e3a8a] py-4 px-6 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-t-[2rem]">
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                   <PiggyBank className="h-3 w-3 text-white" />
                </div>
                Saving / Tabungan
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  {/* Searchable Saving Type Selector */}
                  <div className="relative">
                    <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div 
                      onClick={() => setIsSavOpen(!isSavOpen)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold cursor-pointer hover:bg-muted/30 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{saving.item || "Tujuan Tabungan..."}</span>
                      <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform ${isSavOpen ? 'rotate-90' : ''}`} />
                    </div>

                    {isSavOpen && (
                      <div className="absolute z-50 top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-border bg-muted/30">
                          <input 
                            autoFocus value={savSearch} onChange={(e) => setSavSearch(e.target.value)}
                            placeholder="Cari tujuan..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredSavs.map(s => (
                            <div 
                              key={s} onClick={() => { setSaving({...saving, item: s}); setIsSavOpen(false); setSavSearch(""); }}
                              className="px-5 py-3 text-xs font-bold hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" value={saving.amount} onChange={e => setSaving({...saving, amount: formatInput(e.target.value)})}
                      placeholder="Jumlah (Rp)" className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" value={saving.date} onChange={e => setSaving({...saving, date: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                    />
                  </div>
                  
                  {/* Searchable Bank Selector */}
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div 
                      onClick={() => setIsBankOpen(!isBankOpen)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold cursor-pointer hover:bg-muted/30 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{saving.bank || "Pilih Bank..."}</span>
                      <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform ${isBankOpen ? 'rotate-90' : ''}`} />
                    </div>

                    {isBankOpen && (
                      <div className="absolute z-50 top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-border bg-muted/30">
                          <input 
                            autoFocus value={bankSearch} onChange={(e) => setBankSearch(e.target.value)}
                            placeholder="Cari bank..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredBanks.map(b => (
                            <div 
                              key={b} onClick={() => { setSaving({...saving, bank: b}); setIsBankOpen(false); setBankSearch(""); }}
                              className="px-5 py-3 text-xs font-bold hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                            >
                              {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleAdd("saving")}
                  disabled={!saving.item || !saving.amount || !saving.bank}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Tambah Tabungan
                </button>
              </div>
            </div>
          </div>

          {/* EXPENSE CARD */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-red-500/20 to-transparent rounded-[2rem] blur-xl opacity-25"></div>
            <div className="relative bg-card border border-border rounded-[2rem] shadow-sm flex flex-col h-full hover:border-red-500/30 transition-colors">
              <div className="bg-[#1e3a8a] py-4 px-6 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 rounded-t-[2rem]">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                   <ArrowUpRight className="h-3 w-3 text-white" />
                </div>
                Expense / Pengeluaran
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="relative">
                    <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      value={expense.item} onChange={e => setExpense({...expense, item: e.target.value})}
                      placeholder="Nama Pengeluaran" className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" value={expense.amount} onChange={e => setExpense({...expense, amount: formatInput(e.target.value)})}
                      placeholder="Jumlah (Rp)" className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-red-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="date" value={expense.date} onChange={e => setExpense({...expense, date: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div 
                      onClick={() => setIsExpOpen(!isExpOpen)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/20 rounded-2xl text-sm font-bold cursor-pointer hover:bg-muted/30 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{expense.cat}</span>
                      <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpOpen ? 'rotate-90' : ''}`} />
                    </div>

                    {isExpOpen && (
                      <div className="absolute z-50 top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-border bg-muted/30">
                          <input 
                            autoFocus value={expSearch} onChange={(e) => setExpSearch(e.target.value)}
                            placeholder="Cari kategori..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredExps.map(c => (
                            <div 
                              key={c} onClick={() => { setExpense({...expense, cat: c}); setIsExpOpen(false); setExpSearch(""); }}
                              className="px-5 py-3 text-xs font-bold hover:bg-red-500 hover:text-white cursor-pointer transition-colors"
                            >
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleAdd("expense")}
                  disabled={!expense.item || !expense.amount}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Tambah Pengeluaran
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Area */}
        {rows.length > 0 && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-card border-2 border-primary/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-muted/50 px-8 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                     Konfirmasi Transaksi ({rows.length})
                   </h3>
                </div>
                <button 
                  onClick={() => setRows([])}
                  className="text-[10px] font-bold text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Hapus Semua
                </button>
              </div>
              
              <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                {rows.map((r, i) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${r.type === 'income' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {r.type === 'income' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-foreground">{r.item}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{r.cat} • {r.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={`text-sm font-black ${r.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {r.type === 'income' ? '+' : '-'} {fmt(r.amount)}
                      </div>
                      <button 
                        onClick={() => handleRemoveRow(i)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-muted/50 border-t border-border">
                <button 
                  onClick={handleConfirmAll}
                  className="w-full py-5 bg-primary text-primary-foreground rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5" /> Konfirmasi & Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
