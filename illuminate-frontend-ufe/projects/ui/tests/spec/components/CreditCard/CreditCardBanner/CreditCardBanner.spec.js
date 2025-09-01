/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');

describe('CreditCardBanner component', () => {
    const { objectContaining } = jasmine;
    let CreditCardBanner;
    let component;
    let wrapper;
    let store;
    let actions;
    let BCC;
    let Events;
    let onLastLoadEventStub;

    beforeEach(() => {
        CreditCardBanner = require('components/CreditCard/CreditCardBanner/CreditCardBanner').default;
        store = require('store/Store').default;
        actions = require('Actions').default;
        BCC = require('utils/BCC').default;
        Events = require('utils/framework/Events').default;

        wrapper = shallow(<CreditCardBanner globalModals={{}} />);
        onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
        component = wrapper.instance();
    });

    describe('componentDidMount method', () => {
        it('should watch for basket to react on updates', () => {
            // Arrange
            const setAndWatchStub = spyOn(store, 'setAndWatch');

            // Act
            component.componentDidMount();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalled();
        });

        it('should get the discount value and rerender the component with it', () => {
            // Arrange
            const basketStub = {
                basket: {
                    firstBuyOrderDiscount: '20%'
                }
            };
            const setAndWatchStub = spyOn(store, 'setAndWatch');
            const setStateStub = spyOn(component, 'setState');

            // Act
            component.componentDidMount();
            setAndWatchStub.calls.argsFor(0)[2](basketStub);

            // Assert
            expect(setStateStub).toHaveBeenCalledWith(
                objectContaining({
                    firstBuyDiscountTotal: '20%'
                })
            );
        });
    });

    describe('parseBccBannerData method', () => {
        let bannerDataStub;

        beforeEach(() => {
            bannerDataStub = {
                attributes: [
                    'CreditCardName=CreditCardValue',
                    'Message=Save {0} Message',
                    'Icon=href/value',
                    'TermsAndConditions=Terms and Conditions',
                    'CTAText=Button Text',
                    'CTADestination=/Button/Url'
                ]
            };
        });

        it('should convert BCC attributes to internal banner format', () => {
            component.state = {
                firstBuyDiscountTotal: '10%'
            };
            expect(component.parseBccBannerData(bannerDataStub)).toEqual({
                title: 'CreditCardValue',
                text: 'Save 10% Message',
                imagePath: 'href/value',
                tcText: 'Terms and Conditions',
                buttonText: 'Button Text',
                buttonUrl: '/Button/Url'
            });
        });

        it('should gracefully handle the empty data from BCC', () => {
            expect(component.parseBccBannerData(null)).toEqual(null);
        });
    });

    describe('openMediaModal method', () => {
        let dispatchStub;
        let showMediaModalStub;

        beforeEach(() => {
            Sephora.headerFooterContent = { globalModals: {} };
            dispatchStub = spyOn(store, 'dispatch');
            showMediaModalStub = spyOn(actions, 'showMediaModal').and.returnValue('showMediaModalStub');
            component.openMediaModal();
        });

        it('dispatch an action to show the modal', () => {
            expect(dispatchStub).toHaveBeenCalledWith('showMediaModalStub');
        });

        it('should show T&C modal', () => {
            expect(showMediaModalStub).toHaveBeenCalledWith({
                isOpen: true,
                mediaId: BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS
            });
        });
    });
});
