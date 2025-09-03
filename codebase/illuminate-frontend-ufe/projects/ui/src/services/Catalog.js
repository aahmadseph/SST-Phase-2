import servicesUtils from 'utils/Services';
const shouldServiceRun = servicesUtils.shouldServiceRun;
import locationUtils from 'utils/Location';
import Events from 'utils/framework/Events';

export default (function () {
    // Stop service from loading if not necessary
    if (!shouldServiceRun.catalog()) {
        return;
    }

    Sephora.Util.InflatorComps.services.CatalogService = {
        catalogEngine: 'NLP',
        isNLPCatalog: () =>
            Sephora.configurationSettings?.isNLPSearchEnabled &&
            (locationUtils.isSearchPage() || Sephora.Util?.InflatorComps?.services?.CatalogService?.catalogEngine === 'NLP')
    };

    window.dispatchEvent(new CustomEvent(Events.CatalogEngineReady, { detail: {} }));
}());
