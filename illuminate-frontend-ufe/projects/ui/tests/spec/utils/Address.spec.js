describe('Address utils', () => {
    let addressUtils;

    beforeEach(() => {
        addressUtils = require('utils/Address').default;
    });

    describe('hasAVS', () => {
        describe('when flag is off', () => {
            it('should return false', () => {
                Sephora.configurationSettings.enableAddressValidation = false;
                expect(addressUtils.hasAVS('US')).toEqual(false);
            });
        });

        describe('when flag is on', () => {
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
            });

            it('should return true for US', () => {
                expect(addressUtils.hasAVS('US')).toEqual(true);
            });

            it('should return true for CA', () => {
                expect(addressUtils.hasAVS('CA')).toEqual(true);
            });

            it('should return false for international', () => {
                expect(addressUtils.hasAVS('NW')).toEqual(false);
            });
        });
    });

    describe('formatZipPostalCode', () => {
        describe('for Zip Code', () => {
            it('should format zipcode to 12345', () => {
                // Act
                const formatZipCode = addressUtils.formatZipPostalCode('12345', '-', 5, 9);
                // Assert
                expect(formatZipCode).toEqual('12345');
            });

            it('should format zipcode to 12345-6', () => {
                const formatZipCode = addressUtils.formatZipPostalCode('123456', '-', 5, 9);
                expect(formatZipCode).toEqual('12345-6');
            });

            it('should remove hyphen from zipcode to 12345', () => {
                const formatZipCode = addressUtils.formatZipPostalCode('12345-', '-', 5, 9);
                expect(formatZipCode).toEqual('12345');
            });
        });

        describe('for Postal Code', () => {
            it('should format postalCode to 123', () => {
                const formatPostalCode = addressUtils.formatZipPostalCode('123', ' ', 3, 6);
                expect(formatPostalCode).toEqual('123');
            });

            it('should format zipcode to 123 4', () => {
                const formatPostalCode = addressUtils.formatZipPostalCode('1234', ' ', 3, 6);
                expect(formatPostalCode).toEqual('123 4');
            });

            it('should remove space from zipcode to 123 ', () => {
                const formatPostalCode = addressUtils.formatZipPostalCode('123 ', ' ', 3, 6);
                expect(formatPostalCode).toEqual('123');
            });
        });
    });
});
