const Storage = require('utils/localStorage/Storage').default;

describe('LocalStorage', () => {
    let setItemStub, getItemStub, removeItemStub, type;

    describe('native methods', () => {
        /* Tests for basic localStorage interactions */
        using(
            'Storages',
            [
                {
                    storage: window.localStorage,
                    label: 'Local Storage'
                },
                {
                    storage: window.sessionStorage,
                    label: 'Session Storage'
                }
            ],
            storageParam => {
                beforeEach(function () {
                    setItemStub = spyOn(storageParam.storage, 'setItem');
                    getItemStub = spyOn(storageParam.storage, 'getItem');
                    removeItemStub = spyOn(storageParam.storage, 'removeItem');
                    type = storageParam.storage === window.localStorage ? 'local' : 'session';
                });

                using(
                    'Values',
                    [
                        {
                            value: 5,
                            key: 'NUMBER'
                        },
                        {
                            value: true,
                            key: 'BOOLEAN'
                        },
                        {
                            value: 'some string',
                            key: 'STRING'
                        },
                        {
                            value: { prop: 'object prop' },
                            key: 'OBJECT'
                        },
                        {
                            value: null,
                            key: 'NULL'
                        },
                        {
                            value: undefined,
                            key: 'UNDEFINED'
                        }
                    ],
                    config => {
                        describe('Set item', function () {
                            it(`should set item of type ${config.key} in ${storageParam.label}`, () => {
                                Storage[type].setItem(config.key, config.value);
                                const expectedValue = JSON.stringify({ data: config.value });
                                expect(setItemStub).toHaveBeenCalledWith(config.key, expectedValue);
                            });
                        });

                        describe('Get item', function () {
                            it(`should get item of type ${config.key} in ${storageParam.label}`, () => {
                                const setValue = JSON.stringify({ data: config.value });
                                let expectedValue = JSON.parse(setValue);

                                expectedValue = typeof expectedValue.data === 'undefined' ? null : expectedValue.data;

                                getItemStub.and.callFake(arg => {
                                    if (arg === config.key) {
                                        return setValue;
                                    }

                                    return '';
                                });
                                expect(Storage[type].getItem(config.key)).toEqual(expectedValue);
                            });
                        });

                        describe('Remove item', function () {
                            it(`should remove item of type ${config.key} in ${storageParam.label}`, () => {
                                Storage[type].removeItem(config.key);
                                expect(removeItemStub).toHaveBeenCalledWith(config.key);
                            });
                        });
                    }
                );
            }
        );
    });

    describe('abstraction details', () => {
        /* Test for abstraction details */
        describe('getItem', () => {
            afterEach(() => {
                Storage.local.removeItem('basket');
            });

            it('should call JSON.parse to parse found data', () => {
                const parseStub = spyOn(JSON, 'parse');
                Storage.local.setItem('basket', { itemCount: 2 }, Storage.MINUTES * 15);
                Storage.local.getItem('basket');
                expect(parseStub).toHaveBeenCalled();
            });

            it('should return null if it has expire time and but is stale', () => {
                Storage.local.setItem('basket', { itemCount: 2 }, Storage.MINUTES * -15);
                expect(Storage.local.getItem('basket')).toEqual(null);
            });

            it('should return parsed data', () => {
                const content = { itemCount: 2 };
                Storage.local.setItem('basket', content);
                expect(Storage.local.getItem('basket')).toEqual(content);
            });
        });

        describe('setItem', () => {
            beforeEach(() => {
                setItemStub = spyOn(window.localStorage, 'setItem');
            });

            afterEach(() => {
                Storage.local.removeItem('basket');
            });

            it('should store passed content under data property', () => {
                const key = 'basket';
                const content = { itemCount: 2 };
                Storage.local.setItem(key, content);
                expect(JSON.parse(setItemStub.calls.first().args[1]).data).toEqual(content);
            });

            it('should add expiry property to stored object if expiry parameter was passed', () => {
                const key = 'basket';
                const content = { itemCount: 2 };
                Storage.local.setItem(key, content, Storage.MINUTES * 15);

                expect(JSON.parse(setItemStub.calls.first().args[1]).expiry).toBeDefined();
            });

            it('should add a valid date string to expiry', () => {
                const key = 'basket';
                const content = { itemCount: 2 };
                Storage.local.setItem(key, content, Storage.MINUTES * 15);
                const expiry = JSON.parse(setItemStub.calls.first().args[1]).expiry;
                expect(Date.parse(expiry).toLocaleString()).toBeTruthy();
            });
        });
    });
});
