import React from 'react';
import {
    Flex, Text
} from 'components/ui';
import FrameworkUtils from 'utils/framework';
import { colors, borders } from 'style/config';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/locales', 'SuperChat');


const { wrapFunctionalComponent } = FrameworkUtils;

function SuperChatFlyout({
    isOpen, onShowFeedback
}) {
    if (!isOpen) {
        return null;
    }

    const handleShareFeedbackClick = () => {
        if (onShowFeedback) {
            onShowFeedback();
        }
    };

    return (
        <Flex
            position='absolute'
            top='50px'
            left='0'
            right='0'
            bottom='0'
            backgroundColor='white'
            flexDirection='column'
            css={styles.fullPageOverlay}
        >
            <Flex
                alignSelf='stretch'
                padding={4}
                css={styles.menuItem}
                onClick={handleShareFeedbackClick}
            >
                <Text
                    fontSize='sm'
                    fontWeight='bold'
                >
                    {getText('shareFeedback')}
                </Text>
            </Flex>
        </Flex>
    );
}

const styles = {
    fullPageOverlay: {
        '@keyframes slideIn': {
            '0%': {
                transform: 'translateX(100%)'
            },
            '100%': {
                transform: 'translateX(0)'
            }
        },
        animationName: 'slideIn',
        animationDuration: '300ms',
        animationTimingFunction: 'ease-out'
    },
    menuItem: {
        cursor: 'pointer',
        borderBottom: `${borders[1]} ${colors.lightGray}`
    }
};

export default wrapFunctionalComponent(SuperChatFlyout, 'SuperChatFlyout');
