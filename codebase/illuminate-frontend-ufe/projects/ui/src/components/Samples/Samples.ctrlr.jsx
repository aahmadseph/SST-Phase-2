/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'Store';
import BCC from 'utils/BCC';
import watch from 'redux-watch';
import { Grid } from 'components/ui';
import Location from 'utils/Location';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass/BaseClass';
import SampleItem from 'components/Product/SampleItem/SampleItem';

const { IMAGE_SIZES } = BCC;
const { wrapComponent } = FrameworkUtils;

class Samples extends BaseClass {
    state = {
        samplesList: null,
        allowedQtyPerOrder: 0
    };

    componentDidMount() {
        const samplesObj = store.getState().samples;
        const watchSamples = watch(store.getState, 'samples');
        const isReplacementOrder = Location.isReplacementOrderPage();

        if (samplesObj) {
            this.setState({
                samplesList: samplesObj.samples,
                allowedQtyPerOrder: isReplacementOrder ? this.props.allowedQtyPerOrder : samplesObj.allowedQtyPerOrder,
                isReplacementOrder: isReplacementOrder
            });
        }

        store.subscribe(
            watchSamples(newSamples => {
                this.setState({
                    samplesList: newSamples.samples || newSamples,
                    allowedQtyPerOrder: newSamples.allowedQtyPerOrder
                });
            }),
            this
        );
    }

    render() {
        const isMobile = Sephora.isMobile();
        const { isSamplesPage, analyticsContext } = this.props;
        const itemSpacing = isMobile || isSamplesPage ? 7 : 5;
        const samples = this.state.samplesList;
        const numSamplesPerRow = isMobile ? 2 : isSamplesPage ? 4 : 6;

        return (
            <Grid
                columns={numSamplesPerRow}
                gap={isMobile || isSamplesPage ? 5 : 3}
                rowGap={itemSpacing}
            >
                {samples &&
                    samples.map(sample => (
                        //revisit This
                        <SampleItem
                            key={sample.skuId}
                            imageSize={isMobile ? IMAGE_SIZES[162] : isSamplesPage ? IMAGE_SIZES[135] : IMAGE_SIZES[97]}
                            imagePath={sample.gridImage}
                            maxSampleQty={this.state.allowedQtyPerOrder}
                            isReplacementOrder={this.state.isReplacementOrder}
                            type={'sample'}
                            {...(isSamplesPage
                                ? {
                                    isSamplesPage: true,
                                    showProductName: true,
                                    isBoldProductName: true
                                }
                                : {
                                    isToolTipEnabled: true,
                                    buttonSize: 'sm'
                                })}
                            analyticsContext={analyticsContext}
                            {...sample}
                        />
                    ))}
            </Grid>
        );
    }
}

export default wrapComponent(Samples, 'Samples');
