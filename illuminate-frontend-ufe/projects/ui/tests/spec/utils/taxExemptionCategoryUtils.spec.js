const { validateStep } = require('utils/taxExemption/taxExemptionCategoryUtils');

describe('Tax Exemption Category Utils', () => {
    describe('validateStep function', () => {
        it('returns isValid false if selectedCategory is not present', () => {
            const data = {
                selectedCategory: null
            };

            const { isValid, errors } = validateStep(data);

            expect(isValid).toBe(false);
            expect(errors).toEqual({ missingCategory: 'Please choose a category' });
        });

        it('returns isValid true if selectedCategory is present', () => {
            const data = {
                selectedCategory: 'test'
            };

            const { isValid } = validateStep(data);

            expect(isValid).toBe(true);
        });
    });
});
