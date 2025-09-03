const React = require('react');
const { shallow } = require('enzyme');

describe('Rich Profile Lists Tab', () => {
    const store = require('store/Store').default;
    const biApi = require('services/api/beautyInsider').default;
    const Lists = require('components/RichProfile/Lists/Lists').default;
    const userUtils = require('utils/User').default;

    const user = { profileId: '7034060531' };

    let fakePromise = {
        then: function () {
            return fakePromise;
        },
        catch: function () {
            return fakePromise;
        }
    };

    let component;
    const purchaseHistoryOptions = {
        sortBy: 'recently',
        groupBy: 'none',
        excludeSamples: false,
        excludeRewards: false,
        itemsPerPage: 12
    };

    beforeEach(() => {
        spyOn(store, 'getState').and.returnValue({ user });
        spyOn(userUtils, 'isBI').and.returnValue(true);
        const wrapper = shallow(<Lists />);
        component = wrapper.instance();
    });

    describe('#getPurchaseHistory method', () => {
        it('should call getPurchaseHistory biApi method with the user from the store', () => {
            spyOn(biApi, 'getPurchaseHistory').and.returnValue({ then: () => ({ catch: () => {} }) });
            new Lists({}).getPurchaseHistory();
            expect(biApi.getPurchaseHistory).toHaveBeenCalledWith(user.profileId, purchaseHistoryOptions);
        });

        it('should update state with purchased items ', () => {
            fakePromise = {
                then: resolve => {
                    resolve({ purchasedItems: [{ item: 'item1' }, { item: 'item2' }] });
                    expect(component.state.pastPurchases).toEqual([{ item: 'item1' }, { item: 'item2' }]);

                    return fakePromise;
                },
                catch: () => {}
            };

            spyOn(biApi, 'getPurchaseHistory').and.returnValue(fakePromise);
            component.getPurchaseHistory();
        });

        it('should update state with purchased items ', () => {
            fakePromise = {
                then: resolve => {
                    resolve({ purchasedItems: [] });
                    expect(component.state.pastPurchases).toEqual([]);

                    return fakePromise;
                },
                catch: () => {}
            };

            spyOn(biApi, 'getPurchaseHistory').and.returnValue(fakePromise);
            component.getPurchaseHistory();
        });
    });

    describe('#biRegisterHandler method', () => {
        it('should call dispatch', () => {
            const dispatchSpy = spyOn(store, 'dispatch');
            const wrapper = shallow(<Lists />);
            component = wrapper.instance();
            component.biRegisterHandler();
            expect(dispatchSpy).toHaveBeenCalled();
        });

        it('should call subscribe', () => {
            const subscribeSpy = spyOn(store, 'subscribe');
            const wrapper = shallow(<Lists />);
            component = wrapper.instance();
            component.biRegisterHandler();
            expect(subscribeSpy).toHaveBeenCalled();
        });
    });
});
