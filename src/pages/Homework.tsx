import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Paperclip,
  Search,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { subscribeToDocuments, createDocument } from '../services/db';
import { where, orderBy } from 'firebase/firestore';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: 'To Do' | 'In Progress' | 'Submitted';
  priority: 'High' | 'Medium' | 'Low';
  class_id?: string;
}

export default function Homework() {
  const { profile, user } = useAuth();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  useEffect(() => {
    // In a real app, we'd fetch based on student's classes
    const unsub = subscribeToDocuments<Assignment>('assignments', [], (data) => {
      if (data.length > 0) {
        setAssignments(data);
      } else {
        // Initial mock data if empty
        setAssignments([
          { id: '1', title: 'Algebra Equations', subject: 'Mathematics', due: '2026-05-16', status: 'In Progress', priority: 'High' },
          { id: '2', title: 'Modern History Essay', subject: 'History', due: '2026-05-18', status: 'To Do', priority: 'Medium' },
          { id: '3', title: 'Chemical Reactions Lab', subject: 'Science', due: '2026-05-15', status: 'Submitted', priority: 'Low' },
          { id: '4', title: 'Poetry Analysis', subject: 'English', due: '2026-05-20', status: 'To Do', priority: 'Medium' },
        ]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateAssignment = async () => {
    if (!isTeacher) return;
    try {
      await createDocument('assignments', {
        title: 'New Physics Lab',
        subject: 'Physics',
        due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'To Do',
        priority: 'Medium',
        createdAt: new Date().toISOString()
      } as any);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Homework Explorer</h1>
          <p className="text-sm font-medium text-[#F5F7FA]/40 italic uppercase tracking-wider">Manage and track academic assignments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1B263B] p-1 rounded-xl border border-[#00C9A7]/10">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2 rounded-lg transition-all", view === 'kanban' ? "bg-[#00C9A7] text-[#0D1B2A]" : "text-[#F5F7FA]/40")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-[#00C9A7] text-[#0D1B2A]" : "text-[#F5F7FA]/40")}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          {isTeacher && (
            <button 
              onClick={handleCreateAssignment}
              className="bg-[#00C9A7] text-[#0D1B2A] px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-lg shadow-[#00C9A7]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Assign New
            </button>
          )}
        </div>
      </header>

      {/* Kanban Board - Student View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['To Do', 'In Progress', 'Submitted'].map((column) => (
          <div key={column} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5F7FA]/40 flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  column === 'To Do' ? "bg-amber-400" : column === 'In Progress' ? "bg-blue-400" : "bg-[#00C9A7]"
                )} />
                {column}
              </h3>
              <span className="text-[10px] font-bold text-[#F5F7FA]/20 bg-white/5 px-2 py-0.5 rounded-full">
                {assignments.filter(a => a.status === column).length}
              </span>
            </div>
            
            <div className="space-y-4">
              {assignments.filter(a => a.status === column).map((item) => (
                <div key={item.id} className="bg-[#1B263B] p-5 rounded-2xl border border-[#00C9A7]/5 hover:border-[#00C9A7]/20 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                      item.priority === 'High' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-400"
                    )}>
                      {item.subject}
                    </span>
                    <button className="text-[#F5F7FA]/20 group-hover:text-[#F5F7FA]/60"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  <h4 className="font-bold mb-6 group-hover:text-[#00C9A7] transition-colors">{item.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F5F7FA]/40">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#1B263B] flex items-center justify-center text-[8px] font-bold">JD</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-[#1B263B] flex items-center justify-center text-[8px] font-bold">AS</div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F7FA]/20 hover:border-[#00C9A7]/20 hover:text-[#00C9A7] transition-all">
                + Create Scratchpad
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card title="Quick Submission" description="Upload your completed work">
            <div className="border-2 border-dashed border-[#00C9A7]/10 rounded-3xl p-12 text-center hover:bg-[#00C9A7]/5 transition-all group">
              <div className="w-16 h-16 bg-[#00C9A7]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Paperclip className="w-8 h-8 text-[#00C9A7]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drop files here to upload</h3>
              <p className="text-sm text-[#F5F7FA]/40 max-w-sm mx-auto leading-relaxed">
                Support for PDF, DOCX, and high-res images. Maximum file size 25MB.
              </p>
              <button className="mt-8 px-6 py-3 bg-[#00C9A7] text-[#0D1B2A] font-bold rounded-xl text-xs uppercase tracking-widest">
                Select Files
              </button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card title="Teacher's Hub" className="h-full">
            <div className="space-y-6">
              <div className="p-4 bg-[#0D1B2A]/50 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-[#00C9A7] uppercase mb-1">Coming Next</p>
                <p className="text-sm font-bold">Science Lab Reports</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400">65%</span>
                </div>
              </div>
              
              <div className="p-4 bg-[#0D1B2A]/50 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Attention Required</p>
                <p className="text-sm font-bold">12 Late Submissions</p>
                <button className="mt-3 text-[10px] font-bold text-[#F5F7FA]/40 hover:text-amber-400 transition-colors flex items-center gap-1 uppercase tracking-widest">
                  Review All <MoreVertical className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
