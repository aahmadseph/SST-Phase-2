import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

function Loader({
    hasBg = true, isFixed, isShown, isInline, minHeight, ...props
}) {
    return (
        <div
            css={[
                {
                    display: !isShown ? 'none' : null,
                    cursor: 'wait',
                    backgroundImage: 'url(/img/ufe/loader.gif)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: 155
                },
                isInline
                    ? {
                        position: 'relative'
                    }
                    : {
                        position: isFixed ? 'fixed' : 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                hasBg && {
                    backgroundColor: 'rgba(255,255,255,.75)'
                }
            ]}
            {...props}
        />
    );
}

Loader.propTypes = {
    /** Fixed fullscreen overlay */
    isFixed: PropTypes.bool,
    /** Shows and hides Loader */
    isShown: PropTypes.bool,
    isInline: PropTypes.bool,
    minHeight: PropTypes.number
};

Loader.defaultProps = {
    minHeight: 155
};

export default wrapFunctionalComponent(Loader, 'Loader');
