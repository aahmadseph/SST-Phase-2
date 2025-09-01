const ufeApi = require('services/api/ufeApi').default;
const getCategoryHierarchyModule = require('services/api/legacy-mweb/getCategoryHierarchy').default;

describe('getCategoryHierarchyModule', () => {
    describe('dangerouslyAdaptData', () => {
        let dangerouslyAdaptData, fakeData, testResponse;

        beforeEach(() => {
            dangerouslyAdaptData = getCategoryHierarchyModule.dangerouslyAdaptData;
        });

        it('should return empty array of data objectr has no props', () => {
            fakeData = {};
            testResponse = [];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should return object from data passed as an object as an array', () => {
            fakeData = { prop: { param: 'testVal' } };

            testResponse = [{ param: 'testVal' }];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should not process data.responseStatus', () => {
            fakeData = { responseStatus: {} };

            testResponse = [];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should keep data.[prop].content.region1[].componentType if it !== 9', () => {
            fakeData = {
                prop: {
                    content: {
                        region1: [{ componentType: 13 }]
                    }
                }
            };

            testResponse = [
                {
                    content: {
                        region1: [{ componentType: 13 }]
                    }
                }
            ];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should change data if data.[prop].content.region1[].componentType number = 9', () => {
            fakeData = {
                prop: {
                    content: {
                        region1: [
                            {
                                componentType: 9,
                                title: 'testVal'
                            }
                        ]
                    }
                }
            };

            testResponse = [
                {
                    content: {
                        region1: [
                            {
                                componentType: 59,
                                title: 'testVal',
                                displayTitle: 'testVal'
                            }
                        ]
                    }
                }
            ];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should process data from data.[prop].content.region1[].links[]', () => {
            fakeData = {
                prop: {
                    content: {
                        region1: [
                            {
                                componentType: 9,
                                title: 'testVal',
                                links: [{ linkText: 'testText' }]
                            }
                        ]
                    }
                }
            };

            testResponse = [
                {
                    content: {
                        region1: [
                            {
                                componentType: 59,
                                title: 'testVal',
                                displayTitle: 'testVal',
                                links: [
                                    {
                                        componentType: 58,
                                        linkText: 'testText',
                                        displayTitle: 'testText'
                                    }
                                ]
                            }
                        ]
                    }
                }
            ];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });

        it('should process data from data.[prop].megaNavMarketingBanner', () => {
            fakeData = {
                prop: {
                    megaNavMarketingBanner: [{}]
                }
            };

            testResponse = [
                {
                    megaNavMarketingBanner: [{ componentType: 53 }]
                }
            ];
            expect(dangerouslyAdaptData(fakeData)).toEqual(testResponse);
        });
    });

    describe('getCategoryHierarchy', () => {
        let getCategoryHierarchy, makeRequestStub, url;

        beforeEach(() => {
            getCategoryHierarchy = getCategoryHierarchyModule.getCategoryHierarchy;
            url = '/api/catalog/categories/all';
            makeRequestStub = spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({ data: 'test' }));
        });

        it('should call makeRequest with the correct url', () => {
            getCategoryHierarchy({ data: 'test' });
            expect(makeRequestStub.calls.first().args).toEqual([url, { headers: { 'x-ufe-request': true } }]);
        });

        it('should resolved the correct data', done => {
            getCategoryHierarchy().then(data => {
                expect(data).toEqual(['test']);
                done();
            });
        });

        it('should reject call with data on errorCode', done => {
            makeRequestStub.and.returnValue(Promise.resolve({ errorCode: 'test' }));
            getCategoryHierarchy().catch(err => {
                expect(err.errorCode).toEqual('test');
                done();
            });
        });
    });
});
