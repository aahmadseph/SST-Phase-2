import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import samplesSelector from 'selectors/samples/samplesSelector';
import sampleActions from 'actions/SampleActions';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import basketSelector from 'selectors/basket/basketSelector';
import skuUtils from 'utils/Sku';

const { openFreeSamplesModal } = RwdBasketActions;
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

const functions = { fetchSamples, openFreeSamplesModal };
const withFreeSamplesModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withFreeSamplesModalProps
};
