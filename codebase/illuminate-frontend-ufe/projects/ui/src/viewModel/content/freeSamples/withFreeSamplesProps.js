import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import samplesSelector from 'selectors/samples/samplesSelector';
import sampleActions from 'actions/SampleActions';
import basketSelector from 'selectors/basket/basketSelector';
import skuUtils from 'utils/Sku';

const { fetchSamples } = sampleActions;

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(samplesSelector, basketSelector, (samplesDetails, basket) => {
    const samples = basket?.items?.filter(item => skuUtils.isSample(item.sku)) || [];
    const filteredSamples = skuUtils.getFilteredSamples(samples);
    const numberOfSamplesInBasket = filteredSamples?.length;

    return {
        samplesDetails,
        numberOfSamplesInBasket
    };
});

const functions = { fetchSamples };
const withFreeSamplesProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withFreeSamplesProps
};
