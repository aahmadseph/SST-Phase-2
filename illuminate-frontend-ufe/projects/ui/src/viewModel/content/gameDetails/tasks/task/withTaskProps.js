import { connect } from 'react-redux';
import GameActions from 'actions/GameActions';
const { handleTaskModalCtaClick } = GameActions;

export default connect(null, {
    handleTaskModalCtaClick
});
