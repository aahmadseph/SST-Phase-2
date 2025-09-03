import React from 'react';
import { shallow } from 'enzyme';
import TaxclaimErrorModal from 'components/GlobalModals/TaxClaim/TaxclaimErrorModal';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';

describe('TaxclaimErrorModal component', () => {
    let component;
    let props;

    beforeEach(() => {
        props = {
            errorType: TaxFormValidator.VALIDATION_CONSTANTS.DOCUMENT_NOT_UPLOADED,
            errorTypeLocaleMessage: 'Test Error Message',
            isOpen: true
            // Add other props as needed
        };

        component = shallow(<TaxclaimErrorModal {...props} />);
    });

    it('should render without crashing', () => {
        expect(component.exists()).toBe(true);
    });

    it('should determine the correct modal error header', () => {
        const modalHeader = component.instance().determineModalErrorHeader(props.errorType);
        expect(modalHeader).toBe('Submission Error');
    });

    it('should render the correct error message', () => {
        const errorMessage = component.find('Text').at(0);
        expect(errorMessage.props().children).toBe('Test Error Message');
    });

    it('should render the correct button text', () => {
        const button = component.find('Button');
        expect(button.props().children).toBe('Review');
    });
});
