import printTimestamp from 'utils/Timestamp';
import isFunction from 'utils/functions/isFunction';

const RESOURCE_MISSING = 'Resource Missing';
const TRANSLATION_MISSING = 'Translation Missing';

const getTextFunction = textFunction => (isFunction(textFunction) ? textFunction : textFunction.default);

// Wrapper that reports whenever a resource string is missing.
const warningWrapper = function (translationFunction) {
    const getText = getTextFunction(translationFunction);

    return function (label, vars = []) {
        const resource = getText(label, vars);

        if (resource !== undefined) {
            return resource;
        }

        // eslint-disable-next-line no-console
        console.error(`${printTimestamp()} - LanguageLocale - error: ${RESOURCE_MISSING} - label: ${label}`);

        return RESOURCE_MISSING;
    };
};

// This receives an object with english and french resources files references.
// it's intended to add extra functionality for frech files to fallback to english
// and for english files to report if the requested resource is missing.
const translationMissingHandler = function (translationObject) {
    translationObject['EN'] = warningWrapper(translationObject['EN']);

    const translationFunction = translationObject['FR'] ? translationObject['FR'] : translationObject['EN'];
    const getText = getTextFunction(translationFunction);

    translationObject['FR'] = function (label, vars = []) {
        const resource = getText(label, vars);

        if (resource !== undefined) {
            return resource;
        }

        // eslint-disable-next-line no-console
        console.error(`${printTimestamp()} - LanguageLocale - error: ${TRANSLATION_MISSING} - label: ${label}`);

        return translationObject['EN'](label, vars);
    };

    return translationObject;
};

export default {
    warningWrapper,
    translationMissingHandler
};
