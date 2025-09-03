import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { wrapComponent } from 'utils/framework';
import { getImageAltText } from 'utils/Accessibility';
import StarRating from 'components/StarRating/StarRating';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import OrderUtils from 'utils/Order';
import dateUtils from 'utils/Date';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import { space, fontSizes, colors } from 'style/config';
import {
    Box, Grid, Button, Text, Divider, Image, Flex
} from 'components/ui';

const { formatFrequencyType, formatSavingAmountString } = DeliveryFrequencyUtils;
const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

class ResumeSubscriptionModal extends BaseClass {
    state = {
        isHidden: true
    };

    async componentDidMount() {
        await this.props.loadShippingAndPaymentInfo();
        this.setState({ isHidden: false });
    }

    render() {
        const {
            resumeSubscription,
            qty,
            deliveryEvery,
            shippingAddress,
            paymentMethod,
            nextShipment,
            resume,
            cancel,
            editMessage,
            paymentMessage,
            itemText,
            notRated,
            oneReview,
            yearlySavings,
            fullName,
            address,
            city,
            state,
            zipcode,
            phoneNumber,
            cardTokenNumber,
            cardType,
            onModalClose,
            item,
            firstYearSavings,
            discountDeliveriesLeft,
            discountsValidUntilMessage
        } = this.props;

        const { isHidden } = this.state;

        const displayItemVariation = item?.variationType && item?.variationValue && item?.skuId;
        const frequencyType = formatFrequencyType(this.props.subscription.frequency, this.props.subscription.frequencyType);
        const logoFileName = OrderUtils.getThirdPartyCreditCard({ cardType: cardType }) || 'placeholder';
        const formattedDate = dateUtils.getPromiseDate(`${this.props.subscription.nextScheduleRunDate}T00:00`);
        const discountPrice = formatSavingAmountString({
            replenishmentAdjuster: item?.discountAmount,
            replenishmentAdjusterPrice: item?.discountedPrice,
            replenishmentAdjusterType: item?.discountType
        });

        return (
            <Modal
                width={0}
                onDismiss={onModalClose}
                isOpen={this.props.isOpen}
                isHidden={isHidden}
                isDrawer={true}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title children={resumeSubscription} />
                </Modal.Header>
                <Modal.Body>
                    {item && (
                        <Box>
                            <Text
                                is='p'
                                css={styles.boldText}
                            >
                                {resumeSubscription}
                            </Text>
                            <Text
                                css={styles.green}
                                data-at={Sephora.debug.dataAt('sku_next_shipment')}
                            >
                                {`${nextShipment} ${formattedDate}`}
                            </Text>
                            <Text
                                is='span'
                                css={styles.editMessage}
                            >
                                {editMessage}
                            </Text>
                            <Divider />
                            <Grid
                                gap={[`${SM_IMG_GAP}px`, 4]}
                                css={styles.productContainer}
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
                                        <Box>
                                            <Text
                                                is='p'
                                                css={styles.title}
                                                data-at={Sephora.debug.dataAt('sku_brand')}
                                                children={item.brandName}
                                            />
                                            <Text
                                                is='p'
                                                css={styles.subtitle}
                                                data-at={Sephora.debug.dataAt('sku_name')}
                                                children={item.productName}
                                            />
                                            {displayItemVariation && (
                                                <Text
                                                    is='p'
                                                    css={styles.detailsContainer}
                                                    data-at={Sephora.debug.dataAt('sku_size')}
                                                >
                                                    {`${item.variationType}: ${item.variationValue}`}
                                                    <span css={styles.detailsSeparator}>•</span>
                                                    {` ${itemText} ${item.skuId}`}
                                                </Text>
                                            )}
                                            <Text
                                                is='p'
                                                css={styles.productQty}
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
                            <Divider />
                            <Grid css={styles.tabContainer}>
                                <Text
                                    is='h3'
                                    css={styles.tabHeading}
                                >
                                    {`${deliveryEvery} ${this.props.subscription.frequency} ${frequencyType}`}
                                </Text>
                            </Grid>
                            <Divider />
                            <Grid css={styles.tabContainer}>
                                <Text
                                    is='h3'
                                    css={styles.tabHeading}
                                >
                                    {shippingAddress}
                                </Text>
                                <Box css={styles.address}>
                                    <Text is='p'>{fullName}</Text>
                                    <Text is='p'>
                                        {address}
                                        <Text
                                            is='span'
                                            css={styles.block}
                                        >
                                            {`${city}, ${state} ${zipcode}`}
                                        </Text>
                                        <Text
                                            is='span'
                                            css={styles.block}
                                        >
                                            {phoneNumber}
                                        </Text>
                                    </Text>
                                </Box>
                            </Grid>
                            <Divider />
                            <Grid css={styles.lastTab}>
                                <Text
                                    is='h3'
                                    css={{
                                        ...styles.tabHeading,
                                        ...styles.lastTabHeading
                                    }}
                                >
                                    {paymentMethod}
                                </Text>
                                <Box>
                                    <Image
                                        css={styles.creditCardIcon}
                                        height={32}
                                        width={50}
                                        src={`/img/ufe/payments/${logoFileName}.svg`}
                                    />
                                    <Text
                                        is='p'
                                        css={styles.inlineBlock}
                                    >
                                        {`${cardType} *${cardTokenNumber}`}
                                    </Text>
                                </Box>
                            </Grid>
                            <Text
                                is='p'
                                css={styles.message}
                            >
                                {paymentMessage}
                            </Text>
                        </Box>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Grid
                        columns={2}
                        gap={3}
                    >
                        <Button
                            onClick={onModalClose}
                            variant='secondary'
                        >
                            {cancel}
                        </Button>
                        <Button
                            onClick={this.props.handleResumeSubscription}
                            variant='primary'
                        >
                            {resume}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    boldText: {
        fontWeight: 'bold',
        lineHeight: `${fontSizes.md}px`
    },
    green: {
        color: `${colors.green}`,
        lineHeight: `${fontSizes.md}px`
    },
    block: {
        display: 'block'
    },
    editMessage: {
        display: 'block',
        paddingTop: `${space[3]}`,
        paddingBottom: `${space[4]}`,
        lineHeight: `${fontSizes.md}px`
    },
    tabContainer: {
        marginTop: `${space[3]}px`,
        paddingBottom: `${space[3]}`,
        gridTemplateColumns: 'auto 1fr',
        position: 'relative'
    },
    productDetails: {
        gap: `${space[2]}px`,
        gridTemplateColumns: 'auto 1fr'
    },
    productContainer: {
        gridTemplateColumns: 'auto 1fr',
        marginTop: `${space[4]}px`,
        marginBottom: `${space[4]}px`,
        alignItems: 'start'
    },
    tabHeading: {
        fontSize: `${fontSizes.base}px`,
        fontWeight: 'bold'
    },
    address: {
        lineHeight: `${fontSizes.md}px`
    },
    detailsSeparator: {
        margin: '0 .5em'
    },
    lastTab: {
        marginTop: `${space[3]}px`,
        gridTemplateColumns: 'auto 1fr',
        position: 'relative'
    },
    lastTabHeading: {
        paddingTop: `${space[1]}px`
    },
    creditCardIcon: {
        height: `${space[32]}px`,
        width: `${space[50]}px`,
        marginRight: `${space[3]}px`,
        verticalAlign: 'middle'
    },
    inlineBlock: {
        display: 'inline-block'
    },
    title: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${fontSizes.sm}px`,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${space[4]}px`
    },
    detailsContainer: {
        fontSize: `${fontSizes.sm}px`,
        color: `${colors.gray}`
    },
    productQty: {
        fontSize: `${fontSizes.sm}px`,
        marginTop: `${space[1]}px`,
        lineHeight: `${fontSizes.xs}px`
    },
    message: {
        display: 'block',
        paddingTop: `${space[3]}`,
        fontSize: `${fontSizes.sm}px`,
        color: `${colors.gray}`
    },
    starContainer: {
        marginTop: `${space[2]}px`
    },
    starRatings: {
        marginLeft: '.5em',
        lineHeight: `${fontSizes.sm}px`,
        fontSize: `${fontSizes.sm}px`
    },
    discountText: {
        fontWeight: 'bold',
        marginTop: `${space[1]}px`,
        fontSize: `${fontSizes.sm}px`,
        color: `${colors.red}`
    },
    productPrice: {
        fontWeight: 'normal',
        color: `${colors.black}`
    },
    yearlySavings: {
        fontSize: `${fontSizes.sm}px`
    },
    acceleratedPromotionCopy: {
        color: `${colors.gray}`,
        marginTop: `${space[2]}px`,
        fontSize: `${fontSizes.sm}px`
    }
};

ResumeSubscriptionModal.defaultProps = {};

ResumeSubscriptionModal.propTypes = {
    resumeSubscription: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
    phoneNumber: PropTypes.string,
    cardTokenNumber: PropTypes.string,
    cardType: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    loadShippingAndPaymentInfo: PropTypes.func.isRequired,
    handleResumeSubscription: PropTypes.func.isRequired,
    onModalClose: PropTypes.func.isRequired,
    firstYearSavings: PropTypes.string,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string
};

export default wrapComponent(ResumeSubscriptionModal, 'ResumeSubscriptionModal', true);
