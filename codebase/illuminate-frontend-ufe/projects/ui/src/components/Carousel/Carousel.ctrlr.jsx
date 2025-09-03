import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { space, site, colors } from 'style/config';
import { Box } from 'components/ui';
import Dots from 'components/Carousel/Dots';
import CarouselArrow from 'components/Carousel/CarouselArrow';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Debounce from 'utils/Debounce';
import helpersUtils from 'utils/Helpers';
import { DebouncedResize } from 'constants/events';
import CommunityGalleryBindings from 'analytics/bindingMethods/pages/community/CommunityGalleryBindings';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import { sendCSFFeaturedCarouselScrollEvent } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const { deferTaskExecution } = helpersUtils;

const DEBOUNCED_SCROLL_CALLBACK_DELAY = 100;

const getGapOffset = gap => {
    if (Array.isArray(gap)) {
        return gap.map(g => getGapOffset(g));
    }

    return `-${space[gap] || gap}px`;
};

const getSpacerWidth = size => {
    if (Array.isArray(size)) {
        return size.map(w => getSpacerWidth(w));
    }

    return `${space[size] || size}px`;
};

class Carousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isTouch: null,
            showPrev: false,
            showNext: false,
            hasShadowsCover: false,
            isScrollable: false,
            scrollCompleted: false,
            currentItems: [],
            itemsViewed: [],
            modalLoaded: false,
            fireCMSAnalytics: false,
            hadScroll: false
        };
    }

    rootRef = React.createRef();
    listRef = React.createRef();
    dotsRef = React.createRef();

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isTouch, showNext, showPrev, hasShadowsCover, isScrollable
        } = this.state;

        const {
            dataAt,
            items,
            gap,
            itemWidth,
            itemFlexGrow,
            scrollPadding,
            dotsShown,
            dotsStyle,
            arrowVariant,
            showArrowOnHover,
            shouldCenterItems,
            paddingY,
            marginX,
            isLoading,
            id,
            podId,
            resultId,
            totalResults,
            recapList,
            arrowWidth,
            arrowCircleWidth,
            paddingX,
            outdent
        } = this.props;

        if (!items || items?.length === 0) {
            return null;
        }

        const arrowProps = {
            scrollPadding,
            variant: arrowVariant,
            showOnHover: showArrowOnHover,
            hasShadowsCover,
            zIndex: 1,
            width: arrowCircleWidth,
            arrowWidth,
            outdent: outdent || 0
        };

        const gapOffset = getGapOffset(gap);
        const spacerWidth = getSpacerWidth(scrollPadding);

        return (
            <div
                data-carousel-id={id}
                data-at={Sephora.debug.dataAt(dataAt)}
                ref={this.rootRef}
                css={[
                    !this.state.scrollCompleted && this.props.isGalleryCarousel && { visibility: 'hidden' },
                    podId === CONSTRUCTOR_PODS.CREATOR_STOREFRONT && styles.carouselContainer
                ]}
            >
                <Box
                    position='relative'
                    zIndex={0}
                    overflow='hidden'
                    marginX={marginX}
                    marginY={paddingY && `-${space[paddingY] || paddingY}px`}
                    paddingX={paddingX}
                    data-cnstrc-recommendations
                    data-cnstrc-recommendations-pod-id={podId}
                    data-cnstrc-result-id={resultId}
                    data-cnstrc-num-results={totalResults}
                    css={[
                        showArrowOnHover && !this.props.isGalleryCarousel && styles.innerWithHover,
                        showArrowOnHover && this.props.isGalleryCarousel && styles.innerWithHoverGallery
                    ]}
                >
                    <Box
                        ref={this.listRef}
                        is='ul'
                        display='flex'
                        gap={gap}
                        onScroll={this.debouncedScrollHandler}
                        onMouseEnter={this.enableZoom}
                        onMouseLeave={this.disableZoom}
                        onMouseMove={this.mouseMove}
                        paddingY={paddingY}
                        scrollPadding={scrollPadding}
                        minHeight={recapList && [230, 270]}
                        css={[styles.list, shouldCenterItems && styles.listCentered, hasShadowsCover && styles.listCardShadowCover]}
                        style={isLoading || !isScrollable ? { overflow: 'hidden' } : null}
                    >
                        {scrollPadding && (
                            <Box
                                is='li'
                                aria-hidden
                                width={spacerWidth}
                                marginRight={gapOffset}
                                css={styles.item}
                            />
                        )}
                        {items.map((item, index) => (
                            <Box
                                key={item.key || index.toString()}
                                is='li'
                                width={item?.props?.itemWidth || itemWidth}
                                flexGrow={itemFlexGrow}
                                css={styles.item}
                            >
                                {item ? item : <SkeletonBanner />}
                            </Box>
                        ))}
                        {scrollPadding && (
                            <Box
                                is='li'
                                aria-hidden
                                width={spacerWidth}
                                marginLeft={gapOffset}
                                css={styles.item}
                            />
                        )}
                    </Box>
                    {dotsShown && items?.length > 1 && (
                        <div css={[styles.dots, dotsStyle]}>
                            <Dots
                                ref={this.dotsRef}
                                qty={items?.length}
                                dotsShown={dotsShown}
                                onClick={this.scrollToItem}
                            />
                        </div>
                    )}
                    {items?.length > 1 && (!isTouch || this.props.isGalleryCarousel) && isScrollable && (
                        <>
                            <CarouselArrow
                                {...arrowProps}
                                onClick={this.handleScrollPrev}
                                direction='prev'
                                disabled={!showPrev || isLoading}
                            />
                            <CarouselArrow
                                {...arrowProps}
                                onClick={this.handleScrollNext}
                                direction='next'
                                disabled={!showNext || isLoading}
                            />
                        </>
                    )}
                </Box>
            </div>
        );
    }

    enableZoom = event => {
        if (this.props.onMouseEnter) {
            const pageIndex = this.getCurrentIndex();
            const zoomedItem = this.props.items[pageIndex];

            event.persist();

            deferTaskExecution(() => {
                if (zoomedItem.props.item.type === 'IMAGE') {
                    this.props.onMouseEnter(true, event);
                } else {
                    this.props.onMouseEnter(false, event);
                }
            });
        }
    };

    disableZoom = () => {
        if (this.props.onMouseLeave) {
            deferTaskExecution(() => {
                this.props.onMouseLeave(false);
            });
        }
    };

    mouseMove = event => {
        if (this.props.onMouseMove) {
            const index = this.getCurrentIndex();

            if (!this.state.isTouch) {
                const targetBoundaries = event?.target?.getBoundingClientRect();
                const offsetObj = {
                    x: event.clientX - targetBoundaries.left,
                    y: event.clientY - targetBoundaries.top
                };
                this.props.onMouseMove(offsetObj, index);
            }
        }
    };

    getCurrentIndex = () => {
        const list = this.listRef.current;
        const scrollAmount = this.rootRef && this.rootRef.current ? this.rootRef.current.offsetWidth : 0;
        const scrollLeft = list ? this.listRef.current.scrollLeft : 0;
        const pageIndex = Math.round(scrollLeft / scrollAmount);

        return pageIndex;
    };

    getItemWidth = () => {
        if (this.listRef.current && this.listRef.current.children?.length > 0) {
            return this.listRef.current.children[this.props.scrollPadding ? 1 : 0].offsetWidth;
        }

        return 0;
    };

    hasShadowsCover = () => {
        return this.props.hasShadowHack && window.innerWidth > site.containerMax + space.container * 2;
    };

    getVisibleItemIndices = () => {
        if (!this.listRef.current) {
            return [];
        }

        const list = this.listRef.current;
        const itemWidth = this.getItemWidth();
        const scrollLeft = list.scrollLeft;
        const visibleItemsCount = Math.round(list.offsetWidth / itemWidth);

        const startIndex = Math.round(scrollLeft / itemWidth);
        const endIndex = startIndex + visibleItemsCount;

        return Array.from({ length: endIndex - startIndex }, (_, i) => i + startIndex);
    };

    handleScroll = (isAutoScrollDone = false) => {
        const list = this.listRef.current;
        const { onImpression, personalization = {} } = this.props;
        const visibleItemIndices = this.getVisibleItemIndices(); //call new method

        if (list) {
            const isTouch = Sephora.isTouch;
            const showPrev = list.scrollLeft > 0;
            const showNext = Math.ceil(list.scrollLeft) < list.scrollWidth - list.offsetWidth;
            // Check if the carousel should be scrollable by checking if the last item extends
            // beyond the container’s width.
            // On touch devices, we always allow scrolling because CSS already handles it, and if
            // the carousel is inside a hidden modal when it mounts, all offsets may be 0,
            // which would return FALSE and prevent scrolling for touch devices.
            const isScrollable = isTouch || list.lastChild?.offsetLeft + list.lastChild?.offsetWidth > list.offsetWidth;
            const hasShadowsCover = this.hasShadowsCover();

            if (
                isTouch !== this.state.isTouch ||
                isScrollable !== this.state.isScrollable ||
                showPrev !== this.state.showPrev ||
                showNext !== this.state.showNext ||
                hasShadowsCover !== this.state.hasShadowsCover
            ) {
                this.setState({
                    isTouch,
                    isScrollable,
                    showPrev,
                    showNext,
                    hasShadowsCover,
                    scrollCompleted: isAutoScrollDone
                });
            }
        }

        const scrollLeft = list?.scrollLeft || 0;
        const pageIndex = this.getCurrentIndex();

        if (this.props.onScroll && this.props.isGalleryCarousel && isAutoScrollDone) {
            this.props.onScroll(pageIndex, true);
        } else if (this.props.onScroll) {
            this.props.onScroll(pageIndex);
        }

        if (this.dotsRef && this.dotsRef.current && this.props.dotsShown) {
            const mediaIndex = Math.round(scrollLeft / this.getItemWidth());
            this.dotsRef.current.scrollTo(mediaIndex);
        }

        if (onImpression) {
            // check if onImpression exist and trigger the function
            const targets = this.state?.itemsViewed?.length ? visibleItemIndices.filter(index => !this.state.itemsViewed.includes(index)) : [];

            if (targets?.length) {
                const currentItems = this.props.items?.map(item => item.props);
                onImpression(targets, currentItems, personalization);
            }
        }

        this.setState(prevState => {
            const updatedCurrentItems = [...new Set([...prevState.itemsViewed, ...visibleItemIndices])];

            return { itemsViewed: updatedCurrentItems };
        });
    };

    debouncedScrollHandler = Debounce.debounce(() => {
        this.handleScroll(true);
    }, DEBOUNCED_SCROLL_CALLBACK_DELAY);

    handleScrollPrev = () => {
        this.scroll('previous');
    };

    handleScrollNext = () => {
        this.scroll('next');
    };

    scroll = direction => {
        const list = this.listRef.current;
        const scrollAmount = this.rootRef.current.offsetWidth;
        const scrollDiff = direction === 'next' ? scrollAmount : -scrollAmount;

        list.scrollBy(scrollDiff, 0);

        this.fireAnalytics(direction);

        this.setState({ hadScroll: true });
    };

    fireAnalytics = direction => {
        const { title, analyticsCarouselName, sku } = this.props;

        let actionInfo;
        let linkName;
        let internalCampaign;
        const productCardCarouselTitle = anaConsts.COMPONENT_TITLE.ALT_IMAGE_CAROUSEL;
        const carouselName = analyticsCarouselName || (title && title.toLowerCase());

        if (carouselName !== productCardCarouselTitle && !this.props.isGalleryCarousel) {
            actionInfo = 'Carousel :: Navigation';
            linkName = 'Carousel :: Navigation';
            internalCampaign = `product:${carouselName}:slide:click ${direction}`;

            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo,
                    linkName,
                    internalCampaign,
                    eventStrings: [anaConsts.Event.EVENT_71],
                    imageIndex: this.getCurrentIndex(),
                    sku
                }
            });
        }

        if (carouselName === anaConsts.CAROUSEL_NAMES.SEE_IT_REAL) {
            CommunityGalleryBindings.ugcScrollMore();
        } else if (carouselName === anaConsts.CAROUSEL_NAMES.UGC_PRODUCT) {
            CommunityGalleryBindings.ugcProductSwipe();
        } else if (carouselName === anaConsts.CAROUSEL_NAMES.CSF_FEATURED_CAROUSEL && !this.state.hadScroll) {
            sendCSFFeaturedCarouselScrollEvent();
        }
    };

    scrollTo = pageIndex => {
        if (this.rootRef?.current?.offsetWidth) {
            const scrollAmount = this.rootRef.current.offsetWidth;
            this.listRef.current.scrollTo(scrollAmount * pageIndex, 0);

            if (pageIndex === 0 && this.props.isGalleryCarousel) {
                this.setState({
                    scrollCompleted: true
                });
            }
        }
    };

    scrollToItem = (_event, itemIndex) => {
        this.listRef.current.scrollTo(this.getItemWidth() * itemIndex, 0);
    };

    triggerCMSAnalytics = () => {
        const { items, onImpression, personalization = {} } = this.props;

        if (onImpression) {
            this.setState({ fireCMSAnalytics: true });
            const visibleItemIndices = this.getVisibleItemIndices();
            this.setState({ itemsViewed: visibleItemIndices, visibleItemIndices });
            const currentItems = items?.map(item => item.props);

            if (items && items?.length > 0) {
                onImpression(visibleItemIndices, currentItems, personalization);
            }
        }
    };

    initialize = () => {
        const list = this.listRef.current;
        const { isModal } = this.props;

        if (list) {
            list.style.scrollBehavior = 'auto';
            list.scrollLeft = 0;
            list.style.scrollBehavior = '';
        }

        if (isModal && !this.state.modalLoaded) {
            this.setState({ modalLoaded: true });
        }

        this.handleScroll();
    };

    componentDidMount() {
        this.initialize();
        window.addEventListener(DebouncedResize, this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.contextId !== this.props.contextId ||
            prevProps.isLoading !== this.props.isLoading ||
            prevProps.selectedThemeFilter !== this.props.selectedThemeFilter ||
            prevProps.title !== this.props.title ||
            prevState.modalLoaded !== this.state.modalLoaded ||
            prevProps.items?.length !== this.props.items?.length
        ) {
            this.initialize();
        }

        if (!this.state.fireCMSAnalytics && !this.props.isLoading && this.props.items?.length > 0) {
            this.triggerCMSAnalytics();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleScroll);
    }
}

Carousel.shouldUpdatePropsOn = ['contextId', 'items'];

Carousel.propTypes = {
    // A carousel context identifier. It describes what is this carousel is representing.
    // If a context changed - carousel internal properties should be set to default
    // E.g. product change, SKU change, a full context change from reviews to recommendations
    contextId: PropTypes.string,
    items: PropTypes.array,
    // Item width per slide. Set it to 'auto' for Carousel items that have different widths
    itemWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.string]),
    // Determines if the carousel items will expand to fill the entire container
    itemFlexGrow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // Gap/space between slides
    gap: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    // Hack for covering peaking box shadows when exceeding container max width
    hasShadowHack: PropTypes.bool,
    // Inner vertical padding to account for any box shadows (otherwise will get cut off by overflow)
    paddingY: PropTypes.number,
    // Outdenting
    marginX: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.string, PropTypes.bool]),
    // Scroll padding (where items will snap to)
    scrollPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.string, PropTypes.bool]),
    // Arrow style
    arrowVariant: PropTypes.oneOf(['circle', 'simple']),
    // Show arrows on hover
    showArrowOnHover: PropTypes.bool,
    // Disable arrows; reset scroll position on update
    isLoading: PropTypes.bool
};

Carousel.defaultProps = {
    arrowVariant: 'circle',
    showArrowOnHover: true,
    itemWidth: '100%',
    items: null
};

const styles = {
    innerWithHover: {
        '.no-touch &:hover .Carousel-control': {
            opacity: 1
        }
    },
    innerWithHoverGallery: {
        '.Carousel-control': {
            opacity: 1
        }
    },
    list: {
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        overscrollBehaviorX: 'none',
        scrollBehavior: 'smooth',
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': { display: 'none' }
    },
    listCentered: {
        '> :first-child': {
            marginLeft: 'auto'
        },
        '> :last-child': {
            marginRight: 'auto'
        }
    },
    listCardShadowCover: {
        '&::before, &::after': {
            content: '""',
            width: 10,
            backgroundColor: colors.white,
            position: 'absolute',
            top: 0,
            bottom: 0,
            zIndex: 1
        },
        '&::before': {
            left: 0
        },
        '&::after': {
            right: 0
        }
    },
    item: {
        scrollSnapAlign: 'start',
        flexShrink: 0,
        display: 'flex',
        '> *': {
            width: '100%',
            flexShrink: 0
        },
        '&:not([aria-hidden]):empty': {
            display: 'none'
        }
    },
    dots: {
        position: 'absolute'
    },
    carouselContainer: {
        ['@media (max-width: 768px)']: {
            marginLeft: space[2]
        }
    }
};

export default wrapComponent(Carousel, 'Carousel', true);
