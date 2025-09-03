/* eslint-disable class-methods-use-this */
import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Text, Grid, Button, Divider, Link
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage';
import StarRating from 'components/StarRating/StarRating';
import NumberUtils from 'utils/Number';
import UrlUtils from 'utils/Url';
import skuUtils from 'utils/Sku';
import marketingFlagsUtil from 'utils/MarketingFlags';
import Flag from 'components/Flag';

const { wrapComponent } = FrameworkUtils;
const { formatReviewCount } = NumberUtils;
const { getLink, isValidImageUrl } = UrlUtils;

class BuyItem extends BaseClass {
    state = {
        showMoreQuote: false,
        showMoreDesc: false,
        hasQuoteOverflow: false,
        hasDescOverflow: false
    };

    quoteRef = React.createRef();
    descRef = React.createRef();

    componentDidMount() {
        const quote = this.quoteRef.current;
        const desc = this.descRef.current;
        this.setState({
            hasQuoteOverflow: !!(quote && quote.scrollHeight > quote.offsetHeight),
            hasDescOverflow: !!(desc && desc.scrollHeight > desc.offsetHeight)
        });
    }

    getAnalyticLinks = (handleSpaLink, url, index, type) => {
        const targetUrl = getLink(url, [`seop_${index + 1}_${type}`]);

        return {
            href: targetUrl,
            onClick: e => handleSpaLink(e, targetUrl)
        };
    };

    handleShowMoreQuoteClick = () => {
        this.setState(prevState => ({
            showMoreQuote: !prevState.showMoreQuote
        }));
    };

    handleShowMoreDescClick = () => {
        this.setState(prevState => ({
            showMoreDesc: !prevState.showMoreDesc
        }));
    };
    /* eslint-disable-next-line complexity */
    render() {
        const { showMoreQuote, showMoreDesc } = this.state;
        const {
            content, sku, handleSpaLink, disableLazyLoad, index, text = {}
        } = this.props;

        const { primaryProduct } = sku;

        const url = sku.fullSiteProductUrl;

        const reviewCount = primaryProduct.reviews || 0;
        const marketingFlags = marketingFlagsUtil.getProductTileFlags(sku);

        const hasVariation = Boolean(sku.variationValue && sku.variationType && sku.variationType !== skuUtils.skuVariationType.NONE);

        const skuImageUrl = content?.imageUrl && isValidImageUrl(content.imageUrl) ? new URL(content.imageUrl) : null;

        return (
            <>
                <Grid
                    columns={['1fr auto', 'min(25%, 240px) 1fr auto']}
                    columnGap={[4, null, 5]}
                    rowGap={0}
                    gridTemplateRows='auto auto 1fr'
                    lineHeight='tight'
                    alignItems='start'
                >
                    <Box
                        {...this.getAnalyticLinks(handleSpaLink, url, index, 'img')}
                        position='relative'
                        gridColumn={['1 / 3', '1 / 1']}
                        gridRow={[null, '1 / 4']}
                        marginBottom={[4, 0]}
                    >
                        <ProductImage
                            {...(skuImageUrl
                                ? {
                                    src: skuImageUrl.pathname
                                }
                                : {
                                    id: sku.skuId
                                })}
                            skuImages={sku.skuImages}
                            size={240}
                            marginX='auto'
                            disableLazyLoad={disableLazyLoad}
                        />
                        <Grid
                            gap={1}
                            justifyItems='start'
                            css={{
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        >
                            {marketingFlags.map((flag, key) => (
                                <Flag
                                    key={key}
                                    children={flag}
                                />
                            ))}
                        </Grid>
                    </Box>
                    <Box
                        gridColumn={['1 / 2', '2 / 3']}
                        gridRow={[null, '1 / 3']}
                    >
                        <Box
                            {...this.getAnalyticLinks(handleSpaLink, url, index, 'title')}
                            css={{
                                '.no-touch &:hover .ProductName': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            <Text
                                is='h3'
                                fontWeight='bold'
                                fontSize='md'
                            >
                                <Text
                                    children={primaryProduct.brand?.displayName}
                                    display='block'
                                    css={{ textTransform: 'uppercase' }}
                                />
                                <span
                                    className='ProductName'
                                    children={primaryProduct.displayName}
                                />
                            </Text>
                        </Box>
                        <Text
                            is='p'
                            color='gray'
                            fontSize='sm'
                            marginTop={1}
                        >
                            {sku.size && sku.variationType !== skuUtils.skuVariationType.SIZE && (
                                <>
                                    {`${text.size}: ${sku.size}`}
                                    <Text
                                        children='·'
                                        marginX='.5em'
                                    />
                                </>
                            )}
                            {text.item}: {sku.skuId}
                        </Text>
                        {hasVariation && (
                            <Text
                                is='p'
                                marginTop={3}
                            >
                                <Text marginRight={2}>
                                    {sku.variationTypeDisplayName && `${sku.variationTypeDisplayName}: `}
                                    {sku.variationValue}
                                    {sku.variationDesc && ` - ${sku.variationDesc}`}
                                </Text>
                                {primaryProduct.moreColors > 0 && (
                                    <Text
                                        color='gray'
                                        children={`[ ${primaryProduct.moreColors} ${text.moreColors} ]`}
                                    />
                                )}
                            </Text>
                        )}
                        <Text
                            is='p'
                            display='flex'
                            marginTop={4}
                        >
                            <Link
                                {...this.getAnalyticLinks(handleSpaLink, url, index, 'reviews')}
                                display='inline-flex'
                                alignItems='center'
                            >
                                <StarRating
                                    rating={primaryProduct.rating || 0}
                                    size={17}
                                />
                                <Text
                                    marginLeft='.5em'
                                    fontWeight='bold'
                                >
                                    {formatReviewCount(reviewCount)} {`${text.review}${reviewCount !== 1 ? 's' : ''}`}
                                </Text>
                            </Link>
                        </Text>
                    </Box>
                    <Text
                        children={sku.listPrice}
                        is='p'
                        fontWeight='bold'
                        fontSize='md'
                        textAlign='right'
                    />
                    <Box
                        gridColumn={['1 / 3', '3 / 4']}
                        order={[1, 0]}
                        marginTop={[5, 0]}
                    >
                        <Button
                            {...this.getAnalyticLinks(handleSpaLink, url, index, 'buynow')}
                            children={text.buyNow}
                            variant='special'
                            minWidth='10.25em'
                            width={['100%', 'auto']}
                        />
                    </Box>
                    <Grid
                        gap={4}
                        gridColumn={['1 / 3', '2 / 4']}
                        gridRow='3 / 4'
                        marginTop={4}
                        lineHeight='base'
                    >
                        {content?.compositeQuote && (
                            <div>
                                <Text
                                    ref={this.quoteRef}
                                    is='p'
                                    numberOfLines={showMoreQuote ? null : 3}
                                    css={{
                                        whiteSpace: 'normal',
                                        '& strong': { fontWeight: 'inherit' }
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: content.compositeQuote
                                    }}
                                />
                                {this.state.hasQuoteOverflow && (
                                    <Link
                                        color='blue'
                                        fontSize='sm'
                                        padding={1}
                                        margin={-1}
                                        onClick={this.handleShowMoreQuoteClick}
                                        arrowDirection={showMoreQuote ? 'up' : 'down'}
                                        children={showMoreQuote ? text.less : text.more}
                                    />
                                )}
                            </div>
                        )}
                        {primaryProduct.shortDescription && (
                            <>
                                <Text
                                    ref={this.descRef}
                                    is='p'
                                    fontSize='sm'
                                    numberOfLines={showMoreDesc ? null : 3}
                                    css={{ whiteSpace: 'normal' }}
                                    dangerouslySetInnerHTML={{
                                        __html: primaryProduct.shortDescription
                                    }}
                                />
                                {this.state.hasDescOverflow && (
                                    <Link
                                        color='blue'
                                        fontSize='sm'
                                        padding={1}
                                        margin={-1}
                                        onClick={this.handleShowMoreDescClick}
                                        arrowDirection={showMoreDesc ? 'up' : 'down'}
                                        children={showMoreDesc ? text.less : text.more}
                                    />
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
                <Divider marginY={6} />
            </>
        );
    }
}

export default wrapComponent(BuyItem, 'BuyItem', true);
