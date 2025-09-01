import React from 'react';
import { shallow } from 'enzyme';
import component from 'components/RichProfile/MyAccount/TaxClaim/Steps/FinalReviewStep';

const { FinalReviewStepEditWrapped } = component;

describe('FinalReviewStepEdit', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            handleFinalStepCheckBoxChange: jasmine.createSpy(),
            submitTaxClaimForm: jasmine.createSpy(),
            taxClaimGetText: jasmine.createSpy().and.returnValue('submitAction'),
            wizardFormData: { isAgreed: false, consentCopy: 'consentCopy' },
            formErrors: { checkboxError: false }
        };
        wrapper = shallow(<FinalReviewStepEditWrapped {...props} />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    // it('renders Checkbox and Button components', () => {
    //     expect(wrapper.find('Checkbox').length).toBe(1);
    //     expect(wrapper.find('Button').length).toBe(1);
    // });

    it('calls handleFinalStepCheckBoxChange when checkbox value changes', () => {
        // Update wrapper to ensure it renders correctly
        wrapper = shallow(<FinalReviewStepEditWrapped {...props} />);
        const checkbox = wrapper.find('Checkbox');
        expect(checkbox.exists()).toBe(true);
        const newValue = true;
        checkbox.simulate('change', { target: { checked: newValue } });
        expect(props.handleFinalStepCheckBoxChange).toHaveBeenCalledWith(newValue);
    });

    // it('calls submitTaxClaimForm when the button is clicked', () => {
    //     // Update wrapper to ensure it renders correctly
    //     wrapper = shallow(<FinalReviewStepEditWrapped {...props} />);
    //     const button = wrapper.find('Button');
    //     expect(button.exists()).toBe(true);
    //     button.simulate('click');
    //     expect(props.submitTaxClaimForm).toHaveBeenCalled();
    // });

    // it('displays an error message if form is submitted without agreeing', async () => {
    //     props.formErrors.checkboxError = true;
    //     wrapper.setProps({ ...props });
    //     wrapper.update(); // Ensure component updates
    //     await wrapper.instance().submitForm();
    //     wrapper.update(); // Ensure component updates after form submission

    //     const errorText = wrapper.find('Text').filterWhere(node => node.text() === 'submitAction');
    //     expect(errorText.exists()).toBe(true);
    // });
});
