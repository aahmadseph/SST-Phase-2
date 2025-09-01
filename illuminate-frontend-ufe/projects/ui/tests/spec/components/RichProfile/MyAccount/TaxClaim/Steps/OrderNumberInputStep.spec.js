// import React from 'react';
// import { shallow } from 'enzyme';
// import components from 'components/RichProfile/MyAccount/TaxClaim/Steps/OrderNumberInputStep';
// import { Text } from 'components/ui';

// const { OrderNumberInputStepEditWrapped, OrderNumberInputStepViewWrapped } = components;

// describe('OrderNumberInputStepEdit', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             handleOrderNumberChange: jasmine.createSpy(),
//             clearOrderNumberError: jasmine.createSpy(),
//             nextStep: jasmine.createSpy(),
//             taxClaimGetText: jasmine.createSpy().and.returnValue('nextAction'),
//             wizardFormData: { orderNumber: '' },
//             wizardFormErrors: { formErrors: { orderNumberErrors: null, genericOrderNumberErrorExists: false } }
//         };
//         wrapper = shallow(<OrderNumberInputStepEditWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('calls nextStep when the button is clicked', () => {
//         wrapper.find('Button').simulate('click');
//         expect(props.nextStep).toHaveBeenCalled();
//     });
// });

// describe('OrderNumberInputStepView', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         props = {
//             wizardFormData: { orderNumber: '12345', orderDate: '2024-08-23' },
//             wizardFormErrors: { formErrors: { orderNumberErrors: null } },
//             taxClaimGetText: jasmine.createSpy().and.returnValue('dateColumnTitle')
//         };
//         wrapper = shallow(<OrderNumberInputStepViewWrapped {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('displays the order date and number', () => {
//         const texts = wrapper.find(Text);

//         // Log the text contents
//         const orderDateText = texts.findWhere(node => node.text() === props.wizardFormData.orderDate);
//         const orderNumberText = texts.findWhere(node => node.text() === props.wizardFormData.orderNumber);

//         // Check if text content is present
//         expect(orderDateText.exists()).toBe(true);
//         expect(orderNumberText.exists()).toBe(true);
//     });
// });
