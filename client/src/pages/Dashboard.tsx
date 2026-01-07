import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Users, 
  LayoutGrid,
  ChevronDown,
  Layers
} from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const quickFilters = [
    { label: 'My Decisions', icon: Users, color: 'text-primary' },
    { label: 'Urgent (< 24h)', icon: Clock, color: 'text-destructive' },
    { label: 'Awaiting Input', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Recent Completions', icon: CheckCircle2, color: 'text-green-500' },
  ];

  const riskFilters = [
    { label: 'Vendor Risk' },
    { label: 'Compliance' },
    { label: 'Security' },
    { label: 'Internal Controls' },
  ];

  return (
    <Shell>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Statistics section remains same */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> My Decisions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center py-4">
              <div className="flex flex-col text-center">
                <span className="text-3xl font-black text-destructive">2</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">🔴 Urgent</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-3xl font-black text-amber-600">8</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">🟡 This Week</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-3xl font-black text-green-600">15</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">🟢 Review</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" /> Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center py-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-8 min-w-max">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl border border-primary/20">🤖</div>
                  <div>
                    <span className="text-2xl font-black text-primary">12</span>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Agents</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border/50 hidden sm:block" />
                <div className="flex flex-col text-center">
                  <span className="text-2xl font-black text-muted-foreground">3</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Awaiting Data</p>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-2xl font-black text-green-600">8</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Priority Queue
            </h2>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 gap-2 border-border/50 bg-white/50 hover:bg-white transition-all shadow-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground/80">My Decisions</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">Queue Filters</DropdownMenuLabel>
                  {quickFilters.map((filter, i) => (
                    <DropdownMenuItem key={i} className="gap-2 px-2 py-2 cursor-pointer">
                      <filter.icon className={cn("w-4 h-4", filter.color)} />
                      <span className="font-medium text-sm">{filter.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">Risk Type</DropdownMenuLabel>
                  {riskFilters.map((filter, i) => (
                    <DropdownMenuItem key={i} className="gap-2 px-2 py-2 cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="font-medium text-sm">{filter.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'VENDOR-0847', name: 'Acme Corp', issue: 'SOC 2 cert expired 14 days ago', rec: 'Recommend offboarding', conf: 92, sla: '6 hours remaining', priority: 'CRITICAL', color: 'destructive' },
              { id: 'VENDOR-0231', name: 'SecureData Inc', issue: 'New breach disclosed (CISA alert)', rec: 'Request incident report', conf: 78, sla: 'Due Tomorrow', priority: 'HIGH', color: 'amber-600' },
              { id: 'POLICY-0092', name: 'GDPR Update', issue: 'EU data retention rules changed', rec: 'Update 12 policies', conf: 65, sla: 'Due Next week', priority: 'MEDIUM', color: 'green-600' }
            ].map((item, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all border-l-4 group" style={{ borderLeftColor: item.color === 'destructive' ? 'var(--destructive)' : item.color === 'amber-600' ? '#d97706' : '#16a34a' }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-bold">{item.id}</Badge>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                      </div>
                      <p className="text-foreground/80 font-medium">{item.issue}</p>
                    </div>
                    <Badge className={cn(
                      item.priority === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                      item.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      'bg-green-100 text-green-700 border-green-200'
                    )}>
                      {item.priority}
                    </Badge>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg mb-4 flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md border border-border/50">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.rec}</p>
                      <p className="text-xs text-muted-foreground">AI Confidence: {item.conf}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.sla}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Assigned: You</span>
                    </div>
                    <Link href={`/finding/${item.id}`}>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Review Finding <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function UsersIcon(props: any) {
  return (
    <Users {...props} />
  );
}