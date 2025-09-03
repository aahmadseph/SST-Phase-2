import Actions from 'Actions';

const openAgentAwareModal = (title, message) => {
    return Actions.showInfoModal({
        isOpen: true,
        title: title,
        message: message
    });
};

export default {
    openAgentAwareModal
};
