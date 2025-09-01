import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({
    isAnonymous: isAnonymousSelector
});

const functions = null;

const withAccountGreetingProps = wrapHOC(connect(fields, functions));

export {
    withAccountGreetingProps, fields, functions
};
