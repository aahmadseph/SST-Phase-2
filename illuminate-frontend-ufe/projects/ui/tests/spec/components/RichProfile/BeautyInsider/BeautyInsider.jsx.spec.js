describe('BeautyInsider component', () => {
    let React;
    let BeautyInsider;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        BeautyInsider = require('components/RichProfile/BeautyInsider/BeautyInsider').default;
        shallowComponent = enzyme.shallow(<BeautyInsider />);
    });

    describe('RewardsCarousel', () => {
        let state;
        beforeEach(() => {
            state = { biRewards: [{ componentId: 'id' }] };
            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState(state);
        });
        it('should render it', () => {
            expect(shallowComponent.find('RewardsCarousel').length).toEqual(1);
        });

        it('should not render it if the user doesnot have BI Reward', () => {
            state.biRewards = false;
            shallowComponent.setState(state);
            expect(shallowComponent.find('RewardsCarousel').length).toEqual(0);
        });
    });

    describe('BeautyInsiderCash', () => {
        let biRewardsState;

        beforeEach(() => {
            biRewardsState = [
                {
                    key: 'BiCashRewards',
                    type: 'cbr'
                }
            ];
            Sephora.configurationSettings.isCashBackRewardsEnabled = true;
        });

        it('should not render if global flag is off', () => {
            Sephora.configurationSettings.isCashBackRewardsEnabled = false;
            shallowComponent.setState({
                biRewards: biRewardsState,
                biSummary: {
                    biCashOptions: {
                        eligiblePoint: 500,
                        eligibleValue: '$10',
                        eligibleCBRCount: 0,
                        missingPoints: 1,
                        thresholdValue: 75,
                        availablePromotions: [
                            {
                                point: 500,
                                value: '$10'
                            }
                        ]
                    }
                }
            });
            expect(shallowComponent.find('BeautyInsiderCash').exists()).toBe(false);
        });

        it('should not render if CBR list is empty', () => {
            shallowComponent.setState({
                biRewards: biRewardsState,
                biSummary: {
                    biCashOptions: {
                        eligiblePoint: 500,
                        eligibleValue: '$10',
                        eligibleCBRCount: 0,
                        missingPoints: 1,
                        thresholdValue: 75,
                        availablePromotions: []
                    }
                }
            });
            expect(shallowComponent.find('BeautyInsiderCash').exists()).toBe(false);
        });

        it('should render if required props are present', () => {
            shallowComponent.setState({
                biRewards: biRewardsState,
                biSummary: {
                    biCashOptions: {
                        eligiblePoint: 500,
                        eligibleValue: '$10',
                        eligibleCBRCount: 0,
                        missingPoints: 1,
                        thresholdValue: 75,
                        availablePromotions: [
                            {
                                point: 500,
                                value: '$10'
                            }
                        ]
                    }
                }
            });
            expect(shallowComponent.find('BeautyInsiderCash').exists()).toBe(true);
        });

        afterEach(() => {
            delete Sephora.configurationSettings.isCashBackRewardsEnabled;
        });
    });

    describe('RecentRewardActivity', () => {
        let state;

        beforeEach(() => {
            Sephora.linkJSON = [];

            state = {
                isUserAtleastRecognized: true,
                isUserReady: true,
                isUserBi: true
            };
        });

        it('should render it', () => {
            shallowComponent.setState(state, () => {
                expect(shallowComponent.find('RecentRewardActivity').length).toEqual(1);
            });
        });

        it('should not render it if the user is not at least recognized', () => {
            state.isUserAtleastRecognized = false;
            shallowComponent.setState(state);
            expect(shallowComponent.find('RecentRewardActivity').length).toEqual(0);
        });

        it('should not render it if the user is not ready', () => {
            state.isUserReady = false;
            shallowComponent.setState(state);
            expect(shallowComponent.find('RecentRewardActivity').length).toEqual(0);
        });

        it('should not render it if the user is not BI', () => {
            state.isUserBi = false;
            shallowComponent.setState(state);
            expect(shallowComponent.find('RecentRewardActivity').length).toEqual(0);
        });
    });

    describe('BccComponentList', () => {
        it('should not render it if the regions are not available in props', () => {
            expect(shallowComponent.find('BccComponentList').length).toEqual(0);
        });

        describe('with BCC regions', () => {
            let mockedRegions;

            beforeEach(() => {
                mockedRegions = {};
            });

            it('should render all BccComponentList regions if available in props', () => {
                mockedRegions = {
                    content: [{}],
                    left: [{}],
                    right: [{}]
                };

                shallowComponent = enzyme.shallow(<BeautyInsider regions={mockedRegions} />);
                expect(shallowComponent.find('BccComponentList').length).toEqual(3);
            });

            it('should render BccComponentList sent from server', () => {
                mockedRegions = {
                    content: [{}],
                    right: [{}]
                };

                shallowComponent = enzyme.shallow(<BeautyInsider regions={mockedRegions} />);
                expect(shallowComponent.find('BccComponentList').length).toEqual(2);
            });

            describe('rendered in proper order', () => {
                beforeEach(() => {
                    mockedRegions = {
                        right: [{ altText: 'Right' }],
                        content: [{ altText: 'Content' }],
                        left: [{ altText: 'Left' }]
                    };

                    shallowComponent = enzyme.shallow(<BeautyInsider regions={mockedRegions} />);
                });

                it('should render Content BccComponentList on first place', () => {
                    expect(shallowComponent.find('BccComponentList').at(0).prop('items')[0].altText).toEqual('Left');
                });

                it('should render Left BccComponentList on second place', () => {
                    expect(shallowComponent.find('BccComponentList').at(1).prop('items')[0].altText).toEqual('Content');
                });

                it('should render Right BccComponentList on third place', () => {
                    expect(shallowComponent.find('BccComponentList').at(2).prop('items')[0].altText).toEqual('Right');
                });
            });
        });
    });

    describe('Credit Card Rewards comp', () => {
        const localeUtils = require('utils/LanguageLocale').default;
        let isUS;

        beforeEach(() => {
            isUS = spyOn(localeUtils, 'isUS');
        });

        it('should render it if the user is a CC holder', () => {
            Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
            isUS.and.returnValue(true);

            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState({
                user: { bankRewards: { ccRewardStatus: 'CreditCard_REWARDS_EARNED' } },
                biRewards: [{ type: 'ccr' }]
            });

            expect(shallowComponent.findWhere(n => n.name() === 'CreditCardRewards').length).toBe(1);
        });

        it('should not render it if the user is a non CC holder', () => {
            Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
            isUS.and.returnValue(true);

            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState({
                user: {},
                biRewards: [{}]
            });

            expect(shallowComponent.findWhere(n => n.name() === 'CreditCardRewards').length).toBe(0);
        });

        it('should not render it if isGlobalEnabled is false', () => {
            Sephora.fantasticPlasticConfigurations.isGlobalEnabled = false;
            isUS.and.returnValue(true);

            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState({
                user: { bankRewards: { ccRewardStatus: 'CreditCard_REWARDS_EARNED' } },
                biRewards: [{ type: 'ccr' }]
            });

            expect(shallowComponent.findWhere(n => n.name() === 'CreditCardRewards').length).toBe(0);
        });
    });

    describe('ChipsAndTable', () => {
        let state;
        let clientSummary;

        beforeEach(() => {
            clientSummary = { currentYear: { year: 2020 } };
            state = {
                user: { bankRewards: { YTDRewardsEarned: 'YTDRewardsEarned' } },
                biSummary: { clientSummary },
                isUserReady: true,
                isUserAtleastRecognized: true,
                isUserBi: true
            };
            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState(state);
        });

        it('should render ValueTable', () => {
            expect(shallowComponent.find('ValueTable').length).toEqual(1);
        });

        it('should render ValueTable with correct props', () => {
            expect(shallowComponent.find('ValueTable').props()).toEqual({
                clientSummary,
                rewardsTotal: 'YTDRewardsEarned'
            });
        });
    });

    describe('ActiveCampaign', () => {
        let state;

        beforeEach(() => {
            state = { biSummary: { activeCampaigns: [{ referralLink: 'link' }] } };
            shallowComponent = enzyme.shallow(<BeautyInsider />);
            shallowComponent.setState(state);
        });

        it('should render ActiveCampaign', () => {
            expect(shallowComponent.find('ActiveCampaign').length).toEqual(1);
        });

        it('should render ActiveCampaign with correct props', () => {
            expect(shallowComponent.find('ActiveCampaign').props()).toEqual({ activeCampaign: state.biSummary.activeCampaigns[0] });
        });
    });
});
