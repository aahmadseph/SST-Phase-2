import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import RewardsBazaar from 'components/RewardsBazaar/RewardsBazaar';

const Rewards = props => {
    return (
        <div>
            <RewardsBazaar regions={props.regions} />
        </div>
    );
};

export default wrapFunctionalComponent(Rewards, 'Rewards');
