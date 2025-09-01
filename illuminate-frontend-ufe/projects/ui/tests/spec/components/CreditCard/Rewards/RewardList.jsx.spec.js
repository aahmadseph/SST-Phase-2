describe('<RewardList /> component', () => {
    let React;
    let RewardList;
    let wrapper;
    let RewardListStateStub;

    beforeEach(() => {
        React = require('react');
        RewardList = require('components/CreditCard/Rewards/RewardList').default;
        RewardListStateStub = {
            creditCardPromoDetails: {
                couponExpirationDate: '08/29/2019',
                creditCardCouponCode: 'firstbuypercentoff',
                displayName: '15% off First Purchase',
                shortDisplayName: '15% off'
            },
            rewardsToShow: [
                {
                    certificateNumber: 'firstbuypercentoff',
                    couponExpirationDate: '08/29/2019',
                    creditCardCouponCode: 'firstbuypercentoff',
                    displayName: '15% off First Purchase',
                    isApplied: false,
                    isFirstPurchaseDiscount: true,
                    rewardAmount: 0,
                    shortDisplayName: '15% off'
                }
            ]
        };
    });

    xit('should display the First Purchase Discount value without a $ sign when it is applied', () => {
        wrapper = enzyme.mount(<RewardList />);
        wrapper.setState({
            ...RewardListStateStub,
            isFirstPurchaseDiscountApplied: true
        });
        expect(wrapper.contains(<b>15% off</b>)).toEqual(true);
    });
});
