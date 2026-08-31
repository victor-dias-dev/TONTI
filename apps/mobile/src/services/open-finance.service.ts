import type { ConnectBenefit, Institution } from '../domain';
import { financeApi } from '../api/finance';

export const openFinanceService = {
  getBenefits(): Promise<ConnectBenefit[]> {
    return financeApi.getConnectBenefits();
  },

  getInstitutions(): Promise<Institution[]> {
    return financeApi.getInstitutions();
  },
};
