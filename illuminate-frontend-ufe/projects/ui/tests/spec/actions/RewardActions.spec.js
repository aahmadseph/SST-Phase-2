describe('Reward Actions', () => {
    const { createSpy } = jasmine;
    const actions = require('actions/RewardActions').default;
    let dispatch;

    beforeEach(() => {
        const store = require('store/Store').default;
        dispatch = createSpy();
        spyOn(store, 'getState').and.returnValue({
            basket: {}
        });
    });

    describe('fetchProfileRewards', () => {
        const api = require('services/api/beautyInsider/getBiRewardsGroup').default;
        let rougeExclusiveUtils;
        let getBiRewardsGroupForCheckoutStub;

        beforeEach(() => {
            rougeExclusiveUtils = require('utils/rougeExclusive').default;
            spyOn(rougeExclusiveUtils, 'updateRougeExclusiveSkus').and.returnValue({});
            getBiRewardsGroupForCheckoutStub = spyOn(api, 'getBiRewardsGroupForCheckout');
        });

        it('should call to getBiRewardsGroupForCheckout', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({ biRewardGroups: {} });
                    expect(getBiRewardsGroupForCheckoutStub).toHaveBeenCalled();
                }
            };
            getBiRewardsGroupForCheckoutStub.and.returnValue(fakePromise);
            actions.fetchProfileRewards()(dispatch);
        });

        it('should return the action type', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({ biRewardGroups: {} });

                    return {
                        then: result => {
                            expect(result.type).toEqual(actions.TYPES.SET_REWARDS);
                        }
                    };
                }
            };
            getBiRewardsGroupForCheckoutStub.and.returnValue(fakePromise);
            actions.fetchProfileRewards()(dispatch);
        });

        it('should set the rewards', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({ rewards: [{}, {}] });

                    return {
                        then: result => {
                            expect(result.rewards).toEqual([{}, {}]);
                        }
                    };
                }
            };
            getBiRewardsGroupForCheckoutStub.and.returnValue(fakePromise);
            actions.fetchProfileRewards()(dispatch);
        });
    });

    describe('fetchRecentlyRedeemedRewards', () => {
        const biApi = require('services/api/beautyInsider').default;
        let getPurchaseHistoryStub;

        beforeEach(() => {
            getPurchaseHistoryStub = spyOn(biApi, 'getPurchaseHistory');
        });

        it('should call to getPurchaseHistory', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({});
                    expect(getPurchaseHistoryStub).toHaveBeenCalledWith(1, {});
                }
            };
            getPurchaseHistoryStub.and.returnValue(fakePromise);
            actions.fetchRecentlyRedeemedRewards(1, {})(dispatch);
        });

        it('should return the action type', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({});

                    return {
                        then: result => {
                            expect(result.type).toEqual(actions.TYPES.SET_RECENT_REWARDS);
                        }
                    };
                }
            };
            getPurchaseHistoryStub.and.returnValue(fakePromise);
            actions.fetchProfileRewards()(dispatch);
        });

        it('should set the rewards purchased', () => {
            const fakePromise = {
                then: resolve => {
                    resolve({ rewardsPurchasedGroups: [{}, {}] });

                    return {
                        then: result => {
                            expect(result.rewardsPurchasedGroups).toEqual([{}, {}]);
                        }
                    };
                }
            };
            getPurchaseHistoryStub.and.returnValue(fakePromise);
            actions.fetchProfileRewards()(dispatch);
        });
    });
});
