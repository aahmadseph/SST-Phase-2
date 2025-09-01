import RegularProduct from 'components/ProductPage/Type/RegularProduct/RegularProduct';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showHighlightValuePriceOnPDPSelector } from 'viewModel/selectors/testTarget/showHighlightValuePriceOnPDPSelector';
import { showHighlightLayerWithPDP } from 'viewModel/selectors/testTarget/showHighlightLayerWithPDP';
import { showAIBeautyChatSelector } from 'ai/selectors/testTarget/showAIBeautyChatSelector';
import { isShowSMNEnabledSelector } from 'viewModel/selectors/testTarget/showSMNSelector';

const fields = createStructuredSelector({
    highlightValueHidden: showHighlightValuePriceOnPDPSelector,
    highlightLayerWithPDP: showHighlightLayerWithPDP,
    showAIBeautyChat: showAIBeautyChatSelector,
    showSMNEnabled: isShowSMNEnabledSelector
});

const withHighlightValueVisibilityProps = connect(fields);

export default withHighlightValueVisibilityProps(RegularProduct);
