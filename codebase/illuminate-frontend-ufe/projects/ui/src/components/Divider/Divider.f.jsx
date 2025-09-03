import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, border, space, system
} from 'styled-system';
import theme from 'style/theme';

const display = system({ display: { property: 'display' } });

const StyledDiv = getStyledComponent({
    InnerComp: getBaseComponent({ elementType: 'div' }),
    styledProps: [compose(display, border, space), props => props.css]
});
// const StyledDiv = styled('div', { shouldForwardProp })();

function Divider({ color, height, thick, ...props }) {
    let borderBottom = height;
    let borderColor = color;

    if (thick) {
        borderBottom = 3;
        borderColor = 'nearWhite';
    }

    return (
        <StyledDiv
            borderBottom={borderBottom}
            borderColor={borderColor}
            {...props}
        />
    );
}

Divider.defaultProps = {
    theme,
    height: 1,
    color: 'divider'
};

export default wrapFunctionalComponent(Divider, 'Divider');
