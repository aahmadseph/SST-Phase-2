import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
class CommunityPageBindings {
    static setPageLoadAnalytics = pageName => {
        digitalData.page.pageInfo.pageName = pageName;
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.COMMUNITY;
        digitalData.page.attributes.world = 'n/a';
        digitalData.page.attributes.additionalPageInfo = '';
    };
    static geteVar129 = ({
        albumId, contentType, isIncentivized, userName, source, products, loves
    }) => {
        return `${albumId}:${contentType}:${isIncentivized}:${userName}:${source}:${products?.length || 0}:${loves}`;
    };
    static getProductsString = (products = []) => {
        if (!products.length) {
            return '';
        }

        const productStrings = products?.map(product => this.getProductString(product.sku));

        return productStrings?.join(',');
    };
    static getProductString = sku => {
        return `;${sku};;;;eVar26=${sku}`;
    };
    static setLightBoxAnalytics = (params, onScrollClickLightBox = false) => {
        this.setPageLoadAnalytics(anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX);
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.PAGE_TYPES.COMMUNITY}:${anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX}:n/a:*`,
                eVar129: this.geteVar129(params),
                productStrings: this.getProductsString(params.products),
                pageType: anaConsts.PAGE_TYPES.COMMUNITY,
                pageWorld: 'n/a',
                pageDetail: anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX,
                eventStrings: [anaConsts.Event.GALLERY_COMPONENT_INTERACTION],
                ...(onScrollClickLightBox && {
                    linkData: anaConsts.LinkData.LIGHTBOX_NAV_CLICK_GALLERY
                })
            }
        });
    };
    static setVideoPlayAnalytics = (videoName = '', videoId = '', eVar129Params = {}, eventStrings = []) => {
        if (Sephora.configurationSettings.enableVideoTrackingEvents) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    pageName: `${anaConsts.PAGE_TYPES.COMMUNITY}:${anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX}:n/a:*`,
                    videoName: [generalBindings.getSephoraPageName(), videoName, videoId].join(':'),
                    internalCampaign: anaConsts.CONTEXT.GALLERY_VIDEO,
                    actionInfo: anaConsts.ACTION_INFO.GALLERY_VIDEO_POPUP,
                    eventStrings,
                    eVar129: this.geteVar129(eVar129Params),
                    productStrings: this.getProductsString(eVar129Params.products),
                    pageWorld: 'n/a',
                    pageDetail: anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX
                }
            });
        }
    };
}

export default CommunityPageBindings;
