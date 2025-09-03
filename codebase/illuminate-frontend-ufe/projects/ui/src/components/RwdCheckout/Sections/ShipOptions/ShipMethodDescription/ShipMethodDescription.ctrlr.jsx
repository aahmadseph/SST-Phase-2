/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import checkoutUtils from 'utils/Checkout';
import dateUtils from 'utils/Date';
import InfoButton from 'components/InfoButton/InfoButton';
import CheckoutLegalOptIn from 'components/RwdCheckout/Shared/CheckoutLegalOptIn';
import localeUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import mediaUtils from 'utils/Media';
import ExpandableBasketItems from 'components/RwdCheckout/Sections/SddSections/ExpandableBasketItems';
import bccUtils from 'utils/BCC';
import basketConstants from 'constants/Basket';
import { globalModals, renderModal } from 'utils/globalModals';
import SplitEDDShippingMethod from 'components/SharedComponents/SplitEDD/SplitEDDShippingMethod';
import CanadaPostStrikeCheckoutMessage from 'components/SharedComponents/CanadaPostStrike/CanadaPostStrikeCheckoutMessage';
import Empty from 'constants/empty';

const { AUTO_REPLENISH_PRODUCT_INFO } = globalModals;

const {
    MEDIA_IDS: { AUTO_REPLENISHMENT }
} = bccUtils;
const { DELIVERY_OPTIONS } = basketConstants;
const { Media } = mediaUtils;

class ShipMethodDescription extends BaseClass {
    shouldDisplayReplenish = (orderHasReplen, expanded) => {
        const { isAutoReplenishmentEnabled } = Sephora.configurationSettings;

        return isAutoReplenishmentEnabled && orderHasReplen && !expanded;
    };

    handleInfoButtonClick = () => {
        renderModal(this.props.globalModals[AUTO_REPLENISH_PRODUCT_INFO], e =>
            this.showReplenishModal(e, {
                type: 'information',
                info: 'autoReplenish'
            })
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            orderHasReplen,
            expanded,
            shippingGroup,
            shippingGroupType,
            isSplitEDDEnabled,
            isPhysicalGiftCard,
            locale,
            waiveShippingFee,
            middleZone
        } = this.props;

        const shouldDisplayReplenish = this.shouldDisplayReplenish(orderHasReplen, expanded);
        const shippingMethod = shippingGroup?.shippingMethod || Empty.Object;
        const showSplitEDD = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);
        const showCutOffDescription = !isPhysicalGiftCard;

        return (
            <div>
                {shouldDisplayReplenish && (
                    <>
                        <Box marginTop={[3, 5]}>
                            <Text
                                is='h3'
                                fontWeight='bold'
                            >
                                {locale.autoReplenish}{' '}
                                <InfoButton
                                    data-at={Sephora.debug.dataAt('auto-replenish')}
                                    size={16}
                                    marginRight={1}
                                    onClick={this.handleInfoButtonClick}
                                />
                            </Text>
                            <Text is='p'>{locale.subscriptionFreeShipping}</Text>
                            {showSplitEDD ? null : this.deliveryText()}
                        </Box>
                        <Media lessThan='sm'>
                            <CheckoutLegalOptIn />
                        </Media>
                    </>
                )}
                <CanadaPostStrikeCheckoutMessage
                    shippingGroup={shippingGroup}
                    middleZone={middleZone}
                />
                {!expanded && showSplitEDD ? (
                    <SplitEDDShippingMethod
                        shippingGroupType={shippingGroupType}
                        shippingGroup={shippingGroup}
                        showCutOffDescription={showCutOffDescription}
                        waiveShippingFee={waiveShippingFee}
                    />
                ) : (
                    this.shippingDescription()
                )}
            </div>
        );
    }

    showReplenishModal = event => {
        event?.preventDefault();
        event?.stopPropagation();

        const mediaId = AUTO_REPLENISHMENT;
        const titleDataAt = 'autoReplenishModalTitle';

        this.props.showMediaModal({
            isOpen: true,
            mediaId,
            titleDataAt
        });

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

    deliveryText = () => {
        const {
            promiseDate, promiseDateCutOffDescription, promiseDateLabel, shippingMethodDescription, isPhysicalGiftCard
        } = this.props;
        const isUS = localeUtils.isUS();
        const showCheckoutDateAndTimerFormat = !localeUtils.isFRCanada();
        const cutOffDescriptionText =
            promiseDateCutOffDescription && showCheckoutDateAndTimerFormat
                ? `If you ${promiseDateCutOffDescription.toLowerCase()}`
                : promiseDateCutOffDescription;

        return (
            <React.Fragment>
                {(promiseDate && !isPhysicalGiftCard && isUS) || (promiseDate && !isUS) ? (
                    <div>
                        {cutOffDescriptionText && !showCheckoutDateAndTimerFormat && <div>{cutOffDescriptionText}</div>}
                        <Box
                            fontWeight={showCheckoutDateAndTimerFormat && 'bold'}
                            color={showCheckoutDateAndTimerFormat && 'green'}
                        >
                            {promiseDateLabel} {dateUtils.getPromiseDate(promiseDate)}
                        </Box>
                        {cutOffDescriptionText && showCheckoutDateAndTimerFormat && <div>{cutOffDescriptionText}</div>}
                    </div>
                ) : (
                    <Box
                        fontWeight={'bold'}
                        color={'green'}
                    >
                        {shippingMethodDescription}
                    </Box>
                )}
            </React.Fragment>
        );
    };

    shippingDescription = () => {
        const {
            shippingMethodValuePrice,
            shippingFee,
            shippingMethodType,
            orderHasReplen,
            allItemsAreReplen,
            expanded,
            hasSDUInBasket,
            waiveShippingFee = false
        } = this.props;

        const getAutoReplenText = localeUtils.getLocaleResourceFile('components/DeliveryInfo/AutoReplenishment/locales', 'AutoReplenishment');

        const shipFee = checkoutUtils.setShippingFee(shippingFee);
        const isStandard = method => method.indexOf(DELIVERY_OPTIONS.STANDARD) > -1;
        const shouldDisplayItems = (orderHasReplen || hasSDUInBasket) && !expanded;
        const displayFreeShippingAutoReplenish = orderHasReplen && isStandard(shippingMethodType);
        const hasSomeAutoReplenishItems = !allItemsAreReplen && orderHasReplen;
        const hasSomeAutoReplenishItemsAndStd = hasSomeAutoReplenishItems && isStandard(shippingMethodType);
        const displayDeliveryText = !allItemsAreReplen || (allItemsAreReplen && !isStandard(shippingMethodType));

        return (
            <>
                <Box
                    data-at={Sephora.debug.dataAt('shipping_method_name')}
                    fontWeight='bold'
                    marginTop={displayFreeShippingAutoReplenish ? 5 : 4}
                >
                    {shippingMethodValuePrice ? (
                        <div>
                            <Text css={{ textDecoration: 'line-through' }}>{shippingMethodValuePrice}</Text>
                            <Text color='red'> {shipFee} </Text>- {shippingMethodType}
                        </div>
                    ) : (
                        <div data-at={Sephora.debug.dataAt('shipping_method_name_div')}>
                            {displayFreeShippingAutoReplenish || <>{`${waiveShippingFee ? 'Waive Shipping & Handling' : shipFee} - `}</>}
                            {!displayFreeShippingAutoReplenish
                                ? shippingMethodType
                                : hasSomeAutoReplenishItemsAndStd && expanded && shippingMethodType}
                            {hasSomeAutoReplenishItemsAndStd && (
                                <Text
                                    is='p'
                                    children={getAutoReplenText('freeStandardShipping')}
                                />
                            )}
                        </div>
                    )}
                </Box>
                {orderHasReplen ? displayDeliveryText && this.deliveryText() : this.deliveryText()}
                {shouldDisplayItems && (
                    <Box marginTop={2}>
                        <ExpandableBasketItems />
                    </Box>
                )}
            </>
        );
    };
}

export default wrapComponent(ShipMethodDescription, 'ShipMethodDescription');
