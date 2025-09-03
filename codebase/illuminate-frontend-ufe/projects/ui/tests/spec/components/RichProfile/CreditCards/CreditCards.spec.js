const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('CreditCards component', () => {
    let cmsApi;
    let CreditCards;
    let component;
    let setStateSpy;
    let getMediaContentStub;
    let store;
    let promoUtils;
    let processEvent;
    let anaConsts;
    let urlUtils;
    let APPROVAL_STATUS = require('constants/CreditCard').APPROVAL_STATUS;
    let USER_STATE;
    const rewardsObj = {
        bankRewards: {
            currentLevelName: '8105546571',
            currentLevelNumber: '9152770575',
            expiredRewardsTotal: 0,
            numberOfRewardsAvailable: 10,
            rewardCertificates: [
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW5459384491',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 81,
                    startDate: '2018-06-01'
                },
                {
                    available: true,
                    barcodeIndicator: '39',
                    certificateNumber: 'RW3177257594',
                    expireDate: '2020-01-01',
                    fulfilDate: '2018-06-01',
                    pinCode: '100',
                    rewardAmount: 14,
                    startDate: '2018-06-01'
                }
            ],
            rewardsTotal: 556,
            upcomingRewardsTotal: 0
        }
    };

    beforeEach(() => {
        CreditCards = require('components/RichProfile/CreditCards/CreditCards').default;
        promoUtils = require('utils/Promos').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;
        urlUtils = require('utils/Url').default;
        store = require('store/Store').default;
        APPROVAL_STATUS = require('constants/CreditCard').APPROVAL_STATUS;
        USER_STATE = require('constants/CreditCard').USER_STATE;
        spyOn(urlUtils, 'redirectTo');
    });

    describe('toggleRewardToBasket method', () => {
        let applyPromoStub;

        beforeEach(() => {
            const wrapper = shallow(<CreditCards />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
            applyPromoStub = spyOn(promoUtils, 'applyPromo').and.returnValue({
                then: callback => {
                    callback();
                }
            });
            component.state = rewardsObj;
            component.toggleRewardToBasket(rewardsObj.bankRewards.rewardCertificates[0]);
        });

        it('should apply the certificate to the basket', () => {
            expect(applyPromoStub).toHaveBeenCalledTimes(1);
        });

        it('should update the state with applied reward', () => {
            expect(setStateSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('trackEventAndOpenInNewTab method', () => {
        let e;
        let url;
        let processSpy;
        let openLinkInNewTabSpy;
        let returnedFn;

        beforeEach(() => {
            e = { preventDefault: createSpy() };
            url = '/';

            const wrapper = shallow(<CreditCards />);
            component = wrapper.instance();
            processSpy = spyOn(processEvent, 'process');
            openLinkInNewTabSpy = spyOn(urlUtils, 'openLinkInNewTab');
            returnedFn = component.trackEventAndOpenInNewTab(url);
        });

        it('should call e.preventDefault once', () => {
            returnedFn(e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call processSpy with correct tracking data', () => {
            returnedFn(e);
            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: 'creditcard:manage my card',
                    linkName: 'creditcard:manage my card'
                }
            });
        });

        it('should call openLinkInNewTabSpy with the url as a param', () => {
            returnedFn(e);
            expect(openLinkInNewTabSpy).toHaveBeenCalledWith(url);
        });
    });

    describe('openScanRewardCardModal method', () => {
        let dispatchSpy;
        let Actions;
        let showScanRewardCardModalStub;

        beforeEach(() => {
            Actions = require('Actions').default;
            dispatchSpy = spyOn(store, 'dispatch');
            showScanRewardCardModalStub = spyOn(Actions, 'showScanRewardCardModal').and.returnValue('showScanRewardCardModalStub');
            const wrapper = shallow(<CreditCards />);
            component = wrapper.instance();
            component.openScanRewardCardModal();
        });

        it('shold open scan rewards modal', () => {
            expect(showScanRewardCardModalStub).toHaveBeenCalledWith({ isOpen: true });
        });

        it('should dispatch a proper action to the store', () => {
            expect(dispatchSpy).toHaveBeenCalledWith('showScanRewardCardModalStub');
        });
    });

    describe('ensure user is recognized', () => {
        beforeEach(() => {
            const wrapper = shallow(<CreditCards />);
            component = wrapper.instance();
            component.isUserAtleastRecognized();
        });

        it('should decorate component with isUserAtleastRecognized method', () => {
            // Test being executed means that isUserAtleastRecognized method added to the component
            expect(true).toBeTruthy();
        });
    });

    describe('setUserState method', () => {
        let getManageCardLinkSpy;
        let biInfo;

        beforeEach(() => {
            biInfo = {
                ccAccountandPrescreenInfo: {
                    ccApprovalStatus: '',
                    preScreenStatus: false,
                    realTimePrescreenInProgress: false
                }
            };
            cmsApi = require('services/api/cms').default;
            getMediaContentStub = spyOn(cmsApi, 'getMediaContent');
            const wrapper = shallow(<CreditCards />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
        });

        describe(`userState = ${APPROVAL_STATUS.NEW_APPLICATION}`, () => {
            beforeEach(() => {
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.NEW_APPLICATION;
            });

            it('should call media content api', () => {
                getMediaContentStub.and.returnValue({ then: () => {} });
                component.setUserState(biInfo);
                expect(getMediaContentStub).toHaveBeenCalledTimes(1);
            });

            it('should call media content api with media id', () => {
                getMediaContentStub.and.returnValue({ then: () => {} });
                component.setUserState(biInfo);
                expect(getMediaContentStub).toHaveBeenCalledWith('49500020');
            });
        });

        describe(`userState = ${APPROVAL_STATUS.IN_PROGRESS}`, () => {
            beforeEach(() => {
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.IN_PROGRESS;
            });

            it('should call setState Stub', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub with value', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledWith({ userState: APPROVAL_STATUS.IN_PROGRESS });
            });
        });

        describe(`userState = ${APPROVAL_STATUS.APPROVED} without any rewards ` + 'from no bankRewards', () => {
            beforeEach(() => {
                spyOn(store, 'getState').and.returnValue({});
                getManageCardLinkSpy = spyOn(component, 'getManageCardLink');
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.APPROVED;
            });

            it('should call getManageCardLink Stub', () => {
                component.setUserState(biInfo);
                expect(getManageCardLinkSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub with value', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledWith({
                    userState: USER_STATE.CARD_NO_REWARDS,
                    fpdData: {}
                });
            });
        });

        describe(`userState = ${APPROVAL_STATUS.APPROVED} without any rewards ` + 'from no bankRewards.rewardCertificates', () => {
            beforeEach(() => {
                getManageCardLinkSpy = spyOn(component, 'getManageCardLink');
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.APPROVED;
                biInfo.bankRewards = {};
            });

            it('should call getManageCardLink Stub', () => {
                component.setUserState(biInfo);
                expect(getManageCardLinkSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub with value', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledWith({
                    userState: USER_STATE.CARD_NO_REWARDS,
                    fpdData: {}
                });
            });
        });

        describe(`userState = ${APPROVAL_STATUS.APPROVED} with rewards`, () => {
            beforeEach(() => {
                getManageCardLinkSpy = spyOn(component, 'getManageCardLink');
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.APPROVED;
                biInfo.bankRewards = { rewardCertificates: [{}] };
            });

            it('should call getManageCardLink Stub', () => {
                component.setUserState(biInfo);
                expect(getManageCardLinkSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub with value', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledWith({
                    userState: USER_STATE.CARD_AND_REWARDS,
                    bankRewards: biInfo.bankRewards,
                    fpdData: {}
                });
            });
        });

        describe(`userState = ${APPROVAL_STATUS.CLOSED}`, () => {
            beforeEach(() => {
                biInfo.ccAccountandPrescreenInfo.ccApprovalStatus = APPROVAL_STATUS.CLOSED;
            });

            it('should call setState Stub', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState Stub with value', () => {
                component.setUserState(biInfo);
                expect(setStateSpy).toHaveBeenCalledWith({ userState: USER_STATE.CARD_CLOSED });
            });
        });
    });

    describe('openMediaModal method', () => {
        let Actions;
        let dispatchSpy;
        let showMediaModalSpy;
        let mediaId;

        beforeEach(() => {
            Actions = require('Actions').default;
            mediaId = require('utils/BCC').default.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;

            const wrapper = shallow(<CreditCards globalModals={{}} />);
            component = wrapper.instance();
            dispatchSpy = spyOn(store, 'dispatch');
            showMediaModalSpy = spyOn(Actions, 'showMediaModal');
            component.openMediaModal();
        });

        it('should call dispatchSpy with argument showMediaModalSpy', () => {
            expect(dispatchSpy).toHaveBeenCalledWith(showMediaModalSpy());
        });

        it('should call showMediaModalSpy with correct arguments', () => {
            expect(showMediaModalSpy).toHaveBeenCalledWith({
                isOpen: true,
                mediaId
            });
        });
    });
});
