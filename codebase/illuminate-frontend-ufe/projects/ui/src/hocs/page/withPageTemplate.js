import { connect } from 'react-redux';
import framework from 'utils/framework';
import { createStructuredSelector } from 'reselect';
import templateSelector from 'selectors/page/templateInformation/templateSelector';
const { wrapHOC } = framework;

const fields = createStructuredSelector({ pageTemplate: templateSelector });

const functions = null;

const withPageTemplate = wrapHOC(connect(fields, functions));

export default withPageTemplate;
