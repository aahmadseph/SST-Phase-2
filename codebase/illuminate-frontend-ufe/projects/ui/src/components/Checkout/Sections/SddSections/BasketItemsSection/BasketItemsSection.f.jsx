import basketConstants from 'constants/Basket';
import { Box, Text } from 'components/ui';
import {
    fontSizes, fontWeights, lineHeights, space, colors
} from 'style/config';
import BaseSection from 'components/Checkout/Sections/SddSections/BaseSection';
import ExpandableBasketItems from 'components/Checkout/Sections/SddSections/ExpandableBasketItems';
import SplitEDDShippingMethod from 'components/SharedComponents/SplitEDD/SplitEDDShippingMethod';
import CanadaPostStrikeCheckoutMessage from 'components/SharedComponents/CanadaPostStrike/CanadaPostStrikeCheckoutMessage';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import CheckoutLegalOptIn from 'components/Checkout/Shared/CheckoutLegalOptIn';
import InfoButton from 'components/InfoButton/InfoButton';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import { globalModals, renderModal } from 'utils/globalModals';

const { AUTO_REPLENISH_PRODUCT_INFO } = globalModals;
const getAutoReplenText = localeUtils.getLocaleResourceFile('components/DeliveryInfo/AutoReplenishment/locales', 'AutoReplenishment');

const buildPromiseDateCutOffDescription = promiseDateCutOffDescription => {
    return promiseDateCutOffDescription.includes('Order within')
        ? `If you ${promiseDateCutOffDescription.toLowerCase()}`
        : promiseDateCutOffDescription;
};

const DeliveryPromiseDate = ({ promiseDateLabel, promiseDate }) => (
    <Box css={styles.deliveryInfo}>
        {promiseDateLabel} {dateUtils.getPromiseDate(promiseDate)}
    </Box>
);

const DeliveryTimeline = ({
    promiseDateCutOffDescription, promiseDate, promiseDateLabel, deliveryInfo, deliveryByHighlighted
}) => (
    <>
        {promiseDate && deliveryByHighlighted && (
            <Text
                is='p'
                fontWeight='bold'
                color='green'
            >
                <DeliveryPromiseDate
                    promiseDate={promiseDate}
                    promiseDateLabel={promiseDateLabel}
                />
            </Text>
        )}
        {promiseDateCutOffDescription && (
            <Box css={styles.promiseDateCutOffDescription}>
                {!deliveryByHighlighted ? promiseDateCutOffDescription : buildPromiseDateCutOffDescription(promiseDateCutOffDescription)}
            </Box>
        )}
        {/* GUAR-3139 - promiseDate is more accurate but not always returned */}
        {!promiseDate && deliveryInfo && <Box css={styles.deliveryInfo}>{deliveryInfo}</Box>}
        {promiseDate && !deliveryByHighlighted && (
            <DeliveryPromiseDate
                promiseDate={promiseDate}
                promiseDateLabel={promiseDateLabel}
            />
        )}
    </>
);

const renderReplenishModal = (showReplenishModal, globalModalsData) => {
    renderModal(globalModalsData[AUTO_REPLENISH_PRODUCT_INFO], () => {
        showReplenishModal();
    });
};

const BasketItemsSection = ({
    basketType,
    children,
    deliveryInfo,
    isDisabled,
    isError,
    promiseDateInfo,
    subTitle,
    title,
    error,
    isBasketSddAndReplen,
    isMobile,
    showReplenishModal,
    hasSDUInBasket,
    isSDDAndGiftCardOnly,
    deliveryByHighlighted,
    globalModals: globalModalsData,
    shippingGroup,
    showSplitEDD,
    middleZone
}) => (
    <BaseSection
        isDisabled={isDisabled}
        isError={isError}
        title={title}
    >
        {error && <Box css={styles.error}>{error}</Box>}
        {isBasketSddAndReplen && (
            <Box marginTop={5}>
                <Text
                    is='h3'
                    fontWeight='bold'
                >
                    {getAutoReplenText('autoReplenish')}{' '}
                    <InfoButton
                        data-at={Sephora.debug.dataAt('auto_replenish_info_icon')}
                        size={16}
                        marginRight={1}
                        onClick={() => renderReplenishModal(showReplenishModal, globalModalsData)}
                    />
                </Text>
                <Text is='p'>
                    {getAutoReplenText('subscriptionFreeShipping')}
                    {showSplitEDD ? null : (
                        <DeliveryTimeline
                            deliveryInfo={deliveryInfo}
                            deliveryByHighlighted={deliveryByHighlighted}
                            {...promiseDateInfo}
                        />
                    )}
                </Text>
                {isMobile && <CheckoutLegalOptIn />}
            </Box>
        )}
        <CanadaPostStrikeCheckoutMessage
            shippingGroup={shippingGroup}
            middleZone={middleZone}
        />
        {showSplitEDD ? (
            <SplitEDDShippingMethod shippingGroup={shippingGroup} />
        ) : (
            <DeliveryInformation
                subTitle={subTitle}
                isBasketSddAndReplen={isBasketSddAndReplen}
                deliveryInfo={deliveryInfo}
                deliveryByHighlighted={deliveryByHighlighted}
                promiseDateInfo={promiseDateInfo}
                children={children}
                basketType={basketType}
                hasSDUInBasket={hasSDUInBasket}
                isSDDAndGiftCardOnly={isSDDAndGiftCardOnly}
                title={title}
            />
        )}
    </BaseSection>
);

function DeliveryInformation({
    subTitle,
    isBasketSddAndReplen,
    deliveryInfo,
    deliveryByHighlighted,
    promiseDateInfo,
    children,
    basketType,
    hasSDUInBasket,
    isSDDAndGiftCardOnly,
    title
}) {
    return (
        <>
            {subTitle && <Box css={styles.subTitle}>{subTitle}</Box>}
            {isBasketSddAndReplen && <Box css={styles.autpReplenishInfo}>{getAutoReplenText('freeStandardShipping')}</Box>}
            <DeliveryTimeline
                deliveryInfo={deliveryInfo}
                deliveryByHighlighted={deliveryByHighlighted}
                {...promiseDateInfo}
            />
            {children}
            <ExpandableBasketItems
                basketType={basketType}
                customCSS={
                    (isBasketSddAndReplen ||
                        hasSDUInBasket ||
                        isSDDAndGiftCardOnly ||
                        title === basketConstants.DELIVERY_OPTIONS.STANDARD ||
                        deliveryByHighlighted) && {
                        marginTop: space[!deliveryByHighlighted ? 4 : 3]
                    }
                }
            />
        </>
    );
}

const styles = {
    error: {
        color: colors.red,
        lineHeight: lineHeights.tight,
        marginTop: space[4]
    },
    subTitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        marginBottom: space[1],
        marginTop: space[4]
    },
    promiseDateCutOffDescription: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight
    },
    deliveryInfo: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight
    },
    autpReplenishInfo: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        marginBottom: space[2]
    }
};

BasketItemsSection.defaultProps = {
    basketType: basketConstants.BasketType.Standard,
    deliveryInfo: '',
    error: null,
    deliveryByHighlighted: false
};
BasketItemsSection.propTypes = {
    basketType: PropTypes.oneOf([basketConstants.BasketType.SameDay, basketConstants.BasketType.Standard]),
    children: PropTypes.any.isRequired,
    deliveryInfo: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    isDisabled: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    promiseDateInfo: PropTypes.object.isRequired,
    subTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    showReplenishModal: PropTypes.func,
    isSDUOrderOnly: PropTypes.bool,
    deliveryByHighlighted: PropTypes.bool
};

export default wrapFunctionalComponent(BasketItemsSection, 'BasketItemsSection');
