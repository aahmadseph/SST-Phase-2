import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import ProfileLists from 'components/RichProfile/Lists/Lists';

const Lists = () => {
    return (
        <div>
            <ProfileLists />
        </div>
    );
};

export default wrapFunctionalComponent(Lists, 'Lists');
