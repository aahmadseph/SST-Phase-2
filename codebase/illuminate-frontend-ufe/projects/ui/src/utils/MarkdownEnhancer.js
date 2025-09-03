import React from 'react';
import marked from 'marked';

const regExOpeningTags = /<Enhancer.*?>/g;
const regExClosingTags = /<\/Enhancer>/g;
const regexTypeAttr = /type=".*?"/;
const regexArgsAttr = /arguments=".*?"/;

function getEnhancerIndices(content) {
    let openigTagResults;
    let closingTagResults;
    const openingTags = [];
    const closingTags = [];

    while ((openigTagResults = regExOpeningTags.exec(content))) {
        openingTags.push(openigTagResults.index);
    }

    while ((closingTagResults = regExClosingTags.exec(content))) {
        closingTags.push(closingTagResults.index);
    }

    return {
        openingTags,
        closingTags
    };
}

function splitContent(enhancerIndices, enhance) {
    const { openingTags, closingTags } = enhancerIndices;
    const fragments = [];
    let index = 0;

    if (openingTags.length === closingTags.length) {
        let fragment = '';

        while (index < enhance.length) {
            for (let j = 0; j < openingTags.length; j++) {
                if (index === openingTags[j]) {
                    if (fragment !== '') {
                        fragments.push(fragment);
                        fragment = '';
                    }

                    fragments.push(enhance.slice(openingTags[j], closingTags[j] + 11));
                    index = closingTags[j] + 11;
                }
            }

            fragment = fragment + enhance[index];

            if (index === enhance.length - 1 && fragment !== '') {
                fragments.push(fragment);
            }

            index++;
        }
    }

    return fragments;
}

function checkEnhancer(fragment) {
    return regExOpeningTags.test(fragment);
}

function getAttribute(enhancer, key, regex) {
    if (regex.test(enhancer)) {
        let attr = regex.exec(enhancer)[0];
        attr = attr.replace(`${key}`, '');
        attr = attr.replace('=', '');
        attr = attr.replaceAll('"', '');

        return attr;
    }

    return '';
}

function getContent(enhancer) {
    let content = enhancer.replace(regExOpeningTags, '');
    content = content.replace(regExClosingTags, '');
    content = content.replaceAll('"', '');

    return content;
}

function convertSplittedContentToObjects(fragments) {
    const contentInObjects = fragments.map(fragment => {
        const isEnhacer = checkEnhancer(fragment);

        if (isEnhacer) {
            return {
                enhancerType: getAttribute(fragment, 'type', regexTypeAttr),
                args: getAttribute(fragment, 'arguments', regexArgsAttr),
                content: getContent(fragment)
            };
        } else {
            return fragment;
        }
    });

    return contentInObjects;
}

function markedFragment(fragment) {
    try {
        const markedText = marked(fragment);
        const htmlWithoutPtag = markedText.substring(3, markedText.length - 5);

        return <span dangerouslySetInnerHTML={{ __html: htmlWithoutPtag }} />;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing Markdown Enhancer Util - markedFragment | ' + e);
    }

    return null;
}

function getContentInObjects(content) {
    try {
        const enhancerIndices = getEnhancerIndices(content);
        const splittedContent = splitContent(enhancerIndices, content);
        const contentObjects = convertSplittedContentToObjects(splittedContent);

        return contentObjects;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing Enhancer Markdown - getContentInObjects | ' + e);

        return [];
    }
}

function createAnalyticsMessage(message) {
    if (!message.isQualified) {
        return 'BBQ not qualified';
    }

    const fragments = getContentInObjects(message.text);

    const noAnyEnhancerFound = !fragments.find(x => typeof x === 'object');

    if (noAnyEnhancerFound) {
        return 'BBQ Qualified';
    }

    const signInEnhancerFound = fragments.find(x => typeof x === 'object' && x.enhancerType === 'signInCTA');

    if (signInEnhancerFound) {
        return 'BBQ qualified not signed in';
    }

    const applyPromoEnhancerFound = fragments.find(x => typeof x === 'object' && x.enhancerType === 'applyPromoCTA');

    if (applyPromoEnhancerFound) {
        return 'BBQ Qualified enter promo code';
    }

    const joinBiEnhancerFound = fragments.find(x => typeof x === 'object' && x.enhancerType === 'joinBiCTA');

    if (joinBiEnhancerFound) {
        return 'BBQ qualified not BI';
    }

    return null;
}

const MarkdownEnhancerUtils = {
    checkEnhancer,
    convertSplittedContentToObjects,
    getAttribute,
    getContent,
    getContentInObjects,
    getEnhancerIndices,
    splitContent,
    markedFragment,
    createAnalyticsMessage
};

export default MarkdownEnhancerUtils;
