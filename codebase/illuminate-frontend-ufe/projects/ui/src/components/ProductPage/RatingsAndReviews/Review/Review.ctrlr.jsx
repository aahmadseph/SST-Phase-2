import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { modal, space, colors } from 'style/config';
import {
    Link, Text, Flex, Box, Grid, Image, Icon
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import Embed from 'components/Embed/Embed';
import StarRating from 'components/StarRating/StarRating';
import ReviewAuthor from 'components/ProductPage/RatingsAndReviews/Review/ReviewAuthor';
import Feedback from 'components/ProductPage/Feedback/Feedback';
import skuHelpers from 'utils/skuHelpers';
import filterUtils from 'utils/Filters';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/Review/locales', 'Review');
import dateUtils from 'utils/Date';
import cookieUtils from 'utils/Cookies';
import feedbackUtils from 'utils/Feedback';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import highlightedReviewsUtils from 'utils/HighlightedReviews';
import userUtils from 'utils/User';
import { DebouncedResize } from 'constants/events';

const { highlightRange } = highlightedReviewsUtils;

const LEFT_COL_WIDTH = 196;
const RIGHT_COL_WIDTH = 240;
const HIGHLIGHT_PAD_X = space[5];
const MAX_MEDIA_SIZE = 640;

const DataAt = {
    VerifiedPurchaseBadge: Sephora.debug.dataAt('verified_purchase_badge'),
    ShowMore: Sephora.debug.dataAt('show_more'),
    TimePosted: Sephora.debug.dataAt('time_posted')
};

class Review extends BaseClass {
    state = {
        openModal: false,
        modalPhoto: null,
        modalVideo: null,
        hasOverflow: false,
        showMore: false
    };

    textRef = React.createRef();

    handleResize = () => {
        if (!this.state.showMore) {
            const desc = this.textRef.current;
            this.setState({
                hasOverflow: desc.scrollHeight > desc.offsetHeight
            });
        }
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    readMore = () => {
        const currentScroll = window.scrollY;
        const { currentProduct, currentProduct: { currentSku } = {} } = this.props;
        const currency = localeUtils.ISO_CURRENCY[userUtils.getShippingCountry().countryCode];

        this.setState({ showMore: true }, () => {
            window.scroll(0, currentScroll);
        });

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: ['event71'],
                linkName: 'D=c55',
                actionInfo: 'review:read more',
                reviewId: this.props.reviewId,
                productId: currentProduct?.productDetails?.productId,
                listPrice: currentProduct.currentSku?.listPrice,
                brandName: currentProduct?.productDetails.brand.displayName,
                productName: currentProduct?.productDetails.displayName,
                categoryName: currentProduct?.parentCategory?.displayName,
                skuVariationType: currentSku?.variationType,
                skuVariationValue: currentSku?.variationValue,
                skuId: currentSku?.skuId,
                currency
            }
        });
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            index,
            reviewText,
            rating,
            title,
            skuId,
            photos = [],
            videos = [],
            isRecommended,
            isSmallView,
            submissionTime,
            badgesOrder,
            isHighlighted,
            headerText,
            reviewId,
            totalPositiveFeedbackCount,
            totalNegativeFeedbackCount,
            reviewImageModalTrigger,
            textHighlights,
            reviewDate
        } = this.props;

        const { showMore } = this.state;

        const sku = skuHelpers.getSkuFromProduct(null, skuId);

        const recommended = isRecommended && (
            <Flex
                alignItems='center'
                color='gray'
                fontSize={['sm', 'base']}
                lineHeight='tight'
                marginTop={[null, null, 3]}
            >
                <Icon
                    size='.9em'
                    name='checkmark'
                    color='green'
                    marginRight='.5em'
                />
                {getText('recommendsProduct')}
            </Flex>
        );

        const hasVideos =
            videos.length > 0 &&
            (Sephora.configurationSettings.isCCPABannerEnabled ? cookieUtils.read(cookieUtils.KEYS.CCPA_CONSENT_COOKIE) === 1 : true);
        const hasPhotos = photos.length > 0;

        const reviewContent = textHighlights ? highlightRange({ quote: reviewText, ranges: textHighlights }) : reviewText;

        return (
            <Box
                {...(isHighlighted && {
                    boxShadow: 'medium',
                    paddingX: [4, HIGHLIGHT_PAD_X],
                    paddingTop: [3, 5],
                    paddingBottom: [4, 5],
                    marginBottom: index === 0 ? 4 : 6,
                    marginX: [-2, null, 0],
                    borderRadius: 2
                })}
            >
                {headerText && (
                    <Text
                        is='h3'
                        lineHeight='tight'
                        fontSize={[null, 'md']}
                        fontWeight='bold'
                        marginBottom={[3, 5]}
                        children={headerText}
                    />
                )}
                <Grid
                    {...(isSmallView || {
                        columns: isHighlighted
                            ? `${LEFT_COL_WIDTH - HIGHLIGHT_PAD_X}px 1fr ${RIGHT_COL_WIDTH - HIGHLIGHT_PAD_X}px`
                            : `${LEFT_COL_WIDTH}px 1fr ${RIGHT_COL_WIDTH}px`
                    })}
                    gap={[3, 4]}
                    alignItems='flex-start'
                >
                    <div>
                        <Flex
                            flexDirection={isSmallView || 'column'}
                            lineHeight='tight'
                        >
                            <Text
                                marginRight={2}
                                fontSize={['sm', 'base']}
                            >
                                <StarRating
                                    rating={rating}
                                    size='1em'
                                />
                            </Text>
                            {filterUtils.isVerifiedPurchaser(badgesOrder) && (
                                <Text
                                    marginTop={isSmallView || 3}
                                    fontSize='sm'
                                    color='green'
                                    data-at={DataAt.VerifiedPurchaseBadge}
                                    children={getText('verifiedPurchase')}
                                />
                            )}
                            <Text
                                data-at={DataAt.TimePosted}
                                fontSize={['sm', 'base']}
                                color='gray'
                                marginTop={isSmallView || 3}
                                marginLeft={isSmallView && 'auto'}
                                children={dateUtils.formatSocialDate(submissionTime || reviewDate, true)}
                            />
                        </Flex>
                        {isSmallView || recommended}
                    </div>

                    <Flex
                        flexDirection='column'
                        borderRightWidth={[null, null, 1]}
                        borderBottomWidth={[1, null, 0]}
                        borderColor='divider'
                        paddingBottom={[3, 4, 0]}
                        paddingRight={[null, null, 8]}
                    >
                        {title && (
                            <Text
                                is={headerText ? 'h4' : 'h3'}
                                fontWeight='bold'
                                marginBottom='.125em'
                                children={title}
                            />
                        )}
                        {sku && (
                            <Grid
                                columns='auto 1fr'
                                gap={2}
                                lineHeight='tight'
                                marginTop={title && 2}
                                marginBottom={2}
                                color='gray'
                            >
                                <Image
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
                            numberOfLines={showMore ? null : isSmallView ? 4 : 3}
                            lineHeight={[null, 'relaxed']}
                            css={styles.highlightedReview}
                            dangerouslySetInnerHTML={{
                                __html: reviewContent
                            }}
                        />
                        {this.state.hasOverflow && !showMore && (
                            <Link
                                onClick={this.readMore}
                                color='blue'
                                children={getText('readMore')}
                            />
                        )}
                        {(hasPhotos || hasVideos) && (
                            <Flex marginTop={4}>
                                {hasPhotos &&
                                    photos.map(photo => (
                                        <Box
                                            key={photo.Id}
                                            position='relative'
                                            marginTop={2}
                                            marginRight={2}
                                            onClick={() =>
                                                reviewImageModalTrigger
                                                    ? reviewImageModalTrigger(reviewId, photo.Id)
                                                    : this.setState({
                                                        openModal: true,
                                                        modalPhoto: photo
                                                    })
                                            }
                                        >
                                            <Image
                                                display='block'
                                                size={80}
                                                borderRadius={2}
                                                css={{ objectFit: 'cover' }}
                                                alt={getText('thumbnailADAAltText')}
                                                src={photo.Sizes.thumbnail.Url}
                                            />
                                        </Box>
                                    ))}
                                {hasVideos &&
                                    videos.map(video => (
                                        <Box
                                            key={video.VideoId}
                                            marginTop={2}
                                            marginRight={2}
                                            position='relative'
                                            onClick={() =>
                                                this.setState({
                                                    openModal: true,
                                                    modalVideo: video
                                                })
                                            }
                                        >
                                            <Image
                                                display='block'
                                                size={80}
                                                borderRadius={2}
                                                css={{ objectFit: 'cover' }}
                                                src={video.VideoThumbnailUrl || `https://img.youtube.com/vi/${video.VideoId}/0.jpg`}
                                            />
                                            <Image
                                                src='/img/ufe/icons/play-sm.svg'
                                                disableLazyLoad={true}
                                                width={22}
                                                height={24}
                                                css={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            />
                                        </Box>
                                    ))}
                            </Flex>
                        )}
                        <Grid
                            marginTop={3}
                            alignItems='center'
                            columns='1fr auto'
                        >
                            {isSmallView && <div>{recommended}</div>}
                            <Feedback
                                positiveCount={totalPositiveFeedbackCount}
                                negativeCount={totalNegativeFeedbackCount}
                                onVote={isPositive => feedbackUtils.handleVote(feedbackUtils.FEEDBACK_CONTENT_TYPES.REVIEW, reviewId, isPositive)}
                            />
                        </Grid>
                    </Flex>
                    <ReviewAuthor {...this.props} />
                </Grid>
                <Modal
                    width={this.state.modalVideo ? MAX_MEDIA_SIZE + modal.paddingX[1] * 2 : 'fit'}
                    isOpen={this.state.openModal}
                    onDismiss={() => {
                        this.setState({
                            openModal: false,
                            modalPhoto: null,
                            modalVideo: null
                        });
                    }}
                >
                    <Modal.Header />
                    <Modal.Body>
                        <Box
                            marginX='auto'
                            maxWidth={MAX_MEDIA_SIZE}
                            width='100%'
                        >
                            {(() => {
                                if (this.state.modalPhoto) {
                                    return (
                                        <Image
                                            alt={getText('thumbnailADAAltText')}
                                            display='block'
                                            marginX='auto'
                                            maxHeight={MAX_MEDIA_SIZE}
                                            src={this.state.modalPhoto.Sizes.normal.Url}
                                        />
                                    );
                                } else if (this.state.modalVideo) {
                                    return (
                                        <Embed ratio={9 / 16}>
                                            <iframe
                                                src={this.state.modalVideo.VideoIframeUrl}
                                                frameborder='0'
                                                allowfullscreen
                                            ></iframe>
                                        </Embed>
                                    );
                                } else {
                                    return null;
                                }
                            })()}
                        </Box>
                    </Modal.Body>
                </Modal>
            </Box>
        );
    }
}

const styles = {
    highlightedReview: {
        strong: {
            backgroundColor: colors.yellow
        }
    }
};

export default wrapComponent(Review, 'Review', true);
