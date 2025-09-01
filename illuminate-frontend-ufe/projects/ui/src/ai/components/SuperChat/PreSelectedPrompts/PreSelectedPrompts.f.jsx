import FrameworkUtils from 'utils/framework';
import Chiclet from 'components/Chiclet';
import { Flex, Image } from 'components/ui';
import { space } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

const PromptContent = ({ prompt }) => {
    return (
        <Flex
            alignItems='center'
            gap={2}
            width={'100%'}
        >
            <Image
                disableLazyLoad={true}
                alt='AI Chat'
                src={'/img/ufe/ai/super-chat/super-chat-stars.svg'}
                width={24}
                height={24}
                css={styles.chatImg}
            />
            <div>{prompt}</div>
        </Flex>
    );
};

function PreSelectedPrompts(props) {
    const { prompts, sendMessage } = props;

    const handlePromptClick = promptContent => {
        if (sendMessage) {
            sendMessage(promptContent);
        }
    };

    return (
        <Flex css={styles.promptsList}>
            {prompts.map(prompt => {
                return (
                    <Chiclet
                        key={prompt.content}
                        variant='shadow'
                        children={<PromptContent prompt={prompt.content} />}
                        css={styles.promptContainer}
                        onClick={() => handlePromptClick(prompt.content)}
                    />
                );
            })}
        </Flex>
    );
}

const styles = {
    promptsList: {
        display: 'flex',
        gap: space[3],
        flexDirection: 'column',
        width: '100%'
    },
    promptContainer: {
        height: 40
    }
};

export default wrapFunctionalComponent(PreSelectedPrompts, 'PreSelectedPrompts');
