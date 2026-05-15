import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, GraduationCap, ShieldCheck, UserCircle, Users, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) return;
    
    setIsLoggingIn(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMockLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123'); // Hardcoded for the mock logins
    setIsLoggingIn(true);
    setError(null);
    try {
      await signIn(roleEmail, 'password123');
    } catch (err: any) {
      console.error('Mock login failed:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const mockUsers = [
    { role: 'Student', email: 'student@edutrack.com', icon: Users, color: 'text-[#00C9A7]', bg: 'bg-[#00C9A7]/5' },
    { role: 'Teacher', email: 'teacher@edutrack.com', icon: UserCircle, color: 'text-blue-400', bg: 'bg-blue-400/5' },
    { role: 'Parent', email: 'parent@edutrack.com', icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/5' },
    { role: 'Admin', email: 'admin@edutrack.com', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-400/5' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A] p-4 relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#00C9A7]/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-stretch">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-[#00C9A7] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#00C9A7]/20"
            >
              <GraduationCap className="w-8 h-8 text-[#0D1B2A]" />
            </motion.div>
            <h1 className="text-5xl font-bold font-display mb-3 tracking-tight">EduTrack</h1>
            <p className="text-[#F5F7FA]/60 text-xl max-w-sm">Next-gen intelligence for modern institutions.</p>
          </div>

          <div className="hidden md:block space-y-4">
             <div className="flex items-center gap-4 text-[#F5F7FA]/40 font-medium">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]"></div>
               <span>Real-time Attendance Sync</span>
             </div>
             <div className="flex items-center gap-4 text-[#F5F7FA]/40 font-medium">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
               <span>AI-Powered Academic Insights</span>
             </div>
             <div className="flex items-center gap-4 text-[#F5F7FA]/40 font-medium">
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
               <span>Automated Reporting Pipeline</span>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-[450px]"
        >
          <div className="bg-[#1B263B] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 relative overflow-hidden backdrop-blur-sm">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Sign In</h2>
              <p className="text-sm text-[#F5F7FA]/40 mb-8 font-medium">Welcome back! Access your workspace.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F7FA]/40 ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F7FA]/20 group-focus-within:text-[#00C9A7] transition-colors" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@institution.com"
                      className="w-full bg-[#0D1B2A] border border-white/5 focus:border-[#00C9A7]/30 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between ml-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#F5F7FA]/40">Password</label>
                    <button type="button" className="text-[10px] font-bold text-[#00C9A7] hover:underline uppercase tracking-widest">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F7FA]/20 group-focus-within:text-[#00C9A7] transition-colors" />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0D1B2A] border border-white/5 focus:border-[#00C9A7]/30 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#00C9A7] text-[#0D1B2A] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00C9A7]/20 disabled:opacity-50 disabled:scale-100"
                >
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-[#0D1B2A]/20 border-t-[#0D1B2A] rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign in to Dashboard
                    </>
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px bg-white/5 flex-1"></div>
                <span className="text-[10px] font-bold text-[#F5F7FA]/20 uppercase tracking-[0.2em]">Mock Logins</span>
                <div className="h-px bg-white/5 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {mockUsers.map((mock) => (
                  <button
                    key={mock.role}
                    type="button"
                    onClick={() => handleMockLogin(mock.email)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 rounded-2xl border border-white/5 transition-all hover:scale-105 active:scale-95 group",
                      mock.bg
                    )}
                  >
                    <mock.icon className={cn("w-5 h-5 mb-1", mock.color)} />
                    <span className="text-xs font-bold text-[#F5F7FA]">{mock.role}</span>
                    <span className="text-[9px] text-[#F5F7FA]/40 font-medium truncate w-full">{mock.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
