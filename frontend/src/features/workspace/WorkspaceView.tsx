import React from 'react';
import { Plus, Search, Folder, MoreVertical, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Interface matching backend IWorkspace
interface Workspace {
  _id: string;
  title: string;
  description?: string;
  updatedAt: string;
}

const fetchWorkspaces = async (): Promise<Workspace[]> => {
  const { data } = await axios.get('/api/workspace');
  return data.data;
};

const createWorkspace = async (title: string) => {
  const { data } = await axios.post('/api/workspace', { title, description: '' });
  return data.data;
};

const WorkspaceView: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: workspaces = [], isLoading, isError } = useQuery({
    queryKey: ['workspaces'],
    queryFn: fetchWorkspaces
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsModalOpen(false);
      setNewTitle('');
      navigate(`/workspace/${newWorkspace._id}/chat`);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || err.message || 'Failed to create workspace.');
    }
  });

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length > 0) {
      mutation.mutate(newTitle.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Workspaces</h1>
          <p className="text-slate-500">Manage your active research projects and contexts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          New Workspace
        </button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search workspaces..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-800 placeholder-slate-400"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-sm">
          Failed to load workspaces. Make sure you are authenticated.
        </div>
      ) : workspaces.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Folder className="w-12 h-12 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700">No workspaces yet</h3>
          <p className="text-sm text-slate-500 max-w-sm">Create your first research workspace to start organizing papers, chats, and insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map(ws => (
            <div 
              key={ws._id} 
              onClick={() => navigate(`/workspace/${ws._id}/chat`)}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between cursor-pointer group hover:bg-white/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-blue-50 flex items-center justify-center border border-brand-200">
                    <Folder className="w-5 h-5 text-brand-600" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-white/50">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 group-hover:text-brand-600 transition-colors">{ws.title}</h3>
                {ws.description && <p className="text-xs text-slate-500 line-clamp-2">{ws.description}</p>}
              </div>
              
              <div className="pt-4 mt-4 border-t border-black/[0.04] flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active {new Date(ws.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Create New Workspace</h3>
              <p className="text-sm text-slate-500 mt-1">Give your new research project a name.</p>
            </div>
            <form onSubmit={handleCreateWorkspace} className="p-6">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. LLMs in Healthcare..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                required
              />
              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending || !newTitle.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceView;
