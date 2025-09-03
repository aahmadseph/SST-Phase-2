import React from 'react';
import PropTypes from 'prop-types';
import {
    fontSizes, lineHeights, mediaQueries, space
} from 'style/config';
import {
    Flex, Box, Text, Divider, Button
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import StarRating from 'components/StarRating/StarRating';
import ReviewCount from 'components/Product/ReviewCount/ReviewCount';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import urlUtils from 'utils/Url';
import helpersUtils from 'utils/Helpers';
import processEvent from 'analytics/processEvent';
const { deferTaskExecution } = helpersUtils;

/* eslint-disable-next-line complexity */
const ProductTableItem = ({ sku, index, podId, isCarousel }) => {
    const displayHighlights = highlights => (highlights?.length ? highlights.join(', ').replace(' ,', ',') : '');
    const renderLeftColumn = title => <Text fontWeight='bold'>{title || ''}</Text>;

    const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ProductTable/ProductTableItem/locales', 'ProductTableItem');

    const componentTitle = anaConsts.PAGE_TYPES.COMPARE_SIMILAR_PRODUCTS;

    const trackProductClickAnalytics = () => {
        const internalCampaign = `${componentTitle?.toLowerCase()}:${sku?.productId?.toLowerCase()}:product`;

        const nextPageData = {
            recInfo: {
                isExternalRec: !!podId,
                componentTitle,
                podId
            },
            linkData: `${internalCampaign} ${index - 1}`,
            internalCampaign,
            ...(isCarousel && { eventStrings: [anaConsts.Event.EVENT_269] })
        };

        anaUtils.setNextPageData(nextPageData);

        // Dispatches the Select Item Event
        processEvent.process(anaConsts.SELECT_ITEM_EVENT, {
            data: {
                listName: componentTitle?.toLowerCase() || '',
                listId: '',
                productId: sku?.productId?.toLowerCase() || '',
                price: sku?.listPrice || '',
                brandName: sku?.brandName || '',
                productName: sku?.productName || '',
                productIndex: index || 0
            }
        });
    };

    const handleProductClick = e => {
        e.preventDefault();

        deferTaskExecution(() => {
            trackProductClickAnalytics();
        });

        Location.navigateTo(e, sku.targetUrl);
    };

    const divider = (
        <Divider
            marginLeft={index > 0 && -4}
            marginRight={-4}
        />
    );

    const targetUrl = urlUtils.getLink(sku?.targetUrl);
    const valuePrice = sku?.valuePrice
        ? sku.valuePrice
            .toLowerCase()
            .replace(getText('value'), '')
            .replace(/[\(\)]+/g, '')
            .trim()
        : null;

    return (
        <Box
            backgroundColor={index === 1 && 'nearWhite'}
            borderLeftWidth={index > 1 && 1}
            borderColor={index > 1 && 'divider'}
            paddingTop={4}
            paddingLeft={index > 0 && 4}
            paddingRight={4}
            {...(sku?.strategyId && {
                'data-cnstrc-item-id': sku?.productId,
                'data-cnstrc-item-name': sku?.productName,
                'data-cnstrc-item-variation-id': sku?.variationId,
                'data-cnstrc-strategy-id': sku?.strategyId,
                'data-cnstrc-item-price': sku?.salePrice || sku?.listPrice
            })}
        >
            <div css={styles.cellTop}>
                {sku && (
                    <>
                        <Box
                            position='relative'
                            marginBottom={4}
                            {...(index > 1 && {
                                ['aria-label']: `${sku.brandName} ${sku.productName}`,
                                href: targetUrl,
                                onClick: handleProductClick,
                                css: styles.ql
                            })}
                        >
                            {sku.skuId && (
                                <ProductImage
                                    id={sku.skuId}
                                    skuImages={sku.skuImages}
                                    size={160}
                                />
                            )}
                            {index > 1 && (
                                <div className='ProductTableItem-ql'>
                                    <ProductQuicklook
                                        isShown={true}
                                        showQuickLookOnMobile={true}
                                        rootContainerName={componentTitle}
                                        productStringContainerName={componentTitle}
                                        sku={sku}
                                        podId={podId}
                                        isCarousel={isCarousel}
                                    />
                                </div>
                            )}
                        </Box>
                        <Text
                            display='block'
                            fontSize={['xs', 'sm']}
                            marginBottom='.125em'
                            fontWeight='bold'
                            numberOfLines={1}
                            children={sku.brandName}
                        />
                        <Text
                            display='block'
                            numberOfLines={2}
                            children={sku.productName}
                        />
                        {index > 1 && (
                            <Button
                                block={true}
                                size='sm'
                                marginTop='auto'
                                variant='secondary'
                                onClick={handleProductClick}
                                href={targetUrl}
                                children={getText('seeDetails')}
                            />
                        )}
                    </>
                )}
            </div>
            <div css={[styles.cell, styles.cellPrice]}>
                {index === 0 ? (
                    renderLeftColumn(getText('productPrice'))
                ) : (
                    <>
                        <Text fontWeight='bold'>
                            {sku.salePrice && (
                                <>
                                    <Text
                                        color='red'
                                        children={sku.salePrice}
                                    />{' '}
                                </>
                            )}
                            <span
                                css={sku.salePrice && styles.priceList}
                                children={sku.listPrice}
                            />
                        </Text>
                        {valuePrice && <Text is='p'>{`(${valuePrice} ${getText('value')})`}</Text>}
                    </>
                )}
            </div>
            {divider}
            {!podId && (
                <>
                    <div css={styles.cell}>
                        <Text
                            display='block'
                            numberOfLines={2}
                        >
                            {index === 0 ? renderLeftColumn(getText('fillSize')) : sku.sku_size || sku.size}
                        </Text>
                    </div>
                    {divider}
                </>
            )}
            <div css={styles.cell}>
                {index === 0
                    ? renderLeftColumn(getText('rating'))
                    : sku && (
                        <Flex
                            alignItems='center'
                            lineHeight='none'
                        >
                            <StarRating
                                size={12}
                                rating={sku.starRatings}
                            />
                            <ReviewCount
                                css={styles.reviewCount}
                                productReviewCount={sku.productReviewCount}
                            />
                        </Flex>
                    )}
            </div>
            {divider}
            <div css={styles.cell}>
                {index === 0 ? renderLeftColumn(getText('ingredientHighlights')) : sku.highlights && displayHighlights(sku.highlights)}
            </div>
        </Box>
    );
};

const styles = {
    cellTop: {
        display: 'flex',
        flexDirection: 'column',
        height: 268,
        [mediaQueries.sm]: {
            height: 274
        }
    },
    cell: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: space[2],
        paddingBottom: space[2],
        minHeight: fontSizes.sm * lineHeights.tight * 2 + space[2] * 2,
        [mediaQueries.sm]: {
            minHeight: fontSizes.base * lineHeights.tight * 2 + space[2] * 2
        }
    },
    ql: {
        '& .ProductTableItem-ql': {
            opacity: 0,
            transition: 'opacity .2s',
            [mediaQueries.xsMax]: {
                display: 'none'
            }
        },
        '.no-touch &:hover, :focus, :focus-within': {
            '& .ProductTableItem-ql': {
                opacity: 1
            }
        }
    },
    priceList: {
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    reviewCount: {
        fontSize: fontSizes.sm,
        marginLeft: '.375em',
        position: 'relative',
        top: '.0625em'
    }
};

ProductTableItem.propTypes = {
    sku: PropTypes.object
};

export default wrapFunctionalComponent(ProductTableItem, 'ProductTableItem');
