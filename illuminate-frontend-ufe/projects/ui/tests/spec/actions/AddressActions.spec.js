import AddressActions from 'actions/AddressActions';
import Actions from 'actions/Actions';
import profileApi from 'services/api/profile';
import utilityApi from 'services/api/utility';
import store from 'store/Store';
import analyticsAddress from 'analytics/bindingMethods/pages/myAccount/addressPageBindings';

describe('AddressActions', () => {
    let getShippingAddressesStub;
    let setDefaultShippingAddressStub;
    let removeShippingAddressStub;
    let addShippingAddressStub;
    let updateShippingAddressStub;

    let getStateListStub;
    let getShippingCountryListStub;
    let validateAddressStub;

    let showAddressVerificationModalStub;

    let successCallbackStub;
    let failureCallbackStub;
    let fakePromise;

    let handleAnalyticCallbackStub;
    let handleAnalyticAsyncLoadStub;

    let dispatchStub;

    const { createSpy } = jasmine;

    beforeEach(() => {
        getShippingAddressesStub = spyOn(profileApi, 'getShippingAddresses');
        setDefaultShippingAddressStub = spyOn(profileApi, 'setDefaultShippingAddress');
        removeShippingAddressStub = spyOn(profileApi, 'removeShippingAddress');
        addShippingAddressStub = spyOn(profileApi, 'addShippingAddress');
        updateShippingAddressStub = spyOn(profileApi, 'updateShippingAddress');

        getStateListStub = spyOn(utilityApi, 'getStateList');
        getShippingCountryListStub = spyOn(utilityApi, 'getShippingCountryList');
        validateAddressStub = spyOn(utilityApi, 'validateAddress');

        handleAnalyticCallbackStub = spyOn(analyticsAddress, 'handleAnalyticCallback');
        handleAnalyticAsyncLoadStub = spyOn(analyticsAddress, 'handleAnalyticAsyncLoad');

        dispatchStub = spyOn(store, 'dispatch');

        successCallbackStub = createSpy();
        failureCallbackStub = createSpy();
    });

    function getEmptyFakePromise(done) {
        return {
            then: function () {
                done();

                return this;
            },
            catch: function () {}
        };
    }

    function getSuccessFakePromise(done) {
        return {
            then: function (resolve) {
                resolve();
                expect(successCallbackStub).toHaveBeenCalled();
                done();

                return this;
            },
            catch: function () {}
        };
    }

    function getfailureFakePromise(done) {
        return {
            then: function () {
                return this;
            },
            catch: function (resolve) {
                resolve();
                expect(failureCallbackStub).toHaveBeenCalled();
                done();
            }
        };
    }

    describe('getSavedAddresses', () => {
        it('should call to getShippingAddresses', done => {
            getShippingAddressesStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.getSavedAddresses(1, successCallbackStub);
            expect(getShippingAddressesStub).toHaveBeenCalledWith(1);
        });

        it('should call callback in getShippingAddresses', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve({ addressList: [] });
                    expect(successCallbackStub).toHaveBeenCalledWith([]);
                    done();

                    return fakePromise;
                }
            };

            getShippingAddressesStub.and.returnValue(fakePromise);
            AddressActions.getSavedAddresses(1, successCallbackStub);
        });
    });

    describe('setDefaultAddress', () => {
        // TODO: Error: An asynchronous spec, beforeEach, or afterEach function called its 'done' callback more than once.
        // it('should call to setDefaultShippingAddress', done => {
        //     setDefaultShippingAddressStub.and.returnValue(getEmptyFakePromise(done));
        //     AddressActions.setDefaultAddress(1, 1, successCallbackStub);
        //     expect(setDefaultShippingAddressStub).toHaveBeenCalledWith(1);
        // });

        // TODO: Error: An asynchronous spec, beforeEach, or afterEach function called its 'done' callback more than once.
        // it('should call to getShippingAddresses', done => {
        //     fakePromise = {
        //         then: function (resolve) {
        //             resolve({ addressList: [] });
        //             expect(getShippingAddressesStub).toHaveBeenCalledWith(1);
        //             done();

        //             return fakePromise;
        //         }
        //     };

        //     setDefaultShippingAddressStub.and.returnValue(fakePromise);
        //     AddressActions.setDefaultAddress(1, 1, successCallbackStub);
        // });

        it('should call to successCallback', done => {
            fakePromise = {
                then: function () {
                    return {
                        then: function (resolve) {
                            resolve({ addressList: [] });
                            expect(successCallbackStub).toHaveBeenCalledWith([]);
                            done();
                        }
                    };
                }
            };

            setDefaultShippingAddressStub.and.returnValue(fakePromise);
            AddressActions.setDefaultAddress(1, 1, successCallbackStub);
        });
    });

    describe('deleteAddress', () => {
        it('should call to removeShippingAddress', done => {
            removeShippingAddressStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.deleteAddress(1, 1, successCallbackStub, failureCallbackStub);
            expect(removeShippingAddressStub).toHaveBeenCalledWith(1, 1);
        });

        it('should call to successCallbackStub', done => {
            removeShippingAddressStub.and.returnValue(getSuccessFakePromise(done));
            AddressActions.deleteAddress(1, 1, successCallbackStub, failureCallbackStub);
        });

        it('should call to failureCallbackStub', done => {
            removeShippingAddressStub.and.returnValue(getfailureFakePromise(done));
            AddressActions.deleteAddress(1, 1, successCallbackStub, failureCallbackStub);
        });
    });

    describe('addNewAddress', () => {
        it('should call to addShippingAddress', done => {
            addShippingAddressStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.addNewAddress({}, successCallbackStub, failureCallbackStub);
            expect(addShippingAddressStub).toHaveBeenCalledWith({});
        });

        it('should call to successCallbackStub', done => {
            addShippingAddressStub.and.returnValue(getSuccessFakePromise(done));
            AddressActions.addNewAddress({}, successCallbackStub, failureCallbackStub);
        });

        it('should call to failureCallbackStub', done => {
            addShippingAddressStub.and.returnValue(getfailureFakePromise(done));
            AddressActions.addNewAddress({}, successCallbackStub, failureCallbackStub);
        });
    });

    describe('updateAddress', () => {
        it('should call to updateShippingAddress', done => {
            updateShippingAddressStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.updateAddress({}, successCallbackStub, failureCallbackStub);
            expect(updateShippingAddressStub).toHaveBeenCalledWith({});
        });

        it('should call to successCallbackStub', done => {
            updateShippingAddressStub.and.returnValue(getSuccessFakePromise(done));
            AddressActions.updateAddress({}, successCallbackStub, failureCallbackStub);
        });

        it('should call to failureCallbackStub', done => {
            updateShippingAddressStub.and.returnValue(getfailureFakePromise(done));
            AddressActions.updateAddress({}, successCallbackStub, failureCallbackStub);
        });
    });

    describe('getStateList', () => {
        it('should call to getStateList', done => {
            getStateListStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.getStateList(1, successCallbackStub);
            expect(getStateListStub).toHaveBeenCalledWith(1);
        });

        it('should call to successCallbackStub', done => {
            getStateListStub.and.returnValue(getSuccessFakePromise(done));
            AddressActions.getStateList(1, successCallbackStub);
        });
    });

    describe('getShippingCountriesList', () => {
        it('should call to getShippingCountryList', done => {
            getShippingCountryListStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.getShippingCountriesList(successCallbackStub);
            expect(getShippingCountryListStub).toHaveBeenCalled();
        });

        it('should call to successCallbackStub', done => {
            getShippingCountryListStub.and.returnValue(getSuccessFakePromise(done));
            AddressActions.getShippingCountriesList(successCallbackStub);
        });
    });

    describe('validateAddress', () => {
        let addressData;
        let successCallbackObj;
        let recommendedStub;
        let cancelCallbackStub;

        beforeEach(() => {
            cancelCallbackStub = createSpy();
            recommendedStub = createSpy();

            addressData = {
                address1: 'my address1',
                address2: 'my address2',
                state: 'my state',
                city: 'my city',
                postalCode: '12345',
                country: 'US'
            };
            successCallbackObj = { RECOMMENDED: recommendedStub };

            showAddressVerificationModalStub = spyOn(Actions, 'showAddressVerificationModal');
        });

        afterEach(function () {
            digitalData.page.category.pageType = '';
        });

        it('should call to validateAddress', done => {
            const dataToSend = {
                address1: `${addressData.address1} ${addressData.address2}`,
                state: addressData.state,
                city: addressData.city,
                postalCode: addressData.postalCode,
                country: addressData.country
            };

            validateAddressStub.and.returnValue(getEmptyFakePromise(done));
            AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            expect(validateAddressStub).toHaveBeenCalledWith(dataToSend);
        });

        describe('recommended address', () => {
            it('should call to dispatch', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        expect(dispatchStub).toHaveBeenCalledWith(showAddressVerificationModalStub());

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to showAddressVerificationModal', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        showAddressVerificationModalStub({
                            isOpen: true,
                            verificationType: 'RECOMMENDED',
                            currentAddress: addressData,
                            recommendedAddress: { country: 'US' },
                            cancelCallback: createSpy(),
                            successCallback: createSpy()
                        });

                        expect(showAddressVerificationModalStub).toHaveBeenCalled();

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to success recommended in successCallback', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        showAddressVerificationModalStub.calls.argsFor(0)[0].successCallback();
                        expect(recommendedStub).toHaveBeenCalledWith({ country: 'US' });

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to handleAnalyticCallback in successCallback', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        showAddressVerificationModalStub.calls.argsFor(0)[0].successCallback();
                        expect(handleAnalyticCallbackStub).toHaveBeenCalledWith('recommended');

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to cancelCallback argument in cancelCallback', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        showAddressVerificationModalStub.calls.argsFor(0)[0].cancelCallback();
                        expect(cancelCallbackStub).toHaveBeenCalledWith();

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to handleAnalyticCallback in cancelCallback', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });
                        showAddressVerificationModalStub.calls.argsFor(0)[0].cancelCallback();
                        expect(handleAnalyticCallbackStub).toHaveBeenCalledWith('entered');

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to handleAnalyticAsyncLoad', done => {
                digitalData.page.category.pageType = 'my pageType';

                fakePromise = {
                    then: function (resolve) {
                        resolve({ matchedAddresses: [{ country: 'US' }] });

                        expect(handleAnalyticAsyncLoadStub).toHaveBeenCalledWith('my pageType', 'shipping-use recommended address');

                        return fakePromise;
                    },
                    catch: function () {
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });
        });

        describe('double-check', () => {
            it('should call to dispatch', done => {
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject();
                        expect(dispatchStub).toHaveBeenCalledWith(showAddressVerificationModalStub());
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to showAddressVerificationModal', done => {
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject();

                        showAddressVerificationModalStub({
                            isOpen: true,
                            verificationType: 'UNVERIFIED',
                            currentAddress: addressData,
                            recommendedAddress: { country: 'US' },
                            cancelCallback: createSpy(),
                            successCallback: createSpy()
                        });

                        expect(showAddressVerificationModalStub).toHaveBeenCalled();

                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should not call to handleAnalyticAsyncLoad if pageType is not checkout', done => {
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject();

                        expect(handleAnalyticAsyncLoadStub).not.toHaveBeenCalled();

                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });

            it('should call to handleAnalyticAsyncLoad if pageType is checkout', done => {
                digitalData.page.category.pageType = 'checkout';

                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject();
                        expect(handleAnalyticAsyncLoadStub).toHaveBeenCalledWith('checkout', 'shipping-double check your address');
                        done();
                    }
                };

                validateAddressStub.and.returnValue(fakePromise);
                AddressActions.validateAddress(addressData, successCallbackObj, cancelCallbackStub);
            });
        });
    });
});
