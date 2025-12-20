import React from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AssistantHub({ onStartChat }: { onStartChat: () => void }) {
  const { activeSourceIds, sources, setSourcePanelOpen } = useStore();
  const [input, setInput] = React.useState('');

  const activeSources = sources.filter(s => activeSourceIds.includes(s.id));

  const handleSubmit = () => {
    if (input.trim()) {
      onStartChat();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const actions = [
    { label: 'Files and sources', icon: Plus, onClick: () => setSourcePanelOpen(true) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-full w-full px-4 py-8"
    >
      <div className="w-full max-w-3xl space-y-8">
        {/* Active Sources Pills */}
        {activeSources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground"
              >
                <span className={cn("w-2 h-2 rounded-full", source.status === 'connected' ? "bg-green-500" : "bg-gray-400")} />
                {source.name}
              </div>
            ))}
          </motion.div>
        )}

        {/* Main Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Zania anything..."
            className="w-full min-h-[120px] text-2xl bg-muted/60 border border-border/30 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans text-foreground placeholder:text-sm placeholder:text-muted-foreground/50"
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant="ghost"
                onClick={action.onClick}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/30 border border-border/30 rounded-lg px-3 py-2"
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}

            {/* Ask Zania Button */}
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="ml-auto bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6 py-2"
            >
              <span className="text-sm font-semibold">Ask Zania</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
