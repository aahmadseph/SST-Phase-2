/* eslint-disable no-unused-vars */
import { SET_SMART_SKIN_SCAN_CONTENT } from 'constants/actionTypes/smartSkinScan';

const data = {};

function setSmartSkinScanData(payload) {
    return {
        type: SET_SMART_SKIN_SCAN_CONTENT,
        payload
    };
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, onError } }) =>
        dispatch => {
            if (!Sephora.configurationSettings.isSmartSkinScanEnabled) {
                onError({ responseStatus: 404 }, null);
            }

            onDataLoaded(data);
            dispatch(setSmartSkinScanData(data));

            onPageUpdated(data);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
