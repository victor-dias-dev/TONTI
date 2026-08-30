import type { LoginPayload, LoginResponse, PublicUser, RegisterPayload } from '@tonti/types';
import { apiClient } from './client';

export const authApi = {
  async register(payload: RegisterPayload): Promise<PublicUser> {
    const { data } = await apiClient.post<PublicUser>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async me(): Promise<PublicUser> {
    const { data } = await apiClient.get<PublicUser>('/auth/me');
    return data;
  },
};
