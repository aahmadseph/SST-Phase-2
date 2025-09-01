describe('BeautyInsider Actions', () => {
    const { createSpy } = jasmine;
    const BeautyInsiderActions = require('actions/BeautyInsiderActions').default;
    const biRewardsApi = require('services/api/beautyInsider').default;
    const UtilActions = require('utils/redux/Actions').default;
    let mergeStub;
    let getBiRewardsStub;
    let getClientSummaryStub;
    let dispatch;

    beforeEach(() => {
        mergeStub = spyOn(UtilActions, 'merge');
        getBiRewardsStub = spyOn(biRewardsApi, 'getBiRewardsGroupForSnapshot').and.returnValue(Promise.resolve({}));
        getClientSummaryStub = spyOn(biRewardsApi, 'getClientSummary').and.returnValue(Promise.resolve({}));
        dispatch = createSpy();
    });

    describe('fetch BiRewards', () => {
        it('should call the service function getBiRewards in the service', () => {
            BeautyInsiderActions.fetchBiRewards()(dispatch);
            expect(getBiRewardsStub).toHaveBeenCalled();
        });

        it('should call the action with type SET_BI_REWARDS with empty value', done => {
            const biRewardGroups = {
                'Reward Yourself': [],
                'Celebration Gift': [],
                'Birthday Gift': []
            };

            const fakePromise = {
                then: function (resolve) {
                    resolve({ biRewardGroups: biRewardGroups });

                    expect(mergeStub).toHaveBeenCalledWith('beautyInsider', 'biRewardGroups', biRewardGroups);

                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            getBiRewardsStub.and.returnValue(fakePromise);

            BeautyInsiderActions.fetchBiRewards()(dispatch);
        });
    });

    describe('fetch ClientSummary', () => {
        it('should call the service function getClientSummary in the service', () => {
            BeautyInsiderActions.fetchClientSummary(1, true)(dispatch);
            expect(getClientSummaryStub).toHaveBeenCalledWith(1, true);
        });
    });
});
