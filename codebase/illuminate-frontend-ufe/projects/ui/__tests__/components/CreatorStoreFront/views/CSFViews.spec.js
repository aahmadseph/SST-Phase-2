import { csfRouteComponents, csfDynamicRoutes } from 'components/CreatorStoreFront/views/CSFViews';
import Featured from 'components/CreatorStoreFront/views/Featured';
import Posts from 'components/CreatorStoreFront/views/Posts';
import Collections from 'components/CreatorStoreFront/views/Collections';
import PostDetails from 'components/CreatorStoreFront/views/PostDetails';
import CollectionDetails from 'components/CreatorStoreFront/views/CollectionDetails';
import Products from 'components/CreatorStoreFront/views/Products';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

describe('CSFViews module', () => {
    test('should export static routes with correct component mapping', () => {
        expect(csfRouteComponents).toBeDefined();
        expect(csfRouteComponents['']).toBe(Featured);
        expect(csfRouteComponents[CSF_PAGE_TYPES.FEATURED]).toBe(Featured);
        expect(csfRouteComponents[CSF_PAGE_TYPES.POSTS]).toBe(Posts);
        expect(csfRouteComponents[CSF_PAGE_TYPES.COLLECTIONS]).toBe(Collections);
        expect(csfRouteComponents[CSF_PAGE_TYPES.PRODUCTS]).toBe(Products);
    });

    test('should export dynamic routes with correct component mapping', () => {
        expect(csfDynamicRoutes).toBeDefined();
        expect(csfDynamicRoutes[`${CSF_PAGE_TYPES.POSTS}/:postId`]).toBe(PostDetails);
        expect(csfDynamicRoutes[`${CSF_PAGE_TYPES.COLLECTIONS}/:collectionId`]).toBe(CollectionDetails);
    });
});
