import { Box, Text } from 'components/ui';
import { colors } from 'style/config';
import { wrapFunctionalComponent } from 'utils/framework';

function ErrorMessage({ addMarginTop, addMarginBottom, message, hasPadding }) {
    return (
        <Box
            marginBottom={addMarginBottom && 4}
            paddingX={hasPadding && [4, 5]}
            marginTop={addMarginTop && 4}
            lineHeight={'tight'}
        >
            <Text
                children={message}
                color={colors.red}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(ErrorMessage, 'ErrorMessage');
