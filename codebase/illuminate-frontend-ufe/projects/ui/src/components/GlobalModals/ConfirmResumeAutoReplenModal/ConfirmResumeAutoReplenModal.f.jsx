import Chevron from 'components/Chevron';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import StarRating from 'components/StarRating/StarRating';
import {
    Box, Button, Divider, Flex, Grid, Text
} from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import {
    colors, fontSizes, mediaQueries, modal, space
} from 'style/config';
import { getImageAltText } from 'utils/Accessibility';
import dateUtils from 'utils/Date';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import MediaUtils from 'utils/Media';
import { wrapFunctionalComponent } from 'utils/framework';

const { formatSavingAmountString } = DeliveryFrequencyUtils;
const { Media } = MediaUtils;

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

const ConfirmResumeAutoReplenModal = props => {
    const {
        title,
        mainHeader,
        subHeader,
        isOpen,
        onDismiss,
        item,
        subscription,
        itemText,
        qty,
        notRated,
        oneReview,
        yearlySavings,
        done,
        firstYearSavings,
        discountDeliveriesLeft,
        discountsValidUntilMessage
    } = props;

    const displayItemVariation = item?.variationType && item?.variationValue && item?.skuId;
    const formattedDate = dateUtils.getPromiseDate(`${subscription.nextScheduleRunDate}T00:00`);
    const discountPrice = formatSavingAmountString({
        replenishmentAdjuster: item?.discountAmount,
        replenishmentAdjusterPrice: item?.discountedPrice,
        replenishmentAdjusterType: item?.discountType
    });

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
                {item && (
                    <Box>
                        <Text
                            is='p'
                            css={styles.boldText}
                        >
                            {mainHeader}
                        </Text>
                        <Text css={styles.subHeaderMessage}>
                            {subHeader}
                            <Text
                                is='span'
                                css={styles.green}
                                data-at={Sephora.debug.dataAt('sku_next_shipment')}
                            >
                                {formattedDate}.
                            </Text>
                        </Text>
                        <Divider />
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
                                    altText={getImageAltText(item)}
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
                                            {`${qty} : ${item.qty}`}
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
                                            <span data-at={Sephora.debug.dataAt('sku_discounted_price')}>{`${discountPrice}${
                                                item.acceleratedPromotion ? '*' : ''
                                            } `}</span>
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
                    </Box>
                )}
            </Modal.Body>
            <Modal.Footer hasBorder={true}>
                <Flex>
                    <Button
                        css={styles.primaryBtn}
                        variant='primary'
                        onClick={onDismiss}
                    >
                        {done}
                    </Button>
                </Flex>
            </Modal.Footer>
        </Modal>
    );
};

const styles = {
    boldText: {
        fontWeight: 'bold'
    },
    subHeaderMessage: {
        display: 'block',
        paddingTop: `${space[2]}`,
        paddingBottom: `${space[4]}`,
        lineHeight: `${fontSizes.md}px`
    },
    green: {
        color: `${colors.green}`
    },
    grid: {
        marginTop: `${space[4]}px`,
        marginBottom: -space[4],
        gridTemplateColumns: 'auto 1fr'
    },
    mainHeader: {
        marginBottom: `${space[5]}px`
    },
    primaryBtn: {
        width: '100%'
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
        marginTop: `${space[2]}px`,
        fontSize: `${fontSizes.sm}px`
    }
};

ConfirmResumeAutoReplenModal.defaultProps = {};

ConfirmResumeAutoReplenModal.propTypes = {
    item: PropTypes.object,
    subscription: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    mainHeader: PropTypes.string.isRequired,
    subHeader: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    qty: PropTypes.string.isRequired,
    notRated: PropTypes.string.isRequired,
    oneReview: PropTypes.string.isRequired,
    yearlySavings: PropTypes.string.isRequired,
    done: PropTypes.string.isRequired,
    firstYearSavings: PropTypes.string,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string
};

export default wrapFunctionalComponent(ConfirmResumeAutoReplenModal, 'ConfirmResumeAutoReplenModal');
