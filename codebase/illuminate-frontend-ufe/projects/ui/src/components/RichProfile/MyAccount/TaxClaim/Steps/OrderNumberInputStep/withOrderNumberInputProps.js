import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { eligibleOrdersSelector } from 'selectors/taxClaim/eligibleOrdersSelector';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import localeUtils from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
import TaxClaimActions from 'actions/TaxClaimActions';

const fields = createSelector(
    eligibleOrdersSelector,
    createStructuredSelector({
        orderNumberHeader: getTextFromResource(getText, 'orderTableLabelOrderNumber'),
        orderDateHeader: getTextFromResource(getText, 'orderTableLabelOrderDate'),
        selectedHeader: getTextFromResource(getText, 'orderTableLabelSelected'),
        genericError: getTextFromResource(getText, 'genericError'),
        viewMore: getTextFromResource(getText, 'viewMore'),
        viewLess: getTextFromResource(getText, 'viewLess'),
        select: getTextFromResource(getText, 'select'),
        deselect: getTextFromResource(getText, 'deselect'),
        selectionError: getTextFromResource(getText, 'orderTableSelctionError')
    }),
    (eligibleOrderInfo, textResources) => ({
        eligibleOrders: eligibleOrderInfo.eligibleOrders,
        eligibleOrdersError: eligibleOrderInfo.eligibleOrdersError,
        ...textResources
    })
);

const functions = {
    fetchEligibleOrders: TaxClaimActions.fetchEligibleOrders,
    updateSelectedOrders: TaxClaimActions.updateSelectedOrders
};

const withOrderNumberInputProps = wrapHOC(connect(fields, functions));

export {
    withOrderNumberInputProps, fields, functions
};
