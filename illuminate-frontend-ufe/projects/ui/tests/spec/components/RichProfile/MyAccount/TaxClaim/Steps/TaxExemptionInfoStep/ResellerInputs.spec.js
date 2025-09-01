import React from 'react';
import { shallow } from 'enzyme';
import ResellerInputs from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/ResellerInputs';

describe('ResellerInputs', () => {
    let wrapper;
    const mockProps = {
        handleCCFirstNameChange: jasmine.createSpy(),
        handleCCLastNameChange: jasmine.createSpy(),
        updateStep4Data: jasmine.createSpy(),
        userGeneralData: {
            firstName: 'John',
            lastName: 'Doe'
        }
    };

    beforeEach(() => {
        wrapper = shallow(<ResellerInputs {...mockProps} />);
    });

    it('renders without crashing', () => {
        expect(wrapper).not.toBeNull();
    });

    it('updates firstName in state when handleFirstNameChange is called', () => {
        const event = { target: { value: 'Jane' } };
        wrapper.instance().handleFirstNameChange(event);
        expect(wrapper.state().firstName).toEqual('Jane');
    });

    it('updates lastName in state when handleLastNameChange is called', () => {
        const event = { target: { value: 'Smith' } };
        wrapper.instance().handleLastNameChange(event);
        expect(wrapper.state().lastName).toEqual('Smith');
    });
});
