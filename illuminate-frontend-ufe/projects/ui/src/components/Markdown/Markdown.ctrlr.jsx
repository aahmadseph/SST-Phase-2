/* eslint-disable max-len */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    colors, fonts, fontSizes, lineHeights
} from 'style/config';
import buttonStyles from 'components/Button/styles';
import store from 'store/Store';
import Actions from 'actions/Actions';
import analyticsUtils from 'analytics/utils';
import ReactDOM from 'react-dom';
import { Box } from 'components/ui';
import marked from 'marked';
import RE from 'components/Markdown/RegEx';
import urlUtils from 'utils/Url';
import typography from 'style/typography';
import { hexToRGB } from 'style/util';
import cmsApi from 'services/api/cms';

const { getLink } = urlUtils;
const TABLE_PADDING = 0.5;

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    smartLists: true,
    smartypants: true
});

const TARGET_TYPES = {
    SAME: 'same',
    NEW: 'new',
    OVERLAY: 'overlay'
};

class Markdown extends BaseClass {
    markdownLinks = [];

    componentDidMount() {
        const markdownModalLinks = ReactDOM.findDOMNode(this).querySelectorAll('[data-modalMediaId]');

        if (markdownModalLinks.length) {
            markdownModalLinks.forEach(link => {
                const mediaId = link.dataset.modalmediaid;
                link.onclick = e => {
                    cmsApi.getMediaContent(mediaId).then(data => {
                        const modalTemplate = data.regions && data.regions.content[0];
                        this.handleClick(e, modalTemplate);
                    });
                };
            });
        }
    }

    setTargetWindow = targetWindow => {
        // eslint-disable-next-line no-param-reassign
        targetWindow = targetWindow ? targetWindow.toLowerCase() : null;

        switch (targetWindow) {
            case TARGET_TYPES.NEW:
                return '_blank';
            case TARGET_TYPES.SAME:
            case TARGET_TYPES.OVERLAY:
            default:
                return '_self';
        }
    };

    /**
     *The function to escape html string
     **/
    sanitize = input => {
        return input
            .replace(RE.matchAmp, '&amp;')
            .replace(RE.matchLessThan, '&lt;')
            .replace(RE.matchMoreThan, '&gt;')
            .replace(RE.matchDoubleQuotes, '&quot;')
            .replace(RE.matchSingleQuote, '&#039;');
    };

    createHTMLStyleString = (styles, isLink) => {
        let htmlStyleString = 'style="';

        for (const key in styles) {
            if (Object.prototype.hasOwnProperty.call(styles, key)) {
                if (key === 'color' && isLink) {
                    htmlStyleString += `--color:${hexToRGB(styles[key], true)};color:rgba(var(--color),1);`;
                } else {
                    htmlStyleString += `${key}:${styles[key]};`;
                }
            }
        }

        htmlStyleString += '"';

        return htmlStyleString;
    };

    createNamedLinkHTMLString = (text, link, targetWindow, styles) => {
        let linkClass = 'Markdown-';
        linkClass += styles['button-size'] ? 'btn' : 'link';

        let styleHTMLString = '';
        let linkTitle = '';
        let relAttribute = '';
        let isLink = false;

        if (styles) {
            if (styles.style) {
                linkClass += ` ${linkClass}--${styles.style}`;
                delete styles.style;
            }

            if (styles['button-size']) {
                linkClass += ` Markdown-btn--${styles['button-size']}`;
                delete styles['button-size'];
            } else {
                isLink = true;
            }

            if (styles.title) {
                linkTitle = styles.title;
                delete styles.title;
            }

            if (styles.rel) {
                relAttribute = `rel=${styles.rel}`;
                delete styles.rel;
            }

            styleHTMLString = this.createHTMLStyleString(styles, isLink);
        }

        let resultHTMLString;

        if (!RE.isUrl(link) && RE.isMediaId(link)) {
            const mediaId = RE.matchMediaId.exec(link)[1];
            resultHTMLString = `<button title="${linkTitle}" class="${linkClass}" type="button" data-modalMediaId="${mediaId}" ${styleHTMLString}>${text}</button>`;
        } else {
            resultHTMLString = `<a title="${linkTitle}" class="${linkClass}" ${relAttribute} href="${getLink(
                link
            )}" ${styleHTMLString} target="${this.setTargetWindow(targetWindow)}">${text}</a>`;
        }

        return resultHTMLString;
    };

    /**
     * The function to convert JIRA syntax to Markdown syntax
     **/
    jiraToMarkdown = str => {
        const { targetWindow } = this.props;

        return (
            str

                // Jira color to MD color
                .replace(RE.matchJiraColor, (match, color, text) => `<span style="color:${colors[color] || color}">${text}</span>`)

                // Line height
                .replace(RE.matchLineHeight, (match, height, text) => {
                    const lineHeight = lineHeights[height] || height;

                    return '<span style="display:block;line-height:' + lineHeight + ';">' + text + '</span>';
                })

                // Subnested OL
                .replace(RE.matchSubnestedOL, (match, nums) => Array(nums.length).join('  ') + '1. ')

                // Subnested UL
                .replace(RE.matchSubnestedUL, (match, stars) => Array(stars.length).join('    ') + '- ')

                // Ordered Lists
                .replace(RE.matchOL, (match, stars) => Array(stars.length).join(' ') + '* ')

                // Un-ordered lists
                .replace(RE.matchUL, (match, nums) => Array(nums.length).join(' ') + '1. ')

                // Headers 1-6
                .replace(RE.matchHeaders, (match, level, content) => Array(parseInt(level) + 1).join('#') + content)

                // Bold
                .replace(RE.matchBold, '**$1**')

                // Italic
                .replace(RE.matchItalic, '$1*$2*')

                // Monospaced text
                .replace(RE.matchMonospacedText, '`$1`')

                // Inserts
                .replace(RE.matchInserts, '<ins>$1</ins>')

                // Superscript
                .replace(RE.matchSuperscript, '<sup>$1</sup>')

                // Subscript
                .replace(RE.matchSubscript, '<sub>$1</sub>')

                // Strikethrough
                .replace(RE.matchStrikeThrough, '~~$1~~')

                // Code Block
                .replace(RE.matchCodeBlock, '```$2$3```')

                // Pre-formatted text
                .replace(RE.matchPreFormatted, '```')

                // Un-named Links
                .replace(RE.matchUnnamedLinks, (match, link, relAttribute, relValue) => {
                    const rel = relValue ? `rel=${relValue}` : '';

                    return `<a href="${getLink(link)}" ${rel} target="${this.setTargetWindow(targetWindow)}">${link}</a>`;
                })
                // Named Link
                .replace(RE.matchManyStyleNamedLink, (match, text, link, ...detectedStyles) => {
                    const styles = RE.filterSupportedMarkdownStyles(detectedStyles, true);

                    return this.createNamedLinkHTMLString(text, link, targetWindow, styles);
                })
                // Single Paragraph Blockquote
                .replace(RE.matchSingleParagraphBlockquote, '> ')

                // Remove color: unsupported in md
                .replace(RE.matchColor, '$1')

                // panel into table
                .replace(RE.matchPanel, '\n| $1 |\n| --- |\n| $2 |')

                // Table header
                .replace(RE.matchTableHeader, (match, headers) => {
                    var singleBarred = headers.replace(/\|\|/g, '|');

                    return '\n' + singleBarred;
                })

                // Colored line break ruler
                // New lines required or compiler breaks certain formattings after the tag
                .replace(RE.matchColoredHR, '<hr style="color: $1;">\n\n')

                // Line break ruler
                // New lines required or compiler breaks certain formattings after the tag
                .replace(RE.matchHR, '<hr>\n\n')

                .replace(RE.matchBR, '<br>\n\n')

                // remove leading-space of table headers and rows
                .replace(RE.matchLeadingSpace, '|')

                // background color
                .replace(RE.matchBackgroundColor, '<span class="Markdown-bg" style="background-color:$1">$2</span>')

                // font styled text
                .replace(RE.matchSerif, (match, text) => '<span style="font-family: ' + fonts.serif + ';">' + text + '</span>')

                // font sized text
                .replace(RE.matchFontSized, (match, size, text) => {
                    const fontSize = fontSizes[size] ? `${fontSizes[size]}px` : size;

                    return `<span style="font-size:${fontSize}">${text}</span>`;
                })

                // text align
                .replace(RE.matchTextAlign, (match, align, text) => '<span style="display:block; text-align:' + align + ';">' + text + '</span>')

                // anchor link
                .replace(RE.matchAnchorLinks, (match, id) => {
                    return '<div id="' + id.trim() + '"></div>';
                })

                // data at
                .replace(RE.matchDataAt, (match, title, tag, content) => {
                    return `<${tag} data-at="${Sephora.debug.dataAt(title)}">${content}</${tag}>`;
                })

                // bullet symbol
                .replace(RE.matchBull, '&bull;')

                // trademark symbol
                .replace(RE.matchTrade, '&trade;')

                // copyright symbol
                .replace(RE.matchCopy, '&copy;')

                // 3 space indentation
                .replace(RE.matchTab, '&nbsp;&nbsp;&nbsp;')

                // Specific special characters
                .replace(RE.matchAst, '&ast;')

                .replace(RE.matchNum, '&num;')

                .replace(RE.matchPlus, '&plus;')

                .replace(RE.matchTilde, '&Tilde;')

                .replace(RE.matchLowbar, '&lowbar;')

                .replace(RE.matchHat, '&Hat;')
        );
    };

    handleClick = (e, modalTemplate, callback) => {
        if (modalTemplate) {
            e.preventDefault();
            store.dispatch(
                Actions.showBccModal({
                    isOpen: true,
                    bccModalTemplate: modalTemplate,
                    bccParentComponentName: this.props.componentName
                })
            );

            //Analytics
            if (this.props.anaNavPath) {
                analyticsUtils.setNextPageData({ navigationInfo: analyticsUtils.buildNavPath(this.props.anaNavPath) });
            }
        }

        if (callback) {
            callback();
        }
    };

    render() {
        const {
            content, targetWindow, componentName, modalComponentTemplate, anaNavPath, onPostParse, callback, ...props
        } = this.props;

        let markedHtml = '';

        try {
            markedHtml = content ? marked(this.jiraToMarkdown(this.sanitize(content))) : '';

            if (onPostParse) {
                markedHtml = onPostParse(markedHtml);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error parsing Markdown Component - HTML Text | ' + e);
        }

        return (
            <Box
                is='div'
                baseCss={styles}
                onClick={modalComponentTemplate || callback ? e => this.handleClick(e, modalComponentTemplate, callback) : null}
                dangerouslySetInnerHTML={{ __html: markedHtml }}
                {...props}
            />
        );
    }
}
const styles = {
    ...typography,
    '& .Markdown-btn': buttonStyles.size(),
    '& .Markdown-btn--sm': buttonStyles.size('sm'),
    '& .Markdown-btn--primary': buttonStyles.primary,
    '& .Markdown-btn--outline, & .Markdown-btn--secondary': buttonStyles.secondary,
    '& .Markdown-btn--red, & .Markdown-btn--special': buttonStyles.special,
    '& .Markdown-btn--white': buttonStyles.white,
    '& .Markdown-btn--inverted': buttonStyles.inverted,
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1em'
    },
    '& th, & td': {
        padding: `${TABLE_PADDING}em`,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--color-midGray)',
        verticalAlign: 'middle',
        lineHeight: 'var(--leading-tight)',
        textAlign: 'center'
    },
    '& th': {
        fontWeight: 'var(--font-weight-bold)',
        backgroundColor: 'var(--color-lightGray)',
        /* unfortunately, cannot apply the bg style
           directly to the `th` element */
        '& > .Markdown-bg': {
            display: 'block',
            padding: `${TABLE_PADDING}em`,
            margin: `-${TABLE_PADDING}em`
        }
    },
    /* No top margin on first element */
    '& > :first-child': {
        marginTop: 0
    },
    /* No bottom margin on last element */
    '& > :last-child': {
        marginBottom: 0
    }
};

export default wrapComponent(Markdown, 'Markdown', true);
