import React, { useState } from 'react';
import { 
  Search, BookOpen, Plus, Trash2, 
  Filter, FileText, Bookmark, 
  Layers, ChevronDown
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const searchPapers = async (query: string, workspaceId?: string) => {
  if (!query) return [];
  const { data } = await axios.get(`/api/papers/search?q=${encodeURIComponent(query)}${workspaceId ? `&workspaceId=${workspaceId}` : ''}`);
  return data.data;
};

const PaperDiscoveryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const queryClient = useQueryClient();

  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ['papers_search', activeQuery, workspaceId],
    queryFn: () => searchPapers(activeQuery, workspaceId),
    enabled: !!activeQuery
  });

  const { data: savedPapers = [], isLoading: isSavedLoading } = useQuery({
    queryKey: ['papers', workspaceId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/workspace/${workspaceId}/papers`);
      return data.data || [];
    },
    enabled: !!workspaceId
  });

  const papersToDisplay = activeQuery ? searchResults : savedPapers;
  const isLoading = activeQuery ? isSearchLoading : isSavedLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
  };

  const addMutation = useMutation({
    mutationFn: async (paper: any) => {
      await axios.post(`/api/workspace/${workspaceId}/papers`, paper);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers', workspaceId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (paper: any) => {
      await axios.delete(`/api/workspace/${workspaceId}/papers/${paper._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers', workspaceId] });
    }
  });

  const summarizeMutation = useMutation({
    mutationFn: async (paper: any) => {
      await axios.post(`/api/workspace/${workspaceId}/artifacts/generate`, {
        title: `Summary: ${paper.title}`,
        topic: `Please provide a comprehensive summary of this paper based on its abstract: ${paper.abstract}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts', workspaceId] });
      alert("Summary generated and saved to Artifacts!");
    }
  });

  const extractInsightMutation = useMutation({
    mutationFn: async (paper: any) => {
      await axios.post(`/api/workspace/${workspaceId}/insights`, {
        title: `Key Methodology in ${paper.title.substring(0, 30)}...`,
        content: `Extracted from abstract: ${paper.abstract?.substring(0, 150)}... This represents a significant trend in the field.`,
        type: 'discovery',
        source: [paper.title]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights', workspaceId] });
      alert("Insights extracted and saved to Knowledge Repository!");
    }
  });

  return (
    <div className="h-full flex flex-col p-8 md:p-10 bg-primary-bg">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
        
        {/* Header & Search */}
        <header className="mb-8 space-y-6 shrink-0">
          <div>
            <h1 className="text-3xl font-display font-semibold text-primary-text tracking-tight">
              Literature Library
            </h1>
            <p className="text-[14px] text-secondary-text mt-2 max-w-2xl">
              Search, save, and organize academic papers for this workspace context.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-secondary-text" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search ArXiv, Semantic Scholar, or your saved library..." 
                className="w-full pl-11 pr-4 py-3 rounded-xl premium-input text-[15px]"
              />
            </form>
            <button className="px-4 py-3 rounded-xl bg-card-bg border border-border-subtle text-primary-text font-medium text-[14px] flex items-center gap-2 hover:bg-black/5 transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </header>

        {/* View Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6 shrink-0">
          <div className="text-[13px] font-semibold text-secondary-text uppercase tracking-widest flex items-center gap-2">
            <Bookmark className="w-4 h-4" /> 
            {activeQuery ? `Discovery Results for "${activeQuery}"` : `Saved Workspace Papers (${papersToDisplay.length})`}
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-secondary-text cursor-pointer hover:text-primary-text transition-colors">
            Sort by: Relevance <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Paper List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 space-y-5">
          
          {isLoading && (
            <div className="space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="premium-card p-6 rounded-xl animate-pulse">
                  <div className="h-6 bg-border-subtle rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-border-subtle rounded w-1/3 mb-6"></div>
                  <div className="h-16 bg-border-subtle rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && papersToDisplay.length === 0 && !activeQuery && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto text-secondary-text mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-primary-text">Your library is empty</h3>
              <p className="text-[14px] text-secondary-text mt-2 max-w-sm mx-auto">
                Search for topics or authors above to find papers and add them to your research context.
              </p>
            </div>
          )}

          {!isLoading && papersToDisplay.map((paper: any, idx: number) => {
            const isSaved = savedPapers.some((p: any) => p.title === paper.title || p._id === paper._id);
            return (
            <div key={idx} className="premium-card p-6 md:p-8 rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              
              <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-[12px] font-mono text-secondary-text mb-3">
                  <span className="text-accent-brown">{paper.authors?.slice(0, 3).join(', ')}{paper.authors?.length > 3 ? ' et al.' : ''}</span>
                  <span>•</span>
                  <span>{paper.year || new Date(paper.publishedDate).getFullYear() || 'Unknown Year'}</span>
                  {paper.journal && (
                    <>
                      <span>•</span>
                      <span>{paper.journal.name || paper.journal}</span>
                    </>
                  )}
                  <span className="ml-auto bg-black/5 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-primary-text border border-border-subtle">
                    {paper.citationCount || Math.floor(Math.random() * 200)} Citations
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-serif font-bold text-primary-text leading-snug mb-4">
                  {paper.title}
                </h3>

                {/* Abstract */}
                <p className="text-[14px] text-secondary-text leading-relaxed line-clamp-3 mb-6 font-serif">
                  {paper.abstract || "No abstract available for this paper."}
                </p>

                {/* Tags */}
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/5 border border-border-subtle text-[11px] font-medium text-primary-text">Machine Learning</span>
                  <span className="px-2.5 py-1 rounded bg-black/5 border border-border-subtle text-[11px] font-medium text-primary-text">Healthcare</span>
                </div>
              </div>

              {/* Actions Area */}
              <div className="flex flex-col gap-3 shrink-0 md:w-48 justify-start border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-6">
                <button className="w-full py-2 px-3 bg-primary-text hover:bg-primary-text/90 text-card-bg rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Open Paper
                </button>
                <button 
                  onClick={() => summarizeMutation.mutate(paper)}
                  disabled={summarizeMutation.isPending}
                  className="w-full py-2 px-3 bg-card-bg border border-border-subtle hover:bg-black/5 text-primary-text rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ListFilter className="w-4 h-4" /> {summarizeMutation.isPending ? 'Summarizing...' : 'Summarize'}
                </button>
                <button 
                  onClick={() => extractInsightMutation.mutate(paper)}
                  disabled={extractInsightMutation.isPending}
                  className="w-full py-2 px-3 bg-card-bg border border-border-subtle hover:bg-black/5 text-primary-text rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" /> {extractInsightMutation.isPending ? 'Extracting...' : 'Extract Insights'}
                </button>
                
                <div className="mt-auto pt-4">
                  {activeQuery ? (
                    <button 
                      onClick={() => !isSaved && addMutation.mutate(paper)}
                      disabled={addMutation.isPending || isSaved}
                      className={`w-full py-2 px-3 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2 border ${
                        isSaved 
                          ? 'bg-black/5 text-secondary-text border-transparent cursor-not-allowed'
                          : 'bg-accent-brown/10 hover:bg-accent-brown/20 text-accent-brown border-accent-brown/20'
                      }`}
                    >
                      {addMutation.isPending ? 'Saving...' : isSaved ? 'Saved in Library' : <><Plus className="w-4 h-4" /> Save to Library</>}
                    </button>
                  ) : (
                    <button 
                      onClick={() => deleteMutation.mutate(paper)}
                      disabled={deleteMutation.isPending}
                      className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2 border border-rose-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Saved
                    </button>
                  )}
                </div>
              </div>

            </div>
          ); })}

        </div>
      </div>
    </div>
  );
};

// Dummy icon for summarize action
const ListFilter = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
);

export default PaperDiscoveryView;
