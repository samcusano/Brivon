import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { SystemMessage } from '@/components/chat/SystemMessage';
import { AssistantHub } from '@/components/chat/AssistantHub';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { QuestionExtractor } from '@/components/bulk/QuestionExtractor';
import { useStore } from '@/hooks/useStore';
import Vault from '@/pages/Vault';
import HistoryPage from '@/pages/History';
import { Button } from '@/components/ui/button';
import { Layers, BookOpen } from 'lucide-react';
import { AssistantIcon } from '@/components/icons/AssistantIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { cn } from '@/lib/utils';

// Sidebar Navigation
function SidebarNav({ active, setActive }: { active: string, setActive: (id: string) => void }) {
  const navItems = [
    { id: 'assistant', label: 'Assistant', icon: AssistantIcon },
    { id: 'vault', label: 'Vault', icon: Layers },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'history', label: 'History', icon: HistoryIcon },
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
        </Button>
      ))}
    </nav>
  );
}

export default function Home() {
  const { messages, sources, systemMessageVisible, setSystemMessageVisible, addMessage, currentConversationId, conversations } = useStore();
  const [activeTab, setActiveTab] = React.useState('assistant');
  const [showExtractor, setShowExtractor] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  
  // Get current conversation messages if in a conversation
  const displayMessages = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)?.messages || []
    : messages;

  // Trigger extractor when a new document is added (simulated)
  const prevSourcesCount = React.useRef(sources.length);
  
  React.useEffect(() => {
    if (sources.length > prevSourcesCount.current) {
        const newSource = sources[sources.length - 1];
        if (newSource.type === 'document') {
             setShowExtractor(true);
        }
    }
    prevSourcesCount.current = sources.length;
  }, [sources]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  // Simulate system message completion
  React.useEffect(() => {
    if (systemMessageVisible) {
      const timer = setTimeout(() => {
        setSystemMessageVisible(false);
      }, 5200); // After all steps + a bit
      return () => clearTimeout(timer);
    }
  }, [systemMessageVisible, setSystemMessageVisible]);

  const handleStartChat = (query: string) => {
    // Add system message to show processing steps
    setSystemMessageVisible(true);
    setShowChat(true);
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Based on your query about "${query}", I've analyzed the available sources and found relevant information. Here are the strongest pieces of evidence from your sources [1][2].`,
        citations: [
          { id: 'c1', sourceId: 's1', excerpt: 'Relevant information from Financial Report...', page: 1 },
          { id: 'c2', sourceId: 's2', excerpt: 'Supporting data from Salesforce CRM...', page: undefined }
        ]
      });
    }, 3000);
  };

  return (
    <Shell
      sidebar={<SidebarNav active={activeTab} setActive={setActiveTab} />}
      panel={<SourcePanel />}
    >
      {activeTab === 'assistant' && (
        <div className="flex flex-col min-h-full w-full">
          {!showChat && !currentConversationId ? (
            <AssistantHub onStartChat={handleStartChat} />
          ) : (
            <>
              <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
                 <div className="h-4 md:h-12 max-w-5xl mx-auto w-full" />
                 <div className="max-w-5xl mx-auto w-full space-y-6">
                   {displayMessages.map((msg) => (
                     <ChatMessage key={msg.id} message={msg} />
                   ))}
                 </div>
                 {systemMessageVisible && (
                   <div className="max-w-5xl mx-auto w-full">
                     <SystemMessage isCollapsed={false} />
                   </div>
                 )}
                 <div ref={bottomRef} />
              </div>

              <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 z-10">
                 <ChatInput />
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'vault' && <Vault />}
      {activeTab === 'library' && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
           Library feature coming soon
        </div>
      )}
      {activeTab === 'history' && <HistoryPage />}

      <QuestionExtractor open={showExtractor} onOpenChange={setShowExtractor} />
    </Shell>
  );
}
