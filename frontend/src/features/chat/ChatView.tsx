import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Paperclip, Mic, 
  Settings2, Download, Search, Maximize2,
  ListFilter, BookOpen, User
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useActivity } from '../../context/ActivityContext';
import ReactMarkdown from 'react-markdown';

const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const queryClient = useQueryClient();
  const { addActivity } = useActivity();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: isConvosLoading } = useQuery({
    queryKey: ['conversations', workspaceId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/workspace/${workspaceId}/conversations`);
      return data.data || [];
    },
    enabled: !!workspaceId
  });

  const activeConversationId = conversations.length > 0 ? conversations[0]._id : null;

  useEffect(() => {
    if (!isConvosLoading && conversations.length === 0 && workspaceId) {
      axios.post(`/api/workspace/${workspaceId}/conversations`, { title: 'Research Session' })
        .then(() => queryClient.invalidateQueries({ queryKey: ['conversations', workspaceId] }))
        .catch(console.error);
    }
  }, [isConvosLoading, conversations.length, workspaceId, queryClient]);

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return [];
      try {
        const { data } = await axios.get(`/api/workspace/${workspaceId}/conversations/${activeConversationId}/messages`);
        return data.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!activeConversationId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeConversationId) throw new Error('No active conversation');
      addActivity(`Searching vector database for context...`, 'pending');
      await axios.post(`/api/workspace/${workspaceId}/conversations/${activeConversationId}/messages`, {
        role: 'user', content
      });
    },
    onSuccess: () => {
      addActivity(`Synthesizing response...`, 'success');
      queryClient.invalidateQueries({ queryKey: ['messages', activeConversationId] });
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId) return;
    sendMessageMutation.mutate(input);
    setInput('');
  };

  const isLoading = isConvosLoading || isMessagesLoading;

  return (
    <div className="h-full flex flex-col bg-primary-bg relative">
      
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border-subtle flex items-center justify-between px-6 shrink-0 bg-card-bg z-10 shadow-sm">
        <h2 className="text-sm font-semibold text-primary-text">Research Canvas</h2>
        <div className="flex gap-2">
          <button className="p-1.5 rounded text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Conversation Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-border-subtle border-t-accent-brown rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 opacity-60">
              <BookOpen className="w-12 h-12 mx-auto text-secondary-text mb-4" />
              <p className="font-serif text-lg text-primary-text">Start your research session.</p>
              <p className="text-[13px] text-secondary-text mt-2 max-w-sm mx-auto leading-relaxed">
                Ask a question, and the agent will synthesize a formal research report based on your workspace context.
              </p>
            </div>
          ) : (
            messages.map((msg: any, idx: number) => {
              
              if (msg.role === 'user') {
                return (
                  <div key={msg._id || idx} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-accent-brown/10 text-accent-brown flex items-center justify-center shrink-0 border border-accent-brown/20 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-text mb-1">Research Query</div>
                      <p className="text-[15px] text-primary-text font-medium leading-relaxed">"{msg.content}"</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg._id || idx} className="premium-card p-8 md:p-12 rounded-xl flex gap-6">
                  <div className="w-8 h-8 rounded-full bg-card-bg border border-border-subtle shadow-sm flex items-center justify-center shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-accent-brown" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-secondary-text mb-6 border-b border-border-subtle pb-2">
                      Research Synthesis
                    </div>
                    
                    <div className="font-serif text-primary-text leading-relaxed prose prose-slate max-w-none 
                      prose-headings:font-sans prose-headings:font-semibold prose-headings:text-primary-text 
                      prose-h2:text-[18px] prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border-subtle
                      prose-h3:text-[15px] prose-h3:mt-6 prose-h3:mb-3 
                      prose-p:text-[15px] prose-p:leading-[1.8] prose-p:mb-5 
                      prose-li:text-[15px] prose-li:leading-[1.8]
                      prose-a:text-accent-brown prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                      prose-strong:font-semibold prose-strong:text-primary-text"
                    >
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-border-subtle">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary-text mb-3">References</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.sources.map((source: any, sIdx: number) => (
                            <a 
                              key={sIdx} 
                              href={source.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-3 rounded-lg border border-border-subtle bg-primary-bg hover:border-accent-brown/30 transition-colors flex flex-col gap-1 group/source"
                            >
                              <span className="text-[10px] font-mono text-accent-brown">[{sIdx + 1}]</span>
                              <span className="text-[13px] font-medium text-primary-text leading-snug group-hover/source:text-accent-brown transition-colors line-clamp-2">
                                {source.title || 'Source Document'}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          
          {sendMessageMutation.isPending && (
            <div className="premium-card p-8 md:p-12 rounded-xl flex gap-6 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-card-bg border border-border-subtle shadow-sm flex items-center justify-center shrink-0 mt-1">
                  <div className="w-4 h-4 border-2 border-border-subtle border-t-accent-brown rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-border-subtle rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-border-subtle rounded w-full"></div>
                    <div className="h-4 bg-border-subtle rounded w-11/12"></div>
                    <div className="h-4 bg-border-subtle rounded w-4/5"></div>
                  </div>
                </div>
            </div>
          )}

        </div>
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-bg via-primary-bg to-transparent pt-10 pb-6 px-6 z-20">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSend} 
            className="relative bg-card-bg rounded-xl shadow-premium border border-border-subtle overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-accent-brown/20 transition-all"
          >
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Query workspace, extract insights, or request a full literature review..."
              disabled={!activeConversationId || sendMessageMutation.isPending}
              className="w-full min-h-[60px] max-h-[200px] py-4 px-5 resize-none outline-none text-[15px] text-primary-text placeholder-secondary-text/60 disabled:opacity-50 font-sans custom-scrollbar bg-transparent leading-relaxed"
              rows={1}
            />
            <div className="bg-primary-bg border-t border-border-subtle px-3 py-2.5 flex items-center justify-between">
              <div className="flex gap-1.5 items-center">
                <button type="button" className="p-1.5 rounded-md text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors" title="Attach Paper">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 rounded-md text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors" title="Voice Query">
                  <Mic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-border-subtle mx-1"></div>
                <button type="button" className="px-2.5 py-1.5 rounded-md text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors text-[12px] font-medium flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5" /> Generate Report
                </button>
                <button type="button" className="px-2.5 py-1.5 rounded-md text-secondary-text hover:text-primary-text hover:bg-black/5 transition-colors text-[12px] font-medium flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Deep Research
                </button>
              </div>
              <button 
                type="submit" 
                disabled={!input.trim() || !activeConversationId || sendMessageMutation.isPending}
                className="px-4 py-2 bg-accent-brown hover:bg-[#6A543E] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-[13px] font-semibold shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Submit
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <span className="text-[11px] text-secondary-text font-medium">ResearchPilot can make mistakes. Verify critical citations.</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatView;
