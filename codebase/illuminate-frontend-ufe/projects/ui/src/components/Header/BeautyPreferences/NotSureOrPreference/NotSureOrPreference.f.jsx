import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';

function NotSureOrPreference({
    refinement, setBeautyPreferencesState, selectedOptions, refinementItem, noPreferenceOption
}) {
    const refinementKey = refinement.key || refinement.type;
    const isFavBrands = refinementKey === PREFERENCE_TYPES.FAVORITE_BRANDS;
    let currentRefinementItem = {};

    if (!refinementItem && !isFavBrands) {
        return null;
    }

    if (isFavBrands) {
        currentRefinementItem = {
            key: 'noPreferenceFB'
        };
    } else {
        currentRefinementItem = refinementItem;
    }

    const isIngredientPref = refinementKey === PREFERENCE_TYPES.INGREDIENT_PREFERENCES;
    const isSelected = selectedOptions.find(option => option === currentRefinementItem.key) && !isIngredientPref && !isFavBrands;
    const value = isFavBrands ? noPreferenceOption : currentRefinementItem.value;

    return (
        <Box
            key={value}
            borderWidth='1px'
            borderStyle='solid'
            borderColor={isSelected ? 'black' : 'midGray'}
            borderRadius={2}
            padding={0}
            overflow='hidden'
            css={{ boxShadow: isSelected ? 'inset 0px 0px 0px 1px black' : 'none' }}
        >
            <Radio
                hasHover={false}
                hasDot={false}
                margin='0 auto'
                paddingY={null}
                name={currentRefinementItem.key}
                height='100%'
                width='100%'
                onClick={() => setBeautyPreferencesState(refinement.type, refinement.singleSelect, currentRefinementItem.key)}
            >
                <Flex
                    height='4em'
                    alignItems='center'
                    justifyContent='center'
                >
                    {value}
                </Flex>
            </Radio>
        </Box>
    );
}

NotSureOrPreference.propTypes = {
    refinement: PropTypes.object.isRequired,
    setBeautyPreferencesState: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(NotSureOrPreference, 'NotSureOrPreference');
