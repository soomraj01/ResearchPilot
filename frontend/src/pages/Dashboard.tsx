import React, { useEffect, useState } from 'react';
import { 
  Folder, Plus, FileText, Lightbulb, Activity, 
  ArrowRight, LayoutDashboard
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useMutation } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveWorkspaceId } = useWorkspace();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await axios.get('/api/workspace');
        setWorkspaces(data.data || []);
      } catch (err) {
        console.error('Failed to fetch workspaces');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleOpenWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    navigate(`/workspace/${id}/papers`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data } = await axios.post('/api/workspace', { title, description: '' });
      return data.data;
    },
    onSuccess: (newWorkspace) => {
      setWorkspaces([...workspaces, newWorkspace]);
      setIsModalOpen(false);
      setNewTitle('');
      handleOpenWorkspace(newWorkspace._id);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || err.message || 'Failed to create workspace.');
    }
  });

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length > 0) {
      createMutation.mutate(newTitle.trim());
    }
  };

  return (
    <div className="h-full flex flex-col p-8 md:p-12 relative">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-primary-text tracking-tight flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-accent-brown" />
              Research Workspace
            </h1>
            <p className="text-sm text-secondary-text max-w-2xl">
              Organize your literature reviews, datasets, and synthesized insights into structured projects.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-accent-brown hover:bg-[#6A543E] text-white rounded-lg transition-colors text-[13px] font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </header>

        {/* Workspaces Grid */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold text-primary-text uppercase tracking-widest border-b border-border-subtle pb-3">Active Projects</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="premium-card p-6 h-48 rounded-xl animate-pulse flex flex-col">
                  <div className="h-5 bg-border-subtle rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-border-subtle rounded w-full mb-6"></div>
                  <div className="mt-auto h-2 bg-border-subtle rounded-full w-full"></div>
                </div>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="premium-card p-16 text-center rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border-subtle flex items-center justify-center shadow-sm">
                <Folder className="w-8 h-8 text-secondary-text" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-primary-text">No active research projects</h3>
                <p className="text-[14px] text-secondary-text max-w-sm mx-auto leading-relaxed">
                  Create a workspace to start mapping literature, generating insights, and organizing your context.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {workspaces.map(ws => (
                <div 
                  key={ws._id}
                  onClick={() => handleOpenWorkspace(ws._id)}
                  className="premium-card group rounded-xl p-6 cursor-pointer relative overflow-hidden flex flex-col h-[260px]"
                >
                  {/* Folder Tab Decoration */}
                  <div className="absolute top-0 left-6 w-20 h-1.5 bg-accent-brown rounded-b-md"></div>
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-brown/10 flex items-center justify-center text-accent-brown border border-accent-brown/20 shrink-0">
                      <Folder className="w-5 h-5" />
                    </div>
                    <button className="w-8 h-8 rounded-full bg-card-bg flex items-center justify-center border border-border-subtle group-hover:border-accent-brown group-hover:text-accent-brown transition-colors">
                      <ArrowRight className="w-4 h-4 text-secondary-text group-hover:text-accent-brown transition-colors" />
                    </button>
                  </div>

                  <h3 className="text-[17px] font-semibold text-primary-text mb-2 line-clamp-1 group-hover:text-accent-brown transition-colors">{ws.title}</h3>
                  <p className="text-[13px] text-secondary-text line-clamp-2 leading-relaxed mb-6">
                    Analyzing the latest developments and trends. 
                    Organizing literature review for upcoming publication.
                  </p>

                  <div className="mt-auto space-y-5">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
                        <span>Research Progress</span>
                        <span>{Math.min(100, (ws.paperCount || 0) * 5 + (ws.insightCount || 0) * 10)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                        <div className="h-full bg-accent-brown rounded-full" style={{ width: `${Math.min(100, (ws.paperCount || 0) * 5 + (ws.insightCount || 0) * 10)}%` }}></div>
                      </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="grid grid-cols-3 gap-2 border-t border-border-subtle pt-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-secondary-text">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium uppercase tracking-wider">Papers</span>
                        </div>
                        <span className="text-[14px] font-semibold text-primary-text pl-5">{ws.paperCount || 0}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-secondary-text">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium uppercase tracking-wider">Insights</span>
                        </div>
                        <span className="text-[14px] font-semibold text-primary-text pl-5">{ws.insightCount || 0}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-secondary-text">
                          <Activity className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium uppercase tracking-wider">Updated</span>
                        </div>
                        <span className="text-[12px] font-medium text-primary-text pl-5 mt-0.5 truncate">
                          {new Date(ws.updatedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-primary-bg rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border-subtle">
            <div className="px-6 py-5 border-b border-border-subtle">
              <h3 className="text-xl font-display font-semibold text-primary-text">Create New Workspace</h3>
              <p className="text-[14px] text-secondary-text mt-1">Name your new research project.</p>
            </div>
            <form onSubmit={handleCreateWorkspace} className="p-6">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. LLMs in Healthcare..."
                className="w-full px-4 py-3 rounded-xl premium-input text-[15px]"
                required
              />
              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-secondary-text hover:text-primary-text hover:bg-black/5 font-medium rounded-xl transition-colors text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !newTitle.trim()}
                  className="px-6 py-2 bg-accent-brown hover:bg-[#6A543E] text-white font-semibold rounded-xl shadow-sm transition-colors text-[14px] disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
