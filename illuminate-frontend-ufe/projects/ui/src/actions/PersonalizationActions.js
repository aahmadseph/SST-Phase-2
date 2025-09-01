import cookieUtils from 'utils/Cookies';
import p13nUtils from 'utils/localStorage/P13n';

import p13nApi from 'services/api/p13n';

import homepageActions from 'actions/HomepageActions';

const { setP13NDataForPreview, setPersonalizationAnalyticsData } = homepageActions;
const { updatePersonalizationCache, setPersonalizationPlaceholder } = p13nUtils;

const getPersonalizedComponents = (personalization, user, callback) => (dispatch, _) => {
    const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);
    const { country, channel, language } = Sephora.renderQueryParams;
    const { userId: atgId, biId, defaultSAZipCode } = user;
    const contextEntryIds = [personalization.context];

    const payload = {
        channel,
        country,
        language,
        atgId,
        biId,
        contextEntryIds,
        zipCode: defaultSAZipCode
    };

    return p13nApi
        .getP13nData(payload)
        .then(data => {
            if (prvCookie) {
                dispatch(setP13NDataForPreview(data));
            } else {
                if (data?.length === 0) {
                    setPersonalizationPlaceholder(personalization.context);
                } else {
                    updatePersonalizationCache(data, true);
                    callback(data);
                    dispatch(setPersonalizationAnalyticsData(data));
                }
            }
        })
        .catch(() => {});
};

export default {
    getPersonalizedComponents
};
