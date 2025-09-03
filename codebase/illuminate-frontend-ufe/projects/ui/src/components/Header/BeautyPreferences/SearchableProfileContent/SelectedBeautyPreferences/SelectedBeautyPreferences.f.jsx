import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Flex, Grid
} from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import { CONTAINER_SIZE, PREFERENCE_TYPES } from 'constants/beautyPreferences';

function SelectedBeautyPreferences({
    selectedOptions,
    refinement,
    setBeautyPreferencesState,
    currentRefinementItemsValues,
    brandNames,
    localization
}) {
    const refinementKey = refinement.key || refinement.type;
    const isFavoriteBrands = refinementKey === PREFERENCE_TYPES.FAVORITE_BRANDS;
    const refinementItemsValues =
        (isFavoriteBrands ? { ...brandNames, noPreferenceFB: localization.noPreference } : currentRefinementItemsValues) || {};

    return (
        <Grid
            columns={[refinement.hasDesc ? null : 2, null, 4]}
            gap={null}
            columnGap={['14px', 4]}
            rowGap={[3, '14px']}
            margin={[null, null, '0 auto']}
            maxWidth={[null, null, CONTAINER_SIZE]}
        >
            {selectedOptions.map(option => (
                <Box
                    key={option}
                    borderWidth='1px'
                    borderStyle='solid'
                    borderColor='black'
                    borderRadius={2}
                    overflow='hidden'
                    css={{ boxShadow: 'inset 0px 0px 0px 1px black' }}
                >
                    <Radio
                        hasHover={false}
                        hasDot={false}
                        margin='0 auto'
                        paddingY={null}
                        name={option}
                        height='100%'
                        width='100%'
                        onClick={() => setBeautyPreferencesState(refinementKey, refinement.singleSelect, option)}
                    >
                        <Flex
                            height='4em'
                            alignItems='center'
                            paddingX={2}
                            justifyContent='center'
                        >
                            <Text textAlign='center'>{refinementItemsValues[option]}</Text>
                        </Flex>
                    </Radio>
                </Box>
            ))}
        </Grid>
    );
}

SelectedBeautyPreferences.propTypes = {
    refinement: PropTypes.object.isRequired,
    setBeautyPreferencesState: PropTypes.func.isRequired,
    selectedOptions: PropTypes.array
};

SelectedBeautyPreferences.defaultProps = {
    selectedOptions: []
};

export default wrapFunctionalComponent(SelectedBeautyPreferences, 'SelectedBeautyPreferences');
