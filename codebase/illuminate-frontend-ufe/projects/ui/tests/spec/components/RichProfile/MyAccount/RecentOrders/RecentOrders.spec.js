import React from 'react';
import { shallow } from 'enzyme';
import { RecentOrdersComponent as RecentOrders } from 'components/RichProfile/MyAccount/RecentOrders/RecentOrders';
import store from 'store/Store';
import UrlUtils from 'utils/Url';
import OrderUtils from 'utils/Order';

const recentOrdersData = [
    {
        label: 'labelText',
        orderDate: 'date',
        orderId: 'orderId',
        isBopisOrder: true,
        isRopisOrder: false,
        statusDisplayName: 'status'
    }
];

describe('RecentOrders component', () => {
    let component;
    let dispatchSpy;
    let loadNextPageSpy;
    let purchasesByDate;
    let purchasesByFreq;
    let purchasesByDateAndFreq;

    describe('handleViewDetailsClick method', () => {
        beforeEach(() => {
            spyOn(UrlUtils, 'redirectTo');
            spyOn(OrderUtils, 'getOrderDetailsUrl').and.returnValue('url');

            const wrapper = shallow(<RecentOrders />);
            wrapper.setState({
                recentOrders: recentOrdersData,
                isUserReady: true,
                user: {
                    login: 'testuser'
                }
            });
            wrapper.find('Button').simulate('click');
        });

        it('should call redirectTo method of URL utils', () => {
            expect(UrlUtils.redirectTo).toHaveBeenCalledTimes(1);
        });

        it('should call redirectTo method of URL utils with params', () => {
            expect(UrlUtils.redirectTo).toHaveBeenCalledWith('url');
        });
    });

    describe('handleShowMoreClick method', () => {
        beforeEach(() => {
            const wrapper = shallow(<RecentOrders />);
            component = wrapper.instance();
            loadNextPageSpy = spyOn(component, 'loadNextPage');
            component.handleShowMoreClick();
        });

        it('should call loadNextPage method', () => {
            expect(loadNextPageSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('loadNextPage method', () => {
        beforeEach(() => {
            dispatchSpy = spyOn(store, 'dispatch');

            const wrapper = shallow(<RecentOrders />);
            component = wrapper.instance();

            component.loadNextPage();
        });

        it('should call dispatch method of store', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('sortPurchasesByDate method', () => {
        beforeEach(() => {
            purchasesByDate = [{ transactionDate: '08/20/2019' }, { transactionDate: '09/08/2019' }, { transactionDate: '08/22/2019' }];

            const wrapper = shallow(<RecentOrders />);
            component = wrapper.instance();
        });

        it('should sort purchases by most recent date', () => {
            const expectedResult = [{ transactionDate: '09/08/2019' }, { transactionDate: '08/22/2019' }, { transactionDate: '08/20/2019' }];

            const sortedPurchases = component.sortPurchasesByDate(purchasesByDate);
            sortedPurchases.forEach((product, index) => {
                expect(product.transactionDate).toEqual(expectedResult[index].transactionDate);
            });
        });
    });
    describe('sortPurchasesByFrequency method', () => {
        beforeEach(() => {
            purchasesByFreq = [{ frequency: 2 }, { frequency: 1 }, { frequency: 3 }];

            const wrapper = shallow(<RecentOrders />);
            component = wrapper.instance();
        });

        it('should sort purchases by frequency', () => {
            const expectedResult = [{ frequency: 3 }, { frequency: 2 }, { frequency: 1 }];

            const sortedPurchases = component.sortPurchasesByFrequency(purchasesByFreq);
            sortedPurchases.forEach((product, index) => {
                expect(product.frequency).toEqual(expectedResult[index].frequency);
            });
        });
        it('should return product if only one item in list', () => {
            const singlePurchase = [{ frequency: 1 }];

            const sortedPurchases = component.sortPurchasesByFrequency(singlePurchase);
            expect(sortedPurchases).toEqual(singlePurchase);
        });
    });
    describe('sorting by date then frequency', () => {
        beforeEach(() => {
            purchasesByDateAndFreq = [
                {
                    name: 'Product A',
                    transactionDate: '04/18/2017',
                    frequency: 2
                },
                {
                    name: 'Product B',
                    transactionDate: '09/08/2019',
                    frequency: 1
                },
                {
                    name: 'Product C',
                    transactionDate: '08/22/2019',
                    frequency: 3
                },
                {
                    name: 'Product D',
                    transactionDate: '08/22/2019',
                    frequency: 2
                },
                {
                    name: 'Product E',
                    transactionDate: '08/22/2019',
                    frequency: 2
                },
                {
                    name: 'Product F',
                    transactionDate: '09/08/2019',
                    frequency: 3
                }
            ];

            const wrapper = shallow(<RecentOrders />);
            component = wrapper.instance();
        });

        it('should return a list sorted by date, then by frequency', () => {
            const expectedResult = [
                {
                    name: 'Product F',
                    transactionDate: '09/08/2019',
                    frequency: 3
                },
                {
                    name: 'Product C',
                    transactionDate: '08/22/2019',
                    frequency: 3
                },
                {
                    name: 'Product D',
                    transactionDate: '08/22/2019',
                    frequency: 2
                },
                {
                    name: 'Product E',
                    transactionDate: '08/22/2019',
                    frequency: 2
                },
                {
                    name: 'Product A',
                    transactionDate: '04/18/2017',
                    frequency: 2
                },
                {
                    name: 'Product B',
                    transactionDate: '09/08/2019',
                    frequency: 1
                }
            ];

            const sortedPurchases = component.sortPurchasesByFrequency(component.sortPurchasesByDate(purchasesByDateAndFreq));
            expect(sortedPurchases).toEqual(expectedResult);
        });
    });
});
