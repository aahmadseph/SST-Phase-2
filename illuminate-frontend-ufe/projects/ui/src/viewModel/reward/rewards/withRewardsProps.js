import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import rewardsSelector from 'selectors/rewards/rewardsSelector';
import { userSelector } from 'selectors/user/userSelector';

const withRewardsProps = connect(
    createStructuredSelector({
        rewards: rewardsSelector,
        user: userSelector
    })
);

export default withRewardsProps;
