import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import BccStyleWrapper from 'components/Bcc/BccStyleWrapper/BccStyleWrapper';

const BccBase = ({
    isBccStyleWrapperApplied,
    baseCss, // base wrap style
    contextStyle, // contextual style
    className = '',
    styleList,
    children,
    dataAt
}) => {
    return isBccStyleWrapperApplied ? (
        <div
            data-at={dataAt}
            className={className}
            css={[baseCss, contextStyle]}
            children={children}
        />
    ) : (
        <BccStyleWrapper
            data-at={dataAt}
            className={className}
            style={[baseCss, contextStyle]}
            customStyle={styleList}
            children={children}
        />
    );
};

export default wrapFunctionalComponent(BccBase, 'BccBase');
