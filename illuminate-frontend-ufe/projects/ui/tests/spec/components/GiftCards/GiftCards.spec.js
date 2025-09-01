// const React = require('react');
// const { createSpy } = jasmine;
// const { shallow } = require('enzyme');
// const GiftCards = require('components/GiftCards/GiftCards').default;

// describe('GiftCards component', () => {
//     let component;

//     beforeEach(() => {
//         component = shallow(<GiftCards />).instance();
//     });

//     describe('ReCaptcha', () => {
//         let executeCaptchaStub;
//         let resetRecaptchaStub;
//         let checkBalance;

//         beforeEach(() => {
//             executeCaptchaStub = createSpy('executeCaptchaStub');
//             resetRecaptchaStub = createSpy('resetRecaptchaStub');
//             checkBalance = spyOn(component, 'checkBalance');

//             component.reCaptcha = {
//                 execute: executeCaptchaStub,
//                 reset: resetRecaptchaStub
//             };
//         });

//         it('should execute the captcha', () => {
//             spyOn(component, 'validateForm').and.returnValue(false);
//             component.validateCaptchaAndCheckBalance();
//             expect(executeCaptchaStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call checkBalance once', () => {
//             spyOn(component, 'validateForm').and.returnValue(true);
//             component.validateCaptchaAndCheckBalance();
//             expect(checkBalance).toHaveBeenCalledTimes(1);
//         });

//         it('should pass the token to checkBalance method', () => {
//             component.onCaptchaTokenReady('token');
//             expect(checkBalance).toHaveBeenCalledWith('token');
//         });

//         it('should reset the reCaptcha if the token is invalid', () => {
//             component.onCaptchaTokenReady(undefined);
//             expect(resetRecaptchaStub).toHaveBeenCalledTimes(1);
//         });

//         it('if form contains validation errors OnSubmit, do not execute ReCaptcha', () => {
//             component.gcCardNumberInput = {
//                 validateErrorWithCode: function () {
//                     return 'CREDIT_CARD_NUMBER';
//                 }
//             };

//             component.validateCaptchaAndCheckBalance();
//             expect(executeCaptchaStub).not.toHaveBeenCalled();
//         });
//     });
// });
