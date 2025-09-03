import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { filterBarHiddenSelector } from 'selectors/catalog/filterBarHidden/filterBarHiddenSelector';
import actions from 'actions/CatalogActions';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';

const fields = createStructuredSelector({
    filterBarHidden: filterBarHiddenSelector
});

const functions = {
    setFilterBarVisibility: actions.setFilterBarVisibility
};

const withBackToTopButtonProps = connect(fields, functions);

export default withBackToTopButtonProps(BackToTopButton);
