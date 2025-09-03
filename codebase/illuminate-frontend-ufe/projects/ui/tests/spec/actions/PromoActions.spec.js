describe('Promo Actions', () => {
    const { createSpy } = jasmine;
    let PromoActions;
    let UtilActions;
    let mergeStub;
    let dispatch;
    let getState;

    beforeEach(() => {
        PromoActions = require('actions/PromoActions').default;
        UtilActions = require('utils/redux/Actions').default;
        mergeStub = spyOn(UtilActions, 'merge');
        dispatch = createSpy();
        getState = createSpy().and.returnValue({ promo: { msgPromosSkuList: [] } });
    });

    describe('updateMsgPromo', () => {
        const sku = {
            skuId: 1,
            couponCode: 'my promo code'
        };

        beforeEach(() => {
            PromoActions.updateMsgPromo(sku)(dispatch, getState);
        });

        it('should update store with msg promo list', () => {
            expect(mergeStub).toHaveBeenCalledWith('promo', 'msgPromosSkuList', [sku]);
        });

        it('should remove the promo error from the store', () => {
            expect(mergeStub).toHaveBeenCalledWith('promo', 'promoError', null);
        });
    });

    describe('removeMsgPromosByCode', () => {
        const couponCode = 'my promo code';

        beforeEach(() => {
            PromoActions.removeMsgPromosByCode(couponCode)(dispatch, getState);
        });

        it('should update store with msg promo list', () => {
            expect(mergeStub).toHaveBeenCalledWith('promo', 'msgPromosSkuList', []);
        });

        it('should remove the promo error from the store', () => {
            expect(mergeStub).toHaveBeenCalledWith('promo', 'promoError', null);
        });
    });
});
