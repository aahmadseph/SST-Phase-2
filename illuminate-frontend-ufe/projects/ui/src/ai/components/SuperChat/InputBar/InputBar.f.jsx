import {
    Flex, Box, Icon, Button
} from 'components/ui';
import { useState } from 'react';
import { colors, space, radii } from 'style/config';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function InputBar(props) {
    const { sendMessage, placeholder } = props;
    const [message, setMessage] = useState('');
    const [rows, setRows] = useState(1);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
            setRows(1);
        }
    };

    const calculateRows = value => {
        if (!value) {
            return 1;
        }

        // Count line breaks
        const lineBreaks = (value.match(/\n/g) || []).length;

        // For very long lines without breaks, estimate based on character count
        // Assuming approximately 50-60 characters per line based on typical textarea width
        const lines = value.split('\n');
        let estimatedLines = 0;

        lines.forEach(line => {
            if (line.length === 0) {
                estimatedLines += 1;
            } else {
                // Estimate lines based on character count (roughly 60 chars per line)
                estimatedLines += Math.ceil(line.length / 60);
            }
        });

        // Take the maximum of line breaks + 1 or estimated lines, but cap at 5
        const calculatedRows = Math.max(lineBreaks + 1, estimatedLines);

        return Math.min(Math.max(calculatedRows, 1), 5);
    };

    const handleInputChange = e => {
        const value = e.target.value;
        setMessage(value);
        setRows(calculateRows(value));
    };

    const onClick = () => {
        handleSendMessage();
    };

    const onKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Flex
            padding={4}
            width={'100%'}
            borderTop={`1px solid ${colors.lightGray}`}
        >
            <Box
                width={'100%'}
                position='relative'
            >
                <textarea
                    style={styles.input}
                    placeholder={placeholder}
                    value={message}
                    onInput={handleInputChange}
                    onKeyDown={onKeyDown}
                    rows={rows}
                />
                <Button
                    css={{
                        ...styles.button,
                        backgroundColor: message ? colors.black : colors.inputGray
                    }}
                    onClick={onClick}
                >
                    <Icon
                        name='upArrow'
                        size={[14, 16]}
                    />
                </Button>
            </Box>
        </Flex>
    );
}

const styles = {
    input: {
        backgroundColor: colors.nearWhite,
        width: '100%',
        minHeight: 40,
        maxHeight: 120,
        borderRadius: 20,
        paddingLeft: space[3],
        paddingRight: space[8],
        paddingTop: 10,
        paddingBottom: 10
    },
    button: {
        width: space[6],
        height: space[6],
        backgroundColor: colors.inputGray,
        borderRadius: radii.full,
        textAlign: 'center',
        position: 'absolute',
        bottom: 10,
        right: space[1],
        padding: 0,
        minWidth: 32,
        minHeight: 32,
        border: 'none',
        transition: 'background 0.2s'
    }
};

export default wrapFunctionalComponent(InputBar, 'InputBar');
