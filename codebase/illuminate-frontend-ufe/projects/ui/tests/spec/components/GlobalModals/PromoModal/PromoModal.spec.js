const React = require('react');
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const promoUtils = require('utils/Promos').default;
const PromoModal = require('components/GlobalModals/PromoModal/PromoModal').default;
const BasketBindings = require('analytics/bindingMethods/pages/basket/BasketBindings').default;
describe('PromoModal component', () => {
    let component;
    let multiPromoStub;
    let dispatchStub;
    let showPromoModalStub;
    let submitMsgPromosStub;
    let removePromoStub;
    let props = {};

    beforeEach(() => {
        props.promoCode = undefined;
    });

    describe('ctrlr method', () => {
        beforeEach(() => {
            multiPromoStub = spyOn(BasketBindings, 'multiPromo');
            props = { location: 'checkout' };
            const wrapper = shallow(<PromoModal {...props} />);
            component = wrapper.instance();
        });

        it('should call multiPromo tracking method', () => {
            expect(multiPromoStub).toHaveBeenCalledTimes(1);
        });

        it('should call multiPromo tracking method with params', () => {
            expect(multiPromoStub).toHaveBeenCalledWith({ location: 'checkout', eventStrings: ['scCheckout'] });
        });
    });

    describe('isDone method', () => {
        beforeEach(() => {
            props.promoCode = 'somePromoCode';
        });

        describe('Outside if block', () => {
            beforeEach(() => {
                dispatchStub = spyOn(store, 'dispatch');
                showPromoModalStub = spyOn(Actions, 'showPromoModal');
                const wrapper = shallow(<PromoModal />, { disableLifecycleMethods: true });
                component = wrapper.instance();
                component.setState({
                    msgPromosSkuList: [{ couponCode: 'somePromoCode' }, { couponCode: 'somePromoCode1' }, { couponCode: 'somePromoCode2' }]
                });

                component.isDone();
            });

            it('should call dispatch method', () => {
                expect(dispatchStub).toHaveBeenCalledTimes(1);
            });

            it('should call dispatch method with params', () => {
                expect(dispatchStub).toHaveBeenCalledWith(showPromoModalStub());
            });

            it('should call showPromo method', () => {
                expect(showPromoModalStub).toHaveBeenCalledTimes(1);
            });

            it('should call showPromo method with params', () => {
                expect(showPromoModalStub).toHaveBeenCalledWith(false);
            });
        });

        describe('Without Promo Code Prop', () => {
            beforeEach(() => {
                submitMsgPromosStub = spyOn(promoUtils, 'submitMsgPromos');
                removePromoStub = spyOn(promoUtils, 'removePromo');
                const wrapper = shallow(<PromoModal />, { disableLifecycleMethods: true });
                component = wrapper.instance();
                component.setState({
                    msgPromosSkuList: [
                        {
                            couponCode: 'somePromoCode',
                            skuId: '123'
                        },
                        {
                            couponCode: 'somePromoCode1',
                            skuId: '456'
                        },
                        {
                            couponCode: 'somePromoCode2',
                            skuId: '789'
                        }
                    ]
                });
                component.isDone();
            });

            it('should not call submitMsgPromos method', () => {
                expect(submitMsgPromosStub).not.toHaveBeenCalled();
            });

            it('should not call removePromo method', () => {
                expect(removePromoStub).not.toHaveBeenCalled();
            });
        });

        describe('With Promo Code Prop', () => {
            beforeEach(() => {
                props.promoCode = 'somePromoCode';
                const wrapper = shallow(<PromoModal {...props} />, { disableLifecycleMethods: true });
                component = wrapper.instance();
            });

            describe('submitMsgPromos happy path', () => {
                beforeEach(() => {
                    submitMsgPromosStub = spyOn(promoUtils, 'submitMsgPromos').and.returnValue({ then: () => {} });
                    component.setState({
                        msgPromosSkuList: [
                            {
                                couponCode: 'somePromoCode',
                                skuId: '123'
                            },
                            {
                                couponCode: 'somePromoCode1',
                                skuId: '456'
                            },
                            {
                                couponCode: 'somePromoCode2',
                                skuId: '789'
                            }
                        ]
                    });
                    component.isDone();
                });

                it('should call submitMsgPromos method', () => {
                    expect(submitMsgPromosStub).toHaveBeenCalledTimes(1);
                });

                it('should call submitMsgPromos method with params', () => {
                    expect(submitMsgPromosStub).toHaveBeenCalledWith('somePromoCode', ['123']);
                });
            });

            describe('removePromo', () => {
                beforeEach(() => {
                    props.promoCode = 'PROMO_CODE';
                    removePromoStub = spyOn(promoUtils, 'removePromo');
                    const wrapper = shallow(<PromoModal {...props} />, { disableLifecycleMethods: true });
                    component = wrapper.instance();
                    component.setState({
                        msgPromosSkuList: [
                            {
                                couponCode: 'somePromoCode',
                                skuId: '123'
                            },
                            {
                                couponCode: 'somePromoCode1',
                                skuId: '456'
                            },
                            {
                                couponCode: 'somePromoCode2',
                                skuId: '789'
                            }
                        ]
                    });
                    component.isDone();
                });

                it('should call removePromo method', () => {
                    expect(removePromoStub).toHaveBeenCalledTimes(1);
                });

                it('should call removePromo method with params', () => {
                    expect(removePromoStub).toHaveBeenCalledWith('PROMO_CODE');
                });
            });
        });
    });

    describe('close method', () => {
        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            showPromoModalStub = spyOn(Actions, 'showPromoModal');
            removePromoStub = spyOn(promoUtils, 'removePromo');
            props.promoCode = 'somePromoCode';
            const wrapper = shallow(<PromoModal {...props} />);
            component = wrapper.instance();
            component.close();
        });

        it('should call removePromo method', () => {
            expect(removePromoStub).toHaveBeenCalledTimes(1);
        });

        it('should call removePromo method params', () => {
            expect(removePromoStub).toHaveBeenCalledWith('somePromoCode');
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showPromoModalStub());
        });

        it('should call showPromoModal method', () => {
            expect(showPromoModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call removePromo method params', () => {
            expect(showPromoModalStub).toHaveBeenCalledWith(false);
        });
    });
});
