import { connect } from 'react-redux';
import Actions from 'actions/Actions';

const { showMediaModal } = Actions;
const withAccessPointProps = connect(null, { showMediaModal });

export default withAccessPointProps;
