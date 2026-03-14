import { ContentPage } from '../components/ContentPage';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="Core platform rules for using PCForge as a buyer, seller, or administrator."
    >
      <div className="space-y-4">
        {[
          ['Accurate listings', 'Every seller is responsible for correct pricing, component specs, and physical condition disclosure.'],
          ['Restricted activity', 'Counterfeit parts, misleading specs, and fraudulent listings are grounds for removal or suspension.'],
          ['Role-based access', 'Only authorized seller or admin accounts may publish products into the marketplace.'],
          ['Platform changes', 'PCForge may update categories, features, and moderation rules as the marketplace evolves.'],
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
