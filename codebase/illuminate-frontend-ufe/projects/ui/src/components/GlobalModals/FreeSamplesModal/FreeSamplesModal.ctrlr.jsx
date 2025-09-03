import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Button, Flex, Text, Grid
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import IMAGE_SIZES from 'utils/BCC';
import SampleItem from 'components/Product/SampleItem/SampleItem';
import anaConsts from 'analytics/constants';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/FreeSamplesModal/locales', 'FreeSamplesModal');
const DEFAULT_QUANTITY_SAMPLES = 2;

class FreeSamplesModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSamples();
    }

    close = () => {
        this.props.openFreeSamplesModal(false);
    };

    renderFreeSamples = () => {
        const { samplesDetails, numberOfSamplesInBasket } = this.props;

        return (
            <Grid
                columns={[2, 4]}
                gap={[5, 3]}
                rowGap={[7, 6]}
            >
                {samplesDetails?.samples &&
                    samplesDetails.samples.map(sample => (
                        <SampleItem
                            key={sample.skuId}
                            imageSize={[IMAGE_SIZES[162], IMAGE_SIZES[135]]}
                            imagePath={sample.gridImage}
                            maxSampleQty={samplesDetails.allowedQtyPerOrder}
                            isReplacementOrder={false}
                            isRwdBasketPage={true}
                            type={'sample'}
                            showProductName={true}
                            buttonSize={'sm'}
                            analyticsContext={anaConsts.CONTEXT.BASKET_SAMPLES}
                            {...sample}
                            numberOfSamplesInBasket={numberOfSamplesInBasket}
                        />
                    ))}
            </Grid>
        );
    };

    render() {
        const { samplesDetails } = this.props;

        return (
            <Modal
                showDismiss={true}
                width={866}
                hasBodyScroll={true}
                isOpen={this.props.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title children={getText('title', [samplesDetails.allowedQtyPerOrder || DEFAULT_QUANTITY_SAMPLES])} />
                </Modal.Header>
                <Modal.Body>{this.renderFreeSamples()}</Modal.Body>
                <Modal.Footer>
                    <Flex
                        flexDirection={['column', 'row']}
                        justifyContent='space-between'
                        alignItems={['baseline', 'center']}
                    >
                        <Text is='p'>
                            <strong>{`${getText('note')}: `}</strong>
                            {getText('footerNote')}
                        </Text>
                        <Button
                            variant='primary'
                            width={[null, 235]}
                            block={true}
                            onClick={this.close}
                            children={getText('done')}
                            marginTop={[2, 0]}
                        />
                    </Flex>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(FreeSamplesModal, 'FreeSamplesModal', true);
