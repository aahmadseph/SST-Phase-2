import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Divider } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import localeUtils from 'utils/LanguageLocale';
import { EpsCodeToCategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';

const AccountTax = function ({ tax }) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    if (!tax) {
        return null;
    }

    const mappedCategoryType = tax?.taxExemptCategory ? EpsCodeToCategoryType[tax?.taxExemptCategory] : null;

    if (!mappedCategoryType) {
        return null;
    }

    return (
        <React.Fragment>
            <Divider marginY={5} />
            <LegacyGrid
                gutter={3}
                data-at={Sephora.debug.dataAt('account_birthday_field')}
                alignItems='baseline'
            >
                <LegacyGrid.Cell
                    width={Sephora.isMobile() ? 85 : 1 / 4}
                    fontWeight='bold'
                >
                    {getText('taxExemption')}
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fill'>
                    <Text
                        is='p'
                        marginBottom='.5em'
                    >
                        {getText(`categoryTitleFor${mappedCategoryType}`)}
                    </Text>
                </LegacyGrid.Cell>
            </LegacyGrid>
        </React.Fragment>
    );
};

export default wrapFunctionalComponent(AccountTax);
