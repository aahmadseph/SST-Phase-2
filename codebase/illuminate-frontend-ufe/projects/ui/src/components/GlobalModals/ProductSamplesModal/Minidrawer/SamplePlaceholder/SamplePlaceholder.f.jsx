import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex } from 'components/ui';

function SamplePlaceholder() {
    return (
        <Flex
            paddingX={[4, 4]}
            gap={[2]}
        >
            <Box css={styles.placeholder}></Box>
        </Flex>
    );
}

const styles = {
    placeholder: {
        border: '1px dashed #CCCCCC',
        borderRadius: 4,
        height: 48,
        width: 48
    }
};

export default wrapFunctionalComponent(SamplePlaceholder, 'SamplePlaceholder');
