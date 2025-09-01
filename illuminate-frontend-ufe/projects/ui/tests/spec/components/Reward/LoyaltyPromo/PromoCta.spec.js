const { createSpy } = jasmine;

describe('PromoCta', () => {
    let props;
    let PromoCta;
    let shallowComponent;
    let React;
    let onApplyFunc;
    let onRemoveFunc;

    beforeEach(() => {
        React = require('react');
        PromoCta = require('components/Reward/LoyaltyPromo/PromoCta').default;
        onApplyFunc = createSpy();
        onRemoveFunc = createSpy();
    });

    describe('render when not applied', () => {
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
                onApply: onApplyFunc,
                onRemove: onRemoveFunc
            };

            shallowComponent = enzyme.shallow(<PromoCta {...props} />);
        });

        it('should render a Button comp with the text Apply', () => {
            expect(shallowComponent.find('Button').prop('children')).toEqual('Apply');
        });

        it('should invoke a callback on Apply button click', () => {
            shallowComponent.find('Button').simulate('click');
            expect(onApplyFunc).toHaveBeenCalledTimes(1);
        });
    });

    describe('render when applied', () => {
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
                onApply: onApplyFunc,
                onRemove: onRemoveFunc
            };

            shallowComponent = enzyme.shallow(<PromoCta {...props} />);
        });

        it('should render a Remove CTA', () => {
            expect(shallowComponent.find('Link').prop('children')).toEqual('Remove');
        });

        it('should invoke a callback on Remove links click', () => {
            shallowComponent.find('Link').simulate('click');
            expect(onRemoveFunc).toHaveBeenCalledTimes(1);
        });
    });
});
