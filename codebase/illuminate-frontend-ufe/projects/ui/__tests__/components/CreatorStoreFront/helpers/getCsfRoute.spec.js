import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';

describe('getCsfRoute', () => {
    test('should extract handle, section, and identifier from path', () => {
        const path = '/creators/johndoe/collections/123';
        const result = getCsfRoute(path);

        expect(result).toEqual({
            handle: 'johndoe',
            section: 'collections',
            identifier: '123'
        });
    });

    test('should handle path without identifier', () => {
        const path = '/creators/johndoe/collections';
        const result = getCsfRoute(path);

        expect(result).toEqual({
            handle: 'johndoe',
            section: 'collections',
            identifier: ''
        });
    });

    test('should handle creator profile path without section', () => {
        const path = '/creators/johndoe';
        const result = getCsfRoute(path);

        expect(result).toEqual({
            handle: 'johndoe',
            section: '',
            identifier: ''
        });
    });

    test('should handle empty or undefined path', () => {
        expect(getCsfRoute()).toEqual({
            handle: '',
            section: '',
            identifier: ''
        });

        expect(getCsfRoute('')).toEqual({
            handle: '',
            section: '',
            identifier: ''
        });
    });

    test('should handle paths with trailing slashes', () => {
        const path = '/creators/johndoe/collections/123/';
        const result = getCsfRoute(path);

        expect(result).toEqual({
            handle: 'johndoe',
            section: 'collections',
            identifier: '123'
        });
    });

    test('should handle paths with additional segments', () => {
        const path = '/creators/johndoe/collections/123/extra/segment';
        const result = getCsfRoute(path);

        // Only extracts the first three segments
        expect(result).toEqual({
            handle: 'johndoe',
            section: 'collections',
            identifier: '123'
        });
    });
});
