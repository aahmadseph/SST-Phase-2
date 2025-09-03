import { getEnhancedContent } from 'services/api/Content/getEnhancedContent';
import { SET_ENHANCED_CONTENT } from 'constants/actionTypes/enhancedContent';
import spaUtils from 'utils/Spa';
import urlUtils from 'utils/Url';
import { Pages } from 'constants/Pages';
import languageLocaleUtils from 'utils/LanguageLocale';
import store from 'Store';
import userUtils from 'utils/User';

const { redirectTo } = urlUtils;
const { normalizePath } = spaUtils;
const { getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;

const setEnhancedContentData = data => ({
    type: SET_ENHANCED_CONTENT,
    payload: { data }
});

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, onError }, newLocation }) =>
        dispatch => {
            if (!Sephora.configurationSettings.isGamificationEnabled) {
                redirectTo('/');
            }

            try {
                const country = getCurrentCountry();
                const language = getCurrentLanguage();
                const path = normalizePath(newLocation?.path);
                const userId = store.getState().user.beautyInsiderAccount?.biAccountId;
                const isAnonymous = userUtils.isAnonymous();

                const promise = getEnhancedContent({
                    path,
                    language,
                    country,
                    userId,
                    isAnonymous
                });

                return promise
                    .then(({ data }) => {
                        if (data) {
                            onDataLoaded(data);
                            dispatch(setEnhancedContentData(data));
                            onPageUpdated(data);
                        } else {
                            redirectTo(Pages.Error404);
                        }
                    })
                    .catch(error => {
                        onError(error, newLocation);
                    });
            } catch (error) {
                onError(error, newLocation);

                return Promise.reject(error);
            }
        };

export default {
    isNewPage,
    openPage,
    setEnhancedContentData
};
