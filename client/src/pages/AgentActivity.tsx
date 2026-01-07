import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentActivity() {
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

        {/* Exploratory Design 1: Technical "Blade" View */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#B7C3B0]/20 pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2F2A26]/40 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Active Processing Blades
            </h2>
            <Badge variant="outline" className="text-[10px] font-bold border-[#B7C3B0]/50 bg-[#B7C3B0]/5 text-[#2F2A26]/60">
              12 Running
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[
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
              }
            ].map((agent, idx) => (
              <div key={idx} className="group relative bg-white border border-[#B7C3B0]/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex h-full">
                  {/* Status Sidecar */}
                  <div className={cn("w-1.5 h-full transition-all group-hover:w-2", agent.color)} />
                  
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#F6F3EE] flex items-center justify-center border border-[#B7C3B0]/20">
                          <Cpu className="w-5 h-5 text-[#2F2A26]/60" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-[#2F2A26]">{agent.id}</h3>
                            <Badge className="bg-[#F6F3EE] text-[#2F2A26] border-[#B7C3B0]/30 text-[9px] font-black uppercase px-1.5 h-4">v2.4.0</Badge>
                          </div>
                          <p className="text-[10px] font-bold text-[#B7C3B0] uppercase flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" /> Uptime: {agent.uptime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#B7C3B0]/10">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase text-[#2F2A26]/40 tracking-wider">Workload Integrity</span>
                          <span className="text-xs font-black">{agent.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#F6F3EE] rounded-full overflow-hidden border border-[#B7C3B0]/20">
                          <div 
                            className={cn("h-full transition-all duration-1000", agent.color)} 
                            style={{ width: `${agent.progress}%` }} 
                          />
                        </div>
                        <p className="text-xs font-bold text-[#2F2A26]/80">{agent.status}</p>
                      </div>

                      {/* Metrics Section */}
                      <div className="flex items-center justify-around bg-[#F6F3EE]/50 rounded-lg p-3 border border-[#B7C3B0]/10">
                        {Object.entries(agent.metrics).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <p className="text-[9px] font-black uppercase text-[#B7C3B0] mb-0.5">{key}</p>
                            <p className="text-xs font-black text-[#2F2A26]">{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Live Log */}
                      <div className="bg-[#2F2A26] rounded-lg p-3 font-mono text-[10px] text-green-400/80 overflow-hidden relative border border-white/5">
                        <div className="flex items-center gap-2 mb-1.5 opacity-50">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>stdout</span>
                        </div>
                        <p className="truncate line-clamp-2">
                          {agent.log}
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2F2A26] to-transparent pointer-events-none opacity-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exploratory Design 2: High-Level Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#B7C3B0]/20 pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2F2A26]/40 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Quick Status Grid
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

        {/* Urgent Attention View */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-destructive border-b border-destructive/10 pb-2">
            <AlertCircle className="w-4 h-4" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Intervention Required</h2>
          </div>
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner border border-destructive/10">
                 <span className="text-3xl">⚠️</span>
               </div>
               <div>
                 <h3 className="text-lg font-black text-[#2F2A26]">VendorRiskMonitor-04 is stalling</h3>
                 <p className="text-sm text-[#2F2A26]/60 font-medium">Needs human verification on 12 findings for VENDOR-0512 to resume execution.</p>
               </div>
            </div>
            <Button size="lg" className="bg-[#2F2A26] text-white font-black uppercase tracking-widest px-8 rounded-xl hover:scale-[1.02] transition-transform">
              Resume Agent
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Settings(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}