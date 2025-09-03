import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;

function ChangeMethodVariantBox({ availableForOnlyOneOption }) {
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/locales', 'ChangeMethod');

    return (
        <Box
            paddingY={2}
            paddingX={3}
            fontSize={'sm'}
            borderRadius={2}
            backgroundColor={colors.nearWhite}
            textAlign={'left'}
            children={getText(availableForOnlyOneOption ? 'availableForOne' : 'availableForSomeButNotAll')}
        />
    );
}

export default wrapFunctionalComponent(ChangeMethodVariantBox, 'ChangeMethodVariantBox');
