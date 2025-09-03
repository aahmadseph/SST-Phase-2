import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import framework from 'utils/framework';
import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
const { wrapHOC } = framework;

const fields = createStructuredSelector({ globalModals: globalModalsSelector });

const functions = null;

const withGlobalModals = wrapHOC(connect(fields, functions));

export default withGlobalModals;
