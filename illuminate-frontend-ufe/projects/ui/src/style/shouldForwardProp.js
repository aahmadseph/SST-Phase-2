/* eslint-disable no-shadow */
import memoize from '@emotion/memoize';
import isPropValid from '@emotion/is-prop-valid';
import {
    compose,
    space,
    typography,
    color,
    layout,
    flexbox,
    border,
    background,
    position,
    shadow,
    buttonStyle,
    textStyle,
    colorStyle
} from 'styled-system';

import grid from 'style/grid';

const all = compose(space, typography, color, layout, flexbox, border, background, position, grid, shadow, buttonStyle, textStyle, colorStyle);

const props = all.propNames;

const createShouldForwardProp = props => {
    const regex = new RegExp(`^(${props.join('|')})$`);

    // Styled components with a 'data-comp' attribute require the corresponding prop names to be forwarded to the DOM.
    const allowedProps = ['__ref', 'comps', 'fetchpriority'];

    return memoize(prop => {
        if (allowedProps.includes(prop) || (isPropValid(prop) && !regex.test(prop))) {
            return true;
        }

        // For all props that we don't want to forward
        return false;
    });
};

export default createShouldForwardProp(props);
