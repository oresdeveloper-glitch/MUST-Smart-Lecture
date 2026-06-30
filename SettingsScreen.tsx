import { useApp } from 'AppContext';
import MustPageBackground from 'MustPageBackground';
import { cn } from 'cn';
import { Moon, Sun, Bell, Globe, Shield, Wifi, Download, User, LogOut, ChevronRight, Volume2, Languages, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode, user, logout } = useApp();
  const navigate = useNavigate();

  const basePath = `/${user?.role || 'student'}`;

  const sections = [
    {
      title: 'Appearance',
      items: [
        { icon: darkMode ? Moon : Sun, label: 'Dark Mode', action: () => toggleDarkMode(), right: (
          <button onClick={toggleDarkMode} className={cn('w-11 h-6 rounded-full relative transition-colors', darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')}>
            <div className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', darkMode ? 'translate-x-5' : 'translate-x-0.5')} />
          </button>
        )},
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Push Notifications', right: <div className="w-11 h-6 rounded-full bg-blue-600 relative"><div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow" /></div> },
        { icon: Volume2, label: 'Voice Reminders', right: <div className="w-11 h-6 rounded-full bg-blue-600 relative"><div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow" /></div> },
        { icon: Bell, label: 'Pre-lecture Alerts', right: <div className="w-11 h-6 rounded-full bg-blue-600 relative"><div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow" /></div> },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Languages, label: 'Language', right: <span className="text-sm text-gray-400">English</span>, action: () => {} },
        { icon: Calendar, label: 'Calendar Sync', right: <div className="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative"><div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow" /></div> },
        { icon: Wifi, label: 'Offline Mode', right: <span className="text-sm text-green-600 font-medium">Enabled</span> },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        { icon: Download, label: 'Downloaded Notes', right: <span className="text-sm text-gray-400">124 MB</span>, action: () => {} },
        { icon: Download, label: 'Clear Cache', right: <span className="text-sm text-gray-400">45 MB</span>, action: () => {} },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', action: () => navigate(`${basePath}/profile`), right: <ChevronRight className="w-4 h-4 text-gray-400" /> },
        { icon: Shield, label: 'Privacy & Security', action: () => {}, right: <ChevronRight className="w-4 h-4 text-gray-400" /> },
        { icon: Globe, label: 'About SmartLecture', right: <span className="text-sm text-gray-400">v1.0.0</span> },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <MustPageBackground variant="default" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Customize your experience</p>
      </div>

      <div className="space-y-4">
        {sections.map((section, si) => (
          <div key={si} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <h3 className="px-5 pt-4 pb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{section.title}</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {section.items.map((item, ii) => (
                <button key={ii} onClick={item.action} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  {item.right}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="w-full py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}
