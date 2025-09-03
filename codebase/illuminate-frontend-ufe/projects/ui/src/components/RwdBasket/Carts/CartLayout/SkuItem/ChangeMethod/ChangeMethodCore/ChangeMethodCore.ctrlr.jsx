import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Actions from 'actions/Actions';
import store from 'store/Store';
import cookieUtils from 'utils/Cookies';

import * as rwdBasketConstants from 'constants/RwdBasket';

import {
    Divider, Text, Flex, Link, Box
} from 'components/ui';
import ChangeMethodRadio from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodRadio';
import Markdown from 'components/Markdown/Markdown';

import {
    colors, fontSizes, fontWeights, lineHeights
} from 'style/config';

import adressUtils from 'utils/Address';
import deliveryOptions from 'utils/DeliveryOptions';
import localeUtils from 'utils/LanguageLocale';
import extraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import storeUtils from 'utils/Store';
import rwdBasketUtils from 'utils/RwdBasket';
import helpersUtils from 'utils/Helpers';
import rwdBasket from 'reducers/rwdBasket';
import ItemSubstitutionModalBindings from 'analytics/bindingMethods/components/globalModals/itemSubstitutionModal/ItemSubstitutionModalBindings';
import biApi from 'services/api/beautyInsider';
import BiFreeShipping from 'components/RwdBasket/Messages/BiFreeShipping/BiFreeShipping';

const { getStoreDisplayName } = storeUtils;
const { getItemSddBopisAvailability } = rwdBasketUtils;
const { availabilityLabel, isLabelInStockStatus, AVAILABILITY_STATUS } = extraProductDetailsUtils;
const { getLocaleResourceFile, isFRCanada } = localeUtils;
const { formatZipCode } = adressUtils;
const { showStoreListModal } = deliveryOptions;
const { showShippingDeliveryLocationModal } = Actions;
const { dispatch } = store;
const { ACTION_TYPES } = rwdBasket;
const { getRewardFulfillmentOptions } = biApi;
const { replaceDoubleAsterisks } = helpersUtils;

const {
    DELIVERY_METHOD_TYPES: { SAMEDAY, AUTOREPLENISH, STANDARD, BOPIS },
    RWD_CHECKOUT_ERRORS: { TOP_OF_PAGE_SAD }
} = rwdBasketConstants;

import debounceUtils from 'utils/Debounce';
const Debounce = debounceUtils.debounce;

class ChangeMethodCore extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            checkedMethod: null,
            bopisAvailability: null,
            sddAvailability: null,
            standardAvailability: null,
            rewardAvailability: null,
            disableRadio: false,
            isVisible: false,
            showSkeleton: true,
            requestsInTransit: false,
            hasFetchedStandardAvailability: false
        };

        this.showStoreListModal = showStoreListModal.bind(this);

        this.ref = React.createRef();

        this.observer = null;
    }

    componentDidMount() {
        const { deferRequests, itemDeliveryMethod } = this.props;

        if (deferRequests) {
            // Setup observer --> Updates will occur on componentDidUpdate for defered requests
            const callback = Debounce(([{ isIntersecting }]) => this.setState({ isVisible: isIntersecting }), 200);
            const options = { threshold: 0 };

            this.observer = new IntersectionObserver(callback, options);
            this.ref.current && this.observer.observe(this.ref.current);
        } else {
            // First time update without deferring requests
            this.setItemAvailability({
                checkedMethod: itemDeliveryMethod,
                fetchStandard: true
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { itemDeliveryMethod, preferredStoreInfo, preferredZipCode, isRewardFulfillmentVariant } = this.props;
        const {
            isVisible,
            bopisAvailability,
            sddAvailability,
            rewardAvailability,
            requestsInTransit,
            standardAvailability,
            hasFetchedStandardAvailability
        } = this.state;

        // Update if the item has entered the viewport
        if (isVisible && !requestsInTransit) {
            // First time update
            const shouldGetBopisAndSddAvailability = !isRewardFulfillmentVariant && !bopisAvailability && !sddAvailability;
            const shouldGetRewardAvailability = isRewardFulfillmentVariant && !rewardAvailability;
            const shouldGetStandardAvailability = !isRewardFulfillmentVariant && !standardAvailability;

            if (shouldGetStandardAvailability && !hasFetchedStandardAvailability) {
                this.setState({
                    hasFetchedStandardAvailability: true
                });
                this.setItemAvailability({ checkedMethod: itemDeliveryMethod, fetchStandard: true });
            }

            if (shouldGetBopisAndSddAvailability || shouldGetRewardAvailability) {
                this.setState({ requestsInTransit: true });
                this.setItemAvailability({ checkedMethod: itemDeliveryMethod });
            }
        }

        // Subsequent updates
        if (prevProps.preferredStoreInfo !== preferredStoreInfo) {
            this.onPostUpdate({ checkedMethod: itemDeliveryMethod, fetchSameDay: false });
        }

        if (prevProps.preferredZipCode !== preferredZipCode) {
            this.onPostUpdate({ checkedMethod: itemDeliveryMethod, fetchPickup: false });
        }
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    setDisableRadio = disableRadio => this.setState({ disableRadio });

    onChange = cb => args => {
        if (this.props.isModal) {
            cb(args);
        } else {
            this.setDisableRadio(true);
            cb(args).finally(() => this.setDisableRadio(false));
        }
    };

    onChooseMethod = e => {
        const {
            item, itemDeliveryMethod, onChangeMethod, setDeliveryMethodCallback, preferredZipCode
        } = this.props;
        const { sddAvailability, bopisAvailability } = this.state;
        const zipCodeNotAvailable = formatZipCode(sddAvailability?.notAvailableZipCode);
        const zipCode = formatZipCode(preferredZipCode);

        const checkedMethod = e.target.name;

        this.setState({ checkedMethod });

        if (setDeliveryMethodCallback) {
            return setDeliveryMethodCallback({
                checkedMethod,
                sddAvailability,
                bopisAvailability
            });
        }

        const isCheckedMethodChanged = checkedMethod !== itemDeliveryMethod;

        if (item.substituteSku) {
            ItemSubstitutionModalBindings.removeSubstituteItem(false);
        }

        if (Sephora.configurationSettings.setZipStoreCookie) {
            cookieUtils.write('sameDayZipcodeCookie', zipCodeNotAvailable || zipCode, null, false, false);
        }

        // When not in modal view this.onChange method wrapper expects a resolved Promise returned
        return isCheckedMethodChanged
            ? onChangeMethod({
                skuId: item.sku.skuId,
                qty: item.qty,
                deliveryOption: checkedMethod,
                productId: item.sku.productId,
                itemSwitchedFromBasket: itemDeliveryMethod
            })
            : Promise.resolve();
    };

    onPostUpdate = args => {
        const updateCallback = () => this.setItemAvailability(args);
        this.setState({ showSkeleton: true, requestsInTransit: true }, updateCallback);
    };

    setItemAvailability = ({ fetchPickup, fetchSameDay, fetchStandard, checkedMethod }) => {
        const {
            item,
            userId,
            setDeliveryMethodCallback,
            handleBopisSkuIsOOSChange,
            handleSddSkuIsOOSChange,
            preferredZipCode,
            preferredStoreInfo,
            isRewardFulfillmentVariant
        } = this.props;

        if (isRewardFulfillmentVariant) {
            const options = {
                skuId: item.sku?.skuId,
                storeId: preferredStoreInfo?.storeId,
                zipCode: preferredZipCode
            };

            getRewardFulfillmentOptions(options)
                .then(rewardAvailability => {
                    this.setState(
                        {
                            rewardAvailability,
                            checkedMethod
                        },
                        () => {
                            if (setDeliveryMethodCallback) {
                                setDeliveryMethodCallback({
                                    rewardAvailability,
                                    checkedMethod
                                });
                            }
                        }
                    );
                })
                .finally(() => this.setState({ showSkeleton: false, requestsInTransit: false }));

            return;
        }

        const options = {
            ...(fetchPickup != null && { fetchPickup }),
            ...(fetchSameDay != null && { fetchSameDay }),
            ...(fetchStandard != null && { fetchStandard })
        };

        getItemSddBopisAvailability({ userId, item, options, preferredZipCode })
            .then(data => {
                const [bopisAvailability, sddAvailability, standardAvailability] = data;
                const nextState = {
                    ...(bopisAvailability && { bopisAvailability }),
                    ...(sddAvailability && { sddAvailability }),
                    ...(checkedMethod && { checkedMethod }),
                    ...(standardAvailability && { standardAvailability }),
                    requestsInTransit: false
                };

                this.setState(nextState);

                // Pass value via cb to cart level: i.e., BOPISCart etc...
                if (handleBopisSkuIsOOSChange) {
                    this.props.handleBopisSkuIsOOSChange(item.sku.skuId, bopisAvailability?.currentSku?.isOutOfStock);
                }

                if (handleSddSkuIsOOSChange) {
                    this.props.handleSddSkuIsOOSChange(item.sku.skuId, sddAvailability?.currentSku?.isOutOfStock);
                }

                if (setDeliveryMethodCallback) {
                    setDeliveryMethodCallback({
                        checkedMethod,
                        sddAvailability,
                        bopisAvailability
                    });
                }
            })
            .catch(err => {
                // SDD Service is down
                if (err.serviceUnavailable) {
                    dispatch({
                        type: ACTION_TYPES.SET_RWD_CHECKOUT_ERRORS,
                        payload: {
                            error: err,
                            errorLocation: TOP_OF_PAGE_SAD
                        }
                    });
                }
            })
            .finally(() => this.setState({ showSkeleton: false, requestsInTransit: false }));
    };

    // These next few methods belong to sddRadio (refactored to remove es lint complexity)
    handleSDDRadioClick = () => {
        const { unhideChangeMethodModal, hideChangeMethodModal, isCheckedOnPrefChange } = this.props;

        hideChangeMethodModal && hideChangeMethodModal();
        dispatch(
            showShippingDeliveryLocationModal({
                isOpen: true,
                callback: () => {
                    unhideChangeMethodModal && unhideChangeMethodModal();

                    if (isCheckedOnPrefChange) {
                        this.onPostUpdate({
                            fetchPickup: false,
                            ...(isCheckedOnPrefChange && { checkedMethod: SAMEDAY })
                        });
                    }
                },
                cancelCallback: unhideChangeMethodModal ? unhideChangeMethodModal : () => {}
            })
        );
    };

    getSameDayAvailabilityLabel = (zipCode, sddNotAvailableForZipCode, sameDayAvailabilityStatus) => {
        return zipCode && sddNotAvailableForZipCode ? 'sameDayNotAvailable' : availabilityLabel(sameDayAvailabilityStatus);
    };

    getRewardAvailabilityStatus = (isRewardFulfillmentVariant, rewardAvailability, fulfillment) => {
        const status = isRewardFulfillmentVariant
            ? rewardAvailability?.currentSku?.rewardStatus[fulfillment]
                ? AVAILABILITY_STATUS.IN_STOCK
                : AVAILABILITY_STATUS.OUT_OF_STOCK
            : undefined;

        return status;
    };

    isSDDDisabled = ({
        disableRadio,
        isSameDayShippingEnabled,
        isSameDayEligibleSku,
        sddNotAvailableForZipCode,
        sddTemporarilyUnavailable,
        isOutOfStock,
        isAvailabilityLabelInStock,
        availabilityLabelIsSelectForStoreAvailability
    }) => {
        if (
            // (INFL-5180) We want radio button to open modal in this case
            availabilityLabelIsSelectForStoreAvailability ||
            sddNotAvailableForZipCode
        ) {
            return false;
        }

        return (
            disableRadio ||
            !isSameDayShippingEnabled ||
            !isSameDayEligibleSku ||
            sddTemporarilyUnavailable ||
            isOutOfStock ||
            !isAvailabilityLabelInStock
        );
    };

    renderSddRadio = getText => {
        const {
            item, preferredZipCode, isModal, withIcon, isRewardFulfillmentVariant
        } = this.props;
        const {
            checkedMethod, sddAvailability, disableRadio, showSkeleton, rewardAvailability = {}
        } = this.state;
        const { currentSku, notAvailableZipCode, sddNotAvailableForZipCode, sddTemporarilyUnavailable } = sddAvailability || {};
        const isSameDayShippingEnabled = Sephora.configurationSettings.isSameDayShippingEnabled;
        const isSameDayEligibleSku = item.sku.isSameDayEligibleSku || rewardAvailability?.currentSku?.sameDayEligibleSku;
        const rewardAvailable = rewardAvailability?.currentSku?.rewardStatus?.sdd;
        const isOutOfStock = currentSku?.isOutOfStock || (isRewardFulfillmentVariant && !rewardAvailable);
        const zipCodeNotAvailable = formatZipCode(notAvailableZipCode);
        const zipCode = formatZipCode(preferredZipCode);
        const sameDayTitle = currentSku?.sameDayTitle || rewardAvailability?.currentSku?.sameDayTitle || getText('sameDayDelivery');
        const sameDayDeliveryMessage = currentSku?.sameDayDeliveryMessage || rewardAvailability?.currentSku?.sameDayDeliveryMessage;
        const rewardAvailabilityStatus = this.getRewardAvailabilityStatus(isRewardFulfillmentVariant, rewardAvailability, 'sdd');
        const sameDayAvailabilityStatus = currentSku?.actionFlags?.sameDayAvailabilityStatus || rewardAvailabilityStatus;
        const sameDayAvailabilityLabel = this.getSameDayAvailabilityLabel(zipCode, sddNotAvailableForZipCode, sameDayAvailabilityStatus);
        const isAvailabilityLabelInStock = isLabelInStockStatus(sameDayAvailabilityLabel);
        const availabilityLabelIsSelectForStoreAvailability = sameDayAvailabilityLabel === 'selectForStoreAvailability';
        const noStockStatusOrUnavailable = availabilityLabelIsSelectForStoreAvailability || sddNotAvailableForZipCode;

        const checked = checkedMethod === SAMEDAY;

        const isDisabled = this.isSDDDisabled({
            disableRadio,
            isSameDayShippingEnabled,
            isSameDayEligibleSku,
            sddNotAvailableForZipCode,
            sddTemporarilyUnavailable,
            isOutOfStock,
            isAvailabilityLabelInStock,
            availabilityLabelIsSelectForStoreAvailability
        });

        return (
            <ChangeMethodRadio
                name={SAMEDAY}
                onChange={arg => {
                    // (INFL-5180) We want radio button to open modal in this case
                    if (availabilityLabelIsSelectForStoreAvailability) {
                        this.handleSDDRadioClick();
                    } else {
                        this.onChange(this.onChooseMethod)(arg);
                    }
                }}
                checked={checked}
                disabled={isDisabled}
                withIcon={withIcon}
                iconName={checked ? 'bagActive' : 'bag'}
                isSkeleton={showSkeleton}
                skeletonFirstRowMatchTitleHeight={isModal}
                testId={'methods_bsk_sdd_choose_method'}
            >
                <Text
                    is='h4'
                    fontWeight={fontWeights.bold}
                    lineHeight={lineHeights.tight}
                    children={sameDayTitle}
                />
                <Link
                    display='block'
                    arrowDirection='down'
                    onClick={this.handleSDDRadioClick}
                    fontSize={[fontSizes.base, fontSizes.sm]}
                    lineHeight={lineHeights.tight}
                >
                    <Text
                        color={noStockStatusOrUnavailable ? colors.black : isOutOfStock ? colors.red : colors.green}
                        fontWeight={!noStockStatusOrUnavailable && fontWeights.bold}
                        children={getText(sameDayAvailabilityLabel)}
                        data-at={Sephora.debug.dataAt('methods_bsk_sdd_see_availability_label')}
                    />
                    {` ${getText('for')} `}
                    <Text
                        fontWeight={fontWeights.bold}
                        children={zipCodeNotAvailable || zipCode || getText('yourLocation')}
                        data-at={Sephora.debug.dataAt('methods_bsk_sdd_choose_zipcode_button')}
                    />
                </Link>
                {sddNotAvailableForZipCode || isOutOfStock ? (
                    <Link
                        color={colors.blue}
                        onClick={this.handleSDDRadioClick}
                        fontSize={fontSizes.sm}
                        lineHeight={lineHeights.tight}
                        children={getText('changeLocation')}
                        data-at={Sephora.debug.dataAt('methods_bsk_sdd_change_location_link')}
                    />
                ) : (
                    <Text
                        color={colors.green}
                        fontSize={fontSizes.sm}
                        lineHeight={lineHeights.tight}
                        data-at={Sephora.debug.dataAt('methods_bsk_sdd_label')}
                    >
                        <Markdown
                            is='span'
                            css={styles.sddMessageMarkdown}
                            content={replaceDoubleAsterisks(sameDayDeliveryMessage)}
                        />
                    </Text>
                )}
            </ChangeMethodRadio>
        );
    };

    renderStandardRadio = getText => {
        const {
            itemDeliveryMethod,
            isModal,
            withIcon,
            hasMetFreeShippingThreshhold,
            isSignedInBIUser,
            isRewardFulfillmentVariant,
            preferredZipCode
        } = this.props;
        const {
            disableRadio, checkedMethod, showSkeleton, rewardAvailability, standardAvailability
        } = this.state;
        const checked = checkedMethod === STANDARD;
        const hasSkeletonSecondRow = isModal && (isSignedInBIUser || !hasMetFreeShippingThreshhold);
        const rewardAvailable = rewardAvailability?.currentSku?.rewardStatus?.sth;
        const isDisabled = disableRadio || (isRewardFulfillmentVariant && !rewardAvailable);
        const standardDeliveryEstimate = standardAvailability?.deliveryOptions?.shipToHome?.shipToHomeMessage || '';
        const getItShippedDeliveryMessage = standardDeliveryEstimate.length ? standardDeliveryEstimate?.split(!isFRCanada() ? ' to' : ' au')[0] : '';
        const shouldDisplayEddOnBasketPage = preferredZipCode;

        return (
            <ChangeMethodRadio
                name={STANDARD}
                onChange={this.onChange(this.onChooseMethod)}
                checked={checked}
                disabled={isDisabled}
                withIcon={withIcon}
                iconName={checked ? 'truckActive' : 'truck'}
                isSkeleton={showSkeleton}
                skeletonTitleWidth={isModal ? 157 : 95}
                hasSkeletonFirstRow={isModal}
                skeletonFirstRowWidth={289}
                hasSkeletonSecondRow={hasSkeletonSecondRow}
                skeletonSecondRowWidth={61}
                hasSkeletonBox={isModal && itemDeliveryMethod === STANDARD}
                testId={'methods_gis_sdd_choose_method'}
            >
                <Text
                    is='h4'
                    fontWeight={fontWeights.bold}
                    lineHeight={lineHeights.tight}
                    children={getText('getItShipped')}
                />
                {shouldDisplayEddOnBasketPage && (
                    <>
                        {standardDeliveryEstimate ? (
                            <Text>
                                <Text
                                    color={colors.green}
                                    fontSize={fontSizes.sm}
                                    lineHeight={lineHeights.tight}
                                >
                                    {getItShippedDeliveryMessage}
                                </Text>
                                {` ${getText('to')} `}
                                <Link
                                    arrowDirection='down'
                                    onClick={this.handleSDDRadioClick}
                                    fontSize={[fontSizes.base, fontSizes.sm]}
                                    lineHeight={lineHeights.tight}
                                >
                                    <Text fontWeight={fontWeights.bold}>{preferredZipCode}</Text>
                                </Link>
                            </Text>
                        ) : (
                            <>
                                <BiFreeShipping
                                    hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                                    isSignedInBIUser={isSignedInBIUser}
                                    baseColor={colors.green}
                                    isFreeShipBold
                                    fontSize={fontSizes.sm}
                                    lineHeight={lineHeights.tight}
                                />
                                {checked && (
                                    <Box
                                        padding={2}
                                        backgroundColor={colors.nearWhite}
                                        borderRadius={2}
                                        marginTop={2}
                                        fontSize={fontSizes.sm}
                                        lineHeight={lineHeights.tight}
                                    >
                                        <Text fontWeight={fontWeights.bold}>{getText('getItSooner')} </Text>
                                        <Text>{getText('withSddOrBopis')}</Text>
                                    </Box>
                                )}
                            </>
                        )}
                    </>
                )}
            </ChangeMethodRadio>
        );
    };

    isBOPISDisabled = ({
        disableRadio,
        isBOPISEnabled,
        isPickUpEligibleSku,
        isReservationNotOfferedPickup,
        isOutOfStock,
        isAvailabilityLabelInStock,
        availabilityLabelIsSelectForStoreAvailability
    }) => {
        if (
            // (INFL-5180) We want radio button to open modal in this case
            availabilityLabelIsSelectForStoreAvailability
        ) {
            return false;
        }

        return (
            disableRadio || !isBOPISEnabled || !isPickUpEligibleSku || isReservationNotOfferedPickup || isOutOfStock || !isAvailabilityLabelInStock
        );
    };

    renderBopisRadio = getText => {
        const {
            item,
            preferredStoreInfo,
            unhideChangeMethodModal,
            hideChangeMethodModal,
            isModal,
            withIcon,
            isCheckedOnPrefChange,
            isRewardFulfillmentVariant
        } = this.props;
        const {
            checkedMethod, bopisAvailability, disableRadio, showSkeleton, rewardAvailability = {}
        } = this.state;
        const { currentSku, pickupMessage } = bopisAvailability || {};

        const isBOPISEnabled = Sephora.configurationSettings.isBOPISEnabled;
        const isPickUpEligibleSku = item.sku.isPickUpEligibleSku || rewardAvailability?.currentSku?.pickUpEligibleSku;
        const isReservationNotOfferedPickup = currentSku?.actionFlags?.isReservationNotOffered;
        const rewardAvailable = rewardAvailability?.currentSku?.rewardStatus?.bopis;
        const isOutOfStock = currentSku?.isOutOfStock || (isRewardFulfillmentVariant && !rewardAvailable);
        const rewardAvailabilityStatus = this.getRewardAvailabilityStatus(isRewardFulfillmentVariant, rewardAvailability, 'bopis');
        const availabilityStatusPickup = currentSku?.actionFlags?.availabilityStatus || rewardAvailabilityStatus;
        const bopisAvailabilityLabel = availabilityLabel(availabilityStatusPickup);
        const isAvailabilityLabelInStock = isLabelInStockStatus(bopisAvailabilityLabel);
        const availabilityLabelIsSelectForStoreAvailability = bopisAvailabilityLabel === 'selectForStoreAvailability';
        const noStockStatusOrUnavailable = availabilityLabelIsSelectForStoreAvailability || isReservationNotOfferedPickup;

        const preferredStoreName = getStoreDisplayName(preferredStoreInfo || {});

        const onClick = e => {
            this.showStoreListModal(e, null, {
                isFromChangeMethod: true,
                item,
                callback: () => {
                    unhideChangeMethodModal && unhideChangeMethodModal();
                    this.onPostUpdate({
                        fetchSameDay: false,
                        ...(isCheckedOnPrefChange && { checkedMethod: BOPIS })
                    });
                },
                mountCallback: hideChangeMethodModal ? hideChangeMethodModal : () => {},
                cancelCallback: unhideChangeMethodModal ? unhideChangeMethodModal : () => {}
            });
        };

        const checked = checkedMethod === BOPIS;

        const isDisabled = this.isBOPISDisabled({
            disableRadio,
            isBOPISEnabled,
            isPickUpEligibleSku,
            isReservationNotOfferedPickup,
            isOutOfStock,
            isAvailabilityLabelInStock,
            availabilityLabelIsSelectForStoreAvailability
        });

        const availabilityText = getText(isOutOfStock ? 'outOfStock' : preferredStoreName ? bopisAvailabilityLabel : 'checkAvailability');

        return (
            <ChangeMethodRadio
                name={BOPIS}
                onChange={arg => {
                    // (INFL-5180) We want radio button to open modal in this case
                    if (availabilityLabelIsSelectForStoreAvailability) {
                        onClick(arg);
                    } else {
                        this.onChange(this.onChooseMethod)(arg);
                    }
                }}
                checked={checked}
                disabled={isDisabled}
                withIcon={withIcon}
                iconName={checked ? 'storeActive' : 'store'}
                isSkeleton={showSkeleton}
                skeletonTitleWidth={157}
                skeletonFirstRowMatchTitleHeight={isModal}
                testId={'methods_bsk_bopis_choose_method'}
            >
                <Text
                    is='h4'
                    fontWeight={fontWeights.bold}
                    lineHeight={lineHeights.tight}
                    children={getText('buyOnlineAndPickup')}
                />
                <Link
                    display='block'
                    arrowDirection='down'
                    onClick={onClick}
                    fontSize={[fontSizes.base, fontSizes.sm]}
                    lineHeight={lineHeights.tight}
                >
                    <Text
                        color={noStockStatusOrUnavailable ? colors.black : isOutOfStock ? colors.red : colors.green}
                        fontWeight={!noStockStatusOrUnavailable && fontWeights.bold}
                        children={availabilityText}
                        data-at={Sephora.debug.dataAt(' methods_bsk_bopis_see_availability_label')}
                    />
                    {` ${getText('at')} `}
                    <Text
                        fontWeight={fontWeights.bold}
                        children={preferredStoreName || getText('storesNearYou')}
                        data-at={Sephora.debug.dataAt('methods_bsk_bopis_store_name_button')}
                    />
                </Link>
                {isReservationNotOfferedPickup || isOutOfStock ? (
                    <Link
                        color={colors.blue}
                        onClick={onClick}
                        fontSize={fontSizes.sm}
                        lineHeight={lineHeights.tight}
                        children={getText('checkOtherStores')}
                        data-at={Sephora.debug.dataAt('methods_bsk_bopis_check_other_stores_link')}
                    />
                ) : (
                    <Text
                        color={colors.green}
                        fontSize={fontSizes.sm}
                        lineHeight={lineHeights.tight}
                        children={pickupMessage}
                        data-at={Sephora.debug.dataAt('methods_bsk_bopis_label')}
                    />
                )}
            </ChangeMethodRadio>
        );
    };

    renderAutoReplenishRadio = getText => {
        return (
            <ChangeMethodRadio
                name={AUTOREPLENISH}
                disabled={true}
                withIcon={this.props.withIcon}
                iconName='autoReplenish'
                isSkeleton={this.state.showSkeleton}
                hasSkeletonSecondRow={false}
                testId={'methods_bsk_ar_choose_method'}
            >
                <Text
                    is='h4'
                    fontWeight={fontWeights.bold}
                    children={getText('autoReplenish')}
                    lineHeight={lineHeights.tight}
                />
                <Text
                    color={colors.gray}
                    fontSize={fontSizes.sm}
                    lineHeight={lineHeights.tight}
                    children={getText('enrollFromPDP')}
                    data-at={Sephora.debug.dataAt('methods_bsk_ar_label')}
                />
            </ChangeMethodRadio>
        );
    };

    renderAutoReplenishInfoBox = getText => {
        return (
            <Flex
                flexDirection='column'
                gap={1}
                paddingY={2}
                paddingX={[3, 2]}
                backgroundColor={colors.nearWhite}
                borderRadius={2}
                data-at={Sephora.debug.dataAt('methods_bsk_ar_warning_message')}
            >
                <Text
                    is='h4'
                    fontWeight={fontWeights.bold}
                    lineHeight={lineHeights.none}
                    children={getText('autoReplenish')}
                />
                <Text
                    fontSize={fontSizes.sm}
                    lineHeight={lineHeights.tight}
                    children={getText('autoReplenishSwitchMessageNotice')}
                />
            </Flex>
        );
    };

    render() {
        const { item, itemDeliveryMethod, withDivider, isRewardFulfillmentVariant } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/locales', 'ChangeMethod');

        const isReplenishmentEligible = item.sku.isReplenishmentEligible;
        const isChangeMethodOptionAR = itemDeliveryMethod === AUTOREPLENISH;
        const showARInfoBox = isReplenishmentEligible && isChangeMethodOptionAR && !isRewardFulfillmentVariant;
        const showARRadio = isReplenishmentEligible && !isChangeMethodOptionAR && !isRewardFulfillmentVariant;

        return (
            <Flex
                flexDirection='column'
                gap={[3, 4]}
                ref={this.ref}
            >
                {showARInfoBox && this.renderAutoReplenishInfoBox(getText)}
                {withDivider && <Divider />}
                {this.renderSddRadio(getText)}
                {withDivider && <Divider />}
                {this.renderStandardRadio(getText)}
                {withDivider && <Divider />}
                {this.renderBopisRadio(getText)}
                {showARRadio && (
                    <>
                        {withDivider && <Divider />}
                        {this.renderAutoReplenishRadio(getText)}
                    </>
                )}
            </Flex>
        );
    }
}

const styles = {
    sddMessageMarkdown: {
        '& > :first-child': {
            display: 'inline'
        }
    }
};

ChangeMethodCore.defaultProps = {
    deferRequests: false,
    isModal: false,
    withDivider: false,
    onChangeMethod: () => {},
    isCheckedOnPrefChange: false,
    setDeliveryMethodCallback: null,
    hideChangeMethodModal: null,
    unhideChangeMethodModal: null,
    preferredZipCode: null,
    isRewardFulfillmentVariant: false
};

ChangeMethodCore.propTypes = {
    isRewardFulfillmentVariant: PropTypes.bool
};

export default wrapComponent(ChangeMethodCore, 'ChangeMethodCore', true);
