import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { userSelector } from 'selectors/user/userSelector';
import selectedDeliveryOptionSelector from 'selectors/modals/chooseOptionsModal/selectedDeliveryOptionSelector';
import ChooseOptionsActions from 'actions/ChooseOptionsActions';
import productActions from 'actions/ProductActions';
import snbApi from 'services/api/search-n-browse';
import Actions from 'actions/Actions';

const { closeChooseOptionsModal, setFromChooseOptionsModal } = ChooseOptionsActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const { wrapHOC } = FrameworkUtils;

const getText = getLocaleResourceFile('components/GlobalModals/ChooseOptionsModal/locales', 'ChooseOptionsModal');

const localization = createStructuredSelector({
    seeFullDetails: getTextFromResource(getText, 'seeFullDetails'),
    modalTitle: getTextFromResource(getText, 'chooseOptions')
});

const fields = createSelector(
    localization,
    userSelector,
    selectedDeliveryOptionSelector,
    (textResources, user, selectedChooseOptionsDeliveryOption) => {
        const { preferredStoreInfo } = user || {};

        return {
            localization: textResources,
            preferredStoreInfo,
            selectedChooseOptionsDeliveryOption
        };
    }
);

const functions = dispatch => ({
    onCancel: () => dispatch(closeChooseOptionsModal()),
    requestClose: () => dispatch(closeChooseOptionsModal()),
    getFulfillmentOptions: source => dispatch(productActions.getFulfillmentOptions(source)),
    updateCurrentProduct: currentSku => dispatch(productActions.updateCurrentProduct(currentSku)),
    showChooseOptionsModal: argumentsObj => dispatch(Actions.showChooseOptionsModal(argumentsObj)),
    setFromChooseOptionsModal: value => dispatch(setFromChooseOptionsModal(value)),
    setChooseOptionsDeliveryOption: selectedOption => dispatch(Actions.setChooseOptionsDeliveryOption(selectedOption)),
    showGenericErrorModal: ({ genericErrorTitle }) =>
        dispatch(
            Actions.showGenericErrorModal({
                isOpen: true,
                genericErrorTitle
            })
        ),
    getProductDetailsLite: snbApi.getProductDetailsLite
});

const withChooseOptionsModalProps = wrapHOC(connect(fields, functions));

export {
    withChooseOptionsModalProps, fields, functions
};
