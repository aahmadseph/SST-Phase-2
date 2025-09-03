import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';

const JoinBiEnhancer = ({ children, showBiRegisterModal }) => {
    return (
        <Link
            underline={true}
            color='blue'
            onClick={() => showBiRegisterModal()}
            children={children}
        />
    );
};

JoinBiEnhancer.defaultProps = { children: null };

JoinBiEnhancer.propTypes = {
    children: PropTypes.element,
    showBiRegisterModal: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(JoinBiEnhancer, 'JoinBiEnhancer');
