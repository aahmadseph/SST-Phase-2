describe('bindingsSharedWithSoasta', () => {
    let sharedBindingMethods;

    beforeEach(() => {
        sharedBindingMethods = require('analytics/bindingMethods/pages/all/bindingsSharedWithSoasta').default;
    });

    describe('getPageType', () => {
        it('should return default value', () => {
            expect(sharedBindingMethods.getPageType()).toEqual('');
        });

        it('should return an existing page type', () => {
            expect(sharedBindingMethods.getPageType(['', 'homepage'])).toEqual('home page');
        });

        it('should return the page type for richprofile', () => {
            expect(sharedBindingMethods.getPageType(['', 'richprofile'])).toEqual('user profile');
        });

        it('should return the page type for richprofile with additional info', () => {
            expect(sharedBindingMethods.getPageType(['', 'richprofile', 'profile'])).toEqual('cmnty profile');
        });

        it('should return the same page type for richprofile and bihq', () => {
            const actual = sharedBindingMethods.getPageType(['', 'richprofile']);
            const expected = sharedBindingMethods.getPageType(['', 'bihq']);

            expect(actual).toEqual(expected);
        });
    });

    describe('convertType', () => {
        it('should return an empty string', () => {
            expect(sharedBindingMethods.convertType('')).toEqual('');
        });

        it('shouldn\'t convert a value for a nonexistent type', () => {
            expect(sharedBindingMethods.convertType('my type')).toEqual('my type');
        });

        it('should convert a value for an existent type', () => {
            expect(sharedBindingMethods.convertType('homepage')).toEqual('home page');
        });
    });
});
