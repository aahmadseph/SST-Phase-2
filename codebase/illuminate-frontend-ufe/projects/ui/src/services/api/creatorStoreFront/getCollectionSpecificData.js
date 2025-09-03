import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

async function getCollectionSpecificData(collectionId, creatorHandle, pageNum) {
    // Construct the URL dynamically with the collectionId and creatorHandle
    let url = `/gway/v1/creator-storefront/creators/${creatorHandle}/collections/${collectionId}`;

    if (pageNum) {
        url += `/products/page/${pageNum}`;
    }

    try {
        const data = await csfApiWrapper.makeAuthenticatedRequest(url);

        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        const responseData = { ...data, pageType: CSF_PAGE_TYPES.COLLECTION };

        return {
            data: responseData,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Collection specific Page data:', error);

        return Promise.reject(error);
    }
}

export default getCollectionSpecificData;
