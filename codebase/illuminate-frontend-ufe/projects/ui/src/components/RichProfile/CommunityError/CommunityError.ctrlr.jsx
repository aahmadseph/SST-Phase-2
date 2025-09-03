import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Box, Text, Button, Container
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class CommunityError extends BaseClass {
    constructor(props) {
        super(props);
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/CommunityError/locales', 'CommunityError');

        return (
            <Container paddingY={[4, 6]}>
                <Box
                    backgroundColor='white'
                    padding={[4, 7]}
                    textAlign='center'
                    boxShadow='light'
                >
                    <Text
                        is='h1'
                        lineHeight='tight'
                        fontSize={['lg', 'xl']}
                        marginBottom={5}
                        fontWeight='bold'
                    >
                        {getText('pageNotCurrentlyAvailable')}
                    </Text>
                    <Button
                        variant='primary'
                        width={['100%', 'auto']}
                        href='/'
                    >
                        {getText('continueShopping')}
                    </Button>
                </Box>
            </Container>
        );
    }
}

export default wrapComponent(CommunityError, 'CommunityError');
