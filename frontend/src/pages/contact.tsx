import { ContentPage } from '../components/ContentPage';

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact Us"
      description="Use these support channels for marketplace issues, seller verification, and purchase disputes."
      actions={[{ href: '/help', label: 'Help Center' }]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ['Email Support', 'support@pcforge.in', 'General marketplace support and buyer questions.'],
          ['Seller Ops', 'sellers@pcforge.in', 'Listing quality checks, seller onboarding, and moderation.'],
          ['Response Window', '10:00 to 19:00 IST', 'Monday to Saturday support schedule for India operations.'],
        ].map(([title, value, text]) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{title}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{value}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
