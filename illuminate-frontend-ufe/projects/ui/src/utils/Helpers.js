import ReactDOM from 'react-dom';
import localeUtils from 'utils/LanguageLocale';

const MAX_VISIBLE_PHONE_DIGITS = 3;

function isObject(input) {
    if (!input) {
        return false;
    }

    return !Array.isArray(input) && typeof input === 'object';
}

/**
 * Decimal adjustment of a number.  Code source:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
/* eslint-disable no-param-reassign */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }

    value = +value;
    exp = +exp;

    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }

    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split('e');

    return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
}
/* eslint-enable no-param-reassign */

function decimalFloor(value, exp) {
    return decimalAdjust('floor', value, exp);
}

function titleCase(string) {
    return string
        .toLowerCase()
        .split(' ')
        .map(function (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        })
        .join(' ');
}

function capitalizeFirstLetter(input = '', toLowerCaseFirst = false) {
    const stringToProcess = toLowerCaseFirst ? input.toLowerCase() : input;

    return stringToProcess.charAt(0).toUpperCase() + stringToProcess.slice(1);
}

function removeDuplicatesInArray(array, key) {
    if (!(array instanceof Array) || (key && typeof key !== 'string')) {
        return false;
    }

    if (key && typeof key === 'string') {
        return array.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
        });
    } else {
        return array.filter(function (item, index, arr) {
            return arr.indexOf(item) === index;
        });
    }
}

// Do not use this. This is deprecated, and we dont want to hardcode offsets
// Please use UI.scrollTo instead
function scrollTo(findNode, querySelector, offSetMobile = 0, offSetDesktop = 0) {
    const node = findNode
        ? querySelector
            ? ReactDOM.findDOMNode(findNode).querySelector(querySelector)
            : ReactDOM.findDOMNode(findNode)
        : document.querySelector(querySelector);

    if (node) {
        const yAxis = node.getBoundingClientRect().top + window.scrollY;
        window.scroll({
            top: yAxis - (Sephora.isMobile() ? offSetMobile : offSetDesktop),
            behavior: 'smooth'
        });
    }
}

function getProp(obj, path, defaultVal) {
    const property = path.split('.').reduce((object, prop) => (typeof object === 'undefined' || object === null ? object : object[prop]), obj);

    return property === undefined || property === null ? defaultVal : property;
}

function replaceDoubleAsterisks(str) {
    if (!str) {
        return str;
    }

    return str.replace(/\*\*/gi, '*');
}

const specialCharacterRegex = /[^\d]*/gi;

const nonAlphaNumericRegex = /[^A-Za-z0-9-. '/‘'’]/gi;

const alphaOnlyRegex = /[^A-Za-z ]/gi;

const doublePlusSpacesRegex = /[\s\s]+/gi;

const alphaWithAccentCharactersRegex = /[^A-Za-z éàèùçâêîôûëïü]/gi;

const nonAlphaNumbericWithAccentCharactersRegex = /[^A-Za-z0-9-. '/‘'’éàèùçâêîôûëïü]/gi;

const accentCharacters = /[`ˆ´¨]/gi;

function sanitizeUSAddress(address = '') {
    const hasOnlyAccentCharacter = accentCharacters.test(address);

    if (localeUtils.isCanada() && hasOnlyAccentCharacter) {
        return address;
    }

    return address
        .replace(localeUtils.isUS() ? nonAlphaNumericRegex : nonAlphaNumbericWithAccentCharactersRegex, '')
        .replace(doublePlusSpacesRegex, ' ')
        .trimStart();
}

function sanitizeUSAddressTwo(address = '') {
    const hasOnlyAccentCharacter = accentCharacters.test(address);

    if (localeUtils.isCanada() && hasOnlyAccentCharacter) {
        return address;
    }

    return address
        .replace(localeUtils.isUS() ? nonAlphaNumericRegex : nonAlphaNumbericWithAccentCharactersRegex, '')
        .replace(doublePlusSpacesRegex, ' ')
        .trimStart();
}

function sanitizeInput(inputValue = '') {
    return inputValue
        .replace(localeUtils.isUS() ? alphaOnlyRegex : alphaWithAccentCharactersRegex, '')
        .replace(doublePlusSpacesRegex, ' ')
        .trimStart();
}

function truncateText(text = '', maxLength = 20) {
    if (!text) {
        return text;
    }

    let result = text;

    if (result.length > maxLength) {
        result = result.substr(0, maxLength) + '...';
    }

    return result;
}

// Truncate the text to a specified length, ensuring it does not break emojis, especially when
// the text consists of several characters (like brown skin tone + red hair emoji + woman emoji)
function truncateGraphemes({ text, maxTextLength, truncationMarker }) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const graphemes = Array.from(segmenter.segment(text), s => s.segment);

    return graphemes.length > maxTextLength ? graphemes.slice(0, maxTextLength).join('') + truncationMarker : text;
}

function htmlSubstringToBold(text = '', substring = '') {
    if (!text || !substring) {
        return '';
    }

    return text.replace(substring, `<strong>${substring}</strong>`);
}

function formatPrice(price) {
    if (price != null) {
        const convertedPrice = `${price.replaceAll('.', ',').replaceAll('$', '').replaceAll('-', '$ -')} $`;

        return localeUtils.isFrench() ? convertedPrice : price;
    }

    return null;
}

function calculateTotalPrice(skus = []) {
    let totalPrice = 0.0;
    skus.slice(0, 3).map(item => {
        const listPrice = parseFloat(item.listPrice?.match(/[\d\.]+/));
        const salePrice = parseFloat(item.salePrice?.match(/[\d\.]+/));
        const wholeSalePrice = parseFloat(item.listPrice?.match(/[\d\.]+/));

        return (totalPrice += salePrice || listPrice || wholeSalePrice);
    });

    return formatPrice(`$${(Math.round(totalPrice * 100) / 100).toFixed(2)}`);
}

const formatPricingRegex = /[^0-9,\.]/gi;

function formatSiteCatalystPrice(price) {
    if (!price) {
        return '';
    }

    return price.replace(formatPricingRegex, '').replace(/,/g, '.');
}

function getHiddenPhoneNumber(mobileNumber) {
    if (!mobileNumber || mobileNumber.length < MAX_VISIBLE_PHONE_DIGITS) {
        return '••• ••• ••••';
    }

    return `••• ••• •${mobileNumber.substr(mobileNumber.length - MAX_VISIBLE_PHONE_DIGITS)}`;
}

// Zero delayed setTimeout to schedule a new macrotask.
// This dispatch needs to be executed at the end of the macrotask queue.
function deferTaskExecution(fn) {
    setTimeout(() => {
        fn();
    }, 0);
}

function fixArrayResponse(response) {
    try {
        if (isObject(response)) {
            const { responseStatus, ...rest } = response;
            const keys = Object.keys(rest).map(el => +el);
            const length = keys.length;

            if (keys[0] === 0 && keys[length - 1] === length - 1) {
                const values = Object.values(rest);

                const fixedResponse = {
                    data: values
                };

                if (responseStatus) {
                    fixedResponse.responseStatus = responseStatus;
                }

                return fixedResponse;
            }
        }

        return response;
    } catch {
        return response;
    }
}

function formatDiscountPrice(price) {
    if (price != null) {
        const formattedDiscountPrice = Number(price).toFixed(2);

        return localeUtils.isFrench() ? `${formattedDiscountPrice.replaceAll('.', ',')}` : formattedDiscountPrice;
    }

    return null;
}

function appendDollarSign(amount) {
    if (amount != null) {
        return localeUtils.isFrench() ? `${amount} $` : `$${amount}`;
    }

    return null;
}

export default {
    isObject,
    decimalFloor,
    titleCase,
    capitalizeFirstLetter,
    removeDuplicatesInArray,
    specialCharacterRegex,
    nonAlphaNumericRegex,
    sanitizeUSAddress,
    sanitizeInput,
    scrollTo,
    getProp,
    replaceDoubleAsterisks,
    truncateText,
    truncateGraphemes,
    htmlSubstringToBold,
    calculateTotalPrice,
    formatSiteCatalystPrice,
    formatPrice,
    getHiddenPhoneNumber,
    sanitizeUSAddressTwo,
    deferTaskExecution,
    fixArrayResponse,
    formatDiscountPrice,
    appendDollarSign
};
