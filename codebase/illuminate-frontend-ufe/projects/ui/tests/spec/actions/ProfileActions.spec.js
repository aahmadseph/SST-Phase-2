import {
    SHOW_EDIT_MY_PROFILE_MODAL,
    SHOW_EDIT_FLOW_MODAL,
    SHOW_SOCIAL_REGISTRATION_MODAL,
    SHOW_SOCIAL_REOPT_MODAL
} from 'constants/actionTypes/profile';

describe('Profile Actions', () => {
    const { createSpy } = jasmine;
    const profileActions = require('actions/ProfileActions').default;
    const processEvent = require('analytics/processEvent').default;
    const biApi = require('services/api/beautyInsider').default;

    let dispatch;

    beforeEach(() => {
        dispatch = createSpy();
    });

    describe('Show edit my profile modal', () => {
        const saveBeautyTraitCallBack = 'The save beauty trait callback';
        let actionReturnValue;

        beforeEach(() => {
            actionReturnValue = profileActions.showEditMyProfileModal(true, saveBeautyTraitCallBack);
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(SHOW_EDIT_MY_PROFILE_MODAL);
        });

        it('should open the modal', () => {
            expect(actionReturnValue.isOpen).toBeTruthy();
        });

        it('should close the modal', () => {
            actionReturnValue = profileActions.showEditMyProfileModal(false);
            expect(actionReturnValue.isOpen).toBeFalsy();
        });

        it('should set the save beauty trails call back', () => {
            expect(actionReturnValue.saveBeautyTraitCallBack).toEqual(saveBeautyTraitCallBack);
        });
    });

    describe('Show edit flow modal', () => {
        const title = 'The title';
        const content = 'The content';
        const biAccount = 'The bi account';
        const socialProfile = 'The social profile';
        const saveProfileCallback = 'The save profile callback';

        let actionReturnValue;

        beforeEach(() => {
            actionReturnValue = profileActions.showEditFlowModal(true, title, content, biAccount, socialProfile, saveProfileCallback);
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(SHOW_EDIT_FLOW_MODAL);
        });

        it('should open the modal', () => {
            expect(actionReturnValue.isOpen).toBeTruthy();
        });

        it('should set the title of the modal', () => {
            expect(actionReturnValue.title).toEqual(title);
        });

        it('should set the content of the modal', () => {
            expect(actionReturnValue.content).toEqual(content);
        });

        it('should set the bi account data to be used in the modal', () => {
            expect(actionReturnValue.biAccount).toEqual(biAccount);
        });

        it('should set the social profile data to be used in the modal', () => {
            expect(actionReturnValue.socialProfile).toEqual(socialProfile);
        });

        it('should set the save profile call back', () => {
            expect(actionReturnValue.saveProfileCallback).toEqual(saveProfileCallback);
        });
    });

    describe('Update BI account', () => {
        let updateBiAccountStub;

        beforeEach(() => {
            updateBiAccountStub = spyOn(biApi, 'updateBiAccount');
        });

        it('should update the BI account', () => {
            const fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: () => {}
            };

            updateBiAccountStub.and.returnValue(fakePromise);

            profileActions.updateBiAccount(123)();
            expect(updateBiAccountStub.calls.argsFor(0)[0]).toEqual(123);
        });

        it('should call to dispatch if it success', () => {
            const fakePromise = {
                then: resolve => {
                    resolve();
                    expect(dispatch).toHaveBeenCalled();

                    return fakePromise;
                },
                catch: () => {}
            };

            updateBiAccountStub.and.returnValue(fakePromise);
            profileActions.updateBiAccount(123)(dispatch);
        });

        it('should call to errorCallback if it is rejected', () => {
            const errorCallbackStub = createSpy();
            const fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: reject => {
                    reject({ errorMessages: [] });
                    expect(errorCallbackStub).toHaveBeenCalled();
                }
            };

            updateBiAccountStub.and.returnValue(fakePromise);
            profileActions.updateBiAccount(123, () => {}, errorCallbackStub)(dispatch);
        });
    });

    describe('Show social registration modal', () => {
        let processStub;
        let actionReturnValue;

        beforeEach(() => {
            processStub = spyOn(processEvent, 'process');
            actionReturnValue = profileActions.showSocialRegistrationModal(true, true, 'lithium');
        });

        it('should call to analytics if modal is open', () => {
            expect(processStub.calls.argsFor(0)[0]).toEqual('asyncPageLoad');
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(SHOW_SOCIAL_REGISTRATION_MODAL);
        });

        it('should set the social registration provider', () => {
            expect(actionReturnValue.socialRegistrationProvider).toEqual('lithium');
        });

        it('should open the modal', () => {
            expect(actionReturnValue.isOpen).toBeTruthy();
        });

        it('should close the modal', () => {
            actionReturnValue = profileActions.showSocialRegistrationModal(false);
            expect(actionReturnValue.isOpen).toBeFalsy();
        });
    });

    describe('Show social ReOpt modal', () => {
        let processStub;
        let actionReturnValue;
        let socialCallback;
        let cancelCallback;

        beforeEach(() => {
            socialCallback = createSpy();
            cancelCallback = createSpy();
            processStub = spyOn(processEvent, 'process');
            actionReturnValue = profileActions.showSocialReOptModal(true, socialCallback, cancelCallback);
        });

        it('should call to analytics if modal is open', () => {
            expect(processStub.calls.argsFor(0)[0]).toEqual('asyncPageLoad');
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(SHOW_SOCIAL_REOPT_MODAL);
        });

        it('should set the social registration callback', () => {
            expect(actionReturnValue.socialReOptCallback).toEqual(socialCallback);
        });

        it('should set cancel callback', () => {
            expect(actionReturnValue.cancellationCallback).toEqual(cancelCallback);
        });

        it('should open the modal', () => {
            expect(actionReturnValue.isOpen).toBeTruthy();
        });

        it('should close the modal', () => {
            actionReturnValue = profileActions.showSocialRegistrationModal(false);
            expect(actionReturnValue.isOpen).toBeFalsy();
        });
    });

    describe('Get account history slice', () => {
        let getBiAccountHistoryStub;

        beforeEach(() => {
            getBiAccountHistoryStub = spyOn(biApi, 'getBiAccountHistory');
        });

        it('should update the BI account', () => {
            const fakePromise = {
                then: () => {
                    return fakePromise;
                }
            };

            getBiAccountHistoryStub.and.returnValue(fakePromise);

            profileActions.getAccountHistorySlice(1)();
            expect(getBiAccountHistoryStub.calls.argsFor(0)[0]).toEqual(1, 0, 10);
        });

        it('should call to dispatch if it success', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({});
                    expect(dispatch.calls.argsFor(0)[0]).toEqual({
                        type: 'SET_ACCOUNT_HISTORY_SLICE',
                        accountHistorySlice: {}
                    });

                    return fakePromise;
                }
            };

            getBiAccountHistoryStub.and.returnValue(fakePromise);
            profileActions.getAccountHistorySlice(1)(dispatch);
        });
    });
});
