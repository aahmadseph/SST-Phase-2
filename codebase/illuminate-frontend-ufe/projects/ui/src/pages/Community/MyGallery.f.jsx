import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';
import CommunityNavigation from 'components/Community/CommunityNavigation';
import UsersGallery from 'components/Community/UsersGallery';

const MyGalleryPage = () => {
    return (
        <>
            <CommunityNavigation section='profile' />
            <UsersGallery />
        </>
    );
};

const Component = wrapFunctionalComponent(MyGalleryPage, 'MyGalleryPage');

export default withEnsureUserIsSignedIn(Component);
