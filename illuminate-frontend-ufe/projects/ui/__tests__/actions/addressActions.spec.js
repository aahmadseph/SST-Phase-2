import store from 'Store';
import addressUtils from 'utils/Address';
import userActions from 'actions/UserActions';
import AddressActions from 'actions/AddressActions';
import Location from 'utils/Location';

jest.mock('utils/Address');

describe('updateDefaultShippingAddressData', () => {
    beforeEach(() => {
        jest.spyOn(store, 'dispatch');
    });

    test('should update default shipping address in local storage and store when a default address exists', () => {
        const addressList = [
            {
                isDefault: false,
                typeCode: 'S',
                country: 'US',
                postalCode: '12345'
            },
            {
                isDefault: true,
                typeCode: 'S',
                country: 'CA',
                postalCode: '54321'
            }
        ];

        jest.spyOn(userActions, 'updateStoreDefaultShippingAddressData').mockImplementation(() => {});

        AddressActions.updateDefaultShippingAddressData(addressList);

        expect(addressUtils.updateLocalDefaultShippingAddressData).toHaveBeenCalledWith({
            defaultSACountryCode: 'CA',
            defaultSAZipCode: '54321'
        });

        expect(store.dispatch).toHaveBeenCalledWith(
            userActions.updateStoreDefaultShippingAddressData({
                defaultSACountryCode: 'CA',
                defaultSAZipCode: '54321'
            })
        );
    });

    test('should not update anything when no default address exists', () => {
        const addressList = [
            {
                isDefault: false,
                typeCode: 'S',
                country: 'US',
                postalCode: '12345'
            },
            {
                isDefault: false,
                typeCode: 'S',
                country: 'CA',
                postalCode: '54321'
            }
        ];

        AddressActions.updateDefaultShippingAddressData(addressList);

        expect(addressUtils.updateLocalDefaultShippingAddressData).not.toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should not update anything when addressList is not an array', () => {
        const addressList = null;

        AddressActions.updateDefaultShippingAddressData(addressList);

        expect(addressUtils.updateLocalDefaultShippingAddressData).not.toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should not update anything when default address has a different typeCode', () => {
        const addressList = [
            {
                isDefault: true,
                typeCode: 'B',
                country: 'US',
                postalCode: '12345'
            }
        ];

        AddressActions.updateDefaultShippingAddressData(addressList);

        expect(addressUtils.updateLocalDefaultShippingAddressData).not.toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should skip typeCode validation and update default shipping address when the user is on checkout', () => {
        const addressList = [
            {
                isDefault: false,
                country: 'US',
                postalCode: '12345'
            },
            {
                isDefault: true,
                country: 'CA',
                postalCode: '54321'
            }
        ];

        jest.spyOn(Location, 'isCheckout').mockReturnValue(true);

        AddressActions.updateDefaultShippingAddressData(addressList);

        expect(addressUtils.updateLocalDefaultShippingAddressData).toHaveBeenCalledWith({
            defaultSACountryCode: 'CA',
            defaultSAZipCode: '54321'
        });

        expect(store.dispatch).toHaveBeenCalledWith(
            userActions.updateStoreDefaultShippingAddressData({
                defaultSACountryCode: 'CA',
                defaultSAZipCode: '54321'
            })
        );
    });
});
