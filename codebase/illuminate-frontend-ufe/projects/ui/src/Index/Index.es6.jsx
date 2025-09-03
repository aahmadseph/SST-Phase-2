/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import withReduxProvider from 'utils/framework/wrapWithReduxProvider';
import Head from 'components/Head/Head';
import HeaderBase from 'components/Header';
import FooterBase from 'components/Footer';
import GlobalModalsWrapperBase from 'components/GlobalModals/GlobalModalsWrapper';
import GlobalContentBase from 'components/GlobalContent/GlobalContent';
import GAdTag from 'components/GAdTag';
import PageJSON from 'components/PageJSON/PageJSON';
import localeUtils from 'utils/LanguageLocale';
import renderRootComponent from 'utils/framework/renderRootComponent';
import store from 'store/Store';
import { SET_PAGE_DATA } from '../constants/actionTypes/page';
import { HeadscriptRuntime, EventType } from 'constants/events';
import { isUfeEnvProduction, isUfeEnvQA, isUfeEnvLocal } from 'utils/Env';
import activityConstants from 'constants/happening/activityConstants';
import printTimestamp from 'utils/Timestamp.js';
import TestTargetUtils from 'utils/TestTarget';
import PageTemplateType from 'constants/PageTemplateType';
import SpaUtils from 'utils/Spa';
import stringUtils from 'utils/String';
import { translatePageToLocale } from 'utils/buy';
import { seo } from 'constants/seo';
import Empty from 'constants/empty';
import withEmotionGlobal from 'utils/framework/wrapWithEmotionGlobalStyles';
import SpaApplication from '../SpaApplication';
import IndexPages from 'pages/index';
import PriorityIndex from 'pages/priorityIndex';

Sephora.combinedPages = { ...IndexPages, ...PriorityIndex };
const PostloadedGAdTagList = withReduxProvider(withEmotionGlobal(GAdTag.PostloadedGAdTagList));
const Header = withReduxProvider(withEmotionGlobal(HeaderBase));
const Footer = withReduxProvider(withEmotionGlobal(FooterBase));
const GlobalModalsWrapper = withReduxProvider(withEmotionGlobal(GlobalModalsWrapperBase));
const GlobalContent = withReduxProvider(withEmotionGlobal(GlobalContentBase));

const { capitalize } = stringUtils;
const { OLR_LANDING_PAGE_SEO_DATA } = activityConstants;
const {
    getLocaleResourceFile, getCurrentCountry, COUNTRIES, isFrench, getCurrentLanguageCountryCode, getCurrentLanguage
} = localeUtils;

class Index extends BaseClass {
    constructor(props) {
        super(props);
    }

    getNLPConfigurationSettings = function (configurationSettings) {
        const isCA = getCurrentCountry() === COUNTRIES.CA;
        const isFR = isFrench();

        if (isFR) {
            return {
                isNLPSearchEnabled: configurationSettings.isNLPSearchEnabledCAFR,
                constructorApiKey: configurationSettings.constructorAPIKeyCAFR
            };
        } else if (isCA) {
            return {
                isNLPSearchEnabled: configurationSettings.isNLPSearchEnabledCA,
                constructorApiKey: configurationSettings.constructorAPIKeyCAEN
            };
        } else {
            return {
                isNLPSearchEnabled:
                    configurationSettings.isNLPSearchEnabled ||
                    configurationSettings.isNLPSearchEnabledCAEN ||
                    configurationSettings.isNLPSearchEnabledCAFR,
                constructorApiKey: configurationSettings.constructorAPIKeyUS
            };
        }
    };

    hasHeaderFooter = function (template) {
        switch (template) {
            case PageTemplateType.Apply:
            case PageTemplateType.Checkout:
            case PageTemplateType.EditPlaySubscription:
            case PageTemplateType.VendorLogin:
            case PageTemplateType.VendorGenericLogin:
            case PageTemplateType.Affiliates:
            case PageTemplateType.PreviewSettings:
            case PageTemplateType.Invoice:
            case PageTemplateType.ReplacementOrderPage:
            case PageTemplateType.TaxClaim:
            case PageTemplateType.RwdCheckout:
            case PageTemplateType.FSCheckout:
                return false;
            default:
                return true;
        }
    };

    /* eslint max-len: [ 2, 200] */
    render = function () {
        const getText = getLocaleResourceFile('Index/locales', 'Index');
        const template = this.props.templateInformation?.template;
        let seoTitle;
        let seoCanonicalUrl;
        let seoMetaDescription;

        if (typeof wrapComponentRenderModule !== 'undefined') {
            /* eslint-disable-next-line no-undef */
            wrapComponentRenderModule.setRootCompCount(0);
        }

        const headerFooterContent = this.props.headerFooterTemplate?.data || this.props.headerFooterTemplate?.regions || {};

        /*
            This var is temporary, we need to support both BCC and CMS credit card apply pages.
            Once CMS pages are live EXP will update this code to use the headerFooter func
        */
        const isCMSCreditCardApplyPage = this.props.content?.layout?.type === 'LayoutCreditCardApplication';

        const hasHeaderFooter = isCMSCreditCardApplyPage ? false : this.hasHeaderFooter(template);
        const footerLinks = (headerFooterContent.footer && headerFooterContent.footer.length && headerFooterContent.footer[0].items) || Empty.Array;
        const megaNavPersonalization = headerFooterContent.megaNav?.personalization;

        /* Not all this data will show up on the frontend render */
        const renderedData = {
            rendered: printTimestamp(),
            template,
            channelProp: Sephora.channel,
            renderHost: Sephora.renderHostName,
            pageRenderTime: '[[TEMPLATE_RENDER_TIME]]',
            catOrMouse: Sephora.catOrMouse
        };

        const stagingBVEnv = isUfeEnvQA || isUfeEnvLocal ? 'bvstaging/' : '';

        const isUS = getCurrentCountry() === COUNTRIES.US;

        /* eslint-disable camelcase */
        const configurationSettings = Sephora.configurationSettings;
        const { isNLPSearchEnabled, constructorApiKey } = this.getNLPConfigurationSettings(configurationSettings);
        configurationSettings.frtSiteId = configurationSettings.forterSiteId;
        delete configurationSettings.forterSiteId;
        configurationSettings.addStructureOrg = configurationSettings.org;
        configurationSettings.bvUserAllReviewsUrl = `https://sephora.ugc.bazaarvoice.com/${stagingBVEnv}8723abredes/`;
        configurationSettings.isCCPABannerEnabled = false;
        configurationSettings.isKlarnaPaymentEnabled = isUS ? configurationSettings.isKlarnaEnabledForUS : configurationSettings.isKlarnaEnabledForCA;
        configurationSettings.isNLPSearchEnabled = isNLPSearchEnabled;
        configurationSettings.constructorApiKey = constructorApiKey;

        const fantasticPlasticConfigurations = configurationSettings.fantasticPlasticConfigurations;
        Sephora.fantasticPlasticConfigurations = fantasticPlasticConfigurations;

        const isSEOForCanadaEnabled = isUfeEnvLocal ? false : configurationSettings.isSEOForCanadaEnabled;
        Sephora.isSEOForCanadaEnabled = isSEOForCanadaEnabled;
        // end of server-side rendering properties

        //TODO 19.2: get these seo properties passed to us from spring layer
        if (template === PageTemplateType.StoreHub) {
            seoTitle = OLR_LANDING_PAGE_SEO_DATA.TITLE;
            seoMetaDescription = OLR_LANDING_PAGE_SEO_DATA.DESCRIPTION;
            seoCanonicalUrl = OLR_LANDING_PAGE_SEO_DATA.CANONICAL_URL;
        } else if (template === PageTemplateType.ExperienceDetails) {
            //using Sephora.renderQueryParams.urlPath here since rootRender is true
            //and window.location is not avaialble, this will go away when we get seo props
            //passed to us from spring layer
            const urlPathStrings = Sephora.renderQueryParams.urlPath.split('/');
            const activityType = urlPathStrings[2];
            const activityID = urlPathStrings[3];
            seoMetaDescription = '';
            seoCanonicalUrl = `/happening/${activityType}/${activityID}`;
        } else if (template === PageTemplateType.StoreDetail) {
            //Since store details is root rendered we need to check template and not url
            const storeInfo = this.props.stores && this.props.stores.length && this.props.stores[0];

            if (storeInfo) {
                seoTitle = getText('metaTitleBeautyStore', [storeInfo.address.city, storeInfo.displayName]);
                seoMetaDescription = getText('metaDescVisitSephora', [storeInfo.displayName, storeInfo.address.city, storeInfo.address.state]);
                seoCanonicalUrl = storeInfo.seoCanonicalUrl;
            }
        } else if (template === PageTemplateType.Departments) {
            seoMetaDescription = getText('metaDescFindAll');
            seoCanonicalUrl = '/sitemap/departments';
        } else if (template === PageTemplateType.RwdBuyPage) {
            const currentLanguage = getCurrentLanguage();
            const currentCountry = getCurrentCountry();
            const translatedBuyData = translatePageToLocale(this.props?.buy?.rawBuyPageInfo, currentLanguage) || {};
            const { title, metaDescription } = translatedBuyData;

            seoTitle = capitalize(`${title} | Sephora ${currentCountry === COUNTRIES.CA ? 'Canada' : ''}` || '');
            seoMetaDescription = metaDescription ? metaDescription : getText('buyPageDescription', [capitalize(title || '')]);
            seoCanonicalUrl = `/buy/${this.props?.buy?.rawBuyPageInfo?.slug}`;
        } else if (template === PageTemplateType.Homepage) {
            // EXP-4692
            const { home = {} } = this.props;

            if (home.seo) {
                seoTitle = home.seo.pageTitle;
                seoCanonicalUrl = home.seo.canonicalUrl;
                seoMetaDescription = home.seo.metaDescription;
            }
        } else if (template === PageTemplateType.Content) {
            const { content = {} } = this.props;
            seoTitle = content.seo?.pageTitle;
            seoMetaDescription = content.seo?.metaDescription;
            seoCanonicalUrl = content.seo?.canonicalUrl;
        } else if (template === PageTemplateType.Search && this.props.seoCanonicalUrl === '/sale') {
            const versions = seo.find(x => x.url === this.props.seoCanonicalUrl).localeVersions;
            const localizedSaleSEO = versions.find(x => x.locale === getCurrentLanguageCountryCode()) || versions.find(x => x.locale === 'en_US');
            seoTitle = localizedSaleSEO.seoTitle;
            seoMetaDescription = localizedSaleSEO.seoMetaDescription;
        } else if (template === PageTemplateType.EnhancedContent) {
            const { seo: enhancedSeo } = this.props.data;
            seoTitle = enhancedSeo?.pageTitle;
            seoMetaDescription = enhancedSeo?.metaDescription;
            seoCanonicalUrl = enhancedSeo?.canonicalUrl;
        } else if (template === PageTemplateType.ServicesAndEvents) {
            const { seo: happeningSeo, seoCanonicalUrl: canonicalUrl } = this.props;
            seoTitle = happeningSeo?.pageTitle;
            seoMetaDescription = happeningSeo?.metaDescription;
            seoCanonicalUrl = canonicalUrl;
        } else if (template === PageTemplateType.Happening) {
            if (this.props.seo) {
                const { seo: happeningSeo, seoCanonicalUrl: canonicalUrl } = this.props;
                seoTitle = happeningSeo?.pageTitle;
                seoMetaDescription = happeningSeo?.metaDescription;
                seoCanonicalUrl = canonicalUrl;
            }
        } else if (template === PageTemplateType.GalleryPage) {
            seoTitle = getText('galleryPageTitle');
            seoMetaDescription = getText('galleryPageDescription');
            seoCanonicalUrl = '/community/gallery';
        }

        let noReferrer = false;

        if (template === PageTemplateType.ResetPassword) {
            noReferrer = true;
        }

        // Setup backend store
        let pageProps;

        // Leaving serverSideStore undefined will result in the page store being set back to its initial state
        let serverSideStore, seoParams, pageData;

        if (!Sephora.isSPA) {
            // pageProps needs to be copied so that props can be updated
            pageProps = Object.assign({}, this.props);

            // Performance tweak for non-rwd pages
            // this can be removed when all pages are converted to rwd spa pages
            // https://jira.sephora.com/browse/UA-489
            delete pageProps.headerFooterTemplate;

            pageData = this.props;
            seoParams = pageData;
        } else {
            serverSideStore = this.props;
            const { enableNoindexMetaTag, enableNoFollowMetaTag = false } = this.props;
            const { pageName } = SpaUtils.getSpaTemplateInfoByTemplate(template) || {};
            const isProductPageTemplate = template === PageTemplateType.ProductPage;
            const isGalleryPageTemplate = template === PageTemplateType.GalleryPage;

            pageData = pageName === 'search' ? this.props : this.props[pageName] || {};
            const productPageSeoDataFromATG =
                pageData?.content && Object.keys(pageData.content).length > 0 && Object.keys(pageData.content).some(value => value?.includes('seo'));

            seoParams =
                isProductPageTemplate && productPageSeoDataFromATG
                    ? pageData.content
                    : isGalleryPageTemplate && enableNoindexMetaTag
                        ? { ...pageData, enableNoindexMetaTag, enableNoFollowMetaTag }
                        : pageData;
        }

        // Start of mbox set up
        // The mboxAttrs variable is used to pass attributes to mbox
        const mboxAttrs = TestTargetUtils.extractMboxParams(pageData);

        const regionsContent = pageData?.content?.regions?.content;
        const bccContent = regionsContent && regionsContent[0];
        const beautyOffersContent = this.props?.content?.layout?.content || Empty.Array;
        let birthdayGiftContent = Empty.Object;

        if (configurationSettings?.isBirthdayLandingPageP13NEnabled) {
            // Using canonicalUrl since window.location is not avaialble
            if (/\/beauty\/birthday-gift/.test(this.props.content?.seo?.canonicalUrl)) {
                birthdayGiftContent = this.props?.content?.layout || Empty.Object;
            }
        }

        store.dispatch({
            type: SET_PAGE_DATA,
            payload: serverSideStore
        });

        // Trim store data by only passing the page data
        // The only data that should be in the store server side should be the page data
        const trimStoreData = () => {
            const { page } = store.getState();
            const ssrProps = { ...Sephora.linkSPA };
            Sephora.linkSPA = {};

            if (template === PageTemplateType.RwdBuyPage) {
                page.buy.seoCanonicalUrl = seoCanonicalUrl;
            }

            if (!page.headerFooterTemplate?.data) {
                page.headerFooterTemplate = { data: headerFooterContent };
            }

            return {
                page,
                ssrProps
            };
        };

        let RootComponent;

        if (Sephora.isSPA) {
            RootComponent = SpaApplication;
        } else {
            RootComponent = Sephora.combinedPages[template];
        }

        RootComponent = withReduxProvider(withEmotionGlobal(RootComponent));

        //TODO: move this to pageData
        const { hideBanners } = RootComponent;

        // End of mbox set up
        return (
            <html
                lang={Sephora.renderQueryParams.language || 'en'}
                css={styles.root}
            >
                <Head
                    template={template}
                    noReferrer={noReferrer}
                    bccContent={bccContent}
                    logo={this.props.logo}
                    seoTitle={seoTitle || seoParams?.seoTitle || ''}
                    seoMetaDescription={seoMetaDescription || seoParams?.seoMetaDescription}
                    seoCanonicalUrl={seoCanonicalUrl || seoParams?.seoCanonicalUrl}
                    isSEOForCanadaEnabled={isSEOForCanadaEnabled}
                    fantasticPlasticConfigurations={fantasticPlasticConfigurations}
                    thirdPartyImageHost={this.props.thirdpartyImageHost}
                    mediaId={this.props.mediaId}
                    renderedData={renderedData}
                    enableNoindexMetaTag={seoParams?.enableNoindexMetaTag}
                    enableNoFollowMetaTag={seoParams?.enableNoFollowMetaTag}
                    productPageSku={template === PageTemplateType.ProductPage && this.props.product && this.props.product.currentSku}
                    mboxAttrs={mboxAttrs}
                    rwdPersistentBanner1={headerFooterContent.rwdPersistentBanner1}
                    seoJsonLd={this.props.seoJsonLd}
                    hasHeaderFooter={hasHeaderFooter}
                    hasMegaNavPersonalization={megaNavPersonalization}
                    homePageItems={this.props.home?.items || []}
                    headerFooterContent={headerFooterContent}
                    beautyOffersContent={beautyOffersContent}
                    birthdayGiftContent={birthdayGiftContent}
                    rwdBasketTopContent={this.props?.rwdBasket?.cmsData?.topContent || []}
                />
                <body>
                    <script
                        dangerouslySetInnerHTML={{
                            __html:
                                'if(Sephora.Util.Perf.isReportSupported()) {' +
                                `    Sephora.Util.Perf.report('${HeadscriptRuntime} ${EventType.Applied}');` +
                                `    const entry = performance.getEntriesByName('${HeadscriptRuntime} ${EventType.Loaded}', 'mark')[0];` +
                                '    const event = {' +
                                `        data: '${HeadscriptRuntime} ${EventType.Loaded}',` +
                                '        time: entry.startTime,' +
                                '        timestamp: true' +
                                '    };' +
                                '    Sephora.Util.Perf.loadEvents.unshift(event);' +
                                '}'
                        }}
                    />

                    {hasHeaderFooter &&
                        renderRootComponent(
                            <Header
                                headerFooterContent={headerFooterContent}
                                hideBanners={hideBanners}
                                personalization={megaNavPersonalization}
                            />
                        )}

                    {renderRootComponent(<RootComponent {...pageProps} />)}

                    {Sephora.configurationSettings.isRetailMediaNetworkEnabled &&
                        renderRootComponent(
                            <PostloadedGAdTagList
                                currentPageTemplateType={this.props.templateInformation.template}
                                currentTargetUrl={pageData?.targetUrl}
                                listSize={3}
                            />
                        )}

                    {hasHeaderFooter && headerFooterContent && renderRootComponent(<Footer links={footerLinks} />)}

                    <div id='sessionai' />
                    <div id='modal-root' />
                    {renderRootComponent(
                        <GlobalModalsWrapper
                            signInData={{
                                isEmailDisabled: this.props.isEmailDisabled,
                                isRadioDisabled: this.props.isRadioDisabled,
                                isSSIEnabled: configurationSettings.isOptInSSIMWebEnabled
                            }}
                        />
                    )}
                    {renderRootComponent(<GlobalContent template={template} />)}
                    <PageJSON
                        name='linkStore'
                        data={trimStoreData()}
                    />
                    {/* This gets replaced in InflateRoot */}
                    {!isUfeEnvProduction && (
                        <script
                            id={'serverErrors'}
                            type='text/json'
                            dangerouslySetInnerHTML={{
                                __html: '[[SEPHORA_SERVER_ERROR]]'
                            }}
                        ></script>
                    )}
                </body>
            </html>
        );
    };
}

const styles = {
    root: {
        fontSize: 'var(--font-size-base)',
        height: '100vh',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozTextSizeAdjust: '100%',
        WebkitTextSizeAdjust: '100%'
    }
};

export default wrapComponent(Index, 'Index');
