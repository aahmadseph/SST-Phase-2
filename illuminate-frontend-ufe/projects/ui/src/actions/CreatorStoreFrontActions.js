/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import Actions from 'actions/Actions';
import PageActionCreators from 'actions/framework/PageActionCreators';
import getCreatorProfileData from 'services/api/creatorStoreFront/getCreatorProfileData';
import getFeaturedPageData from 'services/api/creatorStoreFront/getFeaturedPageData';
import getCollectionsPageData from 'services/api/creatorStoreFront/getCollectionsPageData';
import getProductsPageData from 'services/api/creatorStoreFront/getProductsPageData';
import getPostsPageData from 'services/api/creatorStoreFront/getPostsPageData';
import {
    SET_CREATOR_PROFILE_DATA,
    CSF_PAGE_TYPES,
    SET_UPDATED_PRODUCT_DATA,
    SET_UPDATED_COLLECTION_PRODUCT_DATA,
    SET_CURRENT_TAB
} from 'constants/actionTypes/creatorStoreFront';
import getPostSpecificData from 'services/api/creatorStoreFront/getPostSpecificData';
import getCollectionSpecificData from 'services/api/creatorStoreFront/getCollectionSpecificData';
import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import { setDigitalDataPageInfo } from 'components/CreatorStoreFront/helpers/csfAnalytics';
import helpersUtils from 'utils/Helpers';

const { showInterstice } = Actions;
const { deferTaskExecution } = helpersUtils;

const FETCH_METHODS = {
    [CSF_PAGE_TYPES.FEATURED]: getFeaturedPageData,
    [CSF_PAGE_TYPES.COLLECTIONS]: getCollectionsPageData,
    [CSF_PAGE_TYPES.PRODUCTS]: getProductsPageData,
    [CSF_PAGE_TYPES.POSTS]: getPostsPageData,
    [CSF_PAGE_TYPES.POST]: getPostSpecificData,
    [CSF_PAGE_TYPES.COLLECTION]: getCollectionSpecificData
};

class CreatorStoreFrontActionCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    setPageData = (pageType, payload) => {
        return {
            type: `SET_${pageType.toUpperCase()}PAGE_DATA`,
            payload
        };
    };

    setCreatorProfileData = payload => {
        return {
            type: SET_CREATOR_PROFILE_DATA,
            payload
        };
    };

    setUpdatedProductsData = payload => {
        return {
            type: SET_UPDATED_PRODUCT_DATA,
            payload
        };
    };

    setUpdatedCollectionProductsData = payload => {
        return {
            type: SET_UPDATED_COLLECTION_PRODUCT_DATA,
            payload
        };
    };

    async fetchPageData(pageType, routeParams = {}) {
        const fetchMethod = FETCH_METHODS[pageType];

        if (!fetchMethod) {
            throw new Error(`No fetch method defined for page type: ${pageType}`);
        }

        try {
            let response;

            // Handle special cases that need parameters
            if (pageType === CSF_PAGE_TYPES.POST) {
                response = await fetchMethod(routeParams.identifier, routeParams.handle);
            } else if (pageType === CSF_PAGE_TYPES.COLLECTION) {
                response = await fetchMethod(routeParams.identifier, routeParams.handle);
            } else {
                response = await fetchMethod(routeParams.handle);
            }

            return response?.data || null;
        } catch (error) {
            Sephora.logger.verbose(`Error fetching data for ${pageType} page`, error);
            throw error;
        }
    }

    async fetchMoreProductsData(creatorHandle, pageNum) {
        return async dispatch => {
            dispatch(showInterstice(true));

            try {
                const { data } = await FETCH_METHODS[CSF_PAGE_TYPES.PRODUCTS](creatorHandle, pageNum);

                dispatch(this.setUpdatedProductsData(data));
            } catch (err) {
                return Promise.reject(err);
            } finally {
                dispatch(showInterstice(false));
            }
        };
    }

    async fetchCollectionMoreProductsData(collectionId, creatorHandle, pageNum) {
        return async dispatch => {
            dispatch(showInterstice(true));

            const fetchMethod = FETCH_METHODS[CSF_PAGE_TYPES.COLLECTION];
            try {
                const { data } = await fetchMethod(collectionId, creatorHandle, pageNum);

                dispatch(this.setUpdatedCollectionProductsData(data));
            } catch (err) {
                return Promise.reject(err);
            } finally {
                dispatch(showInterstice(false));
            }
        };
    }

    async fetchCreatorProfileData(creatorHandle) {
        try {
            if (!creatorHandle) {
                throw new Error('Creator handle is required but was not provided');
            }

            const response = await getCreatorProfileData(creatorHandle);

            return response?.data || null;
        } catch (error) {
            Sephora.logger.verbose('Error fetching data for creator profile', error);
            throw error;
        }
    }

    initializeCSFPageData = (pageType = CSF_PAGE_TYPES.FEATURED, path) => {
        return async dispatch => {
            dispatch(showInterstice(true));

            try {
                // Get route parameters from the path if provided
                const routeParams = path ? getCsfRoute(path) : typeof window !== 'undefined' ? getCsfRoute(window.location.pathname) : {};

                const data = await this.fetchPageData(pageType, routeParams);

                dispatch(
                    this.setPageData(pageType, {
                        ...data,
                        pageType
                    })
                );

                // Track CSF page view analytics for hard/direct page loads
                if (typeof window !== 'undefined') {
                    deferTaskExecution(() => {
                        setDigitalDataPageInfo(pageType);
                    });
                }
            } catch (err) {
                return Promise.reject(err);
            } finally {
                dispatch(showInterstice(false));
            }
        };
    };

    initializeCSFCreatorProfileData = creatorHandleParam => async dispatch => {
        dispatch(showInterstice(true));
        try {
            let creatorHandle = creatorHandleParam;

            if (!creatorHandle) {
                // Fallback to getting handle from URL if not provided
                const routeParams = typeof window !== 'undefined' ? getCsfRoute(window.location.pathname) : {};

                creatorHandle = routeParams.handle;
            }

            if (!creatorHandle) {
                throw new Error('Creator handle is required but was not provided');
            }

            const data = await this.fetchCreatorProfileData(creatorHandle);

            dispatch(this.setCreatorProfileData(data));
        } catch (err) {
            return Promise.reject(err);
        } finally {
            dispatch(showInterstice(false));
        }
    };

    setCurrentTab = tabName => {
        return dispatch => {
            dispatch({
                type: SET_CURRENT_TAB,
                payload: tabName
            });
        };
    };
}

const CreatorStoreFrontActions = new CreatorStoreFrontActionCreators();

export default CreatorStoreFrontActions;
