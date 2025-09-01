/* eslint-disable object-curly-newline */
import React from 'react';
import framework from 'utils/framework';
import { Text } from 'components/ui';

const { wrapFunctionalComponent } = framework;

const HoursRow = ({ firstColProps, secondColProps }) => {
    return (
        <>
            <Text
                is='p'
                {...firstColProps}
            />
            {!!secondColProps && (
                <Text
                    is='p'
                    {...secondColProps}
                />
            )}
        </>
    );
};

export default wrapFunctionalComponent(HoursRow, 'HoursRow');
