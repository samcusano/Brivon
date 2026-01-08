import React from 'react';
import { Shell } from '@/components/layout/Shell';
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
  Pause,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentActivity() {
  const workstations = [
    { id: 'Risk-01', load: 82, status: 'Active' },
    { id: 'Risk-02', load: 12, status: 'Idle' },
    { id: 'Compliance-01', load: 45, status: 'Active' },
    { id: 'Compliance-02', load: 0, status: 'Paused' },
  ];

  const agents = [
    { id: 'Agent-7291', status: 'Processing', task: 'Vendor risk assessment', uptime: '2h 14m', progress: 78 },
    { id: 'Agent-4521', status: 'Active', task: 'Compliance check', uptime: '5h 32m', progress: 92 },
    { id: 'Agent-8834', status: 'Waiting', task: 'Data validation', uptime: '1h 05m', progress: 45 },
    { id: 'Agent-2156', status: 'Processing', task: 'Document analysis', uptime: '3h 48m', progress: 61 },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Processing':
        return 'bg-[#C8E6B0] text-[#1a1a1a]';
      case 'Idle':
      case 'Waiting':
        return 'bg-[#F0F4E8] text-[#666]';
      case 'Paused':
        return 'bg-[#f5f5f5] text-[#999]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Shell>
      <div className="p-10 max-w-6xl mx-auto space-y-12">
        {/* Stats Section */}
        <div className="flex gap-20">
          {/* Workstations */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Workstations</h2>
            <div className="flex gap-4">
              {workstations.map((ws, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-36 h-28 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]",
                    i === 0 ? "bg-[#4A9B8C] text-white" : "border border-[#e5e5e5]"
                  )}
                  data-testid={`card-workstation-${ws.id}`}
                >
                  <span className="text-4xl font-bold">{ws.load}%</span>
                  <span className={cn("text-sm mt-1", i === 0 ? "text-white/80" : "text-[#666]")}>{ws.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Workers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Active Workers</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors" data-testid="filter-status">
                Status <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors" data-testid="filter-resources">
                Resources <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e5e5e5] hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4 pl-6">Agent ID</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Current Task</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Uptime</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Progress</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4 pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent, idx) => (
                  <TableRow 
                    key={idx} 
                    className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
                    data-testid={`row-agent-${agent.id}`}
                  >
                    <TableCell className="py-5 pl-6">
                      <span className="font-semibold text-[#1a1a1a]">{agent.id}</span>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge className={cn(
                        "font-medium text-xs px-3 py-1 rounded-full",
                        getStatusStyle(agent.status)
                      )} data-testid={`badge-status-${agent.id}`}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-[#666] text-sm">{agent.task}</TableCell>
                    <TableCell className="py-5 text-[#666] text-sm">{agent.uptime}</TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#4A9B8C] rounded-full transition-all"
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#666]">{agent.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#999] hover:text-[#666] hover:bg-[#f5f5f5]">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#999] hover:text-[#666] hover:bg-[#f5f5f5]">
                          <SettingsIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 pt-4">
            <button className="flex items-center gap-1 text-sm text-[#999] hover:text-[#1a1a1a] transition-colors" data-testid="button-previous">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1 ml-4">
              <button className="w-8 h-8 rounded-md bg-[#1a1a1a] text-white text-sm font-medium">1</button>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors">2</button>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors">3</button>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors ml-4" data-testid="button-next">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
