import { OpenFinanceService } from './open-finance.service';

describe('OpenFinanceService', () => {
  const service = new OpenFinanceService();

  it('returns connect benefits', () => {
    expect(service.benefits()).toHaveLength(4);
    expect(service.benefits()[0]?.id).toBe('sync');
  });

  it('filters institutions by name', () => {
    const result = service.institutions('nubank');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('nubank');
  });
});
