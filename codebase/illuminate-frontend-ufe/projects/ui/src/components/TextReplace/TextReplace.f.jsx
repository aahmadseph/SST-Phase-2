import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Markdown from 'components/Markdown/Markdown';

const PLACEHOLDER_RE = /{([^]*?}?)}/;

const getComponent = function (processElement, vars) {
    return (element, index) => <React.Fragment key={index}>{index % 2 ? vars[parseInt(element)] : processElement(element, index)}</React.Fragment>;
};

const TextReplaceF = function (props) {
    const { content, isMarkdown, vars } = props;
    //This approach is more effective since it reduces nesting conditions while iterating elements
    const processElement = isMarkdown ? element => <Markdown content={element} /> : element => element;

    return <React.Fragment>{content.split(PLACEHOLDER_RE).map(getComponent(processElement, vars))}</React.Fragment>;
};

export default wrapFunctionalComponent(TextReplaceF, 'TextReplace');
