import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionQueue } from '@/components/bulk/QuestionQueue';
import { Clock, MessageSquare, ListTodo, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';

export default function History() {
  const [activeTab, setActiveTab] = React.useState('conversations');
  const { conversations, setCurrentConversation } = useStore();

  const formatDate = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    // Navigate back to assistant tab
    window.location.hash = '#assistant';
  };

  return (
    <div className="flex flex-col min-h-full max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-heading font-semibold mb-2">History</h1>
          <p className="text-muted-foreground">Your past conversations and questions</p>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-secondary/30 border-b border-border/50 p-0 h-auto rounded-none mb-6 w-fit">
          <TabsTrigger value="conversations" className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="questions" className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-0 flex-1">
          <ScrollArea className="h-full -mx-8 px-8">
            <div className="space-y-3 pb-8">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground/60">Start a new conversation in the Assistant tab</p>
                </div>
              ) : (
                conversations.map((conv, idx) => {
                  const preview = conv.messages.find(m => m.role === 'user')?.content.slice(0, 60) || 'Empty conversation';
                  return (
                    <motion.button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="w-full p-4 rounded-lg border border-border/50 bg-card hover:bg-secondary/30 cursor-pointer transition-colors text-left group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground group-hover:text-primary">{conv.title}</h3>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(conv.createdAt)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{preview}...</p>
                    </motion.button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="questions" className="mt-0 flex-1">
          <QuestionQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
}
