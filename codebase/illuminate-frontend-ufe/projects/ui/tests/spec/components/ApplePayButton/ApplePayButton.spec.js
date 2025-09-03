const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('ApplePayButton component', () => {
    let ApplePay;
    let processEvent;
    let ApplePayButton;
    let onApplePayClickedStub;
    let processStub;
    let wrapper;
    let component;

    const event = {
        type: 'click',
        preventDefault: () => {},
        stopPropagation: () => {}
    };

    beforeEach(() => {
        ApplePay = require('services/ApplePay').default;
        processEvent = require('analytics/processEvent').default;
        ApplePayButton = require('components/ApplePayButton/ApplePayButton').default;
        onApplePayClickedStub = spyOn(ApplePay, 'onApplePayClicked');
        processStub = spyOn(processEvent, 'process');
        wrapper = shallow(<ApplePayButton />);
        component = wrapper.instance();
    });

    describe('onClick', () => {
        it('should follow normal pay flow', () => {
            component.onClick(event);
            expect(onApplePayClickedStub).toHaveBeenCalledWith(event);
        });

        it('should send analytics data if follows normal pay flow', () => {
            component.onClick(event);
            expect(processStub).toHaveBeenCalledWith('linkTrackingEvent', {
                data: {
                    linkName: 'checkout:payment:applepay',
                    actionInfo: 'checkout:payment:applepay',
                    eventStrings: ['event71']
                }
            });
        });
    });
});
