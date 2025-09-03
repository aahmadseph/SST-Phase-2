import { UPDATE_PROFILE_STATUS, UPDATE_HAS_IDENTITY } from 'constants/actionTypes/auth';

const updateProfileStatus = profileStatus => dispatch => {
    dispatch({
        type: UPDATE_PROFILE_STATUS,
        payload: profileStatus
    });
};

const updateHasIdentity = data => dispatch => {
    dispatch({
        type: UPDATE_HAS_IDENTITY,
        payload: data
    });
};

export default { updateProfileStatus, updateHasIdentity };
