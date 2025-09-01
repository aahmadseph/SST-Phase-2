import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import IsLithiumSuccessfulSelector from 'selectors/socialInfo/isLithiumSuccessfulSelector';
import SocialProfileSelector from 'selectors/socialInfo/socialProfile/socialProfileSelector';
import compConstants from 'components/constants';

const { AVATAR_DEFAULT } = compConstants;
const { wrapHOC } = FrameworkUtils;
const { isLithiumSuccessfulSelector } = IsLithiumSuccessfulSelector;
const { socialProfileSelector } = SocialProfileSelector;
const fields = createSelector(isLithiumSuccessfulSelector, socialProfileSelector, (isLithiumSuccessful, socialProfile) => {
    let avatar = AVATAR_DEFAULT;
    const profileWithAvatar = !!(isLithiumSuccessful && socialProfile.avatar);

    if (profileWithAvatar) {
        avatar = socialProfile.avatar;
    }

    return { avatar };
});

const withAvatar = wrapHOC(connect(fields));

export {
    fields, withAvatar
};
