import { Layout } from '../components/Layout';
import { useRegister } from '../hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { Card } from '../components/ui/Card';
import { SectionContainer } from '../components/ui/SectionContainer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync, isPending, error } = useRegister();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ name, email, password });
    router.replace('/');
  };

  return (
    <Layout>
      <SectionContainer
        title="Create Account"
        description="Set up a buyer account inside the same interface used everywhere else in PCForge."
      >
        <Card className="mx-auto max-w-md p-6">
          <form onSubmit={submit} className="space-y-4 text-sm">
            <input
              className="pf-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
                {(error as any)?.response?.data?.error?.message || 'Registration failed'}
              </p>
            )}
            <ButtonPrimary type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Creating...' : 'Sign up'}
            </ButtonPrimary>
          </form>
        </Card>
      </SectionContainer>
    </Layout>
  );
}

