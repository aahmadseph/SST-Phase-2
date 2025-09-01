import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex, Icon } from 'components/ui';
import { colors, radii } from 'style/config';

function RemoveSample({ removeSample }) {
    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            width={'40px'}
            height={'40px'}
            borderRadius={radii.full}
            border={`1px solid ${colors.midGray}`}
            onClick={removeSample}
        >
            <Box
                width={16}
                height={16}
            >
                <Icon
                    name={'trash'}
                    color={colors.gray}
                    size={32}
                />
            </Box>
        </Flex>
    );
}

export default wrapFunctionalComponent(RemoveSample, 'RemoveSample');
