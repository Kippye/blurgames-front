import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RefreshService } from '@/services/RefreshService';
import type { IAuthInfo } from '@/domain/auth/IAuthInfo';

export const useAuthStore = defineStore('auth', () => {
  const storageKey = 'authInfo';
  const authInfo = ref<IAuthInfo | null>(null);
  const refreshService = new RefreshService();
  let refreshPromise: Promise<void> | null = null;

  const setAuthInfo = async (newAuthInfo: IAuthInfo): Promise<boolean> => {
    console.log('Auth info set to: ', newAuthInfo);
    authInfo.value = newAuthInfo;
    localStorage.setItem(storageKey, JSON.stringify(newAuthInfo));
    return true;
  };

  const getAuthInfo = () => {
    if (authInfo.value === null) {
      const localAuthInfo = localStorage.getItem(storageKey);
      if (localAuthInfo) {
        try {
          authInfo.value = JSON.parse(localAuthInfo);
        } catch {
          console.warn('Auth info in localStorage is invalid JSON: ', localAuthInfo);
        }
      }
    }
    return authInfo.value;
  };

  const logOut = () => {
    console.log('Logged out - auth info cleared');
    authInfo.value = null;
    localStorage.removeItem(storageKey);
  };

  const isLoggedIn = () => {
    authInfo.value = getAuthInfo();
    return authInfo.value !== null;
  };

  const isInRole = (role: string) => {
    authInfo.value = getAuthInfo();
    if (authInfo.value !== null) {
      return role in authInfo.value.systemRoles;
    }
    return false;
  };

  const refresh = async () => {
    if (authInfo.value === null) {
      return;
    }
    if (refreshPromise === null) {
      refreshPromise = (async () => {
        const res = await refreshService.refresh({
          jwt: authInfo.value!.jwt,
          refreshToken: authInfo.value!.refreshToken,
        });

        if (authInfo.value === null) {
          console.warn('Token refresh response ignored - user logged out');
          return;
        }

        if (res.errors) {
          console.error('Token refresh failed:', res.errors);
          logOut();
          return;
        }

        if (res.data) {
          setAuthInfo({ ...res.data, systemRoles: res.data.roles });
        }
      })().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  };

  const getUserType = (): 'user' | 'admin' => {
    const authInfo = getAuthInfo();
    if (!authInfo || !authInfo.systemRoles) return 'user';

    if (authInfo.systemRoles.includes('Admin')) {
      return 'admin';
    }

    return 'user';
  };

  return {
    setAuthInfo,
    getAuthInfo,
    logOut,
    isLoggedIn,
    isInRole,
    refresh,
    getUserType,
  };
});
