import React, { useState } from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';
import type { User, UserRole } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science');
  const [college] = useState('School of Engineering & Tech');
  const [academicYear] = useState('3rd Year');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const allUsers = db.getAllUsers();
      const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        db.setCurrentUserId(existing.id);
        showToast('Welcome back!', `Signed in as ${existing.full_name}`, 'success');
        onSuccess(existing);
      } else {
        const newUser = db.createUser({
          full_name: email.split('@')[0] || 'Campus User',
          email,
          role,
          college,
          department,
          academic_year: academicYear,
          profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        });
        showToast('Account Created 🎉', `Signed in as ${newUser.full_name}`, 'success');
        onSuccess(newUser);
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        showToast('Validation Error', 'Please fill out all required fields.', 'error');
        return;
      }

      const newUser = db.createUser({
        full_name: fullName,
        email,
        role,
        college,
        department,
        academic_year: academicYear,
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      });
      showToast('Registration Successful 🎉', `Welcome to Campus Event Manager!`, 'success');
      onSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-orange-500/30 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 p-0.5 shadow-glow-orange">
            <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 font-heading">
              {isLogin ? 'Sign In to Account' : 'Create Campus Account'}
            </h3>
            <p className="text-xs text-slate-400">Campus Event Management Platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Campus Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex.chen@campus.edu"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:border-orange-500 font-semibold"
            >
              <option value="student">Student</option>
              <option value="organizer">Event Organizer</option>
              <option value="admin">Campus Administrator</option>
            </select>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:border-orange-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white font-bold text-xs rounded-xl shadow-glow-orange hover:brightness-110 flex items-center justify-center space-x-2 transition-all cursor-pointer font-heading"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-400 font-bold hover:underline cursor-pointer"
          >
            {isLogin ? 'Register Here' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
};
