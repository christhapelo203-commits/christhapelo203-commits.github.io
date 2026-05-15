import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { cn, exportToCSV } from '../lib/utils';
import { listDocuments, setDocument, subscribeToDocuments } from '../services/db';
import { where, query, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  class_id: string;
}

export default function Attendance() {
  const { profile, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  
  // Mock students for this demo
  const mockStudents = [
    { id: 'stud1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'stud2', name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'stud3', name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 'stud4', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 'stud5', name: 'Ryan Garcia', avatar: 'https://i.pravatar.cc/150?u=5' },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToDocuments<AttendanceRecord>(
      'attendance',
      [where('date', '==', selectedDate)],
      (data) => {
        const records: Record<string, AttendanceRecord> = {};
        data.forEach(r => {
          records[r.student_id] = r;
        });
        setAttendanceRecords(records);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [selectedDate]);

  const updateStatus = async (studentId: string, studentName: string, status: 'present' | 'absent' | 'late') => {
    const id = `${selectedDate}_${studentId}`;
    try {
      await setDocument('attendance', id, {
        student_id: studentId,
        student_name: studentName,
        date: selectedDate,
        status,
        class_id: 'math10', // Demo fixed class
        updatedAt: new Date().toISOString()
      } as any);
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  return (
    <div className="space-y-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Attendance Tracker</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F5F7FA]/40 uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4 text-[#00C9A7]" />
            <span>School Year 2026 - Term 2</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1B263B] p-1 rounded-xl border border-[#00C9A7]/10">
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:text-[#00C9A7] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <button 
               onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:text-[#00C9A7] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button className="bg-[#00C9A7] text-[#0D1B2A] p-2 rounded-xl flex items-center gap-2 font-bold text-xs px-4">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </header>

      {isTeacher ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card 
              title="Grade 10 - Mathematics" 
              description="Daily Attendance Marking"
              headerAction={
                <div className="text-[10px] font-bold text-[#00C9A7] uppercase tracking-widest bg-[#00C9A7]/5 px-3 py-1 rounded-full">
                  Real-time Sync Active
                </div>
              }
            >
              <div className="space-y-2">
                {mockStudents.map((student) => {
                  const record = attendanceRecords[student.id];
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-[#0D1B2A]/50 rounded-2xl border border-white/5 hover:border-[#00C9A7]/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <img src={student.avatar} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                        <div>
                          <p className="text-sm font-bold">{student.name}</p>
                          <p className="text-[10px] uppercase font-bold text-[#F5F7FA]/30 tracking-widest">Student ID: 2026-{student.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateStatus(student.id, student.name, 'present')}
                          className={cn(
                            "p-2 rounded-lg transition-all border",
                            record?.status === 'present' ? "bg-[#00C9A7] border-[#00C9A7] text-[#0D1B2A]" : "bg-transparent border-white/5 text-[#F5F7FA]/30 hover:border-[#00C9A7]/30"
                          )}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateStatus(student.id, student.name, 'absent')}
                          className={cn(
                            "p-2 rounded-lg transition-all border",
                            record?.status === 'absent' ? "bg-red-500 border-red-500 text-white" : "bg-transparent border-white/5 text-[#F5F7FA]/30 hover:border-red-500/30"
                          )}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateStatus(student.id, student.name, 'late')}
                          className={cn(
                            "p-2 rounded-lg transition-all border",
                            record?.status === 'late' ? "bg-amber-500 border-amber-500 text-white" : "bg-transparent border-white/5 text-[#F5F7FA]/30 hover:border-amber-500/30"
                          )}
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          
          <aside className="space-y-6">
            <Card title="Quick Tasks">
              <button 
                onClick={() => exportToCSV(Object.values(attendanceRecords), `attendance_${selectedDate}`)}
                className="w-full flex items-center justify-between p-4 bg-[#0D1B2A]/50 rounded-xl border border-white/5 text-sm font-bold hover:border-[#00C9A7]/20 transition-all font-sans"
              >
                <span>Export CSV</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Card>

            <Card title="Attendance Summary">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F7FA]/60 text-sm font-medium">Total Students</span>
                  <span className="font-bold">{mockStudents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F7FA]/60 text-sm font-medium">Present</span>
                  <span className="font-bold text-[#00C9A7]">
                    {Object.values(attendanceRecords).filter(r => r.status === 'present').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F7FA]/60 text-sm font-medium">Absent</span>
                  <span className="font-bold text-red-400">
                    {Object.values(attendanceRecords).filter(r => r.status === 'absent').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F7FA]/60 text-sm font-medium">Late</span>
                  <span className="font-bold text-amber-400">
                    {Object.values(attendanceRecords).filter(r => r.status === 'late').length}
                  </span>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#F5F7FA]/40 uppercase">Completion</span>
                    <span className="text-xs font-bold text-[#00C9A7]">
                      {Math.round((Object.keys(attendanceRecords).length / mockStudents.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0D1B2A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00C9A7] transition-all duration-500" 
                      style={{ width: `${(Object.keys(attendanceRecords).length / mockStudents.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2" title="Attendance History" description="Your attendance records for this month">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
                  // This is simplified for student view
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                        day % 7 === 0 || day % 7 === 6 ? "bg-[#0D1B2A] text-[#F5F7FA]/20" : "bg-[#1B263B] border border-white/5",
                        day === new Date().getDate() ? "ring-2 ring-[#00C9A7]" : ""
                      )}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00C9A7] rounded-sm"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                  <span>Late</span>
                </div>
              </div>
           </Card>

           <Card title="Your Stats">
              <div className="space-y-10 py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#00C9A7] mb-1">98%</p>
                  <p className="text-[10px] uppercase font-bold text-[#F5F7FA]/40 tracking-widest">Attendance Rating</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#0D1B2A]/50 rounded-xl">
                    <span className="text-xs font-bold text-[#F5F7FA]/60">Days Active</span>
                    <span className="text-sm font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0D1B2A]/50 rounded-xl">
                    <span className="text-xs font-bold text-[#F5F7FA]/60">Unexcused</span>
                    <span className="text-sm font-bold text-red-400">0</span>
                  </div>
                </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}

