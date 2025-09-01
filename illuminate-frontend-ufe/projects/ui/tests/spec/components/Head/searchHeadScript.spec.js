require('jasmine-ajax');
const { Ajax, any, createSpy, anything } = jasmine;

describe('searchHeadScript', () => {
    let SEARCH_API_URL;
    let SEARCH_RESPONSE;

    beforeEach(() => {
        SEARCH_API_URL = '/api/catalog/search?type=keyword&q=';
        SEARCH_RESPONSE = {
            contextId: anything(),
            categories: [
                {
                    displayName: 'Makeup',
                    level: 1,
                    node: 1050000,
                    recordCount: '220'
                }
            ],
            keyword: 'yellow',
            products: [
                {
                    brandName: 'Versace',
                    currentSku: {
                        imageAltText: 'Versace - Yellow Diamond',
                        isBI: false,
                        isBest: false,
                        isLimitedEdition: false,
                        isNatural: false,
                        isNew: false,
                        isOnlineOnly: false,
                        isOrganic: false,
                        isSephoraExclusive: false,
                        listPrice: '$28.00 - $95.00',
                        salePrice: '',
                        skuId: '1395755',
                        skuType: 'Standard'
                    }
                }
            ],
            refinements: [
                {
                    displayName: 'Brand',
                    type: 'checkboxes',
                    values: [
                        {
                            refinementValueDisplayName: 'Acqua Di Parma',
                            refinementValueId: 900096,
                            refinementValueStatus: 1
                        }
                    ]
                }
            ],
            totalProducts: 1
        };
        global.ConstructorioTracker = {
            getSessionID: createSpy(),
            getClientID: createSpy()
        };
        Sephora.Util.getQueryStringParams = () => {};
        spyOn(Sephora.Util, 'onLastLoadEvent').and.callFake((_selector, _event, callback) => callback());
    });

    it('should define SearchInfo', () => {
        spyOn(XMLHttpRequest.prototype, 'send');
        spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({ keyword: ['yellow'] });
        require('components/Head/search.headScript.js');
        expect(Sephora.Util.InflatorComps.services.SearchInfo).toBeDefined();
    });

    describe('should fetch data', () => {
        beforeEach(() => {
            spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({ keyword: ['yellow'] });
            Ajax.install();
        });

        afterEach(() => {
            Ajax.uninstall();
        });

        it('using only one XMLHttpRequest', () => {
            // Arrange
            const open = spyOn(XMLHttpRequest.prototype, 'open');
            spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
            spyOn(XMLHttpRequest.prototype, 'send');

            // Act
            require('components/Head/search.headScript.js');

            // Assert
            expect(open).toHaveBeenCalledTimes(1);
        });

        it('using GET as method', () => {
            // Arrange
            const open = spyOn(XMLHttpRequest.prototype, 'open');
            spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
            spyOn(XMLHttpRequest.prototype, 'send');

            // Act
            require('components/Head/search.headScript.js');

            // Assert
            expect(open).toHaveBeenCalledWith('GET', any(String), true);
        });

        it('and set SearchInfo.data', () => {
            // Act
            require('components/Head/search.headScript.js');

            // Arrange
            Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: JSON.stringify(SEARCH_RESPONSE)
            });

            // Assert
            expect(Sephora.Util.InflatorComps.services.SearchInfo.data).toEqual(SEARCH_RESPONSE);
        });

        it('and set loadEvents.SearchInfoLoaded to true', () => {
            // Act
            require('components/Head/search.headScript.js');
            // Arrange
            Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: JSON.stringify(SEARCH_RESPONSE)
            });

            // Assert
            expect(Sephora.Util.InflatorComps.services.loadEvents.SearchInfoLoaded).toBeTruthy();
        });
    });

    it('should fetch data with just the keyword parameter should have the correct value in the url', () => {
        // Arrange
        spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({ keyword: ['green'] });

        const open = spyOn(XMLHttpRequest.prototype, 'open');
        spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
        spyOn(XMLHttpRequest.prototype, 'send');
        const url = `${SEARCH_API_URL}green&content=true&includeRegionsMap=true&page=60&currentPage=1&targetSearchEngine=endeca`;

        // Act
        require('components/Head/search.headScript.js');

        // Assert
        expect(open).toHaveBeenCalledWith('GET', url, true);
    });

    it('should fetch data with additional parameters in the url should have the correct value in the url', () => {
        spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({
            keyword: ['red'],
            ref: ['900096', '900081'],
            sortBy: ['NEW']
        });
        const open = spyOn(XMLHttpRequest.prototype, 'open');
        spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
        spyOn(XMLHttpRequest.prototype, 'send');
        const url = `${SEARCH_API_URL}red&ref=900096,900081&sortBy=NEW&content=true&includeRegionsMap=true&page=60&currentPage=1&targetSearchEngine=endeca`;

        // Act
        require('components/Head/search.headScript.js');

        // Assert
        expect(open).toHaveBeenCalledWith('GET', url, true);
    });

    it('should fetch data with no keyword parameter should not start the XMLHttpRequest', () => {
        // Arrange
        spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({});
        const open = spyOn(XMLHttpRequest.prototype, 'open');
        spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
        spyOn(XMLHttpRequest.prototype, 'send');

        // Act
        require('components/Head/search.headScript.js');

        // Assert
        expect(open).not.toHaveBeenCalled();
    });

    it('should fetch data for Sale search results should have the correct value in the url', () => {
        // Arrange
        Sephora.renderQueryParams = { urlPath: '%2Fsale' };
        spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({});
        const open = spyOn(XMLHttpRequest.prototype, 'open');
        spyOn(XMLHttpRequest.prototype, 'setRequestHeader').and.returnValue(null);
        spyOn(XMLHttpRequest.prototype, 'send');
        const url = `${SEARCH_API_URL}sale&content=true&includeRegionsMap=true&page=60&currentPage=1&targetSearchEngine=endeca`;

        // Act
        require('components/Head/search.headScript.js');

        // Assert
        expect(open).toHaveBeenCalledWith('GET', url, true);
    });

    describe('should fetch data with no response', () => {
        beforeEach(() => {
            spyOn(Sephora.Util, 'getQueryStringParams').and.returnValue({ keyword: ['green'] });
            Ajax.install();
        });

        afterEach(() => {
            Ajax.uninstall();
        });

        it('should not define SearchInfo.data', () => {
            // Act
            require('components/Head/search.headScript.js');

            // Arrange
            Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: null
            });

            // Assert
            expect(Sephora.Util.InflatorComps.services.SearchInfo.data).toBeUndefined();
        });

        it('should not define loadEvents.SearchInfoLoaded', () => {
            // Act
            require('components/Head/search.headScript.js');

            // Arrange
            Ajax.requests.mostRecent().respondWith({
                status: 200,
                responseText: null
            });

            // Assert
            expect(Sephora.Util.InflatorComps.services.SearchInfo.SearchInfoLoaded).toBeUndefined();
        });
    });
});
