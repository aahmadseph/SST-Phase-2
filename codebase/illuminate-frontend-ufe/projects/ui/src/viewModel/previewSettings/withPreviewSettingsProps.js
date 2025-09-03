import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({
    user: userSelector
});

const functions = {};

const withPreviewSettingsProps = wrapHOC(connect(fields, functions));

export {
    withPreviewSettingsProps, fields, functions
};
