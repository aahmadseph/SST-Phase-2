import ACTION_TYPES from 'constants/actionTypes/productSamples';
import Actions from 'Actions';
import store from 'Store';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('actions/locales', 'ProductSamplesActions');
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const productSamplesActions = {
    setSampleProduct: function (product) {
        return {
            type: ACTION_TYPES.SET_PRODUCT_SAMPLE,
            payload: product
        };
    },
    closeProductSamplesModal: function ({ newSamplesSelected, hasSelectedSamples }) {
        store.dispatch(Actions.showProductSamplesModal({ isOpen: false }));
        Storage.local.removeItem(LOCAL_STORAGE.PDP_SAMPLES_MODAL);

        // Don't show confirmation modal if no samples are selected, or if the
        // user opened the modal but selected no new samples
        if (hasSelectedSamples && newSamplesSelected) {
            return Actions.showInfoModal({
                isOpen: true,
                title: getText('title'),
                message: getText('message'),
                buttonText: getText('ok')
            });
        }

        return null;
    },
    showErrorMessage: function () {
        return Actions.showInfoModal({
            isOpen: true,
            title: getText('errorTitle'),
            message: getText('errorMessage'),
            buttonText: getText('errorButton')
        });
    }
};

export default productSamplesActions;
