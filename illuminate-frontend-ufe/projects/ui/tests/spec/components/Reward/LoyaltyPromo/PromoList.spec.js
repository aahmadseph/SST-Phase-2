const React = require('react');
const { shallow } = require('enzyme');
const PromoList = require('components/Reward/LoyaltyPromo/MultiplePointsView/PromoList').default;
const localeUtils = require('utils/LanguageLocale').default;
const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

describe('PromoList component', () => {
    let component;
    const props = {
        getText,
        isModal: false,
        isCheckout: false,
        isCarousel: false,
        errorMessage: null,
        errorPromoCode: null,
        pfd: {
            promotions: [
                {
                    couponCode: 'PFD_10_750',
                    discountPercentage: 10,
                    displayName: 'Points for % off',
                    isApplied: false,
                    isEligible: true,
                    localizedDiscountPercentage: '**10% off**',
                    points: 750,
                    promotionId: 'pointspercentoffpromo',
                    promotionType: 'PFD'
                },
                {
                    couponCode: 'PFD_15_1000',
                    discountPercentage: 15,
                    displayName: 'Points for % off',
                    isApplied: false,
                    isEligible: true,
                    localizedDiscountPercentage: '**15% off**',
                    points: 1000,
                    promotionId: 'pointspercentoffpromo',
                    promotionType: 'PFD'
                }
            ],
            availableRewardsTotal: 15,
            appliedPercentageOff: 0,
            promoEndDate: 'Friday, December 31',
            promoMessage: []
        },
        cbr: {
            promotions: [
                {
                    couponCode: 'CBR_10_500',
                    discountAmount: 10,
                    displayName: 'Beauty Insider Cash',
                    isApplied: false,
                    isEligible: true,
                    localizedDiscountAmount: '$10',
                    points: 500,
                    promotionId: 'cashbackrewardspromo',
                    promotionType: 'CBR'
                }
            ],
            appliedRewardsTotal: 0,
            availableRewardsTotal: 10,
            basketSubTotal: '$223.25',
            basketRawSubTotal: '$235.00',
            promoMessage: []
        }
    };

    beforeEach(() => {
        component = shallow(<PromoList {...props} />);
    });

    describe('Test data-at attributes', () => {
        it('should render data-at attribute set to "cbr_error_msg"', () => {
            // Act
            const dataAt = component.findWhere(n => n.name() === 'ErrorMessage' && n.prop('data-at') === 'cbr_error_msg');

            // Assert
            expect(dataAt.length).toEqual(props.cbr.promotions.length);
        });

        it('should render data-at attribute set to "pfd_error_msg"', () => {
            // Act
            const dataAt = component.findWhere(n => n.name() === 'ErrorMessage' && n.prop('data-at') === 'pfd_error_msg');

            // Assert
            expect(dataAt.length).toEqual(props.pfd.promotions.length);
        });
    });
});
