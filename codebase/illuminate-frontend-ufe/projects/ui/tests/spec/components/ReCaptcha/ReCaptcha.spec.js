// /* eslint-disable object-curly-newline */
// const React = require('react');
// const { createSpy } = jasmine;
// const { shallow, mount } = require('enzyme');

// describe('ReCaptcha component', () => {
//     let component;
//     let ReCaptcha;
//     let ReCaptchaUtil;

//     beforeEach(() => {
//         ReCaptcha = require('components/ReCaptcha/ReCaptcha').default;
//         ReCaptchaUtil = require('utils/ReCaptcha').default;
//     });

//     describe('rendering the ReCAPTCHA 3rd party component', () => {
//         beforeEach(() => {
//             Sephora.configurationSettings.captchaSiteKey = 'abc';
//         });

//         afterEach(() => {
//             Sephora.configurationSettings.captchaSiteKey = undefined;
//         });

//         it('should render the ReCAPTCHA component', () => {
//             // Act
//             component = mount(<ReCaptcha />);

//             // Assert
//             expect(component.find('ReCAPTCHA').at(0)).toBeDefined();
//         });

//         it('should not render ReCAPTCHA component if paused by cookie', () => {
//             // Act
//             spyOn(ReCaptchaUtil, 'isPaused').and.returnValue(true);
//             component = mount(<ReCaptcha />);

//             // Assert
//             expect(component.isEmptyRender()).toBeTruthy();
//         });

//         it('should render ReCAPTCHA component if not paused by cookie', () => {
//             // Act
//             spyOn(ReCaptchaUtil, 'isPaused').and.returnValue(false);
//             component = mount(<ReCaptcha />);

//             // Assert
//             expect(component.find('ReCAPTCHA').at(0)).toBeDefined();
//         });

//         it('should pass the sitekey to the ReCAPTCHA component', () => {
//             // Act
//             component = mount(<ReCaptcha />);

//             // Assert
//             expect(component.find('ReCAPTCHA').props().sitekey).toEqual('abc');
//         });
//     });

//     describe('when executing', () => {
//         let executeStub;

//         beforeEach(() => {
//             const wrapper = shallow(<ReCaptcha />);
//             component = wrapper.instance();
//             spyOn(component, 'initChallengerObserver');
//             executeStub = spyOn(ReCaptchaUtil, 'execute');
//             component.execute();
//         });

//         it('should init the challenger observer', () => {
//             expect(component.initChallengerObserver).toHaveBeenCalled();
//         });

//         it('should execute ReCAPTCHA component', () => {
//             expect(executeStub).toHaveBeenCalledWith(component.props.onChange);
//         });
//     });

//     describe('when resetting', () => {
//         let resetStub;

//         beforeEach(() => {
//             const wrapper = shallow(<ReCaptcha />);
//             component = wrapper.instance();
//             resetStub = spyOn(ReCaptchaUtil, 'reset');
//         });

//         it('should disconnect the challenger observer if it exists', () => {
//             component.challengerObserver = {
//                 disconnect: createSpy()
//             };
//             component.reset();
//             expect(component.challengerObserver.disconnect).toHaveBeenCalled();
//         });

//         it('should reset ReCAPTCHA component', () => {
//             component.reset();
//             expect(resetStub).toHaveBeenCalled();
//         });
//     });

//     describe('when unmounting', () => {
//         beforeEach(() => {
//             const wrapper = shallow(<ReCaptcha />);
//             component = wrapper.instance();
//         });

//         it('should disconnect the challenger observer if it exists', () => {
//             const stub = createSpy();

//             component.challengerObserver = {
//                 disconnect: stub
//             };
//             component.componentWillUnmount();
//             expect(stub).toHaveBeenCalled();
//         });

//         it('should nullify the challenger observer if it exists', () => {
//             component.challengerObserver = {
//                 disconnect: createSpy()
//             };
//             component.componentWillUnmount();
//             expect(component.challengerObserver).toEqual(null);
//         });
//     });

//     describe('when creating an observer', () => {
//         it('should create a MutationObserver if is available', () => {
//             const observer = component.createObserver(() => {});
//             expect(observer instanceof MutationObserver).toEqual(true);
//         });
//     });

//     describe('when initializing the challenger observer', () => {
//         let wrapper;

//         beforeEach(() => {
//             wrapper = shallow(<ReCaptcha />);
//             component = wrapper.instance();
//         });

//         it('should not do anything if the challenger observer was already initialized', () => {
//             component.challengerObserver = {
//                 observe: createSpy()
//             };

//             component.initChallengerObserver();

//             expect(component.challengerObserver.observe).not.toHaveBeenCalled();
//         });

//         it('should not do anything if the iframes are not from recaptcha', () => {
//             spyOn(document, 'getElementsByTagName').and.callFake(selector => {
//                 if (selector === 'iframe') {
//                     return [
//                         {
//                             src: ''
//                         }
//                     ];
//                 }

//                 return [];
//             });

//             component.initChallengerObserver();

//             expect(component.challengerObserver).toBe(null);
//         });

//         describe('for the first time, when opacity is 0', () => {
//             let challengerWindow;
//             let observeStub;

//             beforeEach(() => {
//                 const hideModal = createSpy('hideModal');
//                 const onChallengerDismiss = createSpy('onChallengerDismiss');
//                 wrapper.setProps({
//                     hideModal,
//                     onChallengerDismiss
//                 });

//                 challengerWindow = {
//                     style: {
//                         opacity: '0'
//                     }
//                 };

//                 spyOn(document, 'getElementsByTagName').and.callFake(selector => {
//                     if (selector === 'iframe') {
//                         return [
//                             {
//                                 src: 'https://google.com/recaptcha/api2/bframe',
//                                 parentNode: {
//                                     parentNode: challengerWindow
//                                 }
//                             }
//                         ];
//                     }

//                     return [];
//                 });

//                 observeStub = createSpy();

//                 spyOn(component, 'createObserver').and.callFake(callback => {
//                     return {
//                         callback,
//                         observe: observeStub
//                     };
//                 });

//                 component.initChallengerObserver();
//             });

//             it('should not call hideModal', () => {
//                 expect(component.props.hideModal).not.toHaveBeenCalled();
//             });

//             it('should observe the challenger window', () => {
//                 expect(observeStub).toHaveBeenCalledWith(challengerWindow, {
//                     attributes: true,
//                     attributeFilter: ['style']
//                 });
//             });

//             it('should call onChallengerDismiss on callback', () => {
//                 component.challengerObserver.callback();

//                 expect(component.props.onChallengerDismiss).toHaveBeenCalled();
//             });
//         });

//         describe('for the first time, when opacity is 0', () => {
//             let challengerWindow;
//             let observeStub;

//             beforeEach(() => {
//                 const hideModal = createSpy('hideModal');
//                 const onChallengerShow = createSpy('onChallengerShow');
//                 wrapper.setProps({
//                     hideModal,
//                     onChallengerShow
//                 });

//                 challengerWindow = {
//                     style: {
//                         opacity: '1'
//                     }
//                 };

//                 spyOn(document, 'getElementsByTagName').and.callFake(selector => {
//                     if (selector === 'iframe') {
//                         return [
//                             {
//                                 src: 'https://google.com/recaptcha/api2/bframe',
//                                 parentNode: {
//                                     parentNode: challengerWindow
//                                 }
//                             }
//                         ];
//                     }

//                     return [];
//                 });

//                 observeStub = createSpy();

//                 spyOn(component, 'createObserver').and.callFake(callback => {
//                     return {
//                         callback,
//                         observe: observeStub
//                     };
//                 });

//                 component.initChallengerObserver();
//             });

//             it('should call hideModal', () => {
//                 expect(component.props.hideModal).toHaveBeenCalledWith(true);
//             });

//             it('should observe the challenger window', () => {
//                 expect(observeStub).toHaveBeenCalledWith(challengerWindow, {
//                     attributes: true,
//                     attributeFilter: ['style']
//                 });
//             });

//             it('should call onChallengerShow on callback', () => {
//                 component.challengerObserver.callback();

//                 expect(component.props.onChallengerShow).toHaveBeenCalled();
//             });
//         });
//     });
// });
