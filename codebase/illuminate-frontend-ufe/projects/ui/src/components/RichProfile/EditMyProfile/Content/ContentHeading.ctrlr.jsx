import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Text } from 'components/ui';
import IconLock from 'components/LegacyIcon/IconLock';
import localeUtils from 'utils/LanguageLocale';

class ContentHeading extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            is = 'h2', id, parens, isMyProfile, children
        } = this.props;
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/locales', 'ContentHeading');

        return (
            <React.Fragment>
                <Text
                    is={is}
                    id={id}
                    lineHeight='tight'
                >
                    <Text
                        fontWeight='bold'
                        children={children}
                    />
                    {parens && (
                        <Text
                            marginLeft={1}
                            color='gray'
                            children={` (${parens})`}
                        />
                    )}
                </Text>
                {isMyProfile && (
                    <Text
                        is='p'
                        fontSize='sm'
                        marginTop={3}
                        color='gray'
                    >
                        <IconLock
                            marginRight='.5em'
                            fontSize='1.25em'
                        />
                        {getText('infoPublicProfile')}
                    </Text>
                )}
            </React.Fragment>
        );
    }
}

export default wrapComponent(ContentHeading, 'ContentHeading');
