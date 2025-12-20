import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUp, Plus, Globe, Database, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInput() {
  const { addMessage, activeSourceIds, sources, setSourcePanelOpen, setSystemMessageVisible } = useStore();
  const [input, setInput] = React.useState('');

  const activeSourceCount = activeSourceIds.length;
  const activeSources = sources.filter(s => activeSourceIds.includes(s.id));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: input,
    });

    // Show system message
    setSystemMessageVisible(true);

    // Simulate response after delay
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: "I've analyzed the documents. Based on the **Q3 Financial Report** [1] and **Salesforce Data** [2], revenue has increased by 12% quarter-over-quarter. \n\nHowever, **Competitor Analysis** [3] suggests we are losing market share in the enterprise segment.",
        citations: [
          { id: 'c1', sourceId: 's1', excerpt: 'Revenue up 12% QoQ driven by strong enterprise sales.' },
          { id: 'c2', sourceId: 's2', excerpt: 'Q3 Closed Won opportunities total $4.2M.' },
          { id: 'c3', sourceId: 's3', excerpt: 'Competitor X launched a new enterprise tier at 20% lower cost.' },
        ]
      });
    }, 5200);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 pt-4">
      <div className="relative group rounded-2xl bg-card shadow-lg ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Zania anything..."
          className="w-full min-h-[120px] p-6 bg-transparent border-none resize-none focus:outline-none text-lg text-foreground placeholder:text-muted-foreground/50 font-sans leading-relaxed"
          style={{ fieldSizing: 'content' } as any}
        />
        
        {/* Footer Area */}
        <div className="flex items-center justify-between px-4 pb-4 mt-2">
          {/* Active Sources Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-[60%] no-scrollbar">
            <AnimatePresence>
              {activeSources.slice(0, 3).map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 text-xs font-medium text-secondary-foreground whitespace-nowrap border border-black/5"
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", source.status === 'connected' ? "bg-green-500" : "bg-gray-400")} />
                  {source.name}
                </motion.div>
              ))}
              {activeSources.length > 3 && (
                <div className="text-xs text-muted-foreground pl-1">
                  +{activeSources.length - 3} more
                </div>
              )}
              {activeSources.length === 0 && (
                <span className="text-xs text-muted-foreground italic pl-1">No sources selected</span>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
             <Button 
                variant="ghost" 
                onClick={() => setSourcePanelOpen(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/30 gap-2 px-3"
             >
                <Plus className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Files and sources</span>
             </Button>
             
             <Button 
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className={cn(
                  "rounded-full px-6 transition-all duration-300",
                  input.trim() ? "bg-foreground text-background hover:bg-foreground/90 shadow-md translate-y-0" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
             >
                <span className="mr-2">Ask Zania</span>
                <ArrowUp className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
         <p className="text-xs text-muted-foreground">
           AI responses can be inaccurate. Always verify important information.
         </p>
      </div>
    </div>
  );
}
