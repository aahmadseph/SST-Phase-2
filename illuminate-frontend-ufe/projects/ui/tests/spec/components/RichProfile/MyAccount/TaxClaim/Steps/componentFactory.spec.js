import React from 'react';
import { shallow } from 'enzyme';

// Mock components
const TaxExemptionCategoryStepViewWrapped = () => <div className='tax-exemption-category-view'>TaxExemptionCategoryStepViewWrapped</div>;
const TaxExemptionCategoryStepEditWrapped = () => <div className='tax-exemption-category-edit'>TaxExemptionCategoryStepEditWrapped</div>;
const UploadDocumentsStepViewWrapped = () => <div className='upload-documents-view'>UploadDocumentsStepViewWrapped</div>;

// Mock componentMap
const componentMap = {
    TaxExemptionCategoryStep: {
        view: TaxExemptionCategoryStepViewWrapped,
        edit: TaxExemptionCategoryStepEditWrapped
    },
    UploadDocumentsStep: {
        view: UploadDocumentsStepViewWrapped
    }
};

// Mock createComponent function
function createComponentMock(type, mode, props) {
    const Component = componentMap[type] ? componentMap[type][mode] : null;

    return Component ? <Component {...props} /> : null;
}

// Tests
describe('createComponent', () => {
    it('should return TaxExemptionCategoryStepViewWrapped component for TaxExemptionCategoryStep view mode', () => {
        const wrapper = shallow(createComponentMock('TaxExemptionCategoryStep', 'view', {}));
        expect(wrapper.find('div.tax-exemption-category-view').exists()).toBe(true);
    });

    it('should return TaxExemptionCategoryStepEditWrapped component for TaxExemptionCategoryStep edit mode', () => {
        const wrapper = shallow(createComponentMock('TaxExemptionCategoryStep', 'edit', {}));
        expect(wrapper.find('div.tax-exemption-category-edit').exists()).toBe(true);
    });

    it('should return UploadDocumentsStepViewWrapped component for UploadDocumentsStep view mode', () => {
        const wrapper = shallow(createComponentMock('UploadDocumentsStep', 'view', {}));
        expect(wrapper.find('div.upload-documents-view').exists()).toBe(true);
    });
});
