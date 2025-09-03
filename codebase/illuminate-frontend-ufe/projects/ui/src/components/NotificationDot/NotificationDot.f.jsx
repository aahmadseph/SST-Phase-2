import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function NotificationDot(props) {
    return <Box {...props} />;
}

NotificationDot.defaultProps = {
    display: 'inline-block',
    position: 'absolute',
    size: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'red'
};

export default wrapFunctionalComponent(NotificationDot, 'NotificationDot');
