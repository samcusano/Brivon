import React from 'react';
import { useStore, SourceType } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, Upload, Plus, ChevronDown, ChevronRight, 
  FileText, Database, Globe, Cpu, CheckCircle2, Circle 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function SourcePanel() {
  const { isSourcePanelOpen, setSourcePanelOpen, sources, activeSourceIds, toggleSource, addSource } = useStore();
  
  // Group sources by type
  const groupedSources = {
    document: sources.filter(s => s.type === 'document'),
    api: sources.filter(s => s.type === 'api'),
    web: sources.filter(s => s.type === 'web'),
    memory: sources.filter(s => s.type === 'memory'),
  };

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
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
        <h2 className="font-heading font-semibold text-lg">Files & Sources</h2>
        <Button variant="ghost" size="icon" onClick={() => setSourcePanelOpen(false)} className="md:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          
          {/* Upload Area */}
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Click to upload or drag files</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT</p>
          </div>

          {/* Source Categories */}
          <SourceCategory 
            title="Documents" 
            icon={<FileText className="w-4 h-4" />} 
            items={groupedSources.document}
            activeIds={activeSourceIds}
            onToggle={toggleSource}
          />

          <SourceCategory 
            title="Integrations (MCP)" 
            icon={<Database className="w-4 h-4" />} 
            items={groupedSources.api}
            activeIds={activeSourceIds}
            onToggle={toggleSource}
          />

          <SourceCategory 
            title="Web Knowledge" 
            icon={<Globe className="w-4 h-4" />} 
            items={groupedSources.web}
            activeIds={activeSourceIds}
            onToggle={toggleSource}
          />

           <SourceCategory 
            title="Project Memory" 
            icon={<Cpu className="w-4 h-4" />} 
            items={groupedSources.memory}
            activeIds={activeSourceIds}
            onToggle={toggleSource}
          />
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-secondary/10 shrink-0">
        <Button className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>
    </div>
  );
}

function SourceCategory({ 
  title, 
  icon, 
  items, 
  activeIds, 
  onToggle 
}: { 
  title: string, 
  icon: React.ReactNode, 
  items: any[], 
  activeIds: string[], 
  onToggle: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (items.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
          <span>{title}</span>
          <span className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] min-w-[1.25rem] text-center">
            {items.length}
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="space-y-1 pt-1">
          {items.map((item) => {
            const isActive = activeIds.includes(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
                  isActive ? "bg-secondary/50 border-border/50" : "hover:bg-secondary/30"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-green-500 border-green-500" : "border-muted-foreground/30"
                )}>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {item.name}
                  </p>
                  {item.lastUsed && (
                    <p className="text-[10px] text-muted-foreground/70 truncate">
                      Used {item.lastUsed}
                    </p>
                  )}
                </div>

                <div className={cn("w-2 h-2 rounded-full", item.status === 'connected' ? "bg-green-400/50" : "bg-gray-300")} />
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
