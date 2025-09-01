/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';
import { UploadDocumentsStepEditWrapped } from 'components/RichProfile/MyAccount/TaxClaim/Steps/UploadDocumentsStep/UploadDocumentsStep';
import { Button } from 'components/ui';
import { CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import uploadDocumentsUtils from 'utils/taxExemption/uploadDocumentsUtils.js';

describe('UploadDocumentsStepEdit', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            addWizardFormData: jasmine.createSpy(),
            handleUploadDocumentsChange: jasmine.createSpy(),
            handleFreightForwarderChange: jasmine.createSpy(),
            handleNextStepSpy: jasmine.createSpy(),
            nextStep: jasmine.createSpy(),
            taxClaimGetText: jasmine.createSpy().and.callFake(key => key),
            wizardFormData: {
                uploadDocuments: [],
                selectedFreightForwarderType: null,
                taxExemptionCategory: CategoryType.RESELLER
            },
            wizardFormErrors: {
                formErrors: {
                    invalidFile: null,
                    missingFreightForwarder: null
                }
            },
            documentLabel: 'documentsLabelForR'
        };

        wrapper = shallow(<UploadDocumentsStepEditWrapped {...props} />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('triggers file input when button is clicked', () => {
        const fileInputRef = { current: { click: jasmine.createSpy('click') } };
        wrapper.instance().fileInputRef = fileInputRef;

        wrapper.find(Button).at(0).simulate('click');
        expect(fileInputRef.current.click).toHaveBeenCalled();
    });

    it('calls handleFileChange on file input change', () => {
        const fileInputRef = { current: { value: '' } };
        wrapper.instance().fileInputRef = fileInputRef;

        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const event = { target: { files: [file] } };

        spyOn(uploadDocumentsUtils, 'validateFileChange').and.returnValue({ isValid: true, errors: null, newFiles: [file], newSize: 100 });
        spyOn(wrapper.instance(), 'updateStepDataWithErrors');

        wrapper.instance().handleFileChange(event);
        expect(uploadDocumentsUtils.validateFileChange).toHaveBeenCalled();
        expect(wrapper.instance().updateStepDataWithErrors).toHaveBeenCalled();
    });

    it('calls updateDocumentDescCode when freight forwarder type changes', () => {
        spyOn(wrapper.instance(), 'updateDocumentDescCode');
        // Call handleRadioChange with the appropriate arguments
        wrapper.instance().handleRadioChange('option')({ target: { value: 'newType' } });

        // Check if updateDocumentDescCode was called
        expect(wrapper.instance().updateDocumentDescCode).toHaveBeenCalledWith('newType');
    });
});
