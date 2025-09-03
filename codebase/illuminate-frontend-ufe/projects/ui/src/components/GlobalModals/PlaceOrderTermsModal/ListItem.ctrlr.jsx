/* eslint-disable complexity */
/* eslint-disable camelcase */

import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { colors, space, fontWeights } from 'style/config';
import {
    Grid, Box, Text, Flex
} from 'components/ui';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { getImageAltText } from 'utils/Accessibility';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';

const { wrapComponent } = FrameworkUtils;
const { formatFrequencyType } = DeliveryFrequencyUtils;

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

class ListItem extends BaseClass {
    state = {
        isFewLeftFlagHidden: true,
        isQueryPresent: false
    };

    render() {
        const { item } = this.props;
        const displayName = (
            <>
                <strong data-at={Sephora.debug.dataAt('bsk_sku_brand')}>{item.sku?.brandName}</strong>
                <br />
                <span data-at={Sephora.debug.dataAt('bsk_sku_name')}>{item.sku?.productName}</span>
            </>
        );

        const [frequencyType = null, frequencyNum = null] = item.isReplenishment ? item.replenishmentFrequency.split(':') : [];

        return (
            <div data-at={Sephora.debug.dataAt('product_refinement')}>
                <Grid
                    gap={[`${SM_IMG_GAP}px`, 4]}
                    columns='auto 1fr'
                    lineHeight='tight'
                    alignItems='start'
                >
                    <Box data-at={Sephora.debug.dataAt('product_img_link')}>
                        <ProductImage
                            id={item.sku?.skuId}
                            size={[SM_IMG_SIZE, 97]}
                            skuImages={item.sku?.skuImages}
                            isPageRenderImg={null}
                            disableLazyLoad={true}
                            altText={getImageAltText(item.sku)}
                        />
                    </Box>
                    <div>
                        <Box fontSize='sm'>
                            <Text
                                is='p'
                                fontSize={['sm', 'base']}
                                marginBottom={1}
                            >
                                {displayName}
                            </Text>

                            <SizeAndItemNumber
                                sku={item.sku}
                                fontSize={['xs', 'sm']}
                                marginBottom={1}
                            />

                            <Text marginBottom={1}>
                                Deliver every:{' '}
                                <Text fontWeight='bold'>
                                    {frequencyNum} {formatFrequencyType(frequencyNum, frequencyType)}
                                </Text>
                            </Text>
                            <Grid
                                gap={2}
                                columns='1fr auto'
                                minHeight={[SM_IMG_SIZE, 0]}
                                marginBottom={1}
                            >
                                <Text fontWeight='bold'>QTY {item.qty}</Text>
                                <Flex gap={1}>
                                    <Text
                                        css={{
                                            textDecoration: 'line-through'
                                        }}
                                        fontWeight={fontWeights.bold}
                                        data-at={Sephora.debug.dataAt('bsk_sku_price')}
                                        children={item.listPriceSubtotal}
                                    />
                                    <Text
                                        css={{ color: colors.red }}
                                        data-at={Sephora.debug.dataAt('bsk_sale_price')}
                                        children={`${item?.sku?.replenishmentAdjusterPrice}${item.sku?.acceleratedPromotion ? '*' : ''}`}
                                    />
                                </Flex>
                            </Grid>
                        </Box>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default wrapComponent(ListItem, 'ListItem', true);
