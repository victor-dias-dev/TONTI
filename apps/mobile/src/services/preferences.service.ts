import type { UserPreferences } from '../domain';
import { financeApi } from '../api/finance';

export const preferencesService = {
  get(): Promise<UserPreferences> {
    return financeApi.getPreferences();
  },

  update(patch: Partial<UserPreferences>): Promise<UserPreferences> {
    return financeApi.updatePreferences(patch);
  },
};
