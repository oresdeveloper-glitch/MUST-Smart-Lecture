import { useState } from 'react';
import MustPageBackground from 'MustPageBackground';
import { useApp } from 'AppContext';
import { cn } from 'cn';
import { ClipboardList, Clock, Upload, CheckCircle, XCircle, AlertCircle, Plus, Download, Star, X } from 'lucide-react';

export default function AssignmentScreen() {
  const { assignments, submitAssignment, user, addAssignment, courses } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isLecturer = user?.role === 'lecturer';

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxScore, setMaxScore] = useState('100');

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return !a.submitted;
    if (filter === 'submitted') return a.submitted && !a.grade;
    if (filter === 'graded') return a.grade !== undefined;
    return true;
  });

  const getDaysLeft = (deadline: Date) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    return days;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !deadline) return;

    const selectedCourse = courses.find(c => c.id === courseId);
    
    addAssignment({
      title,
      description,
      courseId,
      courseName: selectedCourse?.name || 'Unknown Course',
      deadline: new Date(deadline),
      maxScore: parseInt(maxScore),
    });

    // Reset
    setTitle('');
    setDescription('');
    setCourseId('');
    setDeadline('');
    setMaxScore('100');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      <MustPageBackground variant="default" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{assignments.length} total • {assignments.filter(a => !a.submitted).length} pending</p>
        </div>
        {isLecturer && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-medium text-sm hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Create New Assignment</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
            
            <select required value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>

            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions..." rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Deadline</label>
                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Max Score</label>
                <input type="number" required value={maxScore} onChange={e => setMaxScore(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors text-sm">
              Post Assignment
            </button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all', filter === f ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>{f}</button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No assignments found</p>
          </div>
        ) : (
          filtered.map(assignment => {
            const daysLeft = getDaysLeft(assignment.deadline);
            const isOverdue = daysLeft < 0;
            const isUrgent = daysLeft >= 0 && daysLeft <= 2;

            return (
              <div key={assignment.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {assignment.submitted && assignment.grade !== undefined ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : assignment.submitted ? (
                        <Clock className="w-5 h-5 text-blue-500" />
                      ) : isOverdue ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      )}
                      <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{assignment.courseName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{assignment.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium',
                      isOverdue ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                      isUrgent ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                      'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    )}>
                      {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Deadline: {new Date(assignment.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>Max Score: {assignment.maxScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {assignment.grade !== undefined ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{assignment.grade}/{assignment.maxScore}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    ) : assignment.submitted ? (
                      <span className="text-xs text-blue-500 font-medium">Submitted - Awaiting grade</span>
                    ) : (
                      <button onClick={() => submitAssignment(assignment.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Submit
                      </button>
                    )}
                    {assignment.fileUrl && (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {assignment.feedback && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-0.5">Feedback:</p>
                    <p className="text-sm text-green-800 dark:text-green-200">{assignment.feedback}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
