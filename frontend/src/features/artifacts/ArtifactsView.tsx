import React from 'react';
import { 
  FileText, Download, Share2, MoreVertical, 
  Clock, GitCommit, FileSpreadsheet, FileIcon,
  Presentation, LayoutTemplate, Package
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ArtifactsView: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: artifacts = [], isLoading } = useQuery({
    queryKey: ['artifacts', workspaceId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/workspace/${workspaceId}/artifacts`);
      return data.data || [];
    },
    enabled: !!workspaceId
  });

  const getArtifactIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'report': return <FileText className="w-5 h-5 text-accent-brown" />;
      case 'dataset': return <FileSpreadsheet className="w-5 h-5 text-status-success" />;
      case 'presentation': return <Presentation className="w-5 h-5 text-accent-brown" />;
      case 'mindmap': return <LayoutTemplate className="w-5 h-5 text-indigo-400" />;
      default: return <FileIcon className="w-5 h-5 text-secondary-text" />;
    }
  };

  const handleDownload = (artifact: any) => {
    const blob = new Blob([`# ${artifact.title}\n\n${artifact.content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-8 md:p-12 bg-primary-bg overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto w-full space-y-10 pb-20">
        <header className="space-y-4">
          <h1 className="text-3xl font-display font-semibold text-primary-text tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-accent-brown" />
            Research Assets
          </h1>
          <p className="text-[15px] text-secondary-text max-w-2xl leading-relaxed">
            Formal reports, literature reviews, datasets, and presentation materials synthesized by the agent during your research sessions.
          </p>
        </header>

        {/* Filters */}
        <div className="flex gap-3 border-b border-border-subtle pb-4 overflow-x-auto custom-scrollbar">
          <button className="px-4 py-2 rounded-lg bg-card-bg shadow-sm text-[13px] font-medium text-primary-text border border-border-subtle whitespace-nowrap">All Assets</button>
          <button className="px-4 py-2 rounded-lg bg-transparent text-[13px] font-medium text-secondary-text border border-transparent hover:bg-black/5 hover:text-primary-text transition-colors whitespace-nowrap">Literature Reviews</button>
          <button className="px-4 py-2 rounded-lg bg-transparent text-[13px] font-medium text-secondary-text border border-transparent hover:bg-black/5 hover:text-primary-text transition-colors whitespace-nowrap">Research Notes</button>
          <button className="px-4 py-2 rounded-lg bg-transparent text-[13px] font-medium text-secondary-text border border-transparent hover:bg-black/5 hover:text-primary-text transition-colors whitespace-nowrap">Datasets</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-border-subtle border-t-accent-brown rounded-full animate-spin"></div>
            </div>
          ) : artifacts.length === 0 ? (
            <div className="col-span-full premium-card p-16 text-center rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-card-bg border border-border-subtle flex items-center justify-center shadow-sm">
                <FileIcon className="w-8 h-8 text-secondary-text" />
              </div>
              <h3 className="text-lg font-medium text-primary-text">No assets generated yet</h3>
              <p className="text-[14px] text-secondary-text max-w-sm mx-auto leading-relaxed">
                Use the Research Canvas to request formal reports, summaries, or structured datasets from your active literature.
              </p>
            </div>
          ) : (
            artifacts.map((artifact: any, idx: number) => (
              <div key={idx} className="premium-card rounded-xl overflow-hidden group flex flex-col hover:shadow-md transition-shadow">
                {/* Document Preview Header */}
                <div className="h-40 bg-card-bg border-b border-border-subtle relative overflow-hidden flex items-center justify-center p-6 shrink-0">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)', backgroundSize: '100% 20px' }}></div>
                  <div className="relative z-10 w-full h-full bg-white border border-border-subtle rounded shadow-sm p-4 flex flex-col">
                    <div className="h-2.5 w-1/2 bg-secondary-text/20 rounded mb-4"></div>
                    <div className="h-1.5 w-full bg-secondary-text/10 rounded mb-2"></div>
                    <div className="h-1.5 w-full bg-secondary-text/10 rounded mb-2"></div>
                    <div className="h-1.5 w-3/4 bg-secondary-text/10 rounded mb-4"></div>
                    <div className="h-1.5 w-full bg-secondary-text/10 rounded mb-2"></div>
                    <div className="h-1.5 w-5/6 bg-secondary-text/10 rounded"></div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-border-subtle bg-primary-bg flex items-center justify-center shrink-0 shadow-sm">
                        {getArtifactIcon(artifact.type || 'report')}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-primary-text leading-snug line-clamp-1 group-hover:text-accent-brown transition-colors">
                          {artifact.title}
                        </h3>
                        <div className="text-[11px] text-secondary-text font-mono mt-1">
                          {artifact.type?.toUpperCase() || 'RESEARCH REPORT'} • PDF
                        </div>
                      </div>
                    </div>
                    <button className="text-secondary-text hover:text-primary-text p-1 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[14px] text-secondary-text leading-relaxed line-clamp-2 mb-6 flex-1 font-serif">
                    {artifact.content}
                  </p>

                  {/* Footer details */}
                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-secondary-text bg-black/5 px-2 py-1 rounded" title="Version History">
                        <GitCommit className="w-3.5 h-3.5 text-accent-brown" /> v1.0
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-secondary-text">
                        <Clock className="w-3.5 h-3.5" /> {new Date(artifact.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-md hover:bg-black/5 text-secondary-text hover:text-primary-text transition-colors shadow-sm border border-transparent hover:border-border-subtle">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDownload(artifact)} className="p-2 rounded-md hover:bg-black/5 text-secondary-text hover:text-primary-text transition-colors shadow-sm border border-transparent hover:border-border-subtle">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactsView;
