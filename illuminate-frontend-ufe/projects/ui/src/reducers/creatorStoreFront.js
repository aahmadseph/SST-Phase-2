import {
    SET_FEATUREDPAGE_DATA,
    SET_COLLECTIONSPAGE_DATA,
    SET_COLLECTIONPAGE_DATA, // SINGULAR PAGE
    SET_POSTSPAGE_DATA,
    SET_PRODUCTSPAGE_DATA,
    SET_CREATOR_PROFILE_DATA,
    CSF_PAGE_TYPES,
    SET_POSTPAGE_DATA,
    SET_UPDATED_PRODUCT_DATA,
    SET_UPDATED_COLLECTION_PRODUCT_DATA
} from 'constants/actionTypes/creatorStoreFront';

const initialState = {
    creatorStoreFrontData: null
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_FEATUREDPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.FEATURED,
                    featuredPageData: payload
                }
            };
        }
        case SET_COLLECTIONSPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.COLLECTIONS,
                    collectionsPageData: payload
                }
            };
        }
        case SET_COLLECTIONPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.COLLECTION,
                    collectionPageData: payload
                }
            };
        }
        case SET_POSTSPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.POSTS,
                    postsPageData: payload
                }
            };
        }
        case SET_POSTPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.POST,
                    postPageData: payload
                }
            };
        }
        case SET_PRODUCTSPAGE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    pageType: CSF_PAGE_TYPES.PRODUCTS,
                    productsPageData: payload
                }
            };
        }
        case SET_CREATOR_PROFILE_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    creatorProfileData: payload
                }
            };
        }
        case SET_UPDATED_COLLECTION_PRODUCT_DATA: {
            return {
                ...state,
                creatorStoreFrontData: {
                    ...state.creatorStoreFrontData,
                    collectionPageData: {
                        ...state.creatorStoreFrontData.collectionPageData,
                        products: [...state.creatorStoreFrontData.collectionPageData.products, ...payload.products]
                    }
                }
            };
        }
        case SET_UPDATED_PRODUCT_DATA: {
            if (state.creatorStoreFrontData.pageType === CSF_PAGE_TYPES.FEATURED) {
                const prevSection = state.creatorStoreFrontData.featuredPageData.productSection || {};

                return {
                    ...state,
                    creatorStoreFrontData: {
                        ...state.creatorStoreFrontData,
                        featuredPageData: {
                            ...state.creatorStoreFrontData.featuredPageData,
                            productSection: {
                                ...prevSection,
                                products: [...(prevSection.products || []), ...payload.products]
                            }
                        }
                    }
                };
            }

            if (state.creatorStoreFrontData.pageType === CSF_PAGE_TYPES.PRODUCTS) {
                return {
                    ...state,
                    creatorStoreFrontData: {
                        ...state.creatorStoreFrontData,
                        productsPageData: {
                            ...state.creatorStoreFrontData.productsPageData,
                            products: [...state.creatorStoreFrontData.productsPageData.products, ...payload.products]
                        }
                    }
                };
            }

            return state;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
