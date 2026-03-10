import { useMutation } from '@tanstack/react-query';
import { login, register } from '../features/auth';
import { useUserStore } from '../store/useUserStore';

export const useRegister = () => {
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    }
  });
};

export const useLogin = () => {
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    }
  });
};