import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Mail, 
  Info, 
  AlertTriangle, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';

export default function FindingDetail() {
  return (
    <Shell>
      <div className="p-8 max-w-5xl mx-auto space-y-8 pb-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" /> Back to Queue
              </Button>
            </Link>
            <div className="h-4 w-px bg-border/50 mx-2" />
            <h1 className="text-xl font-bold tracking-tight">VENDOR-0847: Acme Corp</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Finding Summary */}
            <Card className="border-l-4 border-l-destructive overflow-hidden">
              <CardHeader className="bg-destructive/5 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  SOC 2 Type II Certification Expired
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="font-bold text-destructive">CRITICAL</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Detected</p>
                  <p className="font-semibold">Jan 3, 2026 (4 days ago)</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last reviewed</p>
                  <p className="font-semibold text-muted-foreground/60 italic">Never</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">SLA</p>
                  <p className="font-bold text-destructive">6 hours remaining</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  AI Analysis
                </CardTitle>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm font-bold text-primary">92% (HIGH)</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommendation</h4>
                  <p className="font-semibold text-foreground bg-secondary/30 p-4 rounded-lg border border-border/50">
                    Suspend vendor access and initiate offboarding per Policy TPRM-004
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Reasoning</h4>
                  <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-4">
                    <li>Cert expired 14 days ago (threshold: 7 days)</li>
                    <li>Vendor processes PII/PHI (HIPAA scope)</li>
                    <li>No extension request received</li>
                    <li>Policy TPRM-004 §3.2: "Immediate suspension for expired compliance certs on critical vendors"</li>
                  </ul>
                </div>

                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto gap-1">
                  Why 92% confidence? <ChevronLeft className="w-4 h-4 -rotate-90" />
                </Button>
              </CardContent>
            </Card>

            {/* Evidence */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Evidence</h3>
              <div className="grid gap-3">
                {[
                  { icon: FileText, name: 'SOC2_AcmeCorp_2024.pdf', status: 'Expired: Dec 20, 2025', action: 'View Document' },
                  { icon: Mail, name: 'Email thread: RE: Cert renewal', status: '3 messages', action: 'View Thread' },
                  { icon: ShieldCheck, name: 'Vendor profile: Acme Corp', status: 'Tier 1 - Critical', action: 'View Full Profile' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-secondary/30 rounded-lg">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.status}</p>
                      </div>
                    </div>
                    <Button variant="link" size="sm" className="text-primary font-semibold">{item.action}</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Context */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div>
                  <h5 className="font-bold mb-3 text-xs">Vendor Details</h5>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex justify-between"><span>Risk tier:</span> <span className="font-bold text-destructive">CRITICAL</span></li>
                    <li className="flex justify-between"><span>Contract value:</span> <span className="font-semibold">$2.4M/year</span></li>
                    <li className="flex justify-between"><span>Renewal date:</span> <span className="font-semibold">March 2026</span></li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <h5 className="font-bold mb-3 text-xs">Similar cases</h5>
                  <div className="space-y-2">
                    <div className="bg-secondary/20 p-2 rounded text-xs">
                      3 vendors suspended for expired certs (avg 12 days)
                    </div>
                    <div className="bg-secondary/20 p-2 rounded text-xs">
                      2 granted extensions (submitted requests)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Removed sticky decision card from sidebar */}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Decision Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-destructive transition-colors px-0">
              Escalate
            </Button>
            <div className="h-4 w-px bg-border/30" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
                Issue 1 of 42
              </span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 px-8 font-bold border-border hover:bg-muted transition-colors">
              Override recommendations
            </Button>
            <Button className="bg-[#1A1A1A] text-white hover:bg-black font-bold h-11 px-8 rounded-lg shadow-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              Accept AI recommendations
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}