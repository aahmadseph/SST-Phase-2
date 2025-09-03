import basketConstants from 'constants/Basket';
import BasketItemsSection from 'components/Checkout/Sections/SddSections/BasketItemsSection';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import StringUtils from 'utils/String';

const { formatPriceZeroToFree, formatPriceZeroToFreeStandard } = StringUtils;

const StandardSection = ({
    deliveryInfo,
    isDisabled,
    isError,
    promiseDateInfo,
    subTitle,
    title,
    isBasketSddAndReplen,
    autoReplenTitle,
    isMobile,
    showReplenishModal,
    hasSDUInBasket,
    isSDDAndGiftCardOnly,
    shippingGroup,
    showSplitEDD,
    middleZone
}) => (
    <BasketItemsSection
        basketType={basketConstants.BasketType.Standard}
        deliveryInfo={deliveryInfo}
        isDisabled={isDisabled}
        isError={isError}
        promiseDateInfo={promiseDateInfo}
        subTitle={isBasketSddAndReplen ? formatPriceZeroToFreeStandard(subTitle) : formatPriceZeroToFree(subTitle)}
        title={isBasketSddAndReplen || hasSDUInBasket ? autoReplenTitle : title}
        isBasketSddAndReplen={isBasketSddAndReplen}
        hasSDUInBasket={hasSDUInBasket}
        isMobile={isMobile}
        showReplenishModal={showReplenishModal}
        isSDDAndGiftCardOnly={isSDDAndGiftCardOnly}
        deliveryByHighlighted={Sephora.isDesktop()}
        shippingGroup={shippingGroup}
        showSplitEDD={showSplitEDD}
        middleZone={middleZone}
    ></BasketItemsSection>
);

StandardSection.defaultProps = { deliveryInfo: '' };
StandardSection.propTypes = {
    deliveryInfo: PropTypes.string,
    isDisabled: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    promiseDateInfo: PropTypes.object.isRequired,
    subTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    autoReplenTitle: PropTypes.string.isRequired,
    showReplenishModal: PropTypes.func.isRequired,
    showDeliveryTimeCheckoutHighlighted: PropTypes.bool
};

export default wrapFunctionalComponent(StandardSection, 'StandardSection');
