import React from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, AlertCircle, Play, Pause, Download, Trash2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function QuestionQueue() {
  const { queue, isProcessingQueue, startQueueProcessing, stopQueueProcessing, updateQueueItem } = useStore();
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');

  const filteredQueue = queue.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'pending' || item.status === 'processing';
    if (filter === 'completed') return item.status === 'completed';
    return true;
  });

  // Simulate processing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessingQueue) {
      interval = setInterval(() => {
        const pendingItem = queue.find(q => q.status === 'pending');
        if (pendingItem) {
          updateQueueItem(pendingItem.id, { status: 'processing' });
          setTimeout(() => {
            updateQueueItem(pendingItem.id, { 
              status: 'completed', 
              answer: "Based on the Q3 report, the revenue growth was primarily driven by the new enterprise tier launch in NA and EMEA regions."
            });
          }, 1000); // Simulate answer time
        } else {
          stopQueueProcessing();
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isProcessingQueue, queue, updateQueueItem, stopQueueProcessing]);

  const stats = {
    total: queue.length,
    completed: queue.filter(q => q.status === 'completed').length,
    pending: queue.filter(q => q.status === 'pending').length,
  };

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-heading font-semibold">Question Queue</h2>
           <p className="text-muted-foreground">Managing {stats.total} bulk questions from uploaded documents.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm">
             <Download className="w-4 h-4 mr-2" />
             Export CSV
           </Button>
           {isProcessingQueue ? (
             <Button variant="destructive" size="sm" onClick={stopQueueProcessing}>
               <Pause className="w-4 h-4 mr-2" />
               Pause Processing
             </Button>
           ) : (
             <Button onClick={startQueueProcessing} disabled={stats.pending === 0} size="sm">
               <Play className="w-4 h-4 mr-2" />
               {stats.pending === 0 ? 'All Done' : 'Start Processing'}
             </Button>
           )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <Button 
          variant={filter === 'all' ? 'secondary' : 'ghost'} 
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({stats.total})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'secondary' : 'ghost'} 
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pending ({stats.pending})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'secondary' : 'ghost'} 
          onClick={() => setFilter('completed')}
          size="sm"
        >
          Completed ({stats.completed})
        </Button>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-3 pb-8">
          {filteredQueue.length === 0 && (
             <div className="text-center py-20 text-muted-foreground">
               <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>No questions in the queue.</p>
               <Button variant="link" className="mt-2">Upload a document to extract questions</Button>
             </div>
          )}

          {filteredQueue.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className={cn(
                "p-4 rounded-xl border border-border/50 bg-card transition-all hover:shadow-md",
                item.status === 'processing' && "ring-1 ring-primary/50 bg-primary/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                   {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                   {item.status === 'processing' && <RefreshCcw className="w-5 h-5 text-primary animate-spin" />}
                   {item.status === 'pending' && <Circle className="w-5 h-5 text-muted-foreground/30" />}
                   {item.status === 'failed' && <AlertCircle className="w-5 h-5 text-destructive" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="font-medium text-foreground">{item.question}</span>
                     {item.category && (
                       <Badge variant="outline" className="text-[10px] bg-secondary/50 border-transparent text-secondary-foreground">
                         {item.category}
                       </Badge>
                     )}
                  </div>
                  
                  {item.answer ? (
                    <p className="text-sm text-muted-foreground bg-secondary/20 p-3 rounded-lg mt-2 leading-relaxed">
                      {item.answer}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic">
                      Waiting to process...
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="h-8 w-8">
                     <Trash2 className="w-4 h-4 text-muted-foreground" />
                   </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ListTodo(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="m3 17 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  )
}
