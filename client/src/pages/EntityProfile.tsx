import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, ShieldAlert, ArrowUpRight, History as HistoryIcon, FileText, Search } from 'lucide-react';
import { Link } from 'wouter';

export default function EntityProfile() {
  return (
    <Shell>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">VENDOR-0847: Acme Corp</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Risk Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Overall Risk Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-amber-600">72</span>
                  <span className="text-sm font-bold text-muted-foreground mb-1">/ 100</span>
                  <span className="text-xs font-bold text-destructive flex items-center mb-1">
                    <ArrowUpRight className="w-3 h-3" /> Increasing
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Active Findings</span>
                  <div className="flex gap-1">
                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">1</Badge>
                    <Badge className="h-5 px-1.5 text-[10px] bg-amber-500">2</Badge>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">5</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground">Last Review</span>
                   <span className="font-semibold">4 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="findings" className="w-full">
              <TabsList className="bg-secondary/30 border border-border/50 p-1 mb-6">
                <TabsTrigger value="findings" className="text-xs uppercase font-bold tracking-widest px-6">Findings</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs uppercase font-bold tracking-widest px-6">Documents</TabsTrigger>
                <TabsTrigger value="history" className="text-xs uppercase font-bold tracking-widest px-6">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="findings" className="space-y-4 outline-none">
                <Card className="border-l-4 border-l-destructive shadow-sm group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-destructive" />
                          SOC 2 cert expired (14 days)
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">🤖 AI Recommendation: Suspend & offboard</p>
                      </div>
                      <Badge variant="destructive">CRITICAL</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                         6h SLA remaining
                       </span>
                       <Link href="/finding/VENDOR-0847">
                        <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white font-bold">Review & Decide</Button>
                       </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm opacity-80">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">Financial health declining</h3>
                      <Badge className="bg-amber-500">HIGH</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">🤖 AI Recommendation: Quarterly monitoring</p>
                    <Button variant="outline" size="sm" className="font-bold">View Details</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4" /> Decision History
                </h3>
                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-border/50">
                  <div className="relative">
                    <div className="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                    <p className="text-sm font-bold mb-1">Jan 3, 2026 • You accepted AI recommendation</p>
                    <p className="text-xs text-muted-foreground">Flagged expired cert, paused vendor access • Confidence: 92%</p>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                    <p className="text-sm font-bold mb-1 text-muted-foreground">Dec 10, 2025 • You overrode AI recommendation</p>
                    <p className="text-xs text-muted-foreground">AI suggested quarterly review, you chose monthly</p>
                    <p className="text-[10px] mt-1 italic italic italic">"Vendor handles sensitive PII"</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Shell>
  );
}