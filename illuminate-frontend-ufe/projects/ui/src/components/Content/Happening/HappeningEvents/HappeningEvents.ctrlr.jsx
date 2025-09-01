/* eslint-disable camelcase */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import {
    Grid, Text, Box, Flex, Button
} from 'components/ui';
import Card from 'components/Card';
import { space } from 'style/config';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import mediaUtils from 'utils/Media';
import RegularFilters from 'components/Catalog/Filters';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
import catalogUtils from 'utils/Catalog';
import Loader from 'components/Loader/Loader';
import happeningFilters from 'utils/happeningFilters';
import FilterChiclets from 'components/Catalog/Filters/FilterChiclets';

const Filters = withUpperFunnelProps(RegularFilters);
const { Media } = mediaUtils;
const {
    getLocationRefinements,
    getAppliedFilterGroupByKey,
    getAppliedSortOptionName,
    getSelectedOrDefaultSortOptionValue,
    FILTERS_KEY,
    sortRefinements,
    dateRefinements,
    emptyFilters,
    getCategoryRefinements
} = happeningFilters;

class HappeningEvents extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: emptyFilters,
            appliedFilters: props.appliedFilters,
            page: 1,
            perPage: Sephora.isMobile() ? 6 : 9,
            isOpenFilterModal: false
        };
    }

    componentDidUpdate(_prevProps, _prevState) {
        const { appliedFilters: currentAppliedFilters } = this.state;
        const { appliedFilters } = this.props;

        if (JSON.stringify(appliedFilters) !== JSON.stringify(currentAppliedFilters)) {
            this.setState({ selectedFilters: appliedFilters, appliedFilters });
        }
    }

    componentWillUnmount() {
        this.props.resetFiltersToDefault();
    }

    selectFilters = (filtersToSelect, applyFilters = false) => {
        const newSelectedFilters = catalogUtils.addToSelection(this.state.selectedFilters, filtersToSelect);
        this.applySelectionIfChanged(newSelectedFilters, applyFilters);
    };

    applySelectionIfChanged = (newSelectedFilters, applyFilters = false) => {
        const { selectedFilters: currentSelectedFilters } = this.state;

        if (JSON.stringify(newSelectedFilters) !== JSON.stringify(currentSelectedFilters)) {
            this.setState(
                {
                    selectedFilters: newSelectedFilters
                },
                () => {
                    if (applyFilters) {
                        this.applySelectedFilters();
                    }
                }
            );
        }
    };

    discardSelection = (applyFilters = false) => {
        this.applySelectionIfChanged(this.state.appliedFilters, applyFilters);
    };

    clearFiltersSelection = () => {
        this.applySelectionIfChanged(emptyFilters, true);
    };

    clearAllFilters = () => {
        this.applySelectionIfChanged(emptyFilters, true);
    };

    applySelectedFilters = () => {
        const { selectedFilters } = this.state;
        const { appliedFilters, currentLocation } = this.props;
        const { display, storeId } = currentLocation;

        if (JSON.stringify(selectedFilters) !== JSON.stringify(appliedFilters)) {
            this.props.getFilteredEvents({ appliedFilters: selectedFilters, zipCode: display, storeId, discard: this.discardSelection });
        }
    };

    removeFilterValue = (filterKey, filterValue) => {
        const newSelectedFilters = catalogUtils.removeValueFromSelection(this.state.selectedFilters, filterKey, filterValue);
        this.applySelectionIfChanged(newSelectedFilters, true);
    };

    showMoreEvents = () => {
        const newPage = this.state.page + 1;
        this.setState({
            page: newPage
        });
    };

    onToggleFiltersModal = isOpen => {
        if (!isOpen) {
            this.setState({ isOpenFilterModal: isOpen });
        }
    };

    handleOpenFilterModal = () => {
        this.setState({ isOpenFilterModal: true });
    };

    render() {
        const {
            items,
            localization,
            appliedFilters,
            isLoading,
            storesList,
            refinements,
            currentLocation,
            showLocationAndStores,
            customStyles = {}
        } = this.props;

        const { page, perPage, isOpenFilterModal } = this.state;
        const cards = items.slice(0, perPage * page);

        const isShowMoreVisible = items.length > perPage && cards.length < items.length;
        const isAdjustFiltersVisible = items.length < 4;
        const isNoItems = items.length === 0;
        const isTryChangeFiltersVisible = isAdjustFiltersVisible && !isNoItems;

        const options = sortRefinements.values.map(item => ({
            onClick: () => this.selectFilters({ [FILTERS_KEY.SORT]: [item.refinementValue] }, true),
            isActive: item.refinementValue === getSelectedOrDefaultSortOptionValue(sortRefinements.values, appliedFilters[FILTERS_KEY.SORT][0]),
            children: item.refinementValueDisplayName
        }));

        const locationRefinements = getLocationRefinements(storesList, currentLocation.display, showLocationAndStores);
        const categoryRefinementsList = getCategoryRefinements(refinements);
        const refinementsList = [sortRefinements, categoryRefinementsList, locationRefinements, dateRefinements];

        const renderFilterChiclets = (
            <FilterChiclets
                refinements={[refinementsList[1], refinementsList[2]]}
                filters={getAppliedFilterGroupByKey(appliedFilters, [FILTERS_KEY.CATEGORY, FILTERS_KEY.LOCATION_AND_STORES])}
                onRemoveChiclet={this.removeFilterValue}
                onClearAllFilters={this.clearAllFilters}
                isHappening
            />
        );

        return (
            <>
                <Grid
                    marginTop={[4, 4, 6]}
                    columns={['1fr', '1fr', 'auto 1fr']}
                    gap={[null, null, 8]}
                >
                    <Box css={styles.filtersContainer}>
                        <Filters
                            pageId={''}
                            contextId={''}
                            selectedFilters={this.state.selectedFilters}
                            appliedFilters={appliedFilters}
                            refinements={refinementsList}
                            selectFilters={this.selectFilters}
                            discardSelection={this.discardSelection}
                            clearFiltersSelection={this.clearFiltersSelection}
                            applySelectedFilters={this.applySelectedFilters}
                            removeFilterValue={this.removeFilterValue}
                            isOpenModal={isOpenFilterModal}
                            onToggleFiltersModal={this.onToggleFiltersModal}
                            withModalChiclets={false}
                            isHappening={!!categoryRefinementsList?.values?.length}
                        />
                    </Box>
                    <Box>
                        <Media greaterThan='sm'>
                            <Flex
                                alignItems='center'
                                marginBottom={2}
                            >
                                {renderFilterChiclets}
                            </Flex>
                        </Media>
                        <Flex
                            alignItems='center'
                            justifyContent='space-between'
                            marginBottom={2}
                        >
                            <Text
                                is='p'
                                color='gray'
                                lineHeight='tight'
                                marginTop={[4, 4, 0]}
                            >
                                {isNoItems
                                    ? `0 ${localization.of} 0 ${localization.results}`
                                    : `1-${cards.length} ${localization.of} ${items.length} ${localization.results}`}
                            </Text>
                            <Media greaterThan='sm'>
                                <ActionMenu
                                    id='events-sort'
                                    align='right'
                                    options={options}
                                >
                                    {localization.sortBy}: <b>{getAppliedSortOptionName(appliedFilters, sortRefinements)}</b>
                                </ActionMenu>
                            </Media>
                        </Flex>
                        <Media lessThan='sm'>{renderFilterChiclets}</Media>
                        {isNoItems ? (
                            <>
                                <Text
                                    is='p'
                                    marginTop={5}
                                >
                                    {localization.noEventsMessage}
                                </Text>
                                <Button
                                    children={localization.changeLocation}
                                    variant='secondary'
                                    marginTop={6}
                                    paddingLeft={3}
                                    paddingRight={3}
                                    minHeight={32}
                                    width={126}
                                    size='sm'
                                    onClick={this.props.showLocationAndStores}
                                />
                            </>
                        ) : (
                            <Grid
                                columns={['1fr', 'repeat(3, 1fr)']}
                                marginTop={2}
                                gap={`${space[6]}px ${space[5]}px`}
                            >
                                {cards.map((item, index) => (
                                    <Card
                                        parentPageType={'happening'}
                                        customStyles={customStyles.card}
                                        {...item}
                                        key={`${index}_${item.sid}`}
                                        eventType={'event'}
                                    />
                                ))}
                            </Grid>
                        )}

                        {isShowMoreVisible && (
                            <Button
                                children={localization.showMoreEvents}
                                variant='secondary'
                                marginTop={'40px'}
                                paddingLeft={5}
                                paddingRight={5}
                                minHeight={44}
                                width={['100%', '175px']}
                                size='sm'
                                onClick={this.showMoreEvents}
                            />
                        )}

                        {isTryChangeFiltersVisible && (
                            <Text
                                is='p'
                                marginTop={[6, '40px']}
                            >
                                {localization.tryChangeFilters}
                            </Text>
                        )}

                        <Media lessThan='sm'>
                            {isAdjustFiltersVisible && (
                                <Button
                                    children={localization.adjustFilters}
                                    variant='secondary'
                                    marginTop={4}
                                    paddingLeft={5}
                                    paddingRight={5}
                                    size='sm'
                                    onClick={this.handleOpenFilterModal}
                                />
                            )}
                        </Media>
                    </Box>
                </Grid>
                {isLoading && (
                    <Loader
                        isShown={true}
                        isFixed={true}
                        style={{ zIndex: 'var(--layer-max)' }}
                    />
                )}
            </>
        );
    }
}

const styles = {
    filtersContainer: {
        minWidth: 190,
        '& h2': {
            marginTop: 0
        }
    }
};

HappeningEvents.propTypes = {
    hugWidth: PropTypes.bool,
    isHugWidth: PropTypes.bool,
    context: PropTypes.oneOf(['Container']),
    enablePageRenderTracking: PropTypes.bool,
    items: PropTypes.array,
    localization: PropTypes.object,
    appliedFilters: PropTypes.object,
    isLoading: PropTypes.bool,
    storesList: PropTypes.array,
    currentLocation: PropTypes.object
};

HappeningEvents.defaultProps = {
    hugWidth: false,
    isHugWidth: false,
    context: 'Container',
    enablePageRenderTracking: false,
    items: [],
    appliedFilters: [],
    storesList: [],
    isLoading: false
};

export default wrapComponent(HappeningEvents, 'HappeningEvents', true);
