/* eslint-disable complexity */

/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import { getImageAltText } from 'utils/Accessibility';
import NumberUtils from 'utils/Number';
import HelpersUtils from 'utils/Helpers';
import basketUtils from 'utils/Basket';
import frequencyApi from 'services/api/productFrequency';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import { space } from 'style/config';
import { Flex } from 'components/ui';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import StarRating from 'components/StarRating/StarRating';
import DeliveryFrequencyCTA from 'components/GlobalModals/DeliveryFrequencyModal/DeliveryFrequencyCTA';
import FrequencySelector from 'components/GlobalModals/DeliveryFrequencyModal/FrequencySelector';
import StringUtils from 'utils/String';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import {
    Text, Box, Grid, Divider
} from 'components/ui';

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

const getText = text =>
    localeUtils.getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/locales', 'ProductQuickLookModal')(text);

const getTextFreq = (text, vars) =>
    localeUtils.getLocaleResourceFile('components/GlobalModals/DeliveryFrequencyModal/locales', 'DeliveryFrequencyModal')(text, vars);

const { formatSavingAmountString, formatFrequencyType, sortAnnualSavingsInfo, formatCurrency } = DeliveryFrequencyUtils;
const { capitalizeFirstLetter, formatSiteCatalystPrice } = HelpersUtils;
const { formatReviewCount } = NumberUtils;

class DeliveryFrequencyModal extends BaseClass {
    state = {
        isHidden: true,
        annualSavingsInfo: '',
        frequencyTypes: '',
        frequencyValues: '',
        currentProduct: {},
        replenishmentFreqNum: '',
        replenishmentFreqType: '',
        isMostCommon: false,
        quantity: 1,
        acceleratedPromotion: {}
    };

    constructor(props) {
        super(props);
    }

    isMostCommon = () => {
        return this.state.defaultFreqNum === this.state.replenishmentFreqNum && this.state.defaultFreqType === this.state.replenishmentFreqType;
    };

    handleFrequency = frequency => {
        const { freqNum, freqType } = frequency;

        this.setState({
            replenishmentFreqNum: freqNum,
            replenishmentFreqType: freqType
        });
    };

    quantities = skuUtils.purchasableQuantities(this.props.currentSku);

    componentDidMount() {
        const {
            currentProduct, replenishmentFreqNum, replenishmentFreqType, isBasket = false, quantity = 1
        } = this.props;
        const skuId = isBasket ? currentProduct?.sku?.skuId : currentProduct?.currentSku?.skuId;
        const annualSavingInfo = !isBasket ? currentProduct?.currentSku?.annualSavingsInfo : null;
        frequencyApi
            .getProductFrequency(skuId)
            .then(data => {
                this.setState(
                    {
                        defaultFreqNum: data.defaultFreqNum,
                        defaultFreqType: data.defaultFreqType,
                        frequencyTypes: data.replenishmentFrequencyTypes,
                        frequencyValues: data.replenishmentFrequencyValues,
                        annualSavingsInfo: sortAnnualSavingsInfo(annualSavingInfo || data.annualSavingsInfo),
                        isHidden: false
                    },
                    () => {
                        this.setState({
                            isMostCommon: this.isMostCommon()
                        });
                    }
                );
            })
            // eslint-disable-next-line no-console
            .catch(err => console.log(err));
        this.setState(
            {
                currentProduct,
                replenishmentFreqNum,
                replenishmentFreqType,
                quantity: quantity,
                acceleratedPromotion: currentProduct?.currentSku?.acceleratedPromotion || currentProduct?.sku?.acceleratedPromotion
            },
            () => {
                this.setState({
                    isMostCommon: this.isMostCommon()
                });
            }
        );
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevState.isMostCommon !== this.state.isMostCommon ||
            prevState.replenishmentFreqNum !== this.state.replenishmentFreqNum ||
            prevState.replenishmentFreqType !== this.state.replenishmentFreqType
        ) {
            this.setState({
                isMostCommon: this.isMostCommon(),
                replenishmentFreqNum: this.state.replenishmentFreqNum,
                replenishmentFreqType: this.state.replenishmentFreqType
            });
        }

        if (
            prevProps.replenishmentFreqNum !== this.props.replenishmentFreqNum ||
            prevProps.replenishmentFreqType !== this.props.replenishmentFreqType
        ) {
            this.setState({
                currentProduct: this.props.currentProduct,
                replenishmentFreqNum: this.props.replenishmentFreqNum,
                replenishmentFreqType: this.props.replenishmentFreqType
            });
        }
    };

    triggerAnalytics = eventName => {
        const { currentProduct } = this.props;
        const { currentSku, status } = currentProduct;
        const { replenishmentFreqNum, replenishmentFreqType, quantity } = this.state;

        const price = formatSiteCatalystPrice(currentSku?.discountedPrice);

        const data = {
            linkName: eventName,
            actionInfo: eventName,
            specificEventName: eventName,
            skuId: currentSku?.skuId || currentProduct.sku?.skuId,
            status: status?.toLowerCase(),
            replenishmentFreqNum,
            replenishmentFreqType,
            quantity,
            price
        };

        processEvent.process(
            anaConsts.SOT_LINK_TRACKING_EVENT,
            {
                data
            },
            { specificEventName: eventName }
        );
    };

    onDismiss = () => {
        this.triggerAnalytics(anaConsts.EVENT_NAMES.AUTO_REPLENISHMENT.FREQUENCY_CLOSE);
        this.props.onDismiss();
    };

    handleOnSave = () => {
        const { replenishmentFreqType, replenishmentFreqNum, currentProduct } = this.state;

        if (this.props.updateSubscriptionModal) {
            this.props.updateSubscriptionModal(
                {
                    frequency: parseInt(this.state.replenishmentFreqNum),
                    frequencyType: this.state.replenishmentFreqType.toString(),
                    quantity: parseInt(this.state.quantity),
                    profileId: currentProduct.profileId,
                    items: [
                        {
                            skuId: this.props.currentProduct.items[0].skuId,
                            qty: parseInt(this.state.quantity)
                        }
                    ],
                    subscriptionId: this.props.currentProduct.subscriptionId.toString(),
                    shippingAddressId: this.props.currentProduct.shippingAddressId.toString(),
                    paymentInfo: {
                        paymentId: this.props.currentProduct.paymentId.toString()
                    }
                },
                this.props.fireGenericErrorAnalytics
            );
            this.props.toggleChangeDeliveryFrequencyModal();
            this.props.toggleManageSubscriptionModal();
        }

        this.props.updateFrequencyModal &&
            this.props.updateFrequencyModal({
                replenishmentFreqNum: parseInt(this.state.replenishmentFreqNum),
                replenishmentFreqType: this.state.replenishmentFreqType,
                quantity: parseInt(this.state.quantity),
                currentProduct: {
                    ...currentProduct,
                    replenishmentFrequency: `${replenishmentFreqType}:${replenishmentFreqNum}`
                }
            });

        this.triggerAnalytics(anaConsts.EVENT_NAMES.AUTO_REPLENISHMENT.FREQUENCY_CONFIRMED);
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            annualSavingsInfo,
            replenishmentFreqType,
            replenishmentFreqNum,
            currentProduct,
            isMostCommon,
            frequencyTypes,
            frequencyValues,
            quantity,
            acceleratedPromotion
        } = this.state;
        const {
            discountDeliveriesLeft,
            discountsValidUntilMessage,
            user,
            isOpen,
            title,
            isBasket,
            isManageSubscription = false,
            legalCopy
        } = this.props;

        const item = isBasket ? currentProduct.sku : currentProduct?.currentSku;
        const listPrice = parseFloat(basketUtils.removeCurrency(item?.listPrice || item?.price));
        const brandName = isBasket
            ? currentProduct?.sku?.brandName
            : currentProduct?.currentSku?.brandName || currentProduct?.productDetails?.brand?.displayName;

        const productName = isBasket
            ? currentProduct?.sku?.productName
            : currentProduct?.productDetails?.displayName || currentProduct?.currentSku?.displayName;

        const reviewsProp = isBasket ? 'sku.primaryProduct' : 'productDetails';
        const reviewCount =
            currentProduct?.[reviewsProp]?.reviews === undefined ? currentProduct?.currentSku?.reviewsCount : currentProduct?.[reviewsProp]?.reviews;
        const rating =
            currentProduct?.[reviewsProp]?.rating === undefined ? currentProduct?.currentSku?.starRatings : currentProduct?.[reviewsProp]?.rating;
        const frequencyTypeCapitalized = replenishmentFreqType ? StringUtils.capitalize(replenishmentFreqType) : '';
        const hasAdjuster = isBasket
            ? !!currentProduct?.sku?.replenishmentAdjuster
            : !!currentProduct?.currentSku?.replenishmentAdjuster || !!currentProduct?.currentSku?.discountedPrice;
        const showSavingAmount = annualSavingsInfo && annualSavingsInfo[frequencyTypeCapitalized];
        const showAcceleratedPromotion = acceleratedPromotion && isManageSubscription;

        const annualSaving = () => {
            const amount =
                replenishmentFreqType &&
                replenishmentFreqNum &&
                annualSavingsInfo[frequencyTypeCapitalized] &&
                formatCurrency(parseFloat(basketUtils.removeCurrency(annualSavingsInfo[frequencyTypeCapitalized][replenishmentFreqNum])), quantity);

            return amount;
        };

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.onDismiss}
                isDrawer={true}
                isHidden={this.state.isHidden}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text>
                        {getTextFreq('chooseDeliveryFreq')}{' '}
                        <strong>
                            {replenishmentFreqNum} {formatFrequencyType(replenishmentFreqNum, replenishmentFreqType)}{' '}
                            {isMostCommon && `(${getTextFreq('mostCommon')})`}
                        </strong>
                    </Text>
                    {item && (
                        <>
                            <Box marginTop={3}>
                                {replenishmentFreqNum && (
                                    <FrequencySelector
                                        frequencyTypes={frequencyTypes}
                                        frequencyValues={frequencyValues}
                                        isMostCommon={isMostCommon}
                                        replenishmentFreqNum={replenishmentFreqNum}
                                        replenishmentFreqType={frequencyTypeCapitalized}
                                        handleFrequency={this.handleFrequency}
                                    />
                                )}
                            </Box>
                            <Grid
                                gap={[`${SM_IMG_GAP}px`, 4]}
                                columns='auto 1fr'
                                lineHeight='tight'
                                marginTop={3}
                                marginBottom={4}
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
                                        gap={2}
                                        columns='1fr auto'
                                        minHeight={[SM_IMG_SIZE, 0]}
                                    >
                                        <Box fontSize='sm'>
                                            <Text
                                                is='p'
                                                fontWeight='bold'
                                                fontSize={['xs', 'sm']}
                                                data-at={Sephora.debug.dataAt('sku_brand')}
                                            >
                                                {brandName}
                                            </Text>
                                            <Text
                                                is='p'
                                                fontSize={['xs', 'sm']}
                                                marginBottom={1}
                                                data-at={Sephora.debug.dataAt('sku_name')}
                                            >
                                                {productName}
                                            </Text>
                                            <Text
                                                is='p'
                                                fontSize={['xs', 'sm']}
                                                color='gray'
                                                data-at={Sephora.debug.dataAt('sku_size')}
                                            >
                                                {`${item.variationType}: ${item.variationValue}`}
                                                <span css={{ margin: '0 .5em' }}>•</span>
                                                {`${getTextFreq('item')} ${item.skuId}`}
                                            </Text>
                                            {rating && (
                                                <Flex marginTop={3}>
                                                    <StarRating rating={rating} />
                                                    <span css={{ marginLeft: '.5em' }}>
                                                        {(() => {
                                                            switch (reviewCount) {
                                                                case undefined:
                                                                case 0:
                                                                    return getText('notRated');
                                                                case 1:
                                                                    return getText('oneReview');
                                                                default:
                                                                    return formatReviewCount(reviewCount);
                                                            }
                                                        })()}
                                                    </span>
                                                </Flex>
                                            )}
                                            <Flex
                                                alignItems='center'
                                                marginTop={3}
                                                data-at={Sephora.debug.dataAt('sku_qty')}
                                            >
                                                <label
                                                    css={{
                                                        fontWeight: 'bold',
                                                        marginRight: 2
                                                    }}
                                                    htmlFor='qty'
                                                    children='Qty:'
                                                />
                                                <label>{quantity}</label>
                                            </Flex>
                                            {hasAdjuster && (
                                                <div>
                                                    <Text
                                                        is='p'
                                                        fontWeight='bold'
                                                        marginTop={3}
                                                        color='red'
                                                        data-at={Sephora.debug.dataAt('sku_discounted_price')}
                                                    >
                                                        <Text
                                                            is='span'
                                                            css={{ position: 'absolute', height: '1px', width: '1px', overflow: 'hidden' }}
                                                        >
                                                            {getTextFreq('actualPrice')}
                                                        </Text>
                                                        {formatSavingAmountString(currentProduct?.currentSku || currentProduct.sku, quantity)}
                                                        {acceleratedPromotion ? '* ' : ' '}
                                                        <Text
                                                            is='del'
                                                            color='black'
                                                            fontWeight='normal'
                                                            data-at={Sephora.debug.dataAt('sku_price')}
                                                        >
                                                            <Text
                                                                is='span'
                                                                css={{ position: 'absolute', height: '1px', width: '1px', overflow: 'hidden' }}
                                                            >
                                                                {getTextFreq('originalPrice')}
                                                            </Text>
                                                            {formatCurrency(listPrice, quantity)}
                                                        </Text>
                                                    </Text>
                                                    {acceleratedPromotion &&
                                                        (showAcceleratedPromotion ? (
                                                            <>
                                                                <Text
                                                                    is='p'
                                                                    color='gray'
                                                                    marginTop={2}
                                                                    fontSize={'sm'}
                                                                >
                                                                    {'*'}
                                                                    <strong>{acceleratedPromotion.remainingOrderCount}</strong>
                                                                    {` ${discountDeliveriesLeft}`}
                                                                </Text>
                                                                <Text
                                                                    is='p'
                                                                    color='gray'
                                                                    fontSize={['xs', 'sm']}
                                                                >
                                                                    {discountsValidUntilMessage}
                                                                </Text>
                                                            </>
                                                        ) : (
                                                            <Text
                                                                is='p'
                                                                marginTop={2}
                                                                fontSize={['xs', 'sm']}
                                                                color='gray'
                                                            >
                                                                {legalCopy}
                                                                <Text display='block'>{getTextFreq('legalCopy3')}</Text>
                                                            </Text>
                                                        ))}
                                                </div>
                                            )}
                                        </Box>
                                    </Grid>
                                </div>
                            </Grid>
                            {(showSavingAmount || acceleratedPromotion) && (
                                <Box
                                    backgroundColor='nearWhite'
                                    marginBottom={4}
                                    paddingX={4}
                                    paddingY={3}
                                >
                                    <Text
                                        fontSize='base'
                                        is='p'
                                    >
                                        {user?.firstName ? (
                                            <Text
                                                is='span'
                                                children={`${capitalizeFirstLetter(user.firstName)}, ${getTextFreq('youWillSave')} `}
                                            />
                                        ) : (
                                            <Text
                                                is='span'
                                                children={`${capitalizeFirstLetter(getTextFreq('youWillSave'))} `}
                                            />
                                        )}
                                        <Text is='span'>
                                            <strong>{annualSaving()}</strong>{' '}
                                        </Text>
                                        {showAcceleratedPromotion ? getTextFreq('firstYearSavings') : getTextFreq('annualyWithSubs')}
                                    </Text>
                                </Box>
                            )}
                            <Divider />
                            <DeliveryFrequencyCTA
                                onDismiss={this.onDismiss}
                                onSave={this.handleOnSave}
                            />
                        </>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}
DeliveryFrequencyModal.defaultProps = {};

DeliveryFrequencyModal.propTypes = {
    updateFrequencyModal: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isBasket: PropTypes.bool.isRequired,
    currentProduct: PropTypes.shape({}).isRequired,
    replenishmentFreqNum: PropTypes.number.isRequired,
    replenishmentFreqType: PropTypes.string.isRequired,
    toggleChangeDeliveryFrequencyModal: PropTypes.func,
    toggleManageSubscriptionModal: PropTypes.func,
    discountDeliveriesLeft: PropTypes.string,
    discountsValidUntilMessage: PropTypes.string
};

export default wrapComponent(DeliveryFrequencyModal, 'DeliveryFrequencyModal', true);
