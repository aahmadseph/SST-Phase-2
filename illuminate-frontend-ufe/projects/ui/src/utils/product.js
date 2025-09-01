import imageUtils from '../utils/Image';
import bccUtils from '../utils/BCC';
import * as PMConstant from '../components/ProductPage/ProductMediaCarousel/constants';
import anaConsts from '../analytics/constants';
import { supplementAltTextWithProduct } from '../utils/Accessibility';
import JsUtils from '../utils/javascript';
import LocaleUtils from '../utils/LanguageLocale';
import SkuUtils from '../utils/Sku';
import * as sponsoredProductsConstants from 'constants/sponsoredProducts';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import urlUtils from 'utils/Url';

const {
    getImagePath, buildQuery, getParams, addParam, removeParam, getParamsByName
} = urlUtils;
const { IMAGE_SIZES } = bccUtils;
const { getImageSrc } = imageUtils;
const {
    IMAGE_SIZES: { SMALL, LARGE, ZOOM }
} = PMConstant;
const {
    MEDIA_TYPE: { IMAGE, VIDEO }
} = anaConsts;

const buildProductImageSrc = ({
    skuImages, src, badge, hideBadge, id, size, generateSrcs
}) => {
    const srcWithParams = skuImages
        ? skuImages['image' + IMAGE_SIZES['450']] || skuImages.image || skuImages.imageUrl || skuImages['image' + IMAGE_SIZES['250']] || src
        : src;
    const urlParams = srcWithParams ? getParams(srcWithParams) : {};
    const filePath = skuImages?.imageUrl?.split('?')[0] || `/productimages/sku/s${id}-main-zoom.jpg`;
    let imageSrc = src || `${filePath}${buildQuery(JsUtils.buildMap(urlParams))}`;

    if (hideBadge) {
        imageSrc = removeParam(imageSrc, 'pb');
    } else if (badge) {
        if (!imageSrc.includes('pb=')) {
            imageSrc = addParam(imageSrc, 'pb', badge);
        }
    }

    const sizes = Array.isArray(size) ? size.slice(1) : null;
    let imageSrcX1 = '';
    let imageSrcX2 = '';

    if (generateSrcs) {
        const newImageSize = sizes ? size[0] : size;
        imageSrcX1 = getImageSrc(imageSrc, newImageSize);
        imageSrcX2 = getImageSrc(imageSrc, newImageSize * 2);
    }

    return [imageSrc, sizes, imageSrcX1, imageSrcX2];
};

const buildProductHeroImageSrc = (item, isMobile = false) => {
    let src = getImagePath(SkuUtils.getImgSrc(ZOOM, item.media));
    const size = isMobile ? SMALL : LARGE;
    src = removeParam(src, 'pb');
    const symbol = Object.keys(getParams(src)).length ? '&' : '?';
    const imageSource = `${src + symbol}imwidth=${size}`;
    const imageSourceX2 = `${src + symbol}imwidth=${size * 2}`;

    return [imageSource, imageSourceX2];
};

const getMediaItems = product => {
    /* eslint-disable prefer-const */
    let { currentSku, hoveredSku, productVideos = [] } = product;
    let { alternateImages = [], skuImages } = hoveredSku || currentSku || {};
    /* eslint-enable prefer-const */

    const altText = supplementAltTextWithProduct(currentSku, product);

    // Hero Image
    let mediaListItems = skuImages
        ? [
            {
                type: IMAGE,
                media: skuImages
            }
        ]
        : [];

    // 2nd slot is for Sephora Virtual Artist, if enabled
    if (mediaListItems.length) {
        mediaListItems[0].media.altText = altText;

        if (Array.isArray(alternateImages) && alternateImages.length) {
            alternateImages = alternateImages.slice();
            mediaListItems.push({
                type: IMAGE,
                media: alternateImages.shift()
            });
        }
    }

    // Next slot is for First Product video (only for Desktop)
    productVideos = productVideos.slice();

    // Display certain videos for FR CA:
    if (productVideos.length) {
        productVideos = productVideos.filter(
            item =>
                !item.styleList ||
                (LocaleUtils.isFRCanada() && item.styleList['FR_CA_SHOW'] !== undefined) ||
                (!LocaleUtils.isFRCanada() && item.styleList['FR_CA_HIDE'] !== undefined)
        );
    }

    if (productVideos.length) {
        mediaListItems.push({
            type: VIDEO,
            media: productVideos.shift()
        });
    }

    // All the Alt images go next
    alternateImages = alternateImages.slice();
    mediaListItems = mediaListItems.concat(
        alternateImages.map(item => ({
            type: IMAGE,
            media: item
        }))
    );

    // All the remaining videos
    productVideos = productVideos.map(item => ({
        type: VIDEO,
        media: item
    }));

    mediaListItems = mediaListItems.concat(productVideos);

    return mediaListItems;
};

// Gets the sponsored information from the product
const productSponsoredInformation = product => {
    return {
        sku: product?.currentSku || '',
        sponsored: product?.sponsored || false,
        clickTrackerId: product && safelyReadProp(sponsoredProductsConstants.CLICK_TRACKER_ID_FIELD, product),
        impressionTrackerId: product?.impression_id || '',
        impressionPayload: product?.impression_payload || '',
        clickPayload: product?.click_payload || '',
        isSponsoredProduct: product?.sponsored || false,
        onloadPayload: product?.onload_payload || '',
        wishlistPayload: product?.wishlist_payload || '',
        basketPayload: product?.basket_payload || '',
        viewableImpressionPayload: product?.viewable_impression_payload || ''
    };
};

// Gets an object with the required tracking information
const productViewableImpressionTrackingInformation = product => {
    const {
        sku,
        impressionTrackerId,
        impressionPayload,
        isSponsoredProduct,
        onloadPayload,
        clickPayload,
        wishlistPayload,
        basketPayload,
        viewableImpressionPayload
    } = productSponsoredInformation(product);

    return {
        skuId: sku,
        isSponsoredProduct,
        impressionTrackerId,
        impressionPayload,
        onloadPayload,
        clickPayload,
        wishlistPayload,
        basketPayload,
        viewableImpressionPayload
    };
};

// Gets an object with the required tracking information
const productClickTrackingInformation = product => {
    const {
        sku,
        clickTrackerId,
        impressionTrackerId,
        impressionPayload,
        clickPayload,
        isSponsoredProduct,
        onloadPayload,
        wishlistPayload,
        basketPayload,
        viewableImpressionPayload
    } = productSponsoredInformation(product);

    return {
        skuId: sku,
        isSponsoredProduct,
        clickTrackerId,
        impressionTrackerId,
        impressionPayload,
        clickPayload,
        onloadPayload,
        wishlistPayload,
        basketPayload,
        viewableImpressionPayload
    };
};

// Extracts the Click Tracker information from an RMN product (PIQ API Call for Sponsor Products)
const getClickTrackerInformation = product => {
    let clickTrackerId = '',
        clickPayload = '';

    if (product) {
        // Extracts the Click Tracker Id
        clickTrackerId = getParamsByName(sponsoredProductsConstants.CLICK_TRACKER_ID_API_FIELD, product?.click_tracker || null);
        clickTrackerId = Array.isArray(clickTrackerId) && clickTrackerId.length > 0 ? clickTrackerId[0] : '';

        // Extracts the Click Tracker Payload
        clickPayload = getParamsByName(sponsoredProductsConstants.CLICK_TRACKER_PAYLOAD_API_FIELD, product?.click_tracker || null);
        clickPayload = Array.isArray(clickPayload) && clickPayload.length > 0 ? clickPayload[0] : '';
    }

    return {
        clickTrackerId,
        clickPayload
    };
};

const findProductRootParentCategoryId = parentCategory => {
    if (!parentCategory) {
        return null;
    }

    if (!parentCategory.parentCategory) {
        return parentCategory.categoryId;
    }

    return findProductRootParentCategoryId(parentCategory.parentCategory);
};

const findProductRootParentCategoryName = parentCategory => {
    if (!parentCategory) {
        return null;
    }

    if (!parentCategory.parentCategory) {
        return parentCategory.displayName;
    }

    return findProductRootParentCategoryName(parentCategory.parentCategory);
};

export default {
    buildProductHeroImageSrc,
    buildProductImageSrc,
    getMediaItems,
    productViewableImpressionTrackingInformation,
    productClickTrackingInformation,
    getClickTrackerInformation,
    findProductRootParentCategoryId,
    findProductRootParentCategoryName
};
