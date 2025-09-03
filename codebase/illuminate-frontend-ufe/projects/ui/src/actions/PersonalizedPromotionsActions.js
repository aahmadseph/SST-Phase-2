import personalizedPromotions from 'reducers/personalizedPromotions';
const { ACTION_TYPES: TYPES } = personalizedPromotions;
import ProfileApi from 'services/api/profile';
import UserUtils from 'utils/User';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import CacheUtils from 'utils/Cache';
const DEFAULT_EXPIRY = Storage.MINUTES * 60;
const DELAY = Storage.MINUTES * 5;
const PST_OFFSET = 8;
import localeUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';

const updatePersonalizedPromotions = data => ({
    type: TYPES.UPDATE_PERSONALIZED_PROMOTIONS,
    data: data
});

const createEmptyPayload = profileId => ({
    profileId: profileId,
    items: [],
    loading: false
});

const { isBeautyOffersEnabled } = Sephora.configurationSettings;

const loadPersonalizedPromotions = () => (dispatch, getState) => {
    const {
        auth,
        user: { profileId }
    } = getState();

    const payload = createEmptyPayload();
    payload.loading = true;
    dispatch(updatePersonalizedPromotions(payload));

    const cachedPromotions = Storage.local.getItem(LOCAL_STORAGE.PERSONALIZED_PROMOTIONS, false, true);
    const isUS = localeUtils.isUS();

    if (UserUtils.isAnonymous(auth)) {
        dispatch(updatePersonalizedPromotions(createEmptyPayload()));
    } else if (cachedPromotions && cachedPromotions.profileId === profileId) {
        dispatch(updatePersonalizedPromotions(cachedPromotions));
    } else {
        ProfileApi.getPersonalizedPromotions(profileId, isUS)
            .then(data => {
                const showPromos = isBeautyOffersEnabled && isUS;
                const freshData = {
                    profileId,
                    items: showPromos ? data.allPromos.slice(0, 5) : data.personalizedPromotions || Empty.Array,
                    loading: false,
                    hasNewPersonalizedPromotions: false
                };
                const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);

                if (userData?.data?.personalizedPromotions?.hasNewPersonalizedPromotions) {
                    userData.data.personalizedPromotions.hasNewPersonalizedPromotions = false;
                    Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userData.data, userData.expiry);
                }

                const expiry = CacheUtils.getLessOfTillMidnightOrDefault(DEFAULT_EXPIRY, DELAY, PST_OFFSET);
                Storage.local.setItem(LOCAL_STORAGE.PERSONALIZED_PROMOTIONS, freshData, expiry);
                dispatch(updatePersonalizedPromotions(freshData));
            })
            .catch(error => {
                Sephora.logger.verbose('[ERROR GETTING PERSONALIZED PROMOTIONS]: ', error);
                dispatch(updatePersonalizedPromotions(createEmptyPayload(profileId)));
            });
    }
};

export default {
    TYPES,
    loadPersonalizedPromotions,
    updatePersonalizedPromotions
};
