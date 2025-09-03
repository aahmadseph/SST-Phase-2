describe('Sample Actions', () => {
    const { createSpy } = jasmine;
    const actions = require('actions/SampleActions').default;
    let dispatch;
    let result;

    beforeEach(() => {
        dispatch = createSpy();
    });

    describe('setSamples', () => {
        const mySamples = [{ id: 1 }, { id: 2 }];

        beforeEach(() => {
            result = actions.setSamples(mySamples);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.SET_SAMPLES);
        });

        it('should set samples', () => {
            expect(result.samples).toEqual(mySamples);
        });
    });

    describe('setSamples', () => {
        const basketApi = require('services/api/basket').default;
        let getSamplesStub;

        beforeEach(() => {
            getSamplesStub = spyOn(basketApi, 'getSamples');
        });

        it('should call to getSamples endpoint', () => {
            const fakePromise = {
                then: resolve => {
                    resolve([]);
                    expect(getSamplesStub).toHaveBeenCalled();
                }
            };

            getSamplesStub.and.returnValue(fakePromise);
            actions.fetchSamples()(dispatch);
        });

        it('should dispatch setSamples action', () => {
            const fakePromise = {
                then: resolve => {
                    resolve([]);
                    expect(dispatch.calls.argsFor(0)[0]).toEqual({
                        type: 'SET_SAMPLES',
                        samples: []
                    });
                }
            };

            getSamplesStub.and.returnValue(fakePromise);
            actions.fetchSamples()(dispatch);
        });
    });
});
