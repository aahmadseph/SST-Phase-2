import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import CommunityNavigation from 'components/Community/CommunityNavigation';
import UsersGallery from 'components/Community/UsersGallery';

const UsersPublicGallery = () => {
    return (
        <>
            <CommunityNavigation section='profile' />
            <UsersGallery isUserPublicGallery={true} />
        </>
    );
};

export default wrapFunctionalComponent(UsersPublicGallery, 'UsersPublicGallery');
