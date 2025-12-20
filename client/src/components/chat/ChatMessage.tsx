import React from 'react';
import { useStore, Message, Citation } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { FileText, Database, Cpu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const { sources } = useStore();

  // Helper to render content with citations
  const renderContent = (content: string) => {
    if (isUser) return <p className="whitespace-pre-wrap text-sm">{content}</p>;

    // Regex to find [n] style citations
    const parts = content.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const citationId = `c${match[1]}`;
        const citationIndex = parseInt(match[1]) - 1;
        const citation = message.citations && message.citations[citationIndex];

        if (citation) {
           return <CitationPill key={index} citation={citation} index={citationIndex + 1} />;
        }
        return <sup key={index} className="text-muted-foreground text-xs ml-0.5">{part}</sup>;
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <>
      {isUser && <div className="w-full h-px bg-border/30 my-6" />}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full max-w-4xl mx-auto mb-8 p-4",
          isUser ? "text-right" : "text-left"
        )}
      >
        <div className={cn(
           "text-base leading-relaxed font-sans",
           isUser ? "text-foreground text-sm" : "text-foreground/90"
        )}>
           {renderContent(message.content)}
        </div>

        {/* Sources Footer (only for assistant) */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sources Used</p>
            <div className="flex flex-wrap gap-2">
               {message.citations.map((citation, idx) => {
                  const source = sources.find(s => s.id === citation.sourceId);
                  if (!source) return null;
                  
                  return (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50 text-xs text-foreground/80 hover:bg-secondary/50 transition-colors cursor-pointer group">
                       {getSourceIcon(source.type)}
                       <span className="font-medium truncate max-w-[150px]">{source.name}</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↗</span>
                    </div>
                  )
               })}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

function CitationPill({ citation, index }: { citation: Citation, index: number }) {
  const { sources } = useStore();
  const source = sources.find(s => s.id === citation.sourceId);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <sup className="inline-flex items-center justify-center w-5 h-5 ml-1 rounded text-[10px] font-semibold cursor-help transition-all align-top mt-0.5 bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted/70">
          {index}
        </sup>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden border-border/50 shadow-xl rounded-xl" align="start">
         <div className="bg-secondary/30 p-3 border-b border-border/50 flex items-center gap-2">
            {source && getSourceIcon(source.type)}
            <span className="text-sm font-semibold truncate">{source?.name || 'Unknown Source'}</span>
         </div>
         <div className="p-4 bg-card">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{citation.excerpt}"
            </p>
            {citation.page && <p className="mt-2 text-xs text-muted-foreground font-medium">Page {citation.page}</p>}
         </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function getSourceIcon(type: string) {
  switch (type) {
    case 'document': return <FileText className="w-3 h-3" />;
    case 'api': return <Database className="w-3 h-3" />;
    case 'web': return <Globe className="w-3 h-3" />;
    case 'memory': return <Cpu className="w-3 h-3" />;
    case 'url': return <Globe className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
}
