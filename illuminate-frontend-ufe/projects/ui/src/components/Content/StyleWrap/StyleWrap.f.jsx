import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text, Link } from 'components/ui';
import Action from 'components/Content/Action';
const ActionLink = Action(Link);

const StyleWrap = ({
    sid, style, is, children, isInline, className, action
}) => {
    if (!children) {
        return null;
    }

    const wrapProps = {
        id: sid,
        className,
        children
    };

    if (style || action) {
        // Check for responsive style properties
        Object.entries(style).forEach(([key, value]) => {
            if (typeof value === 'string' && value.includes(',')) {
                style[key] = value.split(',');
            }
        });

        if (action) {
            return (
                <ActionLink
                    sid={sid}
                    is={action.page || action.targetUrl ? 'a' : is}
                    underline={style?.style?.textDecoration ? true : null}
                    action={action}
                    display='inline'
                    {...wrapProps}
                    {...style}
                />
            );
        } else {
            const Comp = isInline ? Text : Box;

            return (
                <Comp
                    is={is}
                    {...wrapProps}
                    {...style}
                />
            );
        }
    } else {
        const Comp = is || (isInline ? 'span' : 'div');

        return <Comp {...wrapProps} />;
    }
};

StyleWrap.propTypes = {
    is: PropTypes.string,
    sid: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
    isInline: PropTypes.bool,
    className: PropTypes.string,
    action: PropTypes.object
};

StyleWrap.defaultProps = {
    is: null,
    sid: null,
    children: null,
    style: null,
    isInline: null,
    className: null,
    action: null
};

export default wrapFunctionalComponent(StyleWrap, 'StyleWrap');
