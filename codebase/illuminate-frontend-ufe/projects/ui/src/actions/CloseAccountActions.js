import Actions from 'actions/Actions';

const closeDeactivatedAccountModal = () => dispatch => {
    dispatch(Actions.showAccountDeactivatedModal({ isOpen: false }));
};

export default { closeDeactivatedAccountModal };
