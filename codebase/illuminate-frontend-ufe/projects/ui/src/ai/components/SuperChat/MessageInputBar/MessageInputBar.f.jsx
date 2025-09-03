import React from 'react';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { Icon } from 'components/ui';
import { space, colors, radii } from 'style/config';

function MessageInputBar(props) {
    const { placeholder, disabled = false } = props;

    const inputCustomStyle = {
        ...styles.input,
        ...(disabled
            ? {
                innerWrap: {
                    ...(styles.input.innerWrap || {}),
                    borderColor: colors.midGray,
                    backgroundColor: colors.white
                },
                root: {
                    ...(styles.input.root || {}),
                    pointerEvents: 'none'
                }
            }
            : {})
    };

    return (
        <TextInput
            type='search'
            autoOff={true}
            name='keyword'
            id='ai_chat_message_input'
            height={space[7] - space[2]}
            maxLength={70}
            placeholder={placeholder}
            isSmall={false}
            marginBottom={null}
            customStyle={inputCustomStyle}
            disabled={disabled}
            contentAfter={
                <button
                    css={{
                        ...styles.sendButton,
                        ...(disabled ? { cursor: 'default' } : {})
                    }}
                    type='button'
                    data-at={Sephora.debug.dataAt('ai_chat_message_send')}
                >
                    <Icon
                        name='upArrow'
                        size={[14, 16]}
                    />
                </button>
            }
        />
    );
}

const styles = {
    input: {
        root: {
            '&:focus-within button': {
                marginTop: space[1] - 2
            },
            '& input:disabled': {
                cursor: 'default'
            }
        }
    },
    sendButton: {
        width: space[6],
        height: space[6],
        backgroundColor: colors.inputGray,
        borderRadius: radii.full,
        textAlign: 'center',
        marginRight: space[1],
        marginTop: space[1] - 1
    }
};

export default MessageInputBar;
