import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, Announcement, Note, Assignment, Chat, ChatMessage, AttendanceRecord, Notification, Badge, LeaderboardEntry, AnalyticsData, Course } from '../types';



interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  courses: Course[];
  announcements: Announcement[];
  notes: Note[];
  assignments: Assignment[];
  chats: Chat[];
  chatMessages: Record<string, ChatMessage[]>;
  attendanceRecords: AttendanceRecord[];
  notifications: Notification[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  analytics: AnalyticsData;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleBookmark: (noteId: string) => void;
  submitAssignment: (id: string) => void;
  sendMessage: (chatId: string, content: string, type?: 'text' | 'file' | 'voice' | 'image') => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'read' | 'senderId' | 'senderName'>) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'date'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'downloads' | 'bookmarked' | 'uploaderId' | 'uploaderName'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'submitted' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [badges] = useState<Badge[]>([]);
  const [leaderboard] = useState<LeaderboardEntry[]>([]);
  const [analytics] = useState<AnalyticsData>({
    totalStudents: 0, totalLecturers: 0, totalCourses: 0,
    attendanceRate: 0, latenessRate: 0, activeUsers: 0, engagementScore: 0, weeklyTrend: [],
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartlecture_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    return { success: false, error: 'Invalid credentials. Please sign up first.' };
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: '',
      department: 'Pending',
      faculty: 'Pending',
      studentId: role === 'student' ? `STU-${Date.now()}` : undefined,
      staffId: role === 'lecturer' ? `STF-${Date.now()}` : undefined,
      createdAt: new Date(),
      verified: true,
    };
    setUser(newUser);
    localStorage.setItem('smartlecture_user', JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('smartlecture_user');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      localStorage.setItem('smartlecture_user', JSON.stringify(updated));
    }
  }, [user]);

  const toggleDarkMode = useCallback(() => setDarkMode((d: boolean) => !d), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleBookmark = useCallback((noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, bookmarked: !n.bookmarked } : n));
  }, []);

  const submitAssignment = useCallback((id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, submitted: true, submittedAt: new Date() } : a));
  }, []);

  const sendMessage = useCallback((chatId: string, content: string, type: 'text' | 'file' | 'voice' | 'image' = 'text') => {
    if (!user) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content,
      type,
      timestamp: new Date(),
      read: false,
      reactions: [],
      pinned: false,
    };
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessage: newMsg } : c));
  }, [user]);

  const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id' | 'createdAt' | 'read' | 'senderId' | 'senderName'>) => {
    if (!user) return;
    const newAnn: Announcement = {
      ...announcement,
      id: `a-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      createdAt: new Date(),
      read: false,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  }, [user]);

  const markAttendance = useCallback((record: Omit<AttendanceRecord, 'id' | 'date'>) => {
    const newRec: AttendanceRecord = { ...record, id: `at-${Date.now()}`, date: new Date() };
    setAttendanceRecords(prev => [newRec, ...prev]);
  }, []);

  const addCourse = useCallback((course: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...course, id: `c-${Date.now()}` };
    setCourses(prev => [...prev, newCourse]);
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'downloads' | 'bookmarked' | 'uploaderId' | 'uploaderName'>) => {
    if (!user) return;
    const newNote: Note = { ...note, id: `n-${Date.now()}`, createdAt: new Date(), downloads: 0, bookmarked: false, uploaderId: user.id, uploaderName: user.name };
    setNotes(prev => [newNote, ...prev]);
  }, [user]);

  const addAssignment = useCallback((assignment: Omit<Assignment, 'id' | 'submitted' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: `as-${Date.now()}`,
      submitted: false,
      createdAt: new Date(),
    };
    setAssignments(prev => [newAssignment, ...prev]);
  }, []);

  const value: AppContextType = {
    user, isAuthenticated: !!user, isLoading, login, signup, logout, switchRole,
    darkMode, toggleDarkMode,
    courses, announcements, notes, assignments, chats, chatMessages, attendanceRecords, notifications, badges, leaderboard, analytics,
    markNotificationRead, markAllNotificationsRead, toggleBookmark, submitAssignment, sendMessage, addAnnouncement, markAttendance, addCourse, deleteCourse, addNote, addAssignment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
