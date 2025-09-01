/* eslint-disable object-curly-newline */
const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');
const { PRESCREEN_USER_RESPONSES } = require('constants/CreditCard');
const store = require('Store').default;
const Actions = require('actions/Actions').default;
const CreditCardActions = require('actions/CreditCardActions').default;
const userActions = require('actions/UserActions').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const anaUtils = require('analytics/utils').default;
const CreditCardPrescreenModal = require('components/GlobalModals/CreditCardPrescreenModal/CreditCardPrescreenModal').default;

describe('CreditCardPrescreenModal component', () => {
    let dispatchStub;
    let showCreditCardPrescreenModalStub;
    let processStub;
    let getUserFullStub;

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        showCreditCardPrescreenModalStub = spyOn(Actions, 'showCreditCardPrescreenModal').and.returnValue('showCreditCardPrescreenModal');
        processStub = spyOn(processEvent, 'process');
        getUserFullStub = spyOn(userActions, 'getUserFull').and.returnValue('getUserFull');
    });

    it('when rendering modal should process analytics', () => {
        // Arrange
        const props = {
            content: {
                regions: { content: {} }
            }
        };

        // Act
        shallow(<CreditCardPrescreenModal {...props} />);

        // Assert
        expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: 'creditcard:bcc prescreen-banner:n/a:*',
                pageType: 'creditcard'
            }
        });
    });

    describe('when handling NO THANKS', () => {
        let captureRealtimePrescreenUserResponse;
        const mostRecentEvent = {
            eventInfo: {
                attributes: {
                    pageName: 'testPageName'
                }
            }
        };
        const props = {
            content: {
                regions: { content: {} }
            }
        };

        beforeEach(() => {
            const promiseChain = {
                catch: fn => {
                    fn();

                    return promiseChain;
                },
                finally: fn => fn()
            };

            spyOn(anaUtils, 'getMostRecentEvent').and.returnValue(mostRecentEvent);

            captureRealtimePrescreenUserResponse = spyOn(CreditCardActions, 'captureRealtimePrescreenUserResponse').and.returnValue(promiseChain);

            const wrapper = shallow(<CreditCardPrescreenModal {...props} />);
            const component = wrapper.instance();
            component.handleNoThanks();
        });

        it('should capture user response', () => {
            expect(captureRealtimePrescreenUserResponse).toHaveBeenCalledWith(PRESCREEN_USER_RESPONSES.DECLINED);
        });

        it('should call an action showCreditCardPrescreenModalStub', () => {
            expect(showCreditCardPrescreenModalStub).toHaveBeenCalledWith(false);
        });

        it('should dispatch an action to close modal', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should process analytics', () => {
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    pageName: 'creditcard:bcc prescreen-banner:n/a:*',
                    linkName: 'creditcard:bcc prescreen-banner:no thanks',
                    internalCampaign: 'creditcard:bcc prescreen-banner:no thanks'
                }
            });
        });
    });

    describe('when handling ACCEPT NOW', () => {
        let captureRealtimePrescreenUserResponse;
        const props = {
            content: {
                regions: { content: {} }
            }
        };

        beforeEach(() => {
            const promiseChain = {
                then: fn => {
                    fn();

                    return promiseChain;
                },
                catch: fn => {
                    fn();

                    return promiseChain;
                },
                finally: fn => fn()
            };

            captureRealtimePrescreenUserResponse = spyOn(CreditCardActions, 'captureRealtimePrescreenUserResponse').and.returnValue(promiseChain);

            const wrapper = shallow(<CreditCardPrescreenModal {...props} />);
            const component = wrapper.instance();
            component.handleAcceptNow();
        });

        it('should capture user response', () => {
            expect(captureRealtimePrescreenUserResponse).toHaveBeenCalledWith(PRESCREEN_USER_RESPONSES.ACCEPTED);
        });

        it('should dispatch getUserFull action', () => {
            expect(dispatchStub).toHaveBeenCalledWith('getUserFull');
        });

        it('should call getUserFull with callback to redirect user', () => {
            // Arrange
            const wrapper = shallow(<CreditCardPrescreenModal {...props} />);

            // Act
            wrapper.instance().handleAcceptNow();

            // Assert
            expect(getUserFullStub).toHaveBeenCalledWith(null, any(Function));
        });

        it('should call an action showCreditCardPrescreenModalStub', () => {
            expect(showCreditCardPrescreenModalStub).toHaveBeenCalledWith(false);
        });

        it('should dispatch an action to close modal', () => {
            expect(dispatchStub).toHaveBeenCalledWith('showCreditCardPrescreenModal');
        });
    });
});
