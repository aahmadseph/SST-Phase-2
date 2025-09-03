import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import SaveToAccountCheckbox from 'components/RwdCheckout/Shared/PayPal/SaveToAccountCheckbox';
import EditDataActions from 'actions/EditDataActions';

const { updateEditData } = EditDataActions;

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Shared/PayPal/locales', 'SaveToAccountCheckbox');

const textResources = createStructuredSelector({
    saveToMyAccountCheckbox: getTextFromResource(getText, 'saveToMyAccountCheckbox')
});

const connectedSaveToAccountCheckbox = connect(
    createSelector(textResources, texts => {
        return texts;
    }),
    { updateEditData }
);

const witSaveToAccountCheckbox = wrapHOC(connectedSaveToAccountCheckbox);

export default witSaveToAccountCheckbox(SaveToAccountCheckbox);
