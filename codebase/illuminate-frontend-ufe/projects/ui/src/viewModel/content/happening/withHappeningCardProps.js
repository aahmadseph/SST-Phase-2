import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
import { preferredStoreIdSelector } from 'selectors/user/preferredStoreIdSelector';

const fields = createSelector(preferredStoreIdSelector, storeId => {
    return {
        storeId
    };
});
const withHappeningCardProps = wrapHOC(connect(fields, null));

export {
    withHappeningCardProps, fields
};
