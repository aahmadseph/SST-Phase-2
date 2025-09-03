import { useUserData } from 'hooks';
import Button from 'components/Button';
import { MODAL_NAMES } from 'constants/Modals';

export const AddOrderNotesButton = ({ showModal, dispatch, updateUser, changeNoteType }) => {
    const userData = useUserData();
    dispatch(updateUser(userData));

    return (
        <Button
            type='secondary'
            onClick={() => {
                dispatch(changeNoteType('order'));
                showModal(MODAL_NAMES.ADD_NOTE);
            }}
        >
            Add Order Notes
        </Button>
    );
};
