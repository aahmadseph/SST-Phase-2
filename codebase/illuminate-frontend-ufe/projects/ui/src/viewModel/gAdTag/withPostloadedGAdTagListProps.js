import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pathSelector from 'selectors/historyLocation/pathSelector';
import templateSelector from 'selectors/page/templateInformation/templateSelector';

const { wrapHOC } = FrameworkUtils;
const withPostloadedGAdTagListProps = wrapHOC(
    connect(
        createStructuredSelector({
            template: templateSelector,
            path: pathSelector
        })
    )
);

export { withPostloadedGAdTagListProps };
