/**
 * Replaces unwanted special characters
 * @param  {string} string - The string containing characters that need to be removed.
 * @return {string} - The string with each found special character replaced with its
 * normal equivalent.
 */
export default function (stringArg) {
    var charMatrix = {
        à: 'a',
        è: 'e',
        é: 'e',
        É: 'e',
        È: 'e',
        ô: 'o',
        '&#153;': '',
        '&#174;': '',
        '&#176;': '',
        '&#178;': '',
        '&#192;': 'a',
        '&#200;': 'e',
        '&#201;': 'e',
        '&#212;': 'o',
        '&#232;': 'e',
        '&#233;': 'e',
        '&#236;': 'i',
        '&#238;': 'i',
        '&#244;': 'o',
        '&#8482;': '',
        '™': '',
        '®': '',
        '\'': '',
        '²': '',
        '°': '',
        ampersand: ' & '
    };

    let string = stringArg || '';

    var re = new RegExp(Object.keys(charMatrix).join('|'), 'gi');
    string = string.replace(re, function (matched) {
        return charMatrix[matched];
    });

    return string.toLowerCase();
}
