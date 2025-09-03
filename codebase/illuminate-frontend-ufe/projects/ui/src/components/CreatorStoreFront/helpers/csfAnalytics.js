import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

const CSF_PAGE_NAME_MAP = {
    [CSF_PAGE_TYPES.FEATURED]: 'creatorstorefront:landing:n/a:*',
    [CSF_PAGE_TYPES.PRODUCTS]: 'creatorstorefront:product:n/a:*',
    [CSF_PAGE_TYPES.COLLECTIONS]: 'creatorstorefront:collections:n/a:*',
    [CSF_PAGE_TYPES.POSTS]: 'creatorstorefront:posts:n/a:*',
    [CSF_PAGE_TYPES.POST]: 'creatorstorefront:posts:detail:*',
    [CSF_PAGE_TYPES.COLLECTION]: 'creatorstorefront:collections:detail:*'
};

/**
 * Gets the appropriate page name for CSF analytics
 * @param {string} pageType - The CSF page type
 * @returns {string} The analytics page name
 */
export const getCSFPageName = pageType => {
    // Direct mapping for all page types including detail pages
    return CSF_PAGE_NAME_MAP[pageType] || CSF_PAGE_NAME_MAP[CSF_PAGE_TYPES.FEATURED];
};

/**
 * Sets the digitalData page info for CSF
 * @param {string} pageType - The CSF page type
 */
export const setDigitalDataPageInfo = pageType => {
    const pageName = getCSFPageName(pageType);

    // Set the pageName in digitalData for consistency - both locations
    if (digitalData?.page?.attributes?.sephoraPageInfo) {
        digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
    }

    // Also need to set in the pageInfo so general analytics can access it and NOT overwrite it
    if (digitalData?.page?.pageInfo) {
        digitalData.page.pageInfo.pageName = pageName;
    }
};

export default {
    setDigitalDataPageInfo,
    getCSFPageName
};
