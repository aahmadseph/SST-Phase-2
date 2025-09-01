import { getContent } from 'services/api/Content/getContent';
import { SET_CONTENT } from 'constants/actionTypes/content';
import content from 'reducers/page/content';
import SpaUtils from 'utils/Spa';
import UrlUtils from 'utils/Url';
import TestTargetActions from 'actions/TestTargetActions';

const { ACTION_TYPES: TYPES } = content;
const { resetOffers } = TestTargetActions;

const setContentData = data => ({
    type: SET_CONTENT,
    payload: { data }
});

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, onError }, newLocation }) =>
        dispatch => {
            try {
                const { country, language } = Sephora.renderQueryParams;
                const path = SpaUtils.normalizePath(newLocation?.path);
                const promise = getContent({ path, language, country });

                return promise
                    .then(({ data }) => {
                        if (data) {
                            onDataLoaded(data);

                            dispatch(resetOffers());
                            dispatch(setContentData(data));

                            onPageUpdated(data);
                        } else {
                            UrlUtils.redirectTo('/');
                        }
                    })
                    .catch(error => {
                        onError(error, newLocation, true);
                    });
            } catch (error) {
                onError(error, newLocation, true);

                return Promise.reject(error);
            }
        };

export default {
    isNewPage,
    openPage,
    TYPES
};
