// import React from 'react';
// import { shallow } from 'enzyme';
// import Components from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionCategoryStep';

// const { TaxExemptionCategoryStepEditWrapped, TaxExemptionCategoryStepViewWrapped } = Components;

// describe('TaxExemptionCategoryStepEdit', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             categoryTypes: [{ category: 'A' }, { category: 'B' }],
//             selectedCategory: 'A',
//             taxClaimGetText: jasmine.createSpy().and.callFake(key => key),
//             onCategoryChange: jasmine.createSpy(),
//             addWizardFormData: jasmine.createSpy(),
//             currentStep: 1,
//             wizardFormErrors: {},
//             nextStep: jasmine.createSpy()
//         };
//         wrapper = shallow(<TaxExemptionCategoryStepEditWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('displays the category titles correctly', () => {
//         const radioButtons = wrapper.find('Radio');
//         expect(radioButtons.length).toBe(2);
//         expect(radioButtons.at(0).find('Text').prop('children')).toBe('categoryTitleForA');
//         expect(radioButtons.at(1).find('Text').prop('children')).toBe('categoryTitleForB');
//     });

//     it('calls handleRadioChange when a radio button is selected', () => {
//         const radioButton = wrapper.find('Radio').at(1);
//         radioButton.simulate('change', { target: { value: 'B' } });
//         expect(props.onCategoryChange).toHaveBeenCalledWith('B');
//         expect(props.addWizardFormData).toHaveBeenCalledWith('B', jasmine.any(Object));
//     });

//     it('calls nextStep when the button is clicked', () => {
//         wrapper.find('Button').simulate('click');
//         expect(props.nextStep).toHaveBeenCalled();
//     });
// });

// describe('TaxExemptionCategoryStepView', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             selectedCategory: 'A',
//             taxClaimGetText: jasmine.createSpy().and.callFake(key => key)
//         };
//         wrapper = shallow(<TaxExemptionCategoryStepViewWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('displays the selected category title', () => {
//         const text = wrapper.find('Text');
//         expect(text.prop('children')).toBe('categoryTitleForA');
//     });
// });
