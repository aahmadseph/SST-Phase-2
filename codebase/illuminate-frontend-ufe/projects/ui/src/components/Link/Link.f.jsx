/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, color, flexbox, layout, space, typography
} from 'styled-system';
import Chevron from 'components/Chevron';
import theme from 'style/theme';
import uiUtils from 'utils/UI';
import { hexToRGB } from 'style/util';

const StyledLink = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'button',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [
        props => [
            {
                cursor: props.disableUnderline ? 'default' : 'pointer',
                [props.hoverSelector && !props.disableUnderline ? `.no-touch &:hover ${props.hoverSelector}` : '.no-touch &:hover']: {
                    textDecoration: props.disableUnderline ? 'none' : 'underline'
                }
            },
            props.underline && {
                '--color': hexToRGB(theme.colors[props.color] || props.color || theme.colors.base, true),
                textDecoration: 'underline',
                textDecorationColor: 'rgba(var(--color), .3)',
                textUnderlineOffset: 1,
                transition: 'text-decoration-color .2s',
                '.no-touch &:hover': {
                    textDecorationColor: 'rgba(var(--color), 1)'
                }
            },
            props.baseCss,
            compose(color, flexbox, layout, space, typography),
            props.css
        ]
    ]
});

const Link = React.forwardRef(({
    arrowDirection, arrowPosition, hasFloatingArrow, children, ...props
}, ref) => {
    const innerRef = ref || React.useRef(null);
    const isArrowBefore = arrowPosition === 'before';
    const isArrowAfter = arrowPosition === 'after';

    const arrow = arrowDirection ? (
        <Chevron
            direction={arrowDirection}
            size='.75em'
            marginRight={isArrowBefore && '.5em'}
            marginLeft={isArrowAfter && '.5em'}
            css={{
                position: 'relative',
                top: '-.0625em',
                flexShrink: 0
            }}
        />
    ) : null;

    React.useEffect(() => {
        return () => {
            if (document.activeElement === innerRef?.current) {
                const focusableElements = Array.from(
                    document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
                ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
                const currentIndex = focusableElements.indexOf(innerRef?.current);

                if (currentIndex !== -1) {
                    const next = focusableElements[currentIndex + 1] || focusableElements[0];
                    next?.focus();
                }
            }
        };
    }, []);

    return (
        <StyledLink
            __ref={innerRef}
            {...props}
            {...uiUtils.getAriaButtonProps('span', props)}
        >
            {hasFloatingArrow ? (
                <span css={styles.flexWrap}>
                    {isArrowBefore && arrow}
                    <span
                        css={styles.flexText}
                        children={children}
                    />
                    {isArrowAfter && arrow}
                </span>
            ) : (
                <>
                    {isArrowBefore && arrow}
                    {children}
                    {isArrowAfter && arrow && (
                        <span css={styles.arrowWrap}>
                            <span>&#xfeff;</span>
                            {arrow}
                        </span>
                    )}
                </>
            )}
        </StyledLink>
    );
});

Link.propTypes = {
    arrowPosition: PropTypes.oneOf(['before', 'after']),
    arrowDirection: PropTypes.oneOf(['up', 'down', 'left', 'right']),
    /* Specify specific element that gets the hover style */
    hoverSelector: PropTypes.string,
    disableUnderline: PropTypes.bool,
    hasFloatingArrow: PropTypes.bool,
    underline: PropTypes.bool
};

Link.defaultProps = {
    theme,
    display: 'inline-block',
    arrowPosition: 'after'
};

const styles = {
    flexWrap: {
        display: 'flex',
        alignItems: 'center'
    },
    flexText: {
        flex: 1,
        wordWrap: 'break-word'
    },
    arrowWrap: {
        display: 'inline',
        whiteSpace: 'nowrap',
        flexShrink: 0
    }
};

export default wrapFunctionalComponent(Link, 'Link');
