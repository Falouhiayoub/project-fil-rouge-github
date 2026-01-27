import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
    it('should format numbers to USD currency string', () => {
        // We use .toMatch because different environments might have slightly different spacing/non-breaking space
        expect(formatCurrency(10)).toMatch(/\$10\.00/);
        expect(formatCurrency(1234.56)).toMatch(/\$1,234\.56/);
        expect(formatCurrency(0)).toMatch(/\$0\.00/);
    });
});
