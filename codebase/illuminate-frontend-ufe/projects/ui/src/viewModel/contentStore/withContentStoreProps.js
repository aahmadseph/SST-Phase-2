import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import ContentStoreDataSelector from 'selectors/page/contentStoreData/contentStoreDataSelector';

const { wrapHOC } = FrameworkUtils;
const { contentStoreDataSelector } = ContentStoreDataSelector;

const fields = createStructuredSelector({ contentStoreData: contentStoreDataSelector });

const functions = null;

const withContentStoreProps = wrapHOC(connect(fields, functions));

export {
    withContentStoreProps, fields, functions
};
