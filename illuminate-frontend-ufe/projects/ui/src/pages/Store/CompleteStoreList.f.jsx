import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import StoreList from 'components/Stores/StoreList/StoreList';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';
import anaConsts from 'analytics/constants';

const CompleteStoreList = props => {
    const { storeGroups = {} } = props;

    return (
        <React.Fragment>
            <StoreList storeGroups={storeGroups} />
            <BackToTopButton analyticsLinkName={anaConsts.LinkData.STORESLIST} />
        </React.Fragment>
    );
};

export default wrapFunctionalComponent(CompleteStoreList, 'CompleteStoreList');
