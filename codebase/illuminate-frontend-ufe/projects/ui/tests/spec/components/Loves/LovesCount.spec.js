const React = require('react');
const { shallow } = require('enzyme');

describe('LovesCount', () => {
    let LovesCount;
    let wrapper;
    let component;
    let setAndWatchSpy;
    let getProductLovesCountSpy;
    let store;
    let props;
    let skuHelpers;

    beforeEach(() => {
        LovesCount = require('components/ProductPage/LovesCount/LovesCount').default;
        store = require('store/Store').default;
        setAndWatchSpy = spyOn(store, 'setAndWatch');
        skuHelpers = require('utils/skuHelpers').default;
        props = {
            product: {
                lovesCount: '100',
                skuId: 123,
                regularChildSkus: []
            }
        };
        getProductLovesCountSpy = spyOn(skuHelpers, 'getProductLovesCount').and.returnValue(props.product.lovesCount);
    });

    describe('should', () => {
        beforeEach(() => {
            wrapper = shallow(<LovesCount {...props} />);
            component = wrapper.instance();
        });

        it('call setAndWatch with the correct params', () => {
            expect(setAndWatchSpy).toHaveBeenCalledWith(
                { 'loves.shoppingListIds': 'loves' },
                component,
                null,
                store.STATE_STRATEGIES.CLIENT_SIDE_DATA
            );
        });

        it('call getProductLovesCountSpy with the correct params', () => {
            expect(getProductLovesCountSpy).toHaveBeenCalledWith(props.product);
        });
    });
});
