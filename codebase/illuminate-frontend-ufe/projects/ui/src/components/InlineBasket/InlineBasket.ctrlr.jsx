/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import watch from 'redux-watch';
import addToBasketActions from 'actions/AddToBasketActions';
import auth from 'utils/Authentication';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import BasketUtils from 'utils/Basket';
import anaUtils from 'analytics/utils';
import UtilActions from 'utils/redux/Actions';
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
import { breakpoints } from 'style/config';
import {
    mediaQueries, site, space, colors
} from 'style/config';

import Dropdown from 'components/Dropdown/Dropdown';
import BasketDesktop from 'components/InlineBasket/BasketDesktop';
import BasketMobile from 'components/InlineBasket/BasketMobile/BasketMobile';
import CountCircle from 'components/CountCircle';
import inlineBasketActions from 'actions/InlineBasketActions';
import { HEADER_VALUE } from 'constants/authentication';

const { Media } = mediaUtils;

const ICON_SIZE = 24;
const ICON_PATH =
    'M23.498 10c.326 0 .566.28.487.57l-3.078 11.32c-.177.652-.816 1.11-1.55 1.11H4.643c-.733 0-1.371-.458-1.55-1.11L.015 10.57c-.079-.29.16-.57.487-.57h22.996zm-3.112 9.999H3.613l.453 1.668a.588.588 0 0 0 .576.414h14.716c.271 0 .509-.17.575-.414L20.386 20zm.815-3H2.797l.544 2h17.317l.543-2zm.816-3H1.981l.544 2h18.948l.544-2zm.839-3.08H1.144L1.71 13h20.579l.567-2.08zm-9.037-9.205l5.612 5.2a.5.5 0 1 1-.68.734l-5.612-5.2a1.674 1.674 0 0 0-2.278 0l-5.612 5.2a.5.5 0 1 1-.68-.734l5.612-5.2a2.674 2.674 0 0 1 3.638 0z';
const ICON_PATH_OPEN =
    'M21.397 20.472l-.516 2.088a1.631 1.631 0 01-1.582 1.245H4.741c-.75 0-1.402-.513-1.583-1.245l-.517-2.088h18.756zm.813-3.286l-.565 2.286H2.393l-.565-2.286H22.21zm.813-3.286l-.566 2.286H1.582L1.016 13.9h22.007zm.373-4.333c.355 0 .616.334.53.679L23.27 12.9H.77l-.654-2.654a.546.546 0 01.53-.679h22.75zM13.83 1.716l5.572 5.2a.5.5 0 01-.683.731l-5.572-5.201a1.647 1.647 0 00-2.256 0L5.319 7.647a.501.501 0 01-.682-.732l5.573-5.199a2.647 2.647 0 013.62 0z';

const styles = {
    anchor: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 0,
        height: site.headerHeight,
        paddingLeft: space[2],
        paddingRight: space[2],
        [mediaQueries.sm]: {
            height: '100%',
            alignSelf: 'center',
            paddingLeft: space[3],
            paddingRight: space[3],
            paddingTop: space[4],
            paddingBottom: space[4]
        }
    },
    iconWrap: { position: 'relative' },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE
    }
};

let cleanErrorTimeOut = null;
let resetNotificationTimeout = null;
let closeTimeOut = null;

/*
const Events = {
    DebouncedScroll: 'debouncedScroll',
    DebouncedResize: 'debouncedResize'
};
*/

function setAnalytics(navPath, checkoutString = null, event) {
    if (event) {
        event.preventDefault();
    }

    anaUtils.setNextPageData({
        navigationInfo: anaUtils.buildNavPath(navPath),
        linkData: checkoutString
    });
}

function setAnalyticsAndRedirect(navPath, checkoutString = null, event) {
    setAnalytics(navPath, checkoutString, event);
    urlUtils.redirectTo(BasketUtils.PAGE_URL);
}

function spaRedirect(navPath, event) {
    Location.navigateTo(event, navPath);
}

class InlineBasket extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            basket: {
                itemCount: 0,
                pickupBasket: { itemCount: 0 }
            },
            fixed: false,
            isOpen: false,
            isBasketPage: false
        };

        this.scrollRef = React.createRef();
        this.dropRef = React.createRef();
    }

    componentDidMount() {
        const basket = store.getState().basket;
        const watchBasket = watch(store.getState, 'basket');
        const watchIsOpen = watch(store.getState, 'inlineBasket.isOpen');
        const watchJustAdded = watch(store.getState, 'inlineBasket.justAddedProducts');
        const watchLocation = watch(store.getState, 'historyLocation');

        store.subscribe(
            watchJustAdded(justAdded => {
                this.handleJustAdded(justAdded);
            }),
            this
        );

        this.setState({
            basket: basket,
            isBasketPage: Location.isBasketPage()
        });

        if (!this.state.isBasketPage) {
            this.handleResize();
            import('utils/framework/Events').then(({ default: ImportEvents }) => {
                window.addEventListener(ImportEvents.DebouncedResize, this.handleResize);
            });
        }

        store.subscribe(
            watchLocation(() => {
                this.setState({ isBasketPage: Location.isBasketPage() });
            })
        );

        store.watchAction(inlineBasketActions.TYPES.PRODUCT_ADDED_TO_BASKET, data => {
            const sku = data.sku;

            if (sku?.skuId !== this.state.justAddedSku?.skuId) {
                this.setState({ justAddedSku: sku });
            }
        });

        store.subscribe(
            watchIsOpen(isOpen => {
                this.toggleOpen(isOpen);
                const timeToCloseBasket = 5000; // milliseconds

                if (closeTimeOut) {
                    closeTimeOut = this.clearTimeout(closeTimeOut);
                }

                closeTimeOut = setTimeout(() => {
                    store.dispatch(UtilActions.merge('inlineBasket', 'isOpen', false));
                }, timeToCloseBasket);

                const shouldSetInteractionTracking = !this.isLargeView && isOpen;

                shouldSetInteractionTracking &&
                    window.addEventListener(
                        'touchstart',
                        onTouch => {
                            if (this.props.basketOverlayRefs.portal.current.contains(onTouch.target)) {
                                this.toggleOpen(true);
                                closeTimeOut = this.clearTimeout(closeTimeOut);
                                closeTimeOut = setTimeout(() => {
                                    store.dispatch(UtilActions.merge('inlineBasket', 'isOpen', false));
                                }, timeToCloseBasket);
                            }

                            window.removeEventListener('touchstart', onTouch, false);
                        },
                        false
                    );
            }),
            this
        );

        store.subscribe(
            watchBasket(newBasket => {
                this.updateState(newBasket);
            }),
            this
        );
    }

    componentWillUnmount() {
        import('utils/framework/Events').then(({ default: ImportEvents }) => {
            window.removeEventListener(ImportEvents.DebouncedResize, this.handleResize);
        });
    }

    handleResize = () => {
        import('utils/framework/Events').then(({ default: ImportEvents }) => {
            this.isLargeView = window.matchMedia(breakpoints.smMin).matches;
            window[this.isLargeView ? 'addEventListener' : 'removeEventListener'](ImportEvents.DebouncedScroll, this.handleScroll);
        });
    };

    signInHandler = e => {
        e.stopPropagation();

        const analyticsData = {
            eventStrings: ['event14'],
            navigationInfo: anaUtils.buildNavPath(['top nav', 'basket', 'sign-in'])
        };
        auth.requireAuthentication(null, null, analyticsData, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    updateState = newBasket => {
        this.setState(
            {
                basket: newBasket,
                fixed: this.isLargeView && !this.isPositionTop()
            },
            () => {
                if (this.state.isBasketPage) {
                    return;
                }

                if (cleanErrorTimeOut) {
                    cleanErrorTimeOut = this.clearTimeout(cleanErrorTimeOut);
                }

                if (this.state.basket.error && this.state.basket.error.errorMessages) {
                    const timeToCleanError = 5000;

                    cleanErrorTimeOut = setTimeout(() => {
                        store.dispatch(addToBasketActions.showError());
                    }, timeToCleanError);
                }
            }
        );
    };

    clearTimeout = timeout => {
        window.clearTimeout(timeout);

        return null;
    };

    handleJustAdded = justAddedCount => {
        const timeToResetJustAddedNotification = 6000;
        this.setState({ justAddedProducts: justAddedCount });

        if (resetNotificationTimeout) {
            resetNotificationTimeout = this.clearTimeout(resetNotificationTimeout);
        }

        if (justAddedCount > 0) {
            resetNotificationTimeout = setTimeout(() => {
                store.dispatch(UtilActions.merge('inlineBasket', 'justAddedProducts', 0));
            }, timeToResetJustAddedNotification);
        }
    };

    /**
     * This method is only intended for large view (hover basket)
     */
    handleScroll = () => {
        const isCurrentlyOnTop = !this?.isPositionTop();

        if (this && this.state.isOpen && this.state.fixed !== isCurrentlyOnTop) {
            this.setState({ fixed: isCurrentlyOnTop });
        }
    };
    /**
     * This method is only intended for large view (hover basket)
     */
    isPositionTop = () => {
        if (!this.isLargeView) {
            return null;
        }

        return this.dropRef && this.dropRef.current && this.dropRef.current.rootRef.current.getBoundingClientRect().bottom > 0;
    };

    onBasketHoverClick = event => {
        if (this.state.isBasketPage) {
            return;
        }

        setAnalyticsAndRedirect(['top nav', 'hover basket', 'basket link'], null, event);
    };

    onBasketClick = event => {
        this.toggleOpen(false);
        setAnalytics(['top nav', 'basket'], null, event);

        if (Sephora.configurationSettings.spaEnabled) {
            const basketType = BasketUtils.getNextBasketTypeAuto();
            store.dispatch(addToBasketActions.setBasketType(basketType));
            spaRedirect(BasketUtils.PAGE_URL, event);
        } else {
            urlUtils.redirectTo(BasketUtils.PAGE_URL);
        }
    };

    onCheckoutClick = (event, data) => {
        const checkoutString = data ? data.navigationInfo : 'inline basket modal:checkout button'; // c55=
        setAnalytics(data ? data.linkData : ['top nav', 'hover basket', 'checkout'], checkoutString, event);

        this.setState({ isOpen: false });

        if (Sephora.configurationSettings.spaEnabled) {
            spaRedirect(BasketUtils.PAGE_URL, event);
        } else {
            urlUtils.redirectTo(BasketUtils.PAGE_URL);
        }
    };

    /* eslint-disable-next-line complexity */
    toggleOpen = forceIsOpen => {
        if (!this.state.isBasketPage) {
            if (!this.isLargeView && forceIsOpen === false) {
                store.dispatch(UtilActions.merge('inlineBasket', 'isOpen', false));
                store.dispatch(addToBasketActions.showError());
            }

            if (this.isLargeView && this.scrollRef && this.scrollRef.current) {
                this.scrollRef.current.scrollTop = 0;
            }

            let newIsOpenValue = typeof forceIsOpen === 'boolean' ? forceIsOpen : !this.state.isOpen;

            if (forceIsOpen.type === 'mouseenter' && this.state.isOpen === true) {
                newIsOpenValue = true;
            } else if (forceIsOpen.type === 'mouseleave' && this.state.isOpen === false) {
                newIsOpenValue = false;
            }

            if (newIsOpenValue && this.isLargeView && typeof this.state.justAddedProducts === 'undefined' && !this.state.hasRequestedRecs) {
                this.setState({ hasRequestedRecs: true });
            }

            this.setState({
                isOpen: newIsOpenValue,
                fixed: this.isLargeView && !this.isPositionTop()
            });

            if (typeof forceIsOpen === 'boolean' && this.dropRef.current) {
                // Keep dropdown state in sync for forced open actions
                this.dropRef.current.setState({ isOpen: newIsOpenValue });
            }
        }
    };

    getBasketIcon = (view, isAnchor = true) => {
        const getText = localeUtils.getLocaleResourceFile('components/InlineBasket/locales', 'InlineBasket');

        const { itemCount, pickupBasket } = this.state.basket;

        const { isOpen, isBasketPage } = this.state;

        const isClickable = isAnchor && (!isBasketPage || BasketUtils.hasPickupItems());
        const RootEl = isClickable ? 'a' : 'div';

        let pickupBasketItemCount;

        if (pickupBasket && pickupBasket.itemCount !== undefined) {
            pickupBasketItemCount = pickupBasket.itemCount;
        } else {
            pickupBasketItemCount = 0;
        }

        const totalItems = itemCount + pickupBasketItemCount;

        return (
            <RootEl
                css={isAnchor ? styles.anchor : null}
                {...(isClickable && {
                    onClick: this.onBasketClick,
                    href: BasketUtils.PAGE_URL
                })}
            >
                <div css={styles.iconWrap}>
                    <svg
                        css={styles.icon}
                        data-at={Sephora.debug.dataAt(`basket_icon${view ? '_' + view : ''}`)}
                        aria-label={getText('goToBasket')}
                    >
                        <path
                            d={isOpen || isBasketPage ? ICON_PATH_OPEN : ICON_PATH}
                            {...(this.props.showBlackSearchHeader && { fill: colors.white })}
                        />
                    </svg>
                    {totalItems > 0 && (
                        <CountCircle
                            aria-label={totalItems === 1 ? getText('item') : getText('items')}
                            key={`inlineBasketCount${totalItems}`}
                            data-at={Sephora.debug.dataAt('basket_count')}
                            children={totalItems}
                        />
                    )}
                </div>
            </RootEl>
        );
    };

    onTriggerToggleOpen = (...args) => {
        return this.isLargeView ? this.toggleOpen(...args) : null;
    };

    getBasketDropdown = () => {
        const { isOpen, fixed } = this.state;

        return (
            <Dropdown
                ref={this.dropRef}
                id='inline_basket'
                hasMaxHeight={true}
                position='static'
                hasCustomScroll={true}
                onTrigger={this.onTriggerToggleOpen}
                height='100%'
            >
                <Dropdown.Trigger
                    css={styles.anchor}
                    onClick={this.onBasketClick}
                    href={BasketUtils.PAGE_URL}
                >
                    {/* improve hover usability */}
                    <span
                        style={!isOpen ? { display: 'none' } : null}
                        css={{
                            position: 'absolute',
                            bottom: -16,
                            left: -16,
                            width: 32,
                            height: 32,
                            transform: 'rotate(-45deg)'
                        }}
                    />
                    {this.getBasketIcon('large', false)}
                </Dropdown.Trigger>
                <Dropdown.Menu
                    align='right'
                    width={this.props.dropWidth}
                    data-at={Sephora.debug.dataAt('inline_basket_popup_large')}
                    maxHeight={fixed && '100vh'}
                    css={
                        fixed && {
                            position: 'fixed',
                            top: 0,
                            width: 'inherit'
                        }
                    }
                >
                    <BasketDesktop
                        scrollRef={this.scrollRef}
                        signInHandler={this.signInHandler}
                        onCheckoutClick={this.onCheckoutClick}
                        onBasketClick={this.onBasketClick}
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    render() {
        return this.state.isBasketPage ? (
            this.getBasketIcon()
        ) : (
            <React.Fragment>
                <Media
                    at='xs'
                    // prevent icon jumping due to test
                    css={{ minWidth: ICON_SIZE + space[2] * 2 }}
                >
                    <BasketMobile
                        basketOverlayRefs={this.props.basketOverlayRefs}
                        isOpen={this.state.isOpen}
                        basket={this.state.basket}
                        toggleOpen={this.toggleOpen}
                        onCheckoutClick={this.onCheckoutClick}
                        justAddedSku={this.state.justAddedSku}
                    >
                        {this.getBasketIcon('small')}
                    </BasketMobile>
                </Media>
                <Media greaterThan='xs'>{this.getBasketDropdown()}</Media>
            </React.Fragment>
        );
    }
}

export default wrapComponent(InlineBasket, 'InlineBasket', true);
