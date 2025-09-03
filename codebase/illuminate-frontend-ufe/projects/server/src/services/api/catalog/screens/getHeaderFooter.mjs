/* eslint-disable object-curly-newline */
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

export default function getHeaderFooter(options = {
    country: 'US'
}) {
    const getHeaderFooterOptions = Object.assign({}, options, {
        apiPath: '/globalElements/headerFooter'
    });

    return getCMSPageData(getHeaderFooterOptions);
}
