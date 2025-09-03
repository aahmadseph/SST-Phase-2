import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';

const AddSignInEnhancer = ({ children, showSignInModal }) => {
    return (
        <Link
            underline={true}
            color='black'
            onClick={() => showSignInModal()}
            children={children}
        />
    );
};

AddSignInEnhancer.defaultProps = { children: null };

AddSignInEnhancer.propTypes = {
    children: PropTypes.element,
    showSignInModal: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(AddSignInEnhancer, 'AddSignInEnhancer');
