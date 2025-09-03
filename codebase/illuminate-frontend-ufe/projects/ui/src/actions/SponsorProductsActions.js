import { SET_SPONSOR_PRODUCTS, RESET_SPONSOR_PRODUCTS, SET_SPONSOR_PRODUCTS_FAILURE } from 'constants/actionTypes/sponsorProducts';
import getSponsoredProducts from 'services/api/sponsoredProducts/sponsoredProducts';
import { MAX_SPONSOR_PRODUCT_COUNT, PAGE_TYPES } from 'constants/sponsoredProducts';
import PageTemplateType from 'constants/PageTemplateType';
import catalogUtils from 'utils/Catalog';
import spaUtils from 'utils/Spa';
import cookieUtils from 'utils/Cookies';
import rmnUtils from 'utils/rmn';
import rmnAndPlas from 'utils/rmnAndPla';

const { transformSponsoredProductsResponse, getSlotId } = rmnUtils;

// Calculates the sponsor count using the list of available positions in the grid
const calculateSponsorCount = (productCount = 0) => {
    const sponsorCount = Math.floor(productCount / 4);

    // Max count accepted is 12
    return sponsorCount > MAX_SPONSOR_PRODUCT_COUNT ? MAX_SPONSOR_PRODUCT_COUNT : sponsorCount;
};

const getSponsorProducts = opts => dispatch => {
    const { targetUrl, products, categoryId, attributes = {} } = opts;
    const template = Sephora.template;

    // Gets the current category from the page template
    const { routes } = spaUtils.getSpaTemplateInfoByTemplate(template) || {};

    // Defines the Page Type
    const isSearchPage = template === PageTemplateType.Search;
    const isPPage = template === PageTemplateType.ProductPage;
    const pageType = isSearchPage ? PAGE_TYPES.SEARCH : isPPage ? PAGE_TYPES.PRODUDCT_DETAIL_PAGE : PAGE_TYPES.BROWSE;

    const productCount = products?.length || 0;
    const category = catalogUtils.getCatalogName(targetUrl, routes?.[0]);

    const count = calculateSponsorCount(productCount);
    const slot = getSlotId(pageType);

    // Uses the first 10 products for the api call
    const matchProducts = products ? products.map(product => product?.productId || '').slice(0, 10) : [];

    // prettier-ignore
    const targets = isSearchPage ? {
        'match_products': matchProducts,
        ...(attributes && Object.keys(attributes).length > 0 && { attributes })
    } : { category: [category] };

    dispatch({ type: RESET_SPONSOR_PRODUCTS });

    const callService = isSearchPage ? matchProducts.length > 0 : Boolean(category);

    if (cookieUtils.read(cookieUtils.KEYS.SEPH_SESSION) && callService) {
        // prettier-ignore
        getSponsoredProducts({
            targets,
            'category_id': !isSearchPage ? categoryId : undefined,
            slot,
            count,
            'count_fill': count
        }).then(response => {

            if (response.responseStatus === 200) {
                // Fires the On-Load tracking event
                rmnAndPlas.fireAdPlacementOnLoadEvent(response);

                let sponsorProductsResponse = response;

                if (Sephora.configurationSettings.smnBrowseCombinedCallEnabled) {
                    sponsorProductsResponse = response['pla.any'] || [];
                }

                dispatch({
                    type: SET_SPONSOR_PRODUCTS,
                    payload: transformSponsoredProductsResponse(sponsorProductsResponse)
                });
            } else {
                dispatch({
                    type: SET_SPONSOR_PRODUCTS,
                    payload: []
                });
            }
        }).catch(() => {
            dispatch({
                type: SET_SPONSOR_PRODUCTS,
                payload: []
            });
        });
    } else {
        dispatch({
            type: SET_SPONSOR_PRODUCTS_FAILURE
        });
    }
};

const resetSponsorProducts = () => dispatch => {
    dispatch({ type: RESET_SPONSOR_PRODUCTS });
    digitalData.page.category.sponsoredProducts = [];
};

export default { getSponsorProducts, resetSponsorProducts };
