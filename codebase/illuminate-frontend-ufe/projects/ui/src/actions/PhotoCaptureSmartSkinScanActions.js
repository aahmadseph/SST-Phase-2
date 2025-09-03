/* eslint-disable no-unused-vars */
import { SET_PHOTO_CAPTURE_SMART_SKIN_SCAN_CONTENT } from 'constants/actionTypes/photoCaptureSmartSkinScan';

const data = {};

function setPhotoCaptureSmartSkinScanData(payload) {
    return {
        type: SET_PHOTO_CAPTURE_SMART_SKIN_SCAN_CONTENT,
        payload
    };
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, onError } }) =>
        dispatch => {
            onDataLoaded(data);
            dispatch(setPhotoCaptureSmartSkinScanData(data));

            onPageUpdated(data);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
