/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    Box, Icon, Grid, Flex
} from 'components/ui';
import Select from 'components/Inputs/Select/Select';
import ChangeMethodModal from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodModal';

import {
    colors, screenReaderOnlyStyle, forms, radii
} from 'style/config';

import mediaUtils from 'utils/Media';
import skuUtils from 'utils/Sku';
import isFunction from 'utils/functions/isFunction';
import localeUtils from 'utils/LanguageLocale';
import { lineItem } from 'utils/LineItem';
import CartItemStepper from 'components/RwdBasket/Carts/CartLayout/SkuItem/CartItemStepper/CartItemStepper';

const { Media } = mediaUtils;
const { getLocaleResourceFile } = localeUtils;

function SkuQty({
    sku, commerceId, qty, isOutOfStock, quantities, disabled = false, fetching, onChange
}) {
    const id = 'qty_' + sku.skuId;
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');

    return (
        <>
            <label
                htmlFor={id}
                children={getText('qty')}
                css={screenReaderOnlyStyle}
            />
            <Select
                id={id}
                size={'xs'}
                value={qty}
                disabled={disabled || isOutOfStock}
                onChange={e => onChange({ commerceId, newQty: e.target.value, sku })}
                marginBottom={null}
                textIndent={'0px'}
                customStyle={{
                    input: {
                        width: '44px',
                        borderRadius: radii.full,
                        ...(disabled && {
                            borderColor: forms.DISABLED_BG,
                            borderOpacity: forms.DISABLED_OPACITY
                        }),
                        ...(fetching && {
                            pointerEvents: 'none'
                        })
                    }
                }}
                data-at={Sephora.debug.dataAt('sku_qty')}
            >
                {quantities.concat(isOutOfStock ? [lineItem.OOS_QTY] : []).map((option, index) => (
                    <option
                        css={{ color: forms.COLOR }}
                        key={index.toString()}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </Select>
        </>
    );
}

function SkuDelete({
    onChange, sku, productId, fetching, qty
}) {
    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            width={'24px'}
            height={'24px'}
            borderRadius={radii.full}
            border={`1px solid ${colors.midGray}`}
            cursor={fetching ? 'initial' : 'pointer'}
            onClick={!fetching ? () => onChange({ sku, productId, qty }) : null}
            data-at={Sephora.debug.dataAt('bsk_sku_remove')}
        >
            <Box
                width={12}
                height={12}
            >
                <Icon
                    name={'trash'}
                    color={'gray'}
                    size={24}
                />
            </Box>
        </Flex>
    );
}

function SkuLoves({
    item, skuId, productId, loved, fetching, onChange
}) {
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');

    return (
        <Box
            paddingX={2}
            paddingY={'5px'}
            borderRadius={radii.full}
            width={!loved && ['98px', 'auto']}
            border={`1px solid ${loved ? colors.lightGray : colors.midGray}`}
            backgroundColor={loved ? colors.lightGray : undefined}
            textAlign='center'
            onClick={!loved && !fetching ? () => onChange({ item, skuId, productId }) : null}
            css={{ cursor: loved || fetching ? 'initial' : 'pointer', wordWrap: 'break-word' }}
            data-at={Sephora.debug.dataAt('bsk_sku_love')}
        >
            {getText(loved ? 'loved' : 'moveToLoves')}
        </Box>
    );
}

function ChangeMethod({
    label, onClick, fetching, onChangeMethod, isDisabled
}) {
    const disabled = fetching || !isFunction(onChangeMethod) || isDisabled;

    return (
        <Box
            minHeight={'24px'}
            paddingX={2}
            paddingY={'5px'}
            borderRadius={radii.full}
            color={disabled ? colors.gray : undefined}
            border={`1px solid ${disabled ? colors.lightGray : colors.midGray}`}
            backgroundColor={disabled ? colors.lightGray : undefined}
            textAlign='center'
            onClick={!disabled ? onClick : null}
        >
            {label}
        </Box>
    );
}

class ButtonRow extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            requestInTransit: false,
            showChangeMethodModal: false
        };
    }

    setRequestInTransit = requestInTransit => this.setState({ requestInTransit });

    onChange = cb => arg => {
        this.setRequestInTransit(true);

        cb(arg).finally(() => this.setRequestInTransit(false));
    };

    setShowChangeMethodModal = showChangeMethodModal => this.setState({ showChangeMethodModal });

    showChangeMethodModal = () => this.setShowChangeMethodModal(true);

    closeChangeMethodModal = () => this.setShowChangeMethodModal(false);

    render() {
        const {
            item,
            isOutOfStock,
            onQtyUpdate,
            onDelete,
            onLoved,
            onChangeMethod,
            changeMethodLabel,
            breakpoint,
            itemDeliveryMethod,
            preferredStoreInfo,
            preferredZipCode,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedInBIUser,
            isRewardFulfillmentVariant,
            isDisabled,
            showQuantityPickerBasket
        } = this.props;

        const { commerceId, qty, sku } = item;

        return (
            <>
                {this.state.showChangeMethodModal && (
                    <ChangeMethodModal
                        isOpen={this.state.showChangeMethodModal}
                        closeChangeMethodModal={this.closeChangeMethodModal}
                        item={this.props.item}
                        onChangeMethod={onChangeMethod}
                        itemDeliveryMethod={itemDeliveryMethod}
                        preferredStoreInfo={preferredStoreInfo}
                        preferredZipCode={preferredZipCode}
                        userId={userId}
                        hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                        isSignedInBIUser={isSignedInBIUser}
                        isRewardFulfillmentVariant={isRewardFulfillmentVariant}
                    />
                )}
                <Media {...breakpoint}>
                    <Flex
                        justifyContent={'space-between'}
                        marginTop={4}
                        minHeight={24}
                        fontSize={'sm'}
                    >
                        {showQuantityPickerBasket ? (
                            <CartItemStepper
                                quantities={skuUtils.purchasableQuantities(sku)}
                                sku={sku}
                                commerceId={commerceId}
                                isOutOfStock={isOutOfStock}
                                onChange={this.onChange(onQtyUpdate)}
                                qty={qty}
                                fetching={this.state.requestInTransit}
                                disabled={isOutOfStock || !isFunction(onQtyUpdate)}
                                productId={sku.productId}
                                onDelete={this.onChange(onDelete)}
                            />
                        ) : (
                            <Grid
                                columns={'auto auto'}
                                gap={'6px'}
                                justifyItems='end'
                            >
                                <SkuQty
                                    quantities={skuUtils.purchasableQuantities(sku)}
                                    sku={sku}
                                    commerceId={commerceId}
                                    isOutOfStock={isOutOfStock}
                                    onChange={this.onChange(onQtyUpdate)}
                                    qty={qty}
                                    fetching={this.state.requestInTransit}
                                    disabled={isOutOfStock || !isFunction(onQtyUpdate)}
                                />
                                {(sku.type.toLowerCase() !== skuUtils.skuTypes.GWP.toLowerCase() || Sephora.isAgent) && (
                                    <SkuDelete
                                        sku={sku}
                                        qty={qty}
                                        productId={sku.productId}
                                        fetching={this.state.requestInTransit}
                                        onChange={this.onChange(onDelete)}
                                    />
                                )}
                            </Grid>
                        )}
                        <Grid
                            columns={'auto auto'}
                            gap={['6px', '6px', '6px', '0px']}
                            paddingLeft={'6px'}
                        >
                            {isFunction(onLoved) && !skuUtils.isBiReward(sku) && (
                                <SkuLoves
                                    order={[1, 2]}
                                    loved={sku.actionFlags.myListStatus === 'added'}
                                    skuId={sku.skuId}
                                    item={item}
                                    productId={sku.productId}
                                    fetching={this.state.requestInTransit}
                                    onChange={this.onChange(onLoved)}
                                />
                            )}
                            <Media lessThan={'sm'}>
                                <ChangeMethod
                                    label={changeMethodLabel}
                                    fetching={this.state.requestInTransit}
                                    onClick={this.showChangeMethodModal}
                                    onChangeMethod={onChangeMethod}
                                    isDisabled={isDisabled}
                                />
                            </Media>
                        </Grid>
                    </Flex>
                </Media>
            </>
        );
    }
}

export default wrapComponent(ButtonRow, 'ButtonRow');
