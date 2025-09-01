import { connect } from 'react-redux';
import Actions from 'actions/Actions';

const { showMediaModal } = Actions;

const withInfoSectionProps = connect(null, { showMediaModal });

export default withInfoSectionProps;
