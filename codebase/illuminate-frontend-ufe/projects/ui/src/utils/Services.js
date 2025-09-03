import Location from 'utils/Location';
import UI from 'utils/UI';

const { isIOSSafari } = UI;

const shouldServiceRun = {
    testTarget: function () {
        return true;
    },

    addStructure: function () {
        return Location.isProductPage();
    },

    search: function () {
        return Location.isSearchPage();
    },

    catalog: function () {
        return true;
    },
    refreshBasket: function () {
        return true;
    }
};

const POST_LOAD_TIMEOUT = 15000;

/**
 * Returns a url param with a random value &_=rand
 * @returns (?|&)cb=rand
 */
const appendIOSSafariCacheBustingParam = (url = '') => {
    const randomNumber = Math.round(new Date().getTime() / 1000);
    const concatSymbol = url.includes('?') ? '&' : '?';
    const cacheBustingParam = isIOSSafari() ? `${concatSymbol}cb=${randomNumber}` : '';
    const newUrl = `${url}${cacheBustingParam}`;

    return newUrl;
};

export default {
    shouldServiceRun,
    POST_LOAD_TIMEOUT,
    appendIOSSafariCacheBustingParam
};
