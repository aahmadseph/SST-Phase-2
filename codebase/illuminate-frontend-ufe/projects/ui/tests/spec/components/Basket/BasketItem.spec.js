const React = require('react');
const { shallow } = require('enzyme');

describe('BasketItem component', () => {
    let BasketItem;
    let wrapper;
    let component;
    let store;
    let BasketActions;
    let props;
    let removeItemFromBasketStub;
    let dispatchStub;
    let Location;

    beforeEach(() => {
        store = require('store/Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        BasketActions = require('actions/AddToBasketActions').default;
        BasketItem = require('components/InlineBasket/BasketDesktop/BasketItem').default;
        Location = require('utils/Location').default;

        props = {
            item: {
                qty: 0,
                sku: {
                    targetUrl: 'someUrl',
                    type: 'BI'
                }
            },
            isRopis: true,
            appliedPromotions: []
        };

        removeItemFromBasketStub = spyOn(BasketActions, 'removeItemFromBasket');
        wrapper = shallow(<BasketItem {...props} />);
        component = wrapper.instance();
    });

    describe('BasketItem.prototype.removeItemFromBasket', () => {
        it('should call removeItemFromBasket', () => {
            component.removeItemFromBasket();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(removeItemFromBasketStub).toHaveBeenCalledWith(props.item, true, null, props.isRopis, props.appliedPromotions);
        });
    });

    describe('BasketItem.prototype.handleMoveToLoveClick', () => {
        let auth = require('utils/Authentication').default;
        let requireAuthenticationStub;

        beforeEach(() => {
            auth = require('utils/Authentication').default;
        });

        it('should call handleMoveToLoveClick', () => {
            const fakePromise = {
                then: () => fakePromise,
                catch: () => {}
            };
            requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue(fakePromise);
            component.handleMoveToLoveClick();
            expect(requireAuthenticationStub).toHaveBeenCalled();
        });
    });

    describe('SPA', () => {
        const e = { type: 'click' };
        let navigateToSpy;

        beforeEach(() => {
            navigateToSpy = spyOn(Location, 'navigateTo');
        });

        describe('Box link click', () => {
            it('should call navigateTo with valid data', () => {
                const rbox = wrapper.findWhere(x => x.name() === 'Box' && x.prop('href') === props.item.sku.targetUrl);
                rbox.simulate('click', e);

                expect(navigateToSpy).toHaveBeenCalledWith(e, props.item.sku.targetUrl);
            });
        });

        describe('Link link click', () => {
            it('should call navigateTo with valid data', () => {
                const rlink = wrapper.findWhere(x => x.name() === 'Link' && x.prop('href') === props.item.sku.targetUrl);
                rlink.simulate('click', e);

                expect(navigateToSpy).toHaveBeenCalledWith(e, props.item.sku.targetUrl);
            });
        });
    });
});
