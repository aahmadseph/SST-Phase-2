import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';
// import RCPSCookies from 'utils/RCPSCookies';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

async function getFeaturedPageData(creatorHandle) {
    const url = `/gway/v1/creator-storefront/creators/${creatorHandle}`;

    try {
        const data = await csfApiWrapper.makeAuthenticatedRequest(url);

        // Check for error code in the response
        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        const responseData = { ...data, pageType: CSF_PAGE_TYPES.POSTS };

        return {
            data: responseData,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Featured Page data:', error);
        throw error;
    }
}

export default getFeaturedPageData;
