import React from 'react';
import { shallow } from 'enzyme';
import { RecentOrdersComponent as RecentOrders } from 'components/RichProfile/MyAccount/RecentOrders/RecentOrders';

describe('<RecentOrders /> component', () => {
    const recentOrdersData = [
        {
            label: 'labelText',
            orderDate: 'date',
            orderId: 'orderId',
            isBopisOrder: true,
            isRopisOrder: false,
            statusDisplayName: 'status'
        },
        {
            orderDate: 'another date',
            orderId: 'another orderId',
            statusDisplayName: 'another status'
        }
    ];
    const wrapper = shallow(<RecentOrders />);
    wrapper.setState({
        recentOrders: recentOrdersData,
        isUserReady: true,
        user: {
            login: 'testuser'
        }
    });

    it('should render an order number', () => {
        recentOrdersData.forEach(order => {
            const orderNumber = wrapper.findWhere(n => n.text() === order.orderId);
            expect(orderNumber.length).toBeGreaterThan(0);
        });
    });

    it('should render an order date', () => {
        recentOrdersData.forEach(order => {
            const orderNumber = wrapper.findWhere(n => n.text() === order.orderDate);
            expect(orderNumber.length).toBeGreaterThan(0);
        });
    });

    it('should render an 3rd Party label if it is an IG order', () => {
        const label = wrapper.findWhere(n => n.prop('data-at') === '3rd_party_order');
        expect(label.length).toBeGreaterThan(0);
    });

    it('should render data-at attribute set to "order_status" for each order', () => {
        const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'order_status');
        expect(dataAt.length).toEqual(recentOrdersData.length);
    });
});
