import { useEffect } from 'react';
import { MODAL_NAMES } from 'constants/Modals';
import { useAgentAwareContext } from 'hooks';

//This is a functional component that handles the errors that backend UFE apis return
//To use please add the condition to handle inside the handleBackendErrors and its respective logic.
export const UfeBackendErrorsHandler = () => {
    const { showModal } = useAgentAwareContext();

    useEffect(() => {
        const handleBackendErrors = event => {
            if (event.detail.errorMessages[0] === 'A technical error has occurred. Please sign in again.') {
                window.dispatchEvent(new Event('CloseSignInModal'));
                showModal(MODAL_NAMES.SESSION_ERROR);
            }
        };
        window.addEventListener('AgentAwareErrors', handleBackendErrors);

        return () => window.removeEventListener('AgentAwareErrors', handleBackendErrors);
    }, []);

    return null;
};
