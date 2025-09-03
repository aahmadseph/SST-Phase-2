const { arrayContaining } = jasmine;
const {
    biExclusiveLevels: { NONE, BI, VIB, ROUGE }
} = require('utils/Sku').default;
const marketingFlagsUtil = require('utils/MarketingFlags').default;

describe('MarketingFlags', () => {
    describe('getShadeFilterFlags function', () => {
        it('result should not contain BI flag', () => {
            // Assert
            const sku = { biExclusiveLevel: NONE };
            const biFlag = {
                text: 'Insider',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).not.toEqual(arrayContaining([biFlag]));
        });

        it('result should not contain VIB flag', () => {
            // Assert
            const sku = { biExclusiveLevel: NONE };
            const vibFlag = {
                text: 'VIB',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).not.toEqual(arrayContaining([vibFlag]));
        });

        it('result should not contain ROUGE flag', () => {
            // Assert
            const sku = { biExclusiveLevel: NONE };
            const rougeFlag = {
                text: 'Rouge',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).not.toEqual(arrayContaining([rougeFlag]));
        });

        it('result should contain BI flag', () => {
            // Assert
            const sku = { biExclusiveLevel: BI };
            const biFlag = {
                text: 'Insider',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).toEqual(arrayContaining([biFlag]));
        });

        it('result should contain VIB flag', () => {
            // Assert
            const sku = { biExclusiveLevel: VIB };
            const vibFlag = {
                text: 'VIB',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).toEqual(arrayContaining([vibFlag]));
        });

        it('result should contain ROUGE flag', () => {
            // Assert
            const sku = { biExclusiveLevel: ROUGE };
            const rougeFlag = {
                text: 'Rouge',
                backgroundColor: 'black'
            };

            // Act
            const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

            // Arrange
            expect(flags).toEqual(arrayContaining([rougeFlag]));
        });
    });
});
