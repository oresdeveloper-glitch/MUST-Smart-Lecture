import { useNavigate } from 'react-router-dom';
import MustPageBackground from '../components/MustPageBackground';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { Search, MessageSquare, Users, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ChatScreen() {
  const navigate = useNavigate();
  const { chats, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const basePath = `/${user?.role || 'student'}`;
  const filtered = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter-stagger relative">
      <MustPageBackground variant="default" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Messages</h1>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">{chats.length} conversations</p>
        </div>
        <button className="p-2.5 rounded-xl must-shield-bg text-white hover:opacity-90 transition-all shadow-lg shadow-[#0a1628]/20">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[var(--must-gold)]/30 focus:border-[var(--must-gold)]/50 transition-all font-medium"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 premium-card">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No conversations yet</p>
            <p className="text-xs text-slate-400 mt-1">Start a new chat to connect</p>
          </div>
        ) : (
          filtered.map(chat => (
            <button
              key={chat.id}
              onClick={() => navigate(`${basePath}/chat/${chat.id}`)}
              className="w-full premium-card p-4 flex items-center gap-3 text-left group"
            >
              <div className="relative flex-shrink-0">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
                  chat.type === 'group' ? 'must-shield-bg' : 'bg-gradient-to-br from-[var(--must-gold)] to-[var(--must-gold-light)]'
                )}>
                  {chat.type === 'group' ? <Users className="w-5 h-5" /> : chat.name.charAt(0)}
                </div>
                {chat.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn('font-semibold text-sm', chat.unread > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300')}>{chat.name}</p>
                  {chat.lastMessage && <span className="text-[11px] text-slate-400 flex-shrink-0">{timeAgo(chat.lastMessage.timestamp)}</span>}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-slate-400 truncate">
                    {chat.lastMessage?.type === 'voice' ? '🎤 Voice message' : chat.lastMessage?.type === 'file' ? '📎 File' : chat.lastMessage?.content || 'No messages'}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-[var(--must-gold)] text-[#0a1628] text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">{chat.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
