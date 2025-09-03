/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Flex, Grid, Icon, Divider
} from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import NotSureOrPreference from 'components/Header/BeautyPreferences/NotSureOrPreference';
import SelectedBeautyPreferences from 'components/Header/BeautyPreferences/SearchableProfileContent/SelectedBeautyPreferences';
import PreferencesModal from 'components/Header/BeautyPreferences/PreferencesModal';
import TextInput from 'components/Inputs/TextInput/TextInput';
import {
    CONTAINER_SIZE, PREFERENCE_TYPES, notSureOption, noPreferenceOptions
} from 'constants/beautyPreferences';
import beautyPreferencesBindings from 'analytics/bindingMethods/pages/beautyPreferences/BeautyPreferencesBindings';
import Empty from 'constants/empty';

class SearchableProfileContent extends BaseClass {
    state = {
        activePreferencesModal: false,
        isSearchOpened: false
    };

    searchRef = React.createRef();

    showPreferencesModal = isSearchOpened => {
        beautyPreferencesBindings.ingredientPreferencesFavoriteBrands({ isIngredientPref: this.props.isIngredientPref });

        this.searchRef.current.blur();
        this.setState({
            activePreferencesModal: true,
            isSearchOpened
        });
    };

    setPreferences = prefs => {
        const { refinement, setSearchableBeautyPreferencesState } = this.props;
        const refinementKey = refinement.key || refinement.type;
        setSearchableBeautyPreferencesState(refinementKey, prefs);
        this.setState({ activePreferencesModal: false });
    };

    openPreferencesModal = () => {
        this.showPreferencesModal(true);
    };

    onClose = () => {
        this.setState({
            activePreferencesModal: false,
            isSearchOpened: false
        });
    };

    render() {
        const {
            refinement, setBeautyPreferencesState, selectedOptions, textResources, brandIds
        } = this.props;
        const refinementKey = refinement.key || refinement.type;
        const isIngredientPref = refinementKey === PREFERENCE_TYPES.INGREDIENT_PREFERENCES;
        const isFavoriteBrands = refinementKey === PREFERENCE_TYPES.FAVORITE_BRANDS;
        const isOptionsSelected = selectedOptions.length > 0;
        const placeholderText = isIngredientPref ? textResources.ingredientPreferencesSearchText : textResources.favoriteBrandsSearchText;
        const buttonText = isIngredientPref ? textResources.viewIngredientList : textResources.viewAllBrands;
        const currentRefinementItemsKeys = refinement.items ? refinement.items.map(item => item.key) : [];
        const currentRefinementItemsValues = refinement.items
            ? refinement.items.reduce((acc, current) => ({ ...acc, [current.key]: current.value }), {})
            : [];
        const refinementItemsKeys = isIngredientPref ? currentRefinementItemsKeys : isFavoriteBrands ? brandIds : Empty.Array;
        const title = isIngredientPref ? textResources.ingredientPreferencesTitle : textResources.favoriteBrandsTitle;
        const refinementNotSureNotPrefItem = refinement.items?.find(
            item => item.key?.includes(notSureOption) || noPreferenceOptions.some(option => option.includes(item.key))
        );

        return (
            <Box
                margin={[null, null, '0 auto']}
                marginBottom={[2, null, '-22']}
                maxWidth={[null, null, CONTAINER_SIZE]}
                position='relative'
                top={[null, null, '-22']}
            >
                <TextInput
                    ref={this.searchRef}
                    type='search'
                    autoOff={true}
                    maxLength={70}
                    onClick={this.openPreferencesModal}
                    {...{
                        indent: 2,
                        contentBefore: (
                            <Icon
                                name='search'
                                color='gray'
                                size={16}
                                marginLeft={3}
                                css={{ alignSelf: 'center' }}
                            />
                        )
                    }}
                    isControlled={true}
                    isSmall={true}
                    marginBottom={4}
                    placeholder={placeholderText}
                />
                <SelectedBeautyPreferences
                    refinement={refinement}
                    selectedOptions={selectedOptions}
                    setBeautyPreferencesState={setBeautyPreferencesState}
                    currentRefinementItemsValues={currentRefinementItemsValues}
                />
                {isOptionsSelected && (
                    <Divider
                        marginTop={[3, 4]}
                        marginBottom={[3, 4]}
                    />
                )}
                <Grid
                    columns={2}
                    columnGap={4}
                >
                    <Box
                        key={'viewList'}
                        borderWidth='1px'
                        borderStyle='solid'
                        borderColor='midGray'
                        borderRadius={2}
                        overflow='hidden'
                    >
                        <Radio
                            hasHover={true}
                            color='blue'
                            hasDot={false}
                            margin='0 auto'
                            paddingY={null}
                            name='viewList'
                            height='100%'
                            width='100%'
                            onClick={() => this.showPreferencesModal(false)}
                        >
                            <Flex
                                height='4em'
                                alignItems='center'
                                justifyContent='center'
                            >
                                {buttonText}
                            </Flex>
                        </Radio>
                    </Box>
                    {(!!refinementNotSureNotPrefItem || isFavoriteBrands) && (
                        <NotSureOrPreference
                            refinement={refinement}
                            refinementItem={refinementNotSureNotPrefItem}
                            selectedOptions={selectedOptions}
                            setBeautyPreferencesState={setBeautyPreferencesState}
                        />
                    )}
                </Grid>
                <PreferencesModal
                    close={this.onClose}
                    setPreferences={this.setPreferences}
                    selectedPrefs={selectedOptions}
                    refinementItemsKeys={refinementItemsKeys}
                    refinementItemsValues={currentRefinementItemsValues}
                    placeholderText={placeholderText}
                    title={title}
                    isSearchOpened={this.state.isSearchOpened}
                    isOpen={this.state.activePreferencesModal}
                    refinement={refinement}
                />
            </Box>
        );
    }
}

SearchableProfileContent.propTypes = {
    refinement: PropTypes.object.isRequired,
    setBeautyPreferencesState: PropTypes.func.isRequired,
    setSearchableBeautyPreferencesState: PropTypes.func.isRequired,
    beautyPreferences: PropTypes.object.isRequired
};

export default wrapComponent(SearchableProfileContent, 'SearchableProfileContent');
