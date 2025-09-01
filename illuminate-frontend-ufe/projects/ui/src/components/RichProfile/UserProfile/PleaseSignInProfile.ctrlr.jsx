import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Container, Text, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class PleaseSignInProfile extends BaseClass {
    state = {
        showPleaseSignInBlock: true
    };

    signInHandler = () => {
        this.setState({ showPleaseSignInBlock: false });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/locales', 'PleaseSignInProfile');

        return (
            <Container paddingY={5}>
                {this.state.showPleaseSignInBlock && (
                    <Text
                        is='h2'
                        fontSize='md'
                        marginY={5}
                    >
                        {getText('please')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            onClick={this.signInHandler}
                        >
                            {getText('signIn')}
                        </Link>{' '}
                        {getText('toViewThisPage')}
                    </Text>
                )}
            </Container>
        );
    }
}

export default wrapComponent(PleaseSignInProfile, 'PleaseSignInProfile', true);
