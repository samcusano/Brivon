import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Activity,
  Zap,
  Terminal,
  Cpu,
  Clock,
  ArrowUpRight,
  Settings as SettingsIcon
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

export default function AgentActivity() {
  const agents = [
    { 
      id: 'VendorRiskMonitor-07', 
      uptime: '2h 14m', 
      progress: 60, 
      status: 'Analyzing Questionnaires',
      metrics: { cpu: '12%', mem: '1.2GB', threads: 64 },
      log: 'Found SOC2 mismatch for Acme Corp...',
      color: 'bg-primary'
    },
    { 
      id: 'ComplianceMonitor-03', 
      uptime: '6h 47m', 
      progress: 85, 
      status: 'Regulatory Scanning',
      metrics: { cpu: '4%', mem: '0.8GB', threads: 32 },
      log: 'Updated GDPR schema for EU region...',
      color: 'bg-amber-500'
    },
    { 
      id: 'EntityScanner-12', 
      uptime: '1h 05m', 
      progress: 30, 
      status: 'Entity Resolution',
      metrics: { cpu: '22%', mem: '2.4GB', threads: 128 },
      log: 'Matching 42 entities in US-East...',
      color: 'bg-blue-500'
    }
  ];

  return (
    <Shell>
      <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#B7C3B0]">
            <Activity className="w-3 h-3" /> System Heartbeat
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight text-[#2F2A26]">Agent Activity</h1>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#B7C3B0] uppercase">Compute Load</span>
                <span className="text-sm font-black">24.2 GFLOPS</span>
              </div>
              <div className="h-8 w-px bg-[#B7C3B0]/20" />
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#B7C3B0]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Live Sync</span>
              </div>
            </div>
          </div>
        </header>

        {/* Table View */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#B7C3B0]/20 pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2F2A26]/40 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Active Processing Blades
            </h2>
            <Badge variant="outline" className="text-[10px] font-bold border-[#B7C3B0]/50 bg-[#B7C3B0]/5 text-[#2F2A26]/60">
              12 Running
            </Badge>
          </div>
          
          <div className="bg-white rounded-xl border border-[#B7C3B0]/30 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F6F3EE]/50">
                <TableRow className="hover:bg-transparent border-b border-[#B7C3B0]/20">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Agent ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Status / Workload</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-center">Resources</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Live Log</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent, idx) => (
                  <TableRow key={idx} className="group hover:bg-[#F6F3EE]/30 transition-colors">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-1 h-8 rounded-full", agent.color)} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[#2F2A26]">{agent.id}</span>
                            <Badge className="bg-[#F6F3EE] text-[#2F2A26] border-[#B7C3B0]/30 text-[8px] font-black uppercase px-1 h-3.5">v2.4.0</Badge>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-bold text-[#B7C3B0] uppercase">
                            <Clock className="w-2.5 h-2.5" /> {agent.uptime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2 max-w-[200px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#2F2A26]/80">{agent.status}</span>
                          <span className="text-[10px] font-black">{agent.progress}%</span>
                        </div>
                        <div className="h-1 bg-[#F6F3EE] rounded-full overflow-hidden border border-[#B7C3B0]/10">
                          <div 
                            className={cn("h-full transition-all duration-1000", agent.color)} 
                            style={{ width: `${agent.progress}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center justify-center gap-4 bg-[#F6F3EE]/50 rounded-lg p-2 border border-[#B7C3B0]/10">
                        {Object.entries(agent.metrics).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <p className="text-[8px] font-black uppercase text-[#B7C3B0]">{key}</p>
                            <p className="text-[10px] font-black text-[#2F2A26]">{val}</p>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="bg-[#2F2A26] rounded-md p-2 font-mono text-[9px] text-green-400/80 max-w-[240px] truncate">
                        <span className="opacity-40 mr-2">$</span>
                        {agent.log}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#B7C3B0]/10 text-[#2F2A26]/60">
                          <SettingsIcon className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Quick Status Grid (Secondary) */}
        <section className="space-y-6 opacity-80">
          <div className="flex items-center justify-between border-b border-[#B7C3B0]/20 pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2F2A26]/40 flex items-center gap-2">
              <Zap className="w-3 h-3" /> System Nodes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'Risk-01', load: 82, status: 'Active' },
              { id: 'Risk-02', load: 12, status: 'Idle' },
              { id: 'Compliance-01', load: 45, status: 'Active' },
              { id: 'Compliance-02', load: 0, status: 'Paused' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white border border-[#B7C3B0]/30 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F6F3EE] flex items-center justify-center text-lg">🤖</div>
                  <Badge className={cn(
                    "text-[8px] font-black uppercase",
                    item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-[#F6F3EE] text-[#B7C3B0]'
                  )}>
                    {item.status}
                  </Badge>
                </div>
                <h4 className="font-black text-sm mb-1">{item.id}</h4>
                <div className="flex items-center justify-between text-[10px] font-bold text-[#B7C3B0] mb-2">
                  <span>Load</span>
                  <span>{item.load}%</span>
                </div>
                <div className="h-1 bg-[#F6F3EE] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all group-hover:bg-primary/80" 
                    style={{ width: `${item.load}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}