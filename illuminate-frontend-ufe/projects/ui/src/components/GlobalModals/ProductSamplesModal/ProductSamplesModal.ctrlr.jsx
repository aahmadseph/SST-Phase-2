import store from 'Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal';
import { Box, Text } from 'components/ui';
import React from 'react';
import typography from 'style/typography';
import { wrapComponent } from 'utils/framework';
import HeaderSection from 'components/GlobalModals/ProductSamplesModal/HeaderSection';
import Minidrawer from 'components/GlobalModals/ProductSamplesModal/Minidrawer';
import SamplesList from 'components/GlobalModals/ProductSamplesModal/SamplesList';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import productSamplesActions from 'actions/ProductSamplesActions';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ProductSamplesModal/locales', 'ProductSamplesModal');
const MAX_SAMPLES = 3;

class ProductSamplesModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            miniDrawerOpen: false,
            originalSamples: props.productSamplesInBasket
        };
    }

    requestClose = () => {
        const selectedSamples = this.props.productSamplesInBasket;
        const newSamplesSelected = !this.areSamplesListsEqual({
            originalSamples: this.state.originalSamples,
            selectedSamples
        });

        const hasSelectedSamples = selectedSamples.length > 0;

        store.dispatch(productSamplesActions.closeProductSamplesModal({ newSamplesSelected, hasSelectedSamples }));
    };

    handleMinidrawerState = () => {
        const { miniDrawerOpen } = this.state;
        this.setState({ miniDrawerOpen: !miniDrawerOpen });
    };

    areSamplesListsEqual = ({ originalSamples, selectedSamples }) => {
        if (originalSamples.length !== selectedSamples.length) {
            return false;
        }

        // Extract skuIds from both lists
        const skuIdsOriginalSamples = originalSamples.map(item => item.sku.skuId).sort();
        const skuIdsSelectedSamples = selectedSamples.map(item => item.sku.skuId).sort();

        return skuIdsOriginalSamples.every((skuId, index) => skuId === skuIdsSelectedSamples[index]);
    };

    render() {
        const samples = this.props.productSamples;
        const isAddToBasketDisabled = this.props.productSamplesInBasket.length >= MAX_SAMPLES;

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={375}
            >
                <Modal.Header css={styles.content}>
                    <HeaderSection product={this.props.mainProductSample} />
                </Modal.Header>
                <Modal.Body css={[typography, styles.contentBody]}>
                    <Box css={[styles.modalBody]}>
                        <Box
                            paddingX={[4, 4]}
                            css={styles.subHeader}
                            paddingY={3}
                        >
                            <Text
                                is='p'
                                width='100%'
                                fontSize='base'
                                textAlign='left'
                                lineHeight='tight'
                                marginBottom={0}
                            >
                                {getText('instructions')}
                            </Text>
                        </Box>
                        <SamplesList
                            productSamplesInBasket={this.props.productSamplesInBasket}
                            isAddToBasketDisabled={isAddToBasketDisabled}
                            samples={samples}
                            productId={this.props.mainProductSample.productId}
                            miniDrawerOpen={this.state.miniDrawerOpen}
                        />
                    </Box>
                    <Minidrawer
                        handleMinidrawerState={this.handleMinidrawerState}
                        open={this.state.miniDrawerOpen}
                        requestClose={this.requestClose}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    modalBody: {
        overflow: 'auto',
        maxHeight: '650px',
        paddingBottom: 100,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
    },
    content: {
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        overflow: 'hidden'
    },
    contentBody: {
        paddingTop: '0px !important',
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        overflow: 'hidden'
    },
    footer: {
        paddingBottom: '0px !important',
        paddingRight: '0px !important',
        paddingLeft: '0px !important'
    },
    copy: {
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        ul: {
            marginBottom: 0
        },
        'li + li': {
            marginTop: '1em'
        }
    },
    subHeader: {
        borderBottom: '1px solid #EEEEEE'
    }
};

export default wrapComponent(ProductSamplesModal, 'ProductSamplesModal');
