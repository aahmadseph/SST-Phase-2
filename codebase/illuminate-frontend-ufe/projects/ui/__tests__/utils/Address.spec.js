import addressUtils from 'utils/Address';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UserUtils from 'utils/User';

const { updateLocalDefaultShippingAddressData } = addressUtils;

jest.mock('utils/localStorage/Storage', () => ({
    local: {
        getItem: jest.fn(),
        setItem: jest.fn()
    }
}));

describe('updateLocalDefaultShippingAddressData', () => {
    const mockDefaultSAData = {
        defaultSACountryCode: 'US',
        defaultSAZipCode: '90210'
    };

    beforeEach(() => {
        Storage.local.getItem.mockReset();
        Storage.local.setItem.mockReset();
    });

    test('should not update if userData is not found in localStorage in case of anonymous users', () => {
        Storage.local.getItem.mockReturnValue(null);

        updateLocalDefaultShippingAddressData(mockDefaultSAData);

        expect(Storage.local.getItem).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA);
        expect(Storage.local.setItem).not.toHaveBeenCalled();
    });

    test('should not update if userData exists but profile does not', () => {
        const mockUserDataWithoutProfile = {
            basket: 'value'
        };
        Storage.local.getItem.mockReturnValue(mockUserDataWithoutProfile);

        updateLocalDefaultShippingAddressData(mockDefaultSAData);

        expect(Storage.local.getItem).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA);
        expect(Storage.local.setItem).not.toHaveBeenCalled();
    });

    test('should update profile and save to localStorage if userData and profile exist', () => {
        const initialProfile = {
            profileId: '123456789',
            defaultSACountryCode: 'CA',
            defaultSAZipCode: 'M5V 2T6'
        };
        const mockUserDataWithProfile = {
            profile: { ...initialProfile },
            basket: 'value'
        };
        Storage.local.getItem.mockReturnValue(mockUserDataWithProfile);

        updateLocalDefaultShippingAddressData(mockDefaultSAData);

        expect(Storage.local.getItem).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA);

        const expectedUpdatedUserData = {
            profile: {
                profileId: '123456789',
                defaultSACountryCode: 'US', // Updated
                defaultSAZipCode: '90210' // Updated
            },
            basket: 'value'
        };

        expect(Storage.local.setItem).toHaveBeenCalledWith(LOCAL_STORAGE.USER_DATA, expectedUpdatedUserData, UserUtils.USER_DATA_EXPIRY);
        expect(mockUserDataWithProfile.profile.defaultSACountryCode).toBe('US');
        expect(mockUserDataWithProfile.profile.defaultSAZipCode).toBe('90210');
    });
});
