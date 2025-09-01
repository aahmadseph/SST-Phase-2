import dateUtils from 'utils/Date';

describe('Date utils', () => {
    describe('getPromiseDate', () => {
        describe('without UTC treatment', () => {
            it('should format date without year by default', () => {
                const result = dateUtils.getPromiseDate('2025-08-01T21:59:00');
                expect(result).toMatch(/^Fri, Aug 1$/);
            });

            it('should format date with year when showYear is true', () => {
                const result = dateUtils.getPromiseDate('2025-08-01T21:59:00', true);
                expect(result).toMatch(/^Fri, Aug 1, 2025$/);
            });

            it('should handle different months correctly', () => {
                const result = dateUtils.getPromiseDate('2025-12-25T10:30:00', true);
                expect(result).toMatch(/^Thu, Dec 25, 2025$/);
            });
        });

        describe('with UTC treatment', () => {
            it('should format date correctly with UTC treatment', () => {
                const result = dateUtils.getPromiseDate('2025-08-01T21:59:00', false, true);
                expect(result).toMatch(/^Fri, Aug 1$/);
            });

            it('should format date correctly with UTC treatment and year', () => {
                const result = dateUtils.getPromiseDate('2025-08-01T21:59:00', true, true);
                expect(result).toMatch(/^Fri, Aug 1, 2025$/);
            });

            it('should handle promise dates correctly when those fall on 1st of the month', () => {
                const result = dateUtils.getPromiseDate('2025-08-01T21:59:00', true, true);
                expect(result).toContain('Aug 1');
                expect(result).not.toContain('Jul 1');
            });

            it('should handle December date correctly with UTC treatment', () => {
                const result = dateUtils.getPromiseDate('2025-12-25T10:30:00', true, true);
                expect(result).toMatch(/^Thu, Dec 25, 2025$/);
            });

            it('should handle January date correctly with UTC treatment', () => {
                const result = dateUtils.getPromiseDate('2025-01-15T14:45:00', true, true);
                expect(result).toMatch(/^Wed, Jan 15, 2025$/);
            });

            it('should handle edge case dates around timezone boundaries', () => {
                const result = dateUtils.getPromiseDate('2025-07-31T23:59:59', true, true);
                expect(result).toMatch(/^Thu, Jul 31, 2025$/);
            });
        });
    });

    describe('getPromiseDateRange', () => {
        it('should return empty string for null or undefined input', () => {
            expect(dateUtils.getPromiseDateRange(null)).toEqual('');
            expect(dateUtils.getPromiseDateRange(undefined)).toEqual('');
            expect(dateUtils.getPromiseDateRange('')).toEqual('');
        });

        it('should format single date when only from date is provided', () => {
            const result = dateUtils.getPromiseDateRange('2025-08-01T21:59:00 - ');
            expect(result).toMatch(/^Fri, Aug 1$/);
        });

        it('should format single date when only to date is provided', () => {
            const result = dateUtils.getPromiseDateRange(' - 2025-08-05T21:59:00');
            expect(result).toMatch(/^ – Tue, Aug 5$/);
        });

        it('should format date range correctly', () => {
            const result = dateUtils.getPromiseDateRange('2025-08-01T21:59:00 - 2025-08-05T21:59:00');
            expect(result).toMatch(/^Fri, Aug 1 – Tue, Aug 5$/);
        });

        it('should use UTC treatment for date range formatting', () => {
            const result = dateUtils.getPromiseDateRange('2025-08-01T21:59:00 - 2025-08-05T21:59:00');
            expect(result).toContain('Aug 1');
            expect(result).toContain('Aug 5');
            expect(result).not.toContain('Jul');
        });
    });

    describe('getEstimatedDeliveryDateRange', () => {
        it('should handle timestamps correctly', () => {
            const minTimestamp = 1754271422000; // Should be August 4, 2025
            const maxTimestamp = 1754444222000; // Should be August 6, 2025

            const result = dateUtils.getEstimatedDeliveryDateRange(minTimestamp, maxTimestamp);

            expect(result).toContain('Aug 4');
            expect(result).toContain('Aug 6');
            expect(result).not.toContain('Jul');
        });

        it('should format delivery date range correctly', () => {
            const minTimestamp = new Date('2025-12-24T10:00:00Z').getTime();
            const maxTimestamp = new Date('2025-12-26T10:00:00Z').getTime();

            const result = dateUtils.getEstimatedDeliveryDateRange(minTimestamp, maxTimestamp);

            expect(result).toContain('Dec 24');
            expect(result).toContain('Dec 26');
        });
    });
});
