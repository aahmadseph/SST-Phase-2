import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({ user: userSelector });
const withExperienceInfoProps = wrapHOC(connect(fields));

export {
    fields, withExperienceInfoProps
};
