import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { HeadscriptRuntime, EventType } from 'constants/events';
import locationUtils from 'utils/Location';
import compConstants from 'components/constants';
import UrlUtils from 'utils/Url';
import HelpersUtils from 'utils/Helpers';
import ImageUtils from 'utils/Image';
import MediaUtils from 'utils/Media';
import { isUfeEnvLocal, isUfeEnvProduction, getCurrentEnv } from 'utils/Env';
import SpaUtils from 'utils/Spa';
import PageTemplateType from 'constants/PageTemplateType';
import { breakpoints } from 'style/config';
import KpUtils from 'utils/Kp';
import cookieSpoof from 'buildtools/cookieSpoof';
import mainHeadScript from 'components/Head/main.headScript';
import p13nHeadScript from 'components/Head/p13n.headScript.js';
import searchHeadScript from 'components/Head/search.headScript.js';
import localImpuseHeadScript from 'components/Head/local-mpulse.headScript.js';
import { isPriorityPage } from 'utils/bundlerChunkLoader';

const { SEPHORA_URL } = compConstants;
const { getLink, removeParam } = UrlUtils;
const { getProp } = HelpersUtils;
const { getImageUrlsForPreload } = ImageUtils;
const { mediaStyle } = MediaUtils;
const { buildEndpointConfig } = KpUtils;

const LOGO_PATH = '/images/Sephora_logo.jpg';
const LOGO_PROMO_PATH = '/contentimages/promo/RMS/2020/sephora_logo_full.png';

const DYNATRACE_URLS = {
    production: 'https://js-cdn.dynatrace.com/jstag/16362cc0dec/bf15698iev/10ad61344e68aed_complete.js',
    qa4: 'https://js-cdn.dynatrace.com/jstag/16362cc0dec/bf15698iev/b10483043c4a2785_complete.js',
    qa3: 'https://js-cdn.dynatrace.com/jstag/16362cc0dec/bf15698iev/5ab91f6ab24eaa94_complete.js'
};

const ResponsiveViewPorts = [PageTemplateType.Gallery];

function isResponsiveViewport(template) {
    return ResponsiveViewPorts.find(x => x === template);
}

// getting Env from the host for production and QA only
const currentEnv = getCurrentEnv();

// Extremely important (in order not to fall into wrong implementations)
// to remember that the code here isNodeRender ONLY!
// The Head is also cached statically (Akamai), so some conditions like
// checking location do not make sense here.
// eslint-disable-next-line complexity
const Head = ({ template, hasHeaderFooter, ...props }) => {
    const { seoTitle, seoMetaDescription } = props;
    const priorityPage = isPriorityPage(template);
    const FE_BUILD_MODE = 'frontend';

    const isPPage = template === PageTemplateType.ProductPage;
    const isCategoryPage = template === PageTemplateType.NthCategory;
    const isHomepage = template === PageTemplateType.Homepage;
    const isSearchPage = template === PageTemplateType.Search;
    const isBrandPage = template === PageTemplateType.BrandNthCategory;
    const isContentPage = template === PageTemplateType.ContentStoreNoNav || template === PageTemplateType.ContentStore;
    const isReferrer = template === PageTemplateType.Referrer;
    const isNewRwdBuyPage = template === PageTemplateType.NewRwdBuyPage;
    const isConstructorEnabledPage = locationUtils.isConstructorEnabledPage();
    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
    const enableDynatraceRUM = Sephora.configurationSettings.enableDynatraceRUM;
    const isBeautyContentPage = props.seoCanonicalUrl ? props.seoCanonicalUrl.indexOf('/beauty/') === 0 : false;

    const seoCanonicalUrl = isHomepage
        ? props.seoCanonicalUrl || SEPHORA_URL.DESKTOP + getLink('/')
        : props.seoCanonicalUrl && SEPHORA_URL.DESKTOP + props.seoCanonicalUrl;

    // API should either send these or not!
    // these are checked below to see if the exist
    const ogTitle = seoTitle,
        ogDescription = seoMetaDescription,
        ogType = getProp(Sephora.configurationSettings, 'openGraph.ogType', ''),
        ogUrl = getLink(seoCanonicalUrl),
        ogSiteName = getProp(Sephora.configurationSettings, 'openGraph.ogSiteName', ''),
        fbAppId = getProp(Sephora.configurationSettings, 'openGraph.fbAppId', ''),
        fbAdmins = getProp(Sephora.configurationSettings, 'openGraph.fbAdmins', '');

    const ogImagePath =
        ((isCategoryPage || isSearchPage) && props.bccContent && props.bccContent.imagePath) ||
        (isContentPage && props.bccContent && props.bccContent.imagePath) ||
        (isPPage && props.productPageSku && props.productPageSku.skuImages && props.productPageSku.skuImages.image300) ||
        (isBrandPage && props.logo) ||
        (isReferrer && LOGO_PROMO_PATH) ||
        (isHomepage && LOGO_PATH) ||
        LOGO_PATH;

    // add a preload tag for the hero image on the PDP on Hard load
    let preloadHeroImageUrls = [];

    if (isPPage && props.productPageSku && props.productPageSku.skuImages) {
        const imageSrc = props.productPageSku.skuImages.imageUrl;
        preloadHeroImageUrls = getImageUrlsForPreload({
            imageSrc: removeParam(imageSrc, 'pb')
        });
    }

    const kpEndpointConfig = buildEndpointConfig();

    return (
        <head>
            <title>{SpaUtils.getPageTitle(seoTitle, template)}</title>

            {isPPage &&
                preloadHeroImageUrls.length > 0 &&
                preloadHeroImageUrls.map((preloadHeroImageUrl, index) => (
                    <link
                        key={index}
                        rel='preload'
                        href={preloadHeroImageUrl.url1x}
                        imagesrcset={`${preloadHeroImageUrl.url1x} 1x, ${preloadHeroImageUrl.url2x} 2x`}
                        as='image'
                        importance='high'
                        media={index === 0 ? breakpoints.smMax : breakpoints.mdMin}
                    />
                ))}

            {/* notice: we use the `me-active.svg` transfer size to determine
                if it is a first time load or not to set Sephora.isNewUser true/false
                initial task [UTS-1035] -> fixed in [UA-1201] */}
            {hasHeaderFooter && (
                <>
                    <link
                        rel='preload'
                        as='image'
                        href='/img/ufe/icons/me32.svg'
                        media={breakpoints.mdMin}
                    />
                    <link
                        rel='preload'
                        as='image'
                        href='/img/ufe/icons/me-active.svg'
                    />
                </>
            )}

            {/* The list of third-party domains serving scripts
                loading simultaneously with the initial HTML data. */}
            <link
                rel='preconnect'
                href='https://cnstrc.com/'
            />
            <link
                rel='preconnect'
                href='https://js-cdn.dynatrace.com/'
            />
            <link
                rel='preconnect'
                href='https://ds-aksb-a.akamaihd.net/'
            />
            <link
                rel='preconnect'
                href='https://s.go-mpulse.net/'
            />

            <script
                dangerouslySetInnerHTML={{
                    __html:
                        'if (typeof global === "undefined") window.global = window;' +
                        'global.Sephora = global.Sephora || {};' +
                        'Sephora.Util = {};' +
                        'Sephora.Util.Perf = { loadEvents: [] };' +
                        'Sephora.Util.Perf.isReportSupported = function () {' +
                        '    return window.performance && typeof window.performance.mark === "function";' +
                        '};' +
                        `if(Sephora.Util.Perf.isReportSupported()) window.performance.mark("${HeadscriptRuntime} ${EventType.Loaded}");`
                }}
            />

            {isHomepage && (
                <meta
                    name='google-site-verification'
                    content='mG4P7RXXjnz1YtKLza-gXqH63eQ5hT4b9RLOcnxNOYI'
                />
            )}
            {isHomepage && (
                <meta
                    name='facebook-domain-verification'
                    content='cp69tmr78xo4472vo7gavpatbw9aph'
                />
            )}

            <meta
                name='viewport'
                content={
                    Sephora.isDesktop() && !isResponsiveViewport(template) && Sephora.channel.toUpperCase() !== 'RWD'
                        ? 'width=1024'
                        : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            />

            {seoMetaDescription && (
                <meta
                    id='metaDescription'
                    name='description'
                    content={seoMetaDescription}
                />
            )}

            {seoCanonicalUrl && (
                <link
                    id='seoCanonicalUrl'
                    rel='canonical'
                    href={getLink(seoCanonicalUrl)}
                />
            )}

            {props.seoJsonLd && isBeautyContentPage && (
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: props.seoJsonLd }}
                />
            )}

            {props.noReferrer && (
                <meta
                    name='referrer'
                    content='never'
                />
            )}
            {props.noReferrer && (
                <meta
                    name='referrer'
                    content='no-referrer'
                />
            )}

            {ogDescription !== undefined && (
                <>
                    <meta
                        id='metaOgDescription'
                        property='og:description'
                        content={ogDescription}
                    />
                    <meta
                        name='twitter:description'
                        content={ogDescription}
                    />
                </>
            )}

            {ogTitle !== undefined && (
                <>
                    <meta
                        id='metaOgTitle'
                        property='og:title'
                        content={ogTitle}
                    />
                    <meta
                        name='twitter:title'
                        content={ogTitle}
                    />
                </>
            )}

            {ogType && (
                <meta
                    property='og:type'
                    content={ogType}
                />
            )}

            {ogUrl && (
                <meta
                    id='metaOgUrl'
                    property='og:url'
                    content={ogUrl}
                />
            )}

            {ogImagePath && (
                <>
                    <meta
                        name='twitter:card'
                        content='summary_large_image'
                    />
                    <meta
                        name='twitter:image'
                        content={ogImagePath}
                    />
                    <meta
                        property='og:image'
                        content={ogImagePath}
                    />
                </>
            )}

            {ogSiteName && (
                <meta
                    property='og:site_name'
                    content={ogSiteName}
                />
            )}

            {fbAppId && (
                <meta
                    property='fb:app_id'
                    content={fbAppId}
                />
            )}

            {fbAdmins && (
                <meta
                    property='fb:admins'
                    content={fbAdmins}
                />
            )}

            <meta
                name='twitter:site'
                content='@Sephora'
            />
            <meta
                name='apple-mobile-web-app-capable'
                content='yes'
            />
            <meta
                name='format-detection'
                content='telephone=no'
            />

            {!locationUtils.isBasketPage() && !locationUtils.isOrderConfirmationPage() && !locationUtils.isCheckout() && (
                <meta
                    name='apple-itunes-app'
                    content='app-id=393328150'
                />
            )}

            {props.enableNoindexMetaTag && props.enableNoFollowMetaTag ? (
                <meta
                    name='robots'
                    content='noindex, nofollow'
                />
            ) : (props.enableNoindexMetaTag && !props.enableNoFollowMetaTag) || !isUfeEnvProduction ? (
                <meta
                    name='robots'
                    content='noindex'
                />
            ) : null}

            <link
                rel='icon'
                href='/img/ufe/favicon.ico'
            />

            <style dangerouslySetInnerHTML={{ __html: mediaStyle }} />

            <script
                dangerouslySetInnerHTML={{
                    __html:
                        'Sephora.targetersToInclude = "__TARGETER_QUERY_PARAM__";' +
                        'Sephora.template = "' +
                        template +
                        '";' +
                        'Sephora.renderedData = ' +
                        JSON.stringify(props.renderedData) +
                        ';' +
                        'Sephora.buildInfo = ' +
                        JSON.stringify(Sephora.buildInfo) +
                        ';' +
                        'Sephora.renderQueryParams = ' +
                        JSON.stringify(Sephora.renderQueryParams) +
                        ';' +
                        'Sephora.isSPA = ' +
                        Sephora.isSPA +
                        ';' +
                        'Sephora.channel = "' +
                        Sephora.channel +
                        '";' +
                        'Sephora.pagePath = "' +
                        Sephora.pagePath +
                        '";' +
                        'Sephora.rwdPersistentBanner1 =' +
                        JSON.stringify(props.rwdPersistentBanner1) +
                        ';' +
                        'Sephora.homePageItems =' +
                        JSON.stringify(props.homePageItems) +
                        ';' +
                        'Sephora.headerFooterContent =' +
                        JSON.stringify({
                            persistentBanner: props.headerFooterContent?.persistentBanner,
                            megaNav: props.hasMegaNavPersonalization ? props.headerFooterContent?.megaNav : []
                        }) +
                        ';' +
                        'Sephora.beautyOffersContent =' +
                        JSON.stringify(props.beautyOffersContent) +
                        ';' +
                        'Sephora.birthdayGiftContent =' +
                        JSON.stringify(props.birthdayGiftContent) +
                        ';' +
                        'Sephora.rwdBasketTopContent =' +
                        JSON.stringify(props.rwdBasketTopContent) +
                        ';' +
                        'Sephora.isSEO = ' +
                        Sephora.isSEO +
                        ';' +
                        'Sephora.clientKey = "' +
                        Sephora.configurationSettings.clientKey +
                        '";' +
                        'Sephora.sdnUfeAPIUserKey = "' +
                        Sephora.configurationSettings.sdnUfeAPIUserKey +
                        '";' +
                        'Sephora.enablefullProfileGroup = ' +
                        Sephora.configurationSettings.enablefullProfileGroup +
                        ';' +
                        'Sephora.setZipStoreCookie = ' +
                        Sephora.configurationSettings.setZipStoreCookie +
                        ';' +
                        'Sephora.isPasskeyEnabled = ' +
                        Sephora.configurationSettings.isPasskeyEnabled +
                        ';' +
                        'Sephora.sdnDomainBaseUrl = "' +
                        Sephora.configurationSettings.sdnDomainBaseUrl +
                        '";' +
                        'Sephora.isNewAuthEnabled = ' +
                        Sephora.configurationSettings.isNewAuthEnabled +
                        ';' +
                        'Sephora.isTaxExemptionEnabled = ' +
                        Sephora.configurationSettings.isTaxExemptionEnabled +
                        ';' +
                        'Sephora.ignoreATGDynAndJsessionId = ' +
                        Sephora.configurationSettings.ignoreATGDynAndJsessionId +
                        ';' +
                        'Sephora.newRefreshTokenFlow = ' +
                        Sephora.configurationSettings.newRefreshTokenFlow +
                        ';' +
                        'Sephora.configurationSettings = ' +
                        JSON.stringify(Sephora.configurationSettings) +
                        ';'
                }}
            />

            {isUfeEnvLocal && Sephora.sslPort && Sephora.host && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: 'Sephora.host = "' + Sephora.host + '";' + 'Sephora.sslPort = ' + Sephora.sslPort + ';'
                    }}
                />
            )}

            {/* Default skuId for current product if on product page */}
            {props.productPageSku && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `Sephora.productPage = { defaultSkuId: ${props.productPageSku.skuId} }`
                    }}
                />
            )}

            {/***************************
             * First Load Items. These items should be loaded first do not move anything
             * in this area or place any tags above it
             */}

            {
                // Mock Akamai's current_country cookie for local environments
                Sephora.buildMode === FE_BUILD_MODE ? <script dangerouslySetInnerHTML={{ __html: cookieSpoof }} /> : null
            }

            {Sephora.configurationSettings.isKpEnabled && (
                <>
                    <script
                        type='application/javascript'
                        dangerouslySetInnerHTML={{
                            __html: 'document.addEventListener("kpsdk-load", function() { window.KPSDK.configure(' + kpEndpointConfig + '); });'
                        }}
                    />
                    <script
                        async
                        src='/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/p.js'
                    />
                </>
            )}

            <script
                async
                src={'/js/ufe/isomorphic/thirdparty/fp.min.js'}
            ></script>

            {Sephora.buildMode === FE_BUILD_MODE ? (
                <script src='/js/ufe/frontend/main.headScript.js' />
            ) : (
                <script dangerouslySetInnerHTML={{ __html: mainHeadScript }} />
            )}

            {Sephora.buildMode === FE_BUILD_MODE ? (
                <script src='/js/ufe/frontend/p13n.headScript.js' />
            ) : (
                <script dangerouslySetInnerHTML={{ __html: p13nHeadScript }} />
            )}

            {isConstructorEnabledPage && isNLPInstrumentationEnabled && isSearchPage && (
                <script
                    async
                    src={`https://cnstrc.com/js/cust/${isUfeEnvProduction ? 'sephora_L16704' : 'sephora_stage_L16704'}.js`}
                />
            )}

            {isConstructorEnabledPage && isNLPInstrumentationEnabled && !isSearchPage && (
                <script
                    defer
                    src={`https://cnstrc.com/js/cust/${isUfeEnvProduction ? 'sephora_L16704' : 'sephora_stage_L16704'}.js`}
                />
            )}

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        process = {
                            env: {
                                NODE_ENV:'${process.env.NODE_ENV}',
                                UFE_ENV:'${global.process.env.UFE_ENV}'
                            }
                        };
                        Sephora.analytics.backendData.mediaId = '${props.mediaId}';
                        Sephora.analytics.backendData.pageType = '${template}';
                        Sephora.buildMode = '${Sephora.buildMode}';
                        Sephora.debug.displayAutomationAttr = ${Sephora.debug.displayAutomationAttr};
                        Sephora.debug.showRootComps = ${Sephora.debug.showRootComps};
                        Sephora.emotionIds = '[[__SEPHORA_GENERATED_IDS__]]';
                        Sephora.fantasticPlasticConfigurations = ${JSON.stringify(props.fantasticPlasticConfigurations)};
                        Sephora.imageHost = '${Sephora.imageHost}';
                        Sephora.isLazyLoadEnabled = ${Sephora.isLazyLoadEnabled};
                        Sephora.isSEOForCanadaEnabled = ${props.isSEOForCanadaEnabled};
                        Sephora.mainBundlePath = '${Sephora.mainBundlePath}';
                        Sephora.priorityChunkPath = '${Sephora.priorityChunkPath}';
                        Sephora.componentsChunkPath = '${Sephora.componentsChunkPath}';
                        Sephora.commonsChunkPath = '${Sephora.commonsChunkPath}';
                        Sephora.postloadChunkPath = '${Sephora.postloadChunkPath}';
                        Sephora.mboxAttrs = ${JSON.stringify(props.mboxAttrs)};
                        Sephora.thirdPartyImageHost = '${props.thirdPartyImageHost}';
                        Sephora.UFE_ENV = '${global.process.env.UFE_ENV}';
                        Sephora.isCanaryRelease = ${Sephora.isCanaryRelease};
                    `
                }}
            />

            {isSearchPage ? (
                Sephora.buildMode === FE_BUILD_MODE ? (
                    <script src='/js/ufe/frontend/search.headScript.js' />
                ) : (
                    <script dangerouslySetInnerHTML={{ __html: searchHeadScript }} />
                )
            ) : null}

            <script
                async
                src={'/js/ufe/isomorphic/thirdparty/VisitorAPI.js'}
            ></script>
            <script
                async
                src={'/js/ufe/isomorphic/thirdparty/at.js'}
            ></script>

            {!props.isHeaderFooterRender &&
                (() => {
                    const atProperty = isUfeEnvProduction ? '5e551ed8-0777-fd73-c0dd-8786e3153e45' : 'df068790-2ea9-3c8b-d62b-9e7ab5d41890';

                    return (
                        <script
                            id='setAtProperty'
                            dangerouslySetInnerHTML={{
                                __html: `function targetPageParams() {return {'at_property': '${atProperty}'};}`
                            }}
                        />
                    );
                })()}

            {/* Run script when page is loaded, it's not depends on our Perf scripts initialization */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.addEventListener('DOMContentLoaded', () => {
                            const refImageUrl = '/img/ufe/icons/me-active.svg';
                            const refImage = document.querySelector('img[src="' + refImageUrl + '"]');
                            if (refImage) {
                                refImage.addEventListener('load', () => {
                                    const resourceTimings = performance.getEntriesByType('resource');
                                    const resource = resourceTimings.find(entry => entry.name.includes(refImageUrl));
                                    const imageTransferSize = resource?.transferSize || 0; // gettings the transfer size of the image
                                    Sephora.isNewUser = imageTransferSize > 0;
                                });
                        
                                // If the image is already loaded (e.g., cached by the browser), manually trigger the load event
                                if (refImage.complete && refImage.naturalWidth > 0) {
                                    refImage.dispatchEvent(new Event('load'));
                                }
                            } else {
                                console.warn('[Sephora.isNewUser] Image not found: [' + refImageUrl + ']');
                            }
                        });`
                }}
            />

            {/* to do: replace domain strings with variables */}
            <script
                async
                fetchpriority='high'
                src={Sephora.mainBundlePath}
            />

            {priorityPage ? (
                <>
                    <link
                        rel='preload'
                        as='script'
                        href={Sephora.priorityChunkPath}
                    />
                    <link
                        rel='preload'
                        as='script'
                        href={Sephora.commonsChunkPath}
                    />
                </>
            ) : (
                <>
                    <link
                        rel='preload'
                        as='script'
                        href={Sephora.componentsChunkPath}
                    />
                    <link
                        rel='preload'
                        as='script'
                        href={Sephora.commonsChunkPath}
                    />
                </>
            )}

            {/*
             * End First Load Items
             ****************************/}

            <style>[[__SEPHORA_GENERATED_CSS__]]</style>

            {isUfeEnvLocal &&
                (Sephora.buildMode === FE_BUILD_MODE ? (
                    <script src='/js/ufe/frontend/local-mpulse.headScript.js' />
                ) : (
                    <script dangerouslySetInnerHTML={{ __html: localImpuseHeadScript }} />
                ))}

            {enableDynatraceRUM === true && currentEnv ? (
                <script
                    async
                    type='text/javascript'
                    src={DYNATRACE_URLS[currentEnv]}
                    crossOrigin='anonymous'
                />
            ) : null}

            {isNewRwdBuyPage ? (
                <link
                    rel='stylesheet'
                    href='https://sephora.optiversal.com/assets/optiversal_custom.css'
                    type='text/css'
                    crossOrigin='anonymous'
                />
            ) : null}
        </head>
    );
};

export default wrapFunctionalComponent(Head, 'Head');
