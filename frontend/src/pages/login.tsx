import { Layout } from '../components/Layout';
import { useLogin } from '../hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { Card } from '../components/ui/Card';
import { SectionContainer } from '../components/ui/SectionContainer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync, isPending, error } = useLogin();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ email, password });
    router.replace('/');
  };

  return (
    <Layout>
      <SectionContainer
        title="Login"
        description="Access buyer, seller, or admin views through the same unified PCForge interface."
      >
        <Card className="mx-auto max-w-md p-6">
          <form onSubmit={submit} className="space-y-4 text-sm">
            <input
              className="pf-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="pf-input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="text-xs text-red-400">
                {(error as any)?.response?.data?.error?.message || 'Login failed'}
              </p>
            )}
            <ButtonPrimary type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Logging in...' : 'Login'}
            </ButtonPrimary>
          </form>
        </Card>
      </SectionContainer>
    </Layout>
  );
}
