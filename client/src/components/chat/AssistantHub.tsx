import React from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Plus, MessageCircle, Sparkles, Search, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function AssistantHub({ onStartChat }: { onStartChat: (query: string) => void }) {
  const { activeSourceIds, sources, setSourcePanelOpen, createConversation, addMessage, conversations } = useStore();
  const [input, setInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('discover');

  const activeSources = sources.filter(s => activeSourceIds.includes(s.id));

  const handleSubmit = () => {
    if (input.trim()) {
      // Create new conversation
      const conversationId = createConversation(input.slice(0, 50), activeSourceIds);
      
      // Add user message
      addMessage({
        role: 'user',
        content: input,
      });
      
      // Trigger system message and navigate
      onStartChat(input);
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

  const discoverCards = [
    {
      icon: Search,
      title: 'Search & Analyze',
      description: 'Find insights across documents',
    },
    {
      icon: Sparkles,
      title: 'Summarize',
      description: 'Get key takeaways instantly',
    },
    {
      icon: FileText,
      title: 'Compare',
      description: 'Find differences and patterns',
    },
    {
      icon: Zap,
      title: 'Extract Data',
      description: 'Pull structured info from files',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-full w-full px-4 py-8"
    >
      <div className="w-full max-w-3xl space-y-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">Ask Zania</h1>
          <p className="text-muted-foreground">Quickly search, analyze, or understand materials from all your sources</p>
        </motion.div>

        {/* Main Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
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
          </div>

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

        {/* Discover & Recent Queries Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-secondary/30 border-b border-border/50 p-0 h-auto rounded-none mb-6 w-fit">
              <TabsTrigger 
                value="discover" 
                className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="recent" 
                className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Recent queries
              </TabsTrigger>
            </TabsList>

            {/* Discover Tab */}
            <TabsContent value="discover" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoverCards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg border border-border/50 bg-card hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <card.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground mb-1">{card.title}</h3>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Recent Queries Tab */}
            <TabsContent value="recent" className="mt-0">
              {conversations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No recent queries yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.slice().reverse().map((conv, idx) => {
                    const userMessage = conv.messages.find(m => m.role === 'user');
                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 rounded-lg border border-border/50 bg-card hover:bg-secondary/30 cursor-pointer transition-colors group"
                      >
                        <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                          {userMessage?.content.slice(0, 60)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conv.createdAt).toLocaleDateString()} • {conv.messages.length} messages
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
