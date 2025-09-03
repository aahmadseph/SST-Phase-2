import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function CountCircle(props) {
    return <Box {...props} />;
}

CountCircle.defaultProps = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'full',
    fontWeight: 'bold',
    fontSize: 'sm',
    color: 'white',
    backgroundColor: 'red',
    width: 20,
    height: 20,
    position: 'absolute',
    top: -2,
    right: -7
};

export default wrapFunctionalComponent(CountCircle, 'CountCircle');
