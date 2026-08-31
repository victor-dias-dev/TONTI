import type { InstallmentPlan } from '../domain';
import { installmentPlans } from '../mocks/installments';

export const installmentsService = {
  getPlans(): Promise<InstallmentPlan[]> {
    return Promise.resolve(installmentPlans);
  },

  getPlan(id: string): Promise<InstallmentPlan | undefined> {
    return Promise.resolve(installmentPlans.find((plan) => plan.id === id));
  },
};
