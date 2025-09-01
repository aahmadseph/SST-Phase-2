// import React from 'react';
// import { shallow } from 'enzyme';
// import components from 'components/RichProfile/MyAccount/TaxClaim/Steps/AdditionalCommentsStep';

// const { AdditionalCommentsStepEditWrapped, AdditionalCommentsStepViewWrapped } = components;

// describe('AdditionalCommentsStepEdit', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             handleAdditionalCommentsChange: jasmine.createSpy('handleAdditionalCommentsChange'),
//             nextStep: jasmine.createSpy('nextStep'),
//             taxClaimGetText: jasmine.createSpy('taxClaimGetText'),
//             additionalComments: '',
//             formErrors: { additionalCommentsErrors: [] }
//         };
//         wrapper = shallow(<AdditionalCommentsStepEditWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('calls handleAdditionalCommentsChange when textarea changes', () => {
//         // eslint-disable-next-line no-console
//         console.log(wrapper.debug());
//         wrapper.dive().find('Textarea').simulate('change', { target: { value: 'test' } });
//         expect(props.handleAdditionalCommentsChange).toHaveBeenCalledWith('test');
//     });

//     it('calls nextStep when next button is clicked', () => {
//         wrapper.find('Button').simulate('click');
//         expect(props.nextStep).toHaveBeenCalled();
//     });
// });

// describe('AdditionalCommentsStepView', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             taxClaimGetText: jasmine.createSpy('taxClaimGetText'),
//             additionalComments: 'test comment'
//         };
//         wrapper = shallow(<AdditionalCommentsStepViewWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('displays additional comments', () => {
//         expect(wrapper.find('Text').at(1).text()).toEqual(props.additionalComments);
//     });
// });
