import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Flex } from 'components/ui';
import { colors } from 'style/config';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;

function AcceleratedPromotionTerms({ item }) {
    const { acceleratedPromotion } = item.sku;

    if (!acceleratedPromotion) {
        return null;
    }

    const getText = getLocaleResourceFile('components/RwdBasket/Carts/AutoreplenishCart/BelowProductPrice/locales', 'AcceleratedPromotionTerms');
    const { baseReplenishmentAdjuster, childOrderCount, promotionDuration, promotionExpirationDate } = acceleratedPromotion;

    return (
        <Flex
            flexDirection='column'
            gap={3}
            marginTop={3}
            color={colors.gray}
        >
            <Text children={getText('acceleratedPromotionTermsText1', [promotionDuration])} />
            <Text children={getText('acceleratedPromotionTermsText2', [childOrderCount, promotionDuration, parseInt(baseReplenishmentAdjuster)])} />
            <Text children={getText('acceleratedPromotionTermsText3', [dateUtils.getDateInMDYFormat(promotionExpirationDate)])} />
        </Flex>
    );
}

export default wrapFunctionalComponent(AcceleratedPromotionTerms, 'AcceleratedPromotionTerms');
