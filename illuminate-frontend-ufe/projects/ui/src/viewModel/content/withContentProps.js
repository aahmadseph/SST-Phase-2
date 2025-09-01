import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HomepageActions from 'actions/HomepageActions';
import ContentSelector from 'selectors/page/content/contentSelector';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import framework from 'utils/framework';

const { contentSelector } = ContentSelector;
const { wrapHOC } = framework;

const fields = createStructuredSelector({
    content: contentSelector,
    p13n: p13nSelector
});

const functions = {
    setP13NInitialization: HomepageActions.setP13NInitialization,
    setP13NAnalyticsData: HomepageActions.setPersonalizationAnalyticsData
};

const withContentProps = wrapHOC(connect(fields, functions));

export { withContentProps };
