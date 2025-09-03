import profileApi from 'services/api/profile';
import UtilActions from 'utils/redux/Actions';
import UserActions from 'actions/UserActions';

const getCreditCardsFromProfile = profileId => dispatch => {
    profileApi
        .getCreditCardsFromProfile(profileId)
        .then(data => {
            dispatch(UtilActions.merge('order', 'paymentOptions', data));
        })
        .catch(error => {
            //eslint-disable-next-line no-console
            console.error(error);
            throw error;
        });
};

const removeDefaultPaymentFromProfile = defaultPayment => (dispatch, getState) => {
    const profileId = getState().user.profileId;
    profileApi
        .removeDefaultPaymentFromProfile(profileId, defaultPayment)
        .then(() => {
            dispatch(getCreditCardsFromProfile(profileId));
            dispatch(UserActions.toggleSelectAsDefaultPayment(defaultPayment));
        })
        .catch(error => {
            //eslint-disable-next-line no-console
            console.error(error);
            throw error;
        });
};

const addDefaultPaymentToProfile = defaultPayment => dispatch => {
    profileApi
        .addDefaultPaymentToProfile(defaultPayment)
        .then(() => {
            dispatch(UserActions.toggleSelectAsDefaultPayment(defaultPayment));
        })
        .catch(error => {
            //eslint-disable-next-line no-console
            console.error(error);
            throw error;
        });
};

export default {
    getCreditCardsFromProfile,
    removeDefaultPaymentFromProfile,
    addDefaultPaymentToProfile
};
