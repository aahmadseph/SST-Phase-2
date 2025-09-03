// const { createSpy } = jasmine;

describe('BuyPage Actions', () => {
    let BuyPageActions;

    beforeEach(() => {
        BuyPageActions = require('actions/BuyPageActions').default;
    });

    describe('render isNewPage', () => {
        const newLocation = {
            newPath: 'https://local.sephora.com/buy/touch-up-sticks'
        };
        let previousLocation;

        it('should return true if user goes to a new page', () => {
            previousLocation = {
                prevPath: 'https://local.sephora.com/buy/beauty-oils'
            };

            const newPage = BuyPageActions.isNewPage({
                newLocation,
                previousLocation
            });
            expect(newPage).toBeTruthy();
        });

        it('should return false if user is on same page', () => {
            previousLocation = {
                prevPath: 'https://local.sephora.com/buy/touch-up-sticks'
            };

            const newPage = BuyPageActions.isNewPage({
                newLocation,
                previousLocation
            });

            expect(newPage).toBeFalsy();
        });
    });

    // TODO: inject-loader is not supported anymore
    // describe('render openPage', () => {
    //     let dispatch;

    //     const newLocation = {
    //         path: '/buy/cleansing-pads-for-acne',
    //         queryParams: {
    //             icid2: ['seop_linkgroup']
    //         },
    //         anchor: '',
    //         prevPath: '/product/line-smoother-oil-free-face-moisturizer-P12574'
    //     };

    //     const response = {
    //         skus: []
    //     };

    //     const failureReponse = {
    //         data: 'failed api call'
    //     };

    //     let getBuyPageData, buyPageActions, load;

    //     beforeEach(() => {
    //         dispatch = createSpy();
    //         load = require('inject-loader!actions/BuyPageActions');
    //     });

    //     it('should call getBuyPageData', () => {
    //         getBuyPageData = createSpy().and.returnValue(Promise.resolve(response));
    //         buyPageActions = load({ 'services/api/Buy': getBuyPageData });

    //         buyPageActions.openPage({
    //             newLocation,
    //             events: {
    //                 onDataLoaded: () => {},
    //                 onPageUpdated: () => {}
    //             }
    //         })(dispatch);

    //         expect(getBuyPageData).toHaveBeenCalledWith(newLocation);
    //     });

    //     it('should return error on API response failure', () => {
    //         getBuyPageData = createSpy().and.returnValue(Promise.reject(failureReponse));
    //         buyPageActions = load({ 'services/api/Buy': getBuyPageData });

    //         const apiCall = buyPageActions.openPage({
    //             newLocation,
    //             events: {}
    //         })(dispatch);

    //         apiCall.catch(error => {
    //             expect(error).toEqual(failureReponse);
    //         });
    //     });
    // });
});
