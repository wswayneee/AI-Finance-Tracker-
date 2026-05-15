import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WigladsLogo } from '@/components/brand/Logo';
import { Mail, Lock, LogIn, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type AuthView = 'login' | 'signup' | 'forgot' | 'recovery';

export function Auth({ onAuthSuccess, isRecoveryMode = false }: { onAuthSuccess: () => void, isRecoveryMode?: boolean }) {
  const [view, setView] = useState<AuthView>(isRecoveryMode ? 'recovery' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isRecoveryMode) {
      setView('recovery');
    }
  }, [isRecoveryMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Berhasil login!');
        onAuthSuccess();
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        setView('login');
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        toast.success('Tautan reset password telah dikirim ke email Anda.');
      } else if (view === 'recovery') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast.success('Password berhasil diperbarui! Silakan lanjut menggunakan aplikasi.');
        onAuthSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <WigladsLogo className="h-16" showText={false} />
          <h1 className="text-4xl font-black tracking-tighter text-center">
            <span className="text-gradient">Wiglads</span><span className="text-primary animate-pulse">.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium text-center uppercase tracking-widest">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'recovery' && 'Update Password'}
          </p>
        </div>

        <div className="glass-card p-8 rounded-[2rem] shadow-2xl border-white/10 relative">
          
          {view === 'forgot' && (
            <button 
              type="button"
              onClick={() => { setView('login'); }}
              className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <form onSubmit={handleAuth} className="space-y-6 mt-2">
            
            <div className="space-y-4">
              {(view === 'login' || view === 'signup' || view === 'forgot') && (
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    required
                  />
                </div>
              )}

              {(view === 'login' || view === 'signup' || view === 'recovery') && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    placeholder={view === 'recovery' ? "Password Baru" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    required
                    minLength={6}
                  />
                </div>
              )}
            </div>

            {view === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setView('forgot'); }}
                  className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : view === 'login' ? (
                <><LogIn className="h-4 w-4" /> Sign In</>
              ) : view === 'signup' ? (
                <><UserPlus className="h-4 w-4" /> Sign Up</>
              ) : view === 'forgot' ? (
                <><KeyRound className="h-4 w-4" /> Kirim Link Reset</>
              ) : (
                <><KeyRound className="h-4 w-4" /> Update Password</>
              )}
            </button>
          </form>

          {(view === 'login' || view === 'signup') && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); }}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {view === 'login' ? "Belum punya akun? Daftar sekarang" : "Sudah punya akun? Login di sini"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
