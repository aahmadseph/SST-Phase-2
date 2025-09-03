import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import PropTypes from 'prop-types';
import dateUtils from 'utils/Date';
import { getImageAltText } from 'utils/Accessibility';
import HelperUtils from 'utils/Helpers';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import {
    space, colors, fontSizes, lineHeights
} from 'style/config';
import StringUtils from 'utils/String';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import StarRating from 'components/StarRating/StarRating';
import UnsubscribeAutoReplenCTA from 'components/GlobalModals/UnsubscribeAutoReplenCTA';
import {
    Flex, Text, Box, Grid, Divider, Button
} from 'components/ui';

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

const { capitalizeFirstLetter } = HelperUtils;
const { formatSavingAmountString } = DeliveryFrequencyUtils;

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/locales', 'ProductQuickLookModal');

const getTextUnsubscribeModal = localeUtils.getLocaleResourceFile(
    'components/GlobalModals/UnsubscribeAutoReplenModal/locales',
    'UnsubscribeAutoReplenModal'
);

const UnsubscribeAutoReplenModal = props => {
    const {
        subscription,
        user,
        isOpen,
        isSkipAvailable,
        onDismiss,
        onUnsubscribe,
        onSkipNextDelivery,
        firstYearSavings,
        discountDeliveriesLeft,
        discountsValidUntilMessage,
        cancellingWillForfeit,
        remainingOrder,
        limitedTime,
        offMessage,
        futureSubscriptionsMessage
    } = props;
    const item = subscription?.items[0];
    const displayItemVariation = item?.variationType && item?.variationValue && item?.skuId;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isDrawer={true}
            isHidden={false}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{getTextUnsubscribeModal('title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='span'
                    css={styles.mainHeader}
                >
                    {getTextUnsubscribeModal('unsubscribeSubHeader')}
                </Text>
                <Box css={styles.container}>
                    <Text
                        css={styles.fontBase}
                        is='p'
                    >
                        {user?.firstName ? (
                            <Text
                                is='span'
                                children={`${capitalizeFirstLetter(user.firstName)}, ${getTextUnsubscribeModal('youHaveSaved')} `}
                            />
                        ) : (
                            <Text
                                is='span'
                                children={`${capitalizeFirstLetter(getTextUnsubscribeModal('youHaveSaved'))} `}
                            />
                        )}
                        <Text is='span'>
                            <strong>{`${subscription.aggregateDiscount} `}</strong>
                        </Text>
                        <Text is='span'>{`${getTextUnsubscribeModal('since')} `}</Text>
                        <Text is='span'>{`${dateUtils.getDateInMMDDYYFormat(subscription.createdDate)}. `}</Text>
                        <Text is='span'>{`${getTextUnsubscribeModal('youWillSave')} `}</Text>
                        <Text is='span'>
                            <strong>{`${item.yearlySavings} `}</strong>
                        </Text>
                        <Text is='span'>{getTextUnsubscribeModal('nextYear')}</Text>
                    </Text>
                </Box>
                {item.acceleratedPromotion && (
                    <Text>
                        {`${cancellingWillForfeit} `}
                        <strong>{remainingOrder}</strong>
                        {` ${limitedTime} `}
                        <strong>{offMessage}</strong>
                        {futureSubscriptionsMessage}
                    </Text>
                )}
                {isSkipAvailable && (
                    <Flex css={styles.secondaryCTAWrap}>
                        <Button
                            onClick={onSkipNextDelivery}
                            size='xs'
                            variant='secondary'
                        >
                            {getTextUnsubscribeModal('skipNextDelivery')}
                        </Button>
                    </Flex>
                )}
                <Divider />
                {item && (
                    <>
                        <Grid
                            css={styles.mainGrid}
                            gap={[`${SM_IMG_GAP}px`, 4]}
                            lineHeight='tight'
                            alignItems='start'
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
                                    css={styles.productDetails}
                                    minHeight={[SM_IMG_SIZE, 0]}
                                >
                                    <Box fontSize='sm'>
                                        <Text
                                            is='p'
                                            css={styles.productName}
                                        >
                                            <strong data-at={Sephora.debug.dataAt('sku_brand')}>{item.brandName}</strong>
                                            <br />
                                            <span data-at={Sephora.debug.dataAt('sku_name')}>{item.productName}</span>
                                        </Text>
                                        {displayItemVariation && (
                                            <Text
                                                is='p'
                                                css={styles.detailsContainer}
                                                data-at={Sephora.debug.dataAt('sku_size')}
                                            >
                                                {`${item.variationType}: ${item.variationValue} `}
                                                <span css={styles.detailsSeparator}>•</span>
                                                {` ${StringUtils.format(getTextUnsubscribeModal('item', ['{0}']), item.skuId)}`}
                                            </Text>
                                        )}
                                        <Text
                                            is='p'
                                            css={styles.qtyText}
                                            data-at={Sephora.debug.dataAt('sku_qty')}
                                        >
                                            {`${getTextUnsubscribeModal('qty')} : ${item.qty}`}
                                        </Text>
                                        {item.starRatings && (
                                            <Flex css={styles.starContainer}>
                                                <StarRating rating={item.starRatings} />
                                                <span css={styles.starRatings}>
                                                    {(() => {
                                                        switch (item.reviewsCount) {
                                                            case undefined:
                                                            case 0:
                                                                return getText('notRated');
                                                            case 1:
                                                                return getText('oneReview');
                                                            default:
                                                                return item.reviewsCount;
                                                        }
                                                    })()}
                                                </span>
                                            </Flex>
                                        )}
                                        <Text
                                            is='p'
                                            css={styles.discountText}
                                        >
                                            <span data-at={Sephora.debug.dataAt('sku_discounted_price')}>
                                                {`${formatSavingAmountString({
                                                    replenishmentAdjuster: item.discountAmount,
                                                    replenishmentAdjusterPrice: item.discountedPrice,
                                                    replenishmentAdjusterType: item.discountType
                                                })}${item.acceleratedPromotion ? '*' : ''} `}
                                            </span>
                                            <Text
                                                is='del'
                                                css={styles.productPrice}
                                                data-at={Sephora.debug.dataAt('sku_price')}
                                            >
                                                {item.price}
                                            </Text>
                                        </Text>
                                        <Text
                                            is='p'
                                            css={styles.yearlySavings}
                                        >
                                            {`${item.yearlySavings} ${
                                                item.acceleratedPromotion ? firstYearSavings : getTextUnsubscribeModal('yearlySavings')
                                            }`}
                                        </Text>
                                        {item.acceleratedPromotion && (
                                            <>
                                                <Text
                                                    is='p'
                                                    css={styles.acceleratedPromotionCopy}
                                                >
                                                    {'*'}
                                                    <strong>{item.acceleratedPromotion.remainingOrderCount}</strong>
                                                    {` ${discountDeliveriesLeft}`}
                                                </Text>
                                                <Text
                                                    is='p'
                                                    css={styles.detailsContainer}
                                                >
                                                    {discountsValidUntilMessage}
                                                </Text>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            </div>
                        </Grid>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer hasBorder={true}>
                <UnsubscribeAutoReplenCTA
                    onDismiss={onDismiss}
                    onUnsubscribe={() => onUnsubscribe(subscription.subscriptionId)}
                />
            </Modal.Footer>
        </Modal>
    );
};

const styles = {
    detailsContainer: {
        color: `${colors.gray}`
    },
    mainHeader: {
        marginBottom: `${space[5]}px`,
        fontWeight: 'bold'
    },
    container: {
        backgroundColor: `${colors.nearWhite}`,
        marginTop: `${space[3]}px`,
        marginBottom: `${space[3]}px`,
        padding: `${space[4]}px ${space[3]}px`
    },
    fontBase: {
        fontSize: `${fontSizes.base}`,
        lineHeight: lineHeights.tight
    },
    mainGrid: {
        marginTop: `${space[5]}px`,
        gridTemplateColumns: 'auto 1fr'
    },
    productDetails: {
        gridTemplateColumns: '1fr auto',
        gap: `${space[2]}px`
    },
    productName: {
        fontSize: `${fontSizes.sm}px`,
        marginBottom: `${space[1]}px`
    },
    qtyText: {
        marginTop: `${space[1]}px`
    },
    starContainer: {
        marginTop: `${space[1]}px`
    },
    starRatings: {
        marginLeft: '.5em'
    },
    discountText: {
        fontWeight: 'bold',
        marginTop: `${space[1]}px`,
        color: `${colors.red}`
    },
    productPrice: {
        fontWeight: 'normal',
        color: `${colors.black}`
    },
    yearlySavings: {
        marginTop: `${space[1]}px`
    },
    secondaryCTAWrap: {
        marginTop: `${space[4]}px`,
        marginBottom: `${space[4]}px`,
        justifyContent: 'left'
    },
    acceleratedPromotionCopy: {
        color: `${colors.gray}`,
        marginTop: `${space[2]}px`,
        fontSize: `${fontSizes.sm}px`
    }
};

UnsubscribeAutoReplenModal.defaultProps = {};

UnsubscribeAutoReplenModal.propTypes = {
    subscription: PropTypes.object.isRequired,
    user: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onUnsubscribe: PropTypes.func.isRequired,
    onSkipNextDelivery: PropTypes.func.isRequired,
    isSkipAvailable: PropTypes.bool.isRequired,
    firstYearSavings: PropTypes.string,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string,
    cancellingWillForfeit: PropTypes.string,
    remainingOrder: PropTypes.string,
    limitedTime: PropTypes.string,
    offMessage: PropTypes.string,
    futureSubscriptionsMessage: PropTypes.string
};

export default wrapFunctionalComponent(UnsubscribeAutoReplenModal, 'UnsubscribeAutoReplenModal');
