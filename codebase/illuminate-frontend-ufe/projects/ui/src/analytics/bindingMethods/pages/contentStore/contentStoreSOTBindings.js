import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    PAGE_NAMES: { SHADE_FINDER_RESULTS, PRODUCT },
    PAGE_DETAIL: { SHADE_FINDER, BEAUTY_PREFERENCES },
    CONTEXT: { BANNER },
    PAGE_LOAD
} = anaConsts;

class ContentStoreSOTBindings {
    static triggerSOTPageAnalytics = ({ ...data }) => {
        const eventData = {
            data
        };

        processEvent.process(PAGE_LOAD, eventData);
    };

    static shadeFinderResults = () => {
        const pageData = {
            pageName: `${PRODUCT}:${SHADE_FINDER_RESULTS}:n/a:*`,
            linkData: `${PRODUCT}:${SHADE_FINDER_RESULTS}:${BANNER}`,
            internalCampaign: `${SHADE_FINDER}:${BEAUTY_PREFERENCES}`,
            pageType: PRODUCT,
            pageDetail: SHADE_FINDER_RESULTS
        };

        digitalData.page.attributes = {
            ...digitalData.page.attributes,
            ...pageData
        };

        ContentStoreSOTBindings.triggerSOTPageAnalytics(pageData);
    };
}

export default ContentStoreSOTBindings;
