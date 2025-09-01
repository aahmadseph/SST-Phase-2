import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Icon, Flex } from 'components/ui';
import Empty from 'constants/empty';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ShopYourStore/StoreShoppingOptions/locales', 'StoreShoppingOptions');

function StoreShoppingOptions(props) {
    const { options } = props;

    return (
        <Flex
            rowGap={1}
            columnGap={2}
            flexWrap='wrap'
            marginTop={3}
            lineHeight='tight'
        >
            {options.map(option => {
                if (!option.available) {
                    return null;
                }

                return (
                    <Flex
                        key={'shopping_option_' + option.translationKey}
                        gap='2px'
                        alignItems='center'
                    >
                        <Icon
                            name='checkmark'
                            color='green'
                            size='14px'
                        />
                        <Text
                            fontSize='sm'
                            color='gray'
                        >
                            {getText(option.translationKey)}
                        </Text>
                    </Flex>
                );
            })}
        </Flex>
    );
}

StoreShoppingOptions.propTypes = {
    options: PropTypes.array
};

StoreShoppingOptions.defaultProps = {
    options: Empty.Array
};

export default wrapFunctionalComponent(StoreShoppingOptions, 'StoreShoppingOptions');
