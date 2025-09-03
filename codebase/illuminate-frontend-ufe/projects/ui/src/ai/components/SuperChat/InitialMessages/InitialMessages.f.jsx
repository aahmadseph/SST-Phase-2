import React from 'react';
import FrameworkUtils from 'utils/framework';
import { Flex, Box } from 'components/ui';
import { space, fontSizes, lineHeights } from 'style/config';
import Markdown from 'components/Markdown/Markdown';
import convertMarkdownLinksToJiraFormat from 'ai/utils/convertMarkdownLinksToJiraFormat';

const { wrapFunctionalComponent } = FrameworkUtils;

function InitialMessages(props) {
    const { config } = props;
    const cleanDisclaimer = convertMarkdownLinksToJiraFormat(config?.meta?.consent_disclaimer);

    return (
        <Flex
            gap={5}
            flexDirection='column'
            width='100%'
        >
            {config?.meta?.consent_disclaimer && (
                <Box css={[styles.disclaimer]}>
                    <Markdown content={cleanDisclaimer} />
                </Box>
            )}

            {config?.meta?.welcome_message && (
                <Flex css={styles.messageContainer}>
                    <Box css={[styles.message, styles.received]}>
                        <Markdown content={config?.meta?.welcome_message} />
                    </Box>
                </Flex>
            )}
        </Flex>
    );
}

const styles = {
    messageContainer: {
        paddingRight: '20%'
    },
    disclaimer: {
        fontSize: fontSizes.sm,
        lineHeights: lineHeights.tight,
        color: '#666666'
    },
    message: {
        padding: space[3],
        borderRadius: 12,
        fontSize: fontSizes.base,
        lineHeights: lineHeights.tight
    },
    received: {
        backgroundColor: '#F6F6F8',
        color: 'black',
        borderBottomLeftRadius: 0
    }
};

export default wrapFunctionalComponent(InitialMessages, 'InitialMessages');
