import { connect } from 'react-redux';

import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

/**
 * Setting a new last time seen time into the session storage
 * @param lastTimeSeen
 */
const updateWelcomeMatLastTimeSeen = lastTimeSeen => {
    Storage.session.setItem(LOCAL_STORAGE.WELCOME_MAT_LAST_TIME_SEEN, lastTimeSeen);
};

/**
 * Reading a last time seen welcome mat time from the session storage
 * @returns {number}
 */
const getLastTimeSeen = () => Storage.session.getItem(LOCAL_STORAGE.WELCOME_MAT_LAST_TIME_SEEN) || 0;

const removeLastTimeSeen = () => Storage.session.removeItem(LOCAL_STORAGE.WELCOME_MAT_LAST_TIME_SEEN);

export default connect(null, null, (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        ...stateProps,
        getLastTimeSeen,
        updateWelcomeMatLastTimeSeen,
        removeLastTimeSeen,
        ...dispatchProps
    };
});
