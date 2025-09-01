import { useReducer } from 'react';
import { useUserData } from '.';
import { agentAwareReducer } from '../reducer/agentAware';
import actions from '../actions/actions';

export const INITIAL_NOTE_STATE = { description: '', type: 'profile', saveNoteError: '' };

const initialUser = useUserData();

export const INITIAL_STATE = { user: initialUser, note: INITIAL_NOTE_STATE, modalName: '' };

export const useAgentAwareStore = () => {
    const [state, dispatch] = useReducer(agentAwareReducer, INITIAL_STATE);

    const showModal = modalName => dispatch(actions.showModalByName(modalName));

    return { state, dispatch, showModal };
};
