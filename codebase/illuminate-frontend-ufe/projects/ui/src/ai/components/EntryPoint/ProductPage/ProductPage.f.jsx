import React, { useState, useEffect } from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import {
    Image, Text, Flex, Box
} from 'components/ui';
import Flag from 'components/Flag/Flag';
import Chiclet from 'components/Chiclet';
import { space, radii, mediaQueries } from 'style/config';
import MessageInputBar from 'ai/components/SuperChat/MessageInputBar/MessageInputBar';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

function ProductPage(props) {
    const {
        localization, fetchEntryPointPromptsPdp, product, handlePromptClick, chatName, clientId, anonymousId
    } = props;
    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            const res = await fetchEntryPointPromptsPdp(product, clientId, anonymousId);
            setPrompts(res?.entrypoint_prompts || []);
        };

        fetchPrompts();
    }, []);

    const sendAnalytics = () => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`
            }
        });
    };

    const openAIChat = (prompt = null) => {
        sendAnalytics();
        handlePromptClick(prompts, product, prompt);
    };

    return (
        <Box
            backgroundColor='lightBlue'
            padding={space[4]}
            marginBottom={space[5]}
            css={styles.box}
            borderRadius={radii[1]}
        >
            <Flex
                alignItems='center'
                gap={`${space[2]}px`}
                css={styles.productAdvisorTitleRow}
            >
                <Image
                    disableLazyLoad={true}
                    alt='AI Chat'
                    src={'/img/ufe/ai/ai_chat.svg'}
                    width={space[5]}
                    height={space[5]}
                />
                <Text
                    is='h2'
                    fontSize={['md', 'lg']}
                    lineHeight='tight'
                    fontWeight='bold'
                >
                    {chatName}
                </Text>
                <Flag
                    backgroundColor={'black'}
                    children={localization.new}
                />
            </Flex>
            <Box
                marginTop={space[4]}
                width='624px'
                css={styles.messageInputBar}
                onClick={openAIChat}
            >
                <MessageInputBar
                    placeholder={localization.aiChatInputPlaceholderPdp}
                    disabled={true}
                />
            </Box>
            <ul css={styles.suggestionList}>
                {Array.isArray(prompts) &&
                    prompts.length > 0 &&
                    prompts?.map(suggestion => {
                        return (
                            <li
                                key={`suggestion_${suggestion}`}
                                css={styles.suggestionListItem}
                                onClick={() => openAIChat(suggestion?.content)}
                            >
                                <Chiclet
                                    variant='shadow'
                                    children={suggestion?.content}
                                />
                            </li>
                        );
                    })}
            </ul>
        </Box>
    );
}

const suggestionListStyle = {
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    marginRight: -space[4]
};

const styles = {
    box: {
        [mediaQueries.xsMax]: {
            borderRadius: radii[0],
            marginLeft: -space[4],
            marginRight: -space[4]
        }
    },
    productAdvisorTitleRow: { flex: '0 0 auto' },
    suggestionList: {
        display: 'flex',
        gap: space[3],
        cursor: 'pointer',
        marginTop: space[3],
        paddingLeft: space[4],
        marginLeft: -space[4],
        overflowX: 'visible',
        overflowY: 'visible',
        [mediaQueries.xsMax]: {
            ...suggestionListStyle,
            overflowX: 'auto',
            overflowY: 'visible',
            display: 'line-item',
            '&::-webkit-scrollbar': { display: 'none' },
            paddingTop: space[4] + space[1],
            paddingBottom: space[2],
            marginTop: -space[2],
            marginBottom: -space[2]
        },
        [mediaQueries.sm]: {
            ...suggestionListStyle,
            display: '-webkit-box'
        }
    },
    suggestionListItem: {
        display: 'inline-block',
        marginRight: space[3],
        [mediaQueries.xsMax]: {
            display: 'inline-block',
            marginRight: space[1]
        }
    },
    messageInputBar: {
        [mediaQueries.xsMax]: {
            width: '100%',
            marginTop: space[3]
        }
    }
};

export default wrapFunctionalComponent(ProductPage, 'ProductPage');
