import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionQueue } from '@/components/bulk/QuestionQueue';
import { Clock, MessageSquare, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

export default function History() {
  const [activeTab, setActiveTab] = React.useState('conversations');

  const mockConversations = [
    { id: '1', title: 'Project Alpha Analysis', date: 'Today at 2:45 PM', preview: 'What is the total revenue for Q3 2024?' },
    { id: '2', title: 'Q3 Financial Review', date: 'Yesterday at 10:30 AM', preview: 'Identify any legal risks mentioned...' },
    { id: '3', title: 'Competitor Research', date: '2 days ago', preview: 'List all competitors mentioned in the strategy...' },
  ];

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
              {mockConversations.map((conv, idx) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-secondary/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{conv.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conv.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{conv.preview}</p>
                </motion.div>
              ))}
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
