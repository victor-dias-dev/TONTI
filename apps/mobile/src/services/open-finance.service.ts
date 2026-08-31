import type { ConnectBenefit, Institution } from '../domain';
import { connectBenefits, institutions } from '../mocks/open-finance';

export const openFinanceService = {
  getBenefits(): Promise<ConnectBenefit[]> {
    return Promise.resolve(connectBenefits);
  },

  getInstitutions(): Promise<Institution[]> {
    return Promise.resolve(institutions);
  },
};
