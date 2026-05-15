import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToDocuments } from '../../services/db';
import { where, limit, orderBy } from 'firebase/firestore';
import type { Notification } from '../../types';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToDocuments<Notification>(
      'notifications',
      [where('user_id', '==', user.uid), orderBy('createdAt', 'desc'), limit(10)],
      (data) => {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Mock notifications if DB is empty for demo purposes
  const displayNotifications = notifications.length > 0 ? notifications : [
    { id: '1', type: 'attendance', message: 'Your child was marked Present for Chemistry.', read: false, createdAt: new Date().toISOString() },
    { id: '2', type: 'homework', message: 'New Algebra assignment posted by Mr. Henderson.', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#F5F7FA]/60 hover:text-[#00C9A7] transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {(unreadCount > 0 || displayNotifications.some(n => !n.read)) && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#00C9A7] rounded-full ring-2 ring-[#0D1B2A]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-[#1B263B] border border-[#00C9A7]/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-sm">Notifications</h3>
                <span className="text-[10px] font-bold text-[#00C9A7] uppercase tracking-widest bg-[#00C9A7]/10 px-2 py-0.5 rounded-full">
                  Recent
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {displayNotifications.map((notif: any) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "p-4 border-b border-white/5 last:border-0 hover:bg-[#0D1B2A]/50 transition-colors cursor-pointer group",
                      !notif.read && "bg-[#00C9A7]/5"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        notif.type === 'attendance' ? "bg-blue-500/10 text-blue-400" : "bg-[#00C9A7]/10 text-[#00C9A7]"
                      )}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-xs leading-relaxed mb-1", notif.read ? "text-[#F5F7FA]/60" : "text-[#F5F7FA] font-medium")}>
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#F5F7FA]/30 font-medium">
                            {formatDistanceToNow(new Date(notif.createdAt))} ago
                          </span>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 bg-[#00C9A7] rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full p-3 bg-[#0D1B2A] text-[#00C9A7] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00C9A7]/5 transition-all">
                View All Notifications
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
