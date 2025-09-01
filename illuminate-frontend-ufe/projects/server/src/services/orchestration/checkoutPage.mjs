import {
    resolve,
    basename
} from 'path';

import PromiseHandler from '#server/services/utils/PromiseHandler.mjs';
import {
    ufeServiceCaller
} from '#server/services/utils/ufeServiceCaller.mjs';

import getMedia from '#server/services/api/catalog/media/getMedia.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import {
    CHANNELS,
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';
import getHeaderFooter from '#server/services/api/catalog/screens/getHeaderFooter.mjs';
import {
    handleErrorResponse
} from '#server/services/utils/handleErrorResponse.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

const CSX_CHECKOUT_MODAL = [
    'beautyInsiderBenefitsRougeReward',
    'beautyInsiderBenefitsBeautyInsiderCash',
    'beautyInsiderBenefitsFeaturedOffers',
    'beautyInsiderBenefitsCreditCardRewards'
];

const CSX_CHECKOUT_MODAL_KEY_MAPS = {
    'beautyInsiderBenefitsRougeReward': 'rougeRewardsModal',
    'beautyInsiderBenefitsBeautyInsiderCash': 'biCashModal',
    'beautyInsiderBenefitsFeaturedOffers': 'biFeaturedOffers',
    'beautyInsiderBenefitsCreditCardRewards': 'creditCardRewardsModal'
};


const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const TEMPLATES = {
    CHECKOUT: 'Checkout/Checkout',
    RWD_CHECKOUT: 'Checkout/RwdCheckout',
    FS_CHECKOUT: 'Checkout/FSCheckout',
    ORDER_CONFIRMATION: 'Checkout/Confirmation'
};

export default function checkoutPage(request, response) {
    const urlPath = request.apiOptions.apiPath,
        options = request.apiOptions,
        isCheckoutConfirmationPage = urlPath.indexOf('checkout/confirmation') > -1;
    const isCCAPEnabled = getConfigurationValue(request.apiOptions, 'isCCAPEnabled', false);
    const isRCPSCCAPEnabled = options.headers.Cookie[COOKIES_NAMES.RCPS_CCAP] === 'true';
    const isRCPSCheckoutEnabled = options.headers.Cookie[COOKIES_NAMES.RCPS_CHECKOUT] === 'true';
    const isRCPSFSCheckoutEnabled = options.headers.Cookie[COOKIES_NAMES.RCPS_FRICTIONLESS_CHECKOUT] === 'true';
    const isCMSCheckoutConfirmationEnabled = getConfigurationValue(request.apiOptions, 'isCMSCheckoutConfirmationEnabled', false);
    const isRwdCheckoutEnabled = getConfigurationValue(request.apiOptions, 'isRwdCheckout', false);
    const isFrictionlessCheckoutEnabled = getConfigurationValue(request.apiOptions, 'frictionlessCheckout', false);

    const shouldRenderRwdCheckout = isRCPSCheckoutEnabled && isRwdCheckoutEnabled;
    const shouldRenderFSCheckout = isRCPSFSCheckoutEnabled && (
        isFrictionlessCheckoutEnabled && isFrictionlessCheckoutEnabled.global.isEnabled && isFrictionlessCheckoutEnabled.global.isEnabled
    );

    const channel = (shouldRenderRwdCheckout || shouldRenderFSCheckout) && !isCheckoutConfirmationPage ? CHANNELS.RWD : options.channel;
    options.channel = channel;

    const apiList = [{
        identifier: 'configurationAPI',
        apiFunction: getConfiguration,
        options
    }, {
        identifier: 'headerFooterAPI',
        apiFunction: getHeaderFooter,
        options
    }];

    if (isCMSCheckoutConfirmationEnabled) {
        apiList.push({
            identifier: 'getCMSPageData',
            apiFunction: getCMSPageData,
            options: Object.assign({}, options, {
                apiPath: isCheckoutConfirmationPage ? '/orderconfirmation/pageOrderConfirmation' : '/checkout/pageCheckout'
            })
        });
    } else {
        apiList.push({
            identifier: 'mediaAPI',
            apiFunction: getMedia,
            options: Object.assign({}, {
                mediaId: isCheckoutConfirmationPage ? 49300020 : 47200025,
                includeRegionsMap: true
            }, options)
        });
    }

    if (isCCAPEnabled && isRCPSCCAPEnabled) {
        apiList.push({
            identifier: 'cmsAPI',
            apiFunction: getCMSPageData,
            options: Object.assign({}, options, {
                apiPath: '/basket',
                channel: 'web'
            })
        });
    }

    PromiseHandler(apiList, (err, data) => {
        logger.debug(`Services called and completed with error? ${err}`);

        if (!err) {
            const checkoutData = isCMSCheckoutConfirmationEnabled ? data.getCMSPageData.success : data.mediaAPI.success;

            const template = isCheckoutConfirmationPage ?
                TEMPLATES.ORDER_CONFIRMATION : shouldRenderFSCheckout ?
                    TEMPLATES.FS_CHECKOUT : shouldRenderRwdCheckout ?
                        TEMPLATES.RWD_CHECKOUT : TEMPLATES.CHECKOUT;


            const results = Object.assign({}, checkoutData, {
                apiConfigurationData: data.configurationAPI.success
            }, {
                headerFooterTemplate: data.headerFooterAPI.success
            }, {
                enableNoindexMetaTag: true,
                templateInformation: {
                    'template': template,
                    'channel': channel
                }
            }, {
                seoName: '/checkout'
            }, {
                checkoutCcBanner: data.cmsAPI?.success?.data?.checkoutCcBanner || {},
                biBenefitsModals: Object.fromEntries(
                    Object.entries(checkoutData?.data ?? {}).filter(([key]) => CSX_CHECKOUT_MODAL.includes(key))
                        .map(([key, value])=> [CSX_CHECKOUT_MODAL_KEY_MAPS[key], value])
                )
            });

            ufeServiceCaller(urlPath,
                results,
                response,
                Object.assign({}, options, {
                    cacheable: true,
                    responseHeaders: data.mergedHeaders
                }));
        } else {
            handleErrorResponse(response, err.error);
        }
    });
}
