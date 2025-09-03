// import React from 'react';
// import { shallow } from 'enzyme';
// import FormSubmittedStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/FormSubmittedStep';
// import localeUtils from 'utils/LanguageLocale';
// import { Box, Text } from 'components/ui';

// describe('FormSubmittedStep', () => {
//     let wrapper;
//     let getTextSpy;

//     beforeEach(() => {
//         // Mock the localeUtils.getLocaleResourceFile to return static text for testing
//         getTextSpy = jasmine.createSpy().and.callFake(key => {
//             const texts = {
//                 formSubmittedStepSubtitle: 'Form Submitted',
//                 formSubmittedStepCopy: 'Thank you for your submission!'
//             };

//             return texts[key] || key;
//         });

//         spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue(getTextSpy);

//         wrapper = shallow(<FormSubmittedStep />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('displays the correct subtitle text', () => {
//         const subtitleText = wrapper.find(Text).at(0);
//         expect(subtitleText.text()).toBe('Form Submitted');
//     });

//     it('displays the correct copy text', () => {
//         const copyText = wrapper.find(Text).at(1);
//         expect(copyText.text()).toBe('Thank you for your submission!');
//     });

//     it('renders the main Box component as a container', () => {
//         const box = wrapper.find(Box);
//         expect(box.exists()).toBe(true);
//     });

//     it('calls getText with correct keys', () => {
//         expect(getTextSpy).toHaveBeenCalledWith('formSubmittedStepSubtitle');
//         expect(getTextSpy).toHaveBeenCalledWith('formSubmittedStepCopy');
//     });
// });
