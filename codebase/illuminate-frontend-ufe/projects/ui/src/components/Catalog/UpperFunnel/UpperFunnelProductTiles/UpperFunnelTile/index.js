import UpperFunnelTile from 'components/Catalog/UpperFunnel/UpperFunnelProductTiles/UpperFunnelTile/UpperFunnelTile';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showRemoveGrayBgOnFulfillmentInfoSelector } from 'viewModel/selectors/testTarget/showRemoveGrayBackgroundOnFulfillmentInfoSelector';

const fields = createStructuredSelector({
    removeGrayBgOnFulfillmentInfo: showRemoveGrayBgOnFulfillmentInfoSelector
});

const withHighlightValueVisibilityProps = connect(fields);

export default withHighlightValueVisibilityProps(UpperFunnelTile);

