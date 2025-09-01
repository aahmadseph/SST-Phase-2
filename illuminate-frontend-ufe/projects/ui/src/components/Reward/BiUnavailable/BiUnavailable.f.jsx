import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Text, Flex, Icon } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

function BiUnavailable(fullProps) {
    const getText = localeUtils.getLocaleResourceFile('components/Reward/BiUnavailable/locales', 'BiUnavailable');

    const { iconWidth, ...props } = fullProps;

    return (
        <Flex
            alignItems='center'
            backgroundColor='nearWhite'
            lineHeight='tight'
            textAlign='left'
            {...props}
        >
            <Flex
                justifyContent='center'
                width={iconWidth}
                flexShrink={0}
            >
                <Icon
                    name='alert'
                    data-at={Sephora.debug.dataAt('bi_down_icon_alert')}
                    color='gray'
                    size={16}
                />
            </Flex>
            <Text
                paddingLeft={4}
                data-at={Sephora.debug.dataAt('bi_down_error_msg')}
            >
                {getText('biUnavailable')}
            </Text>
        </Flex>
    );
}

BiUnavailable.defaultProps = { padding: 4 };

export default wrapFunctionalComponent(BiUnavailable, 'BiUnavailable');
