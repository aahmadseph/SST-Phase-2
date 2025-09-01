/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'store/Store';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Text, Divider, Link, Grid
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import bazaarVoiceApi from 'services/api/thirdparty/BazaarVoice';
import UrlUtils from 'utils/Url';
import UI from 'utils/UI';
import userUtils from 'utils/User';
import biUtils from 'utils/BiProfile';
import numberUtils from 'utils/Number';
import paginationUtils from 'utils/Pagination';
import ReviewsImageCarousel from 'components/ProductPage/ReviewsImageCarousel/ReviewsImageCarousel';
import Review from 'components/ProductPage/RatingsAndReviews/Review/Review';
import ReviewsStats from 'components/ProductPage/RatingsAndReviews/ReviewsStats/ReviewsStats';
import ReviewsFilters from 'components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFilters';
import Pagination from 'components/ProductPage/Pagination/Pagination';
import ProductActions from 'actions/ProductActions';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import jsUtils from 'utils/javascript';
import Actions from 'actions/Actions';
import Storage from 'utils/localStorage/Storage';
import ProductUtils from 'utils/product';
const { findProductRootParentCategoryId } = ProductUtils;
import BPUtils from 'utils/BeautyPreferences';

const { formatReviewCount } = numberUtils;
const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';
const PAGE_SIZE = 6;

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/locales', 'RatingsAndReviews');

class RatingsAndReviews extends BaseClass {
    constructor(props) {
        super(props);
        this.REVIEWS_TO_SHOW = props.reviewsToShow || 6;
    }

    state = {
        carouselsReady: false,
        helpfulReviews: null,
        currentPage: 1,
        isSearchPerformed: false,
        reviewsWithImage: [],
        reviewSelectedPhotoId: null,
        selectedReviewId: null,
        showProsAndCons: true
    };

    /* we fetch reviews on these cases:
       1. on init or when the controller it's called.
       2. when the step is near the page limit.
       3. when a new filter/sorting is applied.
       4. on reseting filters/sorting
    */
    fetchData = (filters, isFirstCall, currentPage = 1) => {
        let offset;
        const { productId, currentProduct } = this.props;
        const refinementsByCategory = BPUtils.getMasterListRefinementsByCategory(this.state.categoryId);

        const page = currentPage;

        const filtersToApply = Object.assign({}, filters || this.state.filtersApplied);

        //compare given filter and state filter
        const hasNewFilter = JSON.stringify(filtersToApply) !== JSON.stringify(this.state.filtersApplied);

        //if we have a new filter we reset page, offset and nextStep
        if (hasNewFilter) {
            offset = 0;
        } else {
            offset = (page - 1) * PAGE_SIZE;
        }

        bazaarVoiceApi
            .getReviewsAndStatsWithConfig(currentProduct.reviewFilters, productId, PAGE_SIZE, filtersToApply, offset, refinementsByCategory)
            .then(data => {
                if (data.apiFailed) {
                    this.setState({ showComponent: false });

                    return;
                }

                if (!data.results) {
                    return;
                }

                const reviewStatistics = isFirstCall ? data.reviewStatistics : this.state.reviewStatistics;

                this.setState({
                    showComponent: true,
                    hasNewFilter: isFirstCall ? false : hasNewFilter,
                    hasReviews: Array.isArray(data.results) && data.results.length > 0,
                    isSearchPerformed: false,
                    reviews: data.results,
                    totalReviews: data.totalResults,
                    filtersApplied: filtersToApply,
                    currentPage: currentPage,
                    reviewStatistics: reviewStatistics,
                    initialTotalReviews: isFirstCall ? data.totalResults : this.state.initialTotalReviews
                });
            })
            .catch(error => error.apiFailed && this.setState({ showComponent: false }));
    };

    loadInitialReviews = () => {
        // TODO: Bring defaultFilters configuration to API.
        const highlightedReviews = store.getState().page.product?.highlightedReviews;

        if (highlightedReviews?.reviews?.length > 0) {
            this.loadHighlightedReviews(highlightedReviews);
        } else {
            let defaultFilters = {};
            const { reviewFilters } = this.props.currentProduct;

            if (reviewFilters) {
                const sortId = 'sort';
                const sortFilter = this.props.currentProduct.reviewFilters.find(filter => filter.id === sortId);

                if (sortFilter && sortFilter.options) {
                    const submissionTimeDescOption = sortFilter.options.find(x => x.bvName === 'SubmissionTime' && x.bvValue === 'desc');

                    if (submissionTimeDescOption && submissionTimeDescOption.value) {
                        defaultFilters = { [sortId]: [submissionTimeDescOption.value] };
                    }
                }
            }

            this.fetchData(defaultFilters, true);
        }
    };

    handlePageClick = (pageIndex, buttonType) => {
        const { productId, selectedSentiment, language } = this.props;

        if (this.state.isSearchPerformed) {
            this.filterSearchReviews(
                {
                    keyword: this.state.searchKeyword,
                    productId,
                    type: 'REVIEW_SEARCH_APPLIED'
                },
                false,
                pageIndex
            );
        } else if (selectedSentiment !== undefined) {
            this.setState({ currentPage: pageIndex }, () => {
                this.props.loadHighlightedReviews({
                    sentiment: selectedSentiment,
                    productId,
                    language: language,
                    limit: PAGE_SIZE,
                    page: this.state.currentPage - 1
                });
            });
        } else {
            this.fetchData(null, false, pageIndex);
        }

        paginationUtils.sendAnalytics('ratings&reviews', pageIndex, buttonType);
    };

    redirectToAddReviewPage = () => {
        const { productId } = this.props;

        // Store Bazaar's API response on localStorage before redirect,
        // so it can retrieved on different places, e.g. on the review page.
        const reviewStatistics = this.state.reviewStatistics;

        if (reviewStatistics) {
            this.storeProductReviewOnLocal(productId, reviewStatistics);
        }

        UrlUtils.redirectTo(PRODUCT_ADD_REVIEWS_URL + productId);
    };

    storeProductReviewOnLocal = (productId, productReviewData) => {
        // Product-specific localStorage key
        const storageKey = bazaarVoiceApi.getStorageKeyForProductReview(productId);

        try {
            Storage.local.setItem(storageKey, productReviewData);

            return true;
        } catch (error) {
            return { error, storageKey };
        }
    };

    componentDidMount() {
        this.loadInitialReviews();

        this.setState({ categoryId: findProductRootParentCategoryId(this.props.currentProduct) });

        store.setAndWatch('user', this, () => {
            this.setState({
                user: {
                    isBI: userUtils.isBI(),
                    isAnonymous: userUtils.isAnonymous(),
                    biUserInfo: biUtils.getBiProfileInfo()
                }
            });
        });

        store.watchAction(ProductActions.TYPES.REVIEW_FILTERS_APPLIED, data => {
            this.filterReviews(data.filters);
        });

        store.watchAction(ProductActions.TYPES.REVIEW_SEARCH_APPLIED, data => {
            this.filterSearchReviews(data);
        });

        store.setAndWatch('page.product.highlightedReviews', this, data => {
            const highlightedReviews = data?.highlightedReviews;

            if (highlightedReviews) {
                this.loadHighlightedReviews(highlightedReviews);
            } else {
                if (this.state.sentimentReviews) {
                    this.loadInitialReviews();
                    this.setState({ sentimentReviews: false });
                }
            }
        });
    }

    normalizeHighlightedReviews = reviews => {
        return reviews.map(review => ({
            ...review,
            reviewText: review.text,
            userNickname: review.author,
            badges: {
                ...review.badges,
                incentivizedReview: review.incentivized
            }
        }));
    };

    loadHighlightedReviews = data => {
        this.setState({
            reviews: this.normalizeHighlightedReviews(data.reviews),
            totalReviews: data.count,
            sentimentReviews: true,
            hasReviews: Array.isArray(data.reviews) && data.reviews.length > 0
        });
    };

    filterReviews = filters => {
        // Don't fetch filters data if Search has been performed
        if (!this.state.isSearchPerformed) {
            this.fetchData(filters);
        }
    };

    filterSearchReviews = (searchData, isFirstCall = true, currentPage = 1) => {
        const { productId, keyword } = searchData;
        let offset;
        const page = currentPage;

        if (isFirstCall) {
            offset = (1 - 1) * PAGE_SIZE;
        } else {
            offset = (page - 1) * PAGE_SIZE;
        }

        bazaarVoiceApi
            .getSearchReviews(productId, PAGE_SIZE, keyword, offset)
            .then(data => {
                if (data.apiFailed) {
                    this.setState({ showComponent: false });

                    return;
                }

                if (!data.results) {
                    return;
                }

                const actionLink = 'reviews:ratings&reviews:search';
                const eventType = data.totalResults > 0 ? anaConsts.Event.EVENT_80 : anaConsts.Event.EVENT_81;
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: eventType,
                        searchAnswersKeyword: keyword,
                        actionInfo: actionLink,
                        linkName: actionLink
                    }
                });

                this.setState(
                    {
                        isSearchPerformed: true,
                        searchKeyword: keyword,
                        showComponent: true,
                        hasNewFilter: false,
                        hasReviews: Array.isArray(data.results) && data.results.length > 0,
                        reviews: data.results,
                        totalReviews: data.totalResults,
                        currentPage: currentPage
                    },
                    () => {
                        UI.scrollTo({ elementId: 'custom_filters' });
                    }
                );
            })
            .catch(error => error.apiFailed && this.setState({ showComponent: false }));
    };

    componentDidUpdate(prevProps = {}) {
        if (prevProps.productId !== this.props.productId && this.state.showComponent) {
            this.setState({ ...this.initalState }, () => {
                this.loadInitialReviews();
            });
        }

        if (prevProps.selectedSentiment !== this.props.selectedSentiment) {
            this.setState({
                currentPage: 1
            });
        }
    }

    handleReviewImageOnclick = (selectedReviewId, reviewSelectedPhotoId) => {
        const { productId } = this.props;
        const { reviewsWithImage } = this.state;

        // fetch reviews with images the first time and open the image modal with the results data
        if (reviewsWithImage.length) {
            this.setState(
                {
                    reviewSelectedPhotoId,
                    selectedReviewId
                },
                this.openImageModal
            );
        } else {
            bazaarVoiceApi.getReviewsWithImage(productId).then(data => {
                if (data) {
                    this.setState(
                        {
                            reviewsWithImage: data.results,
                            reviewSelectedPhotoId,
                            selectedReviewId
                        },
                        this.openImageModal
                    );
                }
            });
        }
    };

    openImageModal = () => {
        const { currentProduct } = this.props;

        const { user, reviewsWithImage, reviewSelectedPhotoId, selectedReviewId } = this.state;

        const reviewSelected = jsUtils.findInArray(reviewsWithImage, review => review.reviewId === selectedReviewId);

        store.dispatch(
            Actions.showReviewImageModal({
                isOpen: true,
                reviewSelected,
                reviewSelectedIndex: reviewsWithImage.findIndex(review => review.reviewId === selectedReviewId),
                reviewsWithImage,
                reviewsReference: reviewsWithImage,
                reviewUser: user,
                reviewProductTitle: currentProduct.productDetails.displayName,
                reviewSelectedPhotoId,
                isFromImageCarousel: false
            })
        );
    };

    getRemappedReviewFilters = () => {
        const { reviewFilters } = this.props.currentProduct;
        const { categoryId } = this.state;
        const refinements = BPUtils.getMasterListRefinementsByCategory(categoryId);
        const remappedFilters = reviewFilters
            //if we are on 'hair' or 'fragrance' PDP category, we need to exclude ageRange review filter that we got from PXS
            //or on 'skinCare' need to exclude skinTone
            .filter(
                filter =>
                    !(
                        (/cat130038|cat160006/.test(categoryId) && filter.id === 'ageRange') ||
                        (categoryId === 'cat150006' && filter.id === 'skinTone')
                    )
            )
            .map(filter => {
                const filterId = filter.id === 'hairDescrible' ? 'hairType' : filter.id;
                const masterListFilter = refinements.find(item => item.key === filterId);

                if (masterListFilter) {
                    return {
                        ...filter,
                        id: filterId,
                        options: masterListFilter.items
                            .filter(item => item.filterable) //remove options that shouldn't be shown
                            .map(item => ({
                                bvName: null,
                                bvValue: item.key,
                                value: item.value
                            }))
                    };
                }

                return filter;
            });

        return remappedFilters;
    };

    /* eslint-disable-next-line complexity */
    render() {
        const { productId, currentProduct, isSmallView, selectedSentiment } = this.props;
        /* eslint-disable prefer-const */
        let {
            reviews,
            user,
            currentPage,
            totalReviews,
            hasReviews,
            isSearchPerformed,
            searchKeyword,
            reviewStatistics,
            helpfulReviews,
            initialTotalReviews,
            showProsAndCons,
            categoryId
        } = this.state;
        /* eslint-enable prefer-const */
        const { isReviewsFiltersMasterListEnabled } = Sephora.configurationSettings;

        const totalReviewCount = totalReviews || 0;

        if (helpfulReviews && helpfulReviews.length && currentPage === 1) {
            // add helpful reviews on the top, preventing duplicates
            reviews = helpfulReviews.concat(reviews.filter(review => !helpfulReviews.some(helpful => helpful.reviewId === review.reviewId)));
        }

        const totalReviewPages = Math.ceil(totalReviews / PAGE_SIZE);
        const maxReviewPages = 999;
        const totalReviewsBreadcrumb = totalReviewCount > 999 ? `${Math.floor(totalReviewCount / 1000)}k` : totalReviewCount;
        const breadcrumbFromPosition = (currentPage - 1) * PAGE_SIZE + 1;
        const breadcrumbToPosition = PAGE_SIZE * currentPage > totalReviewCount ? totalReviewCount : PAGE_SIZE * currentPage;
        const totalReviewsCount = selectedSentiment ? totalReviews : initialTotalReviews;
        const reviewFilters = isReviewsFiltersMasterListEnabled?.isEnabled ? this.getRemappedReviewFilters() : currentProduct.reviewFilters;

        return (
            <React.Fragment>
                {totalReviewCount ? <SectionDivider marginY={null} /> : <Divider />}
                <Box paddingBottom={totalReviewCount ? [6, 8] : [4, 5]}>
                    <Grid
                        gap={1}
                        lineHeight='tight'
                        columns={['1fr auto', null, 1]}
                        alignItems='baseline'
                    >
                        <Text
                            is='h2'
                            marginTop='1em'
                            fontSize={['md', 'lg']}
                            fontWeight='bold'
                            data-at='ratings_reviews_section'
                            children={`${getText('ratingsReviews')} (${formatReviewCount(totalReviewsCount || 0)})`}
                        />
                        <div>
                            <Link
                                padding={2}
                                margin={-2}
                                color='blue'
                                onClick={this.redirectToAddReviewPage}
                                children={getText('writeReview')}
                            />
                        </div>
                    </Grid>
                    <ReviewsStats
                        sentiments={currentProduct.sentiments}
                        reviewStatistics={reviewStatistics}
                        totalReviewCount={initialTotalReviews}
                        showProsAndCons={showProsAndCons}
                    />

                    {currentProduct.reviewImages && !this.props.selectedSentiment && (
                        <ReviewsImageCarousel
                            carouselContextId={productId}
                            productId={productId}
                            productTitle={currentProduct.productDetails.displayName}
                            reviewImages={currentProduct.reviewImages}
                            user={user}
                        />
                    )}

                    {(reviewStatistics || isSearchPerformed) && !selectedSentiment ? (
                        <ReviewsFilters
                            filtersConfiguration={reviewFilters}
                            currentProduct={currentProduct}
                            productId={productId}
                            categoryId={categoryId}
                            isSearchPerformed={isSearchPerformed}
                            loadInitialReviews={this.loadInitialReviews}
                        />
                    ) : null}

                    {isSearchPerformed && !this.props.selectedSentiment && (
                        <Text
                            is='h3'
                            lineHeight='tight'
                            fontWeight='bold'
                            data-at={hasReviews ? null : Sephora.debug.dataAt('rr_no_results_message')}
                            marginBottom={hasReviews ? 3 : 2}
                            children={
                                hasReviews
                                    ? getText(totalReviews === 1 ? 'searchResult' : 'searchResults', [totalReviews, searchKeyword])
                                    : getText('noSearchResult', [searchKeyword])
                            }
                        />
                    )}
                    {hasReviews ? (
                        <Box marginTop={[5, 6]}>
                            <Text
                                is='p'
                                fontSize='sm'
                                lineHeight='tight'
                                color='gray'
                                marginBottom={3}
                                children={getText('reviewsFromTo', [breadcrumbFromPosition, breadcrumbToPosition, totalReviewsBreadcrumb])}
                            />
                            {reviews.map((item, index) => {
                                return (
                                    <React.Fragment key={item.reviewId}>
                                        {!item.isHighlighted && index === 0 && isSmallView && <Divider marginBottom={3} />}
                                        <Review
                                            index={index}
                                            {...item}
                                            refreshMethod={this.filterReviews}
                                            isSmallView={isSmallView}
                                            currentProduct={currentProduct}
                                            reviewImageModalTrigger={this.handleReviewImageOnclick}
                                            user={user}
                                        />
                                        {!item.isHighlighted && index < reviews.length - 1 && (
                                            <Divider
                                                marginTop={[4, 6]}
                                                marginBottom={5}
                                                {...(isSmallView && {
                                                    thick: true,
                                                    marginX: '-container'
                                                })}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    ) : (
                        <React.Fragment>
                            {!isSearchPerformed && reviewStatistics !== undefined && (
                                <Text
                                    is='p'
                                    fontWeight='bold'
                                    marginTop={4}
                                    marginBottom={3}
                                    children={getText('noReview')}
                                />
                            )}
                        </React.Fragment>
                    )}
                    {totalReviewPages > 1 && (
                        <Pagination
                            marginTop={[6, 7]}
                            totalPages={totalReviewPages > maxReviewPages ? maxReviewPages : totalReviewPages}
                            currentPage={currentPage}
                            scrollElementId='custom_filters'
                            handlePageClick={this.handlePageClick}
                        />
                    )}
                </Box>
            </React.Fragment>
        );
    }
}

export default wrapComponent(RatingsAndReviews, 'RatingsAndReviews', true);
