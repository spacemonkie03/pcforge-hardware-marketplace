import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../features/auth';
import { useUserStore } from '../store/useUserStore';

export const AuthBootstrap = () => {
  const token = useUserStore((s) => s.token);
  const hydrateToken = useUserStore((s) => s.hydrateToken);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    hydrateToken();
  }, [hydrateToken]);

  const { data, isError } = useQuery({
    queryKey: ['current-user', token],
    queryFn: fetchCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError && token) {
      logout();
    }
  }, [isError, token, logout]);

  return null;
};
