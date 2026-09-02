import { useAuthStore } from '../stores/auth-store';
import { queryClient } from '../api/query-client';

export function useSession() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const clearSession = useAuthStore((state) => state.clearSession);
  const updateUser = useAuthStore((state) => state.updateUser);

  const logout = async () => {
    await clearSession();
    queryClient.clear();
  };

  return { user, isAuthenticated, isHydrated, logout, updateUser };
}
