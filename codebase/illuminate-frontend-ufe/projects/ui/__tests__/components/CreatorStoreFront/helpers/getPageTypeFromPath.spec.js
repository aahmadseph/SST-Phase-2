import getPageTypeFromPath from 'components/CreatorStoreFront/helpers/getPageTypeFromPath';
import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

// Mock dependencies
jest.mock('components/CreatorStoreFront/helpers/getCsfRoute', () => ({
    getCsfRoute: jest.fn()
}));

describe('getPageTypeFromPath', () => {
    test('should return FEATURED for empty path', () => {
        getCsfRoute.mockReturnValue({});
        const result = getPageTypeFromPath('');
        expect(result).toBe(CSF_PAGE_TYPES.FEATURED);
    });

    test('should return POST for post detail paths', () => {
        getCsfRoute.mockReturnValue({
            section: CSF_PAGE_TYPES.POSTS,
            identifier: 'post123'
        });

        const result = getPageTypeFromPath('/creators/testuser/posts/post123');
        expect(result).toBe(CSF_PAGE_TYPES.POST);
    });

    test('should return COLLECTION for collection detail paths', () => {
        getCsfRoute.mockReturnValue({
            section: CSF_PAGE_TYPES.COLLECTIONS,
            identifier: 'coll123'
        });

        const result = getPageTypeFromPath('/creators/testuser/collections/coll123');
        expect(result).toBe(CSF_PAGE_TYPES.COLLECTION);
    });

    test('should return POSTS for posts list path', () => {
        getCsfRoute.mockReturnValue({
            section: CSF_PAGE_TYPES.POSTS,
            identifier: ''
        });

        const result = getPageTypeFromPath('/creators/testuser/posts');
        expect(result).toBe(CSF_PAGE_TYPES.POSTS);
    });

    test('should return COLLECTIONS for collections list path', () => {
        getCsfRoute.mockReturnValue({
            section: CSF_PAGE_TYPES.COLLECTIONS,
            identifier: ''
        });

        const result = getPageTypeFromPath('/creators/testuser/collections');
        expect(result).toBe(CSF_PAGE_TYPES.COLLECTIONS);
    });

    test('should return PRODUCTS for products path', () => {
        getCsfRoute.mockReturnValue({
            section: CSF_PAGE_TYPES.PRODUCTS,
            identifier: ''
        });

        const result = getPageTypeFromPath('/creators/testuser/products');
        expect(result).toBe(CSF_PAGE_TYPES.PRODUCTS);
    });

    test('should fallback to FEATURED for unknown section', () => {
        getCsfRoute.mockReturnValue({
            section: 'unknown',
            identifier: ''
        });

        const result = getPageTypeFromPath('/creators/testuser/unknown');
        expect(result).toBe(CSF_PAGE_TYPES.FEATURED);
    });

    test('should handle null route return', () => {
        getCsfRoute.mockReturnValue(null);
        const result = getPageTypeFromPath('/invalid/path');
        expect(result).toBe(CSF_PAGE_TYPES.FEATURED);
    });
});
