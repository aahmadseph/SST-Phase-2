/* eslint max-len: [0] */
describe('utils test', function () {
    let Location;
    let anaUtils;
    let Storage;

    beforeEach(() => {
        Location = require('utils/Location').default;
        anaUtils = require('analytics/utils').default;
        Storage = require('utils/localStorage/Storage').default;
    });

    describe('buildNavPath', () => {
        it('builds a 5 item long, colon separated string. Repeating the last item if needed', () => {
            const threeProvided = ['one', 'two', 'repeated part'];
            const fourProvided = ['one', 'two', 'three', 'repeated part'];
            const fiveProvided = ['one', 'two', 'three', 'four', 'five'];

            expect(anaUtils.buildNavPath(threeProvided)).toEqual('one:two:repeated part:repeated part:repeated part');

            expect(anaUtils.buildNavPath(fourProvided)).toEqual('one:two:three:repeated part:repeated part');

            expect(anaUtils.buildNavPath(fiveProvided)).toEqual('one:two:three:four:five');
        });
    });

    describe('getMostRecentEvent', () => {
        const events = [
            {
                eventInfo: {
                    eventName: 'test1',
                    attributes: { specificEventName: 'specificEventName' }
                }
            },
            {
                eventInfo: {
                    eventName: 'test2',
                    attributes: {}
                }
            }
        ];

        var savedEvents;

        beforeEach(function () {
            savedEvents = digitalData.event;

            digitalData.event = events;
        });

        afterEach(function () {
            digitalData.event = savedEvents;
        });

        it('gets the most recent event that matches the passed in event name', () => {
            expect(anaUtils.getMostRecentEvent('specificEventName').eventInfo.eventName).toEqual('test1');

            expect(anaUtils.getMostRecentEvent('test2').eventInfo.eventName).toEqual('test2');
        });
    });

    describe('removeUndefinedItems', () => {
        it('removes any undefined items from an array', () => {
            const startObject = ['one', 'two', undefined];
            const returnedObject = anaUtils.removeUndefinedItems(startObject);

            expect(returnedObject[returnedObject.length - 1]).toEqual('two');
        });

        it('removes any undefined items from an object', () => {
            const startObject = {
                one: 'one',
                two: 'two',
                three: undefined
            };

            expect(Object.keys(anaUtils.removeUndefinedItems(startObject)).length).toEqual(2);
        });
    });

    describe('setIfPresent', () => {
        afterEach(() => {
            delete window.testProp;
        });

        it('sets a property based on the key, original object and value passed in', () => {
            anaUtils.setIfPresent(window, 'testProp', true);

            expect(window.testProp).toEqual(true);
        });

        it('does not create a property or add a value because no value was passed in', () => {
            anaUtils.setIfPresent(window, 'testProp');

            expect(typeof window.testProp).toEqual('undefined');
        });
    });

    describe('removeCurrencySymbol', () => {
        it('removes the currency symbol from a string', () => {
            const numberString = anaUtils.removeCurrencySymbol('$22.50');

            expect(numberString).toEqual('22.50');
        });

        it('removes the Canadian currency symbol from a string', () => {
            const numberString = anaUtils.removeCurrencySymbol('C$22.50');

            expect(numberString).toEqual('22.50');
        });
    });

    describe('setNextPageDataAndRedirect', () => {
        let setNextPageDataStub;
        let e;
        let data;

        beforeEach(() => {
            e = { preventDefault: jasmine.createSpy() };
            setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
            data = {
                trackingData: { linkData: 'bi tab:view points and spend' },
                destination: '/lipstick'
            };

            anaUtils.setNextPageDataAndRedirect(e, data);
        });

        it('should call e.preventDefault', () => {
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('should call setNextPageData', () => {
            expect(setNextPageDataStub).toHaveBeenCalledWith(data.trackingData);
        });

        it('should call setLocation', () => {
            expect(Location.setLocation).toHaveBeenCalledWith(data.destination);
        });
    });

    describe('getPreviousPageData', () => {
        beforeEach(() => {
            const encodedData = { pageName: 'home page:home page:n/a:*', pageType: 'home page' };
            spyOn(Storage.local, 'getItem').and.returnValue(encodedData);
        });

        it('should parse and return the value of the anaNextPageData cookie as an object', () => {
            const returnVal = anaUtils.getPreviousPageData();
            const expectedVal = { pageName: 'home page:home page:n/a:*', pageType: 'home page' };
            expect(expectedVal).toEqual(returnVal);
        });
    });

    describe('getDoubleClickCategorySuffix', () => {
        it('should return the correct category suffix', () => {
            const expectedMapValues = {
                makeup: '1',
                skincare: '2',
                hair: '3',
                fragrance: '4',
                gifts: '5',
                sale: '6'
            };
            Object.keys(expectedMapValues).forEach(category => {
                const actual = anaUtils.getDoubleClickCategorySuffix(category);
                expect(actual).toEqual(expectedMapValues[category]);
            });
        });
    });

    describe('getLastAsyncPageLoadData', () => {
        beforeEach(() => {
            digitalData.event = [
                {
                    eventInfo: {
                        attributes: {
                            pageType: undefined,
                            pageDetail: 'some pageDetail',
                            pageName: 'some pageName',
                            previousPageName: 'some previousPageName',
                            world: 'some world'
                        },
                        eventName: 'asyncPageLoad'
                    }
                },
                {
                    eventInfo: {
                        attributes: {
                            pageType: 'sign in',
                            pageDetail: 'sign in pageDetail',
                            pageName: 'sign in pageName',
                            previousPageName: 'sign in previousPageName',
                            world: 'sign in world'
                        },
                        eventName: 'asyncPageLoad'
                    }
                },
                {
                    eventInfo: {
                        attributes: {
                            pageType: 'recent pageType',
                            pageDetail: 'recent pageDetail',
                            pageName: 'recent pageName',
                            previousPageName: 'recent previousPageName',
                            world: 'recent world'
                        },
                        eventName: 'asyncPageLoad'
                    }
                }
            ];
        });

        it('should return the latest async page load data', () => {
            const actual = anaUtils.getLastAsyncPageLoadData(null, true);
            expect(actual).toEqual({
                pageName: 'recent pageName',
                previousPage: 'recent previousPageName',
                pageType: 'recent pageType',
                pageDetail: 'recent pageDetail',
                world: 'recent world'
            });
        });

        it('should return the latest async page load data by event detail', () => {
            const actual = anaUtils.getLastAsyncPageLoadData({ pageType: 'sign in' }, true);
            expect(actual).toEqual({
                pageName: 'sign in pageName',
                previousPage: 'sign in previousPageName',
                pageDetail: 'sign in pageDetail',
                pageType: 'sign in',
                world: 'sign in world'
            });
        });

        it('should return an empty object if one of the eventDetail props has undefined values', () => {
            const actual = anaUtils.getLastAsyncPageLoadData({ pageType: undefined });
            expect(actual).toEqual({});
        });
    });

    describe('addIfConditionsMet', () => {
        const sourceObj = { events: [] };

        const dataToCheck = {};
        let userInfo;

        beforeEach(() => {
            userInfo = digitalData.user[0];
            digitalData.user = [
                {
                    profile: [
                        {
                            profileInfo: {
                                profileId: 'someId',
                                biType: 'vib'
                            }
                        }
                    ]
                }
            ];
        });

        afterEach(() => {
            sourceObj.events = [];
            digitalData.user[0] = userInfo;
        });

        it('should check for event6', () => {
            dataToCheck.events = ['event6'];
            anaUtils.addIfConditionsMet(sourceObj, dataToCheck);
            expect(sourceObj.events.length).toBe(1);
        });

        it('should check for event11', () => {
            dataToCheck.events = ['event11'];
            anaUtils.addIfConditionsMet(sourceObj, dataToCheck);
            expect(sourceObj.events.length).toBe(1);
        });

        it('should check for event11', () => {
            dataToCheck.events = ['event39'];
            digitalData.user[0].profile[0].profileInfo.signInStatus = 'signed in';
            anaUtils.addIfConditionsMet(sourceObj, dataToCheck);
            expect(sourceObj.events.length).toBe(1);
        });
    });
});
