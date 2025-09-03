import { UPDATE_SEGMENTS } from 'constants/actionTypes/user';

const updateSegments = data => ({
    type: UPDATE_SEGMENTS,
    payload: data
});

export default {
    updateSegments
};
