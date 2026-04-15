import { Link } from 'wouter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated April 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          {[
            {
              title: '1. Agreement to terms',
              body: 'By accessing or using Brivon, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.',
            },
            {
              title: '2. Who we are',
              body: 'Brivon is a marketplace that connects patients with independent patient advocates. Brivon is not a healthcare provider, does not provide medical advice, and is not a party to the advocate-patient relationship.',
            },
            {
              title: '3. Advocate obligations',
              body: 'Advocates must maintain accurate credentials, carry valid E&O insurance meeting Brivon\'s minimums, comply with applicable licensing laws in their jurisdiction, and uphold Brivon\'s Code of Conduct. Brivon reserves the right to suspend or remove any advocate found to be in violation of these obligations.',
            },
            {
              title: '4. Patient obligations',
              body: 'Patients are responsible for providing accurate information about their situation. Brivon does not guarantee outcomes from working with an advocate. Advocacy is not a substitute for medical care.',
            },
            {
              title: '5. Fees and payments',
              body: 'Brivon charges advocates a platform fee on completed sessions and packages. Exact fee schedules are detailed in the Advocate Agreement. Payments to advocates are processed within 5 business days of session completion.',
            },
            {
              title: '6. Verification',
              body: 'Brivon verifies credentials submitted by advocates but cannot guarantee ongoing accuracy. Patients are encouraged to independently verify advocate credentials using the links provided on each profile.',
            },
            {
              title: '7. Limitation of liability',
              body: 'To the maximum extent permitted by law, Brivon\'s liability to any party is limited to the fees paid to Brivon in the 12 months preceding the claim. Brivon is not liable for the actions, advice, or outcomes of any advocate.',
            },
            {
              title: '8. Changes to terms',
              body: 'We may update these terms from time to time. Material changes will be communicated by email at least 14 days before taking effect. Continued use of the platform constitutes acceptance of the updated terms.',
            },
            {
              title: '9. Contact',
              body: 'Questions about these terms? Email us at legal@brivon.com.',
            },
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
