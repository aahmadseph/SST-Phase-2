import AccessPoint from 'components/FrictionlessCheckout/DeliverTo/AccessPoint/AccessPoint';

import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { createDraftHalAddress } from 'components/FrictionlessCheckout/checkoutActions/actionWrapper';
import Actions from 'actions/Actions';
import withGlobalModals from 'hocs/withGlobalModals';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/DeliverTo/AccessPoint/locales', 'AccessPoint');

const { showMediaModal } = Actions;

const localizationSelector = createStructuredSelector({
    holdAtLocation: getTextFromResource(getText, 'holdAtLocation'),
    holdAtLocationCA: getTextFromResource(getText, 'holdAtLocationCA'),
    changeAlternatePickup: getTextFromResource(getText, 'changeAlternatePickup'),
    changeAlternateCA: getTextFromResource(getText, 'changeAlternateCA'),
    shipToFedex: getTextFromResource(getText, 'shipToFedex'),
    shipToPostPickup: getTextFromResource(getText, 'shipToPostPickup'),
    selectLocationNearYou: getTextFromResource(getText, 'selectLocationNearYou'),
    infoModalTitleUS: getTextFromResource(getText, 'infoModalTitleUS'),
    infoModalTitleCA: getTextFromResource(getText, 'infoModalTitleCA'),
    moreInfoShipToFedex: getTextFromResource(getText, 'moreInfoShipToFedex'),
    moreInfoShipToPickupLocation: getTextFromResource(getText, 'moreInfoShipToPickupLocation')
});

const fireInfoModalAnalytics = () => {
    const pageType = anaConsts.PAGE_TYPES.GENERIC_MODAL;
    const pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL;
    const pageName = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_CORRECTED;
    const pageSource = anaConsts.PAGE_TYPES.CONTENT_STORE;
    const eventData = {
        pageName: `${pageType}:${pageDetail}:n/a:*`,
        pageType: pageType,
        pageDetail: pageDetail,
        morePageInfo: {
            oneTagPageName: `${pageSource}:fedex ${pageName}:n/a:*`,
            oneTagPageType: pageSource,
            oneTagPageDetail: `fedex ${pageName}`
        }
    };
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
};

const withAccessPointModalProps = wrapHOC(
    connect(
        createSelector(localizationSelector, orderDetailsSelector, (localization, orderDetails) => {
            const isCa = isCanada();

            return {
                localization,
                orderDetails,
                createDraftHalAddress,
                fullTitle: isCa ? localization.shipToPostPickup : localization.shipToFedex,
                holdAtLocation: isCa ? localization.holdAtLocationCA : localization.holdAtLocation,
                alternateLocation: isCa ? localization.changeAlternateCA : localization.changeAlternatePickup,
                infoModalTitle: isCa ? localization.infoModalTitleCA : localization.infoModalTitleUS,
                moreInfoLabel: isCa ? localization.moreInfoShipToPickupLocation : localization.moreInfoShipToFedex,
                fireInfoModalAnalytics
            };
        }),
        { showMediaModal }
    )
);

export default withGlobalModals(withAccessPointModalProps(AccessPoint));
