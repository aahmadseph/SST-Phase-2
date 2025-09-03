import PageActionCreators from 'actions/framework/PageActionCreators';
import { SET_BEAUTY_PREFERENCES_REDESIGNED } from 'constants/actionTypes/beautyPreferencesRedesigned';
class BeautyPreferencesRedesignedCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        const action = {
            type: SET_BEAUTY_PREFERENCES_REDESIGNED
        };

        return async dispatch => {
            try {
                // TO DO: Real API call when backend is ready.
                const data = {};

                onDataLoaded(data);
                dispatch(action);
                onPageUpdated(data);

                return Promise.resolve();
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };
    };
}

const BeautyPreferencesRedesignedActions = new BeautyPreferencesRedesignedCreators();

export default BeautyPreferencesRedesignedActions;
