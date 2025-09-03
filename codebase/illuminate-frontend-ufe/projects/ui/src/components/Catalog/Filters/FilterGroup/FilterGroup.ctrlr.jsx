import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Link, Text, Divider, Icon, Flex
} from 'components/ui';
import Chevron from 'components/Chevron';
import {
    modal, space, mediaQueries, colors, fontSizes
} from 'style/config';
import FilterItem from 'components/Catalog/Filters/FilterItem/FilterItem';
import { SINGLE_SELECTS, BRAND_LETTERS, REFINEMENT_TYPES } from 'utils/CatalogConstants';
import languageLocaleUtils from 'utils/LanguageLocale';
const getText = languageLocaleUtils.getLocaleResourceFile('components/Catalog/Filters/locales', 'Filters');
import TextInput from 'components/Inputs/TextInput/TextInput';
import catalogUtils from 'utils/Catalog';
import uiUtils from 'utils/UI';
import { DebouncedResize } from 'constants/events';
import isFunction from 'utils/functions/isFunction';

const {
    COLORS, CHECKBOXES, CHECKBOXES_CUSTOM, SORT, RANGE, CHECKBOXES_WITH_DROPDOWN
} = REFINEMENT_TYPES;
const { SKELETON_ANIMATION } = uiUtils;

const FILTER_LIMIT = 10;
const DRAWER_TOGGLE_HEIGHT = 50;

class FilterGroup extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            expandedByUser: null,
            height: null,
            searchTerm: '',
            isSearchFocused: false,
            prevContextId: null,
            displayByAtoZ: false
        };

        this.drawerRef = React.createRef();
        this.toggleRef = React.createRef();
        this.searchRef = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.contextId === state.prevContextId) {
            return null;
        }

        // state for any new api response (apply filters, hardload, spa navigation to other page)
        const newState = {
            prevContextId: props.contextId,
            searchTerm: ''
        };

        const {
            type, isModal, pageId, activeItem, title
        } = props;
        const autoExpandUpperFunnelGroup = type === CHECKBOXES_WITH_DROPDOWN;
        const autoexpandBeautyPreferencesGroup = type === REFINEMENT_TYPES.BEAUTY_PREFERENCES && props.userInfo?.hasBeautyPreferencesSet;

        // state for hardload and spa navigation to other page
        if (pageId !== state.currentPageId) {
            newState.currentPageId = pageId;
            newState.expandedByUser = null;
            newState.height = (isModal && activeItem === title) || autoExpandUpperFunnelGroup || autoexpandBeautyPreferencesGroup ? '' : 0;
        }

        // autoexpand Upper Funnel refinements group on hardload or SPA navigation
        if (autoExpandUpperFunnelGroup) {
            newState.expandedByUser = autoExpandUpperFunnelGroup;
        }

        if (autoexpandBeautyPreferencesGroup) {
            newState.expandedByUser = autoexpandBeautyPreferencesGroup;
        }

        return newState;
    }

    filterItemIsSelected = ({ type, ref, values, subType }) => {
        const { selectedValues } = this.props;
        const refinementValue = ref.refinementValue;
        let isSelected = false;

        if (type === SORT || subType === REFINEMENT_TYPES.RADIOS_CUSTOM) {
            isSelected =
                selectedValues.length > 0
                    ? selectedValues.indexOf(refinementValue) >= 0
                    : values.findIndex(x => x.isDefault && x.refinementValue === refinementValue) >= 0;
        } else if (type === RANGE && catalogUtils.isCustomRange(refinementValue)) {
            isSelected = selectedValues?.findIndex(x => catalogUtils.isCustomRange(x)) >= 0;
        } else {
            isSelected = selectedValues?.indexOf(refinementValue) >= 0;
        }

        return isSelected;
    };

    handleClick = () => {
        const expanded = this.isExpanded();
        this.setState({ expandedByUser: !expanded });

        if (this.props.isModal && !expanded) {
            this.scrollToDrawer();
        }
    };

    handleResize = () => {
        const height = this.drawerRef.current?.scrollHeight;

        if (this.state.height !== height) {
            this.setState({ height });
        }
    };

    handleTransitionStart = () => {
        this.drawerRef.current.style.overflow = 'hidden';
    };

    componentDidUpdate(prevProps, prevState) {
        this.handleResize();

        if (
            prevProps.values !== this.props.values ||
            prevState.searchTerm !== this.state.searchTerm ||
            prevState.displayByAtoZ !== this.state.displayByAtoZ
        ) {
            this.setState({
                height: null
            });
        }
    }

    scrollToDrawer = () => {
        setTimeout(() => {
            this.toggleRef.current.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }, 300);
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
        this.drawerRef?.current?.addEventListener('transitionstart', this.handleTransitionStart);

        const { isModal, activeItem, title } = this.props;

        if (isModal && activeItem === title) {
            this.scrollToDrawer();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        this.drawerRef?.current?.removeEventListener('transitionstart', this.handleTransitionStart);
    }

    onFilterSelect = (ref, applyFilters = false) => {
        const { selectFilters, type } = this.props;

        const value = ref.refinementValue;

        const filters = this.isSingleSelect(type) ? [value] : this.buildMultiSelectFilters(value);

        selectFilters({ [this.props.title]: filters }, applyFilters, ref);
    };

    isSingleSelect = type => {
        return SINGLE_SELECTS.indexOf(type) >= 0;
    };

    buildMultiSelectFilters = refinementValue => {
        const { selectedValues } = this.props;
        const filtersToSelect =
            selectedValues.indexOf(refinementValue) >= 0 ? selectedValues.filter(x => x !== refinementValue) : [...selectedValues, refinementValue];

        return filtersToSelect;
    };

    orderDivideAndLimit = (values, limitResult) => {
        if (this.state.displayByAtoZ) {
            return BRAND_LETTERS.reduce((acc, letter) => {
                acc[letter] = values
                    .slice()
                    .filter(
                        val =>
                            (letter === '#' && !isNaN(val.refinementValueDisplayName.charAt(0))) ||
                            val.refinementValueDisplayName.charAt(0).toUpperCase() === letter
                    )
                    .sort((a, b) =>
                        a.refinementValueDisplayName < b.refinementValueDisplayName
                            ? -1
                            : a.refinementValueDisplayName > b.refinementValueDisplayName
                                ? 1
                                : 0
                    );

                return acc;
            }, {});
        } else {
            const orderedValuesWithDivider = values
                .slice() // we need to slice, because sort mutates data in place
                .sort((a, b) => b.refinementValueStatus - a.refinementValueStatus)
                .reduce(
                    (acc, curr, i, arr) => {
                        // if we see the change between prev and curr refinementValueStatus - we add a divider in beetween
                        if (i > 0 && arr[i - 1].refinementValueStatus !== curr.refinementValueStatus) {
                            acc.values.push({
                                divider: true,
                                key: `divider-${arr[i - 1].refinementValueStatus}-${curr.refinementValueStatus}`
                            });
                            acc.dividerCount = acc.dividerCount + 1;
                        }

                        acc.values.push(curr);

                        return acc;
                    },
                    {
                        dividerCount: 0,
                        values: []
                    }
                );

            const { filterLimit = FILTER_LIMIT } = this.props;
            const result = limitResult
                ? orderedValuesWithDivider.values.slice(0, filterLimit + orderedValuesWithDivider.dividerCount)
                : orderedValuesWithDivider.values;

            return result;
        }
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
        this.setState({ searchTerm: '' }, () => this.searchRef.focus());
    };

    showFilterSkeleton = value => {
        const regexPattern = /filters\[(Pickup|SameDay)\]=/g;
        const filterFound = regexPattern.test(value.refinementValue);

        if (!value.refinementDisplayNameAndValue && filterFound) {
            return true;
        }

        return false;
    };

    renderSearchInput = () => {
        const { title, isModal } = this.props;
        const { searchTerm, isSearchFocused } = this.state;
        const searchTitle = languageLocaleUtils.getLocaleResourceFile('components/Catalog/Filters/locales', 'Filters')('search');

        const placeholderText =
            !isModal && searchTitle.concat(title).length > 17 ? `${searchTitle} ${title.substring(0, 14)}...` : `${searchTitle} ${title}`;

        const hasSearchTerm = searchTerm.length > 0;

        return (
            <TextInput
                ref={x => (this.searchRef = x)}
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
                            aria-label={getText('clearSearch')}
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

    renderFilterItems = (hasMoreThanLimit, searchTermApplied) => {
        const {
            type, title, isModal, values, contextId, subType, isHappening, valueGrouping
        } = this.props;
        const { searchTerm, displayByAtoZ } = this.state;
        const searchBy = searchTerm.toLowerCase().replace(/\s|\./g, '');

        const filteredValues = searchTermApplied
            ? values.filter(x => x.refinementValueDisplayName.toLowerCase().replace(/\s|\./g, '').indexOf(searchBy) >= 0)
            : values;

        const processedValues =
            displayByAtoZ && !valueGrouping?.hasOrdering ? this.orderDivideAndLimit(filteredValues, !searchTermApplied) : filteredValues;

        const searchAppliedWithFilterValue = searchTermApplied ? filteredValues.length === 0 : false;

        if (searchAppliedWithFilterValue) {
            return (
                <Text
                    is='p'
                    lineHeight='tight'
                    color='gray'
                    marginTop={isModal ? 2 : 4}
                    marginBottom='.7em'
                >
                    {`${getText('noResults')}.`}{' '}
                    <Link
                        color='blue'
                        onClick={this.clearSearch}
                        padding={2}
                        margin={-2}
                        data-at={Sephora.debug.dataAt('clear')}
                        children={getText('clear')}
                    />
                </Text>
            );
        }

        let items = [];

        if (displayByAtoZ) {
            items = Object.keys(processedValues).map((letter, letterIndex) =>
                processedValues[letter] && processedValues[letter].length > 0 ? (
                    <div key={`OrderedFilter_${letter}_${letterIndex.toString()}`}>
                        <Text
                            fontWeight='bold'
                            lineHeight='tight'
                            marginTop={3}
                            display='block'
                            children={letter}
                        />
                        {processedValues[letter].map(value =>
                            this.showFilterSkeleton(value) ? (
                                <div css={[styles.skeleton, SKELETON_ANIMATION]} />
                            ) : (
                                <FilterItem
                                    key={value.refinementValueDisplayName}
                                    contextId={contextId}
                                    type={type}
                                    title={title}
                                    value={value}
                                    isModal={isModal}
                                    selected={this.filterItemIsSelected({
                                        type,
                                        ref: value,
                                        values: filteredValues,
                                        isModal
                                    })}
                                    onClick={
                                        value?.checkboxClick ? value.checkboxClick : (e, refinement) => this.onFilterSelect(refinement, !isModal)
                                    }
                                    selectFilters={this.props.selectFilters}
                                    isHappening={isHappening}
                                />
                            )
                        )}
                    </div>
                ) : null
            );
        } else if (valueGrouping?.isGrouped) {
            const groupedValues = valueGrouping.getGroupedValues(filteredValues);
            items = groupedValues
                .entries()
                .map(([filterType, groupedValue]) => {
                    const filterItems = groupedValue.map(value => (
                        <FilterItem
                            key={`${value.refinementValueDisplayName}_${value.refinementValue}`}
                            contextId={contextId}
                            type={type}
                            title={title}
                            value={value}
                            isModal={isModal}
                            selected={this.filterItemIsSelected({
                                type,
                                subType,
                                ref: value,
                                values: filteredValues,
                                isModal
                            })}
                            onClick={value?.checkboxClick ? value.checkboxClick : (e, refinement) => this.onFilterSelect(refinement, !isModal)}
                            selectFilters={this.props.selectFilters}
                            isHappening={isHappening}
                        />
                    ));

                    if (filterItems.length > 0) {
                        return (
                            <Flex flexDirection='column'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={fontSizes.sm}
                                    css={{ textTransform: 'capitalize' }}
                                    children={filterType}
                                    marginTop={2}
                                    marginBottom={2}
                                />
                                <>{filterItems}</>
                            </Flex>
                        );
                    }

                    return null;
                })
                .toArray();
        } else {
            items = processedValues?.map((value, index) =>
                value.divider ? (
                    <Divider
                        key={value.key}
                        marginY={type === COLORS ? 2 : 1}
                    />
                ) : this.showFilterSkeleton(value) ? (
                    <div
                        key={`skeleton_${index}`}
                        css={[styles.skeleton, SKELETON_ANIMATION]}
                    />
                ) : (
                    <FilterItem
                        key={`${value.refinementValueDisplayName}_${value.refinementValue}`}
                        contextId={contextId}
                        type={type}
                        title={title}
                        value={value}
                        isModal={isModal}
                        selected={this.filterItemIsSelected({
                            type,
                            subType,
                            ref: value,
                            values: filteredValues,
                            isModal
                        })}
                        onClick={value?.checkboxClick ? value.checkboxClick : (e, refinement) => this.onFilterSelect(refinement, !isModal)}
                        selectFilters={this.props.selectFilters}
                        isHappening={isHappening}
                    />
                )
            );
        }

        return items;
    };

    isExpanded = () => {
        const {
            isModal, activeItem, title, selectedValues, isExpanded
        } = this.props;
        const { expandedByUser } = this.state;

        const autoExpanded = isModal ? activeItem === title : selectedValues.length > 0 || isExpanded;

        // user defined status should take priority over auto exapnding/collapsing
        const expanded = expandedByUser !== null ? expandedByUser : autoExpanded;

        return expanded;
    };

    handleViewByAtoZ = () => {
        this.setState(prevState => ({
            displayByAtoZ: !prevState.displayByAtoZ
        }));
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            title,
            subTitle,
            subTitleHandler,
            type,
            subType,
            values,
            isModal,
            renderDivider,
            toggleModal,
            filterLimit = FILTER_LIMIT,
            withSearch = true,
            showMoreHandler,
            withoutAtoZ,
            customCTA
        } = this.props;
        const { height, searchTerm, displayByAtoZ } = this.state;
        const hasMoreThanLimit = values?.length > filterLimit;
        const expanded = this.isExpanded();

        const id = `filter_${title.toLowerCase().replace(' ', '_')}`;
        const headingId = `${id}_heading`;
        const searchTermApplied = searchTerm?.length > 1;

        const filterItems = expanded ? this.renderFilterItems(hasMoreThanLimit, searchTermApplied) : [];
        const isCustomCheckboxes = subType === CHECKBOXES_CUSTOM;
        const isShowMoreVisible = (!isModal || (isModal && isCustomCheckboxes)) && hasMoreThanLimit && !searchTermApplied && !displayByAtoZ;

        if (isCustomCheckboxes) {
            filterItems.length = filterLimit;
        }

        return (
            <fieldset>
                {renderDivider && <Divider />}
                <Link
                    ref={this.toggleRef}
                    aria-controls={id}
                    aria-expanded={expanded}
                    onClick={this.handleClick}
                    display='flex'
                    alignItems='center'
                    lineHeight='tight'
                    width='100%'
                    height={this.props.customHeight || DRAWER_TOGGLE_HEIGHT}
                    backgroundColor='white'
                    {...(isModal && {
                        paddingX: modal.paddingX,
                        css: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }
                    })}
                >
                    <Text
                        is='legend'
                        id={headingId}
                        fontWeight='bold'
                        css={{
                            textTransform: 'capitalize',
                            flex: 1
                        }}
                        children={this.props.customTitle || title}
                    />
                    <Chevron
                        isThicker={true}
                        direction={expanded ? 'up' : 'down'}
                    />
                </Link>
                <Box
                    ref={this.drawerRef}
                    id={id}
                    aria-labelledby={headingId}
                    position='relative'
                    overflow='hidden'
                    paddingX={isModal ? modal.paddingX : 1}
                    marginX={isModal || -1}
                    css={styles.drawer}
                    style={{
                        height: expanded ? height : 0,
                        visibility: expanded ? null : 'hidden'
                    }}
                    onTransitionEnd={e => {
                        // allow nested sticky elements
                        if (expanded) {
                            e.target.style.overflow = 'initial';
                        }
                    }}
                >
                    {this.props.customChild ? (
                        this.props.customChild
                    ) : (
                        <>
                            {subTitle && (
                                <Link
                                    onClick={subTitleHandler}
                                    display='flex'
                                    alignItems='center'
                                    lineHeight='tight'
                                    marginBottom={2}
                                >
                                    <Text
                                        fontWeight='bold'
                                        css={{ marginRight: space[3] }}
                                        children={subTitle}
                                    />
                                    <Chevron
                                        isThicker={true}
                                        direction='down'
                                        size='0.5em'
                                    />
                                </Link>
                            )}
                            {hasMoreThanLimit && (
                                <>
                                    {withSearch && this.renderSearchInput()}
                                    {isModal && !withoutAtoZ && (
                                        <Box
                                            backgroundColor='white'
                                            marginX={modal.outdentX}
                                            paddingX={modal.paddingX}
                                            paddingY={2}
                                            marginTop={-2}
                                            marginBottom={-1}
                                            position='sticky'
                                            top={DRAWER_TOGGLE_HEIGHT - space[4]}
                                            zIndex={1}
                                        >
                                            <Link
                                                color='blue'
                                                padding={2}
                                                margin={-2}
                                                onClick={this.handleViewByAtoZ}
                                                data-at={Sephora.debug.dataAt('modal_view_a_z_button')}
                                                children={getText(displayByAtoZ ? 'viewByRelevance' : 'viewAZ')}
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                            {expanded && isFunction(customCTA) && customCTA({ isModal, searchTerm })}
                            <div
                                css={[
                                    styles.inner,
                                    isModal && (subType ? styles.modal[subType] : styles.modal[type]),
                                    !isModal && subTitle && styles.leftPadding,
                                    id === 'filter_category' && styles.customFieldset
                                ]}
                                data-refinement={title}
                            >
                                {filterItems}
                            </div>
                            {isShowMoreVisible && (
                                <div css={styles.moreLink}>
                                    <Link
                                        data-at={Sephora.debug.dataAt('show_more_button')}
                                        onClick={() => {
                                            showMoreHandler ? showMoreHandler() : toggleModal(title);
                                        }}
                                        display='block'
                                        color='blue'
                                        lineHeight='tight'
                                        paddingTop={2}
                                        paddingLeft={subTitle ? 4 : 0}
                                        paddingBottom={4}
                                        marginBottom={-2}
                                        marginTop={-4}
                                        width='100%'
                                        children={getText('showMore')}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Box>
            </fieldset>
        );
    }
}

const styles = {
    drawer: {
        transition: 'all .3s'
    },
    inner: {
        paddingBottom: space[3]
    },
    moreLink: {
        marginTop: space[2]
    },
    leftPadding: {
        paddingLeft: space[4]
    },
    customFieldset: {
        [mediaQueries.smMax]: {
            gridTemplateColumns: '1fr !important'
        }
    },
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
    modal: {
        [CHECKBOXES]: {
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: space[4],
            [mediaQueries.sm]: {
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: space[5]
            }
        },
        [CHECKBOXES_CUSTOM]: {
            paddingLeft: space[4]
        },
        [COLORS]: {
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: space[4],
            rowGap: space[2],
            [mediaQueries.sm]: {
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: space[5]
            }
        },
        [RANGE]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: space[2]
        }
    },
    skeleton: { height: 40.5, marginBottom: 10 }
};

FilterGroup.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    showMoreHandler: PropTypes.func,
    withoutAtoZ: PropTypes.bool,
    valueGrouping: PropTypes.object,
    customCTA: PropTypes.func
};

export default wrapComponent(FilterGroup, 'FilterGroup', true);
