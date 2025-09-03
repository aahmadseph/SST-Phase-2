import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import * as rwdBasketConstants from 'constants/RwdBasket';

import {
    Flex, Grid, Button, Text
} from 'components/ui';
import ChangeMethodCore from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodCore';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';

import { fontWeights, lineHeights, breakpoints } from 'style/config';

import { getImageAltText } from 'utils/Accessibility';
import localeUtils from 'utils/LanguageLocale';
import uiUtils from 'utils/UI';
import anaUtils from 'analytics/utils';

const {
    DELIVERY_METHOD_TYPES: { SAMEDAY, STANDARD, BOPIS }
} = rwdBasketConstants;
const { getLocaleResourceFile } = localeUtils;
const { unlockBackgroundPosition } = uiUtils;

class ChangeMethodModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            checkedMethod: null,
            isConfirmButtonDisabled: true,
            isHidden: false
        };
    }

    setDeliveryMethodCallback = ({ checkedMethod, sddAvailability, bopisAvailability, rewardAvailability }) => {
        const isConfirmButtonDisabled = this.getConfirmBtnDisabledStatus({
            checkedMethod,
            sddAvailability,
            bopisAvailability,
            rewardAvailability
        });

        const nextState = {
            checkedMethod,
            isConfirmButtonDisabled
        };

        this.setState(nextState);
    };

    setIsHidden = isHidden => this.setState({ isHidden });

    unhideChangeMethodModal = () => this.setIsHidden(false);

    hideChangeMethodModal = () => this.setIsHidden(true);

    confirmChangeMethod = () => {
        const { checkedMethod } = this.state;
        const {
            item, onChangeMethod, closeChangeMethodModal, itemDeliveryMethod, basket
        } = this.props;

        const isCheckedMethodChanged = checkedMethod !== itemDeliveryMethod;

        if (isCheckedMethodChanged || this.props.isRewardFulfillmentVariant) {
            if (onChangeMethod) {
                onChangeMethod({
                    skuId: item.sku.skuId,
                    qty: item.qty,
                    deliveryOption: checkedMethod,
                    productId: item.sku.productId,
                    itemSwitchedFromBasket: itemDeliveryMethod
                });
                closeChangeMethodModal();
            } else if (this.props.isRewardFulfillmentVariant && this.props.addRewardToBasket) {
                const fulfillmentType = checkedMethod === BOPIS ? 'ROPIS' : checkedMethod;
                const analyticsData = {
                    productStrings: [
                        anaUtils.buildSingleProductString({
                            sku: item.sku,
                            isQuickLook: false,
                            newProductQty: false,
                            displayQuantityPickerInATB: false,
                            basket
                        })
                    ]
                };

                this.props.addRewardToBasket(
                    item.sku,
                    fulfillmentType,
                    null,
                    closeChangeMethodModal,
                    null,
                    false,
                    analyticsData,
                    null,
                    null,
                    null,
                    item.sku.productId
                );

                this.props.confirmAnalytics({
                    method: checkedMethod,
                    skuId: item.sku.skuId
                });
            }
        } else {
            closeChangeMethodModal();
        }
    };

    getConfirmBtnDisabledStatus = ({ checkedMethod, sddAvailability, bopisAvailability, rewardAvailability }) => {
        if (rewardAvailability) {
            const rewardStatusMap = {
                [SAMEDAY]: 'sdd',
                [BOPIS]: 'bopis',
                [STANDARD]: 'sth'
            };
            const rewardFulfillmentType = rewardStatusMap[checkedMethod];
            const isButtonDisabled = !(rewardAvailability.currentSku?.rewardStatus?.[rewardFulfillmentType] || false);

            return isButtonDisabled;
        }

        const isSameDayMethod =
            checkedMethod === SAMEDAY && !sddAvailability?.currentSku?.isOutOfStockSameDay && !sddAvailability?.sddNotAvailableForZipCode;
        const isStandardMethod = checkedMethod === STANDARD;
        const isBopisMethod =
            checkedMethod === BOPIS &&
            this.props.preferredStoreInfo?.displayName &&
            !bopisAvailability?.currentSku?.actionFlags?.isReservationNotOffered &&
            !bopisAvailability?.currentSku?.isOutOfStock;

        return isSameDayMethod ? false : isStandardMethod ? false : !isBopisMethod;
    };

    dismissChangeMethodModal = () => {
        // SMUI max window innerWidth is 767px
        const SMUI_MAX_WIDTH = parseInt(breakpoints[0]) - 1;

        // We only show the modal on SMUI, otherwise we close it
        if (window.innerWidth > SMUI_MAX_WIDTH && !this.props?.isRewardFulfillmentVariant) {
            this.props.closeChangeMethodModal();
            unlockBackgroundPosition();
        }
    };

    componentDidMount() {
        if (this.props.isRewardFulfillmentVariant) {
            this.props.pageLoadAnalytics(this.props.item.sku.skuId);
        }

        window.addEventListener('resize', this.dismissChangeMethodModal);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.dismissChangeMethodModal);
    }

    render() {
        const {
            isOpen,
            closeChangeMethodModal,
            item,
            itemDeliveryMethod,
            preferredStoreInfo,
            preferredZipCode,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedInBIUser,
            isRewardFulfillmentVariant,
            isFromRewardsModal
        } = this.props;
        const { isHidden, isConfirmButtonDisabled } = this.state;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/locales', 'ChangeMethod');

        return (
            <Modal
                width={0}
                isOpen={isOpen}
                onDismiss={closeChangeMethodModal}
                isDrawer={true}
                isHidden={isHidden}
            >
                <Modal.Header>
                    <Modal.Title children={isRewardFulfillmentVariant ? getText('chooseMethod') : getText('changeMethod')} />
                </Modal.Header>
                <Modal.Body
                    paddingTop={2}
                    paddingBottom={3}
                >
                    <Flex
                        gap={2}
                        lineHeight={lineHeights.tight}
                        alignItems='center'
                        marginBottom={3}
                    >
                        <ProductImage
                            id={item.sku.skuId}
                            size={48}
                            skuImages={item.sku.skuImages}
                            disableLazyLoad={true}
                            altText={getImageAltText(item.sku || {})}
                        />
                        <div>
                            <Text
                                is='h4'
                                fontWeight={fontWeights.bold}
                                children={item.sku.brandName}
                            />
                            <Text
                                is='p'
                                children={item.sku.productName}
                            />
                        </div>
                    </Flex>
                    <ChangeMethodCore
                        isModal
                        withDivider
                        isCheckedOnPrefChange
                        setDeliveryMethodCallback={this.setDeliveryMethodCallback}
                        unhideChangeMethodModal={this.unhideChangeMethodModal}
                        hideChangeMethodModal={this.hideChangeMethodModal}
                        item={item}
                        itemDeliveryMethod={itemDeliveryMethod}
                        preferredStoreInfo={preferredStoreInfo}
                        preferredZipCode={preferredZipCode}
                        userId={userId}
                        hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                        isSignedInBIUser={isSignedInBIUser}
                        isRewardFulfillmentVariant={isRewardFulfillmentVariant}
                        isFromRewardsModal={isFromRewardsModal}
                    />
                </Modal.Body>
                <Modal.Footer hasBorder={true}>
                    <Grid columns={2}>
                        <Button
                            data-at={Sephora.debug.dataAt('change_method_modal_cancel_btn')}
                            variant='secondary'
                            onClick={closeChangeMethodModal}
                            children={getText('cancel')}
                        />
                        <Button
                            data-at={Sephora.debug.dataAt('change_method_modal_confirm_btn')}
                            variant='primary'
                            onClick={isConfirmButtonDisabled ? null : this.confirmChangeMethod}
                            disabled={isConfirmButtonDisabled}
                            children={getText('confirm')}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(ChangeMethodModal, 'ChangeMethodModal', true);
