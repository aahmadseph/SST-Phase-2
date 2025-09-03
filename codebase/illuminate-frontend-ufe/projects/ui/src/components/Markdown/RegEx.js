/* eslint-disable max-len */
// Markdown syntax guide
// https://jira.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Markdown+Syntax+Guide
import { colors, fontSizes } from 'style/config';

const supportedMarkdownStyles = ['style', 'color', 'font-size', 'font-family', 'text-decoration', 'button-size', 'title', 'line-height', 'rel'];
const matchManyStyleNamedLink = (function (styles = []) {
    let linkRegExp = '\\[([^|]+?)\\|([^\\]|]+)';
    const stylesEnum = styles.join('|');
    styles.forEach(() => (linkRegExp += '(\\|(' + stylesEnum + ')=([^\\]|]+))?'));

    return new RegExp(linkRegExp + ']', 'g');
}(supportedMarkdownStyles));

export default {
    matchPhoneSpecialChars: /[()-\s]/g,
    matchIfCharsAreTheSame: /^(.)\1*$/,
    matchAmp: /&/g,
    matchLessThan: /</g,
    matchMoreThan: />/g,
    matchDoubleQuotes: /"/g,
    matchSingleQuote: /'/g,
    matchUrl: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
    matchJiraColor: /\{color:([^}]+)\}([^]*?)\{color\}/gm,
    matchLineHeight: /\{line-height:([^}]+)\}([^]*?)\{line-height\}/gm,
    matchSubnestedOL: /^[ \t]*(\*\#+)\s+/gm,
    matchSubnestedUL: /^[ \t]*(\#\*+)\s+/gm,
    matchOL: /^[ \t]*(\*+)\s+/gm,
    matchUL: /^[ \t]*(#+)\s+/gm,
    matchEnhance: /<Enhancer/g,

    // Headers 1-6
    matchHeaders: /^h([0-6])\.(.*)$/gm,
    matchBold: /(?!\{)\*(?!\})(\S.*?)(?!\})\*(?!\})/g,
    matchItalic: /([\n\r\s]+)\_(\S.*?)\_/g,
    matchMonospacedText: /\{\{([^}]+)\}\}/g,
    matchInserts: /(?!\{)\+(?!\})([^+]*)(?!\{)\+(?!\})/g,
    matchSuperscript: /(?!\{)\^(?!\})([^^]*)(?!\{)\^(?!\})/g,
    matchSubscript: /(?!\{)\~(?!\})([^~]*)(?!\{)\~(?!\})/g,
    matchStrikeThrough: /[\n\r\s]+-(?!\-)(\S.*?)-/g,
    matchCodeBlock: /\{code(:([a-z]+))?\}([^]*)\{code\}/gm,
    matchPreFormatted: /{noformat}/g,
    matchUnnamedLinks: /\[([^\]|]+)(\|rel=([^\]|]+))?]/g,
    matchNamedLinks: /\[([^|]+?)\|([^\]|]+)]/g,
    matchSingleParagraphBlockquote: /^bq\.\s+/gm,
    matchColor: /\{color:[^}]+\}([^]*?)\{color\}/gm,
    matchBackgroundColor: /\{bg-color:([^}]+)\}([^]*?)\{bg-color\}/gm,
    matchPanel: /\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm,
    matchTableHeader: /^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm,
    matchHR: /{hr}/g,
    matchBR: /{br}/g,
    matchColoredHR: /{hr:([^}]+)\}/g,
    matchAnchorLinks: /\{anchor:([^]*?)\}/g,
    matchTab: /{tab}/g,
    matchBull: /&amp;bull;([^\S]*?)/g,
    matchTrade: /&amp;trade;([^\S]*?)/g,
    matchCopy: /&amp;copy;([^\S]*?)/g,
    matchAst: /\{([*][^\S]*)\}/g,
    matchNum: /\{([#][^\S]*)\}/g,
    matchPlus: /\{([+][^\S]*)\}/g,
    matchTilde: /\{([~][^\S]*)\}/g,
    matchHat: /\{([^][^\S]*)\}/g,
    matchLowbar: /\{([_][^\S]*)\}/g,
    matchManyStyleNamedLink: matchManyStyleNamedLink,
    matchMediaId: /(?:modalMediaId={1})([0-9a-z]*)/i,
    matchDataAt: /\{data-at:title=(.+?)\|tag=(.+?)\}([^]*?)\{data-at\}/gm,
    /**
     * match leading-space of table headers and rows
     **/
    matchLeadingSpace: /^[ \t]*\|/gm,
    matchSerif: /\{serif}([^]*?)\{serif\}/g,
    matchFontSized: /\{font-size:(.+?)\}([^]*?)\{font-size\}/g,
    matchTextAlign: /\{align:(.+?)\}([^]*?)\{align\}/g,
    isUrl: function (linkToTest) {
        const result = linkToTest.match(this.matchUrl);

        return !!result && !!result[0];
    },
    isMediaId: function (linkToTest) {
        const result = linkToTest.match(this.matchMediaId);

        return !!result && !!result[1];
    },
    filterSupportedMarkdownStyles: function (detectedStyles) {
        // among matched styles we filer their grouped matches as well, e.g. "|color=red"
        const filteredStyles = detectedStyles.filter(style => ('' + style).indexOf('=') < 0);
        const styles = {};

        for (let i = 0; i < filteredStyles.length; i += 2) {
            const style = filteredStyles[i];
            let value = filteredStyles[i + 1];

            if (supportedMarkdownStyles.indexOf(style) >= 0 && value) {
                if (style === 'color' && colors[value]) {
                    value = colors[value];
                }

                if (style === 'font-size' && fontSizes[value]) {
                    value = `${fontSizes[value]}px`;
                }

                styles[style] = value;
            }
        }

        return styles;
    }
};
