describe('LoveActions', () => {
    const { createSpy } = jasmine;
    const Actions = require('actions/LoveActions').default;
    const shoppingList = require('services/api/profile/shoppingList').default;
    const store = require('store/Store').default;

    let result;
    let dispatchStub;
    let getShoppingListStub;
    let addItemsToShoppingListStub;
    let removeItemsFromShoppingListStub;
    let successCB;
    let failureCB;
    let getState;

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        addItemsToShoppingListStub = spyOn(shoppingList, 'addItemsToShoppingList');
        removeItemsFromShoppingListStub = spyOn(shoppingList, 'removeItemsFromShoppingList');

        successCB = createSpy();
        failureCB = createSpy();

        getState = createSpy().and.returnValue({ testTarget: { readyState: 2 }, user: { profileId: 1 }, loves: { lovesSelectedSort: 'recently' } });
    });

    describe('updateLovesList', () => {
        const Storage = require('utils/localStorage/Storage').default;
        const loves = [{}, {}];
        const totalLovesListItemsCount = 2;
        const shareLink = 'myUpdatedLink';
        const updatedShoppingListData = {
            loves,
            totalLovesListItemsCount,
            shareLink
        };

        let setItemStub;

        beforeEach(() => {
            setItemStub = spyOn(Storage.local, 'setItem');

            Actions.updateLovesList({
                loves: [{}],
                totalLovesListItemsCount: 2,
                shareLink: 'myLink'
            });

            result = Actions.updateLovesList(updatedShoppingListData);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_LOVES_LIST);
        });

        it('should set the current loves list', () => {
            expect(result.currentLoves).toEqual(loves);
        });

        it('should set the total of items in the list', () => {
            expect(result.totalLovesListItemsCount).toEqual(totalLovesListItemsCount);
        });

        it('should set the link to share', () => {
            expect(result.shareLink).toEqual(shareLink);
        });

        it('should save the list in local storage', () => {
            expect(setItemStub).toHaveBeenCalledWith('LOVES_DATA', updatedShoppingListData, 900000);
        });
    });

    describe('updatePublicLovesList', () => {
        const loves = [{}, {}];
        const totalPublicLovesListItemsCount = 2;

        const updatedPublicLovesList = {
            loves,
            totalPublicLovesListItemsCount
        };

        beforeEach(() => {
            Actions.updatePublicLovesList({
                loves: [{}],
                totalPublicLovesListItemsCount: 1
            });
            result = Actions.updatePublicLovesList(updatedPublicLovesList);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_PUBLIC_LOVES_LIST);
        });

        it('should set the list of public loves', () => {
            expect(result.publicLoves).toEqual(loves);
        });

        it('should set the total items of the list', () => {
            expect(result.totalPublicLovesListItemsCount).toEqual(totalPublicLovesListItemsCount);
        });
    });

    describe('updateShoppingListIds', () => {
        const shoppingListIds = [3, 4];

        beforeEach(() => {
            Actions.updateShoppingListIds([1, 2]);
            result = Actions.updateShoppingListIds(shoppingListIds);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_SHOPPING_LIST_IDS);
        });

        it('should update the list of ids', () => {
            expect(result.shoppingListIds).toEqual(shoppingListIds);
        });
    });

    describe('getLovesList', () => {
        const resolveData = {
            shoppingListItems: [],
            shoppingListItemsCount: 0
        };

        beforeEach(() => {
            getShoppingListStub = spyOn(shoppingList, 'getShoppingList');
        });

        it('should call to getShoppingList', done => {
            getShoppingListStub.and.returnValue({ then: () => done() });
            Actions.getLovesList(1, () => {}, false)(dispatchStub, getState);
            expect(getShoppingListStub).toHaveBeenCalledWith(1, { itemsPerPage: 100, sortBy: 'recently' }, false);
        });

        it('should call to callback if is passed', done => {
            const callback = createSpy();
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(callback).toHaveBeenCalledWith([]);
                    done();
                }
            };

            getShoppingListStub.and.returnValue(fakePromise);
            Actions.getLovesList(1, callback, false)(dispatchStub, getState);
        });

        it('should not call to callback if is not defined', done => {
            const callback = createSpy();
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(callback).not.toHaveBeenCalled();
                    done();
                }
            };

            getShoppingListStub.and.returnValue(fakePromise);
            Actions.getLovesList(1, null, false)(dispatchStub, getState);
        });

        it('should dispatch updateShoppingListIds if isUpdateShoppingList is true', done => {
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(dispatchStub.calls.argsFor(0)[0]).toEqual({
                        shoppingListIds: [],
                        type: 'UPDATE_SHOPPING_LIST_IDS'
                    });
                    done();
                }
            };

            getShoppingListStub.and.returnValue(fakePromise);
            Actions.getLovesList(1, () => {}, true)(dispatchStub, getState);
        });

        it('should not dispatch updateShoppingListIds if isUpdateShoppingList is false', done => {
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(dispatchStub).toHaveBeenCalledTimes(1);
                    done();
                }
            };

            getShoppingListStub.and.returnValue(fakePromise);
            Actions.getLovesList(1, () => {}, false)(dispatchStub, getState);
        });
    });

    describe('setLovesList', () => {
        const shoppingListData = {
            shoppingListItems: [],
            loves: [{}],
            shoppingListItemsCount: 0,
            totalLovesListItemsCount: 0,
            shareLink: 'mylink'
        };

        it('should return null if shopping list is empty', () => {
            result = Actions.setLovesList({})(dispatchStub);
            expect(result).toBeNull();
        });

        it('should dispatch updateShoppingListIds action if has items', () => {
            Actions.setLovesList(shoppingListData)(dispatchStub);
            expect(dispatchStub.calls.argsFor(0)[0]).toEqual({
                type: 'UPDATE_SHOPPING_LIST_IDS',
                shoppingListIds: []
            });
        });

        it('should dispatch updateLovesList action if has items', () => {
            Actions.setLovesList(shoppingListData)(dispatchStub);
            expect(dispatchStub.calls.argsFor(1)[0]).toEqual({
                type: 'UPDATE_LOVES_LIST',
                currentLoves: [],
                totalLovesListItemsCount: 0,
                shareLink: 'mylink'
            });
        });
    });

    describe('addLove', () => {
        it('should call to addItemsToShoppingList', () => {
            addItemsToShoppingListStub.and.returnValue(Promise.resolve());
            Actions.addLove([], () => {})(dispatchStub, getState);

            expect(addItemsToShoppingListStub).toHaveBeenCalledWith([], false);
        });

        it('should call success callback on success', done => {
            const fakePromise = {
                then: resolve => {
                    resolve([{}]);
                    expect(successCB).toHaveBeenCalledWith({});
                    done();

                    return fakePromise;
                },
                catch: () => {}
            };

            addItemsToShoppingListStub.and.returnValue(fakePromise);
            Actions.addLove([{}], successCB, failureCB)(dispatchStub, getState);
        });

        it('should call failure callback on failure', done => {
            const fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: reject => {
                    reject();
                    expect(failureCB).toHaveBeenCalled();
                    done();
                }
            };

            addItemsToShoppingListStub.and.returnValue(fakePromise);
            Actions.addLove([{}], successCB, failureCB)(dispatchStub, getState);
        });
    });

    describe('removeLove', () => {
        it('should call to addItemsToShoppingList', () => {
            removeItemsFromShoppingListStub.and.returnValue(Promise.resolve());
            Actions.removeLove([], successCB, failureCB)(dispatchStub, getState);

            expect(removeItemsFromShoppingListStub).toHaveBeenCalledWith([], 1, undefined, false);
        });

        it('should call success callback on success', done => {
            const fakePromise = {
                then: resolve => {
                    resolve([{}]);
                    expect(successCB).toHaveBeenCalledWith({});
                    done();

                    return fakePromise;
                },
                catch: () => {}
            };

            removeItemsFromShoppingListStub.and.returnValue(fakePromise);
            Actions.removeLove([{}], successCB, failureCB)(dispatchStub, getState);
        });

        it('should call failure callback on failure', done => {
            const fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: reject => {
                    reject();
                    expect(failureCB).toHaveBeenCalled();
                    done();
                }
            };

            removeItemsFromShoppingListStub.and.returnValue(fakePromise);
            Actions.removeLove([{}], successCB, failureCB)(dispatchStub, getState);
        });
    });
});
