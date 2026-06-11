import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, ChevronDown, Activity, 
  CheckCircle2, CircleDashed, ChevronRight, BookOpen,
  LayoutDashboard, Folder, FileText, MessageSquare, Lightbulb, Package
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useActivity } from '../../context/ActivityContext';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspace();
  const { activities } = useActivity();
  
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await axios.get('/api/workspace');
        setWorkspaces(data.data || []);
      } catch (err) {
        console.error('Failed to fetch workspaces');
      }
    };
    if (user) fetchWorkspaces();
  }, [user]);

  useEffect(() => {
    const match = location.pathname.match(/\/workspace\/([^/]+)/);
    const urlWorkspaceId = match ? match[1] : null;
    if (urlWorkspaceId && urlWorkspaceId !== activeWorkspaceId) {
      setActiveWorkspaceId(urlWorkspaceId);
    }
  }, [location.pathname, activeWorkspaceId, setActiveWorkspaceId]);

  const activeWorkspace = workspaces.find(w => w._id === activeWorkspaceId);

  const handleWorkspaceSwitch = (id: string) => {
    setActiveWorkspaceId(id);
    setIsWorkspaceMenuOpen(false);
    navigate(`/workspace/${id}/papers`);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Workspaces', path: '/workspace', icon: Folder },
    { name: 'Papers', path: activeWorkspaceId ? `/workspace/${activeWorkspaceId}/papers` : '/workspace', icon: FileText, disabled: !activeWorkspaceId },
    { name: 'Research Chat', path: activeWorkspaceId ? `/workspace/${activeWorkspaceId}/chat` : '/workspace', icon: MessageSquare, disabled: !activeWorkspaceId },
    { name: 'Insights', path: activeWorkspaceId ? `/workspace/${activeWorkspaceId}/insights` : '/workspace', icon: Lightbulb, disabled: !activeWorkspaceId },
    { name: 'Artifacts', path: activeWorkspaceId ? `/workspace/${activeWorkspaceId}/artifacts` : '/workspace', icon: Package, disabled: !activeWorkspaceId },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-primary-bg text-primary-text font-sans flex flex-col selection:bg-accent-brown/20">
      
      {/* Top Navigation */}
      <header className="h-14 shrink-0 w-full bg-card-bg border-b border-border-subtle flex items-center justify-between px-6 z-30 shadow-sm relative">
        
        {/* Left: Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group w-64" 
          onClick={() => navigate('/')}
        >
          <div className="w-7 h-7 rounded-md bg-accent-brown/10 flex items-center justify-center text-accent-brown transition-all">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-[15px] tracking-tight text-primary-text">
            ResearchPilot
          </span>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-secondary-text" />
          </div>
          <input
            type="text"
            placeholder="Search papers, citations, authors, insights..."
            className="w-full h-9 bg-primary-bg border border-border-subtle rounded-lg pl-10 pr-4 text-sm text-primary-text placeholder-secondary-text/70 focus:outline-none focus:border-accent-brown/50 focus:ring-1 focus:ring-accent-brown/30 transition-all duration-250 ease-apple shadow-inner"
          />
        </div>

        {/* Right: Actions & Workspace Switcher */}
        <div className="flex items-center gap-4 select-none justify-end w-auto">
          
          {/* Workspace Switcher */}
          {user && (
            <div className="relative">
              <button 
                onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-black/5 transition-colors border border-border-subtle bg-card-bg shadow-sm"
              >
                <Folder className="w-3.5 h-3.5 text-accent-brown" />
                <span className="text-[13px] font-medium text-primary-text max-w-[150px] truncate">
                  {activeWorkspace ? activeWorkspace.title : 'Select Workspace'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-secondary-text ml-1" />
              </button>
              
              <AnimatePresence>
                {isWorkspaceMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-card-bg rounded-xl py-1 z-50 shadow-lg border border-border-subtle"
                  >
                    <div className="px-3 py-2 text-[10px] font-semibold text-secondary-text uppercase tracking-wider border-b border-border-subtle mb-1">
                      Your Workspaces
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {workspaces.map(ws => (
                        <button
                          key={ws._id}
                          onClick={() => handleWorkspaceSwitch(ws._id)}
                          className="w-full text-left px-3 py-2 text-[13px] text-primary-text hover:bg-black/5 transition-colors flex items-center justify-between"
                        >
                          <span className="truncate pr-4 font-medium">{ws.title}</span>
                          {ws._id === activeWorkspaceId && <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />}
                        </button>
                      ))}
                      {workspaces.length === 0 && (
                        <div className="px-3 py-4 text-xs text-secondary-text text-center">
                          No workspaces found.
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-border-subtle mt-1">
                      <button 
                        onClick={() => { setIsWorkspaceMenuOpen(false); navigate('/workspace'); }}
                        className="w-full text-center py-1.5 text-[13px] font-medium text-accent-brown hover:bg-accent-brown/5 rounded transition-colors"
                      >
                        + Create Workspace
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="h-5 w-px bg-border-subtle mx-1"></div>

          <button className="text-secondary-text hover:text-primary-text transition-colors relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border-2 border-card-bg"></span>
          </button>

          {user ? (
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-brown/10 hover:bg-accent-brown/20 transition-colors border border-accent-brown/20 text-[13px] font-semibold text-accent-brown"
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-primary-text hover:text-accent-brown transition-colors"
            >
              Log in
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-60 shrink-0 bg-card-bg border-r border-border-subtle flex flex-col z-20">
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.disabled ? '#' : link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    link.disabled 
                      ? 'text-secondary-text/50 cursor-not-allowed'
                      : isActive
                        ? 'bg-accent-brown/10 text-accent-brown'
                        : 'text-secondary-text hover:bg-black/5 hover:text-primary-text'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Central Router Outlet */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-primary-bg">
          <Outlet />
        </main>

        {/* Right Sidebar: Activity Panel */}
        <aside className={`shrink-0 bg-card-bg border-l border-border-subtle transition-all duration-300 ease-apple flex flex-col z-20 ${
          rightPanelOpen ? 'w-80' : 'w-12'
        }`}>
          <div className="h-14 border-b border-border-subtle flex items-center justify-between px-3">
            <div className={`flex items-center gap-2 overflow-hidden transition-opacity duration-200 ${rightPanelOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              <Activity className="w-4 h-4 text-accent-brown" />
              <span className="text-[13px] font-semibold text-primary-text tracking-tight">Research Progress</span>
            </div>
            <button 
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-secondary-text transition-colors shrink-0"
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ease-apple ${rightPanelOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {rightPanelOpen && (
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="space-y-6">
                
                {/* Active Agent Status */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-bg border border-border-subtle">
                  <div className="mt-0.5 relative flex items-center justify-center w-5 h-5">
                    <span className="absolute w-full h-full rounded-full bg-status-success/20 animate-ping"></span>
                    <span className="relative w-2 h-2 rounded-full bg-status-success"></span>
                  </div>
                  <div>
                    <h5 className="text-[13px] font-semibold text-primary-text leading-none mb-1">Agent Active</h5>
                    <p className="text-[11px] text-secondary-text leading-snug">
                      Listening for research queries and synthesizing context.
                    </p>
                  </div>
                </div>

                {/* Checklist-style Timeline */}
                <div>
                  <div className="text-[10px] font-semibold text-secondary-text uppercase tracking-widest px-1 mb-4">
                    Current Milestone
                  </div>
                  
                  <div className="relative pl-5 space-y-6 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-px before:bg-border-subtle">
                    
                    {/* Fake human-friendly steps */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-[7px] h-[7px] rounded-full bg-status-success outline outline-[3px] outline-card-bg" />
                      <div className="text-[13px] font-medium text-primary-text mb-0.5">Workspace Context Initialized</div>
                      <div className="text-[11px] text-secondary-text">
                        {activeWorkspace ? `Connected to ${activeWorkspace.title}` : 'Awaiting workspace selection'}
                      </div>
                    </div>

                    {activities.length > 0 ? activities.map((act) => {
                      const isPending = act.status === 'pending';
                      
                      // Map technical messages to human friendly ones loosely
                      let humanMsg = act.message;
                      if (humanMsg.includes("database")) humanMsg = "Retrieving sources from library";
                      if (humanMsg.includes("embedding")) humanMsg = "Analyzing document text";
                      if (humanMsg.includes("LLaMa") || humanMsg.includes("Synthesizing")) humanMsg = "Generating research brief";
                      if (humanMsg.includes("indexed")) humanMsg = "Paper successfully analyzed";
                      
                      return (
                        <div key={act.id} className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                          {isPending ? (
                            <div className="absolute -left-[24px] top-0.5 bg-card-bg p-0.5">
                              <CircleDashed className="w-[13px] h-[13px] text-accent-brown animate-spin" />
                            </div>
                          ) : (
                            <span className="absolute -left-[21px] top-1.5 w-[7px] h-[7px] rounded-full bg-white outline outline-[3px] outline-card-bg border border-border-subtle" />
                          )}
                          <div className={`text-[13px] font-medium ${isPending ? 'text-accent-brown' : 'text-primary-text'} mb-0.5`}>
                            {humanMsg}
                          </div>
                          <div className="text-[11px] text-secondary-text font-mono">
                            {act.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="relative">
                        <div className="absolute -left-[24px] top-0.5 bg-card-bg p-0.5">
                          <CircleDashed className="w-[13px] h-[13px] text-secondary-text/50" />
                        </div>
                        <div className="text-[13px] font-medium text-secondary-text mb-0.5">Awaiting research commands</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default MainLayout;
