import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import FollowList from 'components/RichProfile/UserProfile/common/FollowList/FollowList';

const Following = () => {
    return (
        <main>
            <FollowList />
        </main>
    );
};

export default wrapFunctionalComponent(Following, 'Following');
