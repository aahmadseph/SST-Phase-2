import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import {
    space, colors, fontSizes, modal, mediaQueries
} from 'style/config';
import MediaUtils from 'utils/Media';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Chevron from 'components/Chevron';
import StarRating from 'components/StarRating/StarRating';
import {
    Flex, Text, Box, Grid, Divider, Button
} from 'components/ui';

const { Media } = MediaUtils;

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

const SkipAutoReplenModal = props => {
    const {
        item,
        title,
        mainHeader,
        isOpen,
        onDismiss,
        handleOnSkipSubscription,
        skip,
        cancel,
        imageAltText,
        itemText,
        qtyText,
        notRated,
        oneReview,
        yearlySavings,
        nextShipmentBy,
        discountPrice,
        skipDeliveryDate,
        nextDeliveryDate,
        skipWarningMessage,
        firstYearSavings,
        discountDeliveriesLeft,
        discountsValidUntilMessage,
        rateOf,
        percentageOffMessage
    } = props;
    const displayItemVariation = item?.variationType && item?.variationValue && item?.skuId;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isDrawer={true}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <Media at='xs'>
                    <button
                        css={styles.backDrop}
                        onClick={onDismiss}
                    >
                        <Chevron direction='left' />
                    </button>
                </Media>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='p'
                    css={styles.boldText}
                >
                    {`${skip} ${skipDeliveryDate}`}
                </Text>
                <Text
                    is='p'
                    css={styles.green}
                    data-at={Sephora.debug.dataAt('sku_next_shipment')}
                >
                    {`${nextShipmentBy} ${nextDeliveryDate}`}
                </Text>
                <Text
                    is='p'
                    css={styles.mainHeader}
                >
                    {mainHeader}{' '}
                    {
                        <Text
                            is='span'
                            css={styles.green}
                            data-at={Sephora.debug.dataAt('sku_next_shipment')}
                        >
                            {nextDeliveryDate}
                        </Text>
                    }
                    {item.acceleratedPromotion && item.acceleratedPromotion.skippingLeadsToLossOfDiscount && (
                        <>
                            <Text is='span'>
                                {`, ${rateOf} `}
                                <strong>{percentageOffMessage}</strong>
                            </Text>
                        </>
                    )}
                    {'.'}
                </Text>
                {item.acceleratedPromotion && (
                    <Text
                        is='p'
                        css={styles.skipWarningText}
                    >
                        {skipWarningMessage}
                    </Text>
                )}
                <Divider />
                {item && (
                    <>
                        <Grid
                            gap={[`${SM_IMG_GAP}px`, 4]}
                            css={styles.grid}
                            lineHeight='tight'
                            alignItems='start'
                        >
                            <Box>
                                <ProductImage
                                    id={item.skuId}
                                    size={[SM_IMG_SIZE, 97]}
                                    skuImages={item.skuImages}
                                    disableLazyLoad={true}
                                    altText={imageAltText}
                                />
                            </Box>
                            <div>
                                <Grid
                                    css={styles.container}
                                    minHeight={[SM_IMG_SIZE, 0]}
                                >
                                    <Box css={styles.productContainer}>
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
                                                {` ${itemText} ${item.skuId}`}
                                            </Text>
                                        )}
                                        <Text
                                            is='p'
                                            css={styles.qtyText}
                                            data-at={Sephora.debug.dataAt('sku_qty')}
                                        >
                                            {`${qtyText} : ${item.qty}`}
                                        </Text>
                                        {item.starRatings && (
                                            <Flex css={styles.starContainer}>
                                                <StarRating rating={item.starRatings} />
                                                <span css={styles.starRatings}>
                                                    {(() => {
                                                        switch (item.reviewsCount) {
                                                            case undefined:
                                                            case 0:
                                                                return notRated;
                                                            case 1:
                                                                return oneReview;
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
                                            <span data-at={Sephora.debug.dataAt('sku_discounted_price')}>{`${discountPrice} `}</span>
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
                                            {`${item.yearlySavings} ${item.acceleratedPromotion ? firstYearSavings : yearlySavings}`}
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
                <Grid
                    columns={2}
                    gap={3}
                >
                    <Button
                        onClick={onDismiss}
                        variant='secondary'
                    >
                        {cancel}
                    </Button>
                    <Button
                        onClick={handleOnSkipSubscription}
                        variant='primary'
                    >
                        {skip}
                    </Button>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
};

const styles = {
    green: {
        color: `${colors.green}`,
        lineHeight: `${fontSizes.md}px`
    },
    boldText: {
        fontWeight: 'bold'
    },
    grid: {
        marginTop: `${space[4]}px`,
        gridTemplateColumns: 'auto 1fr'
    },
    mainHeader: {
        marginBottom: `${space[4]}px`,
        marginTop: `${space[2]}px`
    },
    skipWarningText: {
        marginBottom: `${space[4]}px`
    },
    qtyText: {
        marginTop: `${space[1]}px`
    },
    starContainer: {
        marginTop: `${space[1]}px`
    },
    yearlySavings: {
        marginTop: `${space[1]}px`
    },
    starRatings: {
        marginLeft: '.5em'
    },
    container: {
        gridTemplateColumns: '1fr auto',
        gap: `${space[2]}px`
    },
    productContainer: {
        fontSize: `${fontSizes.sm}px`
    },
    productName: {
        fontSize: `${fontSizes.sm}px`,
        marginBottom: `${space[1]}px`
    },
    productPrice: {
        fontWeight: 'normal',
        color: `${colors.black}`
    },
    discountText: {
        fontWeight: 'bold',
        marginTop: `${space[1]}px`,
        color: `${colors.red}`
    },
    detailsContainer: {
        color: `${colors.gray}`
    },
    detailsSeparator: {
        margin: '0 .5em'
    },
    backDrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        lineHeight: 0,
        height: modal.headerHeight,
        paddingLeft: modal.paddingX[0],
        paddingRight: modal.paddingX[0],
        [mediaQueries.sm]: {
            paddingLeft: modal.paddingX[1],
            paddingRight: modal.paddingX[1]
        }
    },
    acceleratedPromotionCopy: {
        color: `${colors.gray}`,
        marginTop: `${space[2]}px`
    }
};

SkipAutoReplenModal.defaultProps = {};

SkipAutoReplenModal.propTypes = {
    item: PropTypes.object,
    subscription: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    handleOnSkipSubscription: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    mainHeader: PropTypes.string.isRequired,
    skip: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    qtyText: PropTypes.string.isRequired,
    notRated: PropTypes.string.isRequired,
    oneReview: PropTypes.string.isRequired,
    yearlySavings: PropTypes.string.isRequired,
    skipDeliveryDate: PropTypes.string.isRequired,
    nextShipmentBy: PropTypes.string.isRequired,
    imageAltText: PropTypes.string.isRequired,
    discountPrice: PropTypes.string.isRequired,
    skipWarningMessage: PropTypes.string,
    firstYearSavings: PropTypes.string,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string,
    rateOf: PropTypes.string,
    percentageOffMessage: PropTypes.string
};

export default wrapFunctionalComponent(SkipAutoReplenModal, 'SkipAutoReplenModal');
