/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import mediaUtils from 'utils/Media';
import {
    Flex, Button, Link, Text, Divider, Box
} from 'components/ui';
import FilterGroup from 'components/Catalog/Filters/FilterGroup/FilterGroup';
import FilterPills from 'components/Catalog/Filters/FilterPills';
import FilterChiclets from 'components/Catalog/Filters/FilterChiclets';
import BeautyPreferencesFilter from 'components/Catalog/Filters/Custom/BeautyPreferencesFilter/BeautyPreferencesFilter';
import Categories from 'components/Catalog/Categories';
import SearchCategories from 'components/Catalog/Search/SearchCategories';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/Filters/locales', 'Filters');
import { REFINEMENT_TYPES } from 'utils/CatalogConstants';
import catalogUtils from 'utils/Catalog';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import { mediaQueries, colors } from 'style/config';
import { DebouncedScroll } from 'constants/events';
import Location from 'utils/Location';

const { Media } = mediaUtils;
const SCROLL_DEADZONE = 20;
const SELECTED_OPTIONS = {
    parameter: 'isSelected',
    value: true
};

class Filters extends BaseClass {
    state = {
        showModal: false,
        activeItem: null,
        withShadow: false,
        lastScrollY: 0,
        pastFilterBar: false
    };

    pillScrollRef = React.createRef();
    sentinelRef = React.createRef();

    handlerScroll = () => {
        const { targetShadowScrollY, showDynamicStickyFilter, setFilterBarVisibility, filterBarHidden } = this.props;

        const { lastScrollY, withShadow, pastFilterBar } = this.state;

        const currentScrollY = window.pageYOffset;
        const shouldHaveShadow = currentScrollY > targetShadowScrollY;

        if (withShadow !== shouldHaveShadow) {
            this.setState({ withShadow: shouldHaveShadow });
        }

        if (!showDynamicStickyFilter) {
            return;
        }

        const sentinel = this.sentinelRef.current;

        if (sentinel) {
            const rect = sentinel.getBoundingClientRect();
            const isPastFilterBar = rect.top < 0;

            if (pastFilterBar !== isPastFilterBar) {
                this.setState({ pastFilterBar: isPastFilterBar });
            }
        }

        const scrollDelta = currentScrollY - lastScrollY;
        const scrollingUpEnough = scrollDelta < -SCROLL_DEADZONE;
        const scrollingDownEnough = scrollDelta > SCROLL_DEADZONE;

        let nextSlideHidden = filterBarHidden;

        if (pastFilterBar && scrollingDownEnough) {
            nextSlideHidden = true;
        } else if (pastFilterBar && scrollingUpEnough) {
            nextSlideHidden = false;
        }

        if (nextSlideHidden !== filterBarHidden || lastScrollY !== currentScrollY) {
            this.setState({
                lastScrollY: currentScrollY
            });

            if (pastFilterBar && setFilterBarVisibility) {
                setFilterBarVisibility(nextSlideHidden);
            }
        }
    };

    componentWillUnmount() {
        window.removeEventListener(DebouncedScroll, this.handlerScroll);
    }

    toggleModalTracking = ({ activeItem = '' }) => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageType: anaConsts.PAGE_TYPES.FILTERS_MODAL,
                pageTypeDetail: anaConsts.EVENT_NAMES.SEARCH.MEGA_FILTER,
                filter: activeItem.toLowerCase()
            }
        });
    };

    toggleModal = (activeItem, discardDraft) => {
        const { showModal } = this.state;
        const nextShowModal = !showModal;

        if (!showModal) {
            this.toggleModalTracking({ activeItem });
        }

        this.setState(
            {
                showModal: nextShowModal,
                activeItem
            },
            () => {
                this.props.updateFiltersModalState(nextShowModal, discardDraft);
                this.props.onToggleFiltersModal(nextShowModal);
            }
        );
    };

    handleClearAll = () => {
        const { clearFiltersSelection } = this.props;
        clearFiltersSelection(false, true);
    };

    showResultsClickTracking = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: anaConsts.EVENT_NAMES.SEARCH.SHOW_RESULTS,
                actionInfo: anaConsts.EVENT_NAMES.SEARCH.SHOW_RESULTS
            }
        });
    };

    handleApplyClick = () => {
        const { applySelectedFilters, selectedFilters, upperFunnelQueue } = this.props;
        let executePendingTasks = Promise.resolve();

        if (upperFunnelQueue.count() > 0) {
            // Remove pending task from the queue if filter associated is not selected.
            const pendingTasksIds = upperFunnelQueue.getIds();

            for (const taskId of pendingTasksIds) {
                const selected = catalogUtils.isFilterSelected(selectedFilters, taskId);

                if (!selected) {
                    upperFunnelQueue.remove(taskId);
                }
            }

            executePendingTasks = upperFunnelQueue.run();
        }

        executePendingTasks.then(() => {
            this.showResultsClickTracking();
            applySelectedFilters();
            this.toggleModal(undefined, true);
        });
    };

    handleCloseClick = () => {
        const { discardSelection } = this.props;
        discardSelection();
        this.toggleModal(undefined, true);
    };

    componentDidMount() {
        if (this.props.shouldStickySideBar) {
            window.addEventListener(DebouncedScroll, this.handlerScroll, { passive: true });
        }
    }

    componentDidUpdate(prevProps) {
        const scrollArea = this.pillScrollRef.current;

        if (scrollArea) {
            if (prevProps.pageId !== this.props.pageId || prevProps.contextId !== this.props.contextId) {
                scrollArea.scrollLeft = 0;
            }

            if (!this.state.showModal && scrollArea.contains(document.activeElement)) {
                const activePill = document.activeElement;

                const { right, width, left } = activePill.getBoundingClientRect();
                const scrollRect = scrollArea.getBoundingClientRect();

                // center active pill if not more than half visible

                const isPillVisible = left <= scrollRect.left ? scrollRect.left - left <= width / 2 : right - scrollRect.right <= width / 2;

                if (!isPillVisible) {
                    scrollArea.scrollLeft = activePill.offsetLeft - scrollRect.width / 2 + width / 2;
                }
            }
        }

        if (this.props.isOpenModal && !prevProps.isOpenModal) {
            this.toggleModal(undefined, false);
        }
    }

    hasSubCategories(isNthCategoryPage, currentCategory) {
        const { categories, categoriesProps } = this.props;

        return !!(
            (isNthCategoryPage && categoriesProps && currentCategory?.subCategories?.length > 0) ||
            currentCategory?.subCategories?.length > 0 ||
            categories?.length > 1 ||
            categoriesProps?.categories?.length > 1
        );
    }

    renderFilterGroups = isModal => {
        const {
            refinements, pageId, contextId, selectFilters, selectedFilters, appliedFilters, isHappening, userInfo, categorySpecificMasterList
        } =
            this.props;

        const { activeItem } = this.state;
        const appliedOrSelectedFilters = isModal ? selectedFilters : appliedFilters;

        const filteredRefinements = isModal ? refinements : refinements.filter(x => x.type !== REFINEMENT_TYPES.SORT);

        const filterGroups = filteredRefinements.map((refinement, index) => {
            // Complex Filter types
            // Contract is that it must return FilterGroup Internally.
            // When it returns selectable boxes or radios, must hook into the selection logic
            if (refinement.type === 'beautyPreferences') {
                return (
                    <BeautyPreferencesFilter
                        key={refinement.displayName}
                        // Doesnt do anything ?
                        expanded={refinement.expanded}
                        activeItem={activeItem}
                        isModal={isModal}
                        pageId={pageId}
                        contextId={contextId}
                        renderDivider={index > 0}
                        title={refinement.displayName}
                        subTitle={refinement.subTitle}
                        subTitleHandler={refinement.subTitleHandler}
                        isExpanded={refinement.isExpanded}
                        type={refinement.type}
                        subType={refinement.subType}
                        values={refinement.values}
                        toggleModal={this.toggleModal}
                        selectFilters={selectFilters}
                        selectedValues={appliedOrSelectedFilters[refinement.displayName] || []}
                        allSelectedValuesByKey={selectedFilters}
                        showMoreHandler={refinement.showMoreHandler}
                        withoutAtoZ={refinement.withoutAtoZ}
                        isHappening={isHappening}
                        userInfo={userInfo}
                        categorySpecificMasterList={categorySpecificMasterList}
                    />
                );
            }

            return (
                <FilterGroup
                    key={refinement.displayName}
                    expanded={refinement.expanded}
                    activeItem={activeItem}
                    isModal={isModal}
                    pageId={pageId}
                    contextId={contextId}
                    renderDivider={index > 0}
                    title={refinement.displayName}
                    subTitle={refinement.subTitle}
                    subTitleHandler={refinement.subTitleHandler}
                    isExpanded={refinement.isExpanded}
                    type={refinement.type}
                    subType={refinement.subType}
                    values={refinement.values}
                    toggleModal={this.toggleModal}
                    selectFilters={selectFilters}
                    selectedValues={appliedOrSelectedFilters[refinement.displayName] || []}
                    filterLimit={refinement.filterLimit}
                    withSearch={refinement.withSearch}
                    showMoreHandler={refinement.showMoreHandler}
                    withoutAtoZ={refinement.withoutAtoZ}
                    isHappening={isHappening}
                />
            );
        });

        return filterGroups;
    };

    render() {
        const {
            refinements,
            selectedFilters,
            selectFilters,
            removeFilterValue,
            preferredZipCode,
            preferredStore,
            withModalChiclets = true,
            showCompactPills,
            shouldStickySideBar,
            showDynamicStickyFilter,
            filterBarHidden,
            showNthCategoryChicletsInFilter,
            categoriesProps,
            categories
        } = this.props;

        if (!refinements || refinements.length <= 0) {
            return null;
        }

        const { activeItem } = this.state;

        const selectedFiltersCount = catalogUtils.getSelectedFiltersCount(refinements, selectedFilters);
        const isNthCategoryPage = Location.isNthCategoryPage();
        const isSearchPage = Location.isSearchPage();
        const isSalePage = Location.isSalePage();
        const showSearchCategories = isSearchPage && !isSalePage;
        const currentCategory = catalogUtils.getCategoryInfoFromCategories(categories || categoriesProps, SELECTED_OPTIONS) || {};
        const isNotLastLevel = this.hasSubCategories(isNthCategoryPage, currentCategory);

        return (
            <>
                <Media
                    lessThan='md'
                    css={[shouldStickySideBar && styles.sticky, showDynamicStickyFilter && (filterBarHidden ? styles.slideUp : styles.slideDown)]}
                >
                    <FilterPills
                        showCompactPills={showCompactPills}
                        pillScrollRef={this.pillScrollRef}
                        activeItem={activeItem}
                        refinements={refinements}
                        selectedFilters={selectedFilters}
                        selectFilters={selectFilters}
                        removeFilterValue={removeFilterValue}
                        preferredZipCode={preferredZipCode}
                        preferredStoreName={preferredStore?.preferredStoreName}
                        preferredStoreId={preferredStore?.preferredStoreInfo?.storeId}
                        toggleModal={this.toggleModal}
                        filterShadow={{ ...(this.state.withShadow && styles.filterShadow) }}
                    />
                </Media>
                {showDynamicStickyFilter && (
                    <Media lessThan='md'>
                        <div
                            ref={this.sentinelRef}
                            style={{ height: 0, width: '100%' }}
                        />
                    </Media>
                )}
                <Media greaterThan='sm'>
                    <Text
                        is='h2'
                        lineHeight='tight'
                        fontSize='sm'
                        marginTop={6}
                        color='gray'
                        children={getText('filters')}
                    />
                    {this.renderFilterGroups(false)}
                    <Divider />
                </Media>
                <Modal
                    width={3}
                    isDrawer={true}
                    isOpen={this.state.showModal}
                    onDismiss={this.handleCloseClick}
                    hasBodyScroll={true}
                >
                    <Modal.Header>
                        <Modal.Title children={getText('modalTitle')} />
                    </Modal.Header>
                    <Modal.Body
                        paddingX={null}
                        paddingTop={null}
                        paddingBottom={null}
                    >
                        {showNthCategoryChicletsInFilter && isNotLastLevel && !isSalePage && (
                            <>
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    color={colors.gray}
                                    paddingTop={4}
                                    paddingX={4}
                                    children={getText('jumpTo')}
                                />
                                <Box
                                    display='flex'
                                    paddingX={4}
                                    paddingY={2}
                                >
                                    {showSearchCategories ? <SearchCategories categories={categories} /> : <Categories {...categoriesProps} />}
                                </Box>
                            </>
                        )}
                        {this.renderFilterGroups(true)}
                    </Modal.Body>
                    <Modal.Footer>
                        {withModalChiclets && (
                            <FilterChiclets
                                isModal={true}
                                refinements={refinements}
                                filters={selectedFilters}
                                onRemoveChiclet={removeFilterValue}
                            />
                        )}
                        <Flex
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            <Link
                                data-at={Sephora.debug.dataAt('modal_clear_all_button')}
                                padding={2}
                                margin={-2}
                                color='blue'
                                children={getText('clearAll')}
                                onClick={this.handleClearAll}
                            />
                            <Button
                                data-at={Sephora.debug.dataAt('modal_show_results_button')}
                                variant='primary'
                                hasMinWidth={true}
                                children={`${getText('showResults')}  ${selectedFiltersCount > 0 ? `(${selectedFiltersCount})` : ''}`}
                                onClick={this.handleApplyClick}
                            />
                        </Flex>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const styles = {
    sticky: {
        [mediaQueries.xsMax]: {
            position: 'sticky',
            top: 54,
            zIndex: 99,
            paddingTop: 10,
            background: 'white'
        }
    },
    slideUp: {
        [mediaQueries.xsMax]: {
            transform: 'translateY(-110%)',
            transition: 'transform .3s ease-in-out'
        }
    },
    slideDown: {
        [mediaQueries.xsMax]: {
            transform: 'translateY(-5%)',
            transition: 'transform 0.3s ease-in-out'
        }
    },
    filterShadow: {
        [mediaQueries.xsMax]: {
            backgroundColor: 'white',
            boxShadow: '0px 5px 5px 0px  rgba(0, 0, 0, 0.2)',
            paddingBottom: 10
        }
    }
};

Filters.propTypes = {
    updateFiltersModalState: PropTypes.func,
    showMoreHandler: PropTypes.func,
    isOpenModal: PropTypes.bool,
    withModalChiclets: PropTypes.bool,
    onToggleFiltersModal: PropTypes.func,
    shouldStickySideBar: PropTypes.bool,
    targetShadowScrollY: PropTypes.number,
    showCompactPills: PropTypes.bool
};

Filters.defaultProps = {
    updateFiltersModalState: () => {},
    onToggleFiltersModal: () => {},
    isHappening: false,
    shouldStickySideBar: false,
    targetShadowScrollY: 280,
    showCompactPills: false
};

export default wrapComponent(Filters, 'Filters', true);
