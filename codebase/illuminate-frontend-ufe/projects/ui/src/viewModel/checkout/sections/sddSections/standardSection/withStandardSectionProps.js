import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import orderUtils from 'utils/Order';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';
import BCCUtils from 'utils/BCC';
import checkoutUtils from 'utils/Checkout';
import store from 'store/Store';
import Actions from 'Actions';
import LocaleUtils from 'utils/LanguageLocale';
import shippingGroupsEntriesSelector from 'selectors/order/orderDetails/shippingGroups/shippingGroupsEntries/shippingGroupsEntriesSelector';
import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';

const {
    MEDIA_IDS: { AUTO_REPLENISHMENT }
} = BCCUtils;

const {
    SHIPPING_GROUPS: { HARD_GOOD, SAME_DAY, GIFT }
} = orderUtils;
const getText = LocaleUtils.getLocaleResourceFile('components/Checkout/Sections/SddSections/StandardSection/locales', 'StandardSection');
const emptyArray = [];

const withStandardSectionProps = connect(
    createSelector(
        shippingGroupsEntriesSelector,
        () => getText('title'),
        isSplitEDDEnabledSelector,
        (shippingGroups = emptyArray, title, isSplitEDDEnabled) => {
            const {
                shippingGroup,
                shippingGroup: {
                    shippingMethod: { promiseDate, promiseDateCutOffDescription, promiseDateLabel, shippingMethodDescription: deliveryInfo = '' } = {}
                } = {}
            } = shippingGroups.find(group => group.shippingGroupType === HARD_GOOD) || {};
            const promiseDateInfo = { promiseDate, promiseDateCutOffDescription, promiseDateLabel };
            const orderInfo = promiseDate ? promiseDateCutOffDescription : '';
            const { shippingGroup: { shippingMethod: { shippingFee = '', shippingMethodType = '' } = {} } = {} } =
                shippingGroups.find(group => group.shippingGroupType !== SAME_DAY) || {};
            let subTitle = '';

            if (shippingGroups.length > 2) {
                subTitle = getText('subTitle');
            } else if (shippingFee.length && shippingMethodType.length) {
                subTitle = `${shippingFee} - ${shippingMethodType}`;
            }

            const autoReplenTitle = getText('autoReplenTitle');
            const showReplenishModal = event => {
                event?.preventDefault();
                event?.stopPropagation();

                const mediaId = AUTO_REPLENISHMENT;
                const titleDataAt = 'autoReplenishModalTitle';

                store.dispatch(
                    Actions.showMediaModal({
                        isOpen: true,
                        mediaId,
                        titleDataAt
                    })
                );

                const linkData = anaConsts.LinkData.AUTO_REPLENISH;
                const pageType = anaConsts.PAGE_TYPES.AUTO_REPLENISH;
                const pageDetail = anaConsts.PAGE_DETAIL.SUBSCRIPTION_INFO;

                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: {
                        pageName: `${pageType}:${pageDetail}:n/a:*`,
                        pageType,
                        pageDetail,
                        linkData
                    }
                });
            };

            const isSDDAndGiftCardOnly =
                shippingGroups?.filter(group => group.shippingGroupType !== SAME_DAY && group.shippingGroupType !== GIFT).length === 0;
            const shippingMethod = shippingGroup?.shippingMethod || Empty.Object;
            const showSplitEDD = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);

            let combinedShippingGroup;

            if (showSplitEDD) {
                const orderDetails = { shippingGroups: { shippingGroupsEntries: shippingGroups } };
                const hasGiftCardShippingGroup = !!orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);

                // GUAR-5514
                // When user's basket has SameDayShippingGroup + HardGoodShippingGroup + GiftCardShippingGroup,
                // we are going to combine items and deliveryGroups from GiftCardShippingGroup into HardGoodShippingGroup
                // in order to show them as 1 group in the UI.
                if (hasGiftCardShippingGroup) {
                    combinedShippingGroup = orderUtils.combineShippingGroupsItemsAndDeliveryGroups(orderDetails, GIFT, HARD_GOOD);
                }
            }

            return {
                deliveryInfo,
                orderInfo,
                promiseDateInfo,
                subTitle,
                title,
                autoReplenTitle,
                showReplenishModal,
                isSDDAndGiftCardOnly,
                shippingGroup: combinedShippingGroup || shippingGroup,
                showSplitEDD
            };
        }
    )
);

export default withStandardSectionProps;
