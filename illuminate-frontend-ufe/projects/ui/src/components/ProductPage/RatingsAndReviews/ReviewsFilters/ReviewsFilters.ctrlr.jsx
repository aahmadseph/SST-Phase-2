/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { mediaQueries, modal, space, colors } from 'style/config';
import { Grid, Link, Box, Icon } from 'components/ui';
import Filter from 'components/ProductPage/Filters/Filter/Filter';
// Temp removal as per AC1 in https://jira.sephora.com/browse/INFL-642
import ReviewsFiltersBreadcrumbs from 'components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFiltersBreadcrumbs';
import store from 'store/Store';
import ProductActions from 'actions/ProductActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import Pill from 'components/Pill';
import RadioFilter from 'components/ProductPage/Filters/FilterTypes/RadioFilter';
import ShadeFilter from 'components/ProductPage/Filters/FilterTypes/ShadeFilter';
import CheckboxImageFilter from 'components/ProductPage/Filters/FilterTypes/CheckboxImageFilter';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import StarRating from 'components/StarRating/StarRating';
import skuUtils from 'utils/Sku';
import UI from 'utils/UI';
import TextInput from 'components/Inputs/TextInput/TextInput';
import NonIncentivizedTooltip from 'components/ProductPage/RatingsAndReviews/ReviewsFilters/NonIncentivizedTooltip';
import BeautyPreferencesFilter from 'components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyPreferencesFilter';
import userUtils from 'utils/User';
import productUtils from 'utils/product';

import localeUtils from 'utils/LanguageLocale';
import skuHelpers from 'utils/skuHelpers';
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ReviewsFilters/locales', 'ReviewsFilters');

const FILTER_GAP = 6;

const AGE_RANGE_FILTER_ID = 'ageRange';
const AGE_RANGE_13_TO_17_FILTER_ID = '13-17';
const BP_FILTER_ID = 'beautyPreference';
const BP_FILTERS_IDS = [
    'skinType',
    'skinConcerns',
    'skinTone',
    'eyeColor',
    'ageRange',
    'hairColor',
    'hairType',
    'hairConcerns',
    'hairTexture',
    'fragrancePreferences'
];

class ReviewsFilters extends BaseClass {
    state = {
        selectedFilters: {},
        bvFilters: [],
        skuAggregatedList: (this.props.currentProduct.regularChildSkus || []).concat(this.props.currentProduct.onSaleChildSkus || []),
        isSearch: false,
        selectedSentiment: '',
        bpFilterSelected: false
    };

    inputRef = React.createRef();
    filterRef = React.createRef();
    portalRef = React.createRef();

    removeFilter = (filterKey, filterValue) => {
        const { selectedFilters } = this.state;
        const newSelectedFilters = { ...selectedFilters };
        newSelectedFilters[filterKey] = selectedFilters[filterKey].filter(item => item !== filterValue);
        this.applyFilters(newSelectedFilters);
    };

    applyFilters = (filtersToApply = {}, scrollToFilters, isBPSelected = false) => {
        const { selectedFilters: currentFilters, selectedSentiment: selectedSentiment } = this.state;

        if (selectedSentiment !== '') {
            return;
        }

        const filterKeys = Object.keys(filtersToApply);
        const newSelectedFilters = { ...currentFilters };

        for (const filterKey of filterKeys) {
            const filterValue = filtersToApply[filterKey];
            newSelectedFilters[filterKey] = filterValue;

            // If the filter value is empty remove the node
            if (filterValue && !filterValue.length) {
                delete newSelectedFilters[filterKey];
            }
        }

        const newFiltersAdded = JSON.stringify(newSelectedFilters) !== JSON.stringify(currentFilters);

        // Do not call api if the filters are exactly the same
        if (newFiltersAdded) {
            this.setState(
                {
                    selectedFilters: newSelectedFilters,
                    bpFilterSelected: isBPSelected
                },
                () => {
                    store.dispatch(ProductActions.applyReviewFilters(Object.assign({}, this.state.selectedFilters)));

                    if (scrollToFilters) {
                        UI.scrollTo({ ref: this.filterRef });
                    }
                }
            );

            if (Object.keys(newSelectedFilters).length !== 0) {
                this.fireAnalytics(newSelectedFilters, isBPSelected);
            }
        }
    };

    applyBPFilters = (filtersToApply = {}) => {
        const { bpFilterSelected } = this.state;
        const newFiltersToApply = { ...filtersToApply };

        if (bpFilterSelected) {
            const filterKeys = Object.keys(filtersToApply);

            for (const filterKey of filterKeys) {
                newFiltersToApply[filterKey] = [];
            }
        }

        this.applyFilters(newFiltersToApply, false, !bpFilterSelected);
    };

    fireAnalytics = (selectedFilters, isBPSelected = false) => {
        const selections = [];

        for (const key in selectedFilters) {
            if (Object.prototype.hasOwnProperty.call(selectedFilters, key)) {
                selections.push(key.replace(/([A-Z])/g, ' $1').toLowerCase() + '=' + selectedFilters[key].join(','));
            }
        }

        const filterSelections = isBPSelected ? 'your beauty preferences=Your Beauty Preferences' : selections.join('|');

        if (selections.length > 0) {
            const actionLink = 'reviews:ratings&reviews-filter';
            const eventData = {
                data: {
                    filterSelections: filterSelections,
                    selectedFilter: filterSelections,
                    actionInfo: actionLink,
                    linkName: actionLink,
                    eventStrings: anaConsts.Event.EVENT_71
                }
            };

            processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);
        }
    };

    fireEmptyBPAnalytics = () => {
        const categoryName = productUtils.findProductRootParentCategoryName(this.props.currentProduct.parentCategory);
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `reviews:ratings&reviews-BP not saved:${categoryName.toLowerCase()}:*`
            }
        });
    };

    componentDidMount() {
        store.watchAction(ProductActions.TYPES.REVIEW_FILTERS_SELECTED, data => {
            if (data && data.filters) {
                this.applyFilters(data.filters, true);
            }
        });

        store.watchAction(ProductActions.TYPES.UPDATE_HIGHLIGHTED_REVIEWS, data => {
            if (data && data.highlightedReviews) {
                this.state.selectedSentiment = data.highlightedReviews.selectedSentiment || '';
            }
        });

        store.watchAction(ProductActions.TYPES.REMOVE_HIGHLIGHTED_REVIEWS, () => {
            this.state.selectedSentiment = '';
        });
    }

    componentDidUpdate = prevProps => {
        if ((this.props.isSearchPerformed && Object.keys(this.state.selectedFilters).length !== 0) || this.props.productId !== prevProps.productId) {
            this.resetFilters();
            this.setState({ isSearch: false });

            if (this.inputRef.current) {
                this.inputRef.current.value = '';
            }
        }
    };

    handleSearchSubmit = e => {
        const { productId } = this.props;

        e && e.preventDefault();
        const keyword = this.inputRef.current.getValue().trim();

        if (keyword === '') {
            return;
        }

        store.dispatch(ProductActions.applyReviewsSearch(productId, keyword));
    };

    resetFilters = () => {
        this.setState(
            {
                selectedFilters: {},
                bpFilterSelected: false
            },
            () => {
                store.dispatch(ProductActions.applyReviewFilters(Object.assign({}, this.state.selectedFilters)));
            }
        );
    };

    renderTriggerPill = ({ isActive, title, isSmall }) => {
        return (
            <Pill
                data-at={Sephora.debug.dataAt(`filter_pill${isSmall ? '_small' : ''}`)}
                isActive={isActive}
                fontSize='sm'
                hasArrow={true}
            >
                {title}
            </Pill>
        );
    };

    renderContent = (filterConfiguration, contentProps) => {
        // render special content for sku filter
        if (filterConfiguration.id === 'sku') {
            const { onClick, isSelected, isModal } = contentProps;
            const { skuAggregatedList } = this.state;
            const { currentProduct } = this.props;
            const { regularChildSkus, swatchType } = currentProduct;
            const colorMatchSku = skuHelpers.getColorIQMatchSku(regularChildSkus);
            const showColorMatch = skuUtils.showColorIQOnPPage(currentProduct) ? colorMatchSku : false;
            const colorMatchSkuId = showColorMatch && showColorMatch.skuId;
            const hasScrollMenu = skuAggregatedList.length > 8;
            const filterList = skuAggregatedList.map(sku => {
                const { skuId, smallImage, variationValue } = sku;
                const label = `${sku.variationValue || ''} ${sku.variationDesc ? `- ${sku.variationDesc}` : ''}`;

                return (
                    <ShadeFilter
                        key={`${skuId}_${variationValue}`}
                        label={label}
                        value={skuId}
                        image={smallImage}
                        onClick={onClick}
                        sku={sku}
                        swatchType={swatchType}
                        isColorMatch={colorMatchSkuId === skuId}
                        isSelected={isSelected(skuId)}
                    />
                );
            });

            return isModal ? (
                filterList
            ) : (
                <Box
                    {...(hasScrollMenu && {
                        maxHeight: 400,
                        overflowY: 'auto',
                        paddingBottom: 3,
                        marginBottom: -3,
                        marginRight: 2
                    })}
                >
                    {filterList}
                </Box>
            );
        }

        // Render generic options based on filter type
        return filterConfiguration.options.map(option => {
            const { onClick, isSelected } = contentProps;
            const label =
                filterConfiguration.optionType === 'star' ? (
                    <React.Fragment>
                        <StarRating
                            size='1em'
                            rating={parseInt(option.value)}
                        />
                        <span
                            css={styles.ratingLabel}
                            children={`${option.value} ${getText('star')}`}
                        />
                    </React.Fragment>
                ) : (
                    option.value
                );

            const renderedOption =
                filterConfiguration.type === 'singleSelect' ? (
                    <RadioFilter
                        key={option.value}
                        label={label}
                        value={option.value}
                        onClick={onClick}
                        isSelected={isSelected(option.value)}
                    />
                ) : filterConfiguration.type === 'multiSelect' && filterConfiguration.optionType === 'withImage' ? (
                    <CheckboxImageFilter
                        key={option.value}
                        label={option.value}
                        value={option.value}
                        image={`/img/ufe/rich-profile/${filterConfiguration.id.toLowerCase()}-${option.bvValue.toLowerCase()}.png`} // TODO: fix this dirty hack for image
                        onClick={onClick}
                        isSelected={isSelected(option.value)}
                    />
                ) : filterConfiguration.type === 'multiSelect' ? (
                    <Checkbox
                        key={option.value}
                        checked={isSelected(option.value)}
                        value={option.value}
                        onClick={() => onClick(option.value)}
                        paddingY={3}
                        paddingX={[modal.paddingX[0], 4]}
                        baseCss={{
                            outline: 0,
                            transition: 'background-color .2s',
                            '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
                        }}
                        children={option.value}
                    />
                ) : null;

            return renderedOption;
        });
    };

    renderFilter = filterConfiguration => {
        const filterId = filterConfiguration.id;
        const { selectedFilters, skuAggregatedList, bpFilterSelected } = this.state;
        let filterIsSelected = !!selectedFilters[filterId];
        const isSingleSelect = filterConfiguration.type === 'singleSelect';

        // mark filters related to beauty preferences as unselected if BP filter was selected
        if (bpFilterSelected && BP_FILTERS_IDS.includes(filterId)) {
            filterIsSelected = false;
        }

        // Temp removal of BeautyMatchFilter as per AC1 in https://jira.sephora.com/browse/INFL-642
        // render special controll for a Beauty Matches filter
        if (filterId === 'beautyMatches') {
            return null;
        }

        if (filterId === AGE_RANGE_FILTER_ID) {
            filterConfiguration.options = filterConfiguration.options.filter(opt => opt.value !== AGE_RANGE_13_TO_17_FILTER_ID);
        }

        // in case of one option we can just render pill instead of filter dropdown
        if (isSingleSelect && filterConfiguration.options.length === 1) {
            const valueToApply = filterIsSelected ? [] : [filterConfiguration.options[0].value];

            return (
                <Pill
                    data-at={Sephora.debug.dataAt('filter_pill')}
                    isActive={filterIsSelected}
                    fontSize='sm'
                    onClick={() => this.applyFilters({ [filterId]: valueToApply })}
                >
                    {filterConfiguration.options[0].value}
                    {filterId === 'nonIncentivizedReviews' ? <NonIncentivizedTooltip isActive={filterIsSelected} /> : null}
                </Pill>
            );
        }

        if (filterId === BP_FILTER_ID) {
            const categoryName = productUtils.findProductRootParentCategoryName(this.props.currentProduct.parentCategory).toLowerCase();

            return (
                <BeautyPreferencesFilter
                    filterIsSelected={bpFilterSelected}
                    filterId={BP_FILTER_ID}
                    categoryId={this.props.categoryId}
                    categoryName={categoryName}
                    reviewFilters={this.props.filtersConfiguration}
                    applyFilters={this.applyBPFilters}
                    fireAnalytics={this.fireEmptyBPAnalytics}
                />
            );
        }

        return (
            <Filter
                {...(filterId === 'sku' && {
                    width: 580
                })}
                id={`custom_${filterId}`}
                name={filterId}
                isSingleSelection={isSingleSelect}
                title={filterConfiguration.label}
                dropDownDataAt={'filter_menu'}
                applyFilters={this.applyFilters}
                trigger={this.renderTriggerPill}
                selected={selectedFilters[filterId]}
                bpFilterActive={bpFilterSelected}
                hasCustomScroll={filterId === 'sku' && skuAggregatedList.length > 8}
                content={props => this.renderContent(filterConfiguration, props)}
            />
        );
    };

    getPortalElement = () => this.portalRef.current;

    render() {
        const { selectedFilters, skuAggregatedList } = this.state;
        const { currentProduct, isSearchPerformed, loadInitialReviews, filtersConfiguration } = this.props;
        const { isReviewsFiltersMasterListEnabled } = Sephora.configurationSettings;

        if (isReviewsFiltersMasterListEnabled?.isEnabled && userUtils.isSignedIn()) {
            const isBPFilterPresent = filtersConfiguration.some(filter => filter.id === BP_FILTER_ID);
            const targetPosition = filtersConfiguration.findIndex(filter => filter.id === 'nonIncentivizedReviews');

            if (!isBPFilterPresent) {
                filtersConfiguration.splice(targetPosition + 1, 0, { id: BP_FILTER_ID });
            }
        }

        const showFilters = !!(!this.state.isSearch && !isSearchPerformed);

        return (
            <Box
                id='custom_filters'
                marginTop={[4, 6, 7]}
            >
                <div ref={this.portalRef} />
                <div
                    css={styles.filtersWrap}
                    ref={this.filterRef}
                >
                    {showFilters ? (
                        <>
                            <div css={styles.filter}>
                                <Pill
                                    data-at={Sephora.debug.dataAt('filter_pill')}
                                    fontSize='md'
                                    paddingX={null}
                                    width={36}
                                    onClick={() =>
                                        this.setState(
                                            {
                                                isSearch: true
                                            },
                                            () => {
                                                this.inputRef.current.focus();
                                            }
                                        )
                                    }
                                >
                                    <Icon
                                        name='search'
                                        size='1em'
                                    />
                                </Pill>
                            </div>
                            {filtersConfiguration &&
                                filtersConfiguration.map(configuration => {
                                    // 1. No options - no filter! sku and BM are exceptions
                                    // 2. No SKU filter if it's not COLOR variation with no any item in skuAggregatedList
                                    if (
                                        ((!configuration.options || configuration.options.length === 0) &&
                                            configuration.id !== 'sku' &&
                                            configuration.id !== BP_FILTER_ID &&
                                            configuration.id !== 'beautyMatches') ||
                                        (configuration.id === 'sku' &&
                                            !(
                                                currentProduct.variationType === skuUtils.skuVariationType.COLOR &&
                                                skuAggregatedList.length > 0 &&
                                                currentProduct.skuSelectorType !== skuUtils.skuSwatchType.NONE
                                            ))
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={configuration.id}
                                            css={styles.filter}
                                        >
                                            {this.renderFilter(configuration)}
                                        </div>
                                    );
                                })}
                        </>
                    ) : null}
                    {!showFilters && (
                        <Grid
                            is='form'
                            gap={5}
                            paddingX={[2, 0]}
                            columns={['1fr auto', '415px auto']}
                            alignItems='center'
                            marginTop={`${FILTER_GAP}px`}
                            onSubmit={e => this.handleSearchSubmit(e)}
                        >
                            <TextInput
                                type='search'
                                autoOff={true}
                                name='keyword'
                                id='rr_search_input'
                                maxLength={70}
                                placeholder={getText('searchKeyword')}
                                ref={this.inputRef}
                                isSmall={true}
                                marginBottom={null}
                                value={(this.inputRef.current && this.inputRef.current.getValue()) || ''}
                                contentAfter={
                                    <button
                                        css={styles.clearButton}
                                        type='button'
                                        data-at={Sephora.debug.dataAt('rr_search_icon_cross')}
                                        onClick={() => {
                                            this.inputRef.current.empty();
                                            this.inputRef.current.focus();
                                        }}
                                    >
                                        <Icon
                                            name='x'
                                            size={8}
                                        />
                                    </button>
                                }
                            />
                            <div>
                                <Link
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    data-at={Sephora.debug.dataAt('rr_search_cancel')}
                                    onClick={() =>
                                        this.setState(
                                            {
                                                isSearch: false
                                            },
                                            () => {
                                                if (isSearchPerformed) {
                                                    loadInitialReviews();
                                                }
                                            }
                                        )
                                    }
                                    children={getText('cancel')}
                                />
                            </div>
                        </Grid>
                    )}
                </div>
                <ReviewsFiltersBreadcrumbs
                    onRemoveChiclet={this.removeFilter}
                    onClearAllFilters={this.resetFilters}
                    skuAggregatedList={skuAggregatedList}
                    selectedFilters={selectedFilters}
                />
            </Box>
        );
    }
}

const styles = {
    filtersWrap: {
        marginTop: -FILTER_GAP,
        [mediaQueries.xsMax]: {
            whiteSpace: 'nowrap',
            marginLeft: -space.container,
            marginRight: -space.container,
            paddingLeft: space[2],
            paddingRight: space[2],
            overflowX: 'auto',
            // prevent cut off of focus outline
            paddingBottom: 3,
            marginBottom: -3,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
        },
        [mediaQueries.sm]: {
            display: 'flex',
            flexWrap: 'wrap'
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
    filter: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginTop: FILTER_GAP,
        marginRight: FILTER_GAP,
        '&:last-child': {
            marginRight: 0
        }
    },
    ratingLabel: {
        marginLeft: '.7em',
        marginTop: '.125em',
        lineHeight: 0
    }
};

ReviewsFilters.defaultProps = {
    currentProduct: {}
};

export default wrapComponent(ReviewsFilters, 'ReviewsFilters', true);
