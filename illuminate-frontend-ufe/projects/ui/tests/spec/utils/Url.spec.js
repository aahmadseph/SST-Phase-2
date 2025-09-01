const Location = require('utils/Location').default;
const urlUtils = require('utils/Url').default;
const localeUtils = require('utils/LanguageLocale').default;

describe('URL utils', () => {
    describe('formatParams', () => {
        it('should return the same value in an array if there are no previopus values', () => {
            const values = urlUtils.formatParams(null, '20');
            expect(values).toEqual(['20']);
        });

        it('should concat the values of previous values and next values', () => {
            const values = urlUtils.formatParams(['15', '12', '19'], '21');
            expect(values).toEqual(['15', '12', '19', '21']);
        });

        it(`should transform comma-separated values to an array and concat it with the previous
        value (if present)`, () => {
            const values = urlUtils.formatParams(['15'], '23,11,18');
            expect(values).toEqual(['15', '23', '11', '18']);
        });
    });

    describe('getParams', () => {
        it('no query params should return an empty object', () => {
            spyOn(Location, 'getLocation').and.returnValue({ search: '' });

            const params = urlUtils.getParams();
            expect(Object.keys(params).length).toEqual(0);
        });

        it('unique params should return under unique keys', () => {
            spyOn(Location, 'getLocation').and.returnValue({ search: '?x=foo&y=bar' });

            const params = urlUtils.getParams();

            expect(Object.keys(params).length).toEqual(2);
            expect(params.x).toEqual(['foo']);
            expect(params.y).toEqual(['bar']);
        });

        it('params with the same key should return in one array', () => {
            spyOn(Location, 'getLocation').and.returnValue({ search: '?x=foo&x=bar' });

            const params = urlUtils.getParams();

            expect(Object.keys(params).length).toEqual(1);
            expect(params.x).toEqual(['foo', 'bar']);
        });

        it('should not decode any params sent within the nonDecodingParams array', () => {
            const ENCODED_PARAM = 'Lorem%20ipsum%20dolor%20sit%20amet';
            const NON_DECODING_PARAM = 'nonDecoding';
            const getLocationStub = spyOn(Location, 'getLocation').and.returnValue({
                search: `?nonDecoding=${ENCODED_PARAM}&decodingParam=${ENCODED_PARAM}`
            });

            const params = urlUtils.getParams(getLocationStub.search, [NON_DECODING_PARAM]);
            expect(Object.keys(params).length).toEqual(2);
            expect(params.nonDecoding).toEqual([ENCODED_PARAM]);
            expect(params.decodingParam).not.toEqual([ENCODED_PARAM]);
        });
    });

    describe('getParamsByName', () => {
        it('should return a requested URL param value', () => {
            const queryParams = '?ref=someRef&sortBy=NEW';

            expect(urlUtils.getParamsByName('sortBy', queryParams)).toEqual(['NEW']);
            expect(urlUtils.getParamsByName('ref', queryParams)).toEqual(['someRef']);
        });

        it('should return multiple params with the same name as an array', () => {
            let url = window.location.origin;
            const path = '/mascara';
            const param = '?ref=firstRef&ref=secondRef&ref=thirdRef&sortBy=NEW';

            url = url.concat(path.concat(param));

            expect(urlUtils.getParamsByName('sortBy', url)).toEqual(['NEW']);
            expect(urlUtils.getParamsByName('ref', url)).toEqual(['firstRef', 'secondRef', 'thirdRef']);
        });
    });

    describe('getParamValueAsSingleString', () => {
        it('should return a requested URL param value as a single string', () => {
            let url = window.location.origin;
            const path = '/mascara';
            const param = '?ref=firstRef&sortBy=NEW';

            url = url.concat(path.concat(param));

            expect(urlUtils.getParamValueAsSingleString('ref', url)).toEqual('firstRef');
        });

        it('should return an empty string', () => {
            const url = window.location.origin;

            expect(urlUtils.getParamValueAsSingleString('ref', url)).toEqual('');
        });
    });

    describe('addParam', () => {
        const url = 'http://local.sephora.com/';
        const query = '?forceUFE=true';
        const multiParam = '?forceUFE=true&next=more';
        const hash = '#testHash';
        const paramToAdd = 'testparam';
        const paramValue = 'testvalue';

        it('should not touch it if not a string', () => {
            expect(urlUtils.addParam(null)).toEqual(null);
        });

        it('should add a parameter to a URL', () => {
            //Just add param
            expect(urlUtils.addParam(url, paramToAdd, paramValue)).toEqual(url + '?' + paramToAdd + '=' + paramValue);
        });

        it('should add a parameter to a URL after any existing parameters', () => {
            //Appropriately add param after existing parms
            expect(urlUtils.addParam(url + multiParam, paramToAdd, paramValue)).toEqual(url + multiParam + '&' + paramToAdd + '=' + paramValue);
        });

        it('should add a parameter to a URL after other params but before a hash', () => {
            //Add param after other params, but before hash
            expect(urlUtils.addParam(url + query + hash, paramToAdd, paramValue)).toEqual(url + query + '&' + paramToAdd + '=' + paramValue + hash);
        });

        it('should add a parameter to a URL before any hash', () => {
            expect(urlUtils.addParam(url + hash, paramToAdd, paramValue)).toEqual(url + '?' + paramToAdd + '=' + paramValue + hash);
        });
    });

    describe('removeParam', () => {
        const url = 'http://local.sephora.com/';
        const queryWithoutParam = '?forceUFE=true';
        const queryWithParam = '?forceUFE=true&testparam=more';
        const paramToRemove = 'testparam';
        const hash = '#testHash';

        it('should not touch it if not a string', () => {
            expect(urlUtils.addParam(null)).toEqual(null);
        });

        it('should remove parameter from URL', () => {
            //Just add param
            expect(urlUtils.removeParam(url + queryWithParam, paramToRemove)).toEqual(url + queryWithoutParam);
        });

        it('should not touch URL if parameter is not presented', () => {
            //Just add param
            expect(urlUtils.removeParam(url + queryWithoutParam, paramToRemove)).toEqual(url + queryWithoutParam);
        });

        it('should remove parameter before any hash', () => {
            expect(urlUtils.removeParam(url + queryWithParam + hash, paramToRemove)).toEqual(url + queryWithoutParam + hash);
        });
    });

    describe('buildQuery', () => {
        it('should take one query parameter and return a query string', () => {
            const params = new Map();
            params.set('sortBy', 'NEW');

            expect(urlUtils.buildQuery(params)).toEqual('?sortBy=NEW');
        });

        it('should take two query parameters and return a query string with separated parameters', () => {
            const params = new Map();
            params.set('ref', 1);
            params.set('sortBy', 'BEST_SELLING');

            expect(urlUtils.buildQuery(params)).toEqual('?ref=1&sortBy=BEST_SELLING');
        });

        it('should take a query parameter with an array of values and return a query string with separated parameters', () => {
            const params = new Map();
            params.set('ref', [1, 2]);

            expect(urlUtils.buildQuery(params)).toEqual('?ref=1,2');
        });

        it('should take a query parameter with an array of values and return a query string with ' + 'unique separated parameters', () => {
            const params = new Map();
            params.set('ref', [1, 1, 2]);

            expect(urlUtils.buildQuery(params)).toEqual('?ref=1,2');
        });

        it('should return empty string if there is no parameters', () => {
            expect(urlUtils.buildQuery(new Map())).toEqual('');
        });
    });

    describe('Data URL', () => {
        it('should tell if the url provided is data inline url', () => {
            expect(urlUtils.isDataUrl('data:vsdrtaervservbser')).toBeTruthy();
        });
    });

    describe('Make query string', () => {
        it('should take an object and return a query string', () => {
            const options = {
                categoryId: 'cat60004',
                currentPage: 1,
                pageSize: 40
            };

            const expectedString = 'categoryId=cat60004&currentPage=1&pageSize=40';

            expect(urlUtils.makeQueryString(options)).toBe(expectedString);
        });

        it('should not take to account props with undefined value', () => {
            const options = {
                categoryId: 'cat60004',
                currentPage: undefined,
                pageSize: undefined
            };

            const expectedString = 'categoryId=cat60004';

            expect(urlUtils.makeQueryString(options)).toBe(expectedString);
        });

        it('should take an object and return a query string, event if one param is an arr', () => {
            const options = {
                'bla bla': [333, 666],
                'xyz xyz': 222
            };

            const expectedString = 'bla%20bla=333&bla%20bla=666&xyz%20xyz=222';

            expect(urlUtils.makeQueryString(options)).toBe(expectedString);
        });
    });

    describe('getLink', () => {
        it('should not touch it if not a string', () => {
            expect(urlUtils.getLink(null)).toEqual(null);
        });

        it('should add internal tracking if a parameter is passed', () => {
            spyOn(urlUtils, 'addInternalTracking').and.returnValue('/?icid2=shop-now');

            expect(urlUtils.getLink('/', ['shop-now'])).toEqual('/?icid2=shop-now');
        });

        describe('when doing SEO for Canada', () => {
            beforeEach(() => {
                Sephora.isSEOForCanadaEnabled = true;
                spyOn(localeUtils, 'isCanada').and.returnValue(true);
            });

            it('should not touch it if empty', () => {
                expect(urlUtils.getLink('')).toEqual('');
            });

            it('should not touch it if it has no host and is not root relative', () => {
                expect(urlUtils.getLink('abc')).toEqual('abc');
            });

            it('should not touch it if root relative but already with SEO prefix', () => {
                expect(urlUtils.getLink('/ca/en/brands-list')).toEqual('/ca/en/brands-list');
            });

            it('should not touch it if full link but already with SEO prefix', () => {
                expect(urlUtils.getLink('https://www.sephora.com/ca/en/')).toEqual('https://www.sephora.com/ca/en/');
            });

            it('should not touch it if has host other than sephora.com', () => {
                expect(urlUtils.getLink('https://www.sephorastands.com/')).toEqual('https://www.sephorastands.com/');
            });

            it('should not touch it if has an excluded subdomain', () => {
                expect(urlUtils.getLink('https://jobs.sephora.com/')).toEqual('https://jobs.sephora.com/');
            });

            it('should add prefix when it has a non-excluded subdomain', () => {
                expect(urlUtils.getLink('https://qa.sephora.com/')).toEqual('https://qa.sephora.com/ca/en/');
            });

            it('should add prefix when it has a non-excluded subdomain with four levels of host', () => {
                expect(urlUtils.getLink('https://qa.sephora.com.mx/')).toEqual('https://qa.sephora.com.mx/ca/en/');
            });

            it('should add prefix when it has a non-excluded subdomain with four levels of host', () => {
                expect(urlUtils.getLink('https://www.sephora.com.br/')).toEqual('https://www.sephora.com.br/ca/en/');
            });

            it('should not touch it if has an excluded subdomain with four levels of host', () => {
                expect(urlUtils.getLink('https://jobs.sephora.com.mx/')).toEqual('https://jobs.sephora.com.mx/');
            });

            it('should add prefix for root relative links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(
                    urlUtils.getLink('/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product')
                ).toEqual('/ca/en/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product');
            });

            it('should not add prefix for root relative links when not whitelisted', () => {
                expect(urlUtils.getLink('/basket')).toEqual('/basket');
            });

            it('should add prefix for root relative links when is whitelisted and homepage', () => {
                expect(urlUtils.getLink('/')).toEqual('/ca/en/');
            });

            it('should add prefix for full https sephora.com links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(
                    urlUtils.getLink(
                        'https://www.sephora.com/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                    )
                ).toEqual(
                    'https://www.sephora.com/ca/en/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                );
            });

            it('should add prefix for full http sephora.com links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(
                    urlUtils.getLink(
                        'http://www.sephora.com/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                    )
                ).toEqual(
                    'http://www.sephora.com/ca/en/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                );
            });

            it('should add prefix for protocol-less sephora.com links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(
                    urlUtils.getLink(
                        'www.sephora.com/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                    )
                ).toEqual('www.sephora.com/ca/en/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product');
            });

            it('should add prefix for same-protocol sephora.com links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(
                    urlUtils.getLink(
                        '//www.sephora.com/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                    )
                ).toEqual(
                    '//www.sephora.com/ca/en/product/bomb-baby-mini-lip-face-set-P427643?icid2=just%20arrived%20at%sephora.com:p427643:product'
                );
            });

            it('should add prefix for non-prod sephora.com links when is whitelisted', () => {
                /* eslint-disable max-len */
                expect(urlUtils.getLink('https://atg11-m-qa2.sephora.com/beauty-offers')).toEqual(
                    'https://atg11-m-qa2.sephora.com/ca/en/beauty-offers'
                );
            });

            it('should add prefix for root relative links when is whitelisted and french', () => {
                spyOn(localeUtils, 'isFrench').and.returnValue(true);
                global.document.cookie = true;
                expect(urlUtils.getLink('/brands-list')).toEqual('/ca/fr/brands-list');
            });

            afterEach(() => {
                Sephora.isSEOForCanadaEnabled = false;
            });
        });
    });

    describe('addInternalTracking', () => {
        it('should not touch it if no values are provided', () => {
            expect(urlUtils.addInternalTracking('/')).toEqual('/');
        });

        it('should not touch it if an empty array for values is provided', () => {
            expect(urlUtils.addInternalTracking('/', [])).toEqual('/');
        });

        it('should not touch it if an array containing undefined is provided', () => {
            expect(urlUtils.addInternalTracking('/', [undefined])).toEqual('/');
        });

        it('should add param if values are provided', () => {
            expect(urlUtils.addInternalTracking('/', ['one', 'two'])).toEqual('/?icid2=one:two');
        });
    });

    describe('convertUrlToHTTPS', () => {
        it('should convert an absolute http url to https', () => {
            const url = 'http://www.sephora.com/contentimages/coloriq/generic_images/Foundation.png';
            const result = urlUtils.convertUrlToHTTPS(url);
            expect(result).toEqual('https://www.sephora.com/contentimages/coloriq/generic_images/Foundation.png');
        });
        it('should not convert an already https url', () => {
            const url = 'https://www.sephora.com/contentimages/coloriq/generic_images/Foundation.png';
            const result = urlUtils.convertUrlToHTTPS(url);
            expect(result).toEqual(url);
        });
        it('should not convert a relative url', () => {
            const url = '/contentimages/coloriq/generic_images/Foundation.png';
            const result = urlUtils.convertUrlToHTTPS(url);
            expect(result).toEqual(url);
        });
    });
});
