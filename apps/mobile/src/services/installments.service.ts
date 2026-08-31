import type { InstallmentPlan } from '../domain';
import { financeApi } from '../api/finance';

export const installmentsService = {
  getPlans(): Promise<InstallmentPlan[]> {
    return financeApi.getInstallments();
  },

  getPlan(id: string): Promise<InstallmentPlan> {
    return financeApi.getInstallment(id);
  },
};
