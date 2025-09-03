import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import UserProfile from 'components/RichProfile/UserProfile/UserProfile';
import CommunityNavigation from 'components/Community/CommunityNavigation';

const Profile = () => {
    const isPublicProfile = Sephora && Sephora.renderQueryParams && Sephora.renderQueryParams.urlPath.indexOf('users') !== -1;

    return (
        <div>
            {!isPublicProfile && <CommunityNavigation section='profile' />}
            <main>
                <UserProfile />
            </main>
        </div>
    );
};

export default wrapFunctionalComponent(Profile, 'Profile');
