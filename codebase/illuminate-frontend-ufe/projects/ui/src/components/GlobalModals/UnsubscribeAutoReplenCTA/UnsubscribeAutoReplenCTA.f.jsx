import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Flex } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/UnsubscribeAutoReplenModal/locales', 'UnsubscribeAutoReplenModal');

const UnsubscribeAutoReplenCTA = ({ onDismiss, onUnsubscribe }) => {
    return (
        <Flex marginBottom={2}>
            <Button
                onClick={onDismiss}
                marginRight={2}
                width='50%'
                variant='secondary'
            >
                {getText('nevermindCTA')}
            </Button>
            <Button
                onClick={onUnsubscribe}
                width='50%'
                variant='primary'
            >
                {getText('unsubscribeCTA')}
            </Button>
        </Flex>
    );
};

UnsubscribeAutoReplenCTA.defaultProps = {};

UnsubscribeAutoReplenCTA.propTypes = {
    onDismiss: PropTypes.func.isRequired,
    onUnsubscribe: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(UnsubscribeAutoReplenCTA, 'UnsubscribeAutoReplenCTA');
