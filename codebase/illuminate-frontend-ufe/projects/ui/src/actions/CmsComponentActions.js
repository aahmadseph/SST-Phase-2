import { SET_CMS_COMPONET_DATA, SET_CMS_COMPONET_INNER_DATA } from 'constants/actionTypes/cmsComponents';

import store from 'store/Store';

const updateComsComponentPageData = ({ items, page }) => {
    if (items.length) {
        if (page) {
            store.dispatch({
                type: SET_CMS_COMPONET_DATA,
                payload: {
                    page,
                    items
                }
            });
        } else {
            store.dispatch({
                type: SET_CMS_COMPONET_INNER_DATA,
                payload: {
                    items
                }
            });
        }
    }
};

export default {
    updateComsComponentPageData
};
