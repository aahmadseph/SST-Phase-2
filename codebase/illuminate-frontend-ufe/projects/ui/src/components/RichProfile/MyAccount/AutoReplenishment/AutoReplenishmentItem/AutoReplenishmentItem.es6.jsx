import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import helperUtils from 'utils/Helpers';
import { getImageAltText } from 'utils/Accessibility';
import StringUtils from 'utils/String';
import localeUtils from 'utils/LanguageLocale';
import DateUtil from 'utils/Date';
import {
    space, colors, fontSizes, lineHeights
} from 'style/config';
import {
    Grid, Box, Text, Button, Link, Icon, Divider
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';

const { capitalizeFirstLetter } = helperUtils;
const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[1];

class AutoReplenishmentItem extends BaseClass {
    render() {
        const {
            subscription,
            firstName,
            item,
            paused,
            save,
            annuallyWithSubscription,
            deliverEvery,
            itemText,
            nextShipment,
            pausedDelivery,
            resumeSubscription,
            manageSubscription,
            unsubscribe,
            isPaused,
            frequencyDelivery,
            displayItemVariation,
            promiseDate,
            savingAmount,
            listPrice,
            handleClickUnsubscribe,
            handleManageSubscription,
            handleResumeSubscription,
            stillSave,
            before,
            discountDeliveriesLeft,
            discountsValidUntilMessage,
            acceleratedDiscountReclaimPossible,
            or,
            savePercentageText,
            getItBefore,
            formattedPromoExpiryDate,
            isPromoExpirationDateLessThanOneMonth
        } = this.props;

        const { acceleratedPromotion } = item;
        const transformedPromoExpiryDate = acceleratedPromotion ? DateUtil.getDateInMMDDYYYYShortMonth(acceleratedPromotion.promoExpirationDate) : '';

        return (
            <Box
                css={styles.itemContainer}
                key={item.skuId}
            >
                <Icon
                    css={styles.icon}
                    name='autoReplenish'
                />
                <Text
                    css={styles.heading}
                    is='h2'
                >
                    {isPaused && (
                        <>
                            {paused}
                            <Text
                                is='span'
                                css={styles.subheading}
                            >
                                {`${capitalizeFirstLetter(firstName)}, ${acceleratedPromotion ? stillSave : save} `}
                                <Text
                                    is='span'
                                    css={styles.highlightRed}
                                >
                                    {`${acceleratedPromotion ? acceleratedPromotion.remainingAcceleratedDiscount : item.yearlySavings} `}
                                </Text>
                                {acceleratedPromotion ? `${before} ${transformedPromoExpiryDate}.` : annuallyWithSubscription}
                            </Text>
                        </>
                    )}
                    {!isPaused && `${deliverEvery} ${subscription.frequency} ${frequencyDelivery}`}
                </Text>
                <Divider />
                <Grid
                    gap={[`${SM_IMG_GAP}px`, 4]}
                    css={styles.gridContainer}
                >
                    <Box>
                        <ProductImage
                            id={item.skuId}
                            size={[SM_IMG_SIZE, 97]}
                            skuImages={item.skuImages}
                            disableLazyLoad={true}
                            altText={getImageAltText(item)}
                        />
                    </Box>
                    <div>
                        <Grid
                            css={styles.content}
                            minHeight={[SM_IMG_SIZE, 0]}
                        >
                            <Box css={styles.contentLeft}>
                                <Text
                                    is='p'
                                    css={styles.title}
                                    children={item.brandName}
                                    data-at={Sephora.debug.dataAt('sku_brand')}
                                />
                                <Text
                                    is='p'
                                    css={styles.subtitle}
                                    children={item.productName}
                                    data-at={Sephora.debug.dataAt('sku_name')}
                                />
                                {displayItemVariation && (
                                    <Box css={styles.detailsContainer}>
                                        <Text
                                            is='p'
                                            css={styles.detailsText}
                                            data-at={Sephora.debug.dataAt('sku_size')}
                                        >
                                            {`${item.variationType}: ${item.variationValue}`}
                                            <span css={styles.detailsSeparator}>•</span>
                                            {StringUtils.format(itemText, item.skuId)}
                                        </Text>
                                    </Box>
                                )}
                                <Text
                                    is='p'
                                    data-at={Sephora.debug.dataAt('sku_qty')}
                                >
                                    Qty: {item.qty}
                                </Text>
                                {!isPaused && (
                                    <Text
                                        css={styles.date}
                                        is='p'
                                        data-at={Sephora.debug.dataAt('sku_next_shipment')}
                                    >
                                        {`${nextShipment} ${promiseDate}`}
                                    </Text>
                                )}
                                {isPaused && (
                                    <Text
                                        css={styles.date}
                                        is='p'
                                    >
                                        {`${pausedDelivery} ${subscription.frequency} ${frequencyDelivery}`}
                                    </Text>
                                )}
                                {acceleratedPromotion &&
                                    (acceleratedDiscountReclaimPossible ? (
                                        <Text
                                            is='p'
                                            css={styles.reclaimPossible}
                                        >
                                            {`${or}, `}
                                            <Text css={styles.redBoldText}>{savePercentageText}</Text>
                                            {` ${getItBefore} `}
                                            <strong>{formattedPromoExpiryDate}</strong>
                                        </Text>
                                    ) : (
                                        <>
                                            <Text
                                                is='p'
                                                data-at={Sephora.debug.dataAt('sku_accelerated_promotion_terms')}
                                                css={styles.legalCopy}
                                            >
                                                {'*'}
                                                <strong>{acceleratedPromotion.remainingOrderCount}</strong>
                                                {` ${discountDeliveriesLeft}`}
                                            </Text>
                                            <div
                                                css={[
                                                    {
                                                        fontSize: `${fontSizes.sm}px`,
                                                        color: 'gray'
                                                    },
                                                    !localeUtils.isFrench() && {
                                                        whiteSpace: 'nowrap'
                                                    }
                                                ]}
                                            >
                                                {discountsValidUntilMessage}
                                                <Icon
                                                    size={16}
                                                    marginLeft={1}
                                                    name='infoOutline'
                                                    cursor='pointer'
                                                    onClick={this.openAutoReplenPromoModal}
                                                />
                                            </div>
                                        </>
                                    ))}
                            </Box>
                            <Box css={styles.contentRight}>
                                <div>
                                    <Text
                                        is='p'
                                        css={styles.salePrice}
                                        data-at={Sephora.debug.dataAt('sku_discounted_price')}
                                    >
                                        {savingAmount}
                                        {acceleratedPromotion && !acceleratedDiscountReclaimPossible && !isPromoExpirationDateLessThanOneMonth && '*'}
                                    </Text>
                                    <Text
                                        is='del'
                                        css={styles.listPrice}
                                        data-at={Sephora.debug.dataAt('sku_price')}
                                    >
                                        {listPrice}
                                    </Text>
                                </div>
                            </Box>
                        </Grid>
                        <Box css={styles.ctaContainer}>
                            <Button
                                size='sm'
                                variant='secondary'
                                css={styles.secondaryCta}
                                onClick={isPaused ? handleResumeSubscription : handleManageSubscription}
                            >
                                {isPaused ? resumeSubscription : manageSubscription}
                            </Button>
                            <Link
                                css={styles.blueLink}
                                onClick={handleClickUnsubscribe}
                            >
                                {unsubscribe}
                            </Link>
                        </Box>
                    </div>
                </Grid>
            </Box>
        );
    }

    openAutoReplenPromoModal = () => {
        const {
            showAutoReplenishPromoInfoModal,
            autoReplenishPromoInfoModalTitle,
            autoReplenishPromoInfoModalMsg1,
            autoReplenishPromoInfoModalMsg2,
            autoReplenishPromoInfoModalButton
        } = this.props;

        showAutoReplenishPromoInfoModal({
            title: autoReplenishPromoInfoModalTitle,
            message: (
                <Text is='p'>
                    {autoReplenishPromoInfoModalMsg1}
                    <br />
                    <br />
                    {autoReplenishPromoInfoModalMsg2}
                </Text>
            ),
            buttonText: autoReplenishPromoInfoModalButton
        });
    };
}

const styles = {
    itemContainer: {
        boxShadow: '0 0 4px rgba(0,0,0,0.15)',
        padding: `${space[1]}px ${space[4]}px`,
        marginTop: `${space[4]}px`,
        borderRadius: `${space[2]}px`
    },
    icon: {
        verticalAlign: 'middle',
        marginRight: `${space[3]}`,
        size: '2.25em'
    },
    heading: {
        display: 'inline-block',
        verticalAlign: 'middle',
        paddingTop: `${space[2]}px`,
        paddingBottom: `${space[3]}px`,
        fontSize: `${fontSizes.md}px`,
        fontWeight: 'bold',
        maxWidth: '85%',
        lineHeight: `${lineHeights.tight}em`
    },
    subheading: {
        fontWeight: 'normal',
        display: 'block',
        whiteSpace: 'nowrap'
    },
    highlightRed: {
        color: `${colors.red}`,
        fontWeight: 'bold'
    },
    gridContainer: {
        gridTemplateColumns: 'auto 1fr',
        padding: `${space[3]}px 0`,
        lineHeight: 'tight',
        alignItems: 'start'
    },
    content: {
        gap: `${space[2]}px`,
        gridTemplateColumns: '1fr auto'
    },
    contentLeft: {
        padding: `${space[2]}px`
    },
    title: {
        fontSize: `${fontSizes.base}px`,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: `${fontSizes.base}px`,
        marginBottom: `${space[1]}px`,
        lineHeight: `${space[4]}px`
    },
    detailsContainer: {
        color: `${colors.gray}`
    },
    detailsText: {
        display: 'inline-block',
        lineHeight: `${space[4]}px`
    },
    detailsSeparator: {
        margin: '0 .5em'
    },
    date: {
        marginTop: `${space[2]}px`,
        whiteSpace: 'nowrap'
    },
    contentRight: {
        textAlign: 'right'
    },
    salePrice: {
        fontWeight: 'bold',
        marginTop: `${space[2]}px`,
        color: `${colors.red}`
    },
    listPrice: {
        color: `${colors.black}`
    },
    ctaContainer: {
        marginTop: `${space[4]}px`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${space[2]}px ${space[4]}px`,
        alignItems: 'center'
    },
    secondaryCta: {
        borderWidth: '1px',
        fontWeight: 'normal'
    },
    blueLink: {
        color: `${colors.blue}`,
        fontSize: `${fontSizes.base}px`
    },
    secondaryButton: {
        fontSize: 'var(--font-weight-normal)',
        fontWeight: 'normal',
        borderWidth: '1px'
    },
    legalCopy: {
        marginTop: `${space[2]}px`,
        whiteSpace: 'nowrap',
        fontSize: `${fontSizes.sm}px`,
        color: 'gray',
        display: 'block'
    },
    reclaimPossible: {
        fontSize: `${fontSizes.xs}px`,
        marginTop: `${space[2]}px`,
        whiteSpace: 'nowrap'
    },
    redBoldText: {
        fontWeight: 'bold',
        color: `${colors.red}`,
        whiteSpace: 'nowrap'
    }
};

AutoReplenishmentItem.defaultProps = {};

AutoReplenishmentItem.propTypes = {
    item: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired,
    firstName: PropTypes.string.isRequired,
    save: PropTypes.string.isRequired,
    annuallyWithSubscription: PropTypes.string.isRequired,
    deliverEvery: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    nextShipment: PropTypes.string.isRequired,
    pausedDelivery: PropTypes.string.isRequired,
    resumeSubscription: PropTypes.string.isRequired,
    manageSubscription: PropTypes.string.isRequired,
    unsubscribe: PropTypes.string.isRequired,
    paused: PropTypes.string.isRequired,
    listPrice: PropTypes.string.isRequired,
    toggleUnsubscribeAutoReplenModal: PropTypes.func.isRequired,
    setCurrentSubscription: PropTypes.func.isRequired,
    handleManageSubscription: PropTypes.func.isRequired,
    handleResumeSubscription: PropTypes.func.isRequired,
    stillSave: PropTypes.string.isRequired,
    before: PropTypes.string.isRequired,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string
};

export default wrapComponent(AutoReplenishmentItem, 'AutoReplenishmentItem', true);
