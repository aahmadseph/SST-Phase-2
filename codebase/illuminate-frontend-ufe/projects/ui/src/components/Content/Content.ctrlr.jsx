/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Container, Divider } from 'components/ui';
import ContentLayout from 'components/Content/ContentLayout';
import RelatedContent from 'components/RelatedContent';
import BaseClass from 'components/BaseClass';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import contentPageBindings from 'analytics/bindingMethods/pages/content/contentPageBindings';
import PageTemplateType from 'constants/PageTemplateType';
import SoftLinks from 'components/Content/SoftLinks';
import SeoText from 'components/Catalog/SeoText';
import Copy from 'components/Content/Copy';
import VisuallyHidden from 'components/VisuallyHidden';
import { fontSizes } from 'style/config';
import History from 'services/History';
import Location from 'utils/Location';
import SpaUtils from 'utils/Spa';
import p13nUtils from 'utils/localStorage/P13n';
import { getMatchReferer } from 'analytics/utils/cmsReferer';

class Content extends BaseClass {
    componentDidMount() {
        if (Sephora.template === PageTemplateType.EnhancedContent) {
            enhancedContentPageBindings.setPageLoadAnalytics(this.props.content);
        } else if (Sephora.template === PageTemplateType.Content) {
            contentPageBindings.setPageLoadAnalytics(this.props.content);
        }

        getMatchReferer();

        if (Location.isOffersPage()) {
            const cachedPersonalizationData = p13nUtils.getAllPersonalizedCache();

            if (cachedPersonalizationData) {
                this.props.setP13NAnalyticsData(cachedPersonalizationData);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.content.sid !== this.props.content.sid) {
            if (Sephora.template === PageTemplateType.EnhancedContent || Sephora.template === PageTemplateType.Content) {
                enhancedContentPageBindings.setPageLoadAnalytics(this.props.content);
            } else if (Sephora.template === PageTemplateType.Content) {
                contentPageBindings.setPageLoadAnalytics(this.props.content);
            }
        }

        if (Location.isOffersPage()) {
            // P13N Analytics Data
            const p13nAnalyticsData = digitalData.page.attributes.p13nAnalyticsData;

            if (prevProps.p13n !== this.props.p13n && this.props.p13n.headData && !p13nAnalyticsData) {
                this.props.setP13NAnalyticsData(this.props.p13n.headData);
            }
        }
    }

    render() {
        const { redirect } = this.props.content;
        const locationObj = redirect && redirect.url ? History.splitURL(redirect.url) : null;
        const isSpaNavigatioWithRedirect = locationObj ? SpaUtils.isSpaNavigation(locationObj) : false;

        // Forcing a page-load on SPA navigation with CXS content.seo = null
        // and content.redirect present with a url and 301/302 redirect types
        if (isSpaNavigatioWithRedirect) {
            return Location.setLocation(redirect.url);
        }

        const {
            sid, seo, layout, navigation, breadcrumbs, linkEquityBlock, moreLinks, seoText, parentPage, pageHeader
        } = this.props.content;
        const seoHeader = seo?.header1;

        const LayoutComponent = ContentLayout[layout?.type];
        const isContentStoreLayout = layout?.type === 'LayoutBuyingGuide' || layout?.type === 'LayoutCs';
        const isCreditCardApplicationLayout = layout?.type === 'LayoutCreditCardApplication';
        const isRewardsLayout = layout?.type === 'LayoutRewardsBazaar';
        const isBeautyInsiderLayout = layout?.type === 'LayoutBeautyInsider';

        const domPrefix = 'www';
        const seoJSON = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://' + domPrefix + '.sephora.com/',
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://' + domPrefix + '.sephora.com/search?keyword={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        };

        let content = layout;

        if (isRewardsLayout || isBeautyInsiderLayout) {
            content = {
                bottomContent: this.props.content.bottomContentZone,
                topContent: this.props.content.topContentZone
            };
        }

        return (
            <Container
                paddingX={0}
                paddingTop={breadcrumbs ? 0 : [4, 5]}
                css={[isContentStoreLayout && styles.contentStoreStyles, isCreditCardApplicationLayout && styles.ccLayoutStyles]}
            >
                {seoHeader && (
                    <VisuallyHidden
                        is='h1'
                        children={seoHeader}
                    />
                )}
                <LayoutComponent
                    pageHeader={pageHeader}
                    content={content}
                    seo={seo}
                    breadcrumbs={breadcrumbs}
                    navigation={navigation}
                    parentPage={parentPage}
                    enablePageRenderTracking
                />
                <Container>
                    {moreLinks && (
                        <>
                            <Divider
                                marginTop={[5, 7]}
                                marginBottom={4}
                            />
                            <SoftLinks
                                {...moreLinks}
                                moreLinks
                            />
                        </>
                    )}
                    {layout?.copy?.length > 0 && layout.copy?.[0]?.content && (
                        <>
                            <Divider
                                marginTop={[4, 5]}
                                marginBottom={0}
                            />
                            {layout.copy?.map((item, index) => (
                                <Copy
                                    content={item.content}
                                    key={item.sid}
                                    marginTop={[4, index === 0 ? 5 : 4]}
                                />
                            ))}
                        </>
                    )}
                    {!isCreditCardApplicationLayout && (seoText || layout?.seoText) && (
                        <>
                            <Divider
                                marginTop={[5, 7]}
                                marginBottom={4}
                            />
                            <SeoText
                                contextId={sid}
                                text={seoText || layout?.seoText}
                            />
                        </>
                    )}
                    <RelatedContent
                        links={linkEquityBlock?.links}
                        hasDivider
                    />
                </Container>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(seoJSON)
                    }}
                ></script>

                {seo?.schemas?.length &&
                    seo.schemas.map(schema => (
                        <script
                            key={schema['@type']}
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        ></script>
                    ))}
            </Container>
        );
    }
}

const styles = {
    contentStoreStyles: {
        fontSize: fontSizes['base-bg']
    },
    ccLayoutStyles: {
        maxWidth: 'unset'
    }
};

export default wrapComponent(Content, 'Content', true);
