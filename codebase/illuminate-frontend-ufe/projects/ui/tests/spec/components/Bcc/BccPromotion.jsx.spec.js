describe('BccPromotion', () => {
    let React;
    let promoUtils;
    let BccPromotion;
    let applyPromoStub;
    let shallowComponent;

    beforeEach(function () {
        React = require('react');
        promoUtils = require('utils/Promos').default;
        BccPromotion = require('components/Bcc/BccPromotion/BccPromotion').default;
        applyPromoStub = spyOn(promoUtils, 'applyPromo');
        shallowComponent = enzyme.shallow(<BccPromotion promoCode='PROMO' />);
    });

    it('should call applyPromo with promo code', () => {
        shallowComponent.find('Box').simulate('click');
        expect(applyPromoStub).toHaveBeenCalledWith('PROMO', null, null, true);
    });

    it('should render a Bcc Image', () => {
        expect(shallowComponent.find('BccImage').length).toBe(1);
    });
});
