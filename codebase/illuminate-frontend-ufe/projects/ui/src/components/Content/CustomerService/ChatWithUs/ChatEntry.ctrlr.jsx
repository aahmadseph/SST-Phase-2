/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ChatButton from 'components/GladChat/ChatButton/ChatButton';
import GladChat from 'components/GladChat';
import { CHAT_ENTRY } from 'constants/chat';

class ChatEntry extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const { type } = this.props;
        const isChatEnabled = !!Sephora.configurationSettings.isChatEnabled;

        if (!isChatEnabled) {
            return null;
        }

        switch (type) {
            case CHAT_ENTRY.global:
                return GladChat ? <GladChat /> : null;

            case CHAT_ENTRY.customerService:
                return (
                    <ChatButton
                        variant='help'
                        clickPage={type}
                    />
                );

            case CHAT_ENTRY.footer:
                return <ChatButton clickPage={type} />;

            case CHAT_ENTRY.bccPlaceHolderApp:
            case CHAT_ENTRY.fraudErrCheckout:
                return <ChatButton variant='help' />;

            default:
                return null;
        }
    }
}

ChatEntry.propTypes = {
    type: PropTypes.oneOf(['global', 'customerService', 'footer', 'fraudErrCheckout', 'customerServiceChatApp']).isRequired
};

export default wrapComponent(ChatEntry, 'ChatEntry', true);
