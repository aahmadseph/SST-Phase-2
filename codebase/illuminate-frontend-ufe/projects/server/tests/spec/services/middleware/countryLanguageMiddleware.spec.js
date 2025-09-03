/* eslint indent: 0 */
describe('countryLocaleMiddleware', () => {

    const baseDir = process.cwd();
    let countryLanguageMiddleware;

    function buildQueryString(query) {
        const args = Object.keys(query).map((key) => `${key}=${query[key]}`);
        if (!args.length) {
            return '';
        }

        return args.reduce((p, c) => `${p}&${c}`);
    }

    const responseMockClass = require('#tests/mocks/responseMock.js');

    let request;
    let response;

    let PARAMETERS,
        COOKIES_NAMES,
        COUNTRIES,
        LANGUAGES;

    beforeEach(async() => {

        const res1 = await import('#server/services/utils/Constants.mjs');
        PARAMETERS = res1.PARAMETERS;
        COOKIES_NAMES = res1.COOKIES_NAMES;
        COUNTRIES = res1.COUNTRIES;
        LANGUAGES = res1.LANGUAGES;

        response = new responseMockClass();
        request = {
            path: '',
            query: {},
            url: '',
            cookies: {}
        };
        const res = await import('#server/services/middleware/countryLanguageMiddleware.mjs');
        countryLanguageMiddleware = res.default;
    });

    it('should fallback to default US-EN if country and language are not present', () => {
        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.US.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country and language from cookies', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.CA,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.FR
        };

        function next() {
            expect(request.apiOptions.country).toBe(request.cookies[COOKIES_NAMES.SITE_LOCALE].toUpperCase());
            expect(request.apiOptions.language).toBe(request.cookies[COOKIES_NAMES.SITE_LANGUAGE]);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country from cookies, and US language as a default if it is not present', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.CA
        };

        function next() {
            expect(request.apiOptions.country).toBe(request.cookies[COOKIES_NAMES.SITE_LOCALE].toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country and language from url path', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.CA,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.FR
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(countryFromPath.toUpperCase());
            expect(request.apiOptions.language).toBe(languageFromPath);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country from url path, and EN language as a default if it is not present', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.CA,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.FR
        };
        const countryFromPath = COUNTRIES.US;
        request.path = `/${countryFromPath}/product/some-product-PID`;
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(countryFromPath.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country and language from url query parameters', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: COUNTRIES.CA,
            [PARAMETERS.LANG]: LANGUAGES.FR
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.FR);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use country from url query parameter, and EN language as a default if it is not present', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: COUNTRIES.CA
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use first matched value as a country from COUNTRY_SWITCH if it is present as array like ["","ca"]', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: ['', 'ca']
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use first matched value as a country from COUNTRY_SWITCH if it is present as array like ["","ca"] and same for lang ["", "fr"]', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: ['', 'ca'],
            [PARAMETERS.LANG]: ['', 'fr']
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.FR);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use first matched value as a country from COUNTRY_SWITCH if it is present as array like ["ca","us"]', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: ['ca', 'us']
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use first matched value as a country from COUNTRY_SWITCH if it is present as array like ["ca?skuId=2342392","ca?skuId=2342392"]', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: ['ca?skuId=2342392', 'ca?skuId=2342392']
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use CA as a country from param if COUNTRY_SWITCH is present as array like []', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.CA;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: []
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use US-en if request.query is not a string and not an array', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.US,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.US;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: {
                someProp: 1
            }
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.US.toUpperCase());
            expect(request.apiOptions.language).toBe(LANGUAGES.EN);
        }

        countryLanguageMiddleware(request, response, next);
    });

    it('should use CA-en if request.query is a string and has ? in it', () => {
        request.cookies = {
            [COOKIES_NAMES.SITE_LOCALE]: COUNTRIES.CA,
            [COOKIES_NAMES.SITE_LANGUAGE]: LANGUAGES.EN
        };
        const countryFromPath = COUNTRIES.CA;
        const languageFromPath = LANGUAGES.EN;
        request.path = `/${countryFromPath}/${languageFromPath}/product/some-product-PID`;
        request.query = {
            [PARAMETERS.COUNTRY_SWITCH]: `${COUNTRIES.CA}?SKUID=12345`
        };
        request.url = `${request.path}?${buildQueryString(request.query)}`;

        function next() {
            expect(request.apiOptions.country).toBe(COUNTRIES.CA.toUpperCase());
        }

        countryLanguageMiddleware(request, response, next);
    });
});
