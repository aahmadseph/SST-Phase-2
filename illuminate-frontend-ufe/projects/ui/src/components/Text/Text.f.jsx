/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';

import {
    compose, color, layout, space, typography
} from 'styled-system';
import theme from 'style/theme';

const StyledComponent = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'span',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [
        props => [
            styles.base,
            props.numberOfLines && [props.numberOfLines === 1 ? styles.textOneLine : styles.textMultiLine, { WebkitLineClamp: props.numberOfLines }],
            props.baseCss,
            compose(color, layout, space, typography),
            props.css
        ]
    ]
});

const Text = React.forwardRef((props, ref) => {
    return (
        <StyledComponent
            __ref={ref}
            {...props}
        />
    );
});

Text.propTypes = {
    // Max number of displayed lines; requires block element type or display
    numberOfLines: PropTypes.number
};

Text.defaultProps = {
    theme
};

const styles = {
    base: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
    },
    textOneLine: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    textMultiLine: {
        display: '-webkit-box !important',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitBoxOrient: 'vertical'
    }
};

export default wrapFunctionalComponent(Text, 'Text');
