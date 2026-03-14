import Link from 'next/link';
import { ContentPage } from '../components/ContentPage';

const supportTracks = [
  {
    eyebrow: 'Buying on PCForge',
    title: 'Get help with orders, sellers, and delivery expectations',
    description:
      'Check listing quality, compare sellers, and use the checkout flow with saved addresses and payment methods.',
    href: '/contact',
    label: 'Ask Support',
  },
  {
    eyebrow: 'Selling on PCForge',
    title: 'Publish better listings and avoid moderation issues',
    description:
      'Use complete specs, mention condition clearly, and keep pricing and stock aligned with the real component.',
    href: '/sell',
    label: 'Start Selling',
  },
  {
    eyebrow: 'Building a PC',
    title: 'Use compatibility checks before you buy parts',
    description:
      'The PC Builder helps you compare socket, RAM generation, power requirements, and other key constraints.',
    href: '/pc-builder',
    label: 'Open PC Builder',
  },
];

const faqSections = [
  {
    title: 'Accounts and access',
    items: [
      {
        question: 'Who can publish listings on the marketplace?',
        answer:
          'Users with seller access can create marketplace listings. If you are not approved yet, use the sell flow or contact support for onboarding.',
      },
      {
        question: 'Where can I manage saved addresses and payment methods?',
        answer:
          'Signed-in users can manage these from the addresses and payment methods pages before or during checkout.',
      },
      {
        question: 'How do I see my active purchases?',
        answer:
          'Open the orders page to review current orders, item status, and recent purchase activity tied to your account.',
      },
    ],
  },
  {
    title: 'Listings and marketplace quality',
    items: [
      {
        question: 'How should I list a component properly?',
        answer:
          'Choose the right category, fill in the main specs, describe the condition accurately, and include anything missing from the box or accessories.',
      },
      {
        question: 'Why do some products still look like demo inventory?',
        answer:
          'The project supports seeded demo data for testing. Replace demo listings with verified seller inventory before treating the catalog as production-ready.',
      },
      {
        question: 'What makes a listing unsafe or misleading?',
        answer:
          'Wrong model numbers, missing condition notes, fake photos, or mismatched technical specs are the main issues that should be reported.',
      },
    ],
  },
  {
    title: 'PC Builder and compatibility',
    items: [
      {
        question: 'What does the PC Builder check?',
        answer:
          'It helps compare CPU socket, motherboard support, RAM type, and power-related requirements so obvious incompatibilities are easier to catch.',
      },
      {
        question: 'Can I use the builder before signing in?',
        answer:
          'Yes. The builder is useful for planning a configuration first, then you can save or purchase parts once you are ready.',
      },
      {
        question: 'Does the builder replace manual review?',
        answer:
          'No. It catches common compatibility mismatches, but you should still verify BIOS support, dimensions, cooling clearance, and seller notes.',
      },
    ],
  },
  {
    title: 'Trust, disputes, and support',
    items: [
      {
        question: 'How do I report an inaccurate or unsafe listing?',
        answer:
          'Use the contact page to report the listing and include the problem clearly, such as wrong specs, damaged hardware, or suspicious photos.',
      },
      {
        question: 'What should sellers disclose for used hardware?',
        answer:
          'State exact condition, age, repair history, missing accessories, and any usage pattern that matters, especially for GPUs and motherboards.',
      },
      {
        question: 'Where can I read marketplace standards?',
        answer:
          'The trust and safety page explains the baseline expectations for listing quality, dispute handling, and safer transactions.',
      },
    ],
  },
];

const quickLinks = [
  {
    title: 'Order and account help',
    description: 'Contact support for checkout issues, account access, or disputes with sellers.',
    href: '/contact',
    label: 'Contact Support',
  },
  {
    title: 'Seller policies',
    description: 'Review listing expectations and marketplace safety rules before publishing inventory.',
    href: '/trust-safety',
    label: 'Read Trust & Safety',
  },
  {
    title: 'Create a listing',
    description: 'Open the seller flow and start a new listing with full specifications and condition notes.',
    href: '/sell',
    label: 'Go to Sell',
  },
];

export default function HelpPage() {
  return (
    <ContentPage
      title="Help Center"
      description="Support guidance for buyers, sellers, and PC builders using PCForge."
      actions={[
        { href: '/contact', label: 'Contact Support' },
        { href: '/trust-safety', label: 'Trust & Safety', variant: 'secondary' },
      ]}
    >
      <div className="space-y-8">
        <section className="grid gap-4 lg:grid-cols-3">
          {supportTracks.map((track) => (
            <article key={track.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{track.eyebrow}</p>
              <h2 className="mt-3 text-xl font-semibold leading-tight text-white">{track.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">{track.description}</p>
              <Link
                href={track.href}
                className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
              >
                {track.label}
              </Link>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {faqSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-white/10 bg-slate-950/40 p-4 transition-colors open:border-indigo-400/40 open:bg-indigo-500/5"
                  >
                    <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-white marker:hidden">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{item.answer}</p>
                  </details>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/70 to-cyan-500/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">Need a direct path?</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Choose the support route that matches the problem.</h2>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Use support for account and order problems, trust and safety for listing quality concerns, and the seller flow when you are ready to publish inventory.
              </p>
            </div>
            <div className="grid w-full gap-3 lg:max-w-xl">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-indigo-300/30 hover:bg-white/[0.05]"
                >
                  <p className="text-base font-semibold text-white">{link.title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{link.description}</p>
                  <span className="mt-3 inline-flex text-sm font-semibold text-indigo-300">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ContentPage>
  );
}
