import React from 'react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Upload, Globe,
  Check
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { AddSourceDialog } from './AddSourceDialog';

export function SourcePanel() {
  const { isSourcePanelOpen, setSourcePanelOpen, sources, activeSourceIds, toggleSource, addSource, removeSource } = useStore();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

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
      className="h-full flex flex-col bg-background border-l border-border"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.3 }}
    >
      {/* Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0">
        <h2 className="font-heading font-semibold text-sm">Files & Sources</h2>
        <Button variant="ghost" size="icon" onClick={() => setSourcePanelOpen(false)} className="md:hidden h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          
          {/* Add Options Section */}
          <div className="space-y-1">
            {/* Upload Files */}
            <button
              {...getRootProps()}
              className={cn(
                "w-full p-2 rounded text-left transition-colors text-sm",
                isDragActive 
                  ? "bg-accent/10" 
                  : "hover:bg-secondary/50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">Upload files</span>
              </div>
            </button>

            {/* Add Source */}
            <button onClick={() => setShowAddDialog(true)} className="w-full p-2 rounded text-left hover:bg-secondary/50 transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">Add source</span>
              </div>
            </button>

            {/* Add from Vault Project */}
            <button className="w-full p-2 rounded text-left hover:bg-secondary/50 transition-colors text-sm">
              <div className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">Add from Vault project</span>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Sources Section */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Sources</p>
            
            {/* Web Search Source */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full p-2 rounded text-left hover:bg-secondary/50 transition-colors text-sm flex items-center gap-2"
            >
              {activeSourceIds.includes('web-search') ? (
                <Check className="w-3.5 h-3.5 text-accent font-bold" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="font-medium">Web search</span>
            </motion.button>
          </div>

          {/* Uploaded Documents */}
          {sources.filter(s => s.type === 'document').length > 0 && (
            <>
              <div className="h-px bg-border/50" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Uploaded</p>
                
                {sources.filter(s => s.type === 'document').map((source) => (
                  <div
                    key={source.id}
                    className="w-full p-2 rounded text-left hover:bg-secondary/50 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <button
                      onClick={() => toggleSource(source.id)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      {activeSourceIds.includes(source.id) ? (
                        <Check className="w-3.5 h-3.5 text-foreground font-bold flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded border border-muted-foreground/30 flex-shrink-0" />
                      )}
                      <p className="font-medium truncate">{source.name}</p>
                    </button>
                    <button
                      onClick={() => removeSource(source.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 ml-auto hover:scale-110"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <AddSourceDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </motion.div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 1H7V7H1V8H7V14H8V8H14V7H8V1Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}
