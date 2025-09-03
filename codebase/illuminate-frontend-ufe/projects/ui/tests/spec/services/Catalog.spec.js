xdescribe('Catalog service', () => {
    let servicesUtils;
    let locationUtils;
    let InflatorComps;

    beforeEach(() => {
        // Explicitly requiring these in beforeEach or else they are not found.
        servicesUtils = require('utils/Services').default;
        locationUtils = require('utils/Location').default;
        InflatorComps = require('utils/framework/InflateComponents').default;
        InflatorComps.services = { CatalogService: {} };
        Sephora.configurationSettings.isNLPSearchEnabled = false;
        spyOn(servicesUtils.shouldServiceRun, 'catalog').and.returnValue(true);
    });

    describe('on init', () => {
        it('should set catalogEngine on services.CatalogService', () => {
            require('services/Catalog.js');

            expect(Sephora.Util.InflatorComps.services.CatalogService.catalogEngine).toEqual('NLP');
        });
    });

    describe('isNLPCatalog method', () => {
        it('should return false if catalogEngine is Endeca', () => {
            require('services/Catalog.js');

            expect(Sephora.Util.InflatorComps.services.CatalogService.isNLPCatalog()).toEqual(false);
        });

        it('should return false if isNLPSearchEnabled flag is false', () => {
            require('services/Catalog.js');

            expect(Sephora.Util.InflatorComps.services.CatalogService.isNLPCatalog()).toEqual(false);
        });

        it('should return true if isNLPSearchEnabled flag is true and it is search page', () => {
            spyOn(locationUtils, 'isSearchPage').and.returnValue(true);
            require('services/Catalog.js');
            Sephora.configurationSettings.isNLPSearchEnabled = true;

            expect(Sephora.Util.InflatorComps.services.CatalogService.isNLPCatalog()).toEqual(true);
        });

        it('should return true if isNLPSearchEnabled flag is true and catalogEngine is NLP', () => {
            spyOn(locationUtils, 'isSearchPage').and.returnValue(false);
            require('services/Catalog.js');
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = 'NLP';

            expect(Sephora.Util.InflatorComps.services.CatalogService.isNLPCatalog()).toEqual(true);
        });
    });
});
