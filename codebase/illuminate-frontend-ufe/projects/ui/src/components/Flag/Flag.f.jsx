import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { radii } from 'style/config';
import { Text } from 'components/ui';

function Flag({ isLarge, ...props }) {
    return (
        <Text
            width='max-content'
            fontSize={isLarge ? 'xs' : 10}
            lineHeight={isLarge ? 'base' : '1.3'}
            {...props}
        />
    );
}

Flag.defaultProps = {
    display: 'inline-block',
    fontWeight: 'var(--font-weight-bold)',
    backgroundColor: 'black',
    color: 'white',
    paddingX: '.8em',
    baseCss: {
        borderRadius: radii[2],
        verticalAlign: 'middle',
        textTransform: 'uppercase'
    }
};

Flag.shouldUpdatePropsOn = ['children'];

export default wrapFunctionalComponent(Flag, 'Flag');
