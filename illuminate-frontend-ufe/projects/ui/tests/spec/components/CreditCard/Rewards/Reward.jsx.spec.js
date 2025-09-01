describe('<Reward /> component', () => {
    let React;
    let Reward;
    let wrapper;
    let RewardPropsStub;

    beforeEach(() => {
        React = require('react');
        Reward = require('components/CreditCard/Rewards/Reward').default;
        RewardPropsStub = {
            certificateNumber: 'firstbuypercentoff',
            couponExpirationDate: '08/29/2019',
            creditCardCouponCode: 'firstbuypercentoff',
            displayName: '15% off First Purchase',
            isApplied: false,
            isFirstPurchaseDiscount: true,
            rewardAmount: 0,
            shortDisplayName: '15% off'
        };
    });

    it('should display the First Purchase Discount reward without a $ sign when it is applied', () => {
        wrapper = enzyme.shallow(<Reward option={RewardPropsStub} />);
        expect(wrapper.contains(<b>15% off</b>)).toEqual(true);
    });
});
