import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import PazeActions from 'actions/PazeActions';
import UserActions from 'actions/UserActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { toggleSelectAsDefaultPayment } = UserActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { loadIframe } = PazeActions;
// TODO PAZE: Change for correct Paze text when finished
const getText = getLocaleResourceFile('components/Paze/PazePaymentMethod/locales', 'PazePaymentMethod');

const fields = createSelector(
    userSelector,
    orderDetailsSelector,
    isAnonymousSelector,
    createStructuredSelector({
        errorMessage: getTextFromResource(getText, 'errorMessage'),
        legalNotice: getTextFromResource(getText, 'legalNotice')
    }),
    (user, orderDetails, isAnonymous, textResources) => {
        const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
        const checked = user.selectedAsDefaultPaymentName === 'paze';

        return {
            amount,
            checked,
            isAnonymous,
            ...textResources
        };
    }
);

const functions = {
    loadIframe,
    toggleSelectAsDefaultPayment
};

const withPazePaymentMethodProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withPazePaymentMethodProps
};
