import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Mail, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'brivon-advocate-onboarding';

function hasSavedProgress(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch { return false; }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AdvocateOnboardingStart() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState<'enter' | 'sent'>('enter');
  const savedProgress = hasSavedProgress();

  function handleSubmit() {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setState('sent');
  }

  function clearAndRestart() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    navigate('/onboard');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {state === 'enter' ? (
            <div>
              <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Apply to be a Brivon advocate</h1>
                <p className="text-sm text-muted-foreground">Enter your email to start or continue your application. We'll send a secure sign-in link — no password needed.</p>
              </div>

              {savedProgress && (
                <div className="mb-5 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-2.5">
                  <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Saved progress found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">You have an application in progress. Enter your email to continue, or <button onClick={clearAndRestart} className="text-primary underline">start fresh</button>.</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground"
                  />
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
                <Button className="w-full" onClick={handleSubmit}>
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
              </p>
            </div>

          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-display text-xl font-semibold text-foreground mb-2">Check your inbox</h1>
              <p className="text-sm text-muted-foreground mb-1">We sent a sign-in link to</p>
              <p className="text-sm font-medium text-foreground mb-6">{email}</p>
              <p className="text-xs text-muted-foreground mb-8">The link expires in 15 minutes. If you don't see it, check your spam folder.</p>

              <div className="p-3 bg-muted/50 border border-border rounded-lg mb-4">
                <p className="text-xs text-muted-foreground mb-2">Demo only — no real email is sent in this prototype.</p>
                <Button size="sm" className="w-full" onClick={() => navigate('/onboard')}>
                  Simulate clicking the link <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

              <button onClick={() => setState('enter')} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
                Wrong email? Go back
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
