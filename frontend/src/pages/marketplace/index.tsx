import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { MarketplacePageView } from '../../components/marketplace/MarketplacePageView';

export default function MarketplaceIndexPage() {
  const router = useRouter();
  const query = typeof router.query.q === 'string' ? router.query.q : undefined;
  const categorySlug =
    typeof router.query.category === 'string' ? router.query.category : undefined;

  return (
    <Layout>
      <MarketplacePageView query={query} categorySlug={categorySlug} />
    </Layout>
  );
}
