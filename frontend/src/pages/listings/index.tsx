import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/marketplace',
    permanent: false,
  },
});

export default function ListingsRedirect() {
  return null;
}
