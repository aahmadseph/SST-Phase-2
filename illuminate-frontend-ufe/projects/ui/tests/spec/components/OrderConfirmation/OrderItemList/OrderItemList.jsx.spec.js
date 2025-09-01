/* eslint-disable no-unused-vars */
describe('OrderListItem', () => {
    const OrderItemList = require('components/OrderConfirmation/OrderItemList/OrderItemList').default;
    let React;
    let ReactDOM;
    let ReactTestUtils;
    let shallowComponent;
    let props;
    let isDesktopStub;
    let isMobileStub;

    beforeEach(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        ReactTestUtils = require('react-dom/test-utils');
        props = {
            items: [
                {
                    modifiable: true,
                    qty: 2,
                    sku: {
                        targetUrl: null,
                        type: 'BI',
                        productId: 'P0001'
                    }
                },
                {
                    modifiable: true,
                    qty: 1,
                    sku: {
                        targetUrl: null,
                        type: 'BI',
                        productId: 'P0002'
                    }
                }
            ]
        };
    });

    describe('OrderListItem', () => {
        let shallowComponentNoProps;
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<OrderItemList items={props.items} />);
            shallowComponentNoProps = enzyme.shallow(<OrderItemList items={[]} />);
        });

        it('should have as many OrderItem as props.items passed', () => {
            const OrderItems = shallowComponent.find('OrderItem');
            expect(OrderItems.length).toBe(props.items.length);
        });

        it('should not have any OrderItem if there\'s no prop.items', () => {
            const OrderItems = shallowComponentNoProps.find('OrderItem');
            expect(OrderItems.length).toBe(0);
        });
    });

    // describe('Desktop OrderListItem', () => {
    //     beforeEach(() => {
    //         isDesktopStub = spyOn(Sephora, 'isDesktop').and.returnValue(true);
    //         shallowComponent = enzyme.shallow(<OrderItemList items={props.items} />);
    //     });

    //     afterEach(() => {
    //         isDesktopStub.restore();
    //     });
    // });

    // describe('Mobile OrderListItem', () => {
    //     beforeEach(() => {
    //         isMobileStub = spyOn(Sephora, 'isMobile').and.returnValue(true);
    //         shallowComponent = enzyme.shallow(<OrderItemList items={props.items} />);
    //     });

    //     afterEach(() => {
    //         isMobileStub.restore();
    //     });
    // });
});
