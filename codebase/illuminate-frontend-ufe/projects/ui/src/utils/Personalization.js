import p13nUtils from 'utils/localStorage/P13n';
import cookieUtils from 'utils/Cookies';
import analyticsUtils from 'analytics/utils';
import dateUtils from 'utils/Date';
import Empty from 'constants/empty';
import { RUPEX_FORM_RESPONSE_TYPES, PREVIEW_COOKIE_VALUES } from 'constants/personalization';

const { SUBMIT } = RUPEX_FORM_RESPONSE_TYPES;

const { getPersonalizationCache, setPersonalizationCache } = p13nUtils;

const checkDataToDisplay = (cache, personalization) => {
    if (cache) {
        if (personalization?.activeAbTestIds?.indexOf(cache?.p13n?.abTestId) !== -1) {
            return cache;
        } else if (!personalization?.activeAbTestIds) {
            return cache;
        } else if (!cache.p13n?.abTestId && cache.variationData) {
            return cache;
        }
    }

    return null;
};

const getPersonalizedComponent = (personalization = {}, user, p13n, isBannerComponent) => {
    const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

    if (prvCookie && p13n.data?.length > 0) {
        return p13n.data.find(item => item.context === personalization?.context);
    } else if (user.isInitialized && personalization?.isEnabled && p13n.isInitialized) {
        const cachedData = getPersonalizationCache(personalization?.context);
        const p13nData = checkDataToDisplay(cachedData, personalization);

        if (p13nData) {
            if (isBannerComponent) {
                digitalData.page.attributes.contentfulPersonalization = analyticsUtils.getContentfulPersonalization(p13nData);
            }

            return p13nData;
        }
    }

    return [];
};

const getMegaNavPersonalizedComponent = (p13n, personalization, user) => {
    let personalizedComponent = Empty.Array;
    const cachedData = getPersonalizationCache(personalization?.context);

    if (cachedData && !user.isAnonymous) {
        personalizedComponent = cachedData;
    } else {
        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

            if (prvCookie && p13n.data?.length > 0) {
                personalizedComponent = p13n.data.find(item => item.context === personalization?.context) || Empty.Array;
            } else if (p13n.headData?.length) {
                setPersonalizationCache(p13n.headData);
                const headItemData = p13n.headData.find(item => (item.p13n?.context || item.context) === personalization?.context);
                personalizedComponent = checkDataToDisplay(headItemData, personalization);
            } else if (user.isAnonymous) {
                personalizedComponent = Empty.Array;
            } else {
                personalizedComponent = getPersonalizedComponent(personalization, user, p13n, false);
            }
        }
    }

    return personalizedComponent;
};

const getformattedPreviewDateTime = previewDateTime => {
    const date = new Date(previewDateTime);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
        date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;

    return formattedDate;
};

const getCustomerAttributes = (customer360, previewDateTime, viewActive, includeOOS, atgId) => {
    const { country, language } = Sephora.renderQueryParams;
    const showAsset = viewActive ? 'active' : 'all';
    let customerObj = customer360;
    const formattedPreviewDateTime = getformattedPreviewDateTime(previewDateTime);

    if (!customerObj) {
        customerObj = {
            customer360Attribute: {},
            customerPropensity: {},
            offerDetails: {}
        };
    }

    return {
        customerFullObject: {
            ...customerObj
        },
        channel: 'web',
        locale: `${language}-${country}`,
        isPreview: true,
        previewDateTime: formattedPreviewDateTime,
        showAsset,
        includeOOS,
        // eslint-disable-next-line camelcase
        atg_id: atgId
    };
};

const parsePrvCookie = prvCookie => {
    const [date, viewActiveAssets, includeOOS, context, variation] = (prvCookie || Empty.String).split('|');
    const { ASSETS_ALL, OUT_OF_STOCK } = PREVIEW_COOKIE_VALUES;

    return {
        date: date || Empty.String,
        viewActiveAssets: viewActiveAssets !== ASSETS_ALL,
        includeOOS: includeOOS === OUT_OF_STOCK,
        context: context || Empty.String,
        variation: variation || Empty.String
    };
};

const createPrvCookie = ({
    date = Empty.String, viewActiveAssets = true, includeOOS = false, context = Empty.String, variation = Empty.String
}) => {
    const { ASSETS_ACTIVE, ASSETS_ALL, OUT_OF_STOCK, IN_STOCK } = PREVIEW_COOKIE_VALUES;
    const epochSeconds = dateUtils.getEpochSecondsFromPSTDateTime(date);
    const activeOrAllAssets = viewActiveAssets ? ASSETS_ACTIVE : ASSETS_ALL;
    const outOrInStock = includeOOS ? OUT_OF_STOCK : IN_STOCK;
    const prvCookie = `${epochSeconds}|${activeOrAllAssets}|${outOrInStock}|${context}|${variation}`;

    return prvCookie;
};

const postRupexFormSubmit = () => {
    window.postMessage({ type: SUBMIT, data: true }, '*');
};

// isEnabled : isNBCEnabled or isNBOEnabled
const shouldShowPersonalizationOverlay = isEnabled => {
    return cookieUtils.read(cookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE) && Sephora?.configurationSettings?.isMLEnhancementsPreviewEnabled && isEnabled;
};

export default {
    checkDataToDisplay,
    getPersonalizedComponent,
    getMegaNavPersonalizedComponent,
    getCustomerAttributes,
    postRupexFormSubmit,
    parsePrvCookie,
    createPrvCookie,
    shouldShowPersonalizationOverlay
};
