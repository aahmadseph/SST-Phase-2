describe('Credit Card utils', () => {
    let CreditCardUtils;

    beforeEach(() => {
        CreditCardUtils = require('utils/CreditCard').default;
    });

    describe('formatExpMonth', () => {
        it('should accept number', () => {
            expect(CreditCardUtils.formatExpMonth(5)).toEqual('05');
        });

        it('should accept string', () => {
            expect(CreditCardUtils.formatExpMonth('5')).toEqual('05');
        });
    });

    describe('formatExpYear', () => {
        it('should accept number', () => {
            expect(CreditCardUtils.formatExpYear(2020)).toEqual('20');
        });

        it('should accept string', () => {
            expect(CreditCardUtils.formatExpYear('2020')).toEqual('20');
        });
    });

    describe('cleanCreditCardData', () => {
        let creditCardData;
        const propsToCheck = [
            'isDefault',
            'cardNumber',
            'isExpired',
            'isPreApproved',
            'isCardInOrder',
            'paymentDisplayInfo',
            'amount',
            'isComplete',
            'paymentGroupId'
        ];

        propsToCheck.forEach(propName => {
            creditCardData = {};
            creditCardData[propName] = true;

            const testObj = {};
            testObj[propName] = true;

            it('should remove ' + propName + ' property', () => {
                expect(CreditCardUtils.cleanCreditCardData(creditCardData)).not.toEqual(jasmine.objectContaining(testObj));
            });
        });
    });

    describe('isShipAddressBillingAddress', () => {
        let testSAddr, testBAddr;
        const propsToCheck = ['address1', 'address2', 'city', 'country', 'phone', 'postalCode', 'state'];

        beforeEach(() => {
            testSAddr = {};
            testBAddr = {};

            propsToCheck.forEach(propName => {
                testSAddr[propName] = 'test-val-' + propName;
                testBAddr[propName] = 'test-val-' + propName;
            });
        });

        it('should return true if shipping and billing addresses are the same', () => {
            expect(CreditCardUtils.isShipAddressBillingAddress(testSAddr, testBAddr)).toBeTruthy();
        });

        it('should return false if shipping address is not set', () => {
            expect(CreditCardUtils.isShipAddressBillingAddress(null, testBAddr)).toBeFalsy();
        });

        propsToCheck.forEach(propName => {
            it('should return false if ' + propName + ' is the same as in billing address', () => {
                testSAddr[propName] = 'someOtherVal';

                expect(CreditCardUtils.isShipAddressBillingAddress(testSAddr, testBAddr)).toBeFalsy();
            });
        });
    });

    describe('shortenCardNumber', () => {
        it('should return last 4 symbols of a passed string', () => {
            expect(CreditCardUtils.shortenCardNumber('123456789')).toEqual('6789');
        });
    });

    describe('isSavedToProfile', () => {
        let creditCardId;

        it('should return true if credit card id is set as any string', () => {
            creditCardId = 'usercc';

            expect(CreditCardUtils.isSavedToProfile(creditCardId)).toBeTruthy();
        });

        it('should return false if credit card id is not set as some string', () => {
            creditCardId = '';

            expect(CreditCardUtils.isSavedToProfile(creditCardId)).toBeFalsy();
        });
    });

    // @TODO should be rewrittent to support stubs
    // methods shouldn't be declared as private
    // isSavedToProfileStub is preserved for after-refactoring use
    describe('numberOfSavedCards', () => {
        // let isSavedToProfileStub;

        // beforeEach(() => {
        //     isSavedToProfileStub = spyOn(CreditCardUtils, 'isSavedToProfile');
        // });

        it('should return 0 if no credit cards are passed', () => {
            expect(CreditCardUtils.numberOfSavedCards()).toEqual(0);
        });

        it('should return number of saved to profile cards', () => {
            // isSavedToProfileStub.returns(true);
            const creditCards = [{ creditCardId: 'usercc' }];

            expect(CreditCardUtils.numberOfSavedCards(creditCards)).toEqual(1);
        });
    });

    describe('getCardName', () => {
        it('should modify a PLCC card', () => {
            expect(CreditCardUtils.getCardName('PLCC')).toEqual('Sephora Card');
        });

        it('should modify a CBVI card', () => {
            expect(CreditCardUtils.getCardName('CBVI')).toEqual('Sephora VISA Card');
        });

        it('should modify a PLCCT card', () => {
            expect(CreditCardUtils.getCardName('PLCCT')).toEqual('Sephora Temp Card');
        });

        it('should modify a CBVIT card', () => {
            expect(CreditCardUtils.getCardName('CBVIT')).toEqual('Sephora VISA Temp Card');
        });

        it('should not modify other cards', () => {
            expect(CreditCardUtils.getCardName('VISA')).toEqual('VISA');
        });
    });

    describe('isCreditCardReady', () => {
        it('should return false if payment is not ready', () => {
            // Arrange
            const isPaymentReady = false;
            const selectedCreditCard = { selectedForPayment: true };
            // Act
            const result = CreditCardUtils.isCreditCardReady({
                isPaymentReady,
                selectedCreditCard
            });
            // Assert
            expect(result).toEqual(false);
        });

        it('should return false if credit card is not selected for payment', () => {
            // Arrange
            const isPaymentReady = true;
            const selectedCreditCard = { selectedForPayment: false };
            // Act
            const result = CreditCardUtils.isCreditCardReady({
                isPaymentReady,
                selectedCreditCard
            });
            // Assert
            expect(result).toEqual(false);
        });

        it('should return true if credit card is selected for payment and payment is ready', () => {
            // Arrange
            const isPaymentReady = true;
            const selectedCreditCard = { selectedForPayment: true };
            // Act
            const result = CreditCardUtils.isCreditCardReady({
                isPaymentReady,
                selectedCreditCard
            });
            // Assert
            expect(result).toEqual(true);
        });

        it('should return true if credit card is pre approved', () => {
            // Arrange
            const isPaymentReady = false;
            const selectedCreditCard = {
                selectedForPayment: true,
                isPreApproved: true
            };
            // Act
            const result = CreditCardUtils.isCreditCardReady({
                isPaymentReady,
                selectedCreditCard
            });
            // Assert
            expect(result).toEqual(true);
        });

        it('should return true if credit card has a security code', () => {
            // Arrange
            const isPaymentReady = false;
            const selectedCreditCard = {
                selectedForPayment: true,
                securityCode: '111'
            };
            // Act
            const result = CreditCardUtils.isCreditCardReady({
                isPaymentReady,
                selectedCreditCard
            });
            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('tokenMigrationEnabled', () => {
        it('should return true when isMigrated is true', () => {
            const creditCard = { isMigrated: true };
            const result = CreditCardUtils.tokenMigrationEnabled(creditCard);
            expect(result).toBe(true);
        });

        it('should return true when isMigrated is false', () => {
            const creditCard = { isMigrated: false };
            const result = CreditCardUtils.tokenMigrationEnabled(creditCard);
            expect(result).toBe(true);
        });

        it('should return false when isMigrated is null', () => {
            const creditCard = { isMigrated: null };
            const result = CreditCardUtils.tokenMigrationEnabled(creditCard);
            expect(result).toBe(false);
        });

        it('should return false when isMigrated is undefined', () => {
            const creditCard = {};
            const result = CreditCardUtils.tokenMigrationEnabled(creditCard);
            expect(result).toBe(false);
        });
    });

    describe('tokenMigrationSucceed', () => {
        it('should return true when isMigrated is true', () => {
            const creditCard = { isMigrated: true };
            const result = CreditCardUtils.tokenMigrationSucceed(creditCard);
            expect(result).toBe(true);
        });

        it('should return false when isMigrated is null', () => {
            const creditCard = { isMigrated: null };
            const result = CreditCardUtils.tokenMigrationSucceed(creditCard);
            expect(result).toBe(false);
        });

        it('should return false when isMigrated is undefined', () => {
            const creditCard = {};
            const result = CreditCardUtils.tokenMigrationSucceed(creditCard);
            expect(result).toBe(false);
        });
    });

    describe('tokenMigrationFailed', () => {
        it('should return true when isMigrated is false', () => {
            const creditCard = { isMigrated: false };
            const result = CreditCardUtils.tokenMigrationFailed(creditCard);
            expect(result).toBe(true);
        });

        it('should return false when isMigrated is null', () => {
            const creditCard = { isMigrated: null };
            const result = CreditCardUtils.tokenMigrationFailed(creditCard);
            expect(result).toBe(false);
        });

        it('should return false when isMigrated is undefined', () => {
            const creditCard = {};
            const result = CreditCardUtils.tokenMigrationFailed(creditCard);
            expect(result).toBe(false);
        });
    });

    describe('isAMEXCard', () => {
        it('should return true if credit card is AMEX card', () => {
            const cardType1 = 'American Express';
            const cardType2 = 'americanExpress';

            // Assert
            expect(CreditCardUtils.isAMEXCard(cardType1)).toBeTruthy();
            expect(CreditCardUtils.isAMEXCard(cardType2)).toBeTruthy();
        });

        it('should return false if credit card is not AMEX card', () => {
            const cardType1 = 'VISA';
            const cardType2 = 'Master Card';

            // Assert
            expect(CreditCardUtils.isAMEXCard(cardType1)).toBeFalsy();
            expect(CreditCardUtils.isAMEXCard(cardType2)).toBeFalsy();
        });
    });

    describe('getSecurityCodeLength', () => {
        it('should return correct security code length based on the card type', () => {
            const cardType1 = 'American Express';
            const cardType2 = 'VISA';

            // Assert
            expect(CreditCardUtils.getSecurityCodeLength(cardType1)).toEqual(4);
            expect(CreditCardUtils.getSecurityCodeLength(cardType2)).toEqual(3);
        });
    });
});
