/* eslint-disable no-shadow */
import buttonStyles from 'components/Button/styles';
import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, color, layout, space
} from 'styled-system';
import theme from 'style/theme';
import uiUtils from 'utils/UI';

const { wrapFunctionalComponent } = FrameworkUtils;

const StyledButton = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'button',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [
        props => [
            buttonStyles.size(props.buttonSize),
            buttonStyles[props.variant],
            props.block && {
                display: 'flex',
                width: '100%'
            },
            compose(color, layout, space),
            props.hasMinWidth && { minWidth: '14.5em' },
            props.css
        ]
    ]
});

const Button = React.forwardRef(({ size, ...props }, ref) => {
    return (
        <StyledButton
            __ref={ref}
            buttonSize={size}
            {...props}
            {...uiUtils.getAriaButtonProps('button', props)}
        />
    );
});

Button.propTypes = {
    /** Alternate button sizes - `sm` */
    size: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['xs', 'sm', 'md'])]),
    /** Button style variants */
    variant: PropTypes.oneOf(['secondary', 'primary', 'special', 'inverted', 'white', 'link']).isRequired,
    /** Full width of container; block element */
    block: PropTypes.bool,
    /** Set a minimum button width so element doesn’t appear too small */
    hasMinWidth: PropTypes.bool
};

Button.defaultProps = {
    theme,
    minWidth: '5.5em'
};

export default wrapFunctionalComponent(Button, 'Button');
