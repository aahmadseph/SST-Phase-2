const React = require('react');
const { shallow } = require('enzyme');

describe('<ReviewText /> component', () => {
    let ReviewText;
    let shallowComponent;

    beforeEach(() => {
        ReviewText = require('components/Checkout/Sections/Review/ReviewText').default;
    });

    describe('with isZeroOrder set as true', () => {
        it('should display No Shipping Address or Payment required if isShippable is false', () => {
            shallowComponent = shallow(
                <ReviewText
                    isZeroCheckout={true}
                    isShippableOrder={false}
                />
            );
            const reviewMessage =
                'No shipping address or payment is required for this order. ' + 'Please review your information before placing your order.';

            expect(shallowComponent.find('div').text()).toEqual(reviewMessage);
        });

        it('should display No Payment required if isShippable is true', () => {
            shallowComponent = shallow(
                <ReviewText
                    isZeroCheckout={true}
                    isShippableOrder={true}
                />
            );
            const reviewMessage = 'No payment is required for this order. ' + 'Please review your information before placing your order.';

            expect(shallowComponent.find('div').text()).toEqual(reviewMessage);
        });
    });

    describe('with isCanada set as true', () => {
        let localeUtils;
        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            spyOn(localeUtils, 'isCanada').and.returnValue(true);
            shallowComponent = shallow(<ReviewText />);
        });

        it('should display proper review message', () => {
            const reviewMessage = 'Please review your order information before placing your order.';
            expect(shallowComponent.find('Text').at(0).prop('children')).toEqual(reviewMessage);
        });

        describe('agreement links', () => {
            let agreementLinks;
            beforeEach(() => {
                agreementLinks = shallowComponent.find('Link');
            });

            it('should render three link as expected', () => {
                expect(agreementLinks.length).toEqual(3);
            });

            it('should has a Terms of Purchase link', () => {
                expect(agreementLinks.at(0).prop('children')).toEqual('Terms of Purchase');
            });

            it('should has a Terms of Use link', () => {
                expect(agreementLinks.at(1).prop('children')).toEqual('Terms of Use');
            });

            it('should has a Privacy Policy link', () => {
                expect(agreementLinks.at(2).prop('children')).toEqual('Privacy Policy.');
            });
        });
    });

    it('should display a proper  review message', () => {
        shallowComponent = shallow(<ReviewText />);
        const reviewMessage = 'Please review your order information before placing your order.';
        expect(shallowComponent.find('div').text()).toEqual(reviewMessage);
    });

    it('should display review message with data-at attribute', () => {
        shallowComponent = shallow(<ReviewText />);
        expect(shallowComponent.find('div[data-at="review_order_info_label"]').length).toEqual(1);
    });
});
