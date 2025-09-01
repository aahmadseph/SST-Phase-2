import { SET_BUY_PAGE } from 'constants/actionTypes/buy';
import getBuyPageData from 'services/api/Buy';
import seoBuyPages from 'services/api/Buy/seoBuyPages';
const { getSeoBuyPage } = seoBuyPages;
import productUtils from 'utils/product';
import Location from 'utils/Location';
import SpaUtils from 'utils/Spa';
import UrlUtils from 'utils/Url';
import languageLocaleUtils from 'utils/LanguageLocale';

const { buildProductImageSrc } = productUtils;

const isNewPage = ({ newLocation, previousLocation }) => {
    return previousLocation.prevPath !== newLocation.newPath;
};

const MAX_IMAGES_TO_PRELOAD = 8;

function getImagesToPreload({ skus }) {
    const imagesToPreload = [];

    Object.values(skus)
        .slice(0, MAX_IMAGES_TO_PRELOAD)
        .forEach(({ skuId: id, skuImages }) => {
            const [, , x1PixelDensityUrl, x2PixelDensityUrl] = buildProductImageSrc({
                id,
                skuImages,
                size: 240,
                generateSrcs: true
            });
            imagesToPreload.push({
                x1PixelDensityUrl,
                x2PixelDensityUrl
            });
        });

    return imagesToPreload;
}

function setBuyPageData(payload) {
    return {
        type: SET_BUY_PAGE,
        payload
    };
}

const openPage = ({ newLocation, events: { onDataLoaded, onPageUpdated, onError } }) => {
    const optiversal = Sephora.configurationSettings?.optiversal || {};
    const { isNewVersionEnabledUS = false, isNewVersionEnabledCA = false } = optiversal;
    const currentCountry = languageLocaleUtils.getCurrentCountry();
    const isNewVersionEnabled = (currentCountry === 'US' && isNewVersionEnabledUS) || (currentCountry === 'CA' && isNewVersionEnabledCA);

    if (isNewVersionEnabled) {
        const path = SpaUtils.normalizePath(newLocation?.path);
        UrlUtils.redirectTo(path);
    }

    const enableBuyPagesFromSeoService = Sephora.configurationSettings.enableBuyPagesFromSeoService;
    const getBuyPageAPI = enableBuyPagesFromSeoService ? getSeoBuyPage : getBuyPageData;

    return dispatch => {
        return getBuyPageAPI(newLocation)
            .then(data => {
                const { redirectUrl, redirectType } = data || {};

                if (!!redirectUrl && !!redirectType) {
                    Location.navigateTo(null, redirectUrl);
                } else {
                    const imagesToPreload = getImagesToPreload(data);
                    onDataLoaded(data, imagesToPreload);
                    dispatch(setBuyPageData(data));
                    onPageUpdated(data);
                }
            })
            .catch(onError);
    };
};

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
