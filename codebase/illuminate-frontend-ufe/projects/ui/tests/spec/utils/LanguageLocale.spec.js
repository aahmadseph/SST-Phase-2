let localeUtils;

describe('Language Locale module', () => {
    beforeEach(() => {
        localeUtils = require('utils/LanguageLocale').default;
        Sephora.renderQueryParams = Sephora.renderQueryParams || {};
    });

    describe('getCurrencySymbol', () => {
        it('should return the correct currency symbol for the US', () => {
            Sephora.renderQueryParams.country = localeUtils.COUNTRIES.US;
            expect(localeUtils.getCurrencySymbol()).toBe(localeUtils.CURRENCY_SYMBOLS.US);
        });

        it('should return the correct currency symbol for Canada', () => {
            Sephora.renderQueryParams.country = localeUtils.COUNTRIES.CA;
            expect(localeUtils.getCurrencySymbol()).toBe(localeUtils.CURRENCY_SYMBOLS.CA);
        });
    });

    describe('getCurrentLanguage', function () {
        it('should not return undefined', function () {
            Sephora.renderQueryParams.language = null;
            const output = localeUtils.getCurrentLanguage();
            expect(output).not.toBe(undefined);
        });

        it('should default to `EN`', function () {
            Sephora.renderQueryParams.language = null;
            const output = localeUtils.getCurrentLanguage();
            expect(output).toBe(localeUtils.LANGUAGES.EN);
        });
        // TODO: uncomment this when we get language variable from backend
        // it('should depends on `Sephora.renderQueryParams.language` value', function () {
        //     Sephora.renderQueryParams.language = localeUtils.LANGUAGES.FR;
        //     let output = localeUtils.getCurrentLanguage();
        //     expect(output).toBe(localeUtils.LANGUAGES.FR);
        // });
    });

    describe('getLocaleResourceFile', function () {
        it('should not return undefined', function () {
            const output = localeUtils.getGeneralResourceFile();
            expect(output).not.toBe(undefined);
        });
    });

    describe('getFormattedPrice', () => {
        let isUSStub;
        let isFRCanadaStub;

        beforeEach(() => {
            isUSStub = spyOn(localeUtils, 'isUS');
            isFRCanadaStub = spyOn(localeUtils, 'isFRCanada');
        });

        it('should return french canada price format', () => {
            isFRCanadaStub.and.returnValue(true);
            const output = localeUtils.getFormattedPrice(30, false);
            expect(output).toEqual('30,00' + localeUtils.CURRENCY_SYMBOLS.CA_FR);
        });

        it('should return french canada price format for value price', () => {
            isFRCanadaStub.and.returnValue(true);
            const output = localeUtils.getFormattedPrice(30, true);
            expect(output).toEqual('(30,00' + localeUtils.CURRENCY_SYMBOLS.CA_FR + ' VALUE)');
        });

        it('should return US price format', () => {
            isFRCanadaStub.and.returnValue(false);
            isUSStub.and.returnValue(true);
            const output = localeUtils.getFormattedPrice(30, false);
            expect(output).toEqual('$30.00');
        });

        it('should return US price format for value price', () => {
            isFRCanadaStub.and.returnValue(false);
            isUSStub.and.returnValue(true);
            const output = localeUtils.getFormattedPrice(30, true);
            expect(output).toEqual('($30.00 VALUE)');
        });

        it('should return CA english price format', () => {
            isFRCanadaStub.and.returnValue(false);
            isUSStub.and.returnValue(false);
            const output = localeUtils.getFormattedPrice(30, false);
            expect(output).toEqual('$30.00');
        });

        it('should return CA english price format for value price', () => {
            isFRCanadaStub.and.returnValue(false);
            isUSStub.and.returnValue(false);
            const output = localeUtils.getFormattedPrice(30, true);
            expect(output).toEqual('($30.00 VALUE)');
        });

        it('should return no price', () => {
            const output = localeUtils.getFormattedPrice();
            expect(output).toEqual('');
        });
    });
});
