import { ContentPage } from '../components/ContentPage';

export default function TrustSafetyPage() {
  return (
    <ContentPage
      title="Trust & Safety"
      description="The marketplace standards buyers and sellers should follow to keep PCForge safe and reliable."
      actions={[
        { href: '/help', label: 'Read FAQs' },
        { href: '/contact', label: 'Report an Issue', variant: 'secondary' },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Verify component condition', 'Sellers should state exact condition, usage age, missing accessories, and any repair history.'],
          ['Use clear photos', 'Add front, rear, serial sticker, and connector photos for expensive parts like GPUs and motherboards.'],
          ['Match technical specs', 'Model, socket, VRAM, wattage, speed, capacity, and physical dimensions should match the real component.'],
          ['Handle disputes quickly', 'If a listing is inaccurate or unsafe, report it through support so moderation can remove it.'],
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
