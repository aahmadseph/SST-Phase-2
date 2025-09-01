/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import { space, site } from 'style/config';
import { Text, Divider } from 'components/ui';
import bazaarVoiceApi from 'services/api/thirdparty/BazaarVoice';
import RatingImageCard from 'components/ProductPage/ReviewsImageCarousel/RatingImageCard';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import Actions from 'Actions';
import jsUtils from 'utils/javascript';
import localeUtils from 'utils/LanguageLocale';
import Carousel from 'components/Carousel';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import { DebouncedResize } from 'constants/events';

const CARD_TRANSITION_OFFSET = space[1];
const RR_IMAGE_ANALYTICS_CAROUSEL_NAME = 'ratings&reviews image carousel';

const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/ReviewsImageCarousel/locales', 'ReviewsImageCarousel')(text);

class ReviewsImageCarousel extends BaseClass {
    state = {
        pageCount: null,
        isFlush: null,
        reviewsWithImage: [],
        reviewSelectedPhotoId: null,
        selectedReviewId: null
    };

    updateVisibleItems = pageCount => {
        this.setState(prevState => {
            return {
                visibleItems: prevState.visibleItems + Math.floor(pageCount)
            };
        });
    };

    isObservable = (index, pageCount) => {
        if (index !== 0 && index !== Math.floor(pageCount)) {
            return index % Math.floor(pageCount) === 0;
        }

        return false;
    };

    containerPaddedMatches = () => {
        return window.matchMedia(`(min-width: ${site.containerMax + space.container * 2}px)`).matches;
    };

    handleResize = () => {
        const { isFlush } = this.state;
        const containerPaddedMatches = this.containerPaddedMatches();

        if (containerPaddedMatches && isFlush) {
            this.setState({
                isFlush: false
            });
        } else if (!containerPaddedMatches && !isFlush) {
            this.setState({
                isFlush: true
            });
        }
    };

    handleOnclick = (selectedReviewId, reviewSelectedPhotoId) => {
        const { productId } = this.props;
        const { reviewsWithImage } = this.state;

        productPageBindings.reviewImageClick({ selectedReviewId, productId });

        // fetch reviews with images the first time and open the image modal with the results data
        if (reviewsWithImage.length) {
            this.setState(
                {
                    reviewSelectedPhotoId,
                    selectedReviewId
                },
                this.openModal
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
                        this.openModal
                    );
                }
            });
        }
    };

    openModal = () => {
        const { productTitle, user, reviewImages } = this.props;

        const { reviewsWithImage, reviewSelectedPhotoId, selectedReviewId } = this.state;

        const reviewSelected = jsUtils.findInArray(reviewsWithImage, review => review.reviewId === selectedReviewId);

        store.dispatch(
            Actions.showReviewImageModal({
                isOpen: true,
                reviewSelected,
                reviewSelectedIndex: reviewImages.findIndex(review => review.reviewId === selectedReviewId),
                reviewsWithImage,
                reviewsReference: reviewImages,
                reviewUser: user,
                reviewProductTitle: productTitle,
                reviewSelectedPhotoId,
                isFromImageCarousel: true
            })
        );
    };

    componentDidMount() {
        this.handleResize();

        const pageCount = 7;
        this.setState({
            pageCount,
            visibleItems: pageCount * 2
        });

        window.addEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { reviewImages } = this.props;
        const imageItems = reviewImages.map((item, index) => {
            return (
                <RatingImageCard
                    key={item.reviewId || index}
                    imgSrc={item.thumbnailImageUrl}
                    isObserved={this.isObservable(index, this.state.pageCount)}
                    updateVisibleItems={() => this.updateVisibleItems(this.state.pageCount)}
                    reviewId={item.reviewId}
                    isIncentivizedReview={item.isIncentivizedReview}
                    onClickAction={() => this.handleOnclick(item.reviewId, item.photoId)}
                />
            );
        });

        return (
            <>
                <Divider
                    marginY={[4, 5]}
                    display={[null, null, 'none']}
                />
                {reviewImages.length > 0 && (
                    <>
                        <Text
                            is='h3'
                            marginTop={[null, null, 7]}
                            fontSize='sm'
                            lineHeight='tight'
                            color='gray'
                            marginBottom={[2, 3]}
                            data-at={Sephora.debug.dataAt('image_carousel_title')}
                            children={getText('title')}
                        />
                        <div css={{ marginTop: -CARD_TRANSITION_OFFSET }}>
                            <LazyLoad
                                contextId={this.props.carouselContextId}
                                dataAt='image_carousel'
                                analyticsCarouselName={RR_IMAGE_ANALYTICS_CAROUSEL_NAME}
                                component={Carousel}
                                marginX={this.state.isFlush && '-container'}
                                scrollPadding={this.state.isFlush && 2}
                                gap={[1, 2]}
                                itemWidth={[136, 188]}
                                items={imageItems}
                                title={getText('title')}
                            />
                        </div>
                    </>
                )}
            </>
        );
    }
}

export default wrapComponent(ReviewsImageCarousel, 'ReviewsImageCarousel', true);
