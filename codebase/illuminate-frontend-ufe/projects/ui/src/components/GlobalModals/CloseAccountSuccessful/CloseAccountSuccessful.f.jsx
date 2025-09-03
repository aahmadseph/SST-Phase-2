/* eslint-disable class-methods-use-this */
import React from 'react';
import { Text, Link } from 'components/ui';
import PropTypes from 'prop-types';

import { wrapFunctionalComponent } from 'utils/framework';

const CloseAccountSuccessful = ({ localization }) => {
    return (
        <>
            <Text
                is='p'
                fontWeight='bold'
                marginBottom={3}
            >
                {localization.accountClosed}
            </Text>
            <Text
                is='p'
                marginBottom={3}
            >
                {localization.loggedOut}
            </Text>
            <Text is='p'>
                {localization.message}{' '}
                <Link
                    href='tel:18338992963'
                    children='1-833-899-2963'
                    color='blue'
                />{' '}
                {localization.or}{' '}
                <Link
                    href='/beauty/customer-service#customer-service_chatwithus'
                    display={'inline'}
                    underline={true}
                    color={'blue'}
                    children={localization.chatWithUs}
                />
                .
            </Text>
        </>
    );
};

CloseAccountSuccessful.propTypes = {
    localization: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(CloseAccountSuccessful, 'CloseAccountSuccessful');
