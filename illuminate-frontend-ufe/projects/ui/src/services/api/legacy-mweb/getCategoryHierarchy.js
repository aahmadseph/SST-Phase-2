import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

const { getLink } = urlUtils;

// Mweb TOM RestController.java getCategoryHierarchy => /api/shop/all

function dangerouslyAdaptData(data) {
    // Andrew Halfhill:
    // TODO: remove this once category template supports ufe components

    const categories = [];

    for (const propName in data) {
        if (propName !== 'responseStatus') {
            const cat = data[propName];

            // Left content set up
            const leftContent = cat.content && cat.content.region1 ? cat.content.region1 : [];

            if (leftContent.length) {
                leftContent.forEach(function (linkGroup) {
                    if (linkGroup.componentType === 9) {
                        linkGroup.componentType = 59;
                        linkGroup.displayTitle = linkGroup.title;

                        if (linkGroup.links && linkGroup.links.length) {
                            linkGroup.links.forEach(function (link) {
                                link.componentType = 58;
                                link.displayTitle = link.linkText;
                            });
                        }
                    }
                });
            }

            // Banner content set up
            const bannerContent = cat.megaNavMarketingBanner;

            if (bannerContent && bannerContent.length) {
                bannerContent.forEach(function (banner) {
                    if (banner) {
                        banner.componentType = 53;
                    }
                });
            }

            categories.push(cat);
        }
    }

    return categories;
}

function getCategoryHierarchy() {
    const url = '/api/catalog/categories/all';
    const options = { headers: { 'x-ufe-request': true } };

    return ufeApi.makeRequest(getLink(url), options).then(data => (data.errorCode ? Promise.reject(data) : dangerouslyAdaptData(data)));
}

export default {
    getCategoryHierarchy,
    dangerouslyAdaptData
};
