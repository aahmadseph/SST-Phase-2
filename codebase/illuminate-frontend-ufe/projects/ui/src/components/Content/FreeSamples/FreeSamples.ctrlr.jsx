/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Flex, Text, Box, Grid
} from 'components/ui';
import IMAGE_SIZES from 'utils/BCC';
import SampleItem from 'components/Product/SampleItem/SampleItem';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Content/FreeSamples/locales', 'FreeSamples');

class FreeSamples extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSamples();
    }

    render() {
        const { numberOfSamplesInBasket, samplesDetails } = this.props;

        return (
            <Box>
                <Text
                    is='h1'
                    fontSize={['lg', 'xl']}
                    lineHeight='tight'
                    fontWeight='bold'
                >
                    {getText('title')}
                </Text>
                <Flex
                    flexDirection={['column', 'row']}
                    justifyContent='space-between'
                    marginTop={2}
                >
                    <Text
                        is='p'
                        lineHeight='tight'
                    >
                        {getText('youCanSelect')}
                    </Text>
                    <Text
                        is='p'
                        lineHeight='tight'
                        marginTop={[2, 0]}
                        fontWeight='bold'
                    >
                        {getText('countMessage', [numberOfSamplesInBasket])}
                    </Text>
                </Flex>
                <Grid
                    marginTop={[5, 6]}
                    columns={[2, 5]}
                    gap={[4, 6]}
                    rowGap={[5, 7]}
                >
                    {samplesDetails?.samples?.map(sample => (
                        <SampleItem
                            key={sample.skuId}
                            imageSize={[IMAGE_SIZES[162], IMAGE_SIZES[135]]}
                            imagePath={sample.gridImage}
                            maxSampleQty={samplesDetails.allowedQtyPerOrder}
                            isReplacementOrder={false}
                            isRwdBasketPage={true}
                            type='sample'
                            showProductName={true}
                            buttonSize='sm'
                            numberOfSamplesInBasket={numberOfSamplesInBasket}
                            {...sample}
                        />
                    ))}
                </Grid>
            </Box>
        );
    }
}

export default wrapComponent(FreeSamples, 'FreeSamples', true);
