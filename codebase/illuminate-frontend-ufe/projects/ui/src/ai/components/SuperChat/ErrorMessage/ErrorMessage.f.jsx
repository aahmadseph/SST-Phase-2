import {
    Flex, Icon, Link, Box
} from 'components/ui';
import {
    space, colors, fontSizes, fontWeights
} from 'style/config';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function ErrorMessage({ showErrorMessage, text, resendYourMessage, resendMessage }) {
    if (!showErrorMessage) {
        return null;
    }

    return (
        <Flex
            css={styles.errorContainer}
            gap={2}
        >
            <Icon
                name='alert'
                color={colors.red}
                size={fontSizes.md}
            />
            <Box>
                <span>{text}</span>
                <Link
                    css={styles.link}
                    onClick={resendMessage}
                    children={resendYourMessage}
                />
                <span>.</span>
            </Box>
        </Flex>
    );
}

const styles = {
    errorContainer: {
        backgroundColor: colors.lightRed,
        color: colors.red,
        width: '100%',
        padding: `${space[4]}px ${space[2]}px`,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal,
        borderRadius: '4px'
    },
    link: {
        color: `${colors.blue}`,
        textDecoration: 'underline',
        paddingLeft: space[1]
    }
};

export default wrapFunctionalComponent(ErrorMessage, 'ErrorMessage');
