import React from 'react';
import InfoButton from 'components/InfoButton';
import Tooltip from 'components/Tooltip';
import localeUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';
import { colors } from 'style/config';

const getText = localeUtils.getLocaleResourceFile(
    'components/ProductPage/RatingsAndReviews/ReviewsFilters/NonIncentivizedTooltip/locales',
    'NonIncentivizedTooltip'
);

const NonIncentivizedTooltip = ({ isActive }) => (
    <Tooltip
        isFixed={true}
        sideOffset={-space[1]}
        content={getText('nonIncentivized')}
        fontSize='sm'
    >
        <InfoButton
            marginLeft={-1}
            color={isActive ? colors.white : null}
            hoverColor={isActive ? colors.midGray : null}
            aria-label={getText('moreInfo')}
        />
    </Tooltip>
);

export default wrapFunctionalComponent(NonIncentivizedTooltip, 'NonIncentivizedTooltip');
