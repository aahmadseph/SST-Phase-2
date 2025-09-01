import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex, Text } from 'components/ui';
import SampleProduct from 'components/GlobalModals/ProductSamplesModal/SampleProduct';
import swatchUtils from 'utils/Swatch';
const { createRefinementGroups } = swatchUtils;

function SamplesList({
    samples, productId, isAddToBasketDisabled, productSamplesInBasket, miniDrawerOpen
}) {
    const groups = createRefinementGroups({
        regularChildSkus: samples
    });

    function getSample(sample) {
        const isInBasket = productSamplesInBasket.some(productSample => productSample?.sku?.skuId === sample.skuId);

        return (
            <SampleProduct
                sample={sample}
                key={sample.skuId}
                productId={productId}
                isAddToBasketDisabled={isAddToBasketDisabled}
                isInBasket={isInBasket}
            />
        );
    }

    const groupName = Object.keys(groups).length > 0 ? Object.keys(groups)[0] : '';

    return (
        <Flex
            paddingX={4}
            flexDirection='column'
        >
            <Box
                paddingTop={3}
                paddingBottom={3}
            >
                <Text
                    fontSize='sm'
                    textAlign='left'
                    fontWeight='bold'
                >
                    {groupName}
                </Text>
            </Box>
            <Flex
                paddingBottom={miniDrawerOpen ? '200px' : 0}
                flexDirection='column'
            >
                {samples.map(getSample)}
            </Flex>
        </Flex>
    );
}

export default wrapFunctionalComponent(SamplesList, 'SamplesList');
