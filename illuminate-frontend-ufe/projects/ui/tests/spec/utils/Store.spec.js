describe('Store', () => {
    let storeHours;
    let storeClosed;
    let storeClosedWeekends;
    let storeUtils;

    beforeEach(() => {
        storeHours = {
            mondayHours: '9AM-10PM',
            tuesdayHours: '9AM-10PM',
            wednesdayHours: '9AM-10PM',
            thursdayHours: '9AM-10PM',
            fridayHours: '9AM-10PM',
            saturdayHours: '9AM-11PM',
            sundayHours: '9AM-9PM'
        };
        storeClosed = {
            mondayHours: 'Closed',
            tuesdayHours: 'Closed',
            wednesdayHours: 'Closed',
            thursdayHours: 'Closed',
            fridayHours: 'Closed',
            saturdayHours: 'Closed',
            sundayHours: 'Closed'
        };
        storeClosedWeekends = {
            mondayHours: '9AM-10PM',
            tuesdayHours: '9AM-10PM',
            wednesdayHours: '9AM-10PM',
            thursdayHours: '9AM-10PM',
            fridayHours: '9AM-10PM',
            saturdayHours: 'Closed',
            sundayHours: 'Closed'
        };
        storeUtils = require('utils/Store').default;
    });

    describe('formatHoursRange', () => {
        it('should output correct display string if is single hour', () => {
            expect(storeUtils.formatHoursRange('10PM')).toEqual('10 PM');
        });

        it('should output correct display string if is hours range', () => {
            expect(storeUtils.formatHoursRange('9AM-11PM')).toEqual('9 AM - 11 PM');
        });
    });

    describe('getStoreTodayClosingTime', () => {
        //it('should output correct display string of the closing hour', () => {
        //    expect(storeUtils.getStoreTodayClosingTime(storeHours)).toEqual('10 PM');
        //});

        it('should output correct display string if store is closed', () => {
            expect(storeUtils.getStoreTodayClosingTime(storeClosed)).toEqual('Closed');
        });
    });

    describe('getStoreHoursDisplayArray', () => {
        it('should output correct display array open hours', () => {
            expect(storeUtils.getStoreHoursDisplayArray(storeHours)).toEqual([
                {
                    dayRange: 'Mon - Fri',
                    hours: '9 AM - 10 PM'
                },
                {
                    dayRange: 'Sat',
                    hours: '9 AM - 11 PM'
                },
                {
                    dayRange: 'Sun',
                    hours: '9 AM - 9 PM'
                }
            ]);
        });

        it('should output correct display array if store is closed', () => {
            expect(storeUtils.getStoreHoursDisplayArray(storeClosed)).toEqual([
                {
                    dayRange: 'Mon - Sun',
                    hours: 'Closed'
                }
            ]);
        });

        it('should output correct display array if store is closed on weekends', () => {
            expect(storeUtils.getStoreHoursDisplayArray(storeClosedWeekends)).toEqual([
                {
                    dayRange: 'Mon - Fri',
                    hours: '9 AM - 10 PM'
                },
                {
                    dayRange: 'Sat - Sun',
                    hours: 'Closed'
                }
            ]);
        });

        it('should return Store Closed if empty storeHours object is passed in', () => {
            expect(storeUtils.getStoreHoursDisplayArray({})).toEqual([
                {
                    dayRange: 'Mon - Sun',
                    hours: 'Store Closed'
                }
            ]);
        });
    });

    describe('updateStoreListBasedOnUrlParam', () => {
        let storeList;
        let getParamsByNameStub;
        let urlUtils;

        beforeEach(() => {
            storeList = [{ storeId: '0001' }, { storeId: '0002' }, { storeId: '0003' }];
            urlUtils = require('utils/Url').default;
            getParamsByNameStub = spyOn(urlUtils, 'getParamsByName');
        });

        it('should move store up if storeId is present in query', () => {
            getParamsByNameStub.and.returnValue(['0002']);
            expect(storeUtils.updateStoreListBasedOnUrlParam(storeList)).toEqual([{ storeId: '0002' }, { storeId: '0001' }, { storeId: '0003' }]);
            getParamsByNameStub.and.returnValue(['0001']);
            expect(storeUtils.updateStoreListBasedOnUrlParam(storeList)).toEqual(storeList);
        });

        it('should keep list as is if param is missing', () => {
            getParamsByNameStub.and.returnValue(null);
            expect(storeUtils.updateStoreListBasedOnUrlParam(storeList)).toEqual(storeList);
        });

        it('should keep list as is if param is out of the list', () => {
            getParamsByNameStub.and.returnValue(['0099']);
            expect(storeUtils.updateStoreListBasedOnUrlParam(storeList)).toEqual(storeList);
        });
    });

    describe('getStores', () => {
        let storeLocator;
        let getStoreLocationsStub;
        let fakePromise;
        let locationObjStub;
        let localeUtils;
        let getCountrySearchRadiusStub;
        const storesSuccessResponse = {
            responseStatus: 200,
            stores: ['store1', 'store2']
        };

        beforeEach(() => {
            storeLocator = require('services/api/utility/storeLocator').default;
            getStoreLocationsStub = spyOn(storeLocator, 'getStoreLocations');

            localeUtils = require('utils/LanguageLocale').default;
            getCountrySearchRadiusStub = spyOn(localeUtils, 'getCountrySearchRadius').and.returnValue(25);
        });

        it('should call getCountrySearchRadius in case of no country', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(storesSuccessResponse);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            locationObjStub = {
                lat: 'lat',
                lon: 'lon'
            };

            getStoreLocationsStub.and.returnValue(fakePromise);
            storeUtils.getStores(locationObjStub, false, false, true);
            expect(getCountrySearchRadiusStub).toHaveBeenCalledTimes(1);
        });

        it('should call getStoreLocations with correct params', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(storesSuccessResponse);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            locationObjStub = {
                lat: 'lat',
                lon: 'lon'
            };

            getStoreLocationsStub.and.returnValue(fakePromise);
            getCountrySearchRadiusStub.and.returnValue(25);
            storeUtils.getStores(locationObjStub, false, false, false, false, false, false);
            expect(getStoreLocationsStub).toHaveBeenCalledWith(null, {
                excludeNonSephoraStores: false,
                radius: 25,
                latitude: 'lat',
                longitude: 'lon',
                includeVirtualStores: false,
                showContent: false,
                includeRegionsMap: false
            });
        });

        it('should call getStoreLocations with excludeNonSephoraStores & includeVirtualStores as true', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(storesSuccessResponse);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            locationObjStub = {
                lat: 'lat',
                lon: 'lon'
            };

            getStoreLocationsStub.and.returnValue(fakePromise);
            getCountrySearchRadiusStub.and.returnValue(50);
            storeUtils.getStores(locationObjStub, true, false, true, false, false, false);
            expect(getStoreLocationsStub).toHaveBeenCalledWith(null, {
                excludeNonSephoraStores: true,
                radius: 50,
                latitude: 'lat',
                longitude: 'lon',
                includeVirtualStores: true,
                showContent: false,
                includeRegionsMap: false
            });
        });

        it('should call getStoreLocations with excludeNonSephoraStores & includeVirtualStores as false', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(storesSuccessResponse);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            locationObjStub = {
                lat: 'lat',
                lon: 'lon'
            };

            getStoreLocationsStub.and.returnValue(fakePromise);
            getCountrySearchRadiusStub.and.returnValue(50);
            storeUtils.getStores(locationObjStub, false, false, false, false, false, false);
            expect(getStoreLocationsStub).toHaveBeenCalledWith(null, {
                excludeNonSephoraStores: false,
                radius: 50,
                latitude: 'lat',
                longitude: 'lon',
                includeVirtualStores: false,
                showContent: false,
                includeRegionsMap: false
            });
        });
    });

    describe('getStoreIndexes', () => {
        let storeList;

        beforeEach(() => {
            storeList = [{ storeId: '0001' }, { storeId: '0002' }, { storeId: '0003' }];
        });

        it('should return an object that maps the storeId with the index location', () => {
            expect(storeUtils.getStoreIndexes(storeList)).toEqual({
                '0001': 0,
                '0002': 1,
                '0003': 2
            });
        });
    });

    describe('getStoresFromActivities', () => {
        let storeList;
        let activities;

        beforeEach(() => {
            activities = [
                {
                    storeId: '0003',
                    activityType: 'classes'
                },
                {
                    storeId: '0001',
                    activityType: 'classes'
                }
            ];
            storeList = [{ storeId: '0001' }, { storeId: '0002' }, { storeId: '0003' }];
        });

        it('should return an array with the stores that matches the activities', () => {
            expect(storeUtils.getStoresFromActivities(activities, storeList)).toEqual([{ storeId: '0003' }, { storeId: '0001' }]);
        });
    });

    describe('isCurbsideEnabled', () => {
        it('should return true if store isBopisable and isCurbsideEnabled', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const store = {
                isBopisable: true,
                isCurbsideEnabled: true
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store);

            expect(isCurbsideEnabled).toBe(true);
        });

        it('should return false if BOPIS killswitch is off', () => {
            Sephora.configurationSettings.isBOPISEnabled = false;
            const store = {
                isBopisable: true,
                isCurbsideEnabled: true
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store);

            expect(isCurbsideEnabled).toBe(false);
        });

        it('should return false if store isBopisable is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const store = {
                isBopisable: false,
                isCurbsideEnabled: true
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store);

            expect(isCurbsideEnabled).toBe(false);
        });

        it('should return false if store isCurbsideEnabled is set to false', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const store = {
                isBopisable: true,
                isCurbsideEnabled: false
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store);

            expect(isCurbsideEnabled).toBe(false);
        });

        it('should return true if store isBopisable and isCurbsideEnabled and otherFlags contains only truthy values', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const store = {
                isBopisable: true,
                isCurbsideEnabled: true
            };

            const otherFlags = {
                isBopisOrder: true,
                a: true,
                b: 1
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store, otherFlags);

            expect(isCurbsideEnabled).toBe(true);
        });

        it('should return false if store isBopisable and isCurbsideEnabled and otherFlags contains any falsy values', () => {
            Sephora.configurationSettings.isBOPISEnabled = true;
            const store = {
                isBopisable: true,
                isCurbsideEnabled: true
            };

            const otherFlags = {
                isBopisOrder: true,
                a: true,
                b: false
            };

            const isCurbsideEnabled = storeUtils.isCurbsideEnabled(store, otherFlags);

            expect(isCurbsideEnabled).toBe(false);
        });
    });

    describe('getCurbsidePickupInstructions', () => {
        let store;

        beforeEach(() => {
            store = {
                content: {
                    regions: {
                        curbsideInstructionTab: [
                            {
                                a: 1,
                                b: 2
                            }
                        ],
                        curbsideMapImageTab: [
                            {
                                c: 3,
                                d: 4
                            }
                        ]
                    }
                }
            };
        });

        it('should return an array with BCC content', () => {
            const regions = storeUtils.getCurbsidePickupInstructions(store).every(el => Boolean(el));
            expect(regions).toBe(true);
        });

        it('should not return curbsideInstructionTab in the first position', () => {
            store.content.regions.curbsideInstructionTab = undefined;
            const curbsideInstructionTab = storeUtils.getCurbsidePickupInstructions(store)[0];
            expect(curbsideInstructionTab).toBeFalsy();
        });

        it('should not return curbsideInstructionTab in the second position', () => {
            store.content.regions.curbsideMapImageTab = undefined;
            const curbsideMapImageTab = storeUtils.getCurbsidePickupInstructions(store)[1];
            expect(curbsideMapImageTab).toBeFalsy();
        });
    });

    describe('isStoreClosed', () => {
        it('Return false, store is closed', () => {
            const isStoreClosed = storeUtils.isStoreClosed({ storeHours: '00:00AM-00:00AM' });
            expect(isStoreClosed).toBeTrue();
        });

        // it('Return true, store is NOT closed', () => {
        //     const isStoreClosed = storeUtils.isStoreClosed({ storeHours: '00:00AM-11:59PM' });
        //     expect(isStoreClosed).toBeFalse();
        // });
    });

    describe('getSpecialHours', () => {
        let specialHours;
        let expectedResult;
        let startDayMock;
        let endDayMock;
        let monthMock;
        let yearMock;

        const SHORTENED_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        it('Should return specialHours with the right format', () => {
            yearMock = 2021;
            monthMock = 12;
            startDayMock = 23;
            endDayMock = 26;

            specialHours = [
                {
                    endDate: `${yearMock}-${monthMock}-${endDayMock}`,
                    reason: 'Store Closed',
                    startDate: `${yearMock}-${monthMock}-${startDayMock}`,
                    textColor: '#000000',
                    storeHours: ''
                }
            ];

            expect(storeUtils.getSpecialHours(specialHours)).toEqual([
                {
                    dateRange:
                        startDayMock === endDayMock
                            ? `${SHORTENED_MONTHS[monthMock - 1]} ${endDayMock}`
                            : `${SHORTENED_MONTHS[monthMock - 1]} ${startDayMock} - ${SHORTENED_MONTHS[monthMock - 1]} ${endDayMock}`,
                    textColor: specialHours[0].textColor,
                    reason: specialHours[0].reason,
                    storeHours: undefined
                }
            ]);
        });

        it('Should return empty array if empty array is passed', () => {
            specialHours = [];

            expectedResult = [];

            const getSpecialHours = storeUtils.getSpecialHours(specialHours);
            expect(getSpecialHours).toEqual(expectedResult);
        });
    });

    describe('getStoreDisplayName', () => {
        let storeDetails;
        beforeEach(() => {
            storeDetails = {
                displayName: 'New Store',
                storeType: 'SIKLS'
            };
        });

        it('should prepend Sephora to store name when store type is SIKLS', () => {
            const storeName = storeUtils.getStoreDisplayName(storeDetails);
            expect(storeName).toEqual(`Sephora ${storeDetails.displayName}`);
        });

        it('should not prepend Sephora to store name when store type is not SIKLS', () => {
            storeDetails.storeType = 'SEPHORA';
            const storeName = storeUtils.getStoreDisplayName(storeDetails);
            expect(storeName).toEqual(storeDetails.displayName);
        });

        it('should not prepend Sephora to store name when store type is undefined', () => {
            storeDetails.storeType = undefined;
            const storeName = storeUtils.getStoreDisplayName(storeDetails);
            expect(storeName).toEqual(storeDetails.displayName);
        });
    });

    describe('getStoreDisplayNameWithSephora', () => {
        let storeDetails;
        beforeEach(() => {
            storeDetails = {
                displayName: 'New Store',
                storeType: 'SEPHORA'
            };
        });

        it('should prepend Sephora to store name regardless the store type', () => {
            const storeName = storeUtils.getStoreDisplayNameWithSephora(storeDetails);
            expect(storeName).toEqual(`Sephora ${storeDetails.displayName}`);
        });

        it('should prepend Sephora to store name even if store type is undefined', () => {
            storeDetails.storeType = undefined;
            const storeName = storeUtils.getStoreDisplayNameWithSephora(storeDetails);
            expect(storeName).toEqual(`Sephora ${storeDetails.displayName}`);
        });
    });
});
