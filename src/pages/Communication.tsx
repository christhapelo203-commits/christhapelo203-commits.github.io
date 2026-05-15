import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { 
  Hash, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Search,
  Bell,
  Volume2,
  Users,
  MessageCircle,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToDocuments, createDocument } from '../services/db';
import { where, orderBy, limit } from 'firebase/firestore';
import type { Message, Channel } from '../types';
import { format } from 'date-fns';

export default function Communication() {
  const { profile, user } = useAuth();
  const [activeChannelId, setActiveChannelId] = useState('1');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // Initial mock channels if none exist
  const mockChannels: Channel[] = [
    { id: '1', name: 'Grade 10 - Mathematics', type: 'group', class_id: 'math10', createdAt: new Date().toISOString() },
    { id: '2', name: 'Science Projects', type: 'group', class_id: 'sci10', createdAt: new Date().toISOString() },
    { id: '3', name: 'School Announcements', type: 'announcement', class_id: 'school', createdAt: new Date().toISOString() },
  ];

  useEffect(() => {
    const unsub = subscribeToDocuments<Channel>('channels', [], (data) => {
      if (data.length > 0) {
        setChannels(data);
        if (!activeChannelId) setActiveChannelId(data[0].id);
      } else {
        setChannels(mockChannels);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!activeChannelId) return;

    const unsub = subscribeToDocuments<Message>(
      'messages',
      [where('channel_id', '==', activeChannelId), orderBy('createdAt', 'asc')],
      (data) => {
        setMessages(data);
      }
    );
    return () => unsub();
  }, [activeChannelId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user || !profile) return;

    try {
      await createDocument('messages', {
        channel_id: activeChannelId,
        sender_id: user.uid,
        sender_name: profile.name,
        sender_role: profile.role,
        content: messageText,
        createdAt: new Date().toISOString()
      } as any);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId) || mockChannels[0];

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] flex gap-8 bg-[#0D1B2A]">
      {/* Channels List */}
      <aside className="hidden lg:flex flex-col w-80 bg-[#1B263B] rounded-3xl border border-[#00C9A7]/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display tracking-tight">Channels</h2>
            <button className="p-2 bg-[#00C9A7]/10 text-[#00C9A7] rounded-xl hover:bg-[#00C9A7]/20 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F7FA]/30" />
            <input 
              type="text" 
              placeholder="Filter channels..."
              className="w-full bg-[#0D1B2A] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#00C9A7]/30 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-2xl transition-all group",
                activeChannelId === channel.id 
                  ? "bg-[#00C9A7] text-[#0D1B2A] shadow-lg shadow-[#00C9A7]/10" 
                  : "text-[#F5F7FA]/60 hover:bg-[#00C9A7]/5 hover:text-[#00C9A7]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border",
                  activeChannelId === channel.id ? "bg-[#0D1B2A]/10 border-[#0D1B2A]/10" : "bg-[#0D1B2A] border-white/5"
                )}>
                  {channel.type === 'announcement' ? <Volume2 className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold truncate max-w-[120px]">{channel.name}</p>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", activeChannelId === channel.id ? "text-[#0D1B2A]/60" : "text-[#F5F7FA]/20")}>
                    {channel.type}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col bg-[#1B263B] lg:rounded-3xl border border-[#00C9A7]/5 overflow-hidden shadow-sm">
        {/* Chat Header */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1B263B]/50 backdrop-blur-sm z-10 font-sans">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 bg-[#00C9A7]/10 text-[#00C9A7] rounded-xl">
               <MessageCircle className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold tracking-tight">
                 {activeChannel?.name}
               </h3>
               <div className="flex items-center gap-2 mt-0.5">
                 <span className="w-2 h-2 bg-[#00C9A7] rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-bold text-[#F5F7FA]/30 uppercase tracking-widest">12 Members Online</span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#F5F7FA]/30 hover:text-[#00C9A7] transition-colors"><Bell className="w-5 h-5" /></button>
            <button className="p-2 text-[#F5F7FA]/30 hover:text-[#00C9A7] transition-colors"><Users className="w-5 h-5" /></button>
            <button className="p-2 text-[#F5F7FA]/30 hover:text-[#00C9A7] transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === user?.uid;
              const isTeacher = (msg as any).sender_role === 'teacher';
              
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: isTeacher ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex gap-4 max-w-2xl group font-sans",
                    isTeacher || !isMe ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 font-bold text-xs ring-4 ring-[#1B263B]",
                    isTeacher ? "bg-[#00C9A7] border-[#00C9A7]/10 text-[#0D1B2A]" : "bg-[#0D1B2A] border-white/5 text-blue-400"
                  )}>
                    {(msg as any).sender_name?.charAt(0) || 'U'}
                  </div>
                  <div className={cn("space-y-1.5", isTeacher || !isMe ? "text-left" : "text-right")}>
                    <div className={cn("flex items-center gap-3", isTeacher || !isMe ? "" : "flex-row-reverse")}>
                      <span className="text-xs font-bold text-[#F5F7FA]">{(msg as any).sender_name}</span>
                      <span className="text-[10px] font-bold text-[#F5F7FA]/20 uppercase tracking-widest">
                        {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : '...'}
                      </span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      isTeacher || !isMe 
                        ? "bg-[#0D1B2A] text-[#F5F7FA]/80 rounded-tl-none border border-white/5" 
                        : "bg-[#00C9A7] text-[#0D1B2A] font-medium rounded-tr-none shadow-lg shadow-[#00C9A7]/10"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-6 bg-[#1B263B] font-sans">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#00C9A7]/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="relative bg-[#0D1B2A] border border-white/5 rounded-3xl p-2 flex items-end gap-2 focus-within:border-[#00C9A7]/30 transition-all shadow-inner">
               <button type="button" className="p-3 text-[#F5F7FA]/30 hover:text-[#00C9A7] transition-all bg-white/5 rounded-2xl">
                 <Paperclip className="w-5 h-5" />
               </button>
               <textarea 
                 value={messageText}
                 onChange={(e) => setMessageText(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSendMessage(e as any);
                   }
                 }}
                 placeholder="Compose a message..."
                 className="flex-1 bg-transparent border-none outline-none text-sm p-3 resize-none max-h-32 min-h-12 scrollbar-hide font-medium"
                 rows={1}
               />
               <div className="flex items-center gap-1">
                 <button type="button" className="p-3 text-[#F5F7FA]/30 hover:text-[#00C9A7] transition-all">
                   <Smile className="w-5 h-5" />
                 </button>
                 <button 
                   type="submit"
                   disabled={!messageText.trim()}
                   className="p-3 bg-[#00C9A7] text-[#0D1B2A] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00C9A7]/20 disabled:opacity-50 disabled:scale-100"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-10">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-[#00C9A7] rounded-full"></div>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F7FA]/20">Auto-save Enabled</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F7FA]/20">Encrypted Channel</span>
             </div>
          </div>
        </form>
      </section>
    </div>
  );
}

