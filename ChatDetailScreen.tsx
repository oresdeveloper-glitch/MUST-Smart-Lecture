import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MustPageBackground from '../components/MustPageBackground';
import { cn } from '../utils/cn';
import { ArrowLeft, Send, Paperclip, Mic, MoreVertical, Phone, Video, Pin, CheckCheck } from 'lucide-react';

export default function ChatDetailScreen() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats, chatMessages, sendMessage, user } = useApp();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats.find(c => c.id === chatId);
  const messages = chatMessages[chatId || ''] || [];
  const basePath = `/${user?.role || 'student'}`;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;
    sendMessage(chatId, message.trim());
    setMessage('');
  };

  if (!chat) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 font-medium">Chat not found</p>
        <button onClick={() => navigate(`${basePath}/chat`)} className="mt-4 text-[var(--must-gold)] font-semibold hover:underline">Go back</button>
      </div>
    );
  }

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto relative">
      <MustPageBackground variant="default" />
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(`${basePath}/chat`)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full must-shield-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {chat.type === 'group' ? 'G' : chat.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 dark:text-white">{chat.name}</p>
          <p className="text-xs text-slate-400">{chat.type === 'group' ? 'Class Group' : chat.isOnline ? 'Online' : 'Offline'}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Phone className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Video className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Pinned */}
      {messages.find(m => m.pinned) && (
        <div className="bg-[var(--must-gold)]/5 border-x border-[var(--must-gold)]/20 px-4 py-2 flex items-center gap-2">
          <Pin className="w-3.5 h-3.5 text-[var(--must-gold)]" />
          <p className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1 font-medium">{messages.find(m => m.pinned)?.content}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">No messages yet. Say hello! 👋</div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === user?.id;
            const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId;
            return (
              <div key={msg.id} className={cn('flex gap-2', isMine ? 'justify-end' : 'justify-start')}>
                {!isMine && showAvatar && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--must-gold)] to-[var(--must-gold-light)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    {msg.senderName.charAt(0)}
                  </div>
                )}
                {!isMine && !showAvatar && <div className="w-8 flex-shrink-0" />}
                <div className={cn('max-w-[75%]', isMine ? '' : '')}>
                  {showAvatar && !isMine && <p className="text-[11px] text-slate-400 mb-1 font-medium">{msg.senderName}</p>}
                  <div className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed',
                    isMine ? 'must-shield-bg text-white rounded-br-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md'
                  )}>
                    {msg.type === 'voice' ? '🎤 Voice message' : msg.type === 'file' ? '📎 File shared' : msg.content}
                  </div>
                  <div className={cn('flex items-center gap-1 mt-1', isMine ? 'justify-end' : 'justify-start')}>
                    <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                    {isMine && <CheckCheck className={cn('w-3 h-3', msg.read ? 'text-[var(--must-gold)]' : 'text-slate-300')} />}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className={cn('flex gap-1 mt-0.5', isMine ? 'justify-end' : 'justify-start')}>
                      {msg.reactions.map((r, ri) => <span key={ri} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 shadow-sm">{r}</span>)}
                    </div>
                  )}
                </div>
                {isMine && showAvatar && (
                  <div className="w-8 h-8 rounded-full must-shield-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white dark:bg-slate-900 rounded-b-2xl border border-slate-200 dark:border-slate-800 p-3 flex items-center gap-2">
        <button type="button" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Paperclip className="w-5 h-5" /></button>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[var(--must-gold)]/30 transition-all font-medium"
        />
        {message.trim() ? (
          <button type="submit" className="p-2.5 rounded-xl must-shield-bg text-white hover:opacity-90 transition-all shadow-lg"><Send className="w-5 h-5" /></button>
        ) : (
          <button type="button" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Mic className="w-5 h-5" /></button>
        )}
      </form>
    </div>
  );
}
