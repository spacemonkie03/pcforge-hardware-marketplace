import { ContentPage } from '../components/ContentPage';

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="A product-focused summary of the account, listing, and transaction data handled by PCForge."
    >
      <div className="space-y-4">
        {[
          ['Account data', 'We store your name, email, role, and authentication session so you can access buyer and seller features.'],
          ['Listing data', 'Product titles, specifications, pricing, stock state, and images are stored to power search and browsing.'],
          ['Operational use', 'Marketplace data may be used for fraud review, moderation, analytics, and feature improvement.'],
          ['User control', 'If you need account or listing data reviewed or removed, contact support through the Contact page.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
