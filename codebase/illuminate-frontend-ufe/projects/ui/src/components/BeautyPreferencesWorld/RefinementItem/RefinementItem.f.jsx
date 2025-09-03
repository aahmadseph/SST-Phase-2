import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Image, Text } from 'components/ui';
import {
    colors, fontWeights, mediaQueries, fontSizes
} from 'style/config';

function getRefinementItemDisplayConfig(displayType, refinementItem) {
    const config = {
        displayIcon: false,
        valueVerticalAlignment: 'center',
        valueHorizontalAlignment: 'center',
        displayTitleDescription: false,
        displayAvatarImage: false,
        iconSize: '',
        iconRadius: '50%',
        padding: '0px 12px',
        borderWidth: '2px',
        minHeight: '56px'
    };

    const lowerType = (displayType || '').toLowerCase();

    if (lowerType.includes('icon') && refinementItem.image) {
        config.displayIcon = true;
        config.iconSize = '36px';
        config.valueHorizontalAlignment = 'start';
    }

    if (lowerType.includes('smicon')) {
        config.displayIcon = true;
        config.iconSize = '26px';
        config.valueHorizontalAlignment = 'start';
        config.valueHorizontalAlignment = 'start';
        refinementItem.image = refinementItem.image || '/img/ufe/rich-profile/checkmark.svg';
    }

    if (lowerType.includes('noborder')) {
        config.borderWidth = '0';
        config.padding = '0';
        config.minHeight = 'auto';
    }

    if (lowerType.includes('txt')) {
        config.displayIcon = false;

        if (refinementItem.description) {
            config.valueVerticalAlignment = 'start';
            config.valueHorizontalAlignment = 'start';
            config.displayTitleDescription = true;
            config.padding = '10px 12px';
        }
    }

    if (lowerType.includes('rich') && refinementItem.avatarImageUrl) {
        config.valueHorizontalAlignment = 'start';
        config.displayAvatarImage = true;
        config.iconSize = '20px';
        config.padding = '0';
    }

    return config;
}

function RefinementItem({
    refinementItem, displayType = '', isSelected, onRefinementItemClick, refinement
}) {
    if (!refinementItem) {
        return null;
    }

    const refinementConfig = getRefinementItemDisplayConfig(displayType, refinementItem);

    // Skip text resizing for shoppingPreferences and when displayType includes 'txt'
    const isShoppingPreferences = refinement?.key === 'shoppingPreferences';
    const isTxtDisplayType = (displayType || '').toLowerCase().includes('txt');

    // Determine if text might wrap to 3+ lines (rough guess-timation based on char count)
    const textLength = refinementItem.value ? refinementItem.value.length : 0;
    const descLength = refinementItem.description ? refinementItem.description.length : 0;
    const shouldUseSmallText = !isShoppingPreferences && !isTxtDisplayType && (textLength > 22 || descLength > 40);

    const textStyles = shouldUseSmallText && {
        fontSize: fontSizes.sm,
        lineHeight: '1.2',
        overflow: 'hidden',
        [mediaQueries.lg]: {
            fontSize: fontSizes.base,
            lineHeight: '1.4',
            display: 'block',
            overflow: 'visible'
        }
    };

    // If Shopping Preferences “No Preference” option, use 96px height on all breakpoints
    const isNoPreferenceOption = refinementItem?.key?.toLowerCase?.().includes('nopreference');
    const minHeightArr = isShoppingPreferences && isNoPreferenceOption ? ['50px', '50px', '96px'] : ['42px', '56px', refinementConfig.minHeight];
    const shoppingPreferenceItemsWidth = isShoppingPreferences ? '406px' : null;
    const shoppingPreferenceItemsWidthSmui = isShoppingPreferences ? '343px' : '172px';

    return (
        <Flex
            padding={refinementConfig.padding}
            borderWidth={refinementConfig.borderWidth}
            borderStyle='solid'
            borderColor={isSelected ? colors.black : colors.midGray}
            borderRadius={2}
            width={[shoppingPreferenceItemsWidthSmui, null, shoppingPreferenceItemsWidth]}
            minHeight={minHeightArr}
            css={{ justifySelf: ['start', null, null] }}
            justifyContent={refinementConfig.valueHorizontalAlignment}
            alignItems={refinementConfig.valueVerticalAlignment}
            onClick={onRefinementItemClick}
        >
            {refinementConfig.displayAvatarImage && (
                <Image
                    display='block'
                    marginRight={2}
                    src={refinementItem.avatarImageUrl}
                    css={{ flexShrink: 0, zIndex: -1 }}
                />
            )}
            {refinementConfig.displayIcon && (
                <Image
                    display='block'
                    marginRight={2}
                    src={refinementItem.image || '/img/ufe/rich-profile/checkmark.svg'}
                    size={refinementConfig.iconSize}
                    borderRadius={refinementConfig.iconRadius}
                    css={{ flexShrink: 0, zIndex: -1 }}
                />
            )}
            {refinementConfig.displayTitleDescription ? (
                <Flex
                    flexDirection='column'
                    minWidth={0}
                    flex={1}
                >
                    <Text
                        fontWeight={fontWeights.bold}
                        css={textStyles}
                    >
                        {refinementItem.value}
                    </Text>
                    <Text
                        color={colors.gray}
                        css={textStyles}
                    >
                        {refinementItem.description}
                    </Text>
                </Flex>
            ) : (
                <Text
                    css={textStyles}
                    minWidth={0}
                    flex={1}
                >
                    {refinementItem.value}
                </Text>
            )}
        </Flex>
    );
}

export default wrapFunctionalComponent(RefinementItem, 'RefinementItem');
