/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any, createSpy, objectContaining } = jasmine;

const { UserInfoReady, PostLoad } = require('constants/events');

describe('ApplyFlowMain component', () => {
    let userUtils;
    let urlUtils;
    let helperUtils;
    let errorsUtils;
    let UI;
    let MEDIA_IDS;
    let processEvent;
    let anaConsts;
    let linkTrackingError;
    let profileApi;
    let cmsApi;
    let store;
    let actions;
    let ApplyFlowMain;
    let component;
    let wrapper;
    let isSignedIn;
    let isSignedInStub;
    let dispatchStub;
    let CreditCardActions;
    let apiUtils;
    let anaUtils;
    let scrollToStub;

    beforeEach(() => {
        ApplyFlowMain = require('components/CreditCard/ApplyFlow/ApplyFlowMain').default;
        userUtils = require('utils/User').default;
        apiUtils = require('utils/Api').default;
        urlUtils = require('utils/Url').default;
        helperUtils = require('utils/Helpers').default;
        errorsUtils = require('utils/Errors').default;
        UI = require('utils/UI').default;
        MEDIA_IDS = require('constants/CreditCard').MEDIA_IDS;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        linkTrackingError = require('analytics/bindings/pages/all/linkTrackingError').default;
        profileApi = require('services/api/profile').default;
        cmsApi = require('services/api/cms').default;
        anaUtils = require('analytics/utils').default;
        actions = require('Actions').default;
        store = require('Store').default;
        CreditCardActions = require('actions/CreditCardActions').default;

        spyOn(urlUtils, 'redirectTo');
        scrollToStub = spyOn(helperUtils, 'scrollTo');
        dispatchStub = spyOn(store, 'dispatch');
        wrapper = shallow(<ApplyFlowMain />);
        component = wrapper.instance();
    });

    describe('ctrlr', () => {
        let Events;
        let onLastLoadEvent;
        let onLastLoadEventStub;
        let LoadScripts;
        let loadScriptsStub;
        let prefillDataOrRegisterBIStub;

        beforeEach(() => {
            spyOn(component, 'prefillUserData');
            prefillDataOrRegisterBIStub = spyOn(component, 'prefillDataOrRegisterBI');

            Events = Sephora.Util;
            onLastLoadEvent = Events.onLastLoadEvent;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');

            LoadScripts = require('utils/LoadScripts').default;
            loadScriptsStub = spyOn(LoadScripts, 'loadScripts');

            isSignedIn = userUtils.isSignedIn;
            isSignedInStub = spyOn(userUtils, 'isSignedIn');

            Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
            Sephora.fantasticPlasticConfigurations.isLandingPageEnabled = true;

            component.componentDidMount();
        });

        it('should call onLastLoadEvent twice and called with correct args', () => {
            // Arrange
            Events.onLastLoadEvent = onLastLoadEvent;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');

            // Act
            component.componentDidMount();

            // Assert
            expect(onLastLoadEventStub).toHaveBeenCalledTimes(2);
            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [UserInfoReady], any(Function));
            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [PostLoad], any(Function));
        });

        it('should check if user is signed in, if not dispatch sign in modal', () => {
            // Arrange
            userUtils.isSignedIn = isSignedIn;
            isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(false);
            Events.onLastLoadEvent = onLastLoadEvent;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
            const showSignInWithMessagingModal = spyOn(actions, 'showSignInWithMessagingModal').and.returnValue('showSignInWithMessagingModal');

            // Act
            wrapper = shallow(<ApplyFlowMain />);
            component = wrapper.instance();

            component.componentDidMount();
            onLastLoadEventStub.calls.first().args[2]();

            // Assert
            expect(isSignedInStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('showSignInWithMessagingModal');
            expect(showSignInWithMessagingModal).toHaveBeenCalledWith({
                isOpen: true,
                callback: any(Function),
                errback: any(Function),
                isCreditCardApply: true
            });
        });

        it('should check if user is signed in, if user is, call prefillDataOrRegisterBI', () => {
            isSignedInStub.and.returnValue(true);
            onLastLoadEventStub.calls.first().args[2]();

            expect(isSignedInStub).toHaveBeenCalledTimes(1);
            expect(prefillDataOrRegisterBIStub).toHaveBeenCalledTimes(1);
        });

        it('should set window variables and load lovation script', () => {
            onLastLoadEventStub.calls.argsFor(1)[2]();

            expect(window['io_install_flash']).toEqual(false);
            expect(window['io_install_stm']).toEqual(false);
            expect(typeof window['io_bb_callback']).toEqual('function');
            expect(window['io_enable_rip']).toEqual(false);

            expect(loadScriptsStub).toHaveBeenCalledTimes(1);
            expect(loadScriptsStub).toHaveBeenCalledWith(['//ci-mpsnare.iovation.com/snare.js']);
        });
    });

    describe('prefillDataOrRegisterBI', () => {
        let isBIStub;
        let showBiRegisterModalStub;
        let prefillUserDataStub;
        let subscribeStub;
        let getStateStub;

        beforeEach(() => {
            isBIStub = spyOn(userUtils, 'isBI');
            showBiRegisterModalStub = spyOn(actions, 'showBiRegisterModal').and.callFake(({ callback }) => callback && callback());
            prefillUserDataStub = spyOn(component, 'prefillUserData');

            subscribeStub = spyOn(store, 'subscribe').and.returnValue(() => {});
            getStateStub = spyOn(store, 'getState');
        });

        it('should fill user data if BI user is ready', () => {
            isBIStub.and.returnValue(true);
            component.prefillDataOrRegisterBI();
            expect(prefillUserDataStub).toHaveBeenCalledTimes(1);
        });

        it('should show BI modal if user is not BI', () => {
            isBIStub.and.returnValue(false);
            component.prefillDataOrRegisterBI();
            expect(showBiRegisterModalStub).toHaveBeenCalledTimes(1);
        });

        it('should dispatch an action to show the modal', () => {
            isBIStub.and.returnValue(false);
            component.prefillDataOrRegisterBI();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should subscribe to the store', () => {
            isBIStub.and.returnValue(false);
            component.prefillDataOrRegisterBI();
            expect(subscribeStub).toHaveBeenCalled();
        });

        it('should call prefillUserData when bi info updates', () => {
            isBIStub.and.returnValue(false);
            component.prefillDataOrRegisterBI();
            getStateStub.and.returnValue({
                user: {
                    beautyInsiderAccount: {
                        newBIData: 'newBIData'
                    }
                }
            });
            subscribeStub.calls.first().args[0]();
            expect(prefillUserDataStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserDataFromProfile', () => {
        let getBiAccountInfo;
        let getUserPhoneNumber;

        beforeEach(() => {
            getBiAccountInfo = spyOn(userUtils, 'getBiAccountInfo');
            getUserPhoneNumber = spyOn(userUtils, 'getUserPhoneNumber');
        });

        it('fills address name from biAccountInfo object', () => {
            getBiAccountInfo.and.returnValue({
                firstName: 'john',
                lastName: 'doe'
            });
            const result = component.getUserDataFromProfile();
            expect(result.address).toEqual(
                objectContaining({
                    firstName: 'john',
                    lastName: 'doe'
                })
            );
        });

        it('fills birthday from biAccountInfo object', () => {
            getBiAccountInfo.and.returnValue({
                birthMonth: 11,
                birthDay: 12,
                birthYear: 2013
            });
            const result = component.getUserDataFromProfile();
            expect(result.birthday).toEqual(
                objectContaining({
                    bMon: 11,
                    bDay: 12,
                    bYear: 2013
                })
            );
        });

        it('fills birthday from biAccountInfo object, leaving birthday empty', () => {
            getBiAccountInfo.and.returnValue({
                birthMonth: 11,
                birthDay: 12,
                birthYear: 1804
            });
            const result = component.getUserDataFromProfile();
            expect(result.birthday).toEqual(
                objectContaining({
                    bMon: 11,
                    bDay: 12,
                    bYear: ''
                })
            );
        });

        it('fills email from biAccountInfo object', () => {
            getBiAccountInfo.and.returnValue({
                email: 'some@email.com'
            });
            const result = component.getUserDataFromProfile();
            expect(result.email).toEqual('some@email.com');
        });

        it('fills phone from userPhoneNumber', () => {
            getBiAccountInfo.and.returnValue({});
            getUserPhoneNumber.and.returnValue('phone number string');
            const result = component.getUserDataFromProfile();
            expect(result.phone).toEqual('phone number string');
        });

        it('fills true as isUserReady parameter', () => {
            getBiAccountInfo.and.returnValue({});
            const result = component.getUserDataFromProfile();
            expect(result.isUserReady).toEqual(true);
        });
    });

    describe('prefillUserData', () => {
        let getUserDataFromProfileStub;
        let isPreApprovedForCreditCardStub;
        let prefillUserDataFromPrescreenDetailsStub;
        let prefillUserDataFromCreditCardsStub;

        beforeEach(() => {
            getUserDataFromProfileStub = spyOn(component, 'getUserDataFromProfile');
            isPreApprovedForCreditCardStub = spyOn(userUtils, 'isPreApprovedForCreditCard');

            prefillUserDataFromPrescreenDetailsStub = spyOn(component, 'prefillUserDataFromPrescreenDetails');
            prefillUserDataFromCreditCardsStub = spyOn(component, 'prefillUserDataFromCreditCards');
        });

        it('calls prefillUserDataFromPrescreenDetails() if isPreApprovedForCreditCard() returns true', () => {
            getUserDataFromProfileStub.and.returnValue('some data string');
            isPreApprovedForCreditCardStub.and.returnValue(true);

            component.prefillUserData();
            expect(prefillUserDataFromPrescreenDetailsStub).toHaveBeenCalledWith('some data string');
        });

        it('calls prefillUserDataFromPrescreenDetails() if isPreApprovedForCreditCard() returns false', () => {
            getUserDataFromProfileStub.and.returnValue('some data string');
            isPreApprovedForCreditCardStub.and.returnValue(false);

            component.prefillUserData();
            expect(prefillUserDataFromCreditCardsStub).toHaveBeenCalledWith('some data string');
        });
    });

    describe('showPreapprovedBanner', () => {
        let isPrivateLabel;
        let isCoBranded;
        let getMediaContentStub;
        let fakePromise;

        beforeEach(() => {
            fakePromise = {
                then: resolve => {
                    resolve({});

                    return fakePromise;
                },
                catch: () => {
                    return fakePromise;
                }
            };
            getMediaContentStub = spyOn(cmsApi, 'getMediaContent').and.returnValue(fakePromise);
        });

        describe('when isPrivateLabel', () => {
            beforeEach(() => {
                isPrivateLabel = true;
                isCoBranded = false;
            });

            it('should call getMediaContent with PRIVATE_LABEL mediaId', () => {
                component.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                expect(getMediaContentStub).toHaveBeenCalledWith(MEDIA_IDS.PRIVATE_LABEL);
            });
        });

        describe('when isCoBranded', () => {
            beforeEach(() => {
                isPrivateLabel = false;
                isCoBranded = true;
            });

            it('should call getMediaContent with CO_BRANDED mediaId', () => {
                component.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                expect(getMediaContentStub).toHaveBeenCalledWith(MEDIA_IDS.CO_BRANDED);
            });
        });

        describe('when no card', () => {
            beforeEach(() => {
                isPrivateLabel = false;
                isCoBranded = false;
            });

            it('should call getMediaContent with NO_CARD mediaId', () => {
                component.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                expect(getMediaContentStub).toHaveBeenCalledWith(MEDIA_IDS.NO_CARD);
            });
        });
    });

    describe('redirectToMarketing', () => {
        it('should redirect to /creditcard', () => {
            component.redirectToMarketing();
            expect(urlUtils.redirectTo).toHaveBeenCalledWith('/creditcard');
        });
    });

    describe('submitButtonClick', () => {
        let e;
        let fireResultPageAnalyticsStub;
        let setStateStub;
        let scrollToTopStub;
        let CreditCardActionsStub;

        beforeEach(() => {
            e = {
                preventDefault: createSpy('preventDefault')
            };
            spyOn(anaUtils, 'fireEventForTagManager');
            spyOn(component, 'validFormInput').and.returnValue(true);
            spyOn(component, 'getRequestObject').and.returnValue({});
            fireResultPageAnalyticsStub = spyOn(component, 'fireResultPageAnalytics');
            setStateStub = spyOn(component, 'setState');
            scrollToTopStub = spyOn(UI, 'scrollToTop');
            CreditCardActionsStub = spyOn(CreditCardActions, 'getCreditCardTargeters');
        });

        it('should call e.preventDefault', () => {
            component.submitButtonClick(e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        describe('when applySephoraCreditCard resolves', () => {
            let processStub;

            beforeEach(() => {
                const fakePromise = {
                    then: resolve => {
                        resolve({});

                        return fakePromise;
                    },
                    catch: () => {
                        return fakePromise;
                    }
                };
                spyOn(profileApi, 'applySephoraCreditCard').and.returnValue(fakePromise);
                processStub = spyOn(processEvent, 'process');
                component.submitButtonClick(e);
            });

            it('should call setStateStub', () => {
                expect(setStateStub).toHaveBeenCalled();
            });

            it('should call scrollToTop', () => {
                expect(scrollToTopStub).toHaveBeenCalled();
            });

            it('should call the submit application event', () => {
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.SC_CREDIT_CARD_SUBMIT],
                        linkName: 'creditcard:submit application',
                        actionInfo: 'creditcard:submit application',
                        pageDetail: anaConsts.PAGE_NAMES.CREDIT_CARD_APPLICATION_START
                    }
                });
            });

            it('should call fireResultPageAnalytics', () => {
                expect(fireResultPageAnalyticsStub).toHaveBeenCalled();
            });

            it('should call action getCreditCardTargeters', () => {
                expect(CreditCardActionsStub).toHaveBeenCalled();
            });
        });

        describe('when applySephoraCreditCard fails', () => {
            beforeEach(() => {
                const fakePromise = {
                    then: resolve => {
                        resolve({});

                        return fakePromise;
                    },
                    catch: () => {
                        return fakePromise;
                    }
                };
                spyOn(profileApi, 'applySephoraCreditCard').and.returnValue(fakePromise);
                component.submitButtonClick(e);
            });

            it('should call setStateStub', () => {
                expect(setStateStub).toHaveBeenCalled();
            });

            it('should call scrollToTop', () => {
                expect(scrollToTopStub).toHaveBeenCalled();
            });

            it('should call fireResultPageAnalytics', () => {
                expect(fireResultPageAnalyticsStub).toHaveBeenCalled();
            });

            it('should call action getCreditCardTargeters', () => {
                expect(CreditCardActionsStub).toHaveBeenCalled();
            });
        });
    });

    describe('validFormInput', () => {
        describe('when personalInformationForm and secureInformationForm are valid', () => {
            beforeEach(() => {
                component.personalInformationForm = {
                    validateForm: createSpy('validateForm').and.returnValue(true)
                };
                component.secureInformationForm = {
                    validateForm: createSpy('validateForm').and.returnValue(true)
                };
            });

            it('should return true', () => {
                expect(component.validFormInput()).toBe(true);
            });
        });

        describe('when personalInformationForm or secureInformationForm are not valid', () => {
            let triggerErrorTrackingStub;

            beforeEach(() => {
                component.personalInformationForm = {
                    validateForm: createSpy('validateForm').and.returnValue(false)
                };
                component.secureInformationForm = {
                    validateForm: createSpy('validateForm').and.returnValue(true)
                };

                spyOn(errorsUtils, 'clearErrors');
                triggerErrorTrackingStub = spyOn(component, 'triggerErrorTracking');
                const formErrors = {
                    errors: {
                        FIELD: {
                            MOBILE_NUMBER: {
                                level: 'FIELD',
                                message: 'One phone number required. Please enter a phone number.'
                            },
                            ZIP_CODE: {
                                level: 'FIELD',
                                message: 'ZIP Code Required. Please enter a 5 digit ZIP code.'
                            }
                        }
                    }
                };
                spyOn(store, 'getState').and.returnValue(formErrors);

                component.validFormInput();
            });

            it('should call triggerErrorTracking with formErrors', () => {
                expect(triggerErrorTrackingStub).toHaveBeenCalled();
            });

            it('should scroll to the form if errors presented', () => {
                expect(scrollToStub).toHaveBeenCalledWith(component.personalInformationForm);
            });

            it('should return false', () => {
                expect(component.validFormInput()).toBe(false);
            });
        });
    });

    describe('getRequestObject', () => {
        let obj;
        let personalInfo;
        let secureInfo;
        let isPreApprovedForCreditCardStub;

        beforeEach(() => {
            personalInfo = {
                firstName: 'firstName',
                lastName: 'lastName',
                mobilePhone: '555-555-5555',
                alternatePhone: '666-666-6666',
                email: 'email',
                address: 'address'
            };
            secureInfo = {
                socialSecurity: '1234',
                annualIncome: '111111',
                birthday: '11/29/1994'
            };
            component.state = {
                deviceData: 'deviceData',
                cardType: 'cardType',
                preScreenID: 'preScreenID'
            };
            component.personalInformationForm = {
                getData: createSpy('getData').and.returnValue(personalInfo)
            };
            component.secureInformationForm = {
                getData: createSpy('getData').and.returnValue(secureInfo)
            };
            isPreApprovedForCreditCardStub = spyOn(userUtils, 'isPreApprovedForCreditCard');
        });

        it('should return this object for a non-preapproved user', () => {
            isPreApprovedForCreditCardStub.and.returnValue(false);
            obj = component.getRequestObject();

            expect(obj).toEqual({
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                phoneNumber: personalInfo.mobilePhone,
                alternatePhoneNumber: personalInfo.alternatePhone,
                email: personalInfo.email,
                address: personalInfo.address,
                birthdate: secureInfo.birthday,
                ssn: secureInfo.socialSecurity,
                incomeAmount: secureInfo.annualIncome,
                iovation: { blackBox: component.state.deviceData }
            });
        });

        it('should return additional information for preapproved user', () => {
            isPreApprovedForCreditCardStub.and.returnValue(true);
            obj = component.getRequestObject();

            expect(obj).toEqual(
                objectContaining({
                    cardType: component.state.cardType,
                    preScreenID: component.state.preScreenID
                })
            );
        });
    });

    describe('getSuccessResponseState', () => {
        let APPROVAL_STATUS;
        let responseObj;
        let stateObj;

        beforeEach(() => {
            spyOn(apiUtils, 'handleApiResponseMappingError');
            APPROVAL_STATUS = {
                APPROVED: 'APPROVED',
                IN_PROGRESS: 'IN_PROGRESS',
                OTHER: 'OTHER'
            };
        });

        it('assign name as APPROVED in state object if status is APPROVED', () => {
            responseObj = {
                status: APPROVAL_STATUS.APPROVED
            };
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.applicationStatus.name).toEqual(APPROVAL_STATUS.APPROVED);
        });

        it('assign name as IN_PROGRESS in state object if status is not APPROVED', () => {
            responseObj = {
                status: APPROVAL_STATUS.OTHER
            };
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.applicationStatus.name).toEqual(APPROVAL_STATUS.IN_PROGRESS);
        });

        it('assign showResponsePage true', () => {
            responseObj = {};
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.showResponsePage).toEqual(true);
        });

        it('map response to state.applicationStatus for APPROVED status', () => {
            responseObj = {
                status: APPROVAL_STATUS.APPROVED,
                cardType: 'cardType',
                creditLimit: 'creditLimit',
                icon: 'icon',
                statusTitle: 'statusTitle',
                statusDescription: 'statusDescription',
                tempCardMessage: 'tempCardMessage',
                aprMessage: 'aprMessage',
                aprDetailsMessage: 'aprDetailsMessage',
                bureauAddress: 'bureauAddress',
                bureauCreditScore: 'bureauCreditScore',
                bureauRejectReasons: 'bureauRejectReasons',
                discountMessage: 'discountMessage',
                defaultCardMessage: 'defaultCardMessage'
            };
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.applicationStatus).toEqual(
                objectContaining({
                    name: APPROVAL_STATUS.APPROVED,
                    cardType: 'cardType',
                    creditLimit: 'creditLimit',
                    icon: 'icon',
                    title: 'statusTitle',
                    description: 'statusDescription',
                    tempCardMessage: 'tempCardMessage',
                    aprMessage: 'aprMessage',
                    aprDetailsMessage: 'aprDetailsMessage',
                    bureauAddress: 'bureauAddress',
                    bureauCreditScore: 'bureauCreditScore',
                    bureauRejectReasons: 'bureauRejectReasons',
                    discountMessage: 'discountMessage',
                    defaultCardMessage: 'defaultCardMessage'
                })
            );
        });

        it('map response to state.applicationStatus for IN_PROGRESS status', () => {
            responseObj = {
                status: APPROVAL_STATUS.OTHER,
                pageHeader: 'pageHeader',
                statusTitle: 'statusTitle',
                icon: 'icon',
                statusDescription: 'statusDescription'
            };
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.applicationStatus).toEqual(
                objectContaining({
                    name: APPROVAL_STATUS.IN_PROGRESS,
                    pageHeader: 'pageHeader',
                    title: 'statusTitle',
                    icon: 'icon',
                    description: 'statusDescription'
                })
            );
        });
    });

    describe('getErrorResponseState', () => {
        let stateObj;
        let responseObj;
        let APPROVAL_STATUS;

        beforeEach(() => {
            APPROVAL_STATUS = {
                ERROR: 'ERROR'
            };
        });

        it('assign showResponsePage true', () => {
            responseObj = {};
            stateObj = component.getSuccessResponseState(responseObj);

            expect(stateObj.showResponsePage).toEqual(true);
        });

        it('map response to state.applicationStatus for ERROR status', () => {
            responseObj = {
                errorCode: 'errorCode',
                pageHeader: 'pageHeader',
                statusTitle: 'statusTitle',
                icon: 'icon',
                statusDescription: 'statusDescription'
            };

            stateObj = component.getErrorResponseState(responseObj);
            expect(stateObj.applicationStatus).toEqual(
                objectContaining({
                    name: APPROVAL_STATUS.ERROR,
                    code: 'errorCode',
                    pageHeader: 'pageHeader',
                    title: 'statusTitle',
                    icon: 'icon',
                    description: 'statusDescription'
                })
            );
        });
    });

    describe('fireResultPageAnalytics', () => {
        let APPROVAL_STATUS;
        let processStub;
        let responseObj;

        beforeEach(() => {
            APPROVAL_STATUS = {
                APPROVED: 'APPROVED',
                IN_PROGRESS: 'IN_PROGRESS',
                DECLINED: 'DECLINED'
            };
            processStub = spyOn(processEvent, 'process');
            digitalData.page.attributes.sephoraPageInfo.pageName = 'creditcard:test1';
        });

        it('should call processStub with correct data for approved status', () => {
            responseObj = {
                status: APPROVAL_STATUS.APPROVED,
                cardType: 'PRIVATE_LABEL'
            };
            component.fireResultPageAnalytics(responseObj);

            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    eventStrings: [anaConsts.Event.SC_CREDIT_CARD_APPROVED],
                    pageName: 'creditcard:application-approved' + ':n/a:*',
                    pageDetail: 'application-approved',
                    pageType: anaConsts.PAGE_TYPES.CREDIT_CARD,
                    creditCardStatus: 'creditcard:application approval:' + responseObj.cardType,
                    previousPageName: 'creditcard:test1'
                }
            });
        });

        it('should call processStub with correct data for in progress or declined status', () => {
            responseObj = {
                status: APPROVAL_STATUS.IN_PROGRESS,
                cardType: 'PRIVATE_LABEL'
            };
            component.fireResultPageAnalytics(responseObj);

            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    eventStrings: [anaConsts.Event.SC_CREDIT_CARD_PENDING],
                    pageName: 'creditcard:application-pending' + ':n/a:*',
                    pageDetail: 'application-pending',
                    pageType: anaConsts.PAGE_TYPES.CREDIT_CARD,
                    creditCardStatus: 'creditcard:application pending:n/a',
                    previousPageName: 'creditcard:test1'
                }
            });
        });

        it('should call processStub with correct data for response with errorCode', () => {
            responseObj = {
                errorCode: 'errorCode'
            };
            component.fireResultPageAnalytics(responseObj);

            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    eventStrings: [anaConsts.Event.SC_CREDIT_CARD_ERROR],
                    pageName: 'creditcard:application-error' + ':n/a:*',
                    pageDetail: 'application-error',
                    pageType: anaConsts.PAGE_TYPES.CREDIT_CARD,
                    creditCardStatus: 'creditcard:application error:n/a',
                    previousPageName: 'creditcard:test1'
                }
            });
        });
    });

    it('should trigger LINK_TRACKING_EVENT with correct data when triggerErrorTracking is invoked', () => {
        // Arrange
        const processStub = spyOn(processEvent, 'process');
        const errorData = {
            fields: ['MOBILE_NUMBER', 'ZIP_CODE'],
            messages: ['One phone number required. Please enter a phone number.', 'ZIP Code Required.Please enter a 5 digit ZIP code.']
        };
        const eventArgs = {
            data: {
                bindingMethods: linkTrackingError,
                linkName: 'error',
                actionInfo: 'creditcard:submit application',
                eventStrings: [anaConsts.Event.EVENT_71],
                fieldErrors: errorData.fields,
                errorMessages: errorData.messages
            }
        };

        // Act
        component.triggerErrorTracking(errorData);

        // Asseert
        expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, eventArgs);
    });
});
