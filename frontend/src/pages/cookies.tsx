import { ContentPage } from '../components/ContentPage';

export default function CookiesPage() {
  return (
    <ContentPage
      title="Cookies"
      description="A simple overview of the local storage and browser session behavior currently used by PCForge."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Authentication session', 'A local token is stored in the browser so logged-in users can remain authenticated between page loads.'],
          ['UI state', 'Search terms, navigation state, and marketplace preferences may persist locally for a smoother experience.'],
          ['Future updates', 'If analytics or checkout cookies are added later, this page should be updated to reflect them accurately.'],
          ['Control', 'You can clear stored browser data at any time by logging out and removing local site data in your browser.'],
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
