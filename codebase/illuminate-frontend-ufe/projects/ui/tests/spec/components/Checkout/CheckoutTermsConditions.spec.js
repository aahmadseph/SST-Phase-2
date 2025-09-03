const React = require('react');
const { shallow } = require('enzyme');
const localeUtils = require('utils/LanguageLocale').default;
const CheckoutTermsConditions = require('components/Checkout/CheckoutTermsConditions').default;

describe('<CheckoutTermsConditions /> component', () => {
    let shallowComponent;

    describe('with isCanada set as true', () => {
        beforeEach(() => {
            spyOn(localeUtils, 'isCanada').and.returnValue(true);
            shallowComponent = shallow(<CheckoutTermsConditions />);
        });

        it('should display proper review message', () => {
            const reviewMessage = 'Please review your order information before placing your order.';

            const ReviewTextElem = shallowComponent
                .findWhere(function (n) {
                    return n.name() === 'Text' && n.prop('is') === 'p';
                })
                .at(0)
                .children()
                .at(0);
            expect(ReviewTextElem.text()).toEqual(reviewMessage);
        });

        describe('agreement links', () => {
            let agreementLinks;

            beforeEach(() => {
                agreementLinks = shallowComponent.find('Link');
            });

            it('should render three link as expected', () => {
                expect(agreementLinks.length).toEqual(3);
            });

            it('should have a Terms of Purchase link', () => {
                expect(agreementLinks.at(0).prop('children')).toEqual('Terms of Purchase');
            });

            it('should have correct href link for Terms of Purchase', () => {
                expect(agreementLinks.at(0).prop('href')).toEqual('/terms-of-purchase');
            });

            it('should have a Terms of Use link', () => {
                expect(agreementLinks.at(1).prop('children')).toEqual('Terms of Use');
            });

            it('should have correct href link for Terms of Use', () => {
                expect(agreementLinks.at(1).prop('href')).toEqual('/terms-of-use');
            });

            it('should have a Privacy Policy link', () => {
                expect(agreementLinks.at(2).prop('children')).toEqual('Privacy Policy.');
            });

            it('should have correct href link for Privacy Policy', () => {
                expect(agreementLinks.at(2).prop('href')).toEqual('/privacy-policy');
            });
        });
    });
});
