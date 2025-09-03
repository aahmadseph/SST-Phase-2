import Actions from 'Actions';
import chooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';

const showChooseOptionsModal = data => {
    const { sku, analyticsContext, pageName } = data;

    chooseOptionsModalUtils.dispatchChooseOptions({
        productId: sku.productId,
        skuType: sku.type,
        options: { addCurrentSkuToProductChildSkus: true },
        sku,
        analyticsContext,
        pageName,
        ...data
    });
};

const closeChooseOptionsModal = () => {
    return Actions.showChooseOptionsModal({ isOpen: false });
};

const setFromChooseOptionsModal = value => {
    return {
        type: 'SET_FROM_CHOOSE_OPTIONS_MODAL',
        payload: value
    };
};

export default {
    showChooseOptionsModal,
    closeChooseOptionsModal,
    setFromChooseOptionsModal
};
