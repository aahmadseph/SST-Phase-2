import getBeautyOffer from 'services/api/BeautyOffer/getBeautyOffer';
import { SET_CONTENT_STORE } from '../constants/actionTypes/contentStore';
import nthCategory from 'reducers/page/nthCategory';
const { ACTION_TYPES: TYPES } = nthCategory;

const setContentStoreData = data => ({
    type: SET_CONTENT_STORE,
    payload: { data }
});

const isNewPage = () => true;

// eslint-disable-next-line object-curly-newline
const openPage =
    ({ events: { onPageUpdated, onDataLoaded, onError } }) =>
        dispatch => {
            try {
                const catalogPromise = getBeautyOffer.getBeautyOfferData();

                return catalogPromise
                    .then(data => {
                    // TODO: Whenever data is loaded events.onDataLoaded(...) has to be invoked;
                        data.contextId = Math.random().toString(36).substr(2, length);
                        onDataLoaded(data);
                        const action = setContentStoreData(data);
                        dispatch(action);

                        onPageUpdated(data);
                    })
                    .catch(onError);
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };

export default {
    isNewPage,
    openPage,
    TYPES
};
