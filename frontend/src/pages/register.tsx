import { Layout } from '../components/Layout';
import { useRegister } from '../hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync, isPending, error } = useRegister();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ name, email, password });
    router.push('/');
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto glass-panel p-6 mt-10">
        <h1 className="text-lg font-semibold mb-4">Create account</h1>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <input
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2"
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
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-neonBlue/30 border border-neonBlue rounded py-2 text-sm hover:bg-neonBlue/40"
          >
            {isPending ? 'Creating...' : 'Sign up'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

