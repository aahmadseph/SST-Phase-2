/* eslint-disable object-curly-newline */
import React from 'react';
import { modal, colors, space } from 'style/config';
import { Box } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

function RadioFilter({ isSelected, label, value, onClick }) {
    const dataAtValue = isSelected ? Sephora.debug.dataAt('selected_sort_option') : Sephora.debug.dataAt('sort_option');

    return (
        <Box
            data-at={dataAtValue}
            display='flex'
            alignItems='center'
            lineHeight='tight'
            paddingY={3}
            paddingX={[modal.paddingX[0], 4]}
            width={[`calc(100% + ${space[4] * 2}px)`, '100%']}
            onClick={() => onClick(value)}
            fontWeight={isSelected && 'bold'}
            baseCss={{
                outline: 0,
                transition: 'background-color .2s',
                '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
            }}
        >
            {label}
        </Box>
    );
}

export default wrapFunctionalComponent(RadioFilter, 'RadioFilter');
