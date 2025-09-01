import BaseClass from 'components/BaseClass';
import propTypes from 'prop-types';
import React from 'react';
import {
    Box, Flex, Link, Text, Grid
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { getImageAltText } from 'utils/Accessibility';

const CheckoutItem = ({ product }) => (
    <Box css={styles.box}>
        <ProductImage
            id={product.sku.skuId}
            disableLazyLoad
            skuImages={product.sku.skuImages}
            size={48}
            data-at={Sephora.debug.dataAt('item_picture')}
            altText={getImageAltText(product.sku)}
        />

        {product.qty > 1 && (
            <div css={styles.quantityContainer}>
                <span>{product.qty}</span>
            </div>
        )}
    </Box>
);

export class CheckoutItemsList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            visiblesList: this.getVisibleItemsList(this.props)
        };
    }

    getVisibleItemsList = props => {
        // For Split EDD, we display all the items and
        // never show the "See all items" link.
        if (props.isSplitEDDVariant) {
            return props.items;
        }

        return props.items.length > props.itemsVisibles ? props.items.slice(0, props.itemsVisibles - 1) : props.items;
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            visiblesList: this.getVisibleItemsList(nextProps)
        });
    }

    render() {
        const {
            items, itemsVisibles, basketType, itemsCount, title, isSplitEDDVariant
        } = this.props;
        const { visiblesList } = this.state;
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/locales', 'OrderSummary');
        const linkVisible = visiblesList.length < this.props.items.length;
        const isMobile = Sephora.isMobile();
        const showTitle = !isSplitEDDVariant;

        return (
            <Box>
                {showTitle && (
                    <Flex
                        paddingBottom={10}
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Text
                            is='span'
                            fontWeight='bold'
                            css={[title && styles.capitalize]}
                        >
                            {title ? (
                                <>
                                    {title} {getText('items')}
                                </>
                            ) : (
                                <>{getText(basketType)}</>
                            )}{' '}
                            ({itemsCount})
                        </Text>
                    </Flex>
                )}
                <Grid
                    columns={`repeat(${isSplitEDDVariant ? 'auto-fit' : itemsVisibles}, 48px)`}
                    columnGap={isSplitEDDVariant ? 4 : 1}
                    rowGap={isSplitEDDVariant ? 4 : 10}
                    gap={null}
                >
                    {visiblesList.map(product => (
                        <CheckoutItem
                            key={product.sku.skuId}
                            product={product}
                        />
                    ))}
                    {linkVisible && (
                        <Link
                            display='flex'
                            alignItems='center'
                            lineHeight='14px'
                            width={isMobile ? '56px' : '53px'}
                            marginLeft={[isMobile ? 4 : '6px']}
                            paddingLeft={[isMobile ? 2 : '6px']}
                            fontSize={['sm']}
                            textAlign='center'
                            flexShrink={0}
                            css={{ borderLeft: '1px solid #EEEEEE' }}
                            onClick={() => this.setState({ visiblesList: items })}
                        >
                            {getText('seeAll')}
                            <br />
                            {itemsCount} {getText('items')}
                        </Link>
                    )}
                </Grid>
            </Box>
        );
    }
}

const styles = {
    quantityContainer: {
        width: 22,
        height: 22,
        background: 'white',
        border: '1px solid #EEEEEE',
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
        flex: 'none'
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
    itemsVisibles: propTypes.number,
    title: propTypes.string,
    isSplitEDDVariant: propTypes.bool
};

CheckoutItemsList.defaultProps = {
    isSplitEDDVariant: false
};

export default wrapComponent(CheckoutItemsList, 'CheckoutItemsList', true);
