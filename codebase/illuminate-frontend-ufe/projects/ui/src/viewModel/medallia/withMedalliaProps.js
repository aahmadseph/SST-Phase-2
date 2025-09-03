import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pathSelector from 'selectors/historyLocation/pathSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({
    path: pathSelector
});

const withMedalliaProps = wrapHOC(connect(fields));

export { withMedalliaProps };
