const replaceSpecialCharacters = require('utils/replaceSpecialCharacters').default;

describe('replaceSpecialCharacters', () => {
    it('should replace special character à', () => {
        const result = replaceSpecialCharacters('&#192;à');
        expect(result).toEqual('aa');
    });

    it('should replace special characters è, é, É and È', () => {
        const result = replaceSpecialCharacters('&#200;&#201;&#233;èéÉÈ');
        expect(result).toEqual('eeeeeee');
    });

    it('should replace special characters ì and î', () => {
        const result = replaceSpecialCharacters('&#236;&#238;');
        expect(result).toEqual('ii');
    });

    it('should replace special characters ô and Ô', () => {
        const result = replaceSpecialCharacters('ô&#244;&#212;');
        expect(result).toEqual('ooo');
    });

    it('should remove special characters ™, ®, \\, ° and ²', () => {
        const result = replaceSpecialCharacters('™®\'²°&#174;&#176;&#153;&#8482;&#178;');
        expect(result).toEqual('');
    });

    it('should remove special character &', () => {
        const result = replaceSpecialCharacters('ampersand');
        expect(result).toEqual(' & ');
    });
});
