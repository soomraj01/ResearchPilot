import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Shield, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-slate-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-slate-500">Manage your account and preferences</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              Verified Researcher
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-black/[0.04]">
          <h3 className="text-lg font-medium text-slate-800">Account Settings</h3>
          
          <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-800">Preferences</p>
                <p className="text-xs text-slate-500">Theme, notifications, and AI settings</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100/50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-rose-600">Sign Out</p>
                <p className="text-xs text-rose-400">Log out of this device</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
