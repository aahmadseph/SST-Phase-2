import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import framework from 'utils/framework';
import { showLoadSpaPageProgressSelector } from 'selectors/page/showLoadSpaPageProgress/showLoadSpaPageProgressSelector';

const { wrapHOC } = framework;
const fields = createStructuredSelector({ showProgress: showLoadSpaPageProgressSelector });

const functions = null;

const withLoadSpaPageProgress = wrapHOC(connect(fields, functions));

export {
    withLoadSpaPageProgress, fields, functions
};
