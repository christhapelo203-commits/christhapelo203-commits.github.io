import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  User as UserIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import NotificationDropdown from './NotificationDropdown';
import Onboarding from '../common/Onboarding';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'teacher', 'student', 'parent'] },
  { path: '/attendance', icon: MapPin, label: 'Attendance', roles: ['admin', 'teacher'] },
  { path: '/homework', icon: BookOpen, label: 'Homework', roles: ['admin', 'teacher', 'student'] },
  { path: '/assessments', icon: BarChart3, label: 'Assessments', roles: ['admin', 'teacher', 'student'] },
  { path: '/messages', icon: MessageSquare, label: 'Communication', roles: ['admin', 'teacher', 'student', 'parent'] },
  { path: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin'] },
];

export default function Layout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('edutrack_onboarded')
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const finishOnboarding = () => {
    localStorage.setItem('edutrack_onboarded', 'true');
    setShowOnboarding(false);
  };

  const filteredNavItems = navItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {showOnboarding && <Onboarding onComplete={finishOnboarding} />}
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0D1B2A] border-r border-[#00C9A7]/10 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#00C9A7] rounded-xl flex items-center justify-center">
            <span className="text-[#0D1B2A] font-bold text-xl">E</span>
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">EduTrack</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#00C9A7] text-[#0D1B2A] shadow-lg shadow-[#00C9A7]/20" 
                  : "text-[#F5F7FA]/60 hover:text-[#00C9A7] hover:bg-[#00C9A7]/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#00C9A7]/10 space-y-2">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-[#F5F7FA]/60 hover:text-[#00C9A7] hover:bg-[#00C9A7]/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-[#F5F7FA]/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0D1B2A]">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-[#0D1B2A]/80 backdrop-blur-md border-b border-[#00C9A7]/10 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F7FA]/30" />
              <input 
                id="global-search"
                type="text" 
                placeholder="Search students, homework..."
                className="w-full bg-[#1B263B] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#00C9A7] transition-all outline-none"
                onChange={(e) => console.log('Searching for:', e.target.value)}
              />
            </div>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00C9A7] rounded-lg flex items-center justify-center">
                <span className="text-[#0D1B2A] font-bold text-base">E</span>
              </div>
              <span className="font-bold text-sm">EduTrack</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <NotificationDropdown />
            
            <div className="flex items-center gap-3 pl-4 border-l border-[#00C9A7]/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{profile?.name}</p>
                <p className="text-[10px] text-[#00C9A7] uppercase tracking-wider font-medium">{profile?.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B263B] border border-[#00C9A7]/10 overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 m-2 text-[#F5F7FA]/30" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </section>

        {/* Bottom Navigation - Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0D1B2A]/90 backdrop-blur-xl border-t border-[#00C9A7]/10 flex items-center justify-around px-2 z-20">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-[#00C9A7]" 
                  : "text-[#F5F7FA]/40"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
