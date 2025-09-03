import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import LoadSpaPageProgressBar from 'components/LoadSpaPageProgressBar/LoadSpaPageProgressBar';
import SpaUtils from 'utils/Spa';
import { withLoadSpaPageProgress } from 'hocs/page/withLoadSpaPageProgress';

const ConnectedLoadSpaPageProgressBar = withLoadSpaPageProgress(LoadSpaPageProgressBar);

const Root = ({ pageTemplate }) => {
    let Page = React.Fragment;

    if (SpaUtils.isSpaTemplate(pageTemplate)) {
        Page = Sephora.combinedPages[pageTemplate];
    } else {
        Sephora.logger.verbose('There was an attempt to render non SPA template for SPA application.');
    }

    return (
        <>
            <ConnectedLoadSpaPageProgressBar />
            <Page />
        </>
    );
};

export default wrapFunctionalComponent(Root, 'Root');
