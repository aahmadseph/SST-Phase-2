import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Box } from 'components/ui';
import agentAwareUtils from 'utils/AgentAware';

const BopisSddSmsSignupButton = ({
    marginTop, marginBottom, isDisabled, buttonText, isCheckout, openSmsSignupModal, redirectToOrderDetails
}) => {
    const handleClick = isCheckout ? redirectToOrderDetails : openSmsSignupModal;

    return (
        <Box
            marginTop={marginTop}
            marginBottom={marginBottom}
        >
            <Button
                className={agentAwareUtils.applyHideAgentAwareClass()}
                variant={'secondary'}
                size='xs'
                onClick={handleClick}
                disabled={isDisabled}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

BopisSddSmsSignupButton.defaultProps = {
    marginTop: 2,
    marginBottom: 3,
    isCheckout: false,
    isEnrolled: false
};

BopisSddSmsSignupButton.propTypes = {
    isCheckout: PropTypes.bool,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    buttonText: PropTypes.string.isRequired,
    isEnrolled: PropTypes.bool,
    openSmsSignupModal: PropTypes.func.isRequired,
    redirectToOrderDetails: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(BopisSddSmsSignupButton, 'BopisSddSmsSignupButton');
