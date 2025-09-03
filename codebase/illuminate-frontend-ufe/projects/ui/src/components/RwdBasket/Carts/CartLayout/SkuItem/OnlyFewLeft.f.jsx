import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

function OnlyFewLeft() {
    const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');

    return (
        <Flex
            backgroundColor={colors.red}
            color={colors.white}
            width={'fit-content'}
            paddingX={['6px', 2]}
            paddingY={'2px'}
            marginTop={3}
            borderRadius={2}
            fontSize={['10px', 'xs']}
            fontWeight={'bold'}
            justifyContent={'center'}
            css={{ textTransform: 'uppercase' }}
            children={getText('onlyFewLeft')}
        />
    );
}

export default wrapFunctionalComponent(OnlyFewLeft, 'OnlyFewLeft');
