import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import AlternatePickup from 'components/RwdCheckout/Sections/AlternatePickup/AlternatePickup';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import CheckoutApi from 'services/api/checkout';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/AlternatePickup/locales', 'AlternatePickup');

const localization = createStructuredSelector({
    alternatePickupPerson: getTextFromResource(getText, 'alternatePickupPerson'),
    cannotModifyMessage: getTextFromResource(getText, 'cannotModifyMessage'),
    ok: getTextFromResource(getText, 'ok'),
    removeAltPickupTitle: getTextFromResource(getText, 'removeAltPickupTitle'),
    removeAltPickupMessage: getTextFromResource(getText, 'removeAltPickupMessage'),
    remove: getTextFromResource(getText, 'remove'),
    addedAlternatePickup: getTextFromResource(getText, 'addedAlternatePickup'),
    addedAlternatePickupMsg: vars => getTextFromResource(getText, 'addedAlternatePickupMsg', vars),
    genericErrorMessage: getTextFromResource(getText, 'genericErrorMessage'),
    firstName: getTextFromResource(getText, 'firstName'),
    lastName: getTextFromResource(getText, 'lastName'),
    email: getTextFromResource(getText, 'email'),
    save: getTextFromResource(getText, 'save'),
    saveAndContinue: getTextFromResource(getText, 'saveAndContinue'),
    cancel: getTextFromResource(getText, 'cancel'),
    edit: getTextFromResource(getText, 'edit'),
    alternatePickup: getTextFromResource(getText, 'alternatePickup'),
    addAltPickup: vars => getTextFromResource(getText, 'addAltPickup', vars),
    updateAltPickup: vars => getTextFromResource(getText, 'updateAltPickup', vars),
    orderDetails: getTextFromResource(getText, 'orderDetails'),
    addAlternatePickup: getTextFromResource(getText, 'addAlternatePickup')
});

const fields = createStructuredSelector({
    localization
});

const fireAnalytics = (analyticsActionInfo, type = anaConsts.LINK_TRACKING_EVENT) => {
    const isLinkTracking = type === anaConsts.LINK_TRACKING_EVENT;
    const isPageLoad = type === anaConsts.ASYNC_PAGE_LOAD;

    const payload = {
        data: {
            pageName: anaConsts.ALT_PICKUP.PAGE_NAME
        }
    };

    if (isLinkTracking) {
        payload.data.linkName = analyticsActionInfo;
        payload.data.actionInfo = analyticsActionInfo;
    } else if (isPageLoad) {
        payload.data.linkData = analyticsActionInfo;
        payload.data.previousPageName = digitalData.page.attributes.previousPageData.pageName;
    }

    return processEvent.process(type, payload);
};

const functions = {
    showInfoModal: Actions.showInfoModal,
    fireAnalytics
};

const withComponentProps = wrapHOC(
    connect(
        createSelector(fields, texts => {
            return {
                ...texts,
                removeAlternatePickupPerson: CheckoutApi.removeAlternatePickupPerson,
                addAlternatePickupPerson: CheckoutApi.addAlternatePickupPerson,
                updateAlternatePickupPerson: CheckoutApi.updateAlternatePickupPerson
            };
        }),
        functions
    )
);

export default withComponentProps(AlternatePickup);
