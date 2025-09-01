import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import UpdateError from 'components/RwdCheckout/Shared/UpdateError/UpdateError';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Shared/locales', 'UpdateError');

const textResources = createStructuredSelector({
    pleaseUpdateInfoMessage: getTextFromResource(getText, 'pleaseUpdateInfoMessage')
});

const connectedUpdateError = connect(
    createSelector(textResources, texts => {
        return texts;
    })
);

const withUpdateErrorProps = wrapHOC(connectedUpdateError);

export default withUpdateErrorProps(UpdateError);
