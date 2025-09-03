import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(userSelector, user => {
    return {
        user
    };
});

const functions = null;

const withPixleeUploaderProps = wrapHOC(connect(fields, functions));

export {
    withPixleeUploaderProps, fields, functions
};
