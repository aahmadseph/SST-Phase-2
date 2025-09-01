import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';
import { site } from 'style/config';
import analyticsConsts from 'analytics/constants';
import { MOBILE_HEADER_HEIGHT } from 'components/CreatorStoreFront/SimpleChicletNav';

function CSFBackToTopButton({ isMainRoute }) {
    const backToTopPosition = isMainRoute ? site.headerHeight + MOBILE_HEADER_HEIGHT : site.headerHeight;

    return (
        <BackToTopButton
            topPosition={backToTopPosition}
            customMarginTop={4}
            analyticsLinkName={analyticsConsts.LinkData.BACK_TO_TOP}
        />
    );
}

export default wrapFunctionalComponent(CSFBackToTopButton, 'CSFBackToTopButton');
