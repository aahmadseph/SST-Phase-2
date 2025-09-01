import csfApiWrapper from 'services/api/creatorStoreFront/csfApiWrapper';

async function getPostsNextPage(creatorHandle, nextPage) {
    const url = `/gway/v1/creator-storefront/creators/${creatorHandle}/posts/page/${nextPage}`;

    try {
        // Making the GET request without the request body
        const data = await csfApiWrapper.makeAuthenticatedRequest(url);

        // Check for error code in the response
        if (data?.fault || data?.responseStatus !== 200) {
            return Promise.reject(data.fault);
        }

        return {
            data,
            headers: {}
        };
    } catch (error) {
        Sephora.logger.verbose('Failed to fetch Posts Next Page data:', error);

        return Promise.reject(error);
    }
}

export default getPostsNextPage;
