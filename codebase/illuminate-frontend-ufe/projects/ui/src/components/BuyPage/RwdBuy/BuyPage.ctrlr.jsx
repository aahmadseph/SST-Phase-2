import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Container, Grid, Link, Text
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage';
import Location from 'utils/Location';
import BuyItem from 'components/BuyPage/RwdBuy/BuyItem';
import anaConsts from 'analytics/constants';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
import RelatedContent from 'components/RelatedContent';
import UrlUtils from 'utils/Url';

import { translatePageToLocale } from 'utils/buy';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapComponent } = FrameworkUtils;
const { getLink } = UrlUtils;
const { getCurrentLanguage } = LanguageLocaleUtils;

const handleSpaLink = (e, url) => {
    Location.navigateTo(e, url);
};

class BuyPage extends BaseClass {
    componentDidMount() {
        this.setPageLoadAnalytics();
    }
    componentDidUpdate(prevProps) {
        if (this.props.buyData?.rawBuyPageInfo?.slug !== prevProps.buyData?.rawBuyPageInfo?.slug) {
            this.setPageLoadAnalytics();
        }
    }

    setPageLoadAnalytics = () => {
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.SEOP;
        digitalData.page.pageInfo.pageName = `${this.props.buyData.rawBuyPageInfo.slug}`;
        digitalData.page.attributes.world = 'n/a';
        digitalData.page.attributes.additionalPageInfo = '';
        digitalData.page.attributes.sephoraPageInfo = {
            pageName: generalBindings.getSephoraPageName()
        };
    };

    render() {
        const { buyData, text } = this.props;
        const { rawBuyPageInfo = {}, skus = [], linkEquityBlock } = buyData;
        const currentLanguage = getCurrentLanguage();

        const translatedBuyData = translatePageToLocale(rawBuyPageInfo, currentLanguage) || {};
        const { title, relatedPages = [], contentSections } = translatedBuyData;

        const introContent = contentSections?.[0]?.[0];
        const productContent = contentSections?.[1]?.[0];

        const relatedLinks = relatedPages.filter(p => !p.sampleProduct?.blurb);
        const relatedProducts = relatedPages.filter(p => p.sampleProduct?.blurb);

        return (
            <Container hasLegacyWidth={true}>
                <Text
                    children={title}
                    is='h1'
                    fontSize={['lg', 'xl']}
                    fontWeight='bold'
                    lineHeight='tight'
                    marginTop='1em'
                    marginBottom='.5em'
                    css={{ textTransform: 'capitalize' }}
                />
                {relatedLinks.length > 0 && (
                    <Text
                        is='p'
                        marginBottom={4}
                    >
                        {text.relatedOn}{' '}
                        <Text display={['block', 'inline']}>
                            {(relatedLinks || []).map(related => {
                                const url = getLink(`/buy/${related.slug}`, ['seop_relatedlinks']);

                                return (
                                    <Link
                                        key={`relatedPage_${url}`}
                                        children={related.title}
                                        href={url}
                                        onClick={e => handleSpaLink(e, url)}
                                        color='blue'
                                        padding={1}
                                        margin={-1}
                                        marginRight={2}
                                    />
                                );
                            })}
                        </Text>
                    </Text>
                )}
                <Text
                    is='h2'
                    fontSize='md'
                    lineHeight='tight'
                    fontWeight='bold'
                    marginBottom='.25em'
                >
                    {text.preferredProducts}{' '}
                    <span
                        children={title}
                        css={{ textTransform: 'capitalize' }}
                    />
                    .
                </Text>
                <Text
                    children={introContent?.contentText}
                    is='p'
                    marginBottom={6}
                />
                {productContent?.data?.reduce((acc, contentData, index) => {
                    const sku = skus[contentData.sku];

                    if (sku?.skuId) {
                        acc.push(
                            <BuyItem
                                key={sku.skuId}
                                content={contentData}
                                sku={sku}
                                index={index}
                                handleSpaLink={handleSpaLink}
                                disableLazyLoad={index < 2}
                            />
                        );
                    }

                    return acc;
                }, [])}
                {relatedProducts.length > 0 && (
                    <>
                        <Text
                            is='h2'
                            fontSize={['md', 'lg']}
                            fontWeight='bold'
                            lineHeight='tight'
                            marginBottom={[6, 7]}
                        >
                            {text.productsRelated}{' '}
                            <Text
                                css={{ textTransform: 'capitalize' }}
                                children={title}
                            />
                        </Text>
                        <Grid
                            columns={['repeat(auto-fill, minmax(162px, 1fr))', 4]}
                            rowGap={[6, 7]}
                            columnGap={[4, 5, 6]}
                        >
                            {relatedProducts.map(related => {
                                const url = getLink(`/buy/${related.slug}`, ['seop_relatedlinks']);

                                return (
                                    <Box
                                        key={`relatedProduct_${url}`}
                                        href={url}
                                        onClick={e => handleSpaLink(e, url)}
                                        textAlign='center'
                                    >
                                        <Text
                                            display='block'
                                            fontWeight='bold'
                                            dangerouslySetInnerHTML={{
                                                __html: related.title
                                            }}
                                        />
                                        <ProductImage
                                            id={related.sampleProduct.sku}
                                            marginY={4}
                                            size={[162, 220]}
                                            marginX='auto'
                                        />
                                        {related.sampleProduct.blurb && (
                                            <Text
                                                display='block'
                                                dangerouslySetInnerHTML={{
                                                    __html: `“${related.sampleProduct.blurb}”`
                                                }}
                                            />
                                        )}
                                    </Box>
                                );
                            })}
                        </Grid>
                    </>
                )}
                <RelatedContent
                    hasDivider={true}
                    links={linkEquityBlock?.links}
                />
            </Container>
        );
    }
}

export default wrapComponent(BuyPage, 'BuyPage', true);
