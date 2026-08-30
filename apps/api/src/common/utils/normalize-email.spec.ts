import { normalizeEmail } from './normalize-email';

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Victor@Email.COM ')).toBe('victor@email.com');
  });
});
