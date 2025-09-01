const { createSpy } = jasmine;
var FormValidator = require('utils/FormValidator').default;

describe('Form Validator', () => {
    describe('isEmpty', () => {
        it('should return true for undefined value', () => {
            expect(FormValidator.isEmpty(undefined)).toBeTruthy();
        });

        it('should return true for null value', () => {
            expect(FormValidator.isEmpty(null)).toBeTruthy();
        });

        it('should return true for a zero length string', () => {
            expect(FormValidator.isEmpty('')).toBeTruthy();
        });

        it('should return false for a string with length 1', () => {
            expect(FormValidator.isEmpty('1')).toBeFalsy();
        });
    });

    describe('isValidLength', () => {
        it('should return false for undefined value', () => {
            expect(FormValidator.isValidLength(undefined, 1, 2)).toBeFalsy();
        });

        it('should return false for null value', () => {
            expect(FormValidator.isValidLength(null, 1, 2)).toBeFalsy();
        });

        describe('minLength', () => {
            it('should return true for any string if minlength and maxlength undefined', () => {
                expect(FormValidator.isValidLength('a')).toBeTruthy();
            });

            it('should return true for any string length less than maxlength if minlength null', () => {
                expect(FormValidator.isValidLength('a', null, 10)).toBeTruthy();
            });

            it('should return true for any string length equal to minlength', () => {
                expect(FormValidator.isValidLength('123', 3)).toBeTruthy();
            });

            it('should return false for any string length < minlength', () => {
                expect(FormValidator.isValidLength('a', 3)).toBeFalsy();
            });
        });

        describe('maxLength', () => {
            it('should return true for any string length >= minlength if maxlength null', () => {
                expect(FormValidator.isValidLength('123', 3)).toBeTruthy();
            });

            it('should return true for any string length equal to maxlength', () => {
                expect(FormValidator.isValidLength('12345', 3, 5)).toBeTruthy();
            });

            it('should return false for any string length > maxlength', () => {
                expect(FormValidator.isValidLength('123456', 3, 5)).toBeFalsy();
            });
        });
    });

    describe('hasEmptySpaces', () => {
        it('should return true for value with empty spaces', () => {
            expect(FormValidator.hasEmptySpaces(' pass wor d')).toBe(true);
        });

        it('should return false for value with no empty spaces', () => {
            expect(FormValidator.hasEmptySpaces('password')).toBe(false);
        });
    });

    describe('pasteAcceptOnlyNumbers', () => {
        it('should return true for value with digits only, coming from event', () => {
            expect(
                FormValidator.pasteAcceptOnlyNumbers({
                    clipboardData: { getData: createSpy('getData').and.returnValue('1234123412341234') },
                    stopPropagation: createSpy('stopPropagation'),
                    preventDefault: createSpy('preventDefault')
                })
            ).toBe(true);
        });

        it('should return true for value with digits only, coming from global', () => {
            global.clipboardData = { getData: createSpy('getData').and.returnValue('1234123412341234') };

            expect(
                FormValidator.pasteAcceptOnlyNumbers({
                    stopPropagation: createSpy('stopPropagation'),
                    preventDefault: createSpy('preventDefault')
                })
            ).toBe(true);

            global.clipboardData = undefined;
        });

        it('should return false for value with not only digits, coming from event', () => {
            expect(
                FormValidator.pasteAcceptOnlyNumbers({
                    clipboardData: { getData: createSpy('getData').and.returnValue('1234-1234-1234-1234') },
                    stopPropagation: createSpy('stopPropagation'),
                    preventDefault: createSpy('preventDefault')
                })
            ).toBe(false);
        });

        it('should return false for value with not only digits, coming from global', () => {
            global.clipboardData = { getData: createSpy('getData').and.returnValue('1234-1234-1234-1234') };

            expect(
                FormValidator.pasteAcceptOnlyNumbers({
                    stopPropagation: createSpy('stopPropagation'),
                    preventDefault: createSpy('preventDefault')
                })
            ).toBe(false);

            global.clipboardData = undefined;
        });

        it('should call stopPropagation for value with not only digits', () => {
            const stopPropagation = createSpy('stopPropagation');

            FormValidator.pasteAcceptOnlyNumbers({
                clipboardData: { getData: createSpy('getData').and.returnValue('1234-1234-1234-1234') },
                stopPropagation,
                preventDefault: createSpy('preventDefault')
            });

            expect(stopPropagation).toHaveBeenCalled();
        });

        it('should call preventDefault for value with not only digits', () => {
            const preventDefault = createSpy('preventDefault');

            FormValidator.pasteAcceptOnlyNumbers({
                clipboardData: { getData: createSpy('getData').and.returnValue('1234-1234-1234-1234') },
                stopPropagation: createSpy('stopPropagation'),
                preventDefault
            });

            expect(preventDefault).toHaveBeenCalled();
        });
    });

    describe('isNumeric', () => {
        let value;

        it('should return true if we pass a number', () => {
            value = 12342134;
            expect(FormValidator.isNumeric(value)).toEqual(true);
        });

        it('should return true if we pass a stringified number', () => {
            value = '12342134';
            expect(FormValidator.isNumeric(value)).toEqual(true);
        });

        it('should return false if we pass a alphabetic symbol in a stringified number', () => {
            value = '123a42134';
            expect(FormValidator.isNumeric(value)).toEqual(false);
        });

        it('should return false if we pass a non-digit symbol in a string', () => {
            value = '123.42134';
            expect(FormValidator.isNumeric(value)).toEqual(false);
        });
    });

    describe('getFormattedPhoneNumber', () => {
        let phone;

        it('should return correct number', () => {
            phone = '1112223333';
            expect(FormValidator.getFormattedPhoneNumber(phone)).toEqual('(111) 222-3333');
        });

        it('should return parentheses for 4-6 chars number', () => {
            phone = '11122';
            expect(FormValidator.getFormattedPhoneNumber(phone)).toEqual('(111) 22');
        });

        it('should return hyphen for 6+ chars number', () => {
            phone = '1112223';
            expect(FormValidator.getFormattedPhoneNumber(phone)).toEqual('(111) 222-3');
        });

        it('should return empy string if number.length <= 3', () => {
            phone = '11';
            expect(FormValidator.getFormattedPhoneNumber(phone)).toEqual('');
        });
    });

    describe('isValidZipCode', () => {
        let zipCode;
        it('should return false on CA if unaccepated character D is present', () => {
            zipCode = 'a1d 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return false on CA if unaccepated character F is present', () => {
            zipCode = 'a1f 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return false on CA if unaccepated character I is present', () => {
            zipCode = 'a1i 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return false on CA if unaccepated character O is present', () => {
            zipCode = 'a1o 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return false on CA if unaccepated character Q is present', () => {
            zipCode = 'a1q 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return false on CA if unaccepated character U is present', () => {
            zipCode = 'a1u 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(false);
        });
        it('should return true on CA if only accepted characters are present', () => {
            zipCode = 'a1a 1a1';
            expect(FormValidator.isValidZipCode(zipCode, 'CA')).toBe(true);
        });
    });
});
