import { connect } from 'react-redux';
import Actions from 'Actions';
import { createSelector } from 'reselect';
import modalsSelector from 'selectors/modals/modalsSelector';

const fields = createSelector(modalsSelector, modals => ({ isPrescreenModal: modals.data?.isPrescreenModal }));

export default connect(fields, { showContentModal: Actions.showContentModal });
