import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from 'AppContext';
import { cn } from 'cn';
import { 
  CalendarPlus, Clock, MapPin, Search, 
  CheckCircle, XCircle,
  MoreVertical, CalendarDays
} from 'lucide-react';

import type { Appointment } from 'indexies';
import MustPageBackground from 'MustPageBackground';



export default function AppointmentScreen() {
  const { user } = useApp();

  const basePath = `/${user?.role || 'student'}`;
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'pending'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecId, setSelectedLecId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status, updatedAt: new Date() } : apt
    ));
  };

  const handleBookAppointment = () => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      title: 'New Consultation',
      description: 'Academic consultation requested via student portal.',
      studentId: user?.id || '',
      studentName: user?.name || '',
      lecturerId: selectedLecId || '',
      lecturerName: selectedLecId || '',
      date: new Date(Date.now() + 86400000 * 3),
      startTime: '09:00',
      endTime: '10:00',
      location: 'Staff Office',
      status: 'pending',
      type: 'consultation',
      createdAt: new Date(),
    };

    setAppointments(prev => [newAppt, ...prev]);
    setShowNewModal(false);
    setSelectedLecId(null);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (filter === 'upcoming') return apt.status === 'confirmed' && new Date(apt.date) > new Date();
      if (filter === 'completed') return apt.status === 'completed';
      if (filter === 'pending') return apt.status === 'pending';
      return true;
    }).filter(apt => 
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.lecturerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appointments, filter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project_review': return '📋';
      case 'consultation': return '💡';
      case 'academic_advising': return '🎓';
      default: return '📅';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter-stagger relative">
      <MustPageBackground variant="library" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Book consultations with your lecturers</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--must-gold)] text-[#0a1628] rounded-xl font-bold text-sm hover:bg-[var(--must-gold-light)] transition-all shadow-lg shadow-[var(--must-gold)]/30"
        >
          <CalendarPlus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-blue-500' },
          { label: 'Total', value: appointments.length, color: 'bg-[var(--must-gold)]' },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-4 text-center">
            <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${stat.color}`} />
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium"
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {(['all', 'upcoming', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="premium-card p-8 text-center">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No appointments found</p>
            <p className="text-sm text-slate-400 mt-1">Book your first appointment with a lecturer</p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div key={apt.id} className="premium-card p-4 group hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="bg-[#0a1628] dark:bg-[var(--must-gold)] rounded-xl p-2 text-white dark:text-[#0a1628]">
                    <p className="text-xs font-bold uppercase">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                    <p className="text-xl font-bold">{new Date(apt.date).getDate()}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(apt.type)}</span>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{apt.title}</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">with {apt.lecturerName}</p>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold capitalize border', getStatusColor(apt.status))}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{apt.description}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.startTime} – {apt.endTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{apt.location}</span>
                    {apt.notes && <span className="text-slate-400 italic">"{apt.notes}"</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  {apt.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                        className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-colors" title="Confirm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors" title="Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book New Appointment</h2>
              <p className="text-sm text-slate-500 mt-1">Schedule a meeting with your lecturer</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Lecturer Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lecturer Name</label>
                <input
                  type="text"
                  value={selectedLecId || ''}
                  onChange={e => setSelectedLecId(e.target.value)}
                  placeholder="Enter lecturer name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium"
                />
              </div>

              {/* Quick Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Appointment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'consultation', label: 'Consultation', icon: '💡' },
                    { id: 'project_review', label: 'Project Review', icon: '📋' },
                    { id: 'academic_advising', label: 'Academic Advising', icon: '🎓' },
                    { id: 'other', label: 'Other', icon: '📅' },
                  ].map(type => (
                    <button key={type.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors">
                      <span className="text-lg">{type.icon}</span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button 
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBookAppointment}
                disabled={!selectedLecId}
                className="flex-1 py-2.5 rounded-xl bg-[var(--must-gold)] text-[#0a1628] font-bold hover:bg-[var(--must-gold-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
