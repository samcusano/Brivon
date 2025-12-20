import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { QuestionQueue } from '@/components/bulk/QuestionQueue';
import { QuestionExtractor } from '@/components/bulk/QuestionExtractor';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { MessageSquare, ListTodo, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sidebar Navigation
function SidebarNav({ active, setActive }: { active: string, setActive: (id: string) => void }) {
  const { queue } = useStore();
  
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'queue', label: 'Question Queue', icon: ListTodo, count: queue.length },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="px-3 space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start font-medium h-10",
            active === item.id 
              ? "bg-secondary text-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
          )}
          onClick={() => setActive(item.id)}
        >
          <item.icon className="w-4 h-4 mr-3" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.count !== undefined && item.count > 0 && (
            <span className="bg-primary/20 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
              {item.count}
            </span>
          )}
        </Button>
      ))}
      
      <div className="pt-8 pb-2 px-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Chats</p>
      </div>
      <div className="space-y-1">
         {['Project Alpha Analysis', 'Q3 Financial Review', 'Competitor Research'].map((chat, i) => (
           <Button key={i} variant="ghost" className="w-full justify-start text-sm h-8 font-normal text-muted-foreground hover:text-foreground">
             <span className="truncate">{chat}</span>
           </Button>
         ))}
      </div>
    </nav>
  );
}

export default function Home() {
  const { messages, sources } = useStore();
  const [activeTab, setActiveTab] = React.useState('chat');
  const [showExtractor, setShowExtractor] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Trigger extractor when a new document is added (simulated)
  // In a real app, this would be triggered by the actual upload event
  // Here we'll just check if the source count increases
  const prevSourcesCount = React.useRef(sources.length);
  
  React.useEffect(() => {
    if (sources.length > prevSourcesCount.current) {
        // Just checking if new source is a document for realism
        const newSource = sources[sources.length - 1];
        if (newSource.type === 'document') {
             setShowExtractor(true);
        }
    }
    prevSourcesCount.current = sources.length;
  }, [sources]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Shell
      sidebar={<SidebarNav active={activeTab} setActive={setActiveTab} />}
      panel={<SourcePanel />}
    >
      <div className="flex flex-col min-h-full max-w-5xl mx-auto w-full">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 p-4 md:p-8 space-y-6">
               <div className="h-4 md:h-12" />
               {messages.map((msg) => (
                 <ChatMessage key={msg.id} message={msg} />
               ))}
               <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 z-10">
               <ChatInput />
            </div>
          </>
        )}

        {activeTab === 'queue' && (
           <QuestionQueue />
        )}

        {activeTab === 'templates' && (
           <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Templates feature coming soon
           </div>
        )}
        
        {activeTab === 'settings' && (
           <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Settings coming soon
           </div>
        )}
      </div>

      <QuestionExtractor open={showExtractor} onOpenChange={setShowExtractor} />
    </Shell>
  );
}
