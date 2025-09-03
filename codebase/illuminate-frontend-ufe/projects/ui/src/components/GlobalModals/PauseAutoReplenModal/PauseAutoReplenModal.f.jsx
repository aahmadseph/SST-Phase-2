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

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

const { Media } = MediaUtils;

const PauseAutoReplenModal = props => {
    const {
        item,
        title,
        mainHeader,
        isOpen,
        handleOnPauseSubscription,
        pause,
        cancel,
        imageAltText,
        itemText,
        qtyText,
        notRated,
        oneReview,
        yearlySavings,
        discountPrice,
        onModalClose,
        rememberMessageCopy,
        firstYearSavings,
        discountDeliveriesLeft,
        discountsValidUntilMessage
    } = props;
    const displayItemVariation = item?.variationType && item?.variationValue && item?.skuId;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onModalClose}
            isDrawer={true}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <Media at='xs'>
                    <button
                        css={styles.backDrop}
                        onClick={onModalClose}
                    >
                        <Chevron direction='left' />
                    </button>
                </Media>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='p'
                    css={styles.mainHeader}
                >
                    {mainHeader}
                </Text>
                {item.acceleratedPromotion && (
                    <Text
                        is='p'
                        css={styles.mainHeader}
                    >
                        {rememberMessageCopy}
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
                                            data-at={Sephora.debug.dataAt('sku_price')}
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
                <Flex css={styles.ctaContainer}>
                    <Button
                        onClick={onModalClose}
                        css={styles.secondaryBtn}
                        variant='secondary'
                    >
                        {cancel}
                    </Button>
                    <Button
                        css={styles.primaryBtn}
                        variant='primary'
                        onClick={handleOnPauseSubscription}
                    >
                        {pause}
                    </Button>
                </Flex>
            </Modal.Footer>
        </Modal>
    );
};

const styles = {
    grid: {
        marginTop: `${space[5]}px`,
        gridTemplateColumns: 'auto 1fr'
    },
    mainHeader: {
        marginBottom: `${space[5]}px`
    },
    secondaryBtn: {
        marginRight: `${space[2]}px`,
        width: '50%'
    },
    primaryBtn: {
        width: '50%'
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
    ctaContainer: {
        marginBottom: `${space[2]}px`
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

PauseAutoReplenModal.defaultProps = {};

PauseAutoReplenModal.propTypes = {
    item: PropTypes.object,
    subscription: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onModalClose: PropTypes.func.isRequired,
    handleOnPauseSubscription: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    mainHeader: PropTypes.string.isRequired,
    pause: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    qtyText: PropTypes.string.isRequired,
    notRated: PropTypes.string.isRequired,
    oneReview: PropTypes.string.isRequired,
    yearlySavings: PropTypes.string.isRequired,
    discountPrice: PropTypes.string.isRequired,
    imageAltText: PropTypes.string.isRequired,
    firstYearSavings: PropTypes.string,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string
};

export default wrapFunctionalComponent(PauseAutoReplenModal, 'PauseAutoReplenModal');
