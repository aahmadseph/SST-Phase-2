import utils from 'analytics/utils';

export default (function () {
    return {
        trackNavClick: function (path) {
            const cleanPath = utils.removeUndefinedItems(path);

            utils.arrayItemsToLowerCase(cleanPath);

            utils.setNextPageData({ navigationInfo: utils.buildNavPath(cleanPath) });
        }
    };
}());
