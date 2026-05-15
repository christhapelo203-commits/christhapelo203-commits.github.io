import React, { useState } from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  Award, 
  ChevronRight, 
  Search,
  ArrowUpRight,
  Filter,
  BarChart4
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const scoreData = [
  { subject: 'Math', score: 85, avg: 72 },
  { subject: 'Science', score: 92, avg: 68 },
  { subject: 'History', score: 78, avg: 75 },
  { subject: 'English', score: 88, avg: 80 },
  { subject: 'Art', score: 95, avg: 85 },
];

export default function Assessments() {
  const { profile } = useAuth();
  
  const assessments = [
    { id: '1', name: 'Mid-term Algebra Exam', type: 'Exam', date: 'May 12, 2026', subject: 'Mathematics', score: '38/40', percent: 95, status: 'Graded' },
    { id: '2', title: 'World War II Project', type: 'Project', date: 'May 10, 2026', subject: 'History', score: '28/35', percent: 80, status: 'Graded' },
    { id: '3', title: 'Organic Chemistry Quiz', type: 'Quiz', date: 'May 14, 2026', subject: 'Science', score: '-', percent: 0, status: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-sm font-medium text-[#F5F7FA]/40 italic uppercase tracking-wider">Track academic achievements and growth</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#1B263B] border-2 border-[#0D1B2A] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1B263B] border-2 border-[#0D1B2A] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#00C9A7]" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1B263B] border-2 border-[#0D1B2A] flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
           </div>
           <button className="bg-[#1B263B] text-[#00C9A7] border border-[#00C9A7]/20 px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 uppercase tracking-widest hover:bg-[#00C9A7]/5 transition-all">
             Full Reports
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Section */}
          <Card title="Subject Proficiency" description="Your score vs Class average">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F7FA" opacity={0.05} />
                  <XAxis dataKey="subject" stroke="#F5F7FA" opacity={0.3} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1B263B', border: '1px solid rgba(0, 201, 167, 0.2)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={24}>
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#00C9A7' : '#3b82f6'} />
                    ))}
                  </Bar>
                  <Bar dataKey="avg" fill="#F5F7FA" opacity={0.1} radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-[#0D1B2A] rounded-2xl flex items-center justify-around gap-4 border border-white/5">
               <div className="text-center">
                 <p className="text-xs font-bold text-[#F5F7FA]/40 mb-1">Rank</p>
                 <p className="text-xl font-bold text-[#00C9A7]">Top 5%</p>
               </div>
               <div className="w-px h-8 bg-white/5"></div>
               <div className="text-center">
                 <p className="text-xs font-bold text-[#F5F7FA]/40 mb-1">Average</p>
                 <p className="text-xl font-bold text-blue-400">87.6%</p>
               </div>
               <div className="w-px h-8 bg-white/5"></div>
               <div className="text-center">
                 <p className="text-xs font-bold text-[#F5F7FA]/40 mb-1">Credits</p>
                 <p className="text-xl font-bold text-purple-400">22.5</p>
               </div>
            </div>
          </Card>

          {/* Table Section */}
          <Card title="Recent Assessments">
            <div className="space-y-4">
              {assessments.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-[#0D1B2A]/50 rounded-2xl border border-white/5 hover:border-[#00C9A7]/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1B263B] rounded-xl flex items-center justify-center border border-white/5">
                      <BarChart4 className={cn("w-6 h-6", a.status === 'Graded' ? "text-[#00C9A7]" : "text-amber-400")} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-[#00C9A7] transition-colors">{a.name}</h4>
                      <p className="text-[10px] uppercase font-bold text-[#F5F7FA]/30 tracking-widest">{a.subject} • {a.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-sm tracking-tight">{a.score}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest",
                      a.status === 'Graded' ? "bg-[#00C9A7]/10 text-[#00C9A7]" : "bg-amber-500/10 text-amber-400"
                    )}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Skill Matrix">
            <div className="space-y-6">
              {[
                { name: 'Critical Thinking', val: 90, color: 'bg-[#00C9A7]' },
                { name: 'Problem Solving', val: 75, color: 'bg-blue-500' },
                { name: 'Communication', val: 85, color: 'bg-purple-500' },
                { name: 'Collaboration', val: 60, color: 'bg-amber-500' },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5F7FA]/60">{skill.name}</span>
                    <span className="text-[10px] font-bold text-[#F5F7FA]/30">{skill.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#0D1B2A] rounded-full overflow-hidden">
                    <div className={cn("h-full", skill.color)} style={{ width: `${skill.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Teacher Feedback">
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-[#00C9A7]/30">
                <p className="text-[11px] text-[#F5F7FA]/60 leading-relaxed italic">
                  "Significant improvement in Mathematical logic. Focus more on presentation for History essays."
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold">Mr.H</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C9A7]">Mr. Henderson</span>
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#0D1B2A] border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-[#00C9A7]/20 transition-all">
                <span>All Feedback</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
