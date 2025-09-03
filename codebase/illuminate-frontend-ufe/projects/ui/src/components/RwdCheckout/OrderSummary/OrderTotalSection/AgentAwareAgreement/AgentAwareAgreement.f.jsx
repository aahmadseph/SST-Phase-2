import React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Text, Link, Flex, Divider
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, space, fontWeights, fontSizes
} from 'style/config';
import Markdown from 'components/Markdown/Markdown';

const AgentAwareAgreement = ({
    sephoraSDU,
    acceptAgentAwareTerms,
    updateAgentAwareTerms,
    confirm,
    and,
    autoReplenish,
    toClient,
    openAgentAwareModal,
    sduModalTitle,
    sduModalBody,
    autoReplenishModalTitle,
    autoReplenishModalBody,
    isAutoReplenishBasket,
    isSDUProductInBasket,
    agentAwareShowClass
}) => {
    return (
        <Box
            css={styles.container}
            className={agentAwareShowClass}
        >
            <Divider marginY={4} />
            <Flex>
                <Checkbox
                    onClick={() => {
                        updateAgentAwareTerms({ acceptAgentAwareTerms: !acceptAgentAwareTerms });
                    }}
                    checked={acceptAgentAwareTerms}
                >
                    <Text is='p'>
                        {`${confirm} `}
                        {isSDUProductInBasket && (
                            <Link
                                css={styles.link}
                                onClick={() => openAgentAwareModal(sduModalTitle, <Markdown content={sduModalBody} />)}
                            >
                                {sephoraSDU}
                            </Link>
                        )}
                        {`${isSDUProductInBasket && isAutoReplenishBasket ? and : ' '}`}
                        {isAutoReplenishBasket && (
                            <Link
                                css={styles.link}
                                onClick={() => openAgentAwareModal(autoReplenishModalTitle, <Markdown content={autoReplenishModalBody} />)}
                            >
                                {autoReplenish}
                            </Link>
                        )}
                        {` ${toClient}`}
                    </Text>
                </Checkbox>
            </Flex>
        </Box>
    );
};

const styles = {
    container: {
        fontSize: fontSizes.sm,
        display: 'none'
    },
    bold: {
        fontWeight: fontWeights.bold
    },
    bottomText: {
        marginTop: space[3]
    },
    link: {
        textDecoration: 'underline',
        color: colors.blue
    }
};

AgentAwareAgreement.defaultProps = {};

AgentAwareAgreement.propTypes = {
    sephoraSDU: PropTypes.string.isRequired,
    updateAgentAwareTerms: PropTypes.func.isRequired,
    acceptAgentAwareTerms: PropTypes.bool.isRequired,
    confirm: PropTypes.string.isRequired,
    and: PropTypes.string.isRequired,
    autoReplenish: PropTypes.string.isRequired,
    toClient: PropTypes.string.isRequired,
    openAgentAwareSDUModal: PropTypes.func.isRequired,
    sduModalTitle: PropTypes.string,
    sduModalBody: PropTypes.string,
    autoReplenishModalTitle: PropTypes.string,
    autoReplenishModalBody: PropTypes.string,
    isAutoReplenishBasket: PropTypes.bool,
    isSDUProductInBasket: PropTypes.bool
};

export default wrapFunctionalComponent(AgentAwareAgreement, 'AgentAwareAgreement');
