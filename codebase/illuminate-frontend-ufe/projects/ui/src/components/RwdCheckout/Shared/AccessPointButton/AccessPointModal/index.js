import AccessPointModal from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointModal/AccessPointModal';

import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Shared/AccessPointButton/AccessPointModal/locales', 'AccessPointModal');

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({
    user: userSelector,
    order: orderSelector,
    confirmButton: getTextFromResource(getText, 'confirmButton'),
    modalTitle: getTextFromResource(getText, isCanada() ? 'modalTitleCA' : 'modalTitle'),
    fedexOnsite: getTextFromResource(getText, 'fedexOnsite'),
    openUntil: getTextFromResource(getText, 'openUntil'),
    away: getTextFromResource(getText, 'away'),
    detailsModalTitle: getTextFromResource(getText, 'detailsModalTitle'),
    getDirections: getTextFromResource(getText, 'getDirections'),
    loactionHours: getTextFromResource(getText, 'loactionHours'),
    halCompany: getTextFromResource(getText, isCanada() ? 'canadaPostLocations' : 'fedexLocations'),
    pleaseTryAgain: getTextFromResource(getText, 'pleaseTryAgain')
});

const withAccessPointModalProps = wrapHOC(
    connect(
        createSelector(fields, selectorFields => {
            return {
                ...selectorFields,
                unableToFindResults: getText('unableToFindResults', [selectorFields.halCompany]),
                enterSearchParams: getText('enterSearchParams', [selectorFields.halCompany]),
                getText
            };
        })
    )
);

export default withAccessPointModalProps(AccessPointModal);
