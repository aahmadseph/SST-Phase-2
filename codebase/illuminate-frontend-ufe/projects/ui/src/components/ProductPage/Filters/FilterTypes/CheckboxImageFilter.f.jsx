/* eslint-disable object-curly-newline */
import React from 'react';
import { modal, colors } from 'style/config';
import { Box, Image } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

function CheckboxImageFilter({ isSelected, label, value, image, onClick }) {
    return (
        <Box
            is='div'
            display='flex'
            alignItems='center'
            data-at={Sephora.debug.dataAt('color_option')}
            onClick={() => onClick(value)}
            lineHeight='tight'
            paddingY='2px'
            paddingX={[modal.paddingX[0] - 2, 3]}
            baseCss={{
                outline: 0,
                transition: 'background-color .2s',
                '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
            }}
        >
            <Box
                padding='2px'
                borderRadius='full'
                border={2}
                borderColor={isSelected ? 'black' : 'transparent'}
                marginRight='.5em'
                flexShrink={0}
            >
                <Image
                    borderRadius='full'
                    display='block'
                    src={image}
                    size={32}
                />
            </Box>
            {label}
        </Box>
    );
}

export default wrapFunctionalComponent(CheckboxImageFilter, 'CheckboxImageFilter');
