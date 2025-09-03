import { UPDATE_GLADCHAT_STATE } from 'constants/actionTypes/gladChat';

export default {
    updateGladChatState: function ({ isChatOpen, entryFlag = false, clickPage = '' }) {
        return {
            type: UPDATE_GLADCHAT_STATE,
            payload: {
                isChatOpen,
                entryFlag,
                clickPage
            }
        };
    }
};
