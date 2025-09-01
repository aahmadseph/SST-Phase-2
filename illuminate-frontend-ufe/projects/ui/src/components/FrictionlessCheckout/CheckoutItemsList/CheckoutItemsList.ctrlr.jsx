import BaseClass from 'components/BaseClass';
import propTypes from 'prop-types';
import React from 'react';
import {
    Box, Flex, Text, Grid, Link, Divider
} from 'components/ui';
import { colors, space } from 'style/config';
import { wrapComponent } from 'utils/framework';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { getImageAltText } from 'utils/Accessibility';
import Modal from 'components/Modal/Modal';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';

const SMUI_LIMIT = 5;
const LGUI_LIMIT = 14;

const SM_IMG_SIZE = 64;

const CheckoutItem = ({ product }) => (
    <Box css={styles.box}>
        <ProductImage
            id={product.sku.skuId}
            disableLazyLoad
            skuImages={product.sku.skuImages}
            size={48}
            data-at={Sephora.debug.dataAt('item_picture')}
            altText={getImageAltText(product.sku)}
            showPlaceholderOnError
        />

        {product.qty > 1 && (
            <div css={styles.quantityContainer}>
                <span>{product.qty}</span>
            </div>
        )}
    </Box>
);

const SubstitutionModalItem = ({
    product: {
        sku, qty, listPriceSubtotal, itemEligibleForSubstitute, substituteSku
    }, locales
}) => (
    <Box key={`substitutionModal_${sku.skuId}`}>
        <Divider
            marginTop={4}
            marginBottom={4}
        />
        <Grid
            gridTemplateColumns='auto 1fr'
            gap={4}
            width='100%'
        >
            <ProductImage
                id={sku.skuId}
                size={[SM_IMG_SIZE, 87]}
                skuImages={sku.skuImages}
                disableLazyLoad={true}
                altText={getImageAltText(sku)}
            />
            <Box
                paddingLeft={1}
                width='100%'
            >
                <Text
                    is='p'
                    children={sku.brandName}
                    fontSize='sm'
                    fontWeight='bold'
                />
                <Text
                    is='p'
                    fontSize='sm'
                    children={sku.productName}
                />
                <Text
                    is='p'
                    fontSize='sm'
                    color={colors.gray}
                >
                    {`${locales.size}: ${sku.size}`}
                    <span css={styles.dot}></span>
                    {`${locales.item.toUpperCase()}: ${sku.skuId}`}
                </Text>
                {sku.variationType && sku.variationType !== 'None' && sku.variationType !== 'Size' && (
                    <Text
                        is='p'
                        fontSize='sm'
                        children={`${sku.variationTypeDisplayName.toUpperCase()}: ${sku.variationValue}`}
                    />
                )}
                <Flex
                    marginTop={2}
                    justifyContent='space-between'
                >
                    <Text
                        children={`Qty: ${qty}`}
                        fontSize='sm'
                        fontWeight='bold'
                    />
                    <Flex gap={1}>
                        <Text
                            children={listPriceSubtotal}
                            css={styles.subTotalText}
                            is='p'
                            fontSize='sm'
                            fontWeight='bold'
                        />
                    </Flex>
                </Flex>
            </Box>
        </Grid>

        {itemEligibleForSubstitute && (
            <SubstitutionModalReplaceItemWith
                sku={substituteSku}
                locales={locales}
            />
        )}
    </Box>
);

const SubstitutionModalReplaceItemWith = ({ sku, locales }) => (
    <Box
        width='100%'
        backgroundColor={colors.nearWhite}
        p={2}
        borderRadius={6}
        mt={3}
    >
        {sku ? (
            <Grid
                gridTemplateColumns='auto 1fr'
                gap={2}
            >
                <ProductImage
                    id={sku.skuId}
                    size={36}
                    skuImages={sku.skuImages}
                    disableLazyLoad={true}
                    altText={getImageAltText(sku)}
                />

                <Box>
                    <Text
                        is='p'
                        fontSize='sm'
                    >
                        <Text fontWeight='bold'>{locales.substituteWith}</Text> {sku.brandName} {sku.productName}
                    </Text>

                    <Text
                        is='p'
                        fontSize='sm'
                        color={colors.gray}
                    >
                        <Text fontWeight='bold'>{sku.listPrice}</Text>
                        <span css={styles.dot}></span>
                        {`${locales.size}: ${sku.size}`}
                        {sku.variationType && sku.variationType !== 'None' && sku.variationType !== 'Size' ? (
                            <>
                                <span css={styles.dot}></span>
                                {sku.variationTypeDisplayName}: {sku.variationValue}
                            </>
                        ) : (
                            ''
                        )}
                    </Text>
                </Box>
            </Grid>
        ) : (
            <Text
                is='p'
                fontSize='sm'
                fontWeight='bold'
                children={locales.doNotsubstitute}
            />
        )}
    </Box>
);

export class CheckoutItemsList extends BaseClass {
    state = {
        showItemSubstitutionModal: false
    };

    calculateGridWidth = LIMIT => {
        const { listCount } = this.props;

        return `calc(48px * ${listCount > LIMIT ? `${LIMIT} + ${LIMIT - 1}` : `${listCount} + ${listCount - 1}`} * 8px)`;
    };

    toggleItemSubstitutionModal = () => {
        this.setState({ showItemSubstitutionModal: !this.state.showItemSubstitutionModal });
    };

    handleSubstitueModalClick = () => {
        FrictionlessCheckoutBindings.setSubstitueModalClickAnalytics();
        this.toggleItemSubstitutionModal();
    };

    render() {
        const {
            items, title, hasItemsSustitutions, shouldDisplayTitle = true, giftCardsOnly, itemsCount, locales, isDeliveryVisible
        } = this.props;

        return (
            <Box>
                {shouldDisplayTitle && (
                    <Flex
                        paddingBottom={2}
                        justifyContent='space-between'
                        alignItems='center'
                        marginTop={isDeliveryVisible && 3}
                    >
                        <Text
                            is='span'
                            fontWeight='bold'
                            css={[title && styles.capitalize]}
                        >
                            {title}
                        </Text>
                    </Flex>
                )}
                <Grid
                    columns={'repeat(auto-fit, minmax(48px, 1fr))'}
                    columnGap={2}
                    rowGap={giftCardsOnly ? 1 : 3}
                    gap={null}
                    maxWidth={[this.calculateGridWidth(SMUI_LIMIT), this.calculateGridWidth(LGUI_LIMIT)]}
                    justifyItems={giftCardsOnly ? 'unset' : 'center'}
                >
                    {items.map(product => (
                        <>
                            <CheckoutItem
                                key={product.sku.skuId}
                                product={product}
                            />
                            {giftCardsOnly && (
                                <Text
                                    is='p'
                                    children={product.sku.variationValue}
                                />
                            )}
                        </>
                    ))}
                </Grid>

                {hasItemsSustitutions && (
                    <Link
                        marginTop='13px'
                        color='blue'
                        onClick={this.handleSubstitueModalClick}
                        children={locales.substitution}
                    />
                )}

                <Modal
                    isDrawer={true}
                    isOpen={this.state.showItemSubstitutionModal}
                    onDismiss={this.toggleItemSubstitutionModal}
                >
                    <Modal.Header>
                        <Modal.Title>{locales.substitution}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Box>
                            <Text fontWeight='bold'>{`${locales.itemsInOrder} (${itemsCount})`}</Text>

                            {items.map(product => (
                                <SubstitutionModalItem
                                    product={product}
                                    locales={locales}
                                />
                            ))}
                        </Box>
                    </Modal.Body>
                </Modal>
            </Box>
        );
    }
}

const styles = {
    dot: {
        '::after': {
            content: '"\u00B7"'
        },
        marginLeft: space[1],
        marginRight: space[1],
        fontWeight: 'bold'
    },
    quantityContainer: {
        width: 20,
        height: 20,
        background: 'white',
        border: '1px solid #000',
        position: 'absolute',
        borderRadius: 22,
        bottom: 0,
        right: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11
    },
    box: {
        position: 'relative',
        flex: 'none',
        width: 48
    },
    productsContainer: {
        gap: 4
    },
    capitalize: {
        textTransform: 'capitalize'
    }
};

CheckoutItemsList.propTypes = {
    items: propTypes.array.isRequired,
    basketType: propTypes.string.isRequired,
    itemsCount: propTypes.number.isRequired,
    experience: propTypes.string,
    itemsVisibles: propTypes.number,
    title: propTypes.string
};

CheckoutItemsList.defaultProps = {
    items: [],
    itemsVisibles: 5
};

export default wrapComponent(CheckoutItemsList, 'CheckoutItemsList');
