const React = require('react');
const { anything } = jasmine;
const { shallow } = require('enzyme');
const LoyaltyPromo = require('components/Reward/LoyaltyPromo/LoyaltyPromo').default;
const localeUtils = require('utils/LanguageLocale').default;
const basketUtils = require('utils/Basket').default;

describe('LoyaltyPromo component', () => {
    let state;
    let props;
    let component;
    const rewardsList = [
        {
            couponCode: 'CBR_3_250',
            discountAmount: 3,
            displayName: 'Beauty Insider Cash',
            isApplied: false,
            isEligible: true,
            localizedDiscountAmount: '$3',
            points: 250,
            promotionId: 'cashbackrewardspromo',
            promotionType: 'CBR'
        },
        {
            couponCode: 'CBR_7_500',
            discountAmount: 7,
            displayName: 'Beauty Insider Cash',
            isApplied: false,
            isEligible: true,
            localizedDiscountAmount: '$7',
            points: 500,
            promotionId: 'cashbackrewardspromo',
            promotionType: 'CBR'
        }
    ];
    const defaultState = {
        appliedRewardsTotal: 0,
        availableRewardsTotal: 30,
        errorMessage: null,
        isExpanded: false,
        isBIPointsAvailable: true,
        rewardsList
    };

    xdescribe('onInfoIconClick', () => {
        it('should call showInfoModal', () => {
            const showInfoModalSpy = spyOn(LoyaltyPromo, 'showInfoModal');
            LoyaltyPromo.onInfoIconClick();
            expect(showInfoModalSpy).toHaveBeenCalled();
        });
    });

    xdescribe('localizeAmount', () => {
        it('should call getFormattedPrice with correct args', () => {
            const getFormattedPriceSpy = spyOn(localeUtils, 'getFormattedPrice');
            LoyaltyPromo.localizeAmount(109.23);
            expect(getFormattedPriceSpy).toHaveBeenCalledWith(109.23, anything(), anything());
        });
    });

    xdescribe('renderErrorMessage', () => {
        beforeEach(() => {
            props = {
                isCarousel: false,
                isHeaderOnly: false,
                isModal: false
            };
            component = shallow(<LoyaltyPromo {...props} />);
        });

        it('should return null if no error in the state', () => {
            component.setState({ ...defaultState });
            expect(component.instance().renderErrorMessage('123')).toBe(null);
        });

        it('should return null if error in the state but cupon does not match', () => {
            component.setState({
                ...defaultState,
                errorMessage: 'error!',
                errorPromoCode: '321'
            });
            expect(component.instance().renderErrorMessage('123')).toBe(null);
        });

        it('should return ErrorMsg if no error in the state and cuponCode mathces', () => {
            component.setState({
                ...defaultState,
                errorMessage: 'error!',
                errorPromoCode: '123'
            });
            const result = component.instance().renderErrorMessage();
            const errroMsg = component.wrap(result);
            expect(errroMsg.find('ErrorMsg').length).toEqual(1);
        });
    });

    xdescribe('renderSingleDenominationView', () => {
        beforeEach(() => {
            state = { ...defaultState };
            state.rewardsList = [state.rewardsList[0]];

            props = {
                isCarousel: false,
                isHeaderOnly: false,
                isModal: false
            };

            component = shallow(<LoyaltyPromo {...props} />);
            component.setState(state);
        });

        it('should render a Carousel comp', () => {
            expect(component.find('PromoCta').length).toEqual(1);
        });
    });

    xdescribe('renderAsCarousel', () => {
        beforeEach(() => {
            state = { ...defaultState };

            props = {
                isCarousel: true,
                isHeaderOnly: false,
                isModal: false
            };

            component = shallow(<LoyaltyPromo {...props} />);
            component.setState(state);
        });

        it('should render a Carousel comp', () => {
            expect(component.find('LegacyCarousel').length).toEqual(1);
        });
    });

    xdescribe('render exceptions', () => {
        beforeEach(() => {
            state = { ...defaultState };
            props = {
                isCarousel: false,
                isHeaderOnly: false,
                isModal: false
            };
            component = shallow(<LoyaltyPromo {...props} />);
        });

        it('should not render component if rewards array is empty', () => {
            state.rewardsList = [];
            component.setState(state);
            expect(component.children().length).toEqual(0);
        });

        it('should not render component for ROW orders', () => {
            spyOn(basketUtils, 'isUSorCanadaShipping').and.returnValue(false);
            component.setState(state);
            expect(component.children().length).toEqual(0);
        });
    });

    xdescribe('indicators', () => {
        const finfIndicatorsNode = () =>
            component
                .find('RewardSection')
                .dive()
                .findWhere(n => n.key() === 'cbrIndicators');

        beforeEach(() => {
            state = { ...defaultState };
            state.availableRewardsTotal = 777;
            props = {
                isCarousel: false,
                isHeaderOnly: false,
                isModal: false
            };
            component = shallow(<LoyaltyPromo {...props} />);
            spyOn(LoyaltyPromo, 'localizeAmount').and.callFake(arg => arg);
        });

        it('should show applied text if appliedRewardsTotal > 0', () => {
            state.appliedRewardsTotal = 888;
            component.setState(state);
            expect(finfIndicatorsNode(component).at(0).text().trim()).toEqual('888 applied');
        });

        it('should show available text if appliedRewardsTotal <= 0', () => {
            state.appliedRewardsTotal = 0;
            component.setState(state);
            expect(finfIndicatorsNode(component).at(0).text().trim()).toEqual('Up to 777 available');
        });
    });

    xdescribe('render BI down message', () => {
        beforeEach(() => {
            state = { ...defaultState };
            state.isBIPointsAvailable = false;

            props = {
                isCarousel: true,
                isHeaderOnly: false,
                isModal: false
            };

            component = shallow(<LoyaltyPromo {...props} />);
            component.setState(state);
        });

        it('should render the BI Unavailable message', () => {
            expect(component.find('BiUnavailable').length).toEqual(1);
        });
    });

    xdescribe('showModal method', () => {
        let fireAnalyticsStub;

        beforeEach(() => {
            fireAnalyticsStub = spyOn(LoyaltyPromo, 'fireAnalytics');
        });

        it('should call fireAnalytics when opening a modal', () => {
            LoyaltyPromo.showModal();
            expect(fireAnalyticsStub).toHaveBeenCalled();
        });
    });
});
