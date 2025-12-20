import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Upload, Globe, Database, Cpu, FileText,
  ChevronRight, ArrowRight, Dot
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

export function SourcePanel() {
  const { isSourcePanelOpen, setSourcePanelOpen, sources, activeSourceIds, toggleSource, addSource } = useStore();
  
  // Mock sources for display
  const displaySources = [
    { id: 'lex', name: 'LexisNexis', icon: FileText, color: 'bg-red-500' },
    { id: 'web', name: 'Web search', icon: Globe },
    { id: 'edgar', name: 'EDGAR', icon: Database },
    { id: 'aus', name: 'Australia', icon: FileText },
    { id: 'aut', name: 'Austria', icon: FileText },
    { id: 'bel', name: 'Belgium', icon: FileText },
  ];

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      addSource({
        id: Math.random().toString(36).slice(2),
        type: 'document',
        name: file.name,
        status: 'connected',
        lastUsed: 'Just now'
      });
    });
  }, [addSource]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <motion.div 
      className="h-full flex flex-col bg-card"
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
        <h2 className="font-heading font-semibold text-lg">Files & Sources</h2>
        <Button variant="ghost" size="icon" onClick={() => setSourcePanelOpen(false)} className="md:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Add Options Section */}
          <div className="space-y-2">
            {/* Upload Files */}
            <button
              {...getRootProps()}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-colors",
                isDragActive 
                  ? "bg-primary/10 border border-primary" 
                  : "hover:bg-secondary/50 border border-transparent"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Upload files</span>
              </div>
            </button>

            {/* Add from iManage */}
            <button className="w-full p-3 rounded-lg text-left hover:bg-secondary/50 transition-colors border border-transparent">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary/80" />
                <span className="text-sm font-medium">Add from iManage</span>
              </div>
            </button>

            {/* Add from Vault Project */}
            <button className="w-full p-3 rounded-lg text-left hover:bg-secondary/50 transition-colors border border-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Add from Vault project</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Add from Knowledge Base */}
            <button className="w-full p-3 rounded-lg text-left hover:bg-secondary/50 transition-colors border border-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Add from Knowledge base</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Sources Section */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Sources</p>
            
            {displaySources.map((source, idx) => (
              <motion.button
                key={source.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => {}}
                className="w-full p-3 rounded-lg text-left hover:bg-secondary/50 transition-colors border border-transparent flex items-center gap-3"
              >
                {source.color ? (
                  <div className={cn("w-2 h-2 rounded-full", source.color)} />
                ) : (
                  <source.icon className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{source.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Uploaded Documents */}
          {sources.filter(s => s.type === 'document').length > 0 && (
            <>
              <div className="h-px bg-border/50" />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Uploaded</p>
                
                {sources.filter(s => s.type === 'document').map((source) => (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className="w-full p-3 rounded-lg text-left hover:bg-secondary/50 transition-colors border border-transparent flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={activeSourceIds.includes(source.id)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{source.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
