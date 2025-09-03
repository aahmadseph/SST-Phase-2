import React from 'react';
import {
    Flex, Box, Text, Image, Button
} from 'components/ui';
import { colors } from 'style/config';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/locales', 'SuperChat');

const { wrapFunctionalComponent } = FrameworkUtils;

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

function SuperChatHeader({ title, handleToggleFlyer, showFlyer, handleClose }) {
    // Determine which icon to show
    const iconSrc = showFlyer ? '/img/ufe/ai/super-chat/left-chevron.svg' : '/img/ufe/ai/super-chat/ellipsis.svg';

    const sendAnalytics = () => {
        const pageName = showFlyer ? anaConsts.SUPER_CHAT.SUPERCHAT_LANDING : anaConsts.SUPER_CHAT.SUPERCHAT_MENU;

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageName}`
            }
        });
    };

    // Handle icon click - toggles the flyer visibility
    const handleIconClick = () => {
        if (handleToggleFlyer) {
            sendAnalytics();
            handleToggleFlyer();
        }
    };

    // Determine which title to show
    const headerTitle = !showFlyer ? title : '';

    return (
        <Flex
            alignSelf='stretch'
            height='50px'
            backgroundColor='white'
            borderTopLeftRadius={6}
            borderTopRightRadius={6}
            justifyContent='space-between'
            alignItems='center'
            paddingX={4}
            borderBottom={`1px solid ${colors.lightGray}`}
            position='relative'
        >
            <Button
                css={styles.headerButton}
                onClick={handleIconClick}
            >
                <Image
                    disableLazyLoad={true}
                    alt={getText('title')}
                    src={iconSrc}
                />
            </Button>
            <Flex>
                <Text
                    fontWeight='bold'
                    fontSize={'md'}
                    lineHeight='tight'
                    color='black'
                >
                    {headerTitle}
                </Text>
            </Flex>

            <Button
                css={styles.headerButton}
                onClick={handleClose}
            >
                <Image
                    disableLazyLoad={true}
                    alt={getText('title')}
                    src={'/img/ufe/ai/super-chat/bottom-chevron.svg'}
                />
            </Button>

            <Box
                position='absolute'
                width='100%'
                height='1px'
                left='0'
                bottom='0'
                backgroundColor={colors.lightGray}
            />
        </Flex>
    );
}

const styles = {
    headerButton: {
        minWidth: 24,
        minHeight: 24,
        height: 24,
        width: 24,
        padding: 0,
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default wrapFunctionalComponent(SuperChatHeader, 'SuperChatHeader');
