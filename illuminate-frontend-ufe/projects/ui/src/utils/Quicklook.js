import store from 'store/Store';
import Actions from 'Actions';
import snbApi from 'services/api/search-n-browse';
import ErrorsUtils from 'utils/Errors';
import helperUtils from 'utils/Helpers';
import quickLookBindings from 'analytics/bindingMethods/pages/all/quickLookBindings';

const { getProp } = helperUtils;

function dispatchQuicklook({
    productId,
    skuType,
    options,
    sku,
    rootContainerName,
    productStringContainerName,
    origin,
    analyticsContext,
    isDisabled,
    categoryProducts = [],
    isArrowEvent,
    displayLoadingModal,
    updateCurrentSku,
    isSponsoredProduct,
    clickTrackerId,
    impressionTrackerId,
    impressionPayload,
    clickPayload,
    isCommunityGallery = false,
    communityGalleryAnalytics,
    podId,
    isCarousel = false
}) {
    let requestOptions = options;

    if (sku.skuId) {
        requestOptions = {
            ...requestOptions,
            preferedSku: sku.skuId
        };
    }

    snbApi
        .getProductDetails(productId, sku.skuId, requestOptions, { includeTimestamp: true })
        .then(async product => {
            const worldAttribute = digitalData.page.attributes.world || 'n/a';
            const pageName = `quicklook:${product.productId}:${worldAttribute}:*pname=${product.displayName}`;
            const events = ['event24', 'event25'];
            const productString = quickLookBindings.buildProductString(product, podId);
            store.dispatch(Actions.updateQuickLookContent(product, sku));

            if (displayLoadingModal) {
                updateCurrentSku(product.currentSku);
            }

            const argumentsObj = {
                isOpen: true,
                skuType: skuType,
                sku: sku,
                error: null,
                platform: null,
                origin: origin,
                analyticsContext: analyticsContext,
                isDisabled: isDisabled,
                rootContainerName: rootContainerName,
                pageName,
                eventStrings: events,
                productStrings: productString,
                categoryProducts,
                isCommunityGallery,
                communityGalleryAnalytics
            };

            if (displayLoadingModal) {
                displayLoadingModal();
            }

            store.dispatch(Actions.showQuickLookModal(argumentsObj));
            let skuId;

            if (product && product.currentSku) {
                skuId = product.currentSku.skuId;
            }

            const anaConsts = (await import(/* webpackMode: "eager" */ 'analytics/constants')).default;
            const anaUtils = (await import(/* webpackMode: "eager" */ 'analytics/utils')).default;

            const recentEvent = anaUtils.getLastAsyncPageLoadData({ pageType: analyticsContext });

            const sponsoredProductInformation = {
                isSponsoredProduct: isSponsoredProduct || false,
                clickTrackerId: clickTrackerId || '',
                impressionTrackerId: impressionTrackerId || '',
                impressionPayload: impressionPayload || '',
                clickPayload: clickPayload || '',
                skuId
            };

            let data;

            if (isCommunityGallery) {
                const CommunityPageBindings = (
                    await import(/* webpackMode: "eager" */ 'analytics/bindingMethods/pages/community/CommunityPageBindings')
                ).default;
                CommunityPageBindings.setPageLoadAnalytics(anaConsts.PAGE_NAMES.COMMUNITY_PRODUCT_MODAL);
                const galleryPageName = `${anaConsts.PAGE_TYPES.COMMUNITY}:${anaConsts.PAGE_NAMES.COMMUNITY_PRODUCT_MODAL}:n/a:*`;
                digitalData.page.attributes.sephoraPageInfo.pageName = galleryPageName;
                const eventStrings = isCarousel
                    ? [anaConsts.Event.GALLERY_COMPONENT_INTERACTION]
                    : [anaConsts.Event.GALLERY_COMPONENT_INTERACTION, anaConsts.Event.EVENT_269];
                data = {
                    pageName: galleryPageName,
                    productStrings: CommunityPageBindings.getProductString(sku.skuId),
                    pageType: anaConsts.PAGE_TYPES.COMMUNITY,
                    pageWorld: 'n/a',
                    pageDetail: anaConsts.PAGE_NAMES.COMMUNITY_PRODUCT_MODAL,
                    previousPageName: `${anaConsts.PAGE_TYPES.COMMUNITY}:${anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX}:n/a:*`,
                    eventStrings,
                    productReviews: product.productDetails?.reviews || 'none'
                };
            } else {
                const quickLookLoad = (await import(/* webpackMode: "eager" */ 'analytics/bindings/pages/all/quickLookLoad')).default;
                data = {
                    eventName: anaConsts.QUICK_LOOK_LOAD,
                    product,
                    previousPageType: recentEvent.pageType,
                    rootContainerName,
                    productStringContainerName,
                    bindingMethods: [quickLookLoad],
                    sku: sku || (product && product.currentSku),
                    previousPageName: recentEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName'),
                    linkData: isArrowEvent ? 'quicklook:scroll more navigation' : undefined,
                    sponsoredProductInformation,
                    podId,
                    productReviews: product.productDetails?.reviews || 'none',
                    ...(isCarousel && { eventStrings: [anaConsts.Event.EVENT_269] })
                };
            }

            const processEvent = (await import(/* webpackMode: "eager" */ 'analytics/processEvent')).default;

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data
            });
        })
        .catch(errorData => {
            if (displayLoadingModal) {
                displayLoadingModal(true);
            }

            return ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
        });
}

export default { dispatchQuicklook };
