import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import StringUtils from 'utils/String';

const getBreadcrumbsForRoute = ({ pageData = {}, creatorProfileData = {}, pathname = '', localization = {} }) => {
    const routePath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const { section, handle, identifier } = getCsfRoute(routePath);
    const firstName = creatorProfileData?.firstName || creatorProfileData?.creatorProfile?.firstName || handle;

    const MAIN_SECTIONS = [CSF_PAGE_TYPES.FEATURED, CSF_PAGE_TYPES.POSTS, CSF_PAGE_TYPES.PRODUCTS, CSF_PAGE_TYPES.COLLECTIONS, ''];

    if (MAIN_SECTIONS.includes(section) && !identifier) {
        return null;
    }

    const buildBreadcrumb = (parentLabel, parentHref, currentLabel) => [
        {
            label: parentLabel,
            action: { href: parentHref, isCurrent: false }
        },
        {
            label: currentLabel,
            action: { isCurrent: true }
        }
    ];

    // Post detail route
    if (section === CSF_PAGE_TYPES.POSTS && identifier) {
        const postTitle = pageData?.postContent?.title || handle;

        return buildBreadcrumb(StringUtils.format(localization.postsOf, firstName), `/creators/${handle}/posts`, postTitle);
    }

    // Collection detail route
    if (section === CSF_PAGE_TYPES.COLLECTIONS && identifier) {
        const collectionTitle = pageData?.collectionContent?.collectionTitle || handle;

        return buildBreadcrumb(localization.collections, `/creators/${handle}/collections`, collectionTitle);
    }

    return null;
};

export default getBreadcrumbsForRoute;
