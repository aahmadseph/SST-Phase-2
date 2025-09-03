const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('withLoveInteractions', () => {
    let wrapper;
    let component;
    let withLoveInteractions;
    let skuHelpers;

    let store;
    let LoveActions;
    let isSkuLovedSpy;
    let removeLoveSpy;
    let addLoveSpy;
    let event;
    let skuLoveData;

    beforeEach(() => {
        const props = {
            currentProduct: {
                productDetails: {
                    displayName: 'productTestName',
                    brand: {
                        displayName: 'productTest'
                    },
                    productId: 123456
                }
            },
            sku: {
                displayName: 'productTest'
            }
        };
        skuHelpers = require('utils/skuHelpers').default;
        store = require('store/Store').default;
        LoveActions = require('actions/LoveActions').default;
        removeLoveSpy = spyOn(LoveActions, 'removeLove');
        addLoveSpy = spyOn(LoveActions, 'addLove');
        isSkuLovedSpy = spyOn(skuHelpers, 'isSkuLoved');
        spyOn(store, 'dispatch');

        withLoveInteractions = require('components/ProductPage/ProductLove/withLoveInteractions').default;

        event = {
            preventDefault: createSpy(),
            stopPropagation: createSpy()
        };
        skuLoveData = {
            lovesource: 'productPage',
            skuId: 123,
            productId: 'P123456'
        };

        class Test extends React.Component {
            // eslint-disable-next-line class-methods-use-this
            render() {
                return <p>Test Component</p>;
            }
        }
        const WithLoveInteractionsComponent = withLoveInteractions(Test);
        wrapper = shallow(<WithLoveInteractionsComponent {...props} />);
        component = wrapper.instance();
    });

    describe('isActive method', () => {
        it('should return true when skuId === pendingSku and status is loved', () => {
            component.state = {
                pendingSku: {
                    skuId: 123,
                    status: 'loved'
                }
            };
            expect(component.isActive(123)).toBe(true);
        });

        it('should return false when skuId === pendingSku and status is not loved', () => {
            component.state = {
                pendingSku: {
                    skuId: 123,
                    status: 'un-loved'
                }
            };
            expect(component.isActive(123)).toBe(false);
        });

        it('should return true when skuId !== pendingSku and isSkuLoved returns true', () => {
            isSkuLovedSpy.and.returnValue(true);
            expect(component.isActive(321)).toBe(true);
        });

        it('should return false when skuId !== pendingSku and isSkuLoved returns false', () => {
            isSkuLovedSpy.and.returnValue(false);
            expect(component.isActive(321)).toBe(false);
        });
    });

    describe('setPendingSku method', () => {
        it('should call setState with the correct values', () => {
            const setStateSpy = spyOn(component, 'setState');
            const params = {
                isPending: true,
                skuId: 123,
                status: 'loved'
            };
            component.setPendingSku(params);
            expect(setStateSpy).toHaveBeenCalledWith({
                isPending: params.isPending,
                pendingSku: {
                    skuId: params.skuId,
                    status: params.status
                }
            });
        });
    });

    describe('handleLoveRequest method', () => {
        it('should dispatch addLove action if sku is not loved', () => {
            component.handleLoveRequest(skuLoveData);
            expect(addLoveSpy).toHaveBeenCalled();
        });

        it('should dispatch removeLove action if sku is loved', () => {
            isSkuLovedSpy.and.returnValue(true);
            component.handleLoveRequest(skuLoveData);
            expect(removeLoveSpy).toHaveBeenCalled();
        });
    });

    describe('handleOnClick method', () => {
        it('should call event.preventDfault', () => {
            component.handleOnClick(event, skuLoveData);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should do an authentication check first', () => {
            const Authentication = require('utils/Authentication').default;
            const fakePromise = {
                then: callback => {
                    callback();

                    return fakePromise;
                },
                catch: () => {}
            };
            const authenticationStub = spyOn(Authentication, 'requireAuthentication').and.returnValue(fakePromise);

            component.handleOnClick(event, skuLoveData);
            expect(authenticationStub).toHaveBeenCalled();
        });
    });

    describe('mouse events', () => {
        it('should call event.stopPropagation', () => {
            component.mouseEnter(event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should setState hover to true on mouseEnter', () => {
            component.mouseEnter(event);
            expect(component.state.hover).toBe(true);
        });

        it('should setState hover to false on mouseLeave', () => {
            component.mouseLeave(event);
            expect(component.state.hover).toBe(false);
        });
    });
});
