/* eslint-disable no-shadow */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, border, color, flexbox, layout, position, typography, shadow, space, system
} from 'styled-system';
import grid from 'style/grid';
import inset from 'style/inset';

import theme from 'style/theme';
import uiUtils from 'utils/UI';

const scrollPadding = system({
    scrollPadding: {
        property: 'scrollPadding',
        scale: 'space'
    }
});

const StyledComponent = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'div',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [
        props => [props.baseCss, compose(border, color, flexbox, grid, inset, layout, position, typography, shadow, space, scrollPadding), props.css]
    ]
});

const Box = React.forwardRef((props, ref) => {
    return (
        <StyledComponent
            __ref={ref}
            {...props}
            {...uiUtils.getAriaButtonProps('div', props)}
        />
    );
});

Box.defaultProps = {
    theme,
    display: 'block'
};

export default wrapFunctionalComponent(Box, 'Box');
