describe('Strings Utils', () => {
    let stringUtils;

    beforeEach(function () {
        stringUtils = require('utils/String').default;
    });

    describe('capitalize', () => {
        it('should return an empty string', () => {
            expect(stringUtils.capitalize('')).toBe('');
        });

        it('should return a string with the first letter uppercase', () => {
            expect(stringUtils.capitalize('string')).toBe('String');
        });
    });

    describe('embedHTML', () => {
        it('should return a string with default values', () => {
            expect(stringUtils.embedHTML()).toBe('<span ></span>');
        });

        it('should find and replace with pattern in the string', () => {
            expect(stringUtils.embedHTML('18', 'I have 18 points')).toBe('I have <span >18</span> points');
        });

        it('should find and replace with pattern in the string and add extra data', () => {
            expect(stringUtils.embedHTML('18', 'I have 18 points', 'a', 'data-cool-data')).toBe('I have <a data-cool-data>18</a> points');
        });
    });

    describe('replaceDiacriticChars', () => {
        it('should return string with replaced chars if it has any diacritic char', () => {
            expect(stringUtils.replaceDiacriticChars('lancôme')).toBe('lancome');
        });

        it('should return string if it does not have any diacritic char', () => {
            expect(stringUtils.replaceDiacriticChars('drybar')).toBe('drybar');
        });
    });
});
