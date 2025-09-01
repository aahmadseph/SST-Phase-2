import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';

import { compose, color, space } from 'styled-system';
import theme from 'style/theme';

const SOLID = '.4375em solid';
const TRANS = '.375em solid transparent';

const StyledSpan = getStyledComponent({
    InnerComp: getBaseComponent({ elementType: 'span' }),
    styledProps: [
        props => [
            {
                display: 'inline-block',
                borderLeft: props.direction === 'right' ? SOLID : props.direction === 'left' ? 0 : TRANS,
                borderRight: props.direction === 'left' ? SOLID : props.direction === 'right' ? 0 : TRANS,
                borderTop: props.direction === 'down' ? SOLID : props.direction === 'up' ? 0 : TRANS,
                borderBottom: props.direction === 'up' ? SOLID : props.direction === 'down' ? 0 : TRANS
            },
            props.size && { fontSize: props.size },
            compose(color, space),
            props.css
        ]
    ]
});

function Arrow(props) {
    return <StyledSpan {...props} />;
}

Arrow.propTypes = {
    direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Arrow.defaultProps = {
    theme,
    direction: 'down'
};

export default wrapFunctionalComponent(Arrow, 'Arrow');
