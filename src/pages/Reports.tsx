import React from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Calendar
} from 'lucide-react';
import Card from '../components/common/Card';
import { exportToCSV, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const attendanceData = [
  { name: 'Mon', rate: 94 },
  { name: 'Tue', rate: 96 },
  { name: 'Wed', rate: 92 },
  { name: 'Thu', rate: 95 },
  { name: 'Fri', rate: 89 },
];

const performanceData = [
  { subject: 'Math', average: 78 },
  { subject: 'Science', average: 82 },
  { subject: 'History', average: 75 },
  { subject: 'English', average: 88 },
  { subject: 'Art', average: 92 },
];

const distributionData = [
  { name: 'A (90-100)', value: 15 },
  { name: 'B (80-89)', value: 35 },
  { name: 'C (70-79)', value: 30 },
  { name: 'D (60-69)', value: 15 },
  { name: 'F (<60)', value: 5 },
];

const COLORS = ['#00C9A7', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function Reports() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-[#F5F7FA]">Institutional Analytics</h1>
          <p className="text-[#F5F7FA]/60 text-sm mt-1">Comprehensive performance and engagement metrics across all grades.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1B263B] border border-white/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
            <Calendar className="w-4 h-4 text-[#00C9A7]" />
            Last 30 Days
          </button>
          <button 
            onClick={() => exportToCSV(performanceData, 'academic_performance_report')}
            className="flex items-center gap-2 bg-[#00C9A7] text-[#0D1B2A] px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00C9A7]/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-[#00C9A7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00C9A7]/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00C9A7]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F5F7FA]/30 uppercase tracking-widest">Total Students</p>
                <p className="text-2xl font-bold text-[#F5F7FA]">1,284</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#00C9A7] font-bold mt-4 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12 this month
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F5F7FA]/30 uppercase tracking-widest">Avg. Attendance</p>
                <p className="text-2xl font-bold text-[#F5F7FA]">93.2%</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-blue-500 font-bold mt-4 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +1.5% from last week
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F5F7FA]/30 uppercase tracking-widest">Homework Rate</p>
                <p className="text-2xl font-bold text-[#F5F7FA]">87%</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-purple-500 font-bold mt-4">Active submissions tracking</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F5F7FA]/30 uppercase tracking-widest">At-Risk Students</p>
                <p className="text-2xl font-bold text-[#F5F7FA]">42</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-orange-500 font-bold mt-4">Requires immediate intervention</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Attendance Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
                <XAxis 
                  dataKey="name" 
                  stroke="#F5F7FA" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#F5F7FA" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[80, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B263B', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#00C9A7" 
                  strokeWidth={3} 
                  dot={{ fill: '#00C9A7', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Subject Performance Map</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#F5F7FA" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#F5F7FA" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B263B', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="average" 
                  fill="#3B82F6" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Grade Distribution</h3>
          <div className="h-80 flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1B263B', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="shrink-0 space-y-4">
              {distributionData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs font-medium text-[#F5F7FA]/60">{d.name}</span>
                  <span className="text-xs font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden">
          <h3 className="text-lg font-bold mb-6">Critical Alerts</h3>
          <div className="space-y-4">
            {[
              { title: 'Grade 10 Maths Decline', desc: 'Average dropped by 8% this week.', level: 'high' },
              { title: 'Low Physics Attendance', desc: 'Section B attendance below 85% for 3 days.', level: 'medium' },
              { title: 'Homework Completion Gap', desc: 'History submissions lagging in Grade 9.', level: 'low' },
              { title: 'New Registration Burst', desc: '15 new students joined in the last 48h.', level: 'low' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 p-4 bg-[#0D1B2A] rounded-2xl border border-white/5 hover:border-[#00C9A7]/20 transition-all group">
                <div className={cn(
                  "w-1 h-full rounded-full transition-all group-hover:scale-y-110",
                  alert.level === 'high' ? 'bg-red-500' : alert.level === 'medium' ? 'bg-orange-500' : 'bg-[#00C9A7]'
                )}></div>
                <div>
                  <h4 className="text-sm font-bold">{alert.title}</h4>
                  <p className="text-xs text-[#F5F7FA]/40 mt-0.5">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
