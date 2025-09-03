import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import ConnectedCreatorStoreFront from 'components/CreatorStoreFront';

const CreatorStoreFront = () => {
    return (
        <>
            <ConnectedCreatorStoreFront />
        </>
    );
};

export default wrapFunctionalComponent(CreatorStoreFront, 'CreatorStoreFront');
