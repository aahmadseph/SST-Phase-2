import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Image
} from 'components/ui';

function HeaderSection({ product }) {
    return (
        <Flex
            paddingX={[4, 4]}
            gap={[4, 4]}
        >
            <Box>
                <Image
                    display='block'
                    src={product.packetImage}
                    width={'100%'}
                    maxWidth={48}
                    height={'auto'}
                    alt={product.skuImages?.altText}
                />
            </Box>
            <Flex flexDirection='column'>
                <Text
                    fontSize='base'
                    fontWeight='bold'
                    textAlign='left'
                >
                    {product.brandName}
                </Text>
                <Text
                    fontSize='base'
                    textAlign='left'
                    lineHeight='tight'
                >
                    {product.productName}
                </Text>
            </Flex>
        </Flex>
    );
}

export default wrapFunctionalComponent(HeaderSection, 'HeaderSection');
