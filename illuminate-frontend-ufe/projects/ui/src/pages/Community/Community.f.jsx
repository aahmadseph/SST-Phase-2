import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import CommunityBcc from 'components/CommunityHQ/CommunityBcc/CommunityBcc';
import CommunityNavigation from 'components/Community/CommunityNavigation';

const Community = () => {
    return (
        <div>
            <CommunityNavigation />
            <LegacyContainer is='main'>
                <CommunityBcc />
            </LegacyContainer>
        </div>
    );
};

export default wrapFunctionalComponent(Community, 'Community');
