import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, color, space, system
} from 'styled-system';
import theme from 'style/theme';

import PATHS from 'components/Icon/paths';

const size = system({
    size: {
        property: 'fontSize',
        scale: 'fontSizes'
    }
});

const StyledSvg = getStyledComponent({
    InnerComp: getBaseComponent({ elementType: 'svg' }),
    styledProps: [
        props => [
            {
                display: 'inline-block',
                width: '1em',
                height: '1em',
                position: 'relative',
                verticalAlign: 'text-bottom',
                fill: 'currentColor',
                flexShrink: 0
            },
            compose(color, space, size),
            props.css
        ]
    ]
});

function Icon({ name, ...props }) {
    return (
        <StyledSvg
            viewBox='0 0 24 24'
            {...props}
        >
            {PATHS[name]}
        </StyledSvg>
    );
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    ['aria-hidden']: PropTypes.oneOf([true, null])
};

Icon.defaultProps = {
    theme,
    size: 24,
    ['aria-hidden']: true
};

export default wrapFunctionalComponent(Icon, 'Icon');
