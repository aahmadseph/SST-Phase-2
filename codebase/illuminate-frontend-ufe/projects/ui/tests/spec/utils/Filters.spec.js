/*const { objectContaining } = jasmine;*/
const Filters = require('utils/Filters').default;
const biUtils = require('utils/BiProfile').default;

describe('Filters', () => {
    describe('getBVValues', () => {
        const biTypes = biUtils.TYPES;
        const user = {
            beautyInsiderAccount: {
                birthRange: '13-17',
                personalizedInformation: {
                    skinTone: [
                        {
                            displayName: 'Tan',
                            isSelected: true
                        }
                    ]
                }
            }
        };
        const filters = Filters.getBVValues(biTypes.AGE_RANGE, user.beautyInsiderAccount.birthRange);
        it('should return formatted values', function () {
            expect(filters).toBe('13to17');
        });
    });

    describe('getDescription', () => {
        it('should return the formatted description with variation description', function () {
            const description = Filters.getDescription({ variationValue: '1', variationDesc: '2' });

            expect(description).toBe('1 - 2');
        });

        it('should return the formatted description', function () {
            const description = Filters.getDescription({ variationValue: '1' });

            expect(description).toBe('1 ');
        });
    });

    describe('isVerifiedPurchaser', () => {
        it('should do', function () {
            const verifiedPurchaser = Filters.isVerifiedPurchaser(null);

            expect(verifiedPurchaser).toBeFalse();
        });

        it('should do', function () {
            const verifiedPurchaser = Filters.isVerifiedPurchaser(['verifiedpurchaser']);

            expect(verifiedPurchaser).toBeTrue();
        });
    });
});
