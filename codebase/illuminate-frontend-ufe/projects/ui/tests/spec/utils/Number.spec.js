describe('Number Utils', () => {
    const numberUtils = require('utils/Number').default;

    describe('formatReviewCount', () => {
        it('should return correct number when count >999999', () => {
            expect(numberUtils.formatReviewCount(1200300)).toBe('1.2M');
        });

        it('should return correct number when count >999', () => {
            expect(numberUtils.formatReviewCount(120300)).toBe('120.3K');
        });

        it('should return correct number when count <999', () => {
            expect(numberUtils.formatReviewCount(331)).toBe(331);
        });
    });
});
