import store from 'Store';
import actions from 'Actions';
import samplesApi from 'services/api/samples';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import productSamplesActions from 'actions/ProductSamplesActions';

const SampleProductUtils = {
    openSamplesModal: function (mainProductSample) {
        if (Sephora.configurationSettings.isPDPSamplingEnabled && mainProductSample) {
            store.dispatch(actions.showInterstice(true));
            samplesApi
                .getProductSamples(mainProductSample.productId)
                .then(data => {
                    // Set the current produuct id in local storage so that if the user navigates to another page
                    // without closing the modal, and comes back to PDP, the modal will open automatically as requested
                    // in SMPLS-39
                    Storage.local.setItem(LOCAL_STORAGE.PDP_SAMPLES_MODAL, mainProductSample);
                    store.dispatch(
                        actions.showProductSamplesModal({
                            isOpen: true,
                            samples: data.productSampleSku || [],
                            mainProductSample: mainProductSample
                        })
                    );
                })
                .catch(() => {
                    store.dispatch(productSamplesActions.showErrorMessage());
                })
                .finally(() => {
                    store.dispatch(actions.showInterstice(false));
                });
        }
    }
};

export default SampleProductUtils;
