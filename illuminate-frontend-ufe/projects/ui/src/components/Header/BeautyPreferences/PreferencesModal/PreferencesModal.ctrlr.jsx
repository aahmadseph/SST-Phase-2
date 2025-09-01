import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { colors, space } from 'style/config';
import {
    Grid, Flex, Text, Link, Button, Icon
} from 'components/ui';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';

const PREFERENCE_CHARACTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '#'
];

import TextInput from 'components/Inputs/TextInput/TextInput';
import Chiclet from 'components/Chiclet';

class PreferencesModal extends BaseClass {
    state = {
        searchTerm: '',
        isSearchFocused: false,
        selectedPrefs: [],
        allowEmptySelection: this.props.allowEmptySelection || false
    };

    searchPrefRef = React.createRef();

    focusSearchRef = () => {
        this.searchPrefRef.current.focus();
    };

    componentDidMount() {
        this.setState({ selectedPrefs: this.props.selectedPrefs });
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedPrefs && this.props.selectedPrefs !== prevProps.selectedPrefs) {
            this.setState({ selectedPrefs: this.props.selectedPrefs });
        }

        if (this.props.isSearchOpened && this.props.isSearchOpened !== prevProps.isSearchOpened) {
            this.focusSearchRef();
        }
    }

    componentWillUnmount() {
        if (this.state.isSearchFocused) {
            this.onSearchBlur();
        }
    }

    groupPrefsByCharacter = refinementItemsValues => {
        const joinData = (term = '') => term.toLowerCase().replace(/\s|\W/g, '');
        const groupedPrefs = {};
        const searchBy = joinData(this.state.searchTerm);
        const filteredValues =
            this.state.searchTerm.length >= 2
                ? this.props.refinementItemsKeys.filter(preference => joinData(refinementItemsValues[preference]).indexOf(searchBy) >= 0)
                : this.props.refinementItemsKeys;

        filteredValues &&
            filteredValues.forEach(pref => {
                let character = refinementItemsValues[pref]?.charAt(0).toUpperCase();

                if (/^\d+$/.test(character)) {
                    character = '#';
                }

                if (!groupedPrefs[character]) {
                    groupedPrefs[character] = [pref];
                } else {
                    groupedPrefs[character].push(pref);
                }
            });

        return groupedPrefs;
    };

    renderSelectableItem = (character, groupedPrefs, refinementItemsValues) => {
        const getId = id => `pref-${id}`;

        return (
            <div
                key={getId(character)}
                id={getId(character)}
            >
                <Text
                    is='h4'
                    fontSize='md'
                    fontWeight='bold'
                    marginTop='.125em'
                    marginBottom={2}
                    children={character}
                />
                <ul>
                    {groupedPrefs[character].map((pref, indexChar) => (
                        <li
                            key={indexChar}
                            css={styles.prefGroup}
                        >
                            <Checkbox
                                checked={this.state.selectedPrefs.find(option => option === pref)}
                                onClick={() => this.updateSelectedPrefs(pref)}
                                value={pref}
                                hasHover={true}
                                fontWeight={this.state.selectedPrefs.find(option => option === pref) && 'bold'}
                                paddingY={2}
                                width='100%'
                                children={refinementItemsValues[pref]}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    renderFilterOptions = (groupedPrefs, refinementItemsValues) => {
        return (
            <React.Fragment>
                <Text
                    is='p'
                    color='gray'
                    children={`${this.props.localization.selectAllThatApply}`}
                />
                <Grid
                    gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
                    gap={0}
                    columnGap={2}
                    rowGap={4}
                    alignItems='start'
                >
                    {PREFERENCE_CHARACTERS.map(character => {
                        if (!groupedPrefs[character]) {
                            return null;
                        }

                        return this.renderSelectableItem(character, groupedPrefs, refinementItemsValues);
                    })}
                </Grid>
            </React.Fragment>
        );
    };

    updateSelectedPrefs = pref => {
        if (this.state.isSearchFocused) {
            this.onSearchBlur();
        }

        let currentPrefs = [...this.state.selectedPrefs];
        const isSelected = currentPrefs.some(option => option === pref);

        if (isSelected) {
            currentPrefs = currentPrefs.filter(option => option !== pref);
        } else {
            currentPrefs = [...currentPrefs, pref];
        }

        this.setState({ selectedPrefs: currentPrefs });
    };

    onClose = () => {
        this.setState({
            searchTerm: '',
            selectedPrefs: this.props.selectedPrefs
        });
        this.props.close();
    };

    applyPrefs = () => {
        this.setState({ searchTerm: '' });
        this.props.setPreferences(this.state.selectedPrefs);
        this.props.close();
    };

    onSearchChange = e => {
        this.setState({ searchTerm: e.target.value });
    };

    onSearchFocus = () => {
        this.setState({ isSearchFocused: true });
    };

    onSearchBlur = () => {
        this.setState({ isSearchFocused: false });
    };

    clearSearch = () => {
        this.setState({ searchTerm: '' }, this.focusSearchRef());
    };

    clearSelection = () => {
        this.setState({ selectedPrefs: [] });
    };

    renderSearchInput = () => {
        const { searchTerm, isSearchFocused } = this.state;
        const { placeholderText } = this.props;
        const hasSearchTerm = searchTerm.length > 0;

        return (
            <TextInput
                ref={this.searchPrefRef}
                type='search'
                autoOff={true}
                maxLength={70}
                value={searchTerm}
                onChange={this.onSearchChange}
                onFocus={this.onSearchFocus}
                onBlur={this.onSearchBlur}
                isControlled={true}
                isSmall={true}
                marginBottom={2}
                placeholder={placeholderText}
                {...(isSearchFocused ||
                    hasSearchTerm || {
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
                })}
                contentAfter={
                    hasSearchTerm && (
                        <button
                            css={styles.clearButton}
                            type='button'
                            data-at={Sephora.debug.dataAt('cross')}
                            onClick={this.clearSearch}
                        >
                            <Icon
                                name='x'
                                size={8}
                            />
                        </button>
                    )
                }
            />
        );
    };

    renderFooter = () => {
        // Check if current selections differ from original saved selections
        const originalPrefs = this.props.selectedPrefs || [];
        const currentPrefs = this.state.selectedPrefs || [];

        // Compare arrays to see if selections have changed
        const hasChanges =
            originalPrefs.length !== currentPrefs.length ||
            originalPrefs.some(pref => !currentPrefs.includes(pref)) ||
            currentPrefs.some(pref => !originalPrefs.includes(pref));

        // Disable when: (no selections AND allowEmptySelection is false) OR (no changes made from original)
        const isDisabled = !hasChanges && ((currentPrefs.length === 0 && !this.state.allowEmptySelection) || originalPrefs.length > 0);

        return (
            <Flex justifyContent='space-between'>
                <Link
                    lineHeight='tight'
                    color='blue'
                    onClick={this.clearSelection}
                >
                    {this.props.localization.clear}
                </Link>
                <Button
                    variant='primary'
                    onClick={this.applyPrefs}
                    hasMinWidth={true}
                    disabled={isDisabled}
                >
                    {this.props.localization.saveAndContinue}
                </Button>
            </Flex>
        );
    };

    renderNoResults = () => {
        return (
            <Flex>
                <Text
                    is='p'
                    color='gray'
                    paddingRight={1}
                    children={this.props.noResults}
                />
                <Link
                    lineHeight='tight'
                    color='blue'
                    onClick={this.clearSearch}
                >
                    {this.props.clear}
                </Link>
            </Flex>
        );
    };

    renderSelectedChiclets = refinementItemsValues => {
        const { selectedPrefs } = this.state;

        if (!selectedPrefs.length) {
            return null;
        }

        return (
            <Flex css={styles.selectedChicletContainer}>
                {selectedPrefs.map(pref => (
                    <Chiclet
                        key={pref}
                        showX
                        variant='fill'
                        customPaddingX={3}
                        onClick={() => this.updateSelectedPrefs(pref)}
                        customCSS={{ marginRight: space[1], marginBottom: space[1] }}
                    >
                        {refinementItemsValues[pref]}
                    </Chiclet>
                ))}
            </Flex>
        );
    };

    render() {
        const refinementKey = this.props.refinement.key || this.props.refinement.type;
        const isFavoriteBrands = refinementKey === PREFERENCE_TYPES.FAVORITE_BRANDS;
        const refinementItemsValues = (isFavoriteBrands ? this.props.brandNames : this.props.refinementItemsValues) || {};
        const groupedPrefs = this.groupPrefsByCharacter(refinementItemsValues);

        return (
            <Modal
                width={3}
                isOpen={this.props.isOpen}
                onDismiss={this.onClose}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body height={513}>
                    {this.renderSearchInput()}
                    {!Object.keys(groupedPrefs).length ? this.renderNoResults() : this.renderFilterOptions(groupedPrefs, refinementItemsValues)}
                </Modal.Body>
                {this.renderSelectedChiclets(refinementItemsValues)}
                <Modal.Footer>{this.renderFooter()}</Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    clearButton: {
        color: colors.white,
        backgroundColor: colors.gray,
        lineHeight: 0,
        borderRadius: 99999,
        width: 16,
        height: 16,
        marginRight: space[2],
        alignSelf: 'center',
        textAlign: 'center',
        '.no-touch &:hover': {
            backgroundColor: colors.black
        }
    },
    prefGroup: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        width: '100%'
    },
    selectedChicletContainer: {
        borderTop: `1px solid ${colors.lightGray}`,
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingTop: space[2],
        paddingBottom: space[2],
        paddingLeft: space[5],
        paddingRight: space[5],
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        backgroundColor: colors.white,
        '> *': {
            flexShrink: 0
        }
    }
};

PreferencesModal.propTypes = {
    close: PropTypes.func.isRequired,
    setPreferences: PropTypes.func.isRequired,
    selectedPrefs: PropTypes.array,
    refinementItemsKeys: PropTypes.array,
    placeholderText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSearchOpened: PropTypes.bool,
    isOpen: PropTypes.bool,
    // If true, button stays enabled even with empty selections. If false, button is disabled when no selections AND no changes made.
    allowEmptySelection: PropTypes.bool
};

PreferencesModal.defaultProps = {
    selectedPrefs: [],
    preferences: [],
    isSearchOpened: false,
    isOpen: false
};

export default wrapComponent(PreferencesModal, 'PreferencesModal', true);
