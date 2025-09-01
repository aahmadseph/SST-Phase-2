import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button } from 'components/ui';

const JoinTheChallenge = ({ buttonText, onButtonClick, disabled }) => (
    <Button
        variant='primary'
        children={buttonText}
        width={['100%', '100%', '14.5em']}
        onClick={onButtonClick}
        disabled={disabled}
    />
);

JoinTheChallenge.propTypes = {
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(JoinTheChallenge, 'JoinTheChallenge');
