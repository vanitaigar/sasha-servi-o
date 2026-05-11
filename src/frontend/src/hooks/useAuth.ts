import { useAppStore } from "@/store";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    login,
    clear,
    isAuthenticated,
    isInitializing,
  } = useInternetIdentity();
  const { userProfile, setUserProfile } = useAppStore();

  const isLoading = isInitializing;

  const logout = async () => {
    await clear();
    setUserProfile(null);
  };

  return {
    identity,
    loginStatus,
    isAuthenticated,
    isLoading,
    userProfile,
    login,
    logout,
  };
}
