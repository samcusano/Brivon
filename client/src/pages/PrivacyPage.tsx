import { Link } from 'wouter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated April 2026</p>

        <div className="space-y-8">
          {[
            {
              title: 'What we collect',
              body: 'We collect information you provide directly — name, email, credentials, professional background, and payment information. We also collect usage data such as pages visited and sessions booked. We do not collect protected health information (PHI) directly; any medical context shared in sessions is between the patient and their advocate.',
            },
            {
              title: 'How we use it',
              body: 'We use your information to operate the platform, verify advocate credentials, process payments, send transactional emails, and improve our service. We do not sell your data to third parties.',
            },
            {
              title: 'Credential documents',
              body: 'Certification and insurance documents uploaded during advocate onboarding are used solely for verification purposes. Documents are stored securely and are not shared beyond the Brivon verification team.',
            },
            {
              title: 'HIPAA',
              body: 'Brivon is not a Covered Entity under HIPAA. However, advocates using the platform may be subject to HIPAA obligations depending on their practice. Brivon does not process or store PHI on behalf of advocates or patients.',
            },
            {
              title: 'Data retention',
              body: 'Application data is retained for 3 years after account closure. You may request deletion of your data at any time by contacting privacy@brivon.com. Note that some records may be retained longer to comply with legal obligations.',
            },
            {
              title: 'Cookies',
              body: 'We use cookies for authentication, session management, and analytics. You can disable cookies in your browser settings, though this may affect platform functionality.',
            },
            {
              title: 'Your rights',
              body: 'Depending on your location, you may have rights to access, correct, or delete your personal data, or to object to certain processing. To exercise these rights, contact privacy@brivon.com.',
            },
            {
              title: 'Contact',
              body: 'Privacy questions or requests: privacy@brivon.com. Mailing address: Brivon Inc., 100 Federal Street, Boston, MA 02110.',
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
