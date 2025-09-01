import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';

async function getSiteIdFromLinkSynergy(linkshareSiteId, mid, murl, u1) {
    const url = '/gway/v1/creator-storefront/rakuten/site-id';
    const payload = {
        linkshareSiteId,
        mid,
        murl,
        u1
    };

    try {
        const data = await csfApiWrapper.makeAuthenticatedPostRequest(url, payload);

        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        const responseData = { ...data };

        return {
            data: responseData,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Collection Page data:', error);
        throw error;
    }
}

export default getSiteIdFromLinkSynergy;
