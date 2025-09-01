import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';

function ModalTitle({ idPrefix, ...props }) {
    return (
        <Text
            id={`${idPrefix}Title`}
            baseCss={{
                width: '100%'
            }}
            {...props}
        />
    );
}

ModalTitle.defaultProps = {
    is: 'h2',
    lineHeight: 'tight',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'md'
};

export default wrapFunctionalComponent(ModalTitle, 'ModalTitle');
