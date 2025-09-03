import React from 'react';
import FrameworkUtils from 'utils/framework';
import {
    Text, Button, Image, Box, Container
} from 'components/ui';
import ActivityConstants from 'constants/happening/activityConstants';

const { OLR_URLS } = ActivityConstants;
const { wrapFunctionalComponent } = FrameworkUtils;

const GenericError = ({ localization }) => {
    const { header, p1, p2, cta } = localization;
    const { STORE_LOCATOR } = OLR_URLS;

    return (
        <Container>
            <Box width={642}>
                <Image
                    src={'/img/ufe/generic-error.svg'}
                    marginBottom={5}
                    marginTop={7}
                />
                <Text
                    is='h2'
                    children={header}
                    fontSize={'lg'}
                    fontWeight='bold'
                    lineHeight='tight'
                    marginBottom={2}
                />
                <Text
                    is='p'
                    children={p1}
                    marginBottom={2}
                />
                <Text
                    is='p'
                    children={p2}
                    marginBottom={5}
                />
                <Button
                    href={STORE_LOCATOR}
                    children={cta}
                    variant='primary'
                    width={'14.5em'}
                />
            </Box>
        </Container>
    );
};

export default wrapFunctionalComponent(GenericError, 'GenericError');
