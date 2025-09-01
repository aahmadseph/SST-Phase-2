/* eslint-disable complexity */
import React from 'react';
import store from 'store/Store';
import chatActions from 'actions/ChatActions';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import ChatIcon from 'components/GladChat/ChatButton/ChatIcon';
import { Flex } from 'components/ui';
import {
    colors, borders, fontWeights, radii, space
} from 'style/config';

const getText = localeUtils.getLocaleResourceFile('components/GladChat/ChatButton/locales', 'ChatButton');

const { wrapComponent } = FrameworkUtils;

class ChatButton extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClick = () => {
        if (window.Gladly) {
            const { clickPage } = this.props;
            store.dispatch(chatActions.updateGladChatState({ isChatOpen: true, entryFlag: true, clickPage }));
        }
    };

    render() {
        const { variant } = this.props;
        const isfooter = !(variant === 'help');
        const btnLabel = isfooter ? getText('footerLabel') : getText('pageLabel');

        return (
            <>
                <Flex
                    onClick={this.handleClick}
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    lineHeight='tight'
                >
                    <Flex css={[!isfooter && styles.chatWithUs, isfooter && styles.chatFooterLink]}>
                        <ChatIcon marginRight={2} />
                        <span>
                            <span
                                css={[styles.chatButtonLink]}
                                children={btnLabel}
                            />
                        </span>
                    </Flex>
                </Flex>
            </>
        );
    }
}

const styles = {
    chatFooterLink: {
        alignItems: 'center',
        color: colors.white
    },
    chatWithUs: {
        display: 'flex',
        alignItems: 'center',
        padding: space[3],
        borderRadius: radii.full,
        border: `${borders[2]} ${colors.black}`
    },
    chatButtonLink: {
        fontWeight: fontWeights.bold,
        display: 'flex'
    }
};

ChatButton.propTypes = {};

export default wrapComponent(ChatButton, 'ChatButton', true);
