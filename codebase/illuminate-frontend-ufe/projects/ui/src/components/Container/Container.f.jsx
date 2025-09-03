import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, site } from 'style/config';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import * as styledSystem from 'styled-system';
import theme from 'style/theme';

const styledSpace = styledSystem.space;

const StyledComponent = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'div',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [
        props => [
            {
                width: '100%',
                maxWidth: props.hasLegacyWidth ? site.legacyWidth + space.container * 2 : site.containerMax + space.container * 2
            },
            styledSpace,
            props.css
        ]
    ]
});

const Container = React.forwardRef((props, ref) => {
    return (
        <StyledComponent
            __ref={ref}
            {...props}
        />
    );
});

Container.defaultProps = {
    theme,
    paddingX: 'container',
    marginX: 'auto'
};

export default wrapFunctionalComponent(Container, 'Container');
