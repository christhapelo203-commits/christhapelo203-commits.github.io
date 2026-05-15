import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { subscribeToDocuments } from '../services/db';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockChartData = [
  { name: 'Mon', attendance: 92, homework: 85 },
  { name: 'Tue', attendance: 88, homework: 78 },
  { name: 'Wed', attendance: 95, homework: 92 },
  { name: 'Thu', attendance: 91, homework: 88 },
  { name: 'Fri', attendance: 85, homework: 95 },
];

function StatCard({ label, value, subtext, icon: Icon, color }: any) {
  return (
    <div className="bg-[#1B263B] p-6 rounded-2xl border border-[#00C9A7]/5 hover:border-[#00C9A7]/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-[#F5F7FA]/40 group-hover:text-[#00C9A7] transition-colors">
          <ChevronRight className="w-4 h-4 cursor-pointer" />
        </span>
      </div>
      <div>
        <h3 className="text-[#F5F7FA]/60 text-sm font-medium mb-1">{label}</h3>
        <p className="text-2xl font-bold text-[#F5F7FA]">{value}</p>
        <p className="text-xs text-[#00C9A7] mt-1 font-medium">{subtext}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = React.useState({
    attendance: '94.2%',
    homework: '0/0',
    assessments: '0',
    performance: 'B+'
  });

  const isStudent = profile?.role === 'student' || profile?.role === 'parent';

  React.useEffect(() => {
    // Real-time stats calculation
    const unsubAtt = subscribeToDocuments<any>('attendance', [], (data) => {
      if (data.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = data.filter(r => r.date === today);
        if (todayRecords.length > 0) {
          const present = todayRecords.filter(r => r.status === 'present').length;
          setStats(prev => ({ ...prev, attendance: `${Math.round((present / 5) * 100)}%` })); // Assuming 5 students for demo
        }
      }
    });

    const unsubAss = subscribeToDocuments<any>('assignments', [], (data) => {
      setStats(prev => ({ ...prev, homework: `${data.filter(a => a.status === 'Submitted').length}/${data.length}` }));
    });

    return () => {
      unsubAtt();
      unsubAss();
    };
  }, []);
  
  return (
    <div className="space-y-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight mb-2">
            Welcome back, {profile?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[#F5F7FA]/60 font-medium">
            Here's what's happening at <span className="text-[#00C9A7]">EduTrack Academy</span> today.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1B263B] rounded-xl border border-[#00C9A7]/10 text-xs font-bold">
          <Calendar className="w-4 h-4 text-[#00C9A7]" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={isStudent ? "Your Attendance" : "Average Attendance"} 
          value={stats.attendance} 
          subtext={isStudent ? "Target: 95%" : "+2.1% from last week"} 
          icon={Users} 
          color="bg-[#00C9A7]/10 text-[#00C9A7]"
        />
        <StatCard 
          label={isStudent ? "My Progress" : "Homework Progress"} 
          value={stats.homework} 
          subtext="Updated just now" 
          icon={BookOpen} 
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard 
          label="Upcoming Tests" 
          value="3" 
          subtext="Next: Mathematics" 
          icon={Clock} 
          color="bg-amber-500/10 text-amber-400"
        />
        <StatCard 
          label={isStudent ? "Current GPA" : "Recent Performance"} 
          value={isStudent ? "3.8" : stats.performance} 
          subtext="Consistently improving" 
          icon={TrendingUp} 
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-[#1B263B] p-6 rounded-3xl border border-[#00C9A7]/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold mb-1">Performance Overview</h2>
              <p className="text-xs text-[#F5F7FA]/40 font-medium tracking-wide uppercase">Attendance vs Completion Rates</p>
            </div>
            <select className="bg-[#0D1B2A] border border-[#00C9A7]/10 text-xs font-bold px-3 py-1 rounded-lg outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C9A7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" opacity={0.05} vertical={false} />
                <XAxis dataKey="name" stroke="#F5F7FA" opacity={0.3} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B263B', border: '1px solid rgba(0, 201, 167, 0.2)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#00C9A7" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="homework" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Activity Section */}
        <div className="space-y-6">
          <div className="bg-[#1B263B] p-6 rounded-3xl border border-[#00C9A7]/5">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { title: 'Homework Submitted', time: '2 hours ago', icon: CheckCircle2, iconColor: 'text-[#00C9A7]', desc: 'Mathematics: Algebra Basics' },
                { title: 'New Assessment', time: '5 hours ago', icon: AlertCircle, iconColor: 'text-amber-400', desc: 'English Literature Quiz' },
                { title: 'Attendance Alert', time: 'Yesterday', icon: AlertCircle, iconColor: 'text-red-400', desc: 'Late for Science Class' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={cn("w-10 h-10 rounded-xl bg-[#0D1B2A] flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[#00C9A7]/20 transition-all", activity.iconColor)}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{activity.title}</h4>
                    <p className="text-xs text-[#F5F7FA]/40 font-medium mb-1">{activity.desc}</p>
                    <span className="text-[10px] text-[#F5F7FA]/30 uppercase font-bold tracking-widest">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-[#0D1B2A] text-[#00C9A7] font-bold text-xs rounded-xl border border-[#00C9A7]/10 hover:bg-[#00C9A7]/5 transition-all uppercase tracking-widest">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
