import React from 'react';
import RemoveSample from 'components/GlobalModals/ProductSamplesModal/Minidrawer/RemoveSample';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Image
} from 'components/ui';
import { colors, fontSizes, lineHeights } from 'style/config';
const lineHeightDescription = lineHeights.tight;
const fontSizeDescription = 'sm';
const numberOfLinesDescription = 2;
const paddingTopDescription = 6;

function SampleAdded({ product, removeSample }) {
    return (
        <Flex
            paddingX={[4, 4]}
            gap={[2]}
        >
            <Box
                boxShadow='light'
                borderRadius={2}
            >
                <Image
                    display='block'
                    src={product.skuImages?.image250}
                    width={'100%'}
                    maxWidth={48}
                    height={'auto'}
                    alt={product.skuImages?.altText}
                    borderRadius={2}
                />
            </Box>
            <Flex
                flexDirection='column'
                flex={1}
            >
                <Flex
                    flexDirection='row'
                    gap={2}
                >
                    {product.brandName && (
                        <Text
                            fontSize='base'
                            fontWeight='bold'
                            textAlign='left'
                            lineHeight='14px'
                            css={styles.brandName}
                        >
                            {product.brandName}
                        </Text>
                    )}
                    <Text
                        fontSize='base'
                        textAlign='left'
                        lineHeight='14px'
                        css={styles.truncate}
                    >
                        {product.productName}
                    </Text>
                </Flex>
                <Text
                    fontSize='sm'
                    textAlign='left'
                    color={colors.gray}
                    css={styles.truncateLines}
                >
                    {product.variationValue} {product.variationDesc ? `- ${product.variationDesc}` : ''}
                </Text>
            </Flex>
            <RemoveSample removeSample={removeSample} />
        </Flex>
    );
}

const styles = {
    brandName: {
        whiteSpace: 'nowrap'
    },
    truncate: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        flex: 1
    },
    truncateLines: {
        lineHeight: lineHeightDescription,
        paddingTop: paddingTopDescription + 'px',
        maxHeight: lineHeightDescription * fontSizes[fontSizeDescription] * numberOfLinesDescription + paddingTopDescription,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: numberOfLinesDescription,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis'
    }
};

export default wrapFunctionalComponent(SampleAdded, 'SampleAdded');
