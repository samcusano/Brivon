import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Mail, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export default function FindingDetail() {
  return (
    <Shell>
      <div className="p-10 max-w-5xl mx-auto space-y-8 pb-32">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-[#666] hover:text-[#1a1a1a] px-0" data-testid="button-back">
              <ChevronLeft className="w-4 h-4" /> Back to Queue
            </Button>
          </Link>
          <div className="h-4 w-px bg-[#e5e5e5] mx-2" />
          <h1 className="text-xl font-semibold text-[#1a1a1a]" data-testid="text-finding-title">VENDOR-0847: Acme Corp</h1>
          <Badge className="bg-[#1a1a1a] text-white font-medium text-xs px-3 py-1 rounded-full ml-2" data-testid="badge-priority">
            Urgent
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Finding Summary */}
            <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
              <div className="p-6 border-b border-[#e5e5e5] bg-[#fafafa]">
                <h3 className="font-semibold text-[#1a1a1a] flex items-center gap-2" data-testid="text-issue-title">
                  SOC 2 Type II Certification Expired
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-[#999] mb-1">Status</p>
                  <p className="font-semibold text-[#1a1a1a]" data-testid="text-status">Critical - Action Required</p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Detected</p>
                  <p className="font-medium text-[#1a1a1a]" data-testid="text-detected">Jan 3, 2026 (4 days ago)</p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Last reviewed</p>
                  <p className="text-[#999] italic" data-testid="text-last-reviewed">Never</p>
                </div>
                <div>
                  <p className="text-[#999] mb-1">Due</p>
                  <p className="font-semibold text-[#1a1a1a]" data-testid="text-due">Today</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
              <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between">
                <h3 className="font-semibold text-[#1a1a1a]">AI Analysis</h3>
                <div className="text-right">
                  <span className="text-xs text-[#999]">Confidence</span>
                  <span className="ml-2 text-sm font-semibold text-[#4A9B8C]" data-testid="text-confidence">92%</span>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-[#999] uppercase tracking-wider mb-3">Recommendation</h4>
                  <p className="font-medium text-[#1a1a1a] bg-[#f8f8f8] p-4 rounded-lg border border-[#e5e5e5]" data-testid="text-recommendation">
                    Suspend vendor access and initiate offboarding per Policy TPRM-004
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[#999] uppercase tracking-wider mb-3">Reasoning</h4>
                  <ul className="space-y-2 text-sm text-[#666] list-disc pl-4">
                    <li>Cert expired 14 days ago (threshold: 7 days)</li>
                    <li>Vendor processes PII/PHI (HIPAA scope)</li>
                    <li>No extension request received</li>
                    <li>Policy TPRM-004 §3.2: "Immediate suspension for expired compliance certs"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Evidence */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#999] uppercase tracking-wider">Evidence</h3>
              <div className="space-y-3">
                {[
                  { icon: FileText, name: 'SOC2_AcmeCorp_2024.pdf', status: 'Expired: Dec 20, 2025', action: 'View' },
                  { icon: Mail, name: 'Email thread: RE: Cert renewal', status: '3 messages', action: 'View' },
                  { icon: ShieldCheck, name: 'Vendor profile: Acme Corp', status: 'Tier 1 - Critical', action: 'View' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 rounded-xl border border-[#e5e5e5] bg-white hover:bg-[#fafafa] transition-colors"
                    data-testid={`evidence-item-${idx}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#f5f5f5] rounded-lg">
                        <item.icon className="w-5 h-5 text-[#666]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1a1a1a]">{item.name}</p>
                        <p className="text-xs text-[#999]">{item.status}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#4A9B8C] font-medium hover:text-[#3d8577]">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
              <div className="p-4 border-b border-[#e5e5e5]">
                <h3 className="text-sm font-medium text-[#999] uppercase tracking-wider">Context</h3>
              </div>
              <div className="p-4 space-y-4 text-sm">
                <div>
                  <h5 className="font-medium text-[#1a1a1a] mb-3 text-xs uppercase tracking-wider">Vendor Details</h5>
                  <ul className="space-y-2 text-[#666]">
                    <li className="flex justify-between">
                      <span>Risk tier:</span> 
                      <span className="font-semibold text-[#1a1a1a]">Critical</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Contract value:</span> 
                      <span className="font-medium text-[#1a1a1a]">$2.4M/year</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Renewal date:</span> 
                      <span className="font-medium text-[#1a1a1a]">March 2026</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#e5e5e5]">
                  <h5 className="font-medium text-[#1a1a1a] mb-3 text-xs uppercase tracking-wider">Similar cases</h5>
                  <div className="space-y-2">
                    <div className="bg-[#f8f8f8] p-3 rounded-lg text-xs text-[#666]">
                      3 vendors suspended for expired certs (avg 12 days)
                    </div>
                    <div className="bg-[#f8f8f8] p-3 rounded-lg text-xs text-[#666]">
                      2 granted extensions (submitted requests)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Decision Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-[#999] hover:text-[#1a1a1a] transition-colors" data-testid="button-escalate">
              Escalate
            </button>
            <div className="h-4 w-px bg-[#e5e5e5]" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-[#e5e5e5]" data-testid="button-prev-issue">
                <ChevronLeft className="w-4 h-4 text-[#666]" />
              </Button>
              <span className="text-xs text-[#999] px-2" data-testid="text-issue-counter">
                Issue 1 of 42
              </span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-[#e5e5e5]" data-testid="button-next-issue">
                <ChevronRight className="w-4 h-4 text-[#666]" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="h-11 px-6 font-medium border-[#e5e5e5] text-[#666] hover:bg-[#f5f5f5]"
              data-testid="button-override"
            >
              Override
            </Button>
            <Button 
              className="bg-[#1a1a1a] text-white hover:bg-black font-medium h-11 px-6 rounded-lg flex items-center gap-2"
              data-testid="button-accept"
            >
              <Zap className="w-4 h-4 text-[#E8F5A3]" />
              Accept AI recommendation
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
