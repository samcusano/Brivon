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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const queueItems = [
    { id: '0847', entity: 'Acme Corp', issue: 'SOC 2 cert expired', due: 'Today', priority: 'Urgent' },
    { id: '5139', entity: 'Fintech solution', issue: 'New breach disclosed (CISA alert)', due: 'Today', priority: 'Urgent' },
    { id: '65423', entity: 'GDRP Compliacne', issue: 'Abnormal API usage pattern', due: 'Today', priority: 'High' },
    { id: '3826', entity: 'Cloudscale', issue: 'EU data retention rules changed', due: '3 days', priority: 'High' },
    { id: '35427', entity: 'GDRP Compliance', issue: 'SOC 2 cert expired', due: '3 days', priority: 'Medium' },
    { id: '42424', entity: 'Apollo Global Management', issue: 'New breach disclosed (CISA alert)', due: '14 days', priority: 'Medium' },
    { id: '35423', entity: 'CloudScale', issue: 'Abnormal API usage pattern', due: '14 days', priority: 'Low' },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-[#1a1a1a] text-white';
      case 'High':
        return 'bg-[#E8F5A3] text-[#1a1a1a]';
      case 'Medium':
        return 'bg-[#C8E6B0] text-[#1a1a1a]';
      case 'Low':
        return 'bg-[#F0F4E8] text-[#666]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Shell>
      <div className="p-10 max-w-6xl mx-auto space-y-12">
        {/* Stats Section */}
        <div className="flex gap-20">
          {/* My Decision */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">My decision</h2>
            <div className="flex gap-4">
              <div className="w-32 h-28 bg-[#1a1a1a] rounded-xl flex flex-col items-center justify-center text-white" data-testid="card-urgent">
                <span className="text-5xl font-bold">3</span>
                <span className="text-sm mt-1">Urgent</span>
              </div>
              <div className="w-32 h-28 border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center" data-testid="card-this-week">
                <span className="text-5xl font-bold text-[#1a1a1a]">2</span>
                <span className="text-sm text-[#666] mt-1">This week</span>
              </div>
              <div className="w-32 h-28 border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center" data-testid="card-review">
                <span className="text-5xl font-bold text-[#1a1a1a]">8</span>
                <span className="text-sm text-[#666] mt-1">Review</span>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Agents</h2>
            <div className="flex gap-4">
              <div className="w-32 h-28 border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center" data-testid="card-active">
                <span className="text-5xl font-bold text-[#1a1a1a]">12</span>
                <span className="text-sm text-[#666] mt-1">Active</span>
              </div>
              <div className="w-32 h-28 border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center" data-testid="card-waiting">
                <span className="text-5xl font-bold text-[#1a1a1a]">2</span>
                <span className="text-sm text-[#666] mt-1">Waiting</span>
              </div>
              <div className="w-32 h-28 border border-[#e5e5e5] rounded-xl flex flex-col items-center justify-center" data-testid="card-completed">
                <span className="text-5xl font-bold text-[#1a1a1a]">8</span>
                <span className="text-sm text-[#666] mt-1">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Queue</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors" data-testid="filter-decision">
                Decision <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors" data-testid="filter-risks">
                Risks <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e5e5e5] hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4 pl-6">ID</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Issue</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Issue</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4">Due</TableHead>
                  <TableHead className="text-xs font-medium text-[#999] uppercase tracking-wider py-4 pr-6">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueItems.map((item, idx) => (
                  <TableRow 
                    key={idx} 
                    className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors cursor-pointer group"
                    data-testid={`row-queue-${item.id}`}
                  >
                    <TableCell className="py-5 pl-6 text-[#999] text-sm">{item.id}</TableCell>
                    <TableCell className="py-5">
                      <span className="font-semibold text-[#1a1a1a]">{item.entity}</span>
                    </TableCell>
                    <TableCell className="py-5 text-[#666] text-sm">{item.issue}</TableCell>
                    <TableCell className="py-5 text-[#666] text-sm">{item.due}</TableCell>
                    <TableCell className="py-5 pr-6">
                      <Link href={`/finding/${item.id}`}>
                        <Badge className={cn(
                          "font-medium text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity",
                          getPriorityStyle(item.priority)
                        )} data-testid={`badge-priority-${item.id}`}>
                          {item.priority}
                        </Badge>
                      </Link>
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
              <button className="w-8 h-8 rounded-md bg-[#1a1a1a] text-white text-sm font-medium" data-testid="page-1">1</button>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors" data-testid="page-2">2</button>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors" data-testid="page-3">3</button>
              <span className="px-2 text-[#999]">...</span>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors" data-testid="page-67">67</button>
              <button className="w-8 h-8 rounded-md text-[#666] hover:bg-[#f0f0f0] text-sm transition-colors" data-testid="page-68">68</button>
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
