import getBreadcrumbs from 'components/CreatorStoreFront/helpers/getBreadCrumbs';
import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

// Mock dependencies
jest.mock('components/CreatorStoreFront/helpers/getCsfRoute', () => ({
    getCsfRoute: jest.fn()
}));

jest.mock('utils/String', () => ({
    format: jest.fn((template, value) => template.replace('%s', value))
}));

describe('getBreadcrumbs', () => {
    test('should return null for main routes', () => {
        // Test for featured page
        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.FEATURED,
            identifier: ''
        });

        const result = getBreadcrumbs({});
        expect(result).toBeNull();

        // Test for posts page
        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.POSTS,
            identifier: ''
        });

        const result2 = getBreadcrumbs({});
        expect(result2).toBeNull();
    });

    test('should return correct breadcrumbs for post detail page', () => {
        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.POSTS,
            identifier: 'post123'
        });

        const pageData = {
            postContent: {
                title: 'Test Post'
            }
        };

        const creatorProfileData = {
            firstName: 'John'
        };

        const localization = {
            postsOf: '%s\'s Posts',
            collections: 'Collections'
        };

        const result = getBreadcrumbs({ pageData, creatorProfileData, localization });

        expect(result).toEqual([
            {
                label: 'John\'s Posts',
                action: {
                    href: '/creators/testuser/posts',
                    isCurrent: false
                }
            },
            {
                label: 'Test Post',
                action: {
                    isCurrent: true
                }
            }
        ]);
    });

    test('should return correct breadcrumbs for collection detail page', () => {
        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.COLLECTIONS,
            identifier: 'coll123'
        });

        const pageData = {
            collectionContent: {
                collectionTitle: 'Test Collection'
            }
        };

        const localization = {
            postsOf: '%s\'s Posts',
            collections: 'Collections'
        };

        const result = getBreadcrumbs({ pageData, localization });

        expect(result).toEqual([
            {
                label: 'Collections',
                action: {
                    href: '/creators/testuser/collections',
                    isCurrent: false
                }
            },
            {
                label: 'Test Collection',
                action: {
                    isCurrent: true
                }
            }
        ]);
    });

    test('should use default titles when page data is missing', () => {
        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.POSTS,
            identifier: 'post123'
        });

        const localization = {
            postsOf: '%s\'s Posts',
            collections: 'Collections'
        };

        const result = getBreadcrumbs({ localization });

        expect(result[0].label).toBe('testuser\'s Posts');
        expect(result[1].label).toBe('testuser');
    });

    test('should handle custom pathname parameter', () => {
        const customPath = '/creators/testuser/collections/custom123';

        getCsfRoute.mockReturnValue({
            handle: 'testuser',
            section: CSF_PAGE_TYPES.COLLECTIONS,
            identifier: 'custom123'
        });

        const pageData = {
            collectionContent: {
                collectionTitle: 'Custom Collection'
            }
        };

        const localization = {
            postsOf: '%s\'s Posts',
            collections: 'Collections'
        };

        const result = getBreadcrumbs({ pageData, pathname: customPath, localization });

        expect(result[0].label).toBe('Collections');
        expect(result[1].label).toBe('Custom Collection');
    });
});
