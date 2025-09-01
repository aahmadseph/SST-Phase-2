/* eslint-disable no-prototype-builtins */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import store from 'Store';
import CarouselActions from 'actions/CarouselActions';
import ReactDOM from 'react-dom';
import keyConsts from 'utils/KeyConstants';
import actions from 'actions/Actions';
import { colors, space, screenReaderOnlyStyle } from 'style/config';
import UI from 'utils/UI';
import Arrow from 'components/Arrow/Arrow';
import Hammer from 'react-hammerjs';
import IconPlay from 'components/LegacyIcon/IconPlay';
import anaConsts from 'analytics/constants';
import languageLocale from 'utils/LanguageLocale';
import { load } from 'constants/events';

const { getLocaleResourceFile } = languageLocale;

const FIRST_ITEM = 0;
const FIRST_PAGE = 1;
const ITEM_FOCUS_DELAY = 100;

class LegacyCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.uniqueid = UI.uuid(3);
        this.toutItems = {};
        this.carouselPanels = {};
        this.carouselItems = {};
        this.state = {
            page: 1,
            numberOfPages: Math.ceil(props.totalItems / props.displayCount) || FIRST_PAGE,
            visibleArea: 0,
            scrollEnd: 0,
            posX: 0,
            isResize: false,
            currentActiveItem: '',
            currentHoverItem: -1,
            showPause: false
        };
        this.ARROWS = {
            NEXT: 'next',
            PREV: 'prev'
        };
    }

    componentDidMount() {
        if (UI.isIOS() && Hammer && Hammer.defaults) {
            Hammer.defaults.inputClass = Hammer.TouchMouseInput;
        }

        if (this.carousel) {
            // Adjust the carousel if the user is in a mobile
            // device and they change its orientation
            // https://jira.sephora.com/browse/ILLUPH-78406
            if (Sephora.isMobile()) {
                window.addEventListener('orientationchange', this.adjust);
            }

            // This is commented on recover
            Sephora.Util.onLastLoadEvent(window, [load], this.adjust);

            // For slideshows with timed animations/auto scroll
            if (this.props.isEnableCircle && this.props.delay) {
                this.play();
            }
        }

        document.addEventListener('keydown', this.handleComponentOnKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleComponentOnKeyDown, false);
    }

    componentWillReceiveProps(updatedProps) {
        if (updatedProps.totalItems !== this.props.totalItems) {
            this.setState(
                {
                    numberOfPages: Math.ceil(updatedProps.totalItems / updatedProps.displayCount) || FIRST_PAGE
                },
                () => this.moveTo(FIRST_PAGE)
            );
        }
    }

    componentDidUpdate() {
        if (this.state.currentActiveItem === '') {
            this.updateCurrentActiveItem(FIRST_ITEM, FIRST_PAGE, false);
        }
    }

    render() {
        const { intervalId } = this.state;
        const {
            isSlideshow = false,
            showArrows,
            showTouts,
            gutter,
            controlWidth = space[6],
            children,
            customStyle = {},
            podId,
            resultId,
            totalResults
        } = this.props;

        const isMobile = Sephora.isMobile();
        const hasPause = this.props.isEnableCircle && this.props.delay;
        const touts = this.getTouts(children);

        return (
            <div
                data-lload={this.props.lazyLoad}
                css={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
                data-at={Sephora.debug.dataAt('product_carousel')}
                data-cnstrc-recommendations
                data-cnstrc-recommendations-pod-id={podId}
                data-cnstrc-result-id={resultId}
                data-cnstrc-num-results={totalResults}
            >
                {isSlideshow || (
                    <div
                        key={`wrapper_${this.uniqueid}_0`}
                        role='tablist'
                        css={
                            showTouts
                                ? {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: space[5]
                                }
                                : screenReaderOnlyStyle
                        }
                        style={this.props.isSkeleton ? { visibility: 'hidden' } : null}
                    >
                        {touts}
                    </div>
                )}
                <div
                    key={`wrapper_${this.uniqueid}_${isSlideshow ? '0' : '1'}`}
                    onMouseEnter={hasPause ? this.showPause : null}
                    css={[
                        {
                            position: 'relative',
                            order: -1
                        },
                        showArrows &&
                            !isSlideshow && {
                            paddingLeft: controlWidth + 'px',
                            paddingRight: controlWidth + 'px'
                        }
                    ]}
                >
                    {isSlideshow && (
                        <div
                            key={`wrapper_${this.uniqueid}_0`}
                            role='tablist'
                            css={
                                showTouts
                                    ? {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: space[2],
                                        left: 0,
                                        zIndex: 1
                                    }
                                    : screenReaderOnlyStyle
                            }
                        >
                            {touts}
                        </div>
                    )}
                    <div
                        key={`wrapper_${this.uniqueid}_${isSlideshow ? '1' : '0'}`}
                        css={styles.carouselWrap}
                        ref={carousel => {
                            if (carousel && carousel.querySelector) {
                                /* Latest react-hammerjs (needed for react 16) has a bug with
                                inner refs. Temporary workaround till issue is resolved.

                                See: https://github.com/JedWatson/react-hammerjs/issues/83 */
                                this.carousel = carousel.querySelector('[data-hammer-carousel-inner]');
                            }
                        }}
                    >
                        <Hammer
                            onSwipe={this.handleSwipe}
                            options={{
                                recognizers: {
                                    swipe: { enable: Sephora.isTouch },
                                    pan: { enable: false },
                                    press: { enable: false },
                                    tap: { enable: false }
                                }
                            }}
                        >
                            <div
                                tabIndex='-1'
                                data-hammer-carousel-inner
                                css={[
                                    {
                                        display: 'flex',
                                        transform: `translate3d(${this.state.posX}px, 0, 0)`
                                    },
                                    this.state.isResize || {
                                        transition: 'transform 300ms'
                                    },
                                    gutter && {
                                        marginLeft: -(gutter / 2) + 'px',
                                        marginRight: -(gutter / 2) + 'px'
                                    },
                                    this.props.isCenteredItems && {
                                        justifyContent: 'center'
                                    },
                                    customStyle.inner
                                ]}
                            >
                                {this.getCarouselTabPanels(children)}
                            </div>
                        </Hammer>
                    </div>
                    {showArrows && this.getArrows()}
                    {hasPause && (
                        <div
                            key={`wrapper_${this.uniqueid}_${isSlideshow ? '4' : '3'}`}
                            css={[styles.pauseWrap, isMobile && { fontSize: 14 }, this.state.showPause || { opacity: 0 }]}
                        >
                            <button
                                type='button'
                                onFocus={this.showPause}
                                css={styles.pauseBtn}
                                aria-label={this.animationButtonAriaLabel()}
                                onClick={this.playOrPause}
                            >
                                <IconPlay isPause={intervalId} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    getTouts = children => {
        if (this.props.totalItems <= this.props.displayCount) {
            return null;
        }

        const isMobile = Sephora.isMobile();
        const { isSlideshow } = this.props;
        const { page, numberOfPages } = this.state;

        const pages = [];

        for (let i = 1; i <= numberOfPages; i++) {
            const child = children[i - 1];
            const isVideo = child && child.props.isVideo;
            const isCurrentSlide = i === page;
            const dotSize = isMobile ? 8 : 10;
            const dotColor = isCurrentSlide ? colors.black : colors.midGray;
            const toutName = `tout_${this.uniqueid}_${i}`;
            pages.push(
                <button
                    ref={ref => (this.toutItems ? (this.toutItems[toutName] = ref) : undefined)}
                    key={i.toString()}
                    id={`tab_${this.uniqueid}_${i}`}
                    aria-controls={`tabPanel_${this.uniqueid}_${i}`}
                    aria-selected={isCurrentSlide}
                    aria-label={'Slide ' + i}
                    role='tab'
                    type='button'
                    onClick={() => this.moveTo(i)}
                    css={{
                        marginLeft: 3,
                        marginRight: 3,
                        lineHeight: 0
                    }}
                >
                    {isVideo ? (
                        <Arrow
                            direction='right'
                            size={dotSize + 5}
                            marginLeft='1px'
                            color={dotColor}
                        />
                    ) : (
                        <div
                            css={[
                                {
                                    borderRadius: 99999,
                                    width: dotSize,
                                    height: dotSize
                                },
                                isSlideshow
                                    ? {
                                        border: `1px solid ${colors.white}`,
                                        boxShadow: '0 0 4px rgba(0,0,0,.5)',
                                        backgroundColor: isCurrentSlide && colors.white
                                    }
                                    : { backgroundColor: dotColor }
                            ]}
                        />
                    )}
                </button>
            );
        }

        return pages;
    };

    getCarouselTabPanels = children => {
        const { page } = this.state;
        const { gutter, displayCount } = this.props;

        const panels = [];

        for (let i = 0; i < children.length; i += displayCount) {
            const currentPage = children.slice(i, i + displayCount);
            const tabPanelIndex = panels.length + 1;
            const isActive = page - 1 === panels.length;
            const panelId = `${this.uniqueid}_${tabPanelIndex}`;
            panels.push(
                <div
                    ref={ref => (this.carouselPanels[panelId] = ref)}
                    key={`tabPanel_${panelId}`}
                    id={`tabPanel_${panelId}`}
                    role='tabpanel'
                    tabIndex={0}
                    aria-labelledby={`tab_${panelId}`}
                    css={{
                        display: 'flex',
                        flexShrink: 0,
                        width: '100%'
                    }}
                >
                    {React.Children.map(currentPage, (child, childIndex) => {
                        const newProps = {
                            ...child.props,
                            productStringContainerName: child.props.rootContainerName || anaConsts.COMPONENT_TITLE.SEPHORA_CAROUSEL
                        };

                        // do not need for skeletons
                        if (this.props.isSkeleton) {
                            delete newProps.productStringContainerName;
                        }

                        const item = React.cloneElement(child, newProps);
                        const itemName = `${panelId}_${childIndex}`;

                        return (
                            <div
                                key={`tabItem_${itemName}`}
                                id={`tabItem_${itemName}`}
                                tabIndex={isActive ? '0' : '-1'}
                                ref={ref => (this.carouselItems[itemName] = ref)}
                                css={[
                                    { flexShrink: 0 },
                                    this.props.isFlexItem && { display: 'flex' },
                                    gutter && {
                                        paddingLeft: gutter / 2,
                                        paddingRight: gutter / 2
                                    },
                                    this.props.itemStyle,
                                    !Sephora.isTouch && childIndex === this.state.currentHoverItem && this.props.hoverItemStyle,
                                    this.state.currentActiveItem === itemName && this.props.activeItemStyle
                                ]}
                                onClick={() => this.updateCurrentActiveItem(childIndex, tabPanelIndex)}
                                onMouseEnter={e => this.toggleHover(e, childIndex, tabPanelIndex)}
                                onMouseLeave={e => this.toggleHover(e, childIndex, tabPanelIndex)}
                                onMouseMove={e => this.toggleMoveOver(e, childIndex, tabPanelIndex)}
                                style={{ width: (displayCount ? (1 / displayCount) * 100 : 100) + '%' }}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return panels;
    };

    getArrows = () => {
        const getText = getLocaleResourceFile('components/LegacyCarousel/locales', 'LegacyCarousel');
        const {
            isSlideshow, displayCount, controlWidth = space[6], totalItems, isSkeleton
        } = this.props;

        const { page, numberOfPages } = this.state;

        const controlStyle = nav => [
            {
                fontSize: 36,
                lineHeight: 0,
                height: this.props.controlHeight,
                overflow: 'hidden',
                position: 'absolute',
                textAlign: nav === this.ARROWS.PREV ? 'left' : 'right',
                left: nav === this.ARROWS.PREV ? 0 : null,
                right: nav === this.ARROWS.NEXT ? 0 : null,
                '&:disabled': { color: colors.lightGray },
                '&:not(:disabled):hover': { color: colors.gray },
                '& > svg': {
                    width: '.5em',
                    height: '1em',
                    fill: 'currentColo =  =>r'
                }
            },
            isSlideshow
                ? {
                    backgroundColor: colors.white,
                    padding: space[3]
                }
                : {
                    top: 0,
                    width: controlWidth
                },
            this.props.isCenteredControls && {
                top: '50%',
                transform: 'translate(0, -50%)'
            },
            (isSlideshow || totalItems <= displayCount) && { '&:disabled': { visibility: 'hidden' } },
            this.props.controlStyles
        ];

        const isControlDisabled = nav =>
            ((nav === 'prev' && page === 1) || (nav === 'next' && page === numberOfPages) || numberOfPages <= 1) && !this.props.isEnableCircle;

        return (
            <>
                <button
                    key={`wrapper_${this.uniqueid}_${isSlideshow ? '2' : '1'}`}
                    aria-label={getText('previous')}
                    css={controlStyle(this.ARROWS.PREV)}
                    onClick={this.previousPage}
                    data-at={Sephora.debug.dataAt('carousel_prev')}
                    disabled={isSkeleton ? true : isControlDisabled(this.ARROWS.PREV)}
                >
                    <svg viewBox='0 0 16 32'>
                        <path d='M2.2 16.052l13.5-14.33c.1-.098.3-.397.3-.695 0-.498-.4-.995-.9-.995-.3 0-.5.2-.6.298L.4 15.256c-.2.298-.4.497-.4.796 0 .298.1.398.2.497l.1.1L14.5 31.67c.1.1.3.3.6.3.5 0 .9-.5.9-.996 0-.3-.2-.498-.3-.697L2.2 16.05z' />
                    </svg>
                </button>
                <button
                    key={`wrapper_${this.uniqueid}_${isSlideshow ? '3' : '2'}`}
                    aria-label={getText('next')}
                    css={controlStyle(this.ARROWS.NEXT)}
                    onClick={this.nextPage}
                    data-at={Sephora.debug.dataAt('carousel_next')}
                    disabled={isSkeleton ? true : isControlDisabled(this.ARROWS.NEXT)}
                >
                    <svg viewBox='0 0 16 32'>
                        <path d='M13.8 15.952L.3 30.28c-.1.1-.3.398-.3.697 0 .497.4.995.9.995.3 0 .5-.2.6-.3L15.6 16.75c.2-.298.4-.497.4-.796 0-.298-.1-.398-.2-.497l-.1-.1L1.5.33C1.4.23 1.2.032.9.032c-.5 0-.9.497-.9.995 0 .298.2.497.3.696l13.5 14.23z' />
                    </svg>
                </button>
            </>
        );
    };

    showPause = () => {
        this.setState({ showPause: true });
    };

    play = () => {
        const intervalId = setInterval(() => this.nextPage(), this.props.delay);
        this.setState({ intervalId: intervalId });
    };

    pause = () => {
        clearInterval(this.state.intervalId);
        this.setState({ intervalId: false });
    };

    playOrPause = () => {
        this.state.intervalId ? this.pause() : this.play();
    };

    adjust = (callback = () => {}) => {
        UI.requestFrame(() => {
            // Make sure this.carousel exists. It might NOT exist if it has no children
            const width = this.carousel && this.carousel.getBoundingClientRect().width;
            const totalItems = this.props.totalItems || this.props.children.length;
            let totalWidth = width * (totalItems / this.props.displayCount);

            if (this.props.fillTrailedGap) {
                totalWidth += width;
            }

            if (width) {
                this.setState(
                    {
                        visibleArea: width,
                        scrollEnd: width * (Math.ceil(totalItems / this.props.displayCount) - 1),
                        totalWidth: totalWidth,
                        posX: -(width * (this.state.page - 1)),
                        isResize: true
                    },
                    () => {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                );
            }
        });
    };

    handleSwipe = e => {
        const DIRECTION = {
            NEXT: 2,
            PREV: 4
        };

        if (Sephora.isTouch) {
            if (e.direction === DIRECTION.NEXT) {
                this.nextPage();
            } else if (e.direction === DIRECTION.PREV) {
                this.previousPage();
            }
        }
    };

    nextPage = () => {
        const isCircle = this.props.isEnableCircle;

        // For single loop auto scroll, clear the interval on the second to last page
        if (this.state.page === this.state.numberOfPages - 1 && this.props.autoStart === 2) {
            this.pause();
        }

        if (isCircle && (this.isLastPage() || -this.state.posX > this.state.scrollEnd)) {
            // Copy of first page at the end is past the scrollEnd position,
            // so scroll past the boundaries to the copy
            if (this.isLastPage()) {
                this.setState({
                    posX: this.state.posX - this.state.visibleArea,
                    page: 1,
                    isResize: false
                });
            } else {
                // Snap to first page then scroll right
                this.setState(
                    {
                        page: 1,
                        posX: 0,
                        isResize: true
                    },
                    () => this.moveTo(this.state.page + 1)
                );
            }
        } else {
            if (this.state.page < this.state.numberOfPages) {
                this.moveTo(this.state.page + 1);
            }
        }

        if (typeof this.props.rightArrowCallback !== 'undefined') {
            this.props.rightArrowCallback();
        }
    };

    previousPage = () => {
        if (this.props.isEnableCircle && this.isFirstPage()) {
            // Snap to copied page at the end then scroll left to final page
            this.setState({ isResize: true }, () => this.moveTo(this.state.numberOfPages));
        } else {
            if (this.state.page > 1) {
                this.moveTo(this.state.page - 1);
            }
        }

        if (typeof this.props.leftArrowCallback !== 'undefined') {
            this.props.leftArrowCallback();
        }
    };

    moveTo = page => {
        this.adjust(() => {
            this.setState(
                {
                    posX: page > 1 ? Math.max(-(this.state.visibleArea * (page - 1)), -this.state.totalWidth + this.state.visibleArea) : 0,
                    isResize: false,
                    page: page
                },
                () => {
                    const lastLoadedPage = Math.ceil(this.props.children.length / this.props.displayCount);

                    if (lastLoadedPage === page && typeof this.props.onLastItemVisible === 'function') {
                        this.props.onLastItemVisible();
                    }
                }
            );
        });
    };

    isLastPage = () => {
        return this.state.page === this.state.numberOfPages;
    };

    isFirstPage = () => {
        return this.state.page === 1;
    };

    getCurrentPage = () => {
        return this.state.page;
    };

    getCurrentActiveItem = () => {
        const { currentActiveItem } = this.state;
        const itemId = currentActiveItem.split('_');
        itemId.shift();

        let childIndex = parseInt(itemId[itemId.length - 1]);
        const panelIndex = parseInt(itemId[itemId.length - 2]);

        if (panelIndex > 1) {
            childIndex = (parseInt(panelIndex) - 1) * 3 + childIndex;
        }

        return childIndex;
    };

    getTotalItems = () => {
        return this.props.totalItems;
    };

    getDisplayCount = () => {
        return this.props.displayCount;
    };

    updateCurrentActiveItem = (itemIndex, panelIndex, dispatchAction = true) => {
        const { name, analyticsContext, toggleOpen } = this.props;
        const itemId = `${this.uniqueid}_${panelIndex}_${itemIndex}`;
        this.setState({ currentActiveItem: itemId });
        const carouselName = name || 'Sephora Carousel';

        if (dispatchAction) {
            if (analyticsContext === anaConsts.PAGE_TYPES.ADD_TO_BASKET_MODAL) {
                if (toggleOpen) {
                    toggleOpen(false);
                }

                store.dispatch(actions.showAddToBasketModal({ isOpen: false }));
            }

            store.dispatch(CarouselActions.carouselItemClicked(carouselName, itemIndex, panelIndex));
        }
    };

    toggleHover = (event, itemIndex, panelIndex) => {
        if (!Sephora.isTouch) {
            const isHovered = event.type === 'mouseenter';
            const targetBoundaries = event.target.getBoundingClientRect();
            const offsetObj = {
                x: event.clientX - targetBoundaries.left,
                y: event.clientY - targetBoundaries.top
            };

            this.setState({ currentHoverItem: isHovered ? itemIndex : -1 });

            store.dispatch(CarouselActions.carouselItemHovered(this.props.name, itemIndex, panelIndex, isHovered, offsetObj));
        }
    };

    toggleMoveOver = (event, itemIndex, panelIndex) => {
        if (!Sephora.isTouch) {
            const targetBoundaries = event.target.getBoundingClientRect();
            const offsetObj = {
                x: event.clientX - targetBoundaries.left,
                y: event.clientY - targetBoundaries.top
            };

            store.dispatch(CarouselActions.carouselItemMovedOver(this.props.name, itemIndex, panelIndex, offsetObj));
        }
    };

    handleActionKeyNavigation = target => {
        if (target) {
            if (target.id) {
                const elementId = target.id.split('_');
                elementId.shift();
                const childIndex = elementId[elementId.length - 1];
                const panelIndex = elementId[1];
                this.updateCurrentActiveItem(childIndex, panelIndex);
            } else if (target.onClick && typeof target.onClick === 'function') {
                target.onClick();
            }
        }
    };

    handleRightKeyNavigation = target => {
        const { page, numberOfPages } = this.state;

        if (target && target.id) {
            const elementId = target.id.split('_');
            elementId.shift();
            const elementRef = elementId.join('_');

            if (elementRef) {
                if (this.carouselPanels.hasOwnProperty(elementRef)) {
                    this.nextPage();
                }

                if (this.carouselItems.hasOwnProperty(elementRef)) {
                    if (target.nextSibling) {
                        target.nextSibling.focus();
                    } else {
                        if (page < numberOfPages) {
                            this.nextPage();
                            setTimeout(() => {
                                const newElementRef = `${this.uniqueid}_${page + 1}_0`;
                                const element = ReactDOM.findDOMNode(this.carouselItems[newElementRef]);

                                if (element) {
                                    element.focus();
                                }
                            }, ITEM_FOCUS_DELAY);
                        }
                    }
                }

                if (this.toutItems.hasOwnProperty(elementRef)) {
                    if (target.nextSibling) {
                        target.nextSibling.focus();
                    }
                }
            }
        }

        if (target && target.tagName === 'A' && target.nextSibling) {
            target.nextSibling.focus();
        }
    };

    handleLeftKeyNavigation = target => {
        const { page } = this.state;

        if (target && target.id) {
            const elementId = target.id.split('_');
            elementId.shift();
            const elementRef = elementId.join('_');

            if (elementRef) {
                if (this.carouselPanels.hasOwnProperty(elementRef)) {
                    this.previousPage();
                } else if (this.carouselItems.hasOwnProperty(elementRef)) {
                    if (target.previousSibling) {
                        target.previousSibling.focus();
                    } else {
                        if (page > 0) {
                            this.previousPage();
                            setTimeout(() => {
                                const newElementRef = `${this.uniqueid}_${page - 1}_${this.props.displayCount - 1}`;
                                const element = ReactDOM.findDOMNode(this.carouselItems[newElementRef]);

                                if (element) {
                                    element.focus();
                                }
                            }, ITEM_FOCUS_DELAY);
                        }
                    }
                } else if (this.toutItems.hasOwnProperty(elementRef)) {
                    if (target.previousSibling) {
                        target.previousSibling.focus();
                    }
                }
            }
        }

        if (target && target.tagName === 'A' && target.previousSibling) {
            target.previousSibling.focus();
        }
    };

    handleComponentOnKeyDown = e => {
        const { key, target } = e;

        if (key === keyConsts.RIGHT) {
            this.handleRightKeyNavigation(target);
        }

        if (key === keyConsts.LEFT) {
            this.handleLeftKeyNavigation(target);
        }

        if (key === keyConsts.ENTER) {
            this.handleActionKeyNavigation(target);
        }
    };

    animationButtonAriaLabel = () => {
        const { intervalId } = this.state;
        const getText = getLocaleResourceFile('components/LegacyCarousel/locales', 'LegacyCarousel');

        return getText(intervalId ? 'pauseAnimationLabel' : 'playAnimationLabel');
    };
}

LegacyCarousel.propTypes = {
    /** Items */
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    /** Items per slide */
    displayCount: PropTypes.number.isRequired,
    /** Total item count */
    totalItems: PropTypes.number.isRequired,
    /** Display control arrows */
    showArrows: PropTypes.bool,
    /** Callback function for clicking left arrow */
    leftArrowCallback: PropTypes.func,
    /** Callback function for clicking right arrow */
    rightArrowCallback: PropTypes.func,
    /** Space inbetween carousel items */
    gutter: PropTypes.number,
    /** Display the carousel item as flex item */
    isFlexItem: PropTypes.bool,
    /** Sets height of control arrows */
    controlHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Sets width of control arrows (excluding `isSlideshow`) */
    controlWidth: PropTypes.number,
    /** Custom control arrow styles */
    controlStyles: PropTypes.object,
    /** Center arrows vertically */
    isCenteredControls: PropTypes.bool,
    /** Center carousel items horizontally */
    isCenteredItems: PropTypes.bool,
    /** Circulate slides */
    isEnableCircle: PropTypes.bool,
    /** Display touts (small circle controls) */
    showTouts: PropTypes.bool,
    /** Display as slideshow style */
    isSlideshow: PropTypes.bool,
    /** Slideshow delay: auto change slides; requires `isEnableCircle` */
    delay: PropTypes.number,
    /** Additional styles */
    customStyle: PropTypes.object
};

LegacyCarousel.defaultProps = {
    controlHeight: '100%'
};

const styles = {
    carouselWrap: {
        position: 'relative',
        overflow: 'hidden',
        order: -1
    },
    pauseWrap: {
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 18,
        marginTop: '.375em'
    },
    pauseBtn: {
        padding: space[2],
        margin: -space[2],
        lineHeight: 0
    }
};

export default wrapComponent(LegacyCarousel, 'LegacyCarousel', true);
