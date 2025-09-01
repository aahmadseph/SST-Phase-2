const React = require('react');
const { shallow } = require('enzyme');

describe('PurchaseHistoryList component', () => {
    let store;
    let auth;
    let Events;
    let PurchaseHistoryList;
    let eventSpy;
    let authSpy;
    let dispatchStub;
    let component;
    let userUtils;
    let watchActionSpy;
    let setAndWatchSpy;
    let getPurchaseHistoryStub;
    let filterOptions;
    let biApi;
    const BI_REGISTER_MODAL_ACTION = 'SHOW_BI_REGISTER_MODAL';

    beforeEach(() => {
        store = require('Store').default;
        auth = require('utils/Authentication').default;
        Events = Sephora.Util;
        PurchaseHistoryList = require('components/RichProfile/PurchaseHistoryList/PurchaseHistoryList').default;
        userUtils = require('utils/User').default;
        filterOptions = require('components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions').LIST;
        biApi = require('services/api/beautyInsider').default;
        eventSpy = spyOn(Events, 'onLastLoadEvent');
        spyOn(userUtils, 'isAnonymous').and.returnValue(true);
        spyOn(userUtils, 'isBI').and.returnValue(true);
        spyOn(store, 'getState').and.returnValue({ user: { profileId: 12345678 } });
    });

    describe('#Ctrlr method', () => {
        beforeEach(() => {
            setAndWatchSpy = spyOn(store, 'setAndWatch');
            watchActionSpy = spyOn(store, 'watchAction');
            getPurchaseHistoryStub = spyOn(biApi, 'getPurchaseHistory').and.returnValue({ then: () => {} });
            const wrapper = shallow(<PurchaseHistoryList />);
            component = wrapper.instance();
            component.componentDidMount();
        });

        it('should set the correct state', () => {
            eventSpy.calls.first().args[2]();
            setAndWatchSpy.calls.first().args[2]({ user: { profileId: '123456789' } });

            expect(component.state).toEqual({
                currentUserId: '123456789',
                isAnonymous: true,
                isBI: true,
                itemsPerPage: 10,
                purchasedItemsCount: 0,
                filterOptions: filterOptions
            });
        });

        it('should watch action and set purchasedItemsCount on dispatch', () => {
            watchActionSpy.calls.first().args[1]({ purchasedItemsCount: 100 });
            expect(component.state.purchasedItemsCount).toEqual(100);
        });

        it('should fetch recent purchases', () => {
            expect(getPurchaseHistoryStub).toHaveBeenCalled();
        });

        it('should set purchases sorted in the state', done => {
            const fakePromise = {
                then: function (resolve) {
                    resolve({
                        purchasedItems: [
                            {
                                frequency: 1,
                                transactionDate: '08/28/2018',
                                sku: '123456'
                            },
                            {
                                frequency: 1,
                                transactionDate: '08/28/2019',
                                sku: '1234567'
                            },
                            {
                                frequency: 2,
                                transactionDate: '06/25/2019',
                                sku: '12345678'
                            }
                        ]
                    });

                    expect(component.state.sortedPurchases).toEqual([
                        {
                            frequency: 2,
                            transactionDate: '06/25/2019',
                            sku: '12345678'
                        },
                        {
                            frequency: 1,
                            transactionDate: '08/28/2019',
                            sku: '1234567'
                        },
                        {
                            frequency: 1,
                            transactionDate: '08/28/2018',
                            sku: '123456'
                        }
                    ]);

                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            getPurchaseHistoryStub.and.returnValue(fakePromise);
            component.componentDidMount();
        });
    });

    describe('#handleButtonClick method', () => {
        beforeEach(() => {
            component = new PurchaseHistoryList({});
            authSpy = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
            dispatchStub = spyOn(store, 'dispatch');
        });

        it('should require auth if user anonymous', () => {
            component.state = { isAnonymous: true };
            component.handleButtonClick();
            expect(authSpy).toHaveBeenCalled();
        });

        it('should dispatch showBiRegisterModal action', () => {
            component.state = { isAnonymous: false };
            component.handleButtonClick();
            const args = dispatchStub.calls.first().args[0];
            expect(args.type).toEqual(BI_REGISTER_MODAL_ACTION);
            expect(args.isOpen).toEqual(true);
        });
    });
});
