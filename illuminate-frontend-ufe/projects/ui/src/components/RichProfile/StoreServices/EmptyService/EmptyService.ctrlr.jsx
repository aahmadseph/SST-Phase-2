import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Text, Button, Image } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class EmptyService extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/StoreServices/EmptyService/locales', 'EmptyService');
        const isMobile = Sephora.isMobile();
        const isListsPage = this.props.isListsPage;
        const headerCopy = isListsPage ? '' : getText('emptyServiceHeaderCopy');
        const headerBody = getText(isListsPage ? 'productsFromServices' : 'emptyServiceHeaderBody');

        return (
            <div>
                <Image
                    src='/img/ufe/store/list-loveless.svg'
                    display='block'
                    marginX='auto'
                    size={128}
                    marginY={6}
                />
                {headerCopy && (
                    <Text
                        is='p'
                        lineHeight='tight'
                        fontSize={isMobile || 'md'}
                        fontWeight='bold'
                        marginTop={2}
                        marginBottom={1}
                    >
                        {headerCopy}
                    </Text>
                )}
                <Text
                    is='p'
                    lineHeight='tight'
                    fontSize={isMobile || 'md'}
                    marginTop={0}
                    marginBottom={5}
                >
                    {headerBody}
                </Text>
                <Button
                    variant='primary'
                    minWidth={this.props.buttonWidth}
                    href='/happening/home'
                >
                    {getText('bookReservation')}
                </Button>
            </div>
        );
    }
}

export default wrapComponent(EmptyService, 'EmptyService');
