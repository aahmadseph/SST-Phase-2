/* eslint-disable class-methods-use-this */
// https://jira.sephora.com/browse/UA-1872
const SEPHORA_GRAPHQL_API_ENDPOINT = Sephora.configurationSettings.gqlAPIEndpoint;

class FetchMiddleware {
    async request(context, _next) {
        const options = {
            method: 'POST',
            headers: context.headers,
            body: JSON.stringify(context.body)
        };
        const response = await window.fetch(SEPHORA_GRAPHQL_API_ENDPOINT, options);
        const responseData = await response.json();

        // Place for re-try logic if/when we need it

        return responseData;
    }
}

export default FetchMiddleware;
