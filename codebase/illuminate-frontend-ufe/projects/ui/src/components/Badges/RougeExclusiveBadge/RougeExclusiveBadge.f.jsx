import React from 'react';
import FrameworkUtils from 'utils/framework';
import Badge from 'components/Badge';
import localeUtils from 'utils/LanguageLocale';
import { colors } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

const getText = localeUtils.getLocaleResourceFile('components/Badges/RougeExclusiveBadge/locales', 'RougeExclusiveBadge');

const RougeExclusiveBadge = () => (
    <Badge
        badge={getText('rougeExclusive')}
        color={colors.red}
    />
);

export default wrapFunctionalComponent(RougeExclusiveBadge, 'RougeExclusiveBadge');
