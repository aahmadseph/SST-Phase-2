import FrameworkUtils from 'utils/framework';
import { Box, Flex } from 'components/ui';
import { space, fontSizes, lineHeights } from 'style/config';
import Markdown from 'components/Markdown/Markdown';

const { wrapFunctionalComponent } = FrameworkUtils;

const MESSAGE_TYPES = {
    USER_QUERY: 'sent',
    USER_QUERY_RESPONSE: 'received'
};

function Message(props) {
    const { message } = props;
    const type = MESSAGE_TYPES[message.message_type || message.response_type];

    const content = message.data?.query || message.data?.summary || message.data?.content || message.content;

    if (!type || !content) {
        return null;
    }

    return (
        <Flex css={styles.messageContainer(type)}>
            <Box css={[styles.message, styles[type]]}>
                <Markdown content={content} />
            </Box>
        </Flex>
    );
}

const styles = {
    messageContainer: type => {
        if (type === 'sent') {
            return {
                justifyContent: 'flex-end',
                paddingLeft: '20%'
            };
        }

        return {
            paddingRight: '20%'
        };
    },
    message: {
        padding: space[3],
        borderRadius: 12,
        fontSize: fontSizes.base,
        lineHeights: lineHeights.tight,
        wordWrap: 'break-word'
    },
    sent: {
        backgroundColor: 'black',
        color: 'white',
        borderBottomRightRadius: 0
    },
    received: {
        backgroundColor: '#F6F6F8',
        color: 'black',
        borderBottomLeftRadius: 0
    }
};

export default wrapFunctionalComponent(Message, 'Message');
