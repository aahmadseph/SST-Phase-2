import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Text } from 'components/ui';
import IconVenn from 'components/LegacyIcon/IconVenn';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const BeautyMatchBadge = function () {
    const getText = getLocaleResourceFile('components/BeautyMatchBadge/locales', 'BeautyMatchBadge');
    const { isPlural, ...props } = this.props;

    return (
        <Flex
            display='inline-flex'
            verticalAlign='middle'
            alignItems='center'
            borderRadius={2}
            fontSize='sm'
            fontWeight='bold'
            lineHeight='none'
            backgroundColor='nearWhite'
            paddingX={2}
            paddingY={1}
            {...props}
        >
            <IconVenn fontSize='1.083em' />
            <Text
                id={this.props.ariaId}
                marginLeft={1}
            >
                {getText(isPlural ? 'beautyMatches' : 'beautyMatch')}
            </Text>
        </Flex>
    );
};

export default wrapFunctionalComponent(BeautyMatchBadge, 'BeautyMatchBadge');
