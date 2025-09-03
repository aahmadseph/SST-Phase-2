import { useAgentAwareContext } from 'hooks';
import { modalComponents } from 'constants/Modals';

//This is a component provider that render modals by the name.
//To use please add inside modalComponents constant the name and the respective modal to render with this name
//Then to show the modal from the AgentAwareApp use the function showModal inside AgentAwareContext
//ej. const { showModal } = useAgentAwareContext()
// showModal(MODAL_NAMES.LOGOUT)
//The provider will select the corresponding component to the modal name and render inside UFE page.
export const ModalsProvider = () => {
    const { state } = useAgentAwareContext();
    const ModalByName = modalComponents[state.modalName];

    if (ModalByName) {
        return <ModalByName />;
    }

    return <></>;
};
