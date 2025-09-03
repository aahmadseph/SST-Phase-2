import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import FollowList from 'components/RichProfile/UserProfile/common/FollowList/FollowList';

const Followers = () => {
    return (
        <main>
            <FollowList isFollowers />
        </main>
    );
};

export default wrapFunctionalComponent(Followers, 'Followers');
