import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Flex, Image, Grid
} from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import NotSureOrPreference from 'components/Header/BeautyPreferences/NotSureOrPreference';
import {
    CONTAINER_SIZE, PREFERENCE_TYPES, notSureOption, noPreferenceOptions
} from 'constants/beautyPreferences';

function TiledProfileContent({
    refinement, selectedOptions, setBeautyPreferencesState, isPostSignupModal, ...props
}) {
    if (!refinement) {
        return null;
    }

    const refinementItems = Array.isArray(refinement.items) ? refinement.items : [];
    const refinementKey = refinement.key || refinement.type;
    const imgPrefix = `/img/ufe/rich-profile/${refinementKey.toLowerCase()}-`;
    const isNotSkinTone = refinement.showModelIcon || !refinement.showIcon;
    const isShoppingPreferences = refinementKey === PREFERENCE_TYPES.SHOPPING_PREFERENCES;
    const isAgeRange = refinementKey === PREFERENCE_TYPES.AGE_RANGE;
    const refinementNotSureNotPrefItem = refinement.items?.find(
        item => item.key?.includes(notSureOption) || noPreferenceOptions.some(option => option.includes(item.key))
    );

    return (
        <Grid
            columns={refinement.hasDesc ? [null, null, 2] : [2, null, 4]}
            gap={null}
            columnGap={['14px', 4]}
            rowGap={[3, '14px']}
            margin={!isPostSignupModal && [null, null, '0 auto']}
            maxWidth={!isPostSignupModal && [null, null, CONTAINER_SIZE]}
        >
            {refinementItems.map(item => {
                const itemKey = item.key;
                const isNotSureOrNoPreference = itemKey?.includes(notSureOption) || itemKey?.includes('noPreference');

                if (!itemKey || isNotSureOrNoPreference) {
                    return null;
                }

                const isOptionsSelected = selectedOptions.find(option => option === itemKey);
                const modelSrcImage = imgPrefix + itemKey.toLowerCase() + '-model.' + refinement.iconType;
                const iconSrcImage = item.image;

                return (
                    <Box
                        key={itemKey}
                        borderWidth='1px'
                        borderStyle='solid'
                        borderColor={isOptionsSelected ? 'black' : 'midGray'}
                        borderRadius={2}
                        padding={0}
                        overflow='hidden'
                        css={{ boxShadow: isOptionsSelected ? 'inset 0px 0px 0px 1px black' : 'none' }}
                    >
                        <Radio
                            hasHover={false}
                            hasDot={false}
                            margin={isAgeRange ? '0 auto' : null}
                            paddingY={refinement.showModelIcon ? 0 : isAgeRange ? 4 : 2}
                            paddingX={refinement.showModelIcon ? 0 : 3}
                            height='100%'
                            width='100%'
                            name={itemKey}
                            onClick={() => setBeautyPreferencesState(refinement.key || refinement.type, refinement.singleSelect, itemKey)}
                        >
                            <Flex
                                alignItems='center'
                                justifyContent={isAgeRange ? 'center' : null}
                            >
                                {refinement.showModelIcon && (
                                    <Image
                                        display='block'
                                        marginRight={2}
                                        src={modelSrcImage}
                                        size={56}
                                        css={{ flexShrink: 0, zIndex: -1 }}
                                    />
                                )}
                                {refinement.showIcon && (
                                    <Image
                                        marginRight={refinement.showModelIcon ? '6px' : null}
                                        minWidth='auto'
                                        borderRadius='full'
                                        display='block'
                                        src={iconSrcImage}
                                        css={{ flexShrink: 0 }}
                                        size={refinement.showModelIcon ? 20 : 36}
                                    />
                                )}
                                {!refinement.hasDesc && (
                                    <Text
                                        marginRight={[refinement.showModelIcon && 2, null, null]}
                                        marginLeft={isNotSkinTone ? null : 2}
                                    >
                                        {item.value}
                                    </Text>
                                )}
                                {refinement.hasDesc && (
                                    <Flex
                                        flexDirection='column'
                                        alignItems='flex-start'
                                        marginLeft={!isShoppingPreferences ? 2 : null}
                                    >
                                        <Text fontWeight='bold'>{item.value}</Text>
                                        <Text color='gray'>{props[itemKey + 'Desc']}</Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Radio>
                    </Box>
                );
            })}
            {refinementNotSureNotPrefItem && (
                <NotSureOrPreference
                    refinement={refinement}
                    refinementItem={refinementNotSureNotPrefItem}
                    selectedOptions={selectedOptions}
                    setBeautyPreferencesState={setBeautyPreferencesState}
                />
            )}
        </Grid>
    );
}

TiledProfileContent.propTypes = {
    refinement: PropTypes.object.isRequired,
    setBeautyPreferencesState: PropTypes.func.isRequired,
    selectedOptions: PropTypes.array,
    isPostSignupModal: PropTypes.bool
};

TiledProfileContent.defaultProps = {
    selectedOptions: [],
    isPostSignupModal: false
};

export default wrapFunctionalComponent(TiledProfileContent, 'TiledProfileContent');
