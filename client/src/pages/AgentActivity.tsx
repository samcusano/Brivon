import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AgentActivity() {
  return (
    <Shell>
      <div className="p-8 max-w-5xl mx-auto space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-foreground">AI Agent Activity</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Auto-refresh: On
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Active Agents (12)</h2>
          
          <div className="space-y-4">
            {[
              { id: 'VendorRiskMonitor-07', time: '2h 14m', progress: 60, task: 'Analyzing 47 vendor security questionnaires', sub: 'Completed: 28 vendors | In progress: 14 vendors', last: 'Flagged VENDOR-0231 (2 min ago)' },
              { id: 'ComplianceMonitor-03', time: '6h 47m', progress: 85, task: 'Monitoring 127 regulatory sources for changes', sub: 'Detected: 3 new regulations, 1 amendment', last: 'Flagged GDPR update (14 min ago)' }
            ].map((agent, idx) => (
              <Card key={idx} className="overflow-hidden border-border/50 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
                        🤖
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{agent.id}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="bg-secondary px-2 py-0.5 rounded text-[10px] font-bold">RUNNING</span>
                          <span>{agent.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm">Pause</Button>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                         <span>Overall Progress</span>
                         <span>{agent.progress}%</span>
                       </div>
                       <Progress value={agent.progress} className="h-1.5" />
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                      <p className="text-sm font-semibold mb-2">{agent.task}</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> {agent.sub.split('|')[0]}</li>
                        <li className="flex items-center gap-2"><RefreshCw className="w-3 h-3 text-primary animate-spin" /> {agent.sub.split('|')[1]}</li>
                      </ul>
                    </div>

                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      Last Action: {agent.last}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="ghost" className="w-full text-muted-foreground text-xs hover:text-foreground">
            Show all 12 agents <ChevronRight className="ml-1 w-3 h-3 rotate-90" />
          </Button>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-destructive/80 border-b border-destructive/20 pb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Awaiting Input (3)
          </h2>
          
          <div className="grid gap-4">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="text-2xl opacity-50">🤖</div>
                  <div>
                    <h3 className="font-bold">VendorRiskMonitor-04</h3>
                    <p className="text-sm text-muted-foreground">Waiting 2d 3h • Needs decision on VENDOR-0512</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">Review Now</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Shell>
  );
}