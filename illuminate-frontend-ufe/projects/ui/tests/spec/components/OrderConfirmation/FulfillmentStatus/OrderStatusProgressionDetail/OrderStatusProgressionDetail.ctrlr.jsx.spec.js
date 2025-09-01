/* eslint-disable no-unused-vars */
const { shallow } = require('enzyme');
const React = require('react');

describe('OrderStatusProgressionDetail', () => {
    let orderStatusProps;
    let OrderStatusProgressionDetail;
    let wrapper;

    beforeEach(() => {
        OrderStatusProgressionDetail = require('components/OrderConfirmation/FulfillmentStatus/OrderStatusProgressionDetail').default;
        orderStatusProps = {
            isLast: false,
            state: 'Ready for Pickup',
            status: 'active',
            storeDetails: {
                address: {
                    address1: '33 Powell Street',
                    address2: '',
                    city: 'San Francisco',
                    country: 'US',
                    crossStreet: 'Powell & Market Streets',
                    fax: '',
                    mallName: '',
                    phone: '(415) 362-9360',
                    postalCode: '94102',
                    state: 'CA'
                },
                displayName: 'Powell Street',
                isBopisable: true,
                isCurbsideEnabled: true,
                isRopisable: false,
                storeId: '0058',
                targetUrl: '/happening/stores/san-francisco-powell-street'
            },
            stateMessages: [
                { message: 'We’ll hold it until *9 PM on Mon, April 21, 2020* (5 days)' },
                { message: 'Upon arrival, notify a .... Please have your *confirmation email* or *photo ID* ready.' },
                { message: 'For *curbside pickup*, see instructions below and call the store when you arrive. ' }
            ],
            isCheckout: false,
            address: {
                address1: '33 Powell Street',
                address2: '',
                city: 'San Francisco',
                country: 'US',
                crossStreet: 'Powell & Market Streets',
                fax: '',
                mallName: '',
                phone: '(415) 362-9360',
                postalCode: '94102',
                state: 'CA'
            },
            isReadyToPickUp: true,
            isProcessing: false,
            isBopisOrder: true,
            index: 1
        };
    });

    it('should not render Call Store button when BOPIS is enabled store phone is not available', () => {
        Sephora.configurationSettings.isBOPISEnabled = true;
        orderStatusProps.storeDetails.address.phone = null;

        wrapper = shallow(<OrderStatusProgressionDetail {...orderStatusProps} />);

        const callStoreButton = wrapper.findWhere(n => n.key() === 'callStore');

        expect(callStoreButton.length).toEqual(0);
    });

    it('should render Call Store button when BOPIS is disabled', () => {
        Sephora.configurationSettings.isBOPISEnabled = false;
        wrapper = shallow(<OrderStatusProgressionDetail {...orderStatusProps} />);

        const callStoreButton = wrapper.findWhere(n => n.key() === 'callStore');

        expect(callStoreButton.length).toEqual(0);
    });

    it('should not render Call Store button when BOPIS is enabled and store isBopisable is set to false', () => {
        Sephora.configurationSettings.isBOPISEnabled = true;
        orderStatusProps.storeDetails.isBopisable = false;

        wrapper = shallow(<OrderStatusProgressionDetail {...orderStatusProps} />);

        const callStoreButton = wrapper.findWhere(n => n.key() === 'callStore');

        expect(callStoreButton.length).toEqual(0);
    });

    it('should not render Call Store button when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
        Sephora.configurationSettings.isBOPISEnabled = true;
        orderStatusProps.storeDetails.isCurbsideEnabled = false;

        wrapper = shallow(<OrderStatusProgressionDetail {...orderStatusProps} />);

        const callStoreButton = wrapper.findWhere(n => n.key() === 'callStore');

        expect(callStoreButton.length).toEqual(0);
    });

    it('should not render Call Store button when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
        Sephora.configurationSettings.isBOPISEnabled = true;
        orderStatusProps.storeDetails.isBopisable = false;
        orderStatusProps.storeDetails.isCurbsideEnabled = false;

        wrapper = shallow(<OrderStatusProgressionDetail {...orderStatusProps} />);

        const callStoreButton = wrapper.findWhere(n => n.key() === 'callStore');

        expect(callStoreButton.length).toEqual(0);
    });
});
