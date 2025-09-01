import React from 'react';
import TextReplace from 'components/TextReplace/TextReplace';
import Markdown from 'components/Markdown/Markdown';

const EXPLICIT_PARAMS = 2;

export default function resourceWrapper(getResource) {
    return function extendedGetResource(label, isMarkdown) {
        //This help us skip explicit parametters
        let i = EXPLICIT_PARAMS;
        const placeholders = [],
            vars = [];

        /**
         * This assumes none of the vars are components.
         * isPlainText is gonna turn false when at least one of them is a component.
         */
        let isPlainText = true;

        while (arguments[i]) {
            if (process.env.NODE_ENV !== 'production') {
                if (
                    typeof arguments[i] === 'function' ||
                    (typeof arguments[i] === 'object' && arguments[i].$$typeof !== Symbol.for('react.element'))
                ) {
                    throw 'Unexpected type, it was expected a react element';
                }
            }

            // this condition favors the isPlainText false value,
            // so once a vars item is not plain text the whole thing would be threat as non plain text
            isPlainText = arguments[i].$$typeof !== Symbol.for('react.element') && isPlainText;
            placeholders.push(`{${i - EXPLICIT_PARAMS}}`);
            vars.push(arguments[i]);
            i++;
        }

        if (isPlainText) {
            return isMarkdown ? <Markdown content={getResource(label, vars)} /> : getResource(label, vars);
        }

        return (
            <TextReplace
                content={getResource(label, placeholders)}
                vars={vars}
                isMarkdown={isMarkdown}
            />
        );
    };
}
