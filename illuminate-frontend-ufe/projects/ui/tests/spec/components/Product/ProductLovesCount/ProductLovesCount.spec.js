const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');
const ProductLovesCount = require('components/Product/ProductLovesCount/ProductLovesCount').default;
const store = require('store/Store').default;
const skuHelpers = require('utils/skuHelpers').default;

describe('ProductLovesCount component', () => {
    let setAndWatchStub;
    let getProductLovesCountStub;
    let component;
    let productStub;

    beforeEach(() => {
        setAndWatchStub = spyOn(store, 'setAndWatch').and.callFake((_properties, _component, callback) => callback());
        getProductLovesCountStub = spyOn(skuHelpers, 'getProductLovesCount').and.returnValue(100);
        productStub = {};

        const props = {
            product: productStub,
            dataAt: ''
        };
        const wrapper = shallow(<ProductLovesCount {...props} />);
        component = wrapper.instance();
    });

    describe('controller initialization', () => {
        it('should set initial value for lovesCount', () => {
            expect(component.state.lovesCount).toEqual(100);
        });

        it('should get loves value from store', () => {
            expect(getProductLovesCountStub).toHaveBeenCalledWith(productStub);
        });

        it('should update lovesCount when loves store is updated', () => {
            expect(setAndWatchStub).toHaveBeenCalledWith('loves.shoppingListIds', component, any(Function));
        });
    });
});
