import { UPDATE_SMS_STATUS } from 'constants/actionTypes/user';

const updateSmsStatus = data => ({
    type: UPDATE_SMS_STATUS,
    payload: data
});

export default {
    updateSmsStatus
};
