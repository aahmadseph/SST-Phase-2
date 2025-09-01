/* eslint-disable class-methods-use-this */
import React from 'react';
import SampleAdded from 'components/GlobalModals/ProductSamplesModal/Minidrawer/SampleAdded';
import SamplePlaceholder from 'components/GlobalModals/ProductSamplesModal/Minidrawer/SamplePlaceholder';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import { colors } from 'style/config';
import {
    Box, Flex, Text, Button
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import productSamplesActions from 'actions/ProductSamplesActions';

class Minidrawer extends BaseClass {
    componentDidMount() {
        store.setAndWatch('basket', this, null, true);
    }

    componentDidUpdate(prevProps) {
        const { productSamples } = this.props;

        if (productSamples.length > prevProps.productSamples.length) {
            this.setState({ open: true });
        }
    }

    getSampleOrPlaceholder(index) {
        // check if we can use RWD version here easily or create story
        const { productSamples, removeProductFromBasket } = this.props;
        const currentSample = productSamples[index];

        if (currentSample) {
            return (
                <SampleAdded
                    key={currentSample.sku.skuId}
                    product={currentSample.sku}
                    removeSample={() =>
                        removeProductFromBasket({
                            sku: currentSample.sku,
                            productId: currentSample.sku.productId
                        })
                    }
                />
            );
        }

        return <SamplePlaceholder />;
    }

    closeModal() {
        store.dispatch(productSamplesActions.closeProductSamplesModal());
    }

    render() {
        const { productSamples, localization, open } = this.props;

        const productSamplesSelected = productSamples.length;
        const productSamplesLeft = 3 - productSamplesSelected;
        const productSamplesArray = [...productSamples];

        for (let i = 0; i < productSamplesLeft; i++) {
            productSamplesArray.push({
                type: 'placeholder',
                sku: {
                    skuId: 0
                }
            });
        }

        return (
            <Flex
                paddingY={3}
                borderTop={1}
                borderColor={colors.lightGray}
                flexDirection='column'
                css={styles.miniDrawer}
            >
                <Flex
                    gap={3}
                    justifyContent='space-between'
                    paddingX={4}
                >
                    <Text>
                        {localization.samplesInBasket} ({productSamplesSelected || 0}/3)
                    </Text>
                    <button
                        onClick={this.props.handleMinidrawerState}
                        css={styles.button}
                    >
                        {open ? localization.showLess : localization.showMore}
                    </button>
                </Flex>
                {open && (
                    <>
                        <hr css={styles.divider} />
                        <Flex
                            gap={4}
                            flexDirection='column'
                        >
                            {this.getSampleOrPlaceholder(0)}
                            {this.getSampleOrPlaceholder(1)}
                            {this.getSampleOrPlaceholder(2)}
                        </Flex>
                    </>
                )}
                <hr css={styles.divider} />
                <Box
                    width={'100%'}
                    paddingX={4}
                >
                    <Button
                        variant='primary'
                        block={true}
                        children={localization.done}
                        onClick={this.props.requestClose}
                        style={{
                            width: '100%'
                        }}
                    />
                </Box>
            </Flex>
        );
    }
}

const styles = {
    divider: {
        borderTop: `1px solid ${colors.lightGray}`
    },
    button: {
        color: colors.blue
    },
    miniDrawer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        background: 'white'
    }
};

export default wrapComponent(Minidrawer, 'Minidrawer', true);
