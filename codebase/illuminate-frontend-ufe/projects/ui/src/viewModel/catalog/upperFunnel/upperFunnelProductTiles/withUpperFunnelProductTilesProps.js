import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { PICKUP_FILTER_START, SAME_DAY_FILTER_START, SHIP_TO_HOME_FILTER_START } from 'constants/UpperFunnel';
import HelperUtils from 'utils/Helpers';
import StringUtils from 'utils/String';
import Date from 'utils/Date';
import preferredStoreSelector from 'selectors/user/preferredStoreSelector';
import { userSelector } from 'selectors/user/userSelector';

import { isShopYourStoreFilterEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreFilterEnabledSelector';
import { showEddOnBrowseAndSearchSelector } from 'viewModel/selectors/testTarget/showEddOnBrowseAndSearchSelector';
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { truncateText: originalTruncateText } = HelperUtils;

const getText = getLocaleResourceFile('components/Catalog/UpperFunnel/UpperFunnelProductTiles/locales', 'UpperFunnelProductTiles');
const STORE_NAME_MAX_LENGTH = 30;
const truncateText = text => originalTruncateText(text, STORE_NAME_MAX_LENGTH);

const fields = createSelector(
    createStructuredSelector({
        preferredStore: preferredStoreSelector,
        user: userSelector,
        curbsidePickupText: getTextFromResource(getText, 'curbsideAvailable'),
        shipToHomeTitle: getTextFromResource(getText, 'shipToHomeTitle'),
        shipToHomeShipMessage: getTextFromResource(getText, 'shipToHomeShipMessage', ['{0}', '{1}']),
        showEddOnBrowseAndSearch: showEddOnBrowseAndSearchSelector
    }),
    (_, ownProps) => ownProps.checkedRefinements,
    (_, ownProps) => ownProps.deliveryOptions,
    (_, ownProps) => ownProps.pickupEligible,
    (_, ownProps) => ownProps.sameDayEligible,
    (_, ownProps) => ownProps.shipToHomeEligible,
    isShopYourStoreFilterEnabledSelector,
    (
        {
            preferredStore, user, curbsidePickupText, shipToHomeTitle, shipToHomeShipMessage, showEddOnBrowseAndSearch
        },
        checkedRefinements,
        deliveryOptions,
        pickupEligible,
        sameDayEligible,
        shipToHomeEligible,
        isShopYourStoreFilterEnabled
    ) => {
        const { preferredStoreName } = preferredStore || {};
        const { preferredZipCode } = user || {};
        const {
            shipToHome: { deliveryDate } = {},
            pickup: { curbsideAvailable: curbsidePickupAvailable = false, pickupStoreName = '', pickupMessage: pickupTileSubTitle = '' } = {},
            sameDay: { sameDayMessage: sameDayTileSubTitle = '', sameDayShipMessage = '', sameDayTitle = '' } = {}
        } = deliveryOptions || {};
        let showPickupTile = !!(preferredStoreName && pickupEligible);
        const pickupTileEnabled = checkedRefinements.some(refinement => refinement.startsWith(PICKUP_FILTER_START));
        const pickupTileTitle = truncateText(pickupStoreName);
        let showSameDayTile = !!(preferredZipCode && sameDayEligible);
        const sameDayTileEnabled = checkedRefinements.some(refinement => refinement.startsWith(SAME_DAY_FILTER_START));
        const sameDayTileTitle = `${sameDayTitle}${!sameDayTileEnabled ? `: ${preferredZipCode}` : ''}`;
        let showShipToHomeTile = !!preferredZipCode && shipToHomeEligible && showEddOnBrowseAndSearch;
        const shipToHomeTileEnabled = checkedRefinements.some(refinement => refinement.startsWith(SHIP_TO_HOME_FILTER_START));
        const shipToHomeTileTitle = `${shipToHomeTitle}${!shipToHomeTileEnabled ? `: ${preferredZipCode}` : ''}`;
        const shipToHomeTileShipMessage = shipToHomeTileEnabled
            ? StringUtils.format(shipToHomeShipMessage, Date.getPromiseDate(deliveryDate, false, true), preferredZipCode)
            : '';

        // When any of the Upper Funnel Filters is checked,
        // we only display the corresponding tile in the Active state
        // if that specific filter is enabled.
        const hasActiveUpperFunnelFilter = pickupTileEnabled || sameDayTileEnabled || shipToHomeTileEnabled;

        if (isShopYourStoreFilterEnabled && hasActiveUpperFunnelFilter) {
            showPickupTile = showPickupTile && pickupTileEnabled;
            showSameDayTile = showSameDayTile && sameDayTileEnabled;
            showShipToHomeTile = showShipToHomeTile && shipToHomeTileEnabled;
        }

        const newProps = {
            curbsidePickupAvailable,
            curbsidePickupText,
            pickupTileEnabled,
            pickupTileSubTitle,
            pickupTileTitle,
            sameDayTileEnabled,
            sameDayShipMessage,
            sameDayTileSubTitle,
            sameDayTileTitle,
            showPickupTile,
            showSameDayTile,
            showShipToHomeTile,
            shipToHomeTileEnabled,
            shipToHomeTileTitle,
            shipToHomeTileShipMessage
        };

        return newProps;
    }
);

const withUpperFunnelProductTilesProps = wrapHOC(connect(fields));

export {
    withUpperFunnelProductTilesProps, fields
};
