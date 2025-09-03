const firstLetter = /\b[a-z](?=[a-z]{2})/g;
const specialsCharacters = /[~`<>?/:;"'|\\{[}\]±§!@#$%^&*()_\-+=]/;

const stringUtils = {
    keyGenerator: sufix => postfix => `${sufix}_${postfix}`,
    capitalize: str => {
        return str.toLowerCase().replace(firstLetter, letter => letter.toUpperCase());
    },

    /**
     * Builds out a new string with the match pattern wrapped with a html tag.
     *
     * @param { string | regex } pattern - Pattern to search in the string
     * @param { string } str - String over the pattern will be applied
     * @param { string } htmlTag - HTML tag that will wrap the pattern
     * @param { customData } str - Extra data that will used to apply css or as selector
     * @returns { string } - New string with the pattern wrapped with the html tag
     */
    embedHTML: (pattern = '', str = '', htmlTag = 'span', customData = '') => {
        if (!str) {
            return '<span ></span>';
        }

        return str.replace(pattern, match => {
            return `<${htmlTag} ${customData}>${match}</${htmlTag}>`;
        });
    },

    //Splices string to include only full words of up to a certain char count
    spliceByFullWords: (string, charLimit) => {
        const wordArray = string.split(' ');
        let newString = wordArray[0];
        let tempString = newString;

        for (let i = 1; i < wordArray.length; i++) {
            tempString = tempString + ' ' + wordArray[i];

            if (tempString.length < charLimit) {
                newString = tempString;
            } else {
                break;
            }
        }

        return newString;
    },
    replaceDiacriticChars: string => {
        const diacriticsDictionary = {
            àáâäæãåā: 'a',
            èéêëēėę: 'e',
            îïíīįì: 'i',
            ôöòóœøōõ: 'o',
            ûüùúū: 'u',
            ÿ: 'y',
            śš: 's',
            ł: 'l',
            žźż: 'z',
            çćč: 'c',
            ñń: 'n'
        };

        return string.toLowerCase().replace(/[^\w ]/g, function (char) {
            let charResult = char;

            Object.keys(diacriticsDictionary).forEach(key => {
                if (key.indexOf(char) > -1) {
                    charResult = diacriticsDictionary[key];
                }
            });

            return charResult;
        });
    },

    format: function (stringToFormat) {
        let formatedString = stringToFormat;

        for (var i = 0; i < arguments.length - 1; i++) {
            formatedString = formatedString.replaceAll(`{${i}}`, arguments[i + 1]);
        }

        return formatedString;
    },

    hasSpecialCharacters: value => specialsCharacters.test(value),

    formatPriceZeroToFree: str => str.replace(/\$0.00/, 'Free'),

    formatPriceZeroToFreeStandard: str => str.replace(/\$0.00 - /, ''),

    removeHttp: function (url) {
        return (url || '').replace(/^https?:\/\//, '');
    }
};

export default stringUtils;
