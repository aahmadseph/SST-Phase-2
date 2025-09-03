let accountUtils;
let constants;

beforeEach((done) => {
    Promise.all([
        import('#server/services/apiOrchestration/userFull/utils/utils.mjs'),
        import('#server/services/apiOrchestration/userFull/utils/constants.mjs')
    ]).then(function (res) {
        if (res[0]) {
            accountUtils = res[0];
        }

        if (res[1]) {
            constants = res[1];
        }

        done();
    });
});

describe('accountUtils', () => {

    describe('isError', () => {
        it('should return true when service status is "rejected"', () => {
            const service = { status: 'rejected' };
            const parsedData = {};
            expect(accountUtils.isError(service, parsedData)).toBeTruthy();
        });

        it('should return true if status is "fulfilled" and parsedData has errorCode', () => {
            const service = { status: 'fulfilled' };
            const parsedData = { errorCode: '500' };
            expect(accountUtils.isError(service, parsedData)).toBeTruthy();
        });

        it('should return false when service status is "fulfilled" and parsedData does not have errorCode', () => {
            const service = { status: 'fulfilled' };
            const parsedData = {};
            expect(accountUtils.isError(service, parsedData)).toEqual(true);
        });
    });

    describe('getOptions', function () {
        it('updates the options object with profileId and headers from reqHeaders', function () {
            const options = {
                url: 'https://example.com/users/profiles/123',
                headers: {}
            };

            const reqHeaders = {
                'seph-access-token': 'sample-token',
                'x-api-key': 'sample-api-key'
            };

            const expectedResult = {
                url: 'https://example.com/users/profiles/123',
                profileId: '123',
                headers: {
                    'seph-access-token': 'sample-token',
                    'x-api-key': 'sample-api-key'
                },
                timeout: 2000
            };

            const updatedOptions = accountUtils.getOptions(options, reqHeaders);

            // assert that the updated options is as expected
            expect(updatedOptions).toEqual(expectedResult);
        });
    });

    describe('getDataFromObject', function() {
        it('should return an object with same properties as fields if they exist in data', function() {
            const fields = ['username', 'email'];
            const data = {
                username: 'test',
                email: 'test@test.com',
                phone: '12345678'
            };

            const result = accountUtils.getDataFromObject(fields, data);
            expect(result).toEqual({
                username: 'test',
                email: 'test@test.com'
            });
        });

        it('should return an empty object if there are no matching fields in the data', function() {
            const fields = ['age', 'gender'];
            const data = {
                username: 'test',
                email: 'test@test.com',
                phone: '12345678'
            };

            const result = accountUtils.getDataFromObject(fields, data);
            expect(result).toEqual({});
        });
    });

    describe('formatStoreCredits', () => {
        it('should format credits correctly with currency ISO_CURRENCY.US', () => {
            const credits = [
                {
                    currency: constants.ISO_CURRENCY.US,
                    amount: 100,
                    expirationDate: '2024-12-31'
                }
            ];
            const formattedCredits = accountUtils.formatStoreCredits(null,
                { storeCredits: credits });
            const expected = {
                storeCredits: [
                    {
                        amount: '$100',
                        expirationDate: '2024-12-31',
                        currency: constants.ISO_CURRENCY.US
                    }
                ]
            };
            expect(formattedCredits).toEqual(expected);
        });

        it('should format credits correctly with other currency', () => {
            const credits = [
                {
                    currency: 'EU',
                    amount: 100,
                    expirationDate: '2024-12-31'
                }
            ];
            const formattedCredits = accountUtils.formatStoreCredits(null,
                { storeCredits: credits });
            const expected = {
                storeCredits: [
                    {
                        amount: '$100 EU',
                        expirationDate: '2024-12-31',
                        currency: 'EU'
                    }
                ]
            };
            expect(formattedCredits).toEqual(expected);
        });

        it('should handle credits without expiration date', () => {
            const credits = [
                {
                    currency: constants.ISO_CURRENCY.US,
                    amount: 100
                }
            ];
            const formattedCredits = accountUtils.formatStoreCredits(null,
                { storeCredits: credits });
            const expected = {
                storeCredits: [
                    {
                        amount: '$100',
                        expirationDate: null,
                        currency: constants.ISO_CURRENCY.US
                    }
                ]
            };
            expect(formattedCredits).toEqual(expected);
        });
    });

    describe('formatBankRewards', () => {
        it('should return an empty object when bankRewards is null', () => {
            const parsedData = {
                bankRewards: null
            };
            const formatBankRewards = accountUtils.formatBankRewards(null,
                parsedData);
            const expected = {};
            expect(formatBankRewards).toEqual(expected);
        });

        it('should return an empty object when bankRewards is undefined', () => {
            const parsedData = {
                bankRewards: undefined
            };
            const formatBankRewards = accountUtils.formatBankRewards(null,
                parsedData);
            const expected = {};
            expect(formatBankRewards).toEqual(expected);
        });

        it('should return bankRewards formatted correctly', () => {
            const parsedData = {
                bankRewards: {
                    'currentLevelName': 'Rewards',
                    'rewardCertificates': [],
                    'upcomingRewardCertificates': [],
                    'expiredRewardCertificates': [],
                    'rewardsTotal': 15,
                    'ytdRewardsEarned': 0,
                    'ccRewardStatus': 'CreditCard_REWARDS_EARNED',
                    'ccCardType': 'PLCC'
                }
            };

            const formattedBankRewards = accountUtils.formatBankRewards(null,
                parsedData);
            const expected = {
                bankRewards: {
                    'currentLevelName': 'Rewards',
                    'rewardCertificates': [],
                    'expiredRewardCertificates': [],
                    'rewardsTotal': 15,
                    'ytdRewardsEarned': 0,
                    'ccRewardStatus': 'CreditCard_REWARDS_EARNED',
                    'ccCardType': 'PLCC'
                },
                ccCardType: 'PLCC'
            };
            expect(formattedBankRewards).toEqual(expected);
        });
    });

    describe('formatPrescreenInfo', () => {
        it('should return an empty object when prescreenInfo is empty', () => {
            const prescreenInfo = {};
            const formattedPrescreenInfo = accountUtils.formatPrescreenInfo(
                null, prescreenInfo);
            const expected = {};
            expect(formattedPrescreenInfo).toEqual(expected);
        });

        it('should return prescreenInfo with the right format', () => {
            const prescreenInfo = {
                'ccAccountInfoLookUpOut':
                    {
                        'ccApprovalStatus': 'APPROVED',
                        'CcFirstTimeDiscountClaimed': false
                    },
                'preScreenStatus': true,
                'realTimePrescreenInProgress': false
            };
            const formattedPrescreenInfo = accountUtils.formatPrescreenInfo(
                null, prescreenInfo);
            const expected = {
                ccAccountandPrescreenInfo: {
                    ccApprovalStatus: 'APPROVED',
                    preScreenStatus: true,
                    realTimePrescreenInProgress: false
                }
            };
            expect(formattedPrescreenInfo).toEqual(expected);
        });

        it('should return prescreenInfo with the right format including prescreenedCardType', () => {
            const prescreenInfo = {
                'ccAccountInfoLookUpOut':
                    {
                        'ccApprovalStatus': 'NEW_APPLICATION',
                        'CcFirstTimeDiscountClaimed': false
                    },
                'preScreenStatus': true,
                'prescreenedCardType': 'CBVI',
                'realTimePrescreenInProgress': false
            };
            const formattedPrescreenInfo = accountUtils.formatPrescreenInfo(
                null, prescreenInfo);
            const expected = {
                ccAccountandPrescreenInfo: {
                    ccApprovalStatus: 'NEW_APPLICATION',
                    preScreenStatus: true,
                    prescreenedCardType: 'CBVI',
                    realTimePrescreenInProgress: false
                }
            };
            expect(formattedPrescreenInfo).toEqual(expected);
        });
    });

    describe('isEmptyObject', () => {
        it('should return true when the object is empty', () => {
            const sampleObject = {};
            const isEmpty = accountUtils.isEmptyObject(sampleObject);
            expect(isEmpty).toBeTrue();
        });

        it('should return false when the object is not empty', () => {
            const sampleObject = { foo: 'bar' };
            const isEmpty = accountUtils.isEmptyObject(sampleObject);
            expect(isEmpty).toBeFalse();
        });

        it('should return null when the object is null', () => {
            const sampleObject = null;
            const isEmpty = accountUtils.isEmptyObject(sampleObject);
            expect(isEmpty).toBeNull();
        });

        it('should return undefined when the object is undefined', () => {
            const sampleObject = undefined;
            const isEmpty = accountUtils.isEmptyObject(sampleObject);
            expect(isEmpty).toBeUndefined();
        });
    });

    describe('isConciergeCurbsideEnabled', () => {
        const options = {
            country: 'US'
        };

        const configurationSettings = {
            enableConciergePickupUS: true,
            enableConciergePickupCA: true
        };

        it('should return true when #enableConciergePickupUS=true and #country=US', () => {
            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeTrue();
        });

        it('should return true when #enableConciergePickupCA=true and #country=CA', () => {
            options.country = 'CA';

            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeTrue();
        });

        it('should return false when #enableConciergePickupUS=true but #country is not US', () => {
            options.country = 'MX';

            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeFalse();
        });

        it('should return false when #enableConciergePickupCA=true but #country is not CA', () => {
            options.country = '';

            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeFalse();
        });

        it('should return false when #enableConciergePickupUS=false and #country=US', () => {
            configurationSettings.enableConciergePickupUS = false;

            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeFalse();
        });

        it('should return false when #enableConciergePickupCA=false and #country=CA', () => {
            options.country = 'CA';
            configurationSettings.enableConciergePickupCA = false;

            const isConciergeCurbsideEnabled = accountUtils.isConciergeCurbsideEnabled(options, configurationSettings);
            expect(isConciergeCurbsideEnabled).toBeFalse();
        });
    });

    describe('constructFavoriteBrands', () => {
        it('should construct favorite brands array from favoriteBrands and brands', () => {
            const favoriteBrands = [{
                value: 1
            }, {
                value: 2
            }];
            const brands = [{
                brandId: 1,
                shortName: 1
            }, {
                brandId: 2,
                shortName: 2
            }, {
                brandId: 3,
                shortName: 3
            }];

            const result = accountUtils.constructFavoriteBrands(favoriteBrands, brands);

            expect(result).toEqual([{
                brandId: 1,
                shortName: 1,
                normalizedBrandName: 1
            }, {
                brandId: 2,
                shortName: 2,
                normalizedBrandName: 2
            }]);
        });

        it('should return an empty array if favoriteBrands is empty', () => {
            const favoriteBrands = [];
            const brands = [{ brandId: 1 }, { brandId: 2 }, { brandId: 3 }];

            const result = accountUtils.constructFavoriteBrands(favoriteBrands, brands);

            expect(result.length).toEqual(0);
        });

        it('should skip brands that are not in favoriteBrands', () => {
            const favoriteBrands = [{
                brandId: 1,
                value: 1
            }, {
                brandId: 3,
                value: 3
            }];
            const brands = [{
                brandId: 1,
                value: 1,
                shortName: 1
            }, {
                brandId: 2,
                value: 2,
                shortName: 2
            }, {
                brandId: 3,
                value: 3,
                shortName: 3
            }];

            const result = accountUtils.constructFavoriteBrands(favoriteBrands, brands);

            expect(result).toEqual([{
                brandId: 1,
                shortName: 1,
                value: 1,
                normalizedBrandName: 1
            }, {
                brandId: 3,
                shortName: 3,
                value: 3,
                normalizedBrandName: 3
            }]);
        });
    });

    describe('getFormattedDate', () => {
        beforeEach(() => {
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('should return current date in the format YYYY-MM-DD HH:MM:SS', () => {
            jasmine.clock().mockDate(new Date('2024-01-01T01:00:00.358Z'));
            const currentDate = accountUtils.getFormattedDate();
            const expected = '2024-01-01 01:00:00';
            expect(currentDate).toBe(expected);
        });
    });

    describe('parseErrorResponse', () => {
        it('should parse errors and return a formatted response with errorCode and errorMessages',
            () => {
                const reason = {
                    err: 'Error: Response code',
                    method: 'GET',
                    hostname: 'internalsephora.com',
                    statusCode: 0,
                    url: '/v2/promotion/customer/8887704260038272/active',
                    failed: true,
                    data: '{"errorCode":0,"errorMessages":["Internal server error"]}',
                    inputUrl: '/gapi/users/profiles/50383383075/current/full'
                };

                const parseData = ['promotions', {}];

                const errorResponse = accountUtils.parseErrorResponse(reason,
                    parseData);

                const expected = [
                    'promotions', {
                        errorCode: 0,
                        errorMessages: ['Internal server error']
                    }];

                expect(errorResponse).toEqual(expected);
            });

        it('should parse faults as errors and return a formatted response with errorCode and errorMessages',
            () => {
                const reason = {
                    data: '{"fault": {"faultstring": "Invalid api key", "detail": {"errorcode": 0}}}'
                };

                const parseData = ['prop', {}];

                const errorResponse = accountUtils.parseErrorResponse(reason,
                    parseData);

                const expected = [
                    'prop', {
                        errorCode: 0,
                        errorMessages: ['Invalid api key']
                    }];

                expect(errorResponse).toEqual(expected);
            });
    });

    describe('transformAndMatchObjects', function() {
        it('should transform and match objects based on the provided base and match object', function() {
            const baseObject = {
                eyeColor: {
                    blue: 'Blue',
                    red: 'Red'
                },
                skinType: {
                    drySk: 'Dry skin'
                }
            };

            const matchObject = {
                eyeColor: [{
                    value: 'blue'
                }]
            };

            const result = accountUtils.transformAndMatchObjects(baseObject, matchObject);

            expect(result.eyeColor).toContain({
                displayName: 'Blue',
                value: 'blue',
                isSelected: true
            });
            expect(result.eyeColor).toContain({
                displayName: 'Red',
                value: 'red'
            });
            expect(result.skinType).toContain({
                displayName: 'Dry skin',
                value: 'drySk'
            });
        });
    });

    describe('addCssColors', () => {
        it('adds css colors for given skin tones', () => {
            const skinTones = [
                { shadeCode: 1 },
                { shadeCode: 2 },
                { shadeCode: 3 }
            ];

            const COLORS_MAP = {
                1: 'color1',
                2: 'color2',
                3: 'color3'
            };

            const result = accountUtils.addCssColors(skinTones, COLORS_MAP);

            expect(result[0]).toEqual({
                shadeCode: 1,
                cssColor: 'color1'
            });
            expect(result[1]).toEqual({
                shadeCode: 2,
                cssColor: 'color2'
            });
            expect(result[2]).toEqual({
                shadeCode: 3,
                cssColor: 'color3'
            });
        });
    });

    describe('getConfigSetting', () => {
        const configurationSettings = {
            foo: true,
            bar: false
        };
        it('should return true when the property configSetting is defined and is true',
            () => {
                const configSetting = accountUtils.getConfigSetting(
                    configurationSettings, 'foo');
                expect(configSetting).toBeTrue();
            });

        it('should return false when the configSetting is defined and is false',
            () => {
                const configSetting = accountUtils.getConfigSetting(
                    configurationSettings, 'bar');
                expect(configSetting).toBeFalse();
            });

        it('should return false when the configSetting is undefined', () => {
            const configSetting = accountUtils.getConfigSetting(
                configurationSettings, 'baz');
            expect(configSetting).toBeFalse();
        });
    });

    describe('formatError', () => {
        it('should parse errorData and return a formatted response with errorCode and errorMessages',
            () => {
                const errorData = {
                    err: 'Error: Response code',
                    method: 'GET',
                    hostname: 'internalsephora.com',
                    statusCode: 400,
                    url: '/v2/promotion/customer/8887704260038272/active',
                    failed: true,
                    data: '{"errorCode": 501,"errorMessages":["Internal server error"]}',
                    inputUrl: '/gapi/users/profiles/50383383075/current/full'
                };

                const formattedError = accountUtils.formatError(errorData);

                const expected = {
                    errorCode: 501,
                    errorMessages: ['Internal server error']
                };

                expect(formattedError).toEqual(expected);
            });

        it('should parse faults as errors and return a formatted response with errorCode and errorMessages',
            () => {
                const errorData = {
                    data: '{"errorCode": 0,"errorMessages":["Internal server error"]}'
                };

                const formattedError = accountUtils.formatError(errorData);

                const expected = {
                    errorCode: 0,
                    errorMessages: ['Internal server error']
                };

                expect(formattedError).toEqual(expected);
            });

        it('should parse errorData when it comes as an array of errors',
            () => {
                const errorData = {
                    data: '{"errors": [{"errorMessage": "Random error", "errorCode": 400}]}'
                };

                const formattedError = accountUtils.formatError(errorData);

                const expected = {
                    errorCode: 400,
                    errorMessages: ['Random error']
                };

                expect(formattedError).toEqual(expected);
            });

        it('should parse errorData and use err field when there are not errorMessages in the parsed data',
            () => {
                const errorData = {
                    data: '{"profileLocale":"CA","profileStatus":0}',
                    err: 'Error: Response code 403 not 2xx',
                    statusCode: 403
                };

                const formattedError = accountUtils.formatError(errorData);

                const expected = {
                    errorCode: 403,
                    errorMessages: ['Error: Response code 403 not 2xx']
                };

                expect(formattedError).toEqual(expected);
            });

        it('should parse errorData and use statusCode when errorCode is not a number',
            () => {
                const errorData = {
                    data: '{"errors": [{"errorMessage": "Random error", "errorCode": "RANDOM_500"}]}',
                    statusCode: 500
                };

                const formattedError = accountUtils.formatError(errorData);

                const expected = {
                    errorCode: 500,
                    errorMessages: ['Random error']
                };

                expect(formattedError).toEqual(expected);
            });
    });

    describe('calculateDaysLeftToRedeem', () => {
        const lastDateToRedeem = '30-04-2024';

        beforeEach(() => {
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('should return a formatted string with the days left to redeem',
            () => {
                jasmine.clock().mockDate(new Date('2024-04-03T20:25:12.052Z'));
                const daysLeft = accountUtils.calculateDaysLeftToRedeem(
                    lastDateToRedeem);

                const expected = '28 days left to redeem';

                expect(daysLeft).toEqual(expected);
            });

        it('should return "0 days left to redeem" when the diff between today and lastDateToRedeem is zero',
            () => {
                jasmine.clock().mockDate(new Date('2024-04-30T23:59:59.000Z'));
                const daysLeft = accountUtils.calculateDaysLeftToRedeem(
                    lastDateToRedeem);

                const expected = '0 days left to redeem';

                expect(daysLeft).toEqual(expected);
            });

        it('should return "0 days left to redeem" when the diff between today and lastDateToRedeem is negative',
            () => {
                jasmine.clock().mockDate(new Date('2024-05-01T20:25:12.052Z'));
                const daysLeft = accountUtils.calculateDaysLeftToRedeem(
                    lastDateToRedeem);

                const expected = '0 days left to redeem';

                expect(daysLeft).toEqual(expected);
            });

        it('should return "1 day left to redeem" when the diff between today and lastDateToRedeem is greater than 0 but less than 1',
            () => {
                jasmine.clock().mockDate(new Date('2024-04-30T00:00:00.052Z'));
                const daysLeft = accountUtils.calculateDaysLeftToRedeem(
                    lastDateToRedeem);

                const expected = '1 day left to redeem';

                expect(daysLeft).toEqual(expected);
            });
    });

    describe('formattedISODate', () => {
        it('should transform ISO 8601 date string to MM/DD/YYYY', () => {
            const isoDate = '2023-04-18T13:32:47-07:00';
            const expected = '04/18/2023';

            expect(accountUtils.formattedISODate(isoDate)).toEqual(expected);
        });
    });

    describe('getCountryByZipCodeOrDefault', () => {
        it('returns CA for a valid Canadian postal code', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('M5B 2H1', {});
            expect(result).toBe(constants.COUNTRIES.CA);
        });

        it('returns US for a valid US zip code', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('90210', {});
            expect(result).toBe(constants.COUNTRIES.US);
        });

        it('returns US for a valid US zip+4 code', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('90210-1234', {});
            expect(result).toBe(constants.COUNTRIES.US);
        });

        it('returns the country from options if zip code is invalid', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('INVALID', { country: constants.COUNTRIES.CA });
            expect(result).toBe(constants.COUNTRIES.CA);
        });

        it('defaults to US if zip code is invalid and no country is provided in options', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('INVALID', {});
            expect(result).toBe(constants.COUNTRIES.US);
        });

        it('handles empty zip code and defaults to US if no country is provided', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault('', {});
            expect(result).toBe(constants.COUNTRIES.US);
        });

        it('handles null zip code and defaults to US if no country is provided', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault(null, {});
            expect(result).toBe(constants.COUNTRIES.US);
        });

        it('handles undefined zip code and defaults to US if no country is provided', () => {
            const result = accountUtils.getCountryByZipCodeOrDefault(undefined, {});
            expect(result).toBe(constants.COUNTRIES.US);
        });
    });
});
