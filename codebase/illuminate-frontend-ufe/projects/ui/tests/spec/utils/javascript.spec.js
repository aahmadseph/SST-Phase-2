/* eslint max-len:[2,200] */
describe('Javascript general utils', function () {
    const js = require('utils/javascript').default;
    let countries;

    describe('filterObjectValuesByKey function', function () {
        const allowedKeys = ['one', 'two'];
        let stubbedObj;
        let testFunction;
        beforeEach(function () {
            Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
            stubbedObj = {
                one: '1',
                two: '2',
                three: '3'
            };
            testFunction = key => allowedKeys.indexOf(key) >= 0;
        });

        it('should return an empty array for malformed test function', () => {
            testFunction = null;
            const filteredValues = js.filterObjectValuesByKey(stubbedObj, testFunction);
            expect(filteredValues.length).toBe(0);
        });

        it('should not return undefined', () => {
            const filteredValues = js.filterObjectValuesByKey(stubbedObj, testFunction);
            expect(filteredValues).not.toBe(undefined);
        });

        it('should return matching keys value', () => {
            const filteredValues = js.filterObjectValuesByKey(stubbedObj, testFunction);
            allowedKeys.forEach(allowedKey => {
                expect(filteredValues.indexOf(stubbedObj[allowedKey])).toBeGreaterThan(-1);
            });
        });

        it('should not be copied non allowed values', () => {
            const filteredValues = js.filterObjectValuesByKey(stubbedObj, testFunction);
            expect(filteredValues.indexOf(stubbedObj.three)).toBe(-1);
        });

        describe('recursive flag', () => {
            let stubbedNestedObj;

            beforeEach(() => {
                stubbedNestedObj = { ...stubbedObj };
                stubbedNestedObj.four = {
                    two: 'nested 2',
                    three: 'nested 3'
                };
            });

            it('should process nested objects if flag is true', () => {
                const filteredValues = js.filterObjectValuesByKey(stubbedNestedObj, testFunction, true);
                expect(filteredValues).toEqual(['1', '2', 'nested 2']);
            });

            it('should not process nested objects if flag is false', () => {
                const filteredValues = js.filterObjectValuesByKey(stubbedNestedObj, testFunction);
                expect(filteredValues).toEqual(['1', '2']);
            });
        });
    });

    describe('findInArray function', function () {
        const stubbedArray = [10, 100, 1000];
        const testValueToFind = 100;
        const foundArrayElement = js.findInArray(stubbedArray, one => one === testValueToFind);

        it('should return the given value when found', () => {
            expect(foundArrayElement).toBe(100);
        });
    });

    describe('flat function', function () {
        let source;
        let result;

        beforeEach(() => {
            source = [
                [1, 2, 3],
                [4, 5, [6]]
            ];
        });

        it('should return a flattened array to depth 1 by default', () => {
            result = source.flat();
            expect(result).toEqual([1, 2, 3, 4, 5, [6]]);
        });

        it('should return not a flattened array if param is zero', () => {
            result = source.flat(0);
            expect(result).toEqual(source);
        });

        it('should return not a flattened array', () => {
            result = source.flat(2);
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('isObjectEmpty function', function () {
        const stubbedObj = {};
        const isStubbedObjEmpty = js.isObjectEmpty(stubbedObj);

        it('should return true when passed an empty object', () => {
            expect(isStubbedObjEmpty).toBe(true);
        });
    });

    describe('getObjectValuesSlowNDirty function', function () {
        countries = require('utils/LanguageLocale').default;

        it('should return every value of the given object', () => {
            const dirtyCopy = js.getObjectValuesSlowNDirty(countries);
            Object.values(countries).forEach(value => {
                expect(dirtyCopy.indexOf(value)).toBeGreaterThan(-1);
            });
        });

        it('should return an empty array if it receive undefined or null', () => {
            const dirtyCopy = js.getObjectValuesSlowNDirty(undefined);
            expect(dirtyCopy.length).toBe(0);
        });
    });

    describe('getObjects function', () => {
        let obj;
        beforeEach(function () {
            obj = {
                id: '1',
                child: [
                    {
                        id: '11',
                        child: [{ id: '111' }, { id: '112' }]
                    },
                    {
                        id: '12',
                        child: [{ id: '121' }, { id: '122' }]
                    }
                ]
            };
        });

        it('should find the object with key id and value 11', function (done) {
            const result = JSON.stringify([
                {
                    id: '11',
                    child: [{ id: '111' }, { id: '112' }]
                }
            ]);
            expect(JSON.stringify(js.getObjects(obj, 'id', '11'))).toEqual(result);
            done();
        });

        it('should not find the object with key id and value 14', function (done) {
            expect(js.getObjects(obj, 'id', '14')).toEqual([]);
            done();
        });
    });

    describe('getKeyByValue function', function () {
        const f = function () {},
            someKey = 'someKey',
            someValue = 'someValue';
        f[someKey] = someValue;

        using(
            'Type',
            [
                {
                    object: null,
                    expectedResult: undefined
                },
                {
                    object: 'some string',
                    expectedResult: undefined
                },
                {
                    object: 4,
                    expectedResult: undefined
                },
                {
                    object: true,
                    expectedResult: undefined
                },
                {
                    object: undefined,
                    expectedResult: undefined
                },
                {
                    object: f,
                    expectedResult: someKey
                },
                {
                    object: { [someKey]: someValue },
                    expectedResult: someKey
                },
                {
                    object: { [someKey]: 'anotherValue' },
                    expectedResult: undefined
                }
            ],
            config => {
                it(`should find the key by value for ${typeof config.object} value`, function (done) {
                    expect(js.getKeyByValue(config.object, someValue)).toEqual(config.expectedResult);
                    done();
                });
            }
        );
    });

    describe('buildMap function', function () {
        const stubbedObject = {
            activityType: 'classes',
            storeIds: '0058,1202,0382,0196,0632',
            startDateTime: '2019-02-27T08:00:00Z',
            endDateTime: '2019-03-06T08:00:00Z'
        };
        const expectedMap = new Map();
        expectedMap.set('activityType', 'classes');
        expectedMap.set('storeIds', '0058,1202,0382,0196,0632');
        expectedMap.set('startDateTime', '2019-02-27T08:00:00Z');
        expectedMap.set('endDateTime', '2019-03-06T08:00:00Z');

        it('should create a Map from the provided object', () => {
            expect(js.buildMap(stubbedObject)).toEqual(expectedMap);
        });
    });
});
