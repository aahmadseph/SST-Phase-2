/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { colors } from 'style/config';
import { wrapComponent } from 'utils/framework';
import {
    Box, Flex, Grid, Icon, Divider
} from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import RefinementItemsDisplay from 'components/BeautyPreferencesWorld/Refinement/RefinementItemsDisplay';
import PreferencesModal from 'components/Header/BeautyPreferences/PreferencesModal/PreferencesModal';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { CONTAINER_SIZE, notSureOption, noPreferenceOptions } from 'constants/beautyPreferences';
import languageLocale from 'utils/LanguageLocale';

const getText = languageLocale.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

class SearchableRefinementDisplay extends BaseClass {
    state = {
        activePreferencesModal: false,
        isSearchOpened: false
    };

    searchRef = React.createRef();

    showPreferencesModal = isSearchOpened => {
        this.searchRef.current.blur();
        this.setState({
            activePreferencesModal: true,
            isSearchOpened
        });
    };

    setRefinementItems = refinementItems => {
        const { selectRefinementItems, onRefinementSave } = this.props;
        selectRefinementItems(refinementItems);
        this.setState({ activePreferencesModal: false }, () => {
            onRefinementSave?.({
                e: null,
                ...this.props,
                refinementItemsSelected: refinementItems
            });
        });
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

    getDynamicTitle = () => `${this.props.worldValue} ${this.props.refinement.value}`;

    itemKeyIsNotSureNotPref = itemKey => itemKey.includes('notSure') || itemKey.includes('noPref');

    render() {
        const {
            refinement,
            refinementItemsSelected = [],
            refinementItems = [],
            refinementDisplayType,
            smallDisplayColumns,
            largeDisplayColumns
        } = this.props;

        const refinementKey = refinement.key;
        const isIngredientPref = refinementKey === 'ingredientPreferences';
        const placeholderText = isIngredientPref ? getText('searchIngredients') : getText('searchBrands');
        const buttonText = isIngredientPref ? getText('viewIngredientList') : getText('viewAllBrands');

        const refinementItemsToDisplay = refinementItemsSelected
            .map(itemKey => refinementItems.find(item => itemKey === item.key))
            .filter(ref => !!ref);
        const refinementItemsSelectedWithoutNotSureOrNotPreference = refinementItemsSelected.filter(
            itemKey => !this.itemKeyIsNotSureNotPref(itemKey)
        );

        const refinementItemsKeys = refinementItems.map(item => item.key).filter(key => !this.itemKeyIsNotSureNotPref(key));
        const refinementItemsValues = refinementItems.reduce(
            (acc, current) => ({
                ...acc,
                ...(this.itemKeyIsNotSureNotPref(current.key) ? {} : { [current.key]: current.value })
            }),
            {}
        );

        const localization = {
            selectAllThatApply: this.props.refinementSelectionInstructions,
            clear: getText('clear'),
            apply: getText('apply'),
            saveAndContinue: getText('saveAndContinue')
        };

        const refinementNotSureNotPrefItem = refinement.items?.find(
            item =>
                item.key?.toLowerCase().includes(notSureOption.toLowerCase()) ||
                noPreferenceOptions.some(option => option.toLowerCase() === item.key?.toLowerCase())
        );

        return (
            <Box
                margin={[null, null, '0 auto']}
                marginBottom={[2, null, 4]}
                maxWidth={[null, null, CONTAINER_SIZE]}
                position='relative'
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

                {refinementItemsSelectedWithoutNotSureOrNotPreference.length > 0 && (
                    <RefinementItemsDisplay
                        refinement={refinement}
                        refinementDisplayType={refinementDisplayType}
                        refinementItems={refinementItemsToDisplay}
                        smallDisplayColumns={smallDisplayColumns}
                        largeDisplayColumns={largeDisplayColumns}
                        onRefinementItemClick={this.props.onRefinementItemSelect}
                        refinementItemsSelected={refinementItemsSelectedWithoutNotSureOrNotPreference}
                    />
                )}

                {refinementItemsSelectedWithoutNotSureOrNotPreference.length > 0 && (
                    <Divider
                        marginTop={[3, 4]}
                        marginBottom={[3, 4]}
                    />
                )}

                {/* Action Buttons Grid */}
                <Grid
                    columns={2}
                    columnGap={4}
                    marginBottom={4}
                >
                    {/* View List Button */}
                    <Box
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
                    {refinementNotSureNotPrefItem && (
                        <Box
                            borderWidth='1px'
                            borderStyle='solid'
                            borderColor={refinementItemsSelected.includes(refinementNotSureNotPrefItem.key) ? colors.black : colors.midGray}
                            borderRadius={2}
                            overflow='hidden'
                            css={{
                                boxShadow: refinementItemsSelected.includes(refinementNotSureNotPrefItem.key)
                                    ? `inset 0px 0px 0px 1px ${colors.black}`
                                    : 'none'
                            }}
                        >
                            <Radio
                                hasHover
                                color='black'
                                hasDot={false}
                                margin='0 auto'
                                paddingY={null}
                                name={refinementNotSureNotPrefItem.key}
                                height='100%'
                                width='100%'
                                checked={refinementItemsSelected.includes(refinementNotSureNotPrefItem.key)}
                                onClick={e => this.props.onRefinementItemSelect?.(e, refinementNotSureNotPrefItem)}
                            >
                                <Flex
                                    height='4em'
                                    alignItems='center'
                                    justifyContent='center'
                                    css={{ color: refinementItemsSelected.includes(refinementNotSureNotPrefItem.key) ? colors.black : undefined }}
                                >
                                    {refinementNotSureNotPrefItem?.value || getText('noPreference')}
                                </Flex>
                            </Radio>
                        </Box>
                    )}
                </Grid>

                {/* Add Save and Continue CTA */}
                {this.props.children}

                <PreferencesModal
                    close={this.onClose}
                    setPreferences={this.setRefinementItems}
                    selectedPrefs={refinementItemsSelectedWithoutNotSureOrNotPreference}
                    refinementItemsKeys={refinementItemsKeys}
                    refinementItemsValues={refinementItemsValues}
                    placeholderText={placeholderText}
                    title={this.getDynamicTitle()}
                    isSearchOpened={this.state.isSearchOpened}
                    isOpen={this.state.activePreferencesModal}
                    refinement={refinement}
                    localization={localization}
                    noResults={getText('noResults')}
                    clear={getText('clearSearch')}
                />
            </Box>
        );
    }
}

SearchableRefinementDisplay.propTypes = {
    refinement: PropTypes.object.isRequired,
    refinementItemsSelected: PropTypes.array,
    onRefinementSave: PropTypes.func.isRequired,
    worldCustomerPreference: PropTypes.object,
    worldValue: PropTypes.string.isRequired
};

SearchableRefinementDisplay.defaultProps = {
    refinementItemsSelected: [],
    worldCustomerPreference: {}
};

export default wrapComponent(SearchableRefinementDisplay, 'SearchableRefinementDisplay', true);
