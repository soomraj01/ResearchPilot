import React from 'react';
import { 
  Lightbulb, TrendingUp, AlertTriangle, 
  HelpCircle, ChevronRight, Activity, Library
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InsightsView: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['insights', workspaceId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/workspace/${workspaceId}/insights`);
      return data.data || [];
    },
    enabled: !!workspaceId
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/workspace/${workspaceId}/insights/auto-detect`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights', workspaceId] });
      alert('Deep knowledge successfully extracted from workspace literature.');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to auto-detect insights. Ensure you have literature saved in your library.');
    }
  });

  return (
    <div className="h-full flex flex-col p-8 md:p-12 bg-primary-bg overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-12 pb-20">
        
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-display font-semibold text-primary-text tracking-tight flex items-center gap-3">
              <Library className="w-8 h-8 text-accent-brown" />
              Knowledge Repository
            </h1>
            <p className="text-[15px] text-secondary-text max-w-2xl leading-relaxed">
              Synthesized insights extracted from your workspace literature. The agent automatically categorizes findings into trends, discoveries, contradictions, and gaps.
            </p>
          </div>
          <button 
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-5 py-2.5 bg-accent-brown hover:bg-[#6A543E] text-white rounded-lg transition-colors text-[13px] font-semibold flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <><Activity className="w-4 h-4 animate-spin" /> Detecting...</>
            ) : (
              <><Lightbulb className="w-4 h-4" /> Auto-Detect Knowledge</>
            )}
          </button>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Activity className="w-6 h-6 animate-pulse text-secondary-text" />
          </div>
        ) : insights.length === 0 ? (
          <div className="premium-card p-16 rounded-xl text-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border-subtle flex items-center justify-center shadow-sm mx-auto">
              <Lightbulb className="w-8 h-8 text-secondary-text" />
            </div>
            <h3 className="text-lg font-medium text-primary-text">No insights generated yet</h3>
            <p className="text-[14px] text-secondary-text max-w-sm mx-auto leading-relaxed">
              Use the Research Canvas to ask complex questions, and the agent will automatically extract insights to populate this knowledge base.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Discoveries Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
                <div className="p-1.5 rounded bg-status-success/10 text-status-success">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-[16px] font-semibold text-primary-text uppercase tracking-widest">Key Discoveries</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.filter((i: any) => !i.type || i.type === 'discovery').map((insight: any, idx: number) => (
                  <div key={idx} className="premium-card p-6 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="text-[16px] font-medium text-primary-text mb-3 leading-snug">{insight.title}</h3>
                    <p className="text-[14px] text-secondary-text leading-relaxed font-serif">{insight.content}</p>
                    <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center text-[12px] text-secondary-text">
                      <span className="font-mono">{new Date(insight.createdAt).toLocaleDateString()}</span>
                      <button className="flex items-center gap-1 hover:text-accent-brown transition-colors font-medium">
                        View Sources <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trends Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
                <div className="p-1.5 rounded bg-accent-brown/10 text-accent-brown">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-[16px] font-semibold text-primary-text uppercase tracking-widest">Emerging Trends</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.filter((i: any) => i.type === 'trend').map((insight: any, idx: number) => (
                  <div key={idx} className="premium-card p-6 rounded-xl hover:shadow-md transition-shadow">
                    <h3 className="text-[16px] font-medium text-primary-text mb-3 leading-snug">{insight.title}</h3>
                    <p className="text-[14px] text-secondary-text leading-relaxed font-serif">{insight.content}</p>
                    <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center text-[12px] text-secondary-text">
                      <span className="font-mono">{new Date(insight.createdAt).toLocaleDateString()}</span>
                      <button className="flex items-center gap-1 hover:text-accent-brown transition-colors font-medium">
                        View Sources <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Fallback if none exist for demonstration */}
                {insights.filter((i: any) => i.type === 'trend').length === 0 && (
                  <div className="col-span-full py-8 text-center text-[14px] text-secondary-text italic bg-card-bg rounded-xl border border-dashed border-border-subtle">
                    No trends detected in current workspace.
                  </div>
                )}
              </div>
            </section>

            {/* Contradictions & Gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
                  <div className="p-1.5 rounded bg-rose-100 text-rose-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h2 className="text-[16px] font-semibold text-primary-text uppercase tracking-widest">Contradictions</h2>
                </div>
                <div className="space-y-4">
                  {insights.filter((i: any) => i.type === 'contradiction').map((insight: any, idx: number) => (
                    <div key={idx} className="premium-card p-5 rounded-xl border-l-4 border-l-rose-400">
                      <h3 className="text-[15px] font-medium text-primary-text mb-2 leading-snug">{insight.title}</h3>
                      <p className="text-[13px] text-secondary-text leading-relaxed font-serif">{insight.content}</p>
                    </div>
                  ))}
                  {insights.filter((i: any) => i.type === 'contradiction').length === 0 && (
                    <div className="py-8 text-center text-[14px] text-secondary-text italic bg-card-bg rounded-xl border border-dashed border-border-subtle">
                      No contradictions found.
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
                  <div className="p-1.5 rounded bg-indigo-100 text-indigo-600">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h2 className="text-[16px] font-semibold text-primary-text uppercase tracking-widest">Research Gaps</h2>
                </div>
                <div className="space-y-4">
                  {insights.filter((i: any) => i.type === 'gap').map((insight: any, idx: number) => (
                    <div key={idx} className="premium-card p-5 rounded-xl border-l-4 border-l-indigo-400">
                      <h3 className="text-[15px] font-medium text-primary-text mb-2 leading-snug">{insight.title}</h3>
                      <p className="text-[13px] text-secondary-text leading-relaxed font-serif">{insight.content}</p>
                    </div>
                  ))}
                  {insights.filter((i: any) => i.type === 'gap').length === 0 && (
                    <div className="py-8 text-center text-[14px] text-secondary-text italic bg-card-bg rounded-xl border border-dashed border-border-subtle">
                      No research gaps identified.
                    </div>
                  )}
                </div>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsView;
