import React from 'react';
import {
    Divider, Button, Box, Flex
} from 'components/ui';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

function SubmitPayment({ submit, total = '' }) {
    const getText = localeUtils.getLocaleResourceFile('components/Invoice/SubmitPayment/locales', 'SubmitPayment');

    return (
        <Box
            marginTop={6}
            padding={4}
            borderWidth={1}
            borderRadius={2}
            borderColor='midGray'
        >
            <Flex
                is='h2'
                justifyContent='space-between'
                fontWeight='bold'
            >
                <span>{getText('invoiceTotal')}</span>
                <span>{`${total}`}</span>
            </Flex>
            <Divider
                marginY={4}
                color='lightGray'
                height={1}
            />
            <Button
                onClick={submit}
                type='submit'
                variant='special'
                block={true}
            >
                {getText('submitPayment')}
            </Button>
        </Box>
    );
}

SubmitPayment.propTypes = {
    total: PropTypes.string,
    submit: PropTypes.func
};

export default wrapFunctionalComponent(SubmitPayment, 'SubmitPayment');
