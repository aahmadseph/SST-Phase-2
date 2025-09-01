// components/CreatorStoreFront/csfViews.js
import Featured from 'components/CreatorStoreFront/views/Featured';
import Posts from 'components/CreatorStoreFront/views/Posts';
import Collections from 'components/CreatorStoreFront/views/Collections';
import PostDetails from 'components/CreatorStoreFront/views/PostDetails';
import CollectionDetails from 'components/CreatorStoreFront/views/CollectionDetails';
import Products from 'components/CreatorStoreFront/views/Products';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

export const csfRouteComponents = {
    '': Featured,
    [CSF_PAGE_TYPES.FEATURED]: Featured,
    [CSF_PAGE_TYPES.POSTS]: Posts,
    [CSF_PAGE_TYPES.COLLECTIONS]: Collections,
    [CSF_PAGE_TYPES.PRODUCTS]: Products
};

// For deeper dynamic routes
export const csfDynamicRoutes = {
    [`${CSF_PAGE_TYPES.POSTS}/:postId`]: PostDetails,
    [`${CSF_PAGE_TYPES.COLLECTIONS}/:collectionId`]: CollectionDetails
};
