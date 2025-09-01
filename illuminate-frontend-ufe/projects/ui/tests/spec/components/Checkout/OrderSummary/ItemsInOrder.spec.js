// const React = require('react');
// const { shallow } = require('enzyme');
// const ItemsInOrder = require('components/Checkout/OrderSummary/ItemsInOrder/ItemsInOrder').default;

// describe('ItemsinOrder', () => {
//     let component;
//     let wrapper;
//     let warningArr;
//     let messageContext;
//     let testedVal;

//     beforeEach(() => {
//         wrapper = shallow(<ItemsInOrder />);
//         component = wrapper.instance();
//     });

//     it('should return null if passed warningArr is not an array', () => {
//         messageContext = 'someText';
//         warningArr = {};

//         testedVal = component.getWarningTextByContext(warningArr, messageContext);
//         expect(testedVal).toEqual(null);
//     });

//     it(`should return null if passed warningArr does not have elements with prop
//         messageContext equal to messageContext val`, () => {
//         messageContext = 'someText';
//         warningArr = [
//             {
//                 messageContext: 'anotherText',
//                 messages: ['a', 'b', 'c']
//             }
//         ];

//         testedVal = component.getWarningTextByContext(warningArr, messageContext);
//         expect(testedVal).toEqual(null);
//     });

//     it(`should return joined messages if object has an element with
//         messageContext`, () => {
//         messageContext = 'someText';
//         warningArr = [
//             {
//                 messageContext: messageContext,
//                 messages: ['a', 'b', 'c']
//             }
//         ];

//         testedVal = component.getWarningTextByContext(warningArr, messageContext);
//         expect(testedVal).toEqual('a b c');
//     });

//     it(`should return joined messages if object has an element with
//     messageContext of the first element from filtered warnings`, () => {
//         messageContext = 'someText';
//         warningArr = [
//             {
//                 messageContext: messageContext,
//                 messages: ['a', 'b', 'c']
//             },
//             {
//                 messageContext: messageContext,
//                 messages: ['c', 'd', 'e']
//             }
//         ];

//         testedVal = component.getWarningTextByContext(warningArr, messageContext);
//         expect(testedVal).toEqual('a b c');
//     });

//     it(`should return joined messages if object has an element with
//     messageContext of the first element from filtered warnings`, () => {
//         messageContext = 'someText';
//         warningArr = [
//             {
//                 messageContext: 'anotherText',
//                 messages: ['a', 'b', 'c']
//             },
//             {
//                 messageContext: messageContext,
//                 messages: ['z', 'x', 'y']
//             },
//             {
//                 messageContext: 'totallyAnotherText',
//                 messages: ['c', 'd', 'e']
//             }
//         ];

//         testedVal = component.getWarningTextByContext(warningArr, messageContext);
//         expect(testedVal).toEqual('z x y');
//     });
// });
