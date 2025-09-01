import actions from 'Actions';
import Empty from 'constants/empty';

function updateRvData(rvData) {
    return dispatch => dispatch(actions.addRecentlyViewedData(rvData || Empty.Array));
}

export default { updateRvData };
