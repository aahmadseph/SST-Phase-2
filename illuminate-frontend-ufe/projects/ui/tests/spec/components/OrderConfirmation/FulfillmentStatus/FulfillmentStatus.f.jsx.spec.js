/* eslint-disable no-unused-vars */
const { shallow } = require('enzyme');
const React = require('react');
const dataAt = ['preparing_your_order', 'ready_for_pickup', 'order_picked_up'];

const buildPickupOrderStates = (status1, status2, status3) => [
    {
        state: 'Preparing Your Order',
        status: status1
    },
    {
        state: 'Ready for Pickup at Houston Galleria Mall',
        stateMessages: [
            { message: 'We’ll hold your order until **7:00PM on Fri, October 23** (3 days)' },
            {
                message:
                    'Upon arrival, notify the line coordinator at the door that you’re picking up an order, and you will receive priority store access through the Fast Track line.'
            }
        ],
        status: status2
    },
    {
        state: 'Order Picked Up',
        status: status3
    }
];
const ActiveStates = [
    buildPickupOrderStates('active', 'pending', 'pending'),
    buildPickupOrderStates('completed', 'active', 'pending'),
    buildPickupOrderStates('completed', 'completed', 'active')
];

const props = {
    storeDetails: { displayName: 'Houston Galleria Mall' },
    pickupOrderStates: ActiveStates[2],
    isCheckout: false,
    isReadyToPickUp: true,
    isProcessing: false,
    address: {
        address1: '5015 Westheimer',
        address2: 'Suite 2380',
        city: 'Houston',
        country: 'US',
        postalCode: '77056',
        state: 'TX'
    }
};

describe('Component <FulfillmentStatus />', () => {
    let FulfillmentStatus;
    let wrapper;
    let ProgressionDetails;

    beforeEach(() => {
        FulfillmentStatus = require('components/OrderConfirmation/FulfillmentStatus').default;
        wrapper = shallow(<FulfillmentStatus {...props} />);
    });

    describe('Should display proper data-at attributes order states', () => {
        beforeEach(() => {
            ProgressionDetails = wrapper.find('OrderStatusProgressionDetail').map(node => node.shallow());
        });
        it('in titles', () => {
            ProgressionDetails.forEach((node, index) => {
                expect(node.find('Text').at(0).prop('data-at')).toBe(`${dataAt[index]}_title`);
            });
        });

        it('in checkmarks', () => {
            ProgressionDetails.forEach((node, index) => {
                expect(node.find('Icon').prop('data-at')).toBe(`${dataAt[index]}_checkmark_icon`);
            });
        });
    });
});
