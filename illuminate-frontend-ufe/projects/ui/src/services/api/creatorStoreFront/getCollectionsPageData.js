import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

async function getCollectionsPageData(creatorHandle) {
    const url = `/gway/v1/creator-storefront/creators/${creatorHandle}/collections`;

    try {
        const data = await csfApiWrapper.makeAuthenticatedRequest(url);

        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        const responseData = { ...data, pageType: CSF_PAGE_TYPES.COLLECTIONS };

        return {
            data: responseData,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Collection Page data:', error);
        throw error;
    }
}

export default getCollectionsPageData;
