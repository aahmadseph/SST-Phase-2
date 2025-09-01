import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';

const PleaseSignIn = ({ please, signIn, toReviewSection, showSignInModal }) => (
    <Text
        is='h2'
        data-at={Sephora.debug.dataAt('myaccount_sign_in_message')}
        fontSize='md'
        marginY={5}
    >
        {`${please} `}
        <Link
            color='blue'
            underline={true}
            padding={1}
            margin={-1}
            onClick={showSignInModal}
        >
            {`${signIn} `}
        </Link>
        {toReviewSection}
    </Text>
);

PleaseSignIn.propTypes = {
    afterAuth: PropTypes.func,
    please: PropTypes.string.isRequired,
    signIn: PropTypes.string.isRequired,
    toReviewSection: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(PleaseSignIn, 'PleaseSignIn');
