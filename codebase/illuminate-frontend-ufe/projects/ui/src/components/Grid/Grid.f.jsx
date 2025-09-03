import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, border, color, flexbox, layout, typography, shadow, space
} from 'styled-system';
import grid from 'style/grid';
import theme from 'style/theme';
import uiUtils from 'utils/UI';

const StyledComponent = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'div',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [props => [props.baseCss, compose(border, color, flexbox, grid, layout, typography, shadow, space), props.css]]
});

const px = n => (typeof n === 'number' ? n + 'px' : n);

const widthToColumns = (width, repeat) =>
    Array.isArray(width) ? width.map(w => widthToColumns(w, repeat)) : !!width && `repeat(auto-${repeat}, minmax(${px(width)}, 1fr))`;

const countToColumns = n => (Array.isArray(n) ? n.map(countToColumns) : !!n && (typeof n === 'number' ? `repeat(${n}, 1fr)` : n));

const Grid = React.forwardRef(({ width, columns, repeat, ...props }, ref) => {
    const gridTemplateColumns = width ? widthToColumns(width, repeat) : countToColumns(columns);

    return (
        <StyledComponent
            __ref={ref}
            gridTemplateColumns={gridTemplateColumns}
            {...props}
            {...uiUtils.getAriaButtonProps('div', props)}
        />
    );
});

Grid.defaultProps = {
    theme,
    display: 'grid',
    gap: 3,
    repeat: 'fit'
};

export default wrapFunctionalComponent(Grid, 'Grid');
