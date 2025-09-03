import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import { compose, color, space } from 'styled-system';
import theme from 'style/theme';

const VIEWBOX_WIDTH = 7;
const VIEWBOX_HEIGHT = 4;
const RATIO = VIEWBOX_HEIGHT / VIEWBOX_WIDTH;

function getPath(direction) {
    switch (direction) {
        case 'up':
            return 'm6.5 3.5-3-3-3 3';
        case 'down':
            return 'm.5.5 3 3 3-3';
        case 'left':
            return 'm3.5.5-3 3 3 3';
        default:
            return 'm.5 6.5 3-3-3-3';
    }
}

const StyledSvg = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'svg'
    }),
    styledProps: [
        props => [
            {
                display: 'inline-block',
                verticalAlign: 'middle',
                stroke: 'currentColor',
                width: props.isUpOrDown ? '1em' : `${RATIO}em`,
                height: props.isUpOrDown ? `${RATIO}em` : '1em'
            },
            props.size && { fontSize: props.size },
            compose(color, space),
            props.css
        ]
    ]
});

function Chevron({ direction, isThicker, ...props }) {
    const isUpOrDown = direction === 'up' || direction === 'down';
    props.isUpOrDown = isUpOrDown;

    return (
        <StyledSvg
            aria-hidden
            viewBox={isUpOrDown ? `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}` : `0 0 ${VIEWBOX_HEIGHT} ${VIEWBOX_WIDTH}`}
            {...props}
        >
            <path
                d={getPath(direction)}
                fill='none'
                vectorEffect='non-scaling-stroke'
                strokeWidth={isThicker ? '1.5' : '1'}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </StyledSvg>
    );
}

Chevron.propTypes = {
    /** Direction of arrow */
    direction: PropTypes.oneOf(['up', 'down', 'left', 'right']).isRequired,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Increase stroke thickness */
    isThicker: PropTypes.bool
};

Chevron.defaultProps = {
    theme,
    direction: 'right',
    isThicker: false
};

export default wrapFunctionalComponent(Chevron, 'Chevron');
