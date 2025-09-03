import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { usePopper } from 'react-popper';
import {
    fontSizes, lineHeights, radii, space, colors
} from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Tooltip/locales', 'Tooltip');

const ARROW_SIZE = 5;
const TOOLTIP_COLOR = colors.black;

let uniqueId = 0;
const getUniqueId = () => uniqueId++;

function Tooltip({
    children,
    content,
    side,
    align,
    sideOffset,
    arrowOffset,
    dataAt,
    isFixed,
    stopPropagation,
    dismissButton,
    fontSize: fontSizeProp
}) {
    const idRef = useRef(null);

    if (idRef.current === null) {
        idRef.current = getUniqueId();
    }

    const tooltipId = `tooltip${idRef.current}`;

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
        strategy: isFixed ? 'fixed' : 'absolute',
        placement: `${side}${align ? `-${align}` : ''}`,
        modifiers: [
            {
                name: 'eventListeners'
            },
            {
                name: 'arrow',
                options: {
                    element: arrowElement,
                    padding: 8
                }
            },
            {
                name: 'offset',
                options: {
                    offset: [arrowOffset, sideOffset + ARROW_SIZE]
                }
            },
            {
                name: 'preventOverflow',
                options: {
                    padding: 4
                }
            }
        ]
    });
    const isMobile = Sephora.isMobile();

    const hideClick = event => {
        event.preventDefault();
        popperElement.style.display = '';
    };

    useEffect(() => {
        const show = () => {
            popperElement.style.display = 'block';
            update();
        };

        const hide = () => {
            popperElement.style.display = '';
        };

        const handleClick = e => {
            if (stopPropagation) {
                e.stopPropagation();
            }

            return;
        };

        referenceElement?.addEventListener('mouseenter', show);
        popperElement?.addEventListener('mouseenter', show);
        referenceElement?.addEventListener('focus', show);
        referenceElement?.addEventListener('mouseleave', hide);
        popperElement?.addEventListener('mouseleave', hide);
        referenceElement?.addEventListener('blur', hide);
        referenceElement?.addEventListener('click', handleClick);

        return () => {
            referenceElement?.removeEventListener('mouseenter', show);
            popperElement?.removeEventListener('mouseenter', show);
            referenceElement?.removeEventListener('focus', show);
            referenceElement?.removeEventListener('mouseleave', hide);
            popperElement?.removeEventListener('mouseleave', hide);
            referenceElement?.removeEventListener('blur', hide);
            referenceElement?.removeEventListener('click', handleClick);
        };
    }, [referenceElement, popperElement, update]);

    const isTopOrBottom = side === 'top' || side === 'bottom';
    const fontSize = fontSizes[fontSizeProp] || fontSizes.xs;

    return (
        <>
            {React.Children.map(
                children,
                child =>
                    child &&
                    React.cloneElement(child, {
                        ref: setReferenceElement,
                        tabIndex: 0,
                        ['aria-describedby']: tooltipId
                    })
            )}
            <span
                ref={setPopperElement}
                onClick={e => e.stopPropagation()}
                id={tooltipId}
                css={{ ...style.content, fontSize }}
                style={styles.popper}
                {...attributes.popper}
                data-at={dataAt ? Sephora.debug.dataAt(dataAt) : null}
            >
                {content}
                {isMobile && dismissButton && (
                    <button
                        style={style.dismissButton}
                        onClick={hideClick}
                    >
                        {getText('gotIt')}
                    </button>
                )}
                <span
                    ref={setArrowElement}
                    style={{
                        ...styles.arrow,
                        ...(isTopOrBottom
                            ? {
                                marginLeft: arrowOffset
                            }
                            : {
                                marginTop: arrowOffset
                            })
                    }}
                    data-popper-arrow
                    css={style.arrow}
                />
            </span>
        </>
    );
}

const style = {
    content: {
        display: 'none',
        textAlign: 'left',
        zIndex: 1,
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.tight,
        padding: space[2],
        borderRadius: radii[2],
        color: colors.white,
        backgroundColor: TOOLTIP_COLOR,
        maxWidth: 280,
        whiteSpace: 'normal',
        '&[data-popper-placement^="top"] > [data-popper-arrow]': {
            bottom: -ARROW_SIZE,
            borderBottomWidth: 0,
            borderTopColor: TOOLTIP_COLOR
        },
        '&[data-popper-placement^="right"] > [data-popper-arrow]': {
            right: -ARROW_SIZE,
            borderLeftWidth: 0,
            borderRightColor: TOOLTIP_COLOR
        },
        '&[data-popper-placement^="bottom"] > [data-popper-arrow]': {
            top: -ARROW_SIZE,
            borderTopWidth: 0,
            borderBottomColor: TOOLTIP_COLOR
        },
        '&[data-popper-placement^="left"] > [data-popper-arrow]': {
            left: -ARROW_SIZE,
            borderRightWidth: 0,
            borderLeftColor: TOOLTIP_COLOR
        },
        '& a': {
            textDecoration: 'underline',
            '&:hover': {
                opacity: 0.6
            }
        }
    },
    arrow: {
        display: 'block',
        width: 0,
        height: 0,
        borderWidth: ARROW_SIZE,
        borderColor: 'transparent',
        borderStyle: 'solid'
    },
    dismissButton: {
        display: 'block',
        marginTop: space[2],
        padding: `2px ${space[2]}px`,
        border: `1px solid ${colors.white}`,
        borderRadius: 12
    }
};

Tooltip.propTypes = {
    children: PropTypes.element.isRequired,
    content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    side: PropTypes.oneOf(['auto', 'top', 'right', 'bottom', 'left']),
    sideOffset: PropTypes.number,
    align: PropTypes.oneOf(['start', 'end']),
    arrowOffset: PropTypes.number,
    isFixed: PropTypes.bool,
    fontSize: PropTypes.string
};

Tooltip.defaultProps = {
    side: 'top',
    sideOffset: 0,
    dismissButton: false,
    fontSize: 'xs'
};

export default wrapFunctionalComponent(Tooltip, 'Tooltip');
