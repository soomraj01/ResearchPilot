import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.data?.token) {
        const token = data.data.token;
        const user = data.data.user;
        login(token, user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary-bg relative">
      <div className="z-10 w-full max-w-[420px] p-10 bg-card-bg rounded-2xl mx-4 relative overflow-hidden shadow-premium border border-border-subtle">
        
        <div className="flex flex-col items-center mb-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-accent-brown/10 border border-accent-brown/20 flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6 text-accent-brown" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-primary-text tracking-tight">ResearchPilot</h2>
            <p className="text-[13px] text-secondary-text mt-1 font-serif italic tracking-wide">Built for serious research.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[13px] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-secondary-text" htmlFor="email">Work Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg premium-input text-[14px]"
              placeholder="e.g. alex@university.edu"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-secondary-text" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg premium-input text-[14px]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-lg premium-button-primary disabled:opacity-70 flex justify-center items-center gap-2 text-[14px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[13px] text-secondary-text">
          New to ResearchPilot?{' '}
          <Link to="/register" className="font-medium text-accent-brown hover:underline transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
