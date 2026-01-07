import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Users, 
  LayoutGrid,
  ChevronDown,
  Layers,
  Filter
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
            <CardContent className="flex justify-between items-center py-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-10 min-w-max">
                <div className="flex items-center gap-4 group cursor-help">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <span className="relative text-4xl font-black text-primary tracking-tighter">12</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Active Agents</p>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-px h-10 bg-gradient-to-b from-transparent via-border/60 to-transparent hidden sm:block" />

                <div className="flex flex-col group cursor-help">
                  <span className="text-3xl font-black text-foreground/40 group-hover:text-foreground transition-colors duration-300 tracking-tighter">3</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Awaiting Data</p>
                </div>

                <div className="flex flex-col group cursor-help">
                  <span className="text-3xl font-black text-emerald-500 group-hover:scale-110 transition-transform duration-300 tracking-tighter">8</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              Queue
            </h2>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 gap-2 border-border/50 bg-white/50 hover:bg-white transition-all shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">My Decisions</span>
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
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 gap-2 border-border/50 bg-white/50 hover:bg-white transition-all shadow-sm">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Risk Type</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">By Risk Type</DropdownMenuLabel>
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
          
          <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="w-[120px] text-[10px] font-black uppercase tracking-widest py-4">ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Entity / Issue</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Priority</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">SLA / Status</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'VENDOR-0847', name: 'Acme Corp', issue: 'SOC 2 cert expired 14 days ago', rec: 'Recommend offboarding', conf: 92, sla: '6 hours remaining', priority: 'CRITICAL', color: 'destructive' },
                  { id: 'VENDOR-0231', name: 'SecureData Inc', issue: 'New breach disclosed (CISA alert)', rec: 'Request incident report', conf: 78, sla: 'Due Tomorrow', priority: 'HIGH', color: 'amber-600' },
                  { id: 'POLICY-0092', name: 'GDPR Update', issue: 'EU data retention rules changed', rec: 'Update 12 policies', conf: 65, sla: 'Due Next week', priority: 'MEDIUM', color: 'green-600' },
                  { id: 'ENTITY-1142', name: 'FinTech Solutions', issue: 'Abnormal API usage pattern', rec: 'Verify identity', conf: 88, sla: '12 hours remaining', priority: 'HIGH', color: 'amber-600' },
                  { id: 'VENDOR-0552', name: 'CloudScale', issue: 'Sub-processor change', rec: 'Review impact', conf: 72, sla: 'Due In 3 days', priority: 'LOW', color: 'slate-500' }
                ].map((item, idx) => (
                  <TableRow key={idx} className="group hover:bg-muted/20 transition-colors">
                    <TableCell className="py-4">
                      <Badge variant="outline" className="text-[10px] font-bold bg-background shadow-sm">{item.id}</Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{item.issue}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-primary/70 font-bold uppercase tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-primary/40" />
                          {item.rec}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "text-[10px] font-black",
                        item.priority === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                        item.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                        item.priority === 'MEDIUM' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      )}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                          <Clock className="w-3 h-3 text-muted-foreground" /> {item.sla}
                        </span>
                        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              item.priority === 'CRITICAL' ? 'bg-destructive' : 'bg-primary'
                            )} 
                            style={{ width: `${item.conf}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Link href={`/finding/${item.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium">
                Showing <span className="text-foreground font-bold">5</span> of <span className="text-foreground font-bold">42</span> findings
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold uppercase tracking-widest disabled:opacity-30" disabled>
                  Prev
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
                  Next
                </Button>
              </div>
            </div>
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