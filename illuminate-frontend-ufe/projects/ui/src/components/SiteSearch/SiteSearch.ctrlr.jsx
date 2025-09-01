/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'Store';
import watch from 'redux-watch';
import Location from 'utils/Location';
import { Icon, Link } from 'components/ui';
import keyConsts from 'utils/KeyConstants';
import analyticsUtils from 'analytics/utils';
import FrameworkUtils from 'utils/framework';
import Perf from 'utils/framework/Perf';
import userUtils from 'utils/User';
import biApi from 'services/api/beautyInsider';
import localeUtils from 'utils/LanguageLocale';
import JStorage from 'utils/localStorage/Search';
import Storage from 'utils/localStorage/Storage';
import searchActions from 'actions/SearchActions';
import BaseClass from 'components/BaseClass/BaseClass';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import TextInput from 'components/Inputs/TextInput/TextInput';
import TrendingSearch from 'components/SiteSearch/TrendingSearch';
import SearchItem from 'components/SiteSearch/SearchItem';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import { getProductsFromKeyword } from 'services/api/search-n-browse/searchProductsByKeyword';
import { TestTargetReady, ConstructorBeaconInitialized } from 'constants/events';
import {
    radii, colors, shadows, forms, site, space, screenReaderOnlyStyle, mediaQueries, lineHeights
} from 'style/config';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import Carousel from 'components/Carousel';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Empty from 'constants/empty';
import anaConsts from 'analytics/constants';

import Debounce from 'utils/Debounce';

import { OPEN_SPA_SEARCH_PAGE_API_START, OPEN_SPA_SEARCH_PAGE_API_LOADED } from 'constants/performance/marks';

const { updateRequestData } = ConstructorRecsActions;
const DEBOUNCE_BLUR = 200;
const SEARCH_SELECTION_TYPES = {
    MANUAL: 'manual',
    TYPEAHEAD: 'type-ahead',
    TRENDING: 'trending'
};
const SEARCH_TYPE_KEY = 'prevSearchType';
const SEARCH_TERM_KEY = 'searchTerm';
const SEARCH_PAGE_URL = '/search';

const FIVE_MINUTES_IN_MILLISECONDS = 300000;
const { StorageTypes } = Storage;
// Utils

const ZERO_STATE_SEARCH_EXPERIENCE_SIZE = 5;
const SEARCH_ICON_SIZE = 16;
const SEARCH_ICON_INDENT = space[3];
const SUGGESTIONS = {
    productSuggestions: 5,
    searchSuggestions: 5,
    categorySuggestions: 5
};

const ZERO_STATE_SEARCH_CONSTRUCTOR = {
    challengerOne: {
        podId: CONSTRUCTOR_PODS.TRENDING_SEARCHES,
        params: { section: 'Search Suggestions' }
    },
    challengerTwo: {
        podId: CONSTRUCTOR_PODS.TRENDING_CATEGORIES,
        params: { section: 'Categories' }
    }
};

const getText = localeUtils.getLocaleResourceFile('components/SiteSearch/locales', 'SiteSearch');

const { wrapComponent } = FrameworkUtils;

class SiteSearch extends BaseClass {
    state = {
        focus: false,
        keyword: null,
        highlightedIndex: -1,
        userSearchKeyword: '',
        trendingCategories: [],
        zeroStateSearchExperience: '',
        zeroStateSearchConstructorExperience: {},
        zeroStateSearch: { sectionName: '', items: [], isCarousel: false, carouselItems: [] }
    };

    inputRef = React.createRef();
    containerRef = React.createRef();

    handleClickOutside = event => {
        if (!this.containerRef.current?.contains(event?.target)) {
            this.handleBlur();
        }
    };

    componentDidMount() {
        const searchWatch = watch(store.getState, 'search');
        store.subscribe(
            searchWatch(newVal => {
                const wasFocused = this.state.focus;
                const filteredResults = newVal.results.filter(item => !item.trendingCategories);
                const trendingCategories = newVal.results.find(item => item.trendingCategories)?.trendingCategories || [];

                this.setState(
                    {
                        focus: newVal.focus,
                        keyword: newVal.keyword,
                        results: filteredResults,
                        trendingCategories: trendingCategories
                    },
                    () => {
                        if (!wasFocused && newVal.focus && this.inputRef && this.inputRef.current) {
                            this.inputRef.current.focus();
                        }
                    }
                );
            }),
            this
        );
        this.keyUpEvent = {
            prevSearchValue: null
        };
        // We want to be able to update/clear the search term on any SPA navigation, for this we check if the location changed.
        // This can be refactored to used the connect HOC later
        store.setAndWatch('historyLocation', this, data => {
            if (data?.historyLocation?.prevPath !== data?.historyLocation?.path) {
                const analyticCookieData = analyticsUtils.getPreviousPageData();
                const { clickedItem } = analyticCookieData;
                const persistedSearchTerm = Storage.local.getItem(LOCAL_STORAGE.SEARCH_TERM_PERSIST);
                let userSearchKeyword = clickedItem ? '' : persistedSearchTerm?.searchTerm;

                if (!userSearchKeyword) {
                    userSearchKeyword = '';
                }

                this.setState({ userSearchKeyword }, () => {
                    if (persistedSearchTerm) {
                        Storage.local.removeItem(LOCAL_STORAGE.SEARCH_TERM_PERSIST);
                    }
                });
            }
        });

        //Wait for new zero state search experience from test and target
        Sephora.Util.onLastLoadEvent(window, [TestTargetReady, ConstructorBeaconInitialized], () => {
            store.setAndWatch('testTarget.offers', this, data => {
                const zeroStateSearchExperience = data.offers.zeroStateSearch?.experience || '';

                if (this.state.zeroStateSearchExperience !== zeroStateSearchExperience) {
                    this.setState({ zeroStateSearchExperience });
                }
            });
        });

        //Zero state search experience from constructor is available. Save to component to avoid re renders on the same experience
        store.setAndWatch('constructorRecommendations.constructorRecommendations', this, data => {
            if (this.isZeroStateSearchExperienceFromConstructor()) {
                const desiredZeroStateExperienceFromConstructor = this.getDesiredZeroStateSearchExperienceFromConstructor();
                const prevZeroStateSearchConstructorExperience = this.state.zeroStateSearchConstructorExperience;
                const currentZeroStateSearchConstructorExperience =
                    data.constructorRecommendations[desiredZeroStateExperienceFromConstructor.podId] || {};

                if (prevZeroStateSearchConstructorExperience.constructorTitle !== currentZeroStateSearchConstructorExperience.constructorTitle) {
                    this.setState({ zeroStateSearchConstructorExperience: currentZeroStateSearchConstructorExperience });
                }
            }
        });

        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(_, prevState) {
        this.handleZeroStateSearchExperienceChange(prevState.zeroStateSearchExperience);

        this.handleZeroStateSearchConstructorExperienceChange(prevState.zeroStateSearchConstructorExperience);
    }

    handleZeroStateSearchConstructorExperienceChange = prevConstructorExperience => {
        //Zero State search experience constructor data is available and is new
        if (
            this.state.zeroStateSearchExperience &&
            prevConstructorExperience.constructorTitle !== this.state.zeroStateSearchConstructorExperience.constructorTitle
        ) {
            this.addZeroStateSearchResultsForCurrentConstructorExperience();
        }
    };

    handleZeroStateSearchExperienceChange = prevExperience => {
        const displayRemainingZeroStateChallengers = Sephora.configurationSettings?.displayRemainingZeroStateChallengers;

        //Receive a new Search experience from ABTests
        if (prevExperience !== this.state.zeroStateSearchExperience) {
            //Search Experience no longer exists. Return to default state
            if (!this.state.zeroStateSearchExperience) {
                this.removeZeroStateSearchExperience();

                return;
            }

            //Experience received needs constructor information
            if (this.isZeroStateSearchExperienceFromConstructor()) {
                this.requestConstructorRecommendationForCurrentExperience();

                return;
            }

            if (this.state.zeroStateSearchExperience === 'challengerThree' && displayRemainingZeroStateChallengers) {
                this.displayZeroStateSearchChallengerThree();

                return;
            }

            if (this.state.zeroStateSearchExperience === 'challengerFour' && displayRemainingZeroStateChallengers) {
                this.displayZeroStateSearchChallengerFour();

                return;
            }

            //TODO Add Logic when experience is not from constructor Challenger 5
        }
    };

    displayZeroStateSearchChallengerThree = () => {
        const recentlyViewedItems = Storage.local.getItem('rvData');
        const carouselItems = recentlyViewedItems
            ?.map((item, index) => (
                <ProductImage
                    key={`${item.skuId}-${index}`}
                    id={item.skuId}
                    size={48}
                    onClick={() => this.handleItemClick({ value: item.productName }, item.targetUrl)}
                />
            ))
            ?.slice(0, 10);

        this.setState({
            zeroStateSearch: {
                sectionName: carouselItems?.length ? getText('continueBrowsing') : '',
                isCarousel: !!carouselItems?.length,
                carouselItems,
                items: Empty.Array
            }
        });
    };

    displayZeroStateSearchChallengerFour = () => {
        if (userUtils.isAnonymous()) {
            return;
        }

        const user = store.getState('user').user;
        const options = {
            sortBy: 'recently',
            groupBy: 'none',
            excludeSamples: true,
            excludeRewards: true,
            itemsPerPage: 10
        };

        biApi
            .getPurchaseHistory(user.profileId, options)
            .then(purchaseHistory => {
                const purchasedItems = purchaseHistory?.purchasedItems;

                if (purchasedItems.length) {
                    const carouselItems = purchasedItems
                        ?.map((item, index) => (
                            <ProductImage
                                key={`${item.sku?.skuId}-${index}`}
                                id={item.sku?.skuId}
                                size={48}
                                onClick={() => this.handleItemClick({ value: item.sku?.productName }, item.sku?.targetUrl)}
                            />
                        ))
                        ?.slice(0, 10);

                    this.setState({
                        zeroStateSearch: {
                            sectionName: carouselItems?.length ? getText('buyItAgain') : '',
                            isCarousel: !!carouselItems?.length,
                            carouselItems,
                            items: Empty.Array
                        }
                    });
                }
            })
            .catch(() => {
                this.setState({
                    zeroStateSearch: {
                        sectionName: '',
                        isCarousel: false,
                        carouselItems: Empty.Array,
                        items: Empty.Array
                    }
                });
            });
    };

    removeZeroStateSearchExperience = () => {
        this.setState({
            zeroStateSearchExperience: '',
            zeroStateSearch: { sectionName: '', items: [], isCarousel: false, carouselItems: [] },
            zeroStateSearchConstructorExperience: {}
        });

        return;
    };

    addZeroStateSearchResultsForCurrentConstructorExperience = () => {
        this.setState({
            zeroStateSearch: this.parseConstructorResponse()
        });
    };

    parseConstructorResponse = () => {
        const items = this.state.zeroStateSearchConstructorExperience.constructorRecommendations?.map(recommendation => {
            const value = recommendation.value || '';
            const term = recommendation.value || '';
            const url = recommendation.data?.url || '';

            return { value, term, url };
        });

        const reducedItems = items?.slice(0, ZERO_STATE_SEARCH_EXPERIENCE_SIZE);

        return {
            sectionName: this.state.zeroStateSearchConstructorExperience.constructorTitle || '',
            items: reducedItems || Empty.Array
        };
    };

    requestConstructorRecommendationForCurrentExperience = () => {
        const zeroStateSearchExperienceConstructor = this.getDesiredZeroStateSearchExperienceFromConstructor();
        store.dispatch(
            updateRequestData({
                podId: zeroStateSearchExperienceConstructor.podId,
                params: zeroStateSearchExperienceConstructor.params,
                isCollection: false
            })
        );
    };

    getDesiredZeroStateSearchExperienceFromConstructor = () => {
        return ZERO_STATE_SEARCH_CONSTRUCTOR[this.state.zeroStateSearchExperience];
    };

    isZeroStateSearchExperienceFromConstructor = () => {
        const zeroStateSearchExperienceConstructor = this.getDesiredZeroStateSearchExperienceFromConstructor();

        return !!zeroStateSearchExperienceConstructor;
    };

    handleCancelClick = e => {
        e.preventDefault();
        this.handleBlur();
    };

    setHighlightedIndex = (index, value) => {
        this.setState({ highlightedIndex: index }, () => {
            if (value) {
                this.inputRef.current.setValue(value);
            }
        });
    };

    handleFocus = (e, suggestions) => {
        store.dispatch(searchActions.getSearchResults(this.inputRef.current.getValue(), suggestions));
    };

    handleKeyUp = (e, suggestions) => {
        const isNotDuplicateRequest = this.inputRef.current?.getValue() !== this.keyUpEvent.prevSearchValue;

        if (isNotDuplicateRequest) {
            switch (e.key) {
                case keyConsts.UP:
                case keyConsts.DOWN:
                case keyConsts.ESC:
                case keyConsts.ENTER:
                    e.preventDefault();

                    return;
                default:
                    store.dispatch(searchActions.getSearchResults(this.inputRef.current.getValue(), suggestions));
            }
        } else {
            this.keyUpEvent.prevSearchValue = null;
        }
    };

    handleKeyDown = e => {
        const { highlightedIndex, results, trendingCategories, zeroStateSearch } = this.state;
        const isZeroStateSearch = !this.inputRef.current || !this.inputRef.current.getValue();
        const zeroStateItems = isZeroStateSearch ? zeroStateSearch.items : [];
        const combinedResults = [...zeroStateItems, ...results, ...trendingCategories];
        let index = highlightedIndex;

        if (e.key === keyConsts.ESC) {
            this.handleClearClick();

            return;
        }

        switch (e.key) {
            case keyConsts.UP:
                if (index <= 0) {
                    index = combinedResults.length - 1;
                } else {
                    index--;
                }

                break;
            case keyConsts.DOWN:
                if (index === -1 || index >= combinedResults.length - 1) {
                    index = 0;
                } else {
                    index++;
                }

                break;
            case keyConsts.ENTER:
                this.handleSubmit(e);

                return;
            case keyConsts.TAB:
                this.handleBlur();

                return;
            default:
                return;
        }

        e.preventDefault();
        this.setHighlightedIndex(index, combinedResults[index].value);
    };

    blur = () => {
        this.setHighlightedIndex(-1);
        this.setState({ focus: false });
    };

    handleBlur = Debounce.debounce(this.blur, DEBOUNCE_BLUR);

    handleClearClick = () => {
        this.inputRef.current.setValue('');
        this.handleFocus();
    };

    storeSearchDataForAnalytics = (type, product = {}, dropdownItemClicked = false) => {
        const searchType = JStorage.isPreviousSearchItem(product.term || '') ? 'previous' : type;

        //Store for UFE
        const searchData = {};
        searchData[SEARCH_TYPE_KEY] = searchType;
        searchData[SEARCH_TERM_KEY] = product.term || product.value;
        searchData.clickedItem = dropdownItemClicked;
        searchData.events = [anaConsts.Event.INTERNAL_SEARCH];
        analyticsUtils.setNextPageData(searchData);
    };

    redirectUrl = (data, keyword) => {
        let redirectUrl;

        if (data.searchRedirectTarget) {
            redirectUrl = data.searchRedirectTarget.targetUrl || data.searchRedirectTarget.targetValue;
        } else {
            redirectUrl = `${SEARCH_PAGE_URL}?keyword=${encodeURIComponent(keyword)}`;
        }

        Location.navigateTo(null, redirectUrl);
    };

    fetchSearchDataAndRedirect = keyword => {
        const config = {
            cache: {
                key: keyword,
                expiry: FIVE_MINUTES_IN_MILLISECONDS,
                storageType: StorageTypes.Session
            }
        };
        performance.clearMarks(OPEN_SPA_SEARCH_PAGE_API_START);
        performance.clearMarks(OPEN_SPA_SEARCH_PAGE_API_LOADED);
        Perf.report(OPEN_SPA_SEARCH_PAGE_API_START);
        getProductsFromKeyword({
            q: keyword,
            config
        })
            .then(data => {
                Perf.report(OPEN_SPA_SEARCH_PAGE_API_LOADED);
                this.redirectUrl(data, keyword);
            })
            .catch(error => {
                Perf.report(OPEN_SPA_SEARCH_PAGE_API_LOADED);
                this.redirectUrl(error, keyword);
            });
    };

    handleSubmit = e => {
        this.handleBlur();
        e && e.preventDefault();

        const keyword = this.inputRef.current.getValue().trim();

        if (keyword === '') {
            return;
        }

        const product = { term: keyword };

        if (keyword) {
            Storage.local.setItem(LOCAL_STORAGE.SEARCH_TERM_PERSIST, { searchTerm: keyword });
        }

        this.storeSearchDataForAnalytics(SEARCH_SELECTION_TYPES.MANUAL, product, false);
        JStorage.setSearchTermStorageItem(product.term);
        this.fetchSearchDataAndRedirect(keyword);
    };

    /**
     * This was isolated for testing proposes
     */
    processURLRedirect = (product, keyword) => {
        let url;

        if (keyword) {
            JStorage.setSearchTermStorageItem(keyword);
        }

        if (product.productId) {
            url = '/product/' + product.productId;

            if (keyword) {
                url += '?keyword=' + encodeURIComponent(keyword);
            }

            JStorage.setSearchTermStorageItem(product.value);
            Location.navigateTo(null, url);
        } else if (product.term) {
            JStorage.setSearchTermStorageItem(product.term);
            this.fetchSearchDataAndRedirect(product.term);
        }
    };

    handleItemClick = (product, url) => {
        this.handleBlur();
        this.storeSearchDataForAnalytics(url ? SEARCH_SELECTION_TYPES.TRENDING : SEARCH_SELECTION_TYPES.TYPEAHEAD, product, true);

        if (url) {
            Location.navigateTo(null, url);
        }

        this.inputRef.current.setValue(product.value);
        this.processURLRedirect(product, product.term);
    };

    /**
     * Highlight part of the string in search results list,
     * if it's presented.
     */
    highlight = (string, substring) => {
        if (substring) {
            const reg = new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

            return string.replace(reg, function (str) {
                return '<b>' + str + '</b>';
            });
        } else {
            return string;
        }
    };

    render() {
        const {
            focus, highlightedIndex, results, trendingCategories, zeroStateSearch
        } = this.state;

        const hasResults = !!(results && results.length);
        const isZeroStateSearch = !this.inputRef.current || !this.inputRef.current.getValue();
        const zeroStateSearchExperienceCount = isZeroStateSearch && !!this.state.zeroStateSearchExperience ? ZERO_STATE_SEARCH_EXPERIENCE_SIZE : 0;

        return (
            <div
                css={[styles.root, focus && styles.rootOpen]}
                ref={this.containerRef}
            >
                <form
                    role='search'
                    onSubmit={e => this.handleSubmit(e)}
                    css={styles.form}
                >
                    <label
                        htmlFor='site_search_input'
                        id='site_search_label'
                        css={screenReaderOnlyStyle}
                        children={getText('search')}
                    />
                    <div
                        css={styles.wrapper}
                        role='combobox'
                        aria-expanded={hasResults}
                        aria-owns='site_search_listbox'
                        aria-haspopup='listbox'
                        id='site_search_combobox'
                    >
                        <TextInput
                            type='search'
                            autoOff={true}
                            name='keyword'
                            aria-autocomplete='list'
                            aria-controls='site_search_listbox'
                            aria-activedescendant={highlightedIndex > -1 ? `site_search_result${highlightedIndex}` : null}
                            id='site_search_input'
                            maxLength={70}
                            placeholder={getText('search')}
                            ref={this.inputRef}
                            isSmall={true}
                            indent={focus || SEARCH_ICON_SIZE + SEARCH_ICON_INDENT + 6}
                            marginBottom={null}
                            contentAfter={
                                focus &&
                                this.inputRef.current &&
                                this.inputRef.current.getValue() !== '' && (
                                    <button
                                        data-at={Sephora.debug.dataAt('search_clear_btn')}
                                        type='button'
                                        aria-label={getText('clearInputAriaLabel')}
                                        css={styles.clearButton}
                                        onClick={this.handleClearClick}
                                    >
                                        <Icon
                                            name='x'
                                            size={8}
                                        />
                                    </button>
                                )
                            }
                            data-at={Sephora.debug.dataAt('search_input')}
                            value={
                                this.state.userSearchKeyword !== undefined || this.state.userSearchKeyword !== null
                                    ? this.state.userSearchKeyword
                                    : this.inputRef.current && this.inputRef.current.getValue()
                            }
                            onFocus={e => this.handleFocus(e, SUGGESTIONS)}
                            onKeyUp={e => this.handleKeyUp(e, SUGGESTIONS)}
                            onKeyDown={e => this.handleKeyDown(e)}
                            customStyle={styles.boldSearchBar}
                        />
                        <Icon
                            data-at={Sephora.debug.dataAt('search_icon')}
                            name='search'
                            size={SEARCH_ICON_SIZE}
                            color={colors.black}
                            css={styles.searchIcon}
                            style={focus ? { display: 'none' } : null}
                        />
                    </div>
                    {focus && (
                        <Link
                            data-at={Sephora.debug.dataAt('search_cancel_btn')}
                            color='blue'
                            paddingLeft={3}
                            paddingY={2}
                            onClick={this.handleCancelClick}
                            display={[null, 'none']}
                            children={getText('cancel')}
                        />
                    )}
                    <ul
                        aria-labelledby='site_search_label'
                        role='listbox'
                        id='site_search_listbox'
                        onMouseLeave={() => this.setHighlightedIndex(-1)}
                        css={[
                            styles.results,
                            (focus && hasResults) || {
                                display: 'none'
                            }
                        ]}
                    >
                        {isZeroStateSearch && (
                            <>
                                {zeroStateSearch.sectionName && (!!zeroStateSearch.items.length || !!zeroStateSearch.carouselItems.length) && (
                                    <SearchItem sectionTitle={zeroStateSearch.sectionName} />
                                )}
                                {zeroStateSearch.items?.map((item, index) =>
                                    !item.value && !item.term ? null : (
                                        <SearchItem
                                            iconPath='/img/ufe/icons/trending.svg'
                                            index={index}
                                            isActive={index === highlightedIndex}
                                            value={item.value}
                                            onMouseEnter={() => this.setHighlightedIndex(index)}
                                            handleItemClick={() => this.handleItemClick(item, item.url)}
                                            sectionTitle={item.sectionTitle}
                                        />
                                    )
                                )}
                                {zeroStateSearch.isCarousel && (
                                    <li css={styles.carouselContainer}>
                                        <Carousel
                                            id={'1e22ss'}
                                            gap={16}
                                            itemWidth={48}
                                            items={zeroStateSearch.carouselItems}
                                            isLoading={!focus}
                                            css={styles.carouselContainer}
                                        />
                                    </li>
                                )}
                                <SearchItem sectionTitle={getText('previousSearches')} />
                            </>
                        )}
                        {hasResults && (
                            <>
                                {results.map((result, index) => {
                                    const combinedIndex = zeroStateSearchExperienceCount + index;
                                    const isActive = combinedIndex === highlightedIndex;
                                    const getSectionLabel = () => {
                                        if (index === 0 && !isZeroStateSearch) {
                                            return getText('searchSuggestions');
                                        } else if (index === SUGGESTIONS.searchSuggestions && !isZeroStateSearch) {
                                            return getText('productSuggestions');
                                        }

                                        return null;
                                    };

                                    const insertSectionLabel = getSectionLabel();

                                    return (
                                        <>
                                            {insertSectionLabel && <SearchItem sectionTitle={insertSectionLabel} />}
                                            {
                                                <SearchItem
                                                    index={combinedIndex}
                                                    isActive={isActive}
                                                    value={this.highlight(result.value, this.state.keyword)}
                                                    productId={result.productId}
                                                    defaultSku={result.defaultSku}
                                                    onMouseEnter={() => this.setHighlightedIndex(combinedIndex)}
                                                    handleItemClick={() => this.handleItemClick(result)}
                                                />
                                            }
                                        </>
                                    );
                                })}
                                <TrendingSearch
                                    styles={styles}
                                    results={results}
                                    highlightedIndex={highlightedIndex}
                                    setHighlightedIndex={this.setHighlightedIndex}
                                    handleItemClick={this.handleItemClick}
                                    highlight={this.highlight}
                                    inputRef={this.inputRef}
                                    section={getText('trendingCategories')}
                                    trendingCategories={trendingCategories}
                                    zeroStateSearchCount={zeroStateSearchExperienceCount}
                                />
                            </>
                        )}
                    </ul>
                </form>
            </div>
        );
    }
}

const styles = {
    root: {
        position: 'relative',
        color: colors.black
    },
    rootOpen: {
        zIndex: 3, // a step above meganav dropdown
        [mediaQueries.xsMax]: {
            position: 'fixed',
            inset: 0,
            paddingTop: (site.headerHeight - forms.HEIGHT_SM) / 2,
            paddingLeft: space.container,
            paddingRight: space.container,
            backgroundColor: colors.white
        }
    },
    form: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    wrapper: {
        position: 'relative',
        flex: 1
    },
    boldSearchBar: {
        innerWrap: [
            {
                borderColor: colors.black,
                height: forms.SEARCH_BAR_HEIGHT,
                [mediaQueries.sm]: {
                    height: forms.SEARCH_BAR_HEIGHT_SM
                }
            }
        ]
    },
    results: {
        position: 'absolute',
        backgroundColor: colors.white,
        top: '100%',
        left: 0,
        width: '100%',
        paddingTop: space[2],
        paddingBottom: space[2],
        cursor: 'default',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        [mediaQueries.sm]: {
            width: 'auto',
            minWidth: '100%',
            boxShadow: shadows.light,
            whiteSpace: 'nowrap',
            borderRadius: radii[3]
        }
    },
    result: {
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        paddingTop: space[2],
        paddingBottom: space[2],
        lineHeight: lineHeights.tight,
        [mediaQueries.xsMax]: {
            marginLeft: -space.container,
            marginRight: -space.container,
            paddingLeft: space.container,
            paddingRight: space.container
        },
        [mediaQueries.sm]: {
            paddingLeft: space[4],
            paddingRight: space[4]
        }
    },
    resultHover: {
        backgroundColor: colors.nearWhite
    },
    resultHeader: {
        color: colors.gray
    },
    clearButton: {
        color: colors.white,
        backgroundColor: colors.gray,
        lineHeight: 0,
        borderRadius: 99999,
        width: 16,
        height: 16,
        textAlign: 'center',
        marginRight: space[2],
        alignSelf: 'center',
        '.no-touch &:hover': {
            backgroundColor: colors.black
        }
    },
    searchIcon: {
        position: 'absolute',
        top: (forms.SEARCH_BAR_HEIGHT - SEARCH_ICON_SIZE) / 2,
        [mediaQueries.sm]: {
            top: (forms.SEARCH_BAR_HEIGHT_SM - SEARCH_ICON_SIZE) / 2
        },
        left: SEARCH_ICON_INDENT,
        pointerEvents: 'none'
    },
    carouselContainer: {
        maxWidth: 454,
        [mediaQueries.xsMax]: {
            marginLeft: -space.container,
            marginRight: -space.container,
            paddingLeft: space.container,
            paddingRight: space.container
        },
        [mediaQueries.sm]: {
            paddingLeft: space[4],
            paddingRight: space[4]
        }
    }
};

export default wrapComponent(SiteSearch, 'SiteSearch', true);
