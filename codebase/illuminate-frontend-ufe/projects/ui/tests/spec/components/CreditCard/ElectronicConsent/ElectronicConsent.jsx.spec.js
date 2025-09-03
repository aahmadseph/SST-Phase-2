const React = require('react');
const { mount } = require('enzyme');
const { createSpy } = jasmine;

describe('ElectronicConsent component', () => {
    let ElectronicConsent;
    let Checkbox;
    let wrapper;

    beforeEach(() => {
        ElectronicConsent = require('components/CreditCard/ApplyFlow/ElectronicConsent/ElectronicConsent').default;
        Checkbox = require('components/Inputs/Checkbox/Checkbox').default;
    });

    it('has a checkbox input inside', () => {
        wrapper = mount(<ElectronicConsent checked='testVal' />);

        expect(wrapper.find(Checkbox)).toBeTruthy();
    });

    it('allows us to set checked property', () => {
        wrapper = mount(<ElectronicConsent checked='testVal' />);

        expect(wrapper.props().checked).toEqual('testVal');
    });

    it('allows us to set updateConsentStatus property', () => {
        wrapper = mount(<ElectronicConsent updateConsentStatus='testVal' />);

        expect(wrapper.props().updateConsentStatus).toEqual('testVal');
    });

    xit('calls passed callback function on click event', () => {
        const updateConsentStatusStub = createSpy('updateConsentStatusStub');
        wrapper = mount(<ElectronicConsent updateConsentStatus={updateConsentStatusStub} />);

        wrapper.find('input').simulate('click');
        expect(updateConsentStatusStub).toHaveBeenCalled();
    });
});
