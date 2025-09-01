/* eslint-disable class-methods-use-this */
/* eslint-disable complexity */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Fragment } from 'react';
import resourceWrapper from 'utils/framework/resourceWrapper';
import {
    Box, Flex, Text, Icon, Link
} from 'components/ui';
import { mediaQueries, space } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import bccUtils from 'utils/BCC';
import InfoButton from 'components/InfoButton/InfoButton';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import FinalSaleItem from 'components/SharedComponents/FinalSaleItem';
import localeUtils from 'utils/LanguageLocale';
import Tooltip from 'components/Tooltip/Tooltip';
import { getImageAltText } from 'utils/Accessibility';
import skuUtils from 'utils/Sku';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import ProductSDU from 'components/Product/ProductSDU';
import store from 'store/Store';
import Actions from 'Actions';
import SubstituteItem from 'components/ItemSubstitution/SubstituteItem';
import basketConstants from 'constants/Basket';

const { IMAGE_SIZES } = bccUtils;
const { formatFrequencyType } = deliveryFrequencyUtils;

class ItemsInOrder extends BaseClass {
    state = {};

    /**
     * returns joined messages from array element, with defined messageContext property
     */
    getWarningTextByContext = (warningArr, messageContext = '') => {
        const filteredWarningArr = Array.isArray(warningArr) ? warningArr.filter(msgObj => msgObj.messageContext === messageContext) : [];

        return filteredWarningArr.length > 0 ? filteredWarningArr[0].messages.join(' ') : null;
    };

    handleShowFreeReturnsModal = () => {
        store.dispatch(Actions.showFreeReturnsModal({ isOpen: true }));
    };

    getPriceLine = () => {
        const { item } = this.props;
        const showTermsCopy = item.isReplenishment && item.sku.acceleratedPromotion;

        return item.sku.salePrice ? (
            <div>
                <Text
                    data-at={Sephora.debug.dataAt('item_price')}
                    fontWeight='normal'
                    css={{ textDecoration: 'line-through' }}
                >
                    {item.listPriceSubtotal}
                </Text>
                <Text
                    data-at={Sephora.debug.dataAt('item_sale_price')}
                    marginLeft={1}
                    color='red'
                >
                    {item.salePriceSubtotal}
                </Text>
            </div>
        ) : (
            <div data-at={Sephora.debug.dataAt('item_price')}>
                {item?.isReplenishment ? (
                    <Box is='span'>
                        <del children={item.listPriceSubtotal} />
                        <Text
                            color='red'
                            fontWeight='bold'
                            marginLeft={1}
                        >
                            {item.sku.replenishmentAdjusterPrice}
                            {showTermsCopy && '*'}
                        </Text>
                    </Box>
                ) : (
                    <span
                        css={{
                            whiteSpace: 'nowrap',
                            fontWeight: 'bold'
                        }}
                    >
                        {item.listPriceSubtotal}
                    </span>
                )}
            </div>
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/locales', 'OrderSummary');
        const getAutoReplenText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions'),
            true
        );
        const {
            item, isUS, isCanada, isPickupOrder, isReplacement, isReplacementSample, removeItem, basketType
        } = this.props;

        let hazmatWarningText, prop65WarningText, cbdWarningText;

        const warningMsgs = item.itemLevelMessages;

        if (warningMsgs && warningMsgs.length) {
            hazmatWarningText = this.getWarningTextByContext(warningMsgs, 'item.hazmatSku');
            prop65WarningText = this.getWarningTextByContext(warningMsgs, 'item.californiaRestricted');
            cbdWarningText = this.getWarningTextByContext(warningMsgs, 'item.stateRestricted');
        }

        const [frequencyType, frequencyNum] = (item?.isReplenishment && item?.replenishmentFrequency.split(':')) || [];
        const isSDUProduct = item.sku.type === 'SDU' && item.sku.trialEligible;

        const showItemSubstitution =
            (basketType === basketConstants.BasketType.SameDay || isPickupOrder) && Sephora.configurationSettings.isItemSubstitutionEnabled;

        const isMobile = Sephora.isMobile();

        return (
            <>
                <LegacyGrid
                    fontSize='sm'
                    data-at={Sephora.debug.dataAt('basket_item')}
                    lineHeight='tight'
                >
                    <LegacyGrid.Cell
                        width='fit'
                        marginRight={2}
                    >
                        <ProductImage
                            id={item.sku.skuId}
                            size={IMAGE_SIZES[62]}
                            skuImages={item.sku.skuImages}
                            disableLazyLoad={true}
                            data-at={Sephora.debug.dataAt('item_picture')}
                            altText={getImageAltText(item.sku)}
                        />
                        <Flex
                            color='midGray'
                            fontSize='md'
                            lineHeight='0'
                            marginTop={2}
                        >
                            {isUS && prop65WarningText && (
                                <Icon
                                    name='alert'
                                    marginRight='.5em'
                                    size='1em'
                                    title={prop65WarningText}
                                />
                            )}
                            {(isUS || isCanada) && cbdWarningText && (
                                <Icon
                                    name='alert'
                                    marginRight='.5em'
                                    size='1em'
                                    title={cbdWarningText}
                                />
                            )}
                        </Flex>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell
                        data-at={Sephora.debug.dataAt('item_data')}
                        width='fill'
                    >
                        {isSDUProduct ? (
                            <ProductSDU
                                price={item.sku.listPrice}
                                date={item.replenishmentPaymentDate}
                            />
                        ) : (
                            <Fragment>
                                <Box
                                    data-at={Sephora.debug.dataAt('item_brand_label')}
                                    fontWeight='bold'
                                >
                                    {item.sku.brandName}
                                </Box>
                                <Flex
                                    marginTop={2}
                                    justifyContent='space-between'
                                >
                                    {item.sku.productName}
                                    {isReplacementSample && this.getPriceLine()}
                                </Flex>
                                <SizeAndItemNumber
                                    sku={item.sku}
                                    marginTop={1}
                                    data-at={Sephora.debug.dataAt('item_size_label')}
                                    fontSize='xs'
                                />
                                <ProductVariation {...skuUtils.getProductVariations({ sku: item.sku })} />
                                {!isPickupOrder && item.sku.isOnlyFewLeft && <OnlyFewLeftFlag marginTop={2} />}
                                {hazmatWarningText && (
                                    <Tooltip content={hazmatWarningText}>
                                        <Link
                                            color='gray'
                                            fontSize='xs'
                                            lineHeight='tight'
                                            paddingTop={1}
                                        >
                                            {getText('shippingRestrictions')}
                                            <InfoButton
                                                marginLeft={-1}
                                                size={13}
                                            />
                                        </Link>
                                    </Tooltip>
                                )}
                                {item?.isReplenishment && (
                                    <>
                                        <Text
                                            is='p'
                                            data-at={Sephora.debug.dataAt('replenish_frequency_checkout')}
                                            display='block'
                                            paddingTop={2}
                                        >
                                            {getAutoReplenText('deliveryEvery')}
                                            {': '}
                                            <strong>
                                                {frequencyNum} {formatFrequencyType(frequencyNum, frequencyType)}
                                            </strong>
                                        </Text>
                                        {item?.sku?.acceleratedPromotion && (
                                            <Flex flexDirection='column'>
                                                <Text css={styles.termsConditionsText}>
                                                    {getAutoReplenText(
                                                        'autoReplenishCheckoutTermsConditions1',
                                                        false,
                                                        item.sku.acceleratedPromotion.childOrderCount,
                                                        item.sku.acceleratedPromotion.promotionDuration
                                                    )}
                                                </Text>
                                                <Text css={styles.termsConditionsText}>
                                                    {getAutoReplenText(
                                                        'autoReplenishCheckoutTermsConditions2',
                                                        false,
                                                        item.sku.acceleratedPromotion.childOrderCount,
                                                        Math.ceil(item.sku.acceleratedPromotion.baseReplenishmentAdjuster)
                                                    )}
                                                </Text>
                                                <Text css={styles.termsConditionsText}>
                                                    {getAutoReplenText('autoReplenishCheckoutTermsConditions3')}
                                                </Text>
                                            </Flex>
                                        )}
                                    </>
                                )}
                                <FinalSaleItem isReturnable={item.sku.isReturnable} />
                                {item.sku.isReturnable && isMobile && (
                                    <Flex marginTop={2}>
                                        <Link
                                            color='blue'
                                            underline={true}
                                            onClick={this.handleShowFreeReturnsModal}
                                        >
                                            {getText('freeReturns')}
                                        </Link>
                                        <Text is='p'> {getText('onAllPurchases')}</Text>
                                    </Flex>
                                )}
                                <Flex css={styles.flexItem}>
                                    {!isReplacementSample ? (
                                        <Text
                                            fontWeight='bold'
                                            data-at={Sephora.debug.dataAt('qty_label')}
                                        >
                                            {getText('qty')}: {item.qty}
                                        </Text>
                                    ) : (
                                        <Link
                                            color='blue'
                                            fontWeight='normal'
                                            onClick={e => removeItem(e, item.sku)}
                                            children={getText('removeText')}
                                        />
                                    )}
                                    {!isReplacement && this.getPriceLine()}
                                </Flex>
                            </Fragment>
                        )}
                    </LegacyGrid.Cell>
                </LegacyGrid>
                {showItemSubstitution && <SubstituteItem item={item.substituteSku} />}
            </>
        );
    }
}

const styles = {
    termsConditionsText: {
        marginTop: space[4],
        fontSize: 'sm',
        color: 'gray'
    },
    flexItem: {
        justifyContent: 'space-between',
        marginTop: 2,
        [mediaQueries.sm]: {
            marginTop: 1
        }
    }
};

export default wrapComponent(ItemsInOrder, 'ItemsInOrder');
