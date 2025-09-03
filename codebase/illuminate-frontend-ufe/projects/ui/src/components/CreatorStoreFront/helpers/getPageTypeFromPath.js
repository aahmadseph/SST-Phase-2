import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import Empty from 'constants/empty';

const VALID_PAGE_TYPES = new Set([CSF_PAGE_TYPES.FEATURED, CSF_PAGE_TYPES.PRODUCTS, CSF_PAGE_TYPES.COLLECTIONS, CSF_PAGE_TYPES.POSTS]);

const getPageTypeFromPath = (path = '') => {
    const { section = '', identifier } = getCsfRoute(path) || Empty.Object;

    // Explicitly handle single post routes
    if (section === CSF_PAGE_TYPES.POSTS && identifier) {
        return CSF_PAGE_TYPES.POST;
    }

    if (section === CSF_PAGE_TYPES.COLLECTIONS && identifier) {
        return CSF_PAGE_TYPES.COLLECTION;
    }

    // Fallback to validated set or 'featured'
    return VALID_PAGE_TYPES.has(section) ? section : CSF_PAGE_TYPES.FEATURED;
};

export default getPageTypeFromPath;
