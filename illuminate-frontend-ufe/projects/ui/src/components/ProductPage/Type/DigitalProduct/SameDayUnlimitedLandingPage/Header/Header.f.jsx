import React from 'react';
import {
    Flex, Box, Text, Image
} from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import {
    fontSizes, fontWeights, lineHeights, space
} from 'style/config';

const Header = ({ title, subTitle }) => {
    return (
        <Flex>
            <Box>
                <Image src='/img/ufe/icons/convenience-hub.svg' />
            </Box>
            <Box css={styles.title}>
                <Text
                    is='p'
                    css={styles.smallText}
                >
                    {title}
                </Text>
                <Text
                    is='h2'
                    css={styles.largeText}
                >
                    {subTitle}
                </Text>
            </Box>
        </Flex>
    );
};

const styles = {
    title: {
        marginLeft: space[2]
    },
    smallText: {
        fontSize: fontSizes.sm,
        marginTop: space[1]
    },
    largeText: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.none
    }
};

Header.defaultProps = {};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(Header, 'Header');
