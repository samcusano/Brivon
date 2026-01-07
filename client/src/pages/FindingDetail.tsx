import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, FileText, Mail, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';

export default function FindingDetail() {
  return (
    <Shell>
      <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back to Queue
            </Button>
          </Link>
          <h1 className="text-xl font-bold">VENDOR-0847: Acme Corp</h1>
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
                  <span className="text-xl">🤖</span> AI Analysis
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

          <div className="space-y-8">
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

            {/* Your Decision */}
            <Card className="border-primary shadow-lg sticky top-24">
              <CardHeader className="bg-primary/10 border-b border-primary/20">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Your Decision</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="decision" id="accept" className="w-4 h-4 accent-primary" defaultChecked />
                    <label htmlFor="accept" className="text-sm font-bold">Accept AI Recommendation</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="decision" id="override" className="w-4 h-4 accent-primary" />
                    <label htmlFor="override" className="text-sm font-bold">Override recommendation</label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-primary text-primary-foreground font-bold py-6">
                    Submit Decision
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground font-bold">
                    Escalate to Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}