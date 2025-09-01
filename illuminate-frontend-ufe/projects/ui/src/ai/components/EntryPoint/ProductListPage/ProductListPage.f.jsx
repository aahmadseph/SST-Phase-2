import React, { useEffect, useState } from 'react';
import {
    Image, Text, Flex, Box
} from 'components/ui';
import Flag from 'components/Flag/Flag';
import Chiclet from 'components/Chiclet';
import FrameworkUtils from 'utils/framework';
import {
    space, radii, mediaQueries, breakpoints
} from 'style/config';
import { DebouncedResize } from 'constants/events';
import MessageInputBar from 'ai/components/SuperChat/MessageInputBar/MessageInputBar';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { wrapFunctionalComponent } = FrameworkUtils;

function ProductListPage(props) {
    const {
        localization, fetchEntryPointPromptsPlp, nthCategory, handlePromptClick, products, chatName, searchKeyword, clientId, anonymousId
    } =
        props;

    const { aiChatInputPlaceholderPlp, aiChatInputPlaceholderPlpLgUi } = localization;
    const [prompts, setPrompts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchPrompts = async () => {
            const res = await fetchEntryPointPromptsPlp(nthCategory, searchKeyword, clientId, anonymousId);
            setPrompts(res?.entrypoint_prompts || []);
        };

        fetchPrompts();
        checkIsMobile();
        window.addEventListener(DebouncedResize, checkIsMobile);

        return () => {
            window.removeEventListener(DebouncedResize, checkIsMobile);
        };
    }, [nthCategory?.categories?.[0]?.categoryId, searchKeyword]);

    const checkIsMobile = () => {
        setIsMobile(window.matchMedia(breakpoints.smMax).matches);
    };

    const sendAnalytics = (promptText = null) => {
        const data = {
            pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`
        };

        if (promptText) {
            data.actionInfo = `${anaConsts.SUPER_CHAT.SUPERCHAT_PROMPT}${promptText}`; // prop55
        } else {
            data.searchTerm = digitalData.page.attributes.search.searchTerm; // prop4
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data });
    };

    const openAIChat = (prompt = null) => {
        if (prompt) {
            const promptText = prompt.toLowerCase();
            sendAnalytics(promptText);
        } else {
            sendAnalytics(null);
        }

        handlePromptClick(prompts, nthCategory, products, prompt);
    };

    return (
        <Box
            backgroundColor='lightBlue'
            padding={space[4]}
            css={styles.box}
            borderRadius={radii[1]}
        >
            <Flex
                flexDirection='column'
                gap={`${space[4]}px`}
                css={styles.productAdvisorTitleRow}
            >
                <Image
                    disableLazyLoad={true}
                    alt='AI Chat'
                    src={'/img/ufe/ai/ai_chat.svg'}
                    width={60}
                    height={60}
                    css={styles.chatImg}
                />
                <Text
                    is='h2'
                    fontSize={['md', 'lg']}
                    lineHeight='tight'
                    fontWeight='bold'
                >
                    {chatName}
                    <Flag
                        backgroundColor={'black'}
                        children={localization.new}
                        marginLeft={space[3] - 2}
                        css={styles.flag}
                    />
                </Text>
            </Flex>
            <ul css={styles.suggestionList}>
                {Array.isArray(prompts) &&
                    prompts.length > 0 &&
                    prompts?.map(prompt => (
                        <li
                            key={`suggestion_${prompt}`}
                            css={styles.suggestionListItem}
                            onClick={() => openAIChat(prompt?.content)}
                        >
                            <Chiclet
                                variant='shadow'
                                children={prompt?.content}
                                width='100%'
                                css={styles.chiclet}
                            />
                        </li>
                    ))}
            </ul>
            <Box
                marginTop={space[3]}
                css={styles.messageInputBar}
                onClick={() => openAIChat()}
            >
                <MessageInputBar
                    placeholder={isMobile ? aiChatInputPlaceholderPlp : aiChatInputPlaceholderPlpLgUi}
                    disabled={true}
                />
            </Box>
        </Box>
    );
}

const styles = {
    box: {
        width: 275,
        height: 465,
        paddingTop: 68.5,
        paddingBottom: 68.5,
        paddingLeft: space[4],
        paddingRight: space[4],
        [mediaQueries.xsMax]: {
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            marginRight: -space[4],
            marginLeft: -space[2] - 1,
            padding: space[4],
            height: 'unset'
        }
    },
    chatImg: {
        [mediaQueries.xsMax]: {
            width: 24,
            height: 24
        }
    },
    productAdvisorTitleRow: {
        flex: '0 0 auto',
        [mediaQueries.xsMax]: {
            order: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: space[1],
            alignItems: 'center'
        }
    },
    flag: {
        [mediaQueries.xsMax]: {
            marginBottom: space[1]
        }
    },
    suggestionList: {
        display: 'flex',
        gap: space[3],
        cursor: 'pointer',
        marginTop: space[5],
        flexDirection: 'column',
        overflowX: 'visible',
        overflowY: 'visible',
        paddingLeft: space[4],
        marginLeft: -space[4],
        [mediaQueries.xsMax]: {
            order: 3,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            overflowY: 'visible',
            scrollbarWidth: 'none',
            marginRight: -space[4],
            display: 'line-item',
            '&::-webkit-scrollbar': { display: 'none' },
            paddingTop: space[4] + space[1],
            paddingBottom: space[2],
            marginTop: -space[2],
            marginBottom: -space[2]
        }
    },
    suggestionListItem: {
        [mediaQueries.xsMax]: {
            display: 'inline-block',
            marginRight: space[1]
        }
    },
    messageInputBar: {
        width: '100%',
        [mediaQueries.xsMax]: {
            order: 2
        }
    },
    chiclet: {
        paddingTop: space[2],
        paddingBottom: space[2]
    }
};

export default wrapFunctionalComponent(ProductListPage, 'ProductListPage');
