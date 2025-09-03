describe('CashBackRewardItem', () => {
    let props;
    let CashBackRewardItem;
    let shallowComponent;
    let React;

    beforeEach(() => {
        React = require('react');
        CashBackRewardItem = require('components/Reward/LoyaltyPromo/CashBackRewardItem/CashBackRewardItem').default;
    });

    describe('renderListReward', () => {
        beforeEach(() => {
            props = {
                option: {
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
                isCarousel: false
            };

            shallowComponent = enzyme.shallow(<CashBackRewardItem {...props} />);
        });

        it('should render a Text comp with the amount of points', () => {
            expect(shallowComponent.find('Text').prop('children')).toEqual([props.option.points, ' ', 'points']);
        });

        it('should render a PromoCta with current option', () => {
            expect(shallowComponent.find('PromoCta').prop('option')).toEqual(props.option);
        });

        it('should render a Flex comp', () => {
            //render a Box comp
            expect(shallowComponent.find('Flex').length).toEqual(1);
        });
    });

    describe('renderCarouselReward', () => {
        beforeEach(() => {
            props = {
                option: {
                    couponCode: 'CBR_3_250',
                    discountAmount: 3,
                    displayName: 'Beauty Insider Cash',
                    isApplied: false,
                    isEligible: true,
                    localizedDiscountAmount: '$3',
                    points: 300,
                    promotionId: 'cashbackrewardspromo',
                    promotionType: 'CBR'
                },
                isCarousel: true
            };

            shallowComponent = enzyme.shallow(<CashBackRewardItem {...props} />);
        });

        it('should render a PromoCta with current option', () => {
            expect(shallowComponent.find('PromoCta').prop('option')).toEqual(props.option);
        });

        it('should render a Box comp', () => {
            expect(shallowComponent.find('Box').length).toEqual(1);
        });
    });

    describe('renderCta when isApplied', () => {
        beforeEach(() => {
            props = {
                option: {
                    couponCode: 'CBR_3_250',
                    discountAmount: 3,
                    displayName: 'Beauty Insider Cash',
                    isApplied: true,
                    isEligible: true,
                    localizedDiscountAmount: '$3',
                    points: 300,
                    promotionId: 'cashbackrewardspromo',
                    promotionType: 'CBR'
                },
                isCarousel: false
            };

            shallowComponent = enzyme.shallow(<CashBackRewardItem {...props} />);
        });

        it('should render a PromoCta with current option', () => {
            expect(shallowComponent.find('PromoCta').prop('option')).toEqual(props.option);
        });
    });
});
