import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';
import TlpSelector from 'selectors/page/targetedLandingPromotion/tlpSelector';
const { tlpSelector } = TlpSelector;
const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, authSelector, tlpSelector, (user, auth, content) => {
    return {
        user,
        auth,
        content
    };
});

const functions = null;

const withTargetedLandingPromotionProps = wrapHOC(connect(fields, null));

export {
    withTargetedLandingPromotionProps, fields, functions
};
