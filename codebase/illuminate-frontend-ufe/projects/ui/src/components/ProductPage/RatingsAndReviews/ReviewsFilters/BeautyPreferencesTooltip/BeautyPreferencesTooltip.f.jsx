import React from 'react';
import InfoButton from 'components/InfoButton';
import Tooltip from 'components/Tooltip';
import localeUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, colors } from 'style/config';

const getText = localeUtils.getLocaleResourceFile(
    'components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyPreferencesTooltip/locales',
    'BeautyPreferencesTooltip'
);

const BeautyPreferencesTooltip = ({ isActive }) => (
    <Tooltip
        isFixed={true}
        sideOffset={-space[1]}
        content={getText('tooltipText')}
        fontSize='sm'
    >
        <InfoButton
            marginLeft={-1}
            color={isActive ? colors.white : null}
            hoverColor={isActive ? colors.midGray : null}
            aria-label={`${getText('moreInfo')} ${getText('tooltipText')}`}
        />
    </Tooltip>
);

export default wrapFunctionalComponent(BeautyPreferencesTooltip, 'BeautyPreferencesTooltip');
