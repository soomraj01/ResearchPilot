import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [role, setRole] = useState('');
  const [useCase, setUseCase] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name && email && password) {
      setStep(2);
    } else if (step === 2 && role) {
      setStep(3);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      if (data.data?.token) {
        const token = data.data.token;
        const user = data.data.user;
        login(token, user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setStep(1); 
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ["PhD Student", "Postdoc", "Professor", "Industry Researcher", "Analyst", "Other"];
  const useCases = ["Academic Research", "Corporate R&D", "Innovation Strategy", "Personal Study"];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary-bg relative">
      <div className="z-10 w-full max-w-[480px] p-10 bg-card-bg rounded-2xl mx-4 relative overflow-hidden shadow-premium border border-border-subtle">
        
        <div className="flex flex-col items-center mb-8 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent-brown/10 border border-accent-brown/20 flex items-center justify-center mb-1">
            <BookOpen className="w-5 h-5 text-accent-brown" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-primary-text tracking-tight">Create Account</h2>
            <div className="flex items-center gap-2 mt-3 justify-center">
              <div className={`w-8 h-1 rounded-full ${step >= 1 ? 'bg-accent-brown' : 'bg-black/5'}`}></div>
              <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-accent-brown' : 'bg-black/5'}`}></div>
              <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-accent-brown' : 'bg-black/5'}`}></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[13px] text-center">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-secondary-text" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg premium-input text-[14px]"
                placeholder="e.g. Alex Johnson"
              />
            </div>
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
              className="w-full py-2.5 mt-4 rounded-lg premium-button-primary flex justify-center items-center gap-2 text-[14px]"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-3">
              <label className="block text-[13px] font-medium text-secondary-text">What is your primary role?</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-3 text-[13px] font-medium rounded-lg border text-left transition-all ${
                      role === r 
                        ? 'border-accent-brown bg-accent-brown/5 text-accent-brown shadow-sm' 
                        : 'border-border-subtle bg-primary-bg text-secondary-text hover:border-black/10 hover:text-primary-text'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-lg premium-button-secondary flex justify-center items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!role}
                className="flex-1 py-2.5 rounded-lg premium-button-primary disabled:opacity-50 flex justify-center items-center gap-2 text-[14px]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-3">
              <label className="block text-[13px] font-medium text-secondary-text">Primary Use Case</label>
              <div className="grid grid-cols-1 gap-3">
                {useCases.map(uc => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => setUseCase(uc)}
                    className={`p-3.5 text-[13px] font-medium rounded-lg border text-left transition-all ${
                      useCase === uc 
                        ? 'border-accent-brown bg-accent-brown/5 text-accent-brown shadow-sm' 
                        : 'border-border-subtle bg-primary-bg text-secondary-text hover:border-black/10 hover:text-primary-text'
                    }`}
                  >
                    {uc}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-lg premium-button-secondary flex justify-center items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!useCase || isLoading}
                className="flex-1 py-2.5 rounded-lg premium-button-primary disabled:opacity-50 flex justify-center items-center gap-2 text-[14px]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Setup'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-[13px] text-secondary-text">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent-brown hover:underline transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
