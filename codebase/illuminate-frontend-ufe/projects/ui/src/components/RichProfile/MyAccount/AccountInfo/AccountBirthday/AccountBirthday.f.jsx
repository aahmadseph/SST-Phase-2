import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Divider, Link } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';

const AccountBirthday = function ({ user }) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountBirthday/locales', 'AccountBirthday');

    if (!user.beautyInsiderAccount) {
        return null;
    }

    return (
        <React.Fragment>
            <LegacyGrid
                gutter={3}
                data-at={Sephora.debug.dataAt('account_birthday_field')}
                alignItems='baseline'
            >
                <LegacyGrid.Cell
                    width={Sephora.isMobile() ? 85 : 1 / 4}
                    fontWeight='bold'
                >
                    {getText('birthday')}
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fill'>
                    <Text
                        is='p'
                        marginBottom='.5em'
                    >
                        {dateUtils.getLongMonth(user.beautyInsiderAccount.birthMonth)} {user.beautyInsiderAccount.birthDay}
                    </Text>
                    <Text is='p'>
                        {getText('changeBirthDate')}
                        {Sephora.isDesktop() ? <br /> : ' '}
                        {getText('pleaseCall')}{' '}
                        <Link
                            href='tel:1-877-737-4672'
                            color='blue'
                            underline={true}
                            children='1-877-SEPHORA'
                        />
                        .
                    </Text>
                </LegacyGrid.Cell>
            </LegacyGrid>
            <Divider marginY={5} />
        </React.Fragment>
    );
};

export default wrapFunctionalComponent(AccountBirthday);
