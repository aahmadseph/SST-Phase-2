import FrameworkUtils from 'utils/framework';
import { Image, Flex, Box } from 'components/ui';
import {
    space, fontSizes, fontWeights, mediaQueries
} from 'style/config';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { wrapFunctionalComponent } = FrameworkUtils;

function MinimizedSuperChat(props) {
    const { showSuperChat, localization, session } = props;

    if (showSuperChat || !session) {
        return null;
    }

    const sendAnalytics = () => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`,
                navigationInfo: `bottom nav:${anaConsts.SUPER_CHAT.SUPERCHAT}${anaConsts.SUPER_CHAT.SUPERCHAT}${anaConsts.SUPER_CHAT.SUPERCHAT}superchat` // eVar64
            }
        });
    };

    const openSuperChat = () => {
        sendAnalytics();
        props.openSuperChat(session);
    };

    return (
        <Flex
            css={styles.floatingContainer}
            onClick={openSuperChat}
            className='multi-chat-active'
        >
            <Image
                disableLazyLoad={true}
                alt={localization.title}
                src={'/img/ufe/ai/ai_chat_white.svg'}
                width={24}
                height={24}
                css={styles.chatImg}
            />
            <Box css={styles.chatText}>{localization.title}</Box>
            <Flex
                width={24}
                alignItems='center'
                justifyContent='center'
                css={styles.chevronIcon}
            >
                <Image
                    disableLazyLoad={true}
                    alt='Up Chevron'
                    src={'/img/ufe/ai/minimized-super-chat/up-chevron.svg'}
                    width={12}
                    height={6}
                />
            </Flex>
        </Flex>
    );
}

const styles = {
    floatingContainer: {
        [mediaQueries.smMax]: {
            bottom: 75,
            width: 'auto'
        },
        position: 'fixed',
        bottom: space[3],
        right: space[3],
        width: 258,
        height: 48,
        backgroundColor: 'black',
        borderRadius: 100,
        zIndex: 1000,
        padding: space[3],
        gap: space[2],
        alignItems: 'center'
    },
    chatText: {
        [mediaQueries.smMax]: {
            display: 'none'
        },
        color: 'white',
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        flex: 1
    },
    chevronIcon: {
        [mediaQueries.smMax]: {
            display: 'none'
        }
    }
};

export default wrapFunctionalComponent(MinimizedSuperChat, 'MinimizedSuperChat');
