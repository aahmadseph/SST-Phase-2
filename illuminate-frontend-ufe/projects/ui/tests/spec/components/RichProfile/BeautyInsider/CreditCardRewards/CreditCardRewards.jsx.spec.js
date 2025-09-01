/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const { objectContaining } = jasmine;
const { shallow, mount } = require('enzyme');
const AnalyticsUtils = require('analytics/utils').default;
const React = require('react');

describe('BI CreditCardRewards', () => {
    let bankRewards;
    let CreditCardRewards;
    let wrapper;
    let UrlUtils;

    beforeEach(() => {
        CreditCardRewards = require('components/RichProfile/BeautyInsider/CreditCardRewards/CreditCardRewards').default;
        UrlUtils = require('utils/Url').default;
    });

    describe('render when CC user has rewards available', () => {
        beforeEach(() => {
            bankRewards = {
                YTDRewardsEarned: 0,
                ccRewardStatus: 'CreditCard_REWARDS_EARNED',
                currentLevelName: 'Sephora Credit Card',
                currentLevelNumber: '1',
                expiredRewardsTotal: 0,
                nextStatementDate: '02/12/2020',
                numberOfRewardsAvailable: 26,
                rewardCertificates: [
                    {
                        available: true,
                        barcodeIndicator: '3OF9',
                        certificateNumber: 'RW00020260919858',
                        expireDate: '09/21/2020',
                        fulfilDate: '12/05/2019',
                        pinCode: '',
                        redeemDate: '01/01/9999',
                        rewardAmount: 10,
                        startDate: '12/05/2019'
                    },
                    {
                        available: true,
                        barcodeIndicator: '3OF9',
                        certificateNumber: 'RW00020260919456',
                        expireDate: '09/22/2020',
                        fulfilDate: '12/06/2019',
                        pinCode: '',
                        redeemDate: '01/04/9999',
                        rewardAmount: 10,
                        startDate: '12/05/2019'
                    },
                    {
                        available: true,
                        barcodeIndicator: '3OF9',
                        certificateNumber: 'RW00020260919345',
                        expireDate: '09/23/2020',
                        fulfilDate: '12/07/2019',
                        pinCode: '',
                        redeemDate: '01/05/9999',
                        rewardAmount: 10,
                        startDate: '12/05/2019'
                    },
                    {
                        available: true,
                        barcodeIndicator: '3OF9',
                        certificateNumber: 'RW00020260919234',
                        expireDate: '09/24/2020',
                        fulfilDate: '12/08/2019',
                        pinCode: '',
                        redeemDate: '01/06/9999',
                        rewardAmount: 10,
                        startDate: '12/05/2019'
                    }
                ],
                rewardMessageList: ['Total available Credit Card Rewards', 'Credit Card Rewards Earned', 'APPLY CREDIT CARD REWARDS IN BASKET'],
                rewardsTotal: 260,
                totalEarningsOnNextStatement: 0,
                totalRewardsEarnedOnNextStatement: 0,
                upcomingRewardsTotal: 0
            };

            wrapper = shallow(<CreditCardRewards bankRewards={bankRewards} />);
        });

        it('should render a Button comp with the text coming within rewardMessageList', () => {
            const btnMessage = bankRewards.rewardMessageList[2];
            const buttonComp = wrapper.findWhere(n => n.name() === 'Button' && n.props().children === btnMessage);
            expect(buttonComp.length).toEqual(1);
        });

        it('should render a Text comp with the message coming within rewardMessageList', () => {
            const txtMessage = bankRewards.rewardMessageList[0];
            const textComp = wrapper.findWhere(n => n.name() === 'Text' && n.props().children === txtMessage);
            expect(textComp.length).toEqual(1);
        });

        it('should render a Text comp with the rewards total amount', () => {
            const textComp = wrapper.findWhere(n => n.name() === 'Text' && n.props().children[1] === bankRewards.rewardsTotal);
            expect(textComp.length).toEqual(1);
        });

        it('should render a Buttton with a redirect to Basket page', () => {
            const redirectToStub = spyOn(UrlUtils, 'redirectTo');
            const buttonComp = wrapper.findWhere(n => n.name() === 'Button');

            buttonComp.simulate('click');
            expect(redirectToStub).toHaveBeenCalledWith('/basket');
        });
    });

    describe('render when CC user has no rewards yet', () => {
        beforeEach(() => {
            bankRewards = {
                YTDRewardsEarned: 0,
                ccRewardStatus: 'CreditCard_NO_REWARDS_EARNED',
                expiredRewardsTotal: 0,
                numberOfRewardsAvailable: 0,
                rewardMessageList: ['Your Credit Card Rewards will appear here. Use your Sephora Credit Card to earn rewards!'],
                rewardsTotal: 0,
                totalEarningsOnNextStatement: 0,
                totalRewardsEarnedOnNextStatement: 0,
                upcomingRewardsTotal: 0
            };

            wrapper = shallow(<CreditCardRewards bankRewards={bankRewards} />);
        });

        it('should render a Text comp with the message coming within rewardMessageList', () => {
            const txtMessage = 'Your Credit Card Rewards will appear here.';
            const textComp = wrapper.findWhere(n => n.name() === 'Text' && n.props().children[0] === txtMessage);
            expect(textComp.length).toEqual(1);
        });

        it('should render an Image comp', () => {
            const imageComp = wrapper.findWhere(n => n.name() === 'Image');
            expect(imageComp.length).toEqual(2);
        });
    });

    describe('render when CC user has all rewards redeemed', () => {
        beforeEach(() => {
            bankRewards = {
                YTDRewardsEarned: 0,
                ccRewardStatus: 'CreditCard_REWARDS_ALREADY_REDEEMED',
                currentLevelName: 'Sephora Credit Card',
                currentLevelNumber: '1',
                expiredRewardsTotal: 0,
                nextStatementDate: '03/06/2020',
                numberOfRewardsAvailable: 0,
                rewardMessageList: [
                    'Use your Sephora Credit Card to earn rewards',
                    'Credit Card Rewards Earned',
                    'Your Credit Card Rewards will appear here',
                    'SHOP TO EARN REWARDS'
                ],
                rewardsTotal: 0,
                totalEarningsOnNextStatement: 0,
                totalRewardsEarnedOnNextStatement: 0,
                upcomingRewardsTotal: 0
            };

            wrapper = shallow(<CreditCardRewards bankRewards={bankRewards} />);
        });

        it('should render a Button comp with the text coming within rewardMessageList', () => {
            const btnMessage = bankRewards.rewardMessageList[3];
            const buttonComp = wrapper.findWhere(n => n.name() === 'Button' && n.props().children === btnMessage);
            expect(buttonComp.length).toEqual(1);
        });

        it('should render a Text comp with the message coming within rewardMessageList', () => {
            const txtMessage = bankRewards.rewardMessageList[0];
            const textComp = wrapper.findWhere(n => n.name() === 'Text' && n.props().children === txtMessage);
            expect(textComp.length).toEqual(1);
        });

        it('should render a Buttton with a redirect to Homepage page', () => {
            const redirectToStub = spyOn(UrlUtils, 'redirectTo');
            const buttonComp = wrapper.findWhere(n => n.name() === 'Button');

            buttonComp.simulate('click');
            expect(redirectToStub).toHaveBeenCalledWith('/');
        });
    });

    describe('when info icon is clicked', () => {
        let dispatchStub;
        let store;
        let Actions;
        let showMediaModalStub;

        beforeEach(() => {
            store = require('store/Store').default;
            Actions = require('Actions').default;
            bankRewards = {
                YTDRewardsEarned: 0,
                ccRewardStatus: 'CreditCard_REWARDS_ALREADY_REDEEMED',
                currentLevelName: 'Sephora Credit Card',
                currentLevelNumber: '1',
                expiredRewardsTotal: 0,
                nextStatementDate: '03/06/2020',
                numberOfRewardsAvailable: 0,
                rewardMessageList: [
                    'Use your Sephora Credit Card to earn rewards',
                    'Credit Card Rewards Earned',
                    'Your Credit Card Rewards will appear here',
                    'SHOP TO EARN REWARDS'
                ],
                rewardsTotal: 0,
                totalEarningsOnNextStatement: 0,
                totalRewardsEarnedOnNextStatement: 0,
                upcomingRewardsTotal: 0
            };
            dispatchStub = spyOn(store, 'dispatch');
            showMediaModalStub = spyOn(Actions, 'showMediaModal');
            wrapper = shallow(<CreditCardRewards bankRewards={bankRewards} />);
        });

        it('should call the Action showMediaModal', () => {
            const infoButton = wrapper.findWhere(node => node.name() === 'InfoButton' && typeof node.prop('onClick') === 'function').at(0);
            infoButton.prop('onClick')();
            expect(showMediaModalStub).toHaveBeenCalled();
        });
    });

    xit('should update cookie "anaNextPageData" value when a user clicks on "apply credit card rewards in basket" button', () => {
        // Arrange
        spyOn(UrlUtils, 'redirectTo');
        const prop55 = 'bi:credit card rewards:apply credit rewards in basket';
        bankRewards = {
            YTDRewardsEarned: 0,
            ccRewardStatus: 'CreditCard_REWARDS_EARNED',
            currentLevelName: 'Sephora Credit Card',
            currentLevelNumber: '1',
            expiredRewardsTotal: 0,
            nextStatementDate: '02/12/2020',
            numberOfRewardsAvailable: 26,
            rewardCertificates: [
                {
                    available: true,
                    barcodeIndicator: '3OF9',
                    certificateNumber: 'RW00020260919858',
                    expireDate: '09/21/2020',
                    fulfilDate: '12/05/2019',
                    pinCode: '',
                    redeemDate: '01/01/9999',
                    rewardAmount: 10,
                    startDate: '12/05/2019'
                }
            ],
            rewardMessageList: ['Total available Credit Card Rewards', 'Credit Card Rewards Earned', 'APPLY CREDIT CARD REWARDS IN BASKET'],
            rewardsTotal: 260,
            totalEarningsOnNextStatement: 0,
            totalRewardsEarnedOnNextStatement: 0,
            upcomingRewardsTotal: 0
        };
        wrapper = mount(<CreditCardRewards bankRewards={bankRewards} />);
        const button = wrapper.find('Button');

        // Act
        button.simulate('click');

        // Assert
        const anaNextPageData = AnalyticsUtils.getPreviousPageData(true);
        expect(anaNextPageData).toEqual(objectContaining({ linkData: prop55 }));
    });
});
