import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Text, Link } from 'components/ui';
import ContentHeading from 'components/RichProfile/EditMyProfile/Content/ContentHeading';
import ContentDivider from 'components/RichProfile/EditMyProfile/Content/ContentDivider';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';

class Birthday extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const bi = this.props.biAccount;
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Birthday/locales', 'Birthday');
        const PHONE_NUMBER = '18777374072';

        const birthday =
            bi.birthYear === '1804'
                ? `${dateUtils.getLongMonth(bi.birthMonth)} ${bi.birthDay}`
                : `${dateUtils.getLongMonth(bi.birthMonth)} ${bi.birthDay} ${bi.birthYear}`;

        const phoneLink = Sephora.isMobile() ? (
            <Link
                color='blue'
                underline={true}
                href={`tel:${PHONE_NUMBER}`}
            >
                1-877-SEPHORA
            </Link>
        ) : (
            <Text display='inline-block'>1-877-SEPHORA</Text>
        );

        return (
            <div>
                <ContentHeading>{getText('yourBirthday')}</ContentHeading>
                <Text
                    is='p'
                    marginTop={4}
                >
                    {birthday}
                </Text>
                <ContentDivider />
                <Text is='p'>
                    {getText('callSephora')}
                    {phoneLink}
                </Text>
            </div>
        );
    }
}

export default wrapComponent(Birthday, 'Birthday');
