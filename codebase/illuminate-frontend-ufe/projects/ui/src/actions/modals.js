import { ENABLE_MODALS } from 'constants/actionTypes/modalActions';

const enableModals = () => ({
    type: ENABLE_MODALS,
    payload: true
});

export default {
    enableModals
};
