import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function InputSwitch({ name, value, checked, ...props }) {
    const size = 24;
    const boxSize = 20;
    const color = checked ? 'green' : 'midGray';
    const transform = checked ? `translateX(${size}px)` : 'translateX(0)';

    return (
        <Box
            is='label'
            display='inline-flex'
            borderRadius='full'
            width={size * 2}
            height={size}
            padding={`${(size - boxSize) / 2}px`}
            backgroundColor={color}
            css={{
                cursor: 'pointer',
                transition: 'background-color .1s ease-in'
            }}
        >
            <input
                {...props}
                type='checkbox'
                value={value ? value : ''}
                name={name}
                checked={checked}
                css={{
                    position: 'absolute',
                    opacity: 0
                }}
            />
            <Box
                size={boxSize}
                borderRadius='full'
                color={color}
                backgroundColor='white'
                css={{
                    transform: transform,
                    transitionProperty: 'transform, color',
                    transitionDuration: '.1s',
                    transitionTimingFunction: 'ease-in'
                }}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(InputSwitch, 'InputSwitch');
