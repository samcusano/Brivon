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
      <div className="relative">
        {/* Active Sources Pills - Top Left Corner */}
        {activeSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none z-10"
          >
            {activeSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-secondary/70 border border-border/50 text-xs font-medium text-foreground"
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", source.status === 'connected' ? "bg-green-500" : "bg-gray-400")} />
                {source.name}
              </div>
            ))}
          </motion.div>
        )}
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Zania anything..."
          className="w-full min-h-[120px] text-sm bg-muted/60 border border-border/30 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans text-foreground placeholder:text-sm placeholder:text-muted-foreground/50"
          style={{ paddingTop: activeSources.length > 0 ? '50px' : '24px' }}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 items-center p-6 pt-0">
          <Button 
            variant="ghost" 
            onClick={() => setSourcePanelOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/30 border border-border/30 rounded-lg px-3 py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Files and sources</span>
          </Button>

          {/* Ask Zania Button */}
          <Button
            onClick={() => handleSubmit()}
            disabled={!input.trim()}
            className="ml-auto bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6 py-2"
          >
            <span className="text-sm font-semibold">Ask Zania</span>
          </Button>
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
