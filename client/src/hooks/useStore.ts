import { create } from 'zustand';

export type SourceType = 'document' | 'api' | 'memory' | 'web';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastUsed?: string;
  details?: string;
}

export interface Citation {
  id: string;
  sourceId: string;
  excerpt: string;
  page?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  timestamp: number;
}

export interface QueueItem {
  id: string;
  question: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  answer?: string;
  category?: string;
}

interface AppState {
  // Chat
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  // Sources
  sources: Source[];
  activeSourceIds: string[];
  toggleSource: (id: string) => void;
  addSource: (source: Source) => void;
  removeSource: (id: string) => void;
  
  // UI State
  isSourcePanelOpen: boolean;
  setSourcePanelOpen: (open: boolean) => void;
  
  // Bulk Queue
  queue: QueueItem[];
  addToQueue: (questions: string[]) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
  isProcessingQueue: boolean;
  startQueueProcessing: () => void;
  stopQueueProcessing: () => void;
  
  // System State
  systemMessageVisible: boolean;
  setSystemMessageVisible: (visible: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello. I'm Zania. I can help you analyze documents, connect to APIs, and answer complex questions using multiple sources. \n\nUpload a document to get started or ask me anything.",
      timestamp: Date.now(),
    }
  ],
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).slice(2), timestamp: Date.now() }]
  })),

  sources: [
    { id: 's1', type: 'document', name: 'Q3-Financial-Report.pdf', status: 'connected', lastUsed: '2 mins ago' },
    { id: 's2', type: 'api', name: 'Salesforce CRM', status: 'connected', lastUsed: '1 hour ago' },
    { id: 's3', type: 'web', name: 'Competitor Analysis', status: 'connected', lastUsed: 'Yesterday' },
    { id: 's4', type: 'memory', name: 'Project Alpha Context', status: 'connected', details: 'Stored from previous session' },
  ],
  activeSourceIds: ['s1', 's2', 's3', 's4'],
  toggleSource: (id) => set((state) => ({
    activeSourceIds: state.activeSourceIds.includes(id)
      ? state.activeSourceIds.filter((sid) => sid !== id)
      : [...state.activeSourceIds, id]
  })),
  addSource: (source) => set((state) => ({ sources: [...state.sources, source] })),
  removeSource: (id) => set((state) => ({ sources: state.sources.filter((s) => s.id !== id) })),

  isSourcePanelOpen: true,
  setSourcePanelOpen: (open) => set({ isSourcePanelOpen: open }),

  queue: [],
  addToQueue: (questions) => set((state) => ({
    queue: [
      ...state.queue,
      ...questions.map((q) => ({
        id: Math.random().toString(36).slice(2),
        question: q,
        status: 'pending' as const,
        category: ['Financial', 'Legal', 'Technical'][Math.floor(Math.random() * 3)]
      }))
    ]
  })),
  updateQueueItem: (id, updates) => set((state) => ({
    queue: state.queue.map((item) => (item.id === id ? { ...item, ...updates } : item))
  })),
  isProcessingQueue: false,
  startQueueProcessing: () => set({ isProcessingQueue: true }),
  stopQueueProcessing: () => set({ isProcessingQueue: false }),

  systemMessageVisible: false,
  setSystemMessageVisible: (visible) => set({ systemMessageVisible: visible }),
}));
