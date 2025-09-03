/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import Actions from 'Actions';
import { colors, modal } from 'style/config';
import {
    Box, Text, Divider, Grid, Image, Flex, Icon, Link
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import StarRating from 'components/StarRating/StarRating';
import Feedback from 'components/ProductPage/Feedback/Feedback';
import ReviewAuthor from 'components/ProductPage/RatingsAndReviews/Review/ReviewAuthor';
import CarouselArrow from 'components/Carousel/CarouselArrow';
import IncentivizedBadge from 'components/ProductPage/IncentivizedBadge/IncentivizedBadge';
import jsUtils from 'utils/javascript';
import { DebouncedResize } from 'constants/events';

import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ReviewImageModal/locales', 'ReviewImageModal');

import filterUtils from 'utils/Filters';
import skuHelpers from 'utils/skuHelpers';
import dateUtils from 'utils/Date';
import feedbackUtils from 'utils/Feedback';

class ReviewImageModal extends BaseClass {
    state = {
        isOpen: false,
        reviewTextHasOverflow: false,
        showMore: false,
        hasReviewUpdate: true,
        reviewData: this.props.reviewSelected,
        reviewIndex: this.props.reviewSelectedIndex,
        selectedPhotoIndex: this.props.reviewSelected.photos.findIndex(photo => photo.Id === this.props.reviewSelectedPhotoId)
    };

    textRef = React.createRef();

    handleReviewTextOverflow = () => {
        const reviewText = this.textRef.current;
        this.setState({
            reviewTextHasOverflow: reviewText.scrollHeight > reviewText.offsetHeight
        });
    };

    componentDidMount() {
        this.handleReviewTextOverflow();
        window.addEventListener(DebouncedResize, this.handleReviewTextOverflow);

        this.updateSelectedPhoto(this.state.selectedPhotoIndex);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleReviewTextOverflow);
    }

    readMore = () => {
        const currentScroll = window.scrollY;
        this.setState({ showMore: !this.state.showMore }, () => {
            window.scroll(0, currentScroll);
        });
    };

    requestClose = () => {
        store.dispatch(Actions.showReviewImageModal({ isOpen: false }));
    };

    hasNextReview = () => this.state.reviewIndex < this.props.reviewsReference.length - 1;
    hasPrevReview = () => this.state.reviewIndex > 0;
    isLastReviewSecondImage = () => {
        const { reviewsReference } = this.props;
        const { selectedPhotoIndex, reviewData, reviewIndex } = this.state;

        return reviewIndex === reviewsReference.length - 2 && selectedPhotoIndex === reviewData.photos.length - 1;
    };

    updateReviewData = direction => {
        const hasPrevReview = this.hasPrevReview();
        const hasNextReview = this.hasNextReview();
        const goBack = direction === 'previous';

        const { reviewsReference } = this.props;

        let { reviewData, reviewIndex, selectedPhotoIndex } = this.state;

        if (goBack && hasPrevReview) {
            reviewData = this.getReviewDataByIndex(reviewIndex - 1, goBack);
            selectedPhotoIndex = reviewData.photos.length - 1;
        } else if (!goBack && hasNextReview) {
            reviewData = this.getReviewDataByIndex(reviewIndex + 1, goBack);
            selectedPhotoIndex = 0;
        }

        reviewIndex = reviewsReference.findIndex(review => review.reviewId === reviewData.reviewId);

        if (this.state.reviewIndex !== reviewIndex) {
            this.setState(
                {
                    reviewData,
                    reviewIndex,
                    selectedPhotoIndex,
                    hasReviewUpdate: true,
                    showMore: false
                },
                () => this.handleReviewTextOverflow()
            );
        }
    };

    getReviewDataByIndex = (reviewIndex, isBack) => {
        // the order of the images is based on CE array (reviewsReference), once we know what reviewId is next
        // we get the data to display from BV array (reviewsWithImage)
        const { reviewsReference, reviewsWithImage } = this.props;

        const { reviewData } = this.state;
        const currentReviewId = reviewData.reviewId;
        let reviewToShow = reviewsReference[reviewIndex];

        if (currentReviewId === reviewToShow.reviewId) {
            reviewToShow = isBack ? reviewsReference[reviewIndex - 1] : reviewsReference[reviewIndex + 1];
        }

        return jsUtils.findInArray(reviewsWithImage, review => review.reviewId === reviewToShow.reviewId);
    };

    handleArrowClick = direction => {
        let { selectedPhotoIndex } = this.state;

        if (
            (selectedPhotoIndex === 0 && direction === 'previous') ||
            (selectedPhotoIndex === this.state.reviewData.photos.length - 1 && direction === 'next')
        ) {
            this.setState({ hasReviewUpdate: false }, () => this.updateReviewData(direction));
        } else {
            this.updateSelectedPhoto(direction === 'previous' ? --selectedPhotoIndex : ++selectedPhotoIndex);
        }
    };

    updateSelectedPhoto = index => {
        this.setState({ selectedPhotoIndex: index });
    };

    /* eslint-disable-next-line complexity */
    render() {
        const { isOpen, productTitle, reviewUser, isFromImageCarousel } = this.props;

        const {
            reviewTextHasOverflow, showMore, reviewData, selectedPhotoIndex, hasReviewUpdate
        } = this.state;

        let isVerifiedPurchaser;
        let sku;

        if (reviewData) {
            isVerifiedPurchaser = filterUtils.isVerifiedPurchaser(reviewData?.badgesOrder);
            sku = skuHelpers.getSkuFromProduct(null, reviewData.skuId);
        }

        const showArrows = isFromImageCarousel ? this.hasPrevReview() || this.hasNextReview() || reviewData.photos.length > 1 : false;
        const disableNextArrow =
            this.hasNextReview() && !this.isLastReviewSecondImage() ? false : selectedPhotoIndex === reviewData.photos.length - 1;
        const disablePrevArrow = this.hasPrevReview() ? false : selectedPhotoIndex === 0;

        return (
            <Modal
                width={6}
                isOpen={isOpen}
                onDismiss={this.requestClose}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title numberOfLines={1}>{getText('reviewfor', [productTitle])}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid
                        columns={[null, '1fr 44%', '1fr 38%']}
                        gap={[4, 5]}
                    >
                        <Box
                            position='relative'
                            marginTop={[-modal.paddingSm, 0]}
                            marginX={[modal.outdentX[0], 0]}
                            backgroundColor={['lightGray', 'transparent']}
                        >
                            <Image
                                height={[450, 480]}
                                disableLazyLoad={true}
                                display='block'
                                marginX='auto'
                                css={{ objectFit: 'contain' }}
                                src={reviewData.photos[selectedPhotoIndex].Sizes.normal.Url}
                            />
                            {showArrows && (
                                <>
                                    <CarouselArrow
                                        onClick={() => this.handleArrowClick('previous')}
                                        direction='prev'
                                        variant='simple'
                                        disabled={disablePrevArrow}
                                    />
                                    <CarouselArrow
                                        onClick={() => this.handleArrowClick('next')}
                                        direction='next'
                                        variant='simple'
                                        disabled={disableNextArrow}
                                    />
                                </>
                            )}
                            {reviewData.badges?.IncentivizedReviewBadge ||
                                (reviewData.badges?.incentivizedReview && (
                                    <Flex
                                        position='absolute'
                                        left={0}
                                        bottom={3}
                                        right={4}
                                        justifyContent='end'
                                    >
                                        <IncentivizedBadge tooltipProps={{ side: 'top' }} />
                                    </Flex>
                                ))}
                        </Box>
                        <div>
                            {reviewData.photos.length > 1 && (
                                <>
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                        lineHeight='tight'
                                        marginBottom={3}
                                        children={getText('imagesTitle')}
                                    />
                                    <Flex
                                        paddingBottom={5}
                                        margin='-4px'
                                    >
                                        {reviewData.photos.map((item, itemIndex) => (
                                            <Box
                                                key={`review_photo_${itemIndex.toString()}`}
                                                onClick={() => this.updateSelectedPhoto(itemIndex)}
                                                borderWidth='2px'
                                                padding='2px'
                                                borderRadius='8px'
                                                css={[
                                                    {
                                                        outline: 0,
                                                        transition: 'border-color .2s'
                                                    },
                                                    selectedPhotoIndex !== itemIndex && {
                                                        borderColor: 'transparent',
                                                        '.no-touch &:hover, :focus': {
                                                            borderColor: colors.midGray
                                                        }
                                                    }
                                                ]}
                                            >
                                                <Image
                                                    key={item.Id}
                                                    disableLazyLoad={true}
                                                    display='block'
                                                    size={48}
                                                    borderRadius={2}
                                                    css={{ objectFit: 'cover' }}
                                                    src={item.Sizes.thumbnail.Url}
                                                />
                                            </Box>
                                        ))}
                                    </Flex>
                                </>
                            )}
                            <Flex
                                fontSize='sm'
                                lineHeight='none'
                                marginBottom={2}
                                alignItems='center'
                            >
                                <StarRating
                                    rating={reviewData.rating}
                                    size='1em'
                                />
                                {isVerifiedPurchaser && (
                                    <Text
                                        marginLeft={3}
                                        color='green'
                                        children={getText('verifiedPurchase')}
                                    />
                                )}
                                <Text
                                    color='gray'
                                    marginLeft='auto'
                                    children={dateUtils.formatSocialDate(reviewData.submissionTime, true)}
                                />
                            </Flex>

                            {reviewData.isRecommended && (
                                <Flex
                                    alignItems='center'
                                    color='gray'
                                    fontSize={['sm', 'base']}
                                    lineHeight='tight'
                                >
                                    <Icon
                                        size='.9em'
                                        name='checkmark'
                                        color='green'
                                        marginRight='.5em'
                                    />
                                    {getText('recommended')}
                                </Flex>
                            )}

                            <Box marginY={4}>
                                {reviewData.title && (
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                        marginBottom='.25em'
                                        lineHeight='tight'
                                        children={reviewData.title}
                                    />
                                )}
                                {sku && (
                                    <Grid
                                        columns='auto 1fr'
                                        gap={3}
                                        lineHeight='tight'
                                        marginTop={reviewData.title && 2}
                                        marginBottom={2}
                                        color='gray'
                                    >
                                        <Image
                                            disableLazyLoad={true}
                                            src={sku.smallImage}
                                            borderRadius='full'
                                            size={24}
                                        />
                                        <span
                                            css={{ alignSelf: 'center' }}
                                            children={filterUtils.getDescription(sku)}
                                        />
                                    </Grid>
                                )}
                                <Text
                                    ref={this.textRef}
                                    is='div'
                                    numberOfLines={showMore ? null : 12}
                                    children={reviewData.reviewText}
                                />
                                {(reviewTextHasOverflow || showMore) && (
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        onClick={this.readMore}
                                        color='blue'
                                        children={showMore ? getText('readLess') : getText('readMore')}
                                    />
                                )}
                            </Box>
                            {hasReviewUpdate && (
                                <Feedback
                                    positiveCount={reviewData.totalPositiveFeedbackCount}
                                    negativeCount={reviewData.totalNegativeFeedbackCount}
                                    onVote={isPositive =>
                                        feedbackUtils.handleVote(feedbackUtils.FEEDBACK_CONTENT_TYPES.REVIEW, reviewData.reviewId, isPositive)
                                    }
                                />
                            )}
                            <Divider marginY={4} />
                            <ReviewAuthor
                                isModal={true}
                                userNickname={reviewData.userNickname}
                                user={reviewUser}
                                biTraits={reviewData.biTraits}
                                badges={reviewData.badges}
                            />
                        </div>
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ReviewImageModal, 'ReviewImageModal', true);
