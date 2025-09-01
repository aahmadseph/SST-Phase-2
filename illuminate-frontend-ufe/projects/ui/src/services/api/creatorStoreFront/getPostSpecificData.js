import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';

async function getPostSpecificData(postId, creatorHandle) {
    // Construct the URL dynamically with the postId
    const url = `/gway/v1/creator-storefront/creators/${creatorHandle}/posts/${postId}`;

    try {
        const data = await csfApiWrapper.makeAuthenticatedRequest(url);

        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        const responseData = { ...data, pageType: 'post' };

        return {
            data: responseData,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Post specific Page data:', error);

        return Promise.reject(error);
    }
}

export default getPostSpecificData;
