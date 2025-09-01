const React = require('react');
const { shallow } = require('enzyme');
const SwatchGroup = require('components/ProductPage/Swatches/SwatchGroup').default;
const store = require('store/Store').default;
const analyticsUtils = require('analytics/utils').default;
const urlUtils = require('utils/Url').default;
const wizardActions = require('actions/WizardActions').default;

describe('<SwatchGroup />', () => {
    it('should render two SwatchItems', () => {
        // Arrange
        const props = {
            currentProduct: {},
            skus: [{ skuId: 1 }, { skuId: 2 }],
            wizardResult: { skuId: 1 }
        };
        const component = shallow(<SwatchGroup {...props} />);

        // Act
        const swatchItems = component.find('SwatchItem');

        // Assert
        expect(swatchItems.length).toEqual(2);
    });

    it('should render SwatchItem with a given wizardMatchText', () => {
        // Arrange
        const props = {
            currentProduct: {},
            skus: [{ skuId: 1 }],
            wizardResult: { skuId: 1 },
            wizardMatchText: 'someText'
        };
        const component = shallow(<SwatchGroup {...props} />);

        // Act
        const swatchItem = component.findWhere(x => x.name() === 'SwatchItem' && x.prop('matchText') === props.wizardMatchText);

        // Assert
        expect(swatchItem.exists()).toBeTruthy();
    });

    it('should render SwatchItem with a given customSetDataAt', () => {
        // Arrange
        const props = {
            currentProduct: {},
            skus: [{ skuId: 1 }],
            wizardResult: { skuId: 1 },
            customSetDataAt: 'SomeCustomSetDataAt'
        };
        const component = shallow(<SwatchGroup {...props} />);

        // Act
        const swatchItem = component.findWhere(x => x.name() === 'SwatchItem' && x.prop('customSetDataAt') === props.customSetDataAt);

        // Assert
        expect(swatchItem.exists()).toBeTruthy();
    });

    describe('should render SwatchItem with a given matchedSkuId in URL and coming from multi-shade finder results page', () => {
        let dispatchStub;
        let analyticsUtilsSpy;

        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            analyticsUtilsSpy = spyOn(analyticsUtils, 'getPreviousPageData');
        });

        it('should dispatch setResult to store the wizardResult and display the skuId matched', () => {
            // Arrange
            const props = {
                currentProduct: {},
                skus: [{ skuId: 1 }]
            };

            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue(1);
            analyticsUtilsSpy.and.returnValue({ pageName: 'multi-product shade finder-results page' });

            shallow(<SwatchGroup {...props} />);
            // Assert
            expect(dispatchStub).toHaveBeenCalledWith(
                wizardActions.setResult({
                    result: { skuId: 1 },
                    matchText: 'match'
                })
            );
        });
    });
});
