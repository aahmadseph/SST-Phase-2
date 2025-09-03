import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { space, mediaQueries } from 'style/config';

const BccStyleWrapper = ({
    className, customStyle = {}, children, style, ...props
}) => {
    if (localeUtils.isFRCanada() && customStyle['FR_CA_HIDE'] !== undefined) {
        return null;
    }

    if (!localeUtils.isFRCanada() && customStyle['FR_CA_SHOW'] !== undefined) {
        return null;
    }

    let paddingTop, paddingRight, paddingBottom, paddingLeft;

    if (customStyle['PADDING_TOP'] !== undefined) {
        paddingTop = parseInt(customStyle['PADDING_TOP']);
    }

    if (customStyle['PADDING_RIGHT'] !== undefined) {
        paddingRight = parseInt(customStyle['PADDING_RIGHT']);
    }

    if (customStyle['PADDING_BOTTOM'] !== undefined) {
        paddingBottom = parseInt(customStyle['PADDING_BOTTOM']);
    }

    if (customStyle['PADDING_LEFT'] !== undefined) {
        paddingLeft = parseInt(customStyle['PADDING_LEFT']);
    }

    return (
        <div
            children={children}
            className={className}
            css={[
                // set bg color around padded wrapper (BCC Markdown)
                children?.props?.backGroundColor && {
                    backgroundColor: children.props.backGroundColor
                },
                {
                    '&:empty': { display: 'none' },
                    paddingTop,
                    paddingRight,
                    paddingBottom,
                    paddingLeft
                },
                // deprecated style padding props
                customStyle['TOP_PADDING'] !== undefined && {
                    paddingTop: space[7],
                    [mediaQueries.smMax]: {
                        paddingTop: space[6]
                    }
                },
                customStyle['BOTTOM_PADDING'] !== undefined && {
                    paddingBottom: space[7],
                    [mediaQueries.smMax]: {
                        paddingBottom: space[6]
                    }
                },
                style
            ]}
            {...props}
        />
    );
};

export default wrapFunctionalComponent(BccStyleWrapper, 'BccStyleWrapper');
