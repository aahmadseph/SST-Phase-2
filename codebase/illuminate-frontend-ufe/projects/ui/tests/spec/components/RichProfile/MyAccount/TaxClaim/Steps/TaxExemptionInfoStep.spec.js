import React from 'react';
import { shallow } from 'enzyme';
import Components from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep';
import { CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';

const { TaxExemptionInfoStepEditWrapped, TaxExemptionInfoStepViewWrapped } = Components;

describe('TaxExemptionInfoStepEdit', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            nextStep: jasmine.createSpy('nextStep'),
            userGeneralData: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            },
            taxClaimGetText: jasmine.createSpy('taxClaimGetText').and.callFake(key => key),
            selectedCategory: CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE,
            wizardFormData: {},
            wizardFormErrors: {},
            handleFirstNameChange: jasmine.createSpy('handleFirstNameChange'),
            handleLastNameChange: jasmine.createSpy('handleLastNameChange'),
            handleEmailChange: jasmine.createSpy('handleEmailChange'),
            handleInitialDateChange: jasmine.createSpy('handleInitialDateChange'),
            handleEndDateChange: jasmine.createSpy('handleEndDateChange'),
            updateStep4Data: jasmine.createSpy('updateStep4Data'),
            formErrors: {},
            clearErrors: jasmine.createSpy('clearErrors'),
            handleAddressChange: jasmine.createSpy('handleAddressChange'),
            handleAddressErrorsFromStepFour: jasmine.createSpy('handleAddressErrorsFromStepFour'),
            isFreightForwarderCert: jasmine.createSpy('isFreightForwarderCert').and.returnValue(false),
            handleFreightForwarderNameChange: jasmine.createSpy('handleFreightForwarderNameChange'),
            handleFreightCertNumberChange: jasmine.createSpy('handleFreightCertNumberChange'),
            freightName: '',
            freightCertNumber: ''
        };
        wrapper = shallow(<TaxExemptionInfoStepEditWrapped {...props} />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('calls handleFirstNameChange on componentDidMount with userGeneralData', () => {
        expect(props.handleFirstNameChange).toHaveBeenCalledWith('John');
        expect(props.handleLastNameChange).toHaveBeenCalledWith('Doe');
        expect(props.handleEmailChange).toHaveBeenCalledWith('john.doe@example.com');
    });

    it('renders TextInput for first name', () => {
        expect(wrapper.find('TextInput[name="firstName"]').props().value).toEqual('John');
    });

    it('renders TextInput for last name', () => {
        expect(wrapper.find('TextInput[name="lastName"]').props().value).toEqual('Doe');
    });

    it('renders TextInput for email', () => {
        expect(wrapper.find('TextInput[name="email"]').props().value).toEqual('john.doe@example.com');
    });

    // it('calls nextStep when next button is clicked', () => {
    //     wrapper.find('Button').simulate('click');
    //     expect(props.nextStep).toHaveBeenCalled();
    // });
});

describe('TaxExemptionInfoStepView', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            userGeneralData: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            },
            taxClaimGetText: jasmine.createSpy('taxClaimGetText').and.callFake(key => key),
            step4VariationData: {},
            selectedCategory: CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE,
            wizardFormData: {},
            isFreightForwarderCert: jasmine.createSpy('isFreightForwarderCert').and.returnValue(false)
        };
        wrapper = shallow(<TaxExemptionInfoStepViewWrapped {...props} />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    // it('displays user general data correctly', () => {
    //     expect(wrapper.find('span').at(1).text()).toEqual('John');
    //     expect(wrapper.find('span').at(3).text()).toEqual('Doe');
    //     expect(wrapper.find('span').at(5).text()).toEqual('john.doe@example.com');
    // });
});
