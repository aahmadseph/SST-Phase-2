let apiUtil;
let BazaarVoice;
let Location;
let store;

describe('BazaarVoice Service', () => {
    const { arrayContaining, objectContaining } = jasmine;
    const bvHost = 'someHost';
    const bvToken = 'someToken';
    const bvVersion = 'someVersion';
    let apiRequestStub;
    let requestArgs;

    beforeEach(() => {
        Location = require('utils/Location').default;
        spyOn(Location, 'isRichProfilePage').and.returnValue(true);
        Sephora.configurationSettings.isBazaarVoiceEnabled = true;

        Sephora.configurationSettings['bvApi_rich_profile'] = {
            host: bvHost,
            token: bvToken,
            version: bvVersion
        };

        apiUtil = require('utils/Api').default;
        store = require('Store').default;
        BazaarVoice = require('services/api/thirdparty/BazaarVoice').default;
    });

    describe('submit review', () => {
        const productId = 'P123456',
            title = 'Title with special % & characters',
            rating = 3,
            isRecommended = false,
            reviewText = 'my review including % & characters',
            userId = '2323123';

        beforeEach(() => {
            apiRequestStub = spyOn(apiUtil, 'request').and.resolveTo({ json: () => ({ Results: [], Includes: [] }) });

            spyOn(store, 'getState').and.returnValue({
                profile: {
                    socialInfo: {}
                },
                user: {
                    userBeautyPreference: {
                        skinTone: ['tan']
                    }
                }
            });

            BazaarVoice.submitReview({
                productId,
                title,
                rating,
                isRecommended,
                reviewText,
                userId
            });

            requestArgs = apiRequestStub.calls.first().args[0];
        });

        it('submit a request with a method of POST', () => {
            expect(requestArgs.method).toEqual('POST');
        });

        it('submit a request with a base url of https://{bvHost}/data/submitreview.json', () => {
            const url = `https://${bvHost}/data/submitreview.json`;
            expect(requestArgs.url.startsWith(url)).toBeTruthy();
        });

        it('submit a request with querystring containing apiversion = {bvVersion} and a passkey', () => {
            expect(requestArgs.qsParams.passkey).toMatch(/.+/);
            expect(requestArgs.qsParams.apiversion).toMatch(bvVersion);
        });

        it('submit a request with product id in the body', () => {
            expect(requestArgs.params).toMatch(new RegExp('.*&?ProductId=' + productId + '&?.*'));
        });

        it('submit a request with encoded title in the body', () => {
            expect(requestArgs.params).toMatch(new RegExp('.*&?Title=' + encodeURIComponent(title) + '&?.*'));
        });

        it('should transmit context data values  lowercase', () => {
            expect(requestArgs.params).toMatch(new RegExp('.*&?ContextDataValue_skinTone=tan&?.*'));
        });

        it('should submit a request with encoded characters for Review Text', () => {
            expect(requestArgs.params).toMatch(new RegExp('.*&?ReviewText=' + encodeURIComponent(reviewText) + '&?.*'));
        });
    });

    describe('get reviews and stats', () => {
        const productId = '123456';

        beforeEach(() => {
            apiRequestStub = spyOn(apiUtil, 'request').and.resolveTo({ json: () => ({ Results: [], Includes: [] }) });
        });

        describe('Filter querystring param productId value', () => {
            it('should equal the productId', async function () {
                await BazaarVoice.getReviewsAndStats(productId);

                expect(apiRequestStub).toHaveBeenCalledWith(
                    objectContaining({
                        qsParams: objectContaining({
                            Filter: arrayContaining([`ProductId:${productId}`])
                        })
                    })
                );
            });

            it('should be present even if other Filter params exist', async () => {
                const eyeColor = 'Brown';

                await BazaarVoice.getReviewsAndStats(productId, 10, {
                    eyeColor: [eyeColor]
                });

                expect(apiRequestStub).toHaveBeenCalledWith(
                    objectContaining({
                        qsParams: objectContaining({
                            Filter: arrayContaining([`ProductId:${productId}`, `contextdatavalue_eyeColor:${eyeColor.toLowerCase()}`])
                        })
                    })
                );
            });
        });

        it('should include limit in the querystring', async function () {
            const limit = 999;
            await BazaarVoice.getReviewsAndStats(productId, limit);

            requestArgs = apiRequestStub.calls.first().args[0];
            expect(requestArgs.qsParams.Limit).toEqual(limit);
        });

        describe('Filter param', () => {
            describe('ageRange', () => {
                it('key should be changed to age', async function () {
                    await BazaarVoice.getReviewsAndStats(productId, 10, {
                        ageRange: ['13-17']
                    });

                    expect(apiRequestStub).toHaveBeenCalledWith(
                        objectContaining({
                            qsParams: objectContaining({
                                Filter: arrayContaining([`ProductId:${productId}`, 'contextdatavalue_age:13to17'])
                            })
                        })
                    );
                });

                it('value should replace dash with to', async function () {
                    await BazaarVoice.getReviewsAndStats(productId, 10, {
                        ageRange: ['13-17']
                    });

                    expect(apiRequestStub).toHaveBeenCalledWith(
                        objectContaining({
                            qsParams: objectContaining({
                                Filter: arrayContaining([`ProductId:${productId}`, 'contextdatavalue_age:13to17'])
                            })
                        })
                    );
                });
            });
        });

        describe('sort param', () => {
            it('key be included in the querystring params', async function () {
                const sort = 'Helpfulness:desc';

                await BazaarVoice.getReviewsAndStats(productId, 10, {
                    SORT: [sort]
                });

                expect(apiRequestStub).toHaveBeenCalledWith(
                    objectContaining({
                        qsParams: objectContaining({
                            Sort: arrayContaining([sort])
                        })
                    })
                );
            });
        });
    });

    describe('get search reviews', () => {
        it('should include the correct params in the querystring', async function () {
            // Arrange
            const qsParams = {
                Filter: 'ProductId:123',
                Search: '"blue"',
                Limit: 6,
                Offset: 0,
                Include: 'Products,Comments',
                Stats: 'Reviews',
                passkey: 'someToken',
                apiversion: 'someVersion',
                Locale: 'en_US'
            };
            apiRequestStub = spyOn(apiUtil, 'request').and.resolveTo({ json: () => ({ Results: [], Includes: [] }) });

            // Act
            await BazaarVoice.getSearchReviews(123, 6, 'blue', 0);

            // Assert
            expect(apiRequestStub).toHaveBeenCalledWith(objectContaining({ qsParams }));
        });
    });
});
