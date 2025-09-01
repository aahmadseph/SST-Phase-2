import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { screenReaderOnlyStyle } from 'style/config';

function VisuallyHidden({ is, ...props }) {
    const Component = is;

    return (
        <Component
            css={screenReaderOnlyStyle}
            {...props}
        />
    );
}

VisuallyHidden.defaultProps = {
    is: 'div'
};

export default wrapFunctionalComponent(VisuallyHidden, 'VisuallyHidden');
