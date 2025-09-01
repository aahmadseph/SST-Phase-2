/* eslint-disable complexity, camelcase */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Flex, Link, Button, Divider, Grid, Container
} from 'components/ui';
import Loader from 'components/Loader/Loader';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BeautyInsiderSection from 'components/OrderConfirmation/BeautyInsiderSection/BeautyInsiderSection';
import OrderItemList from 'components/OrderConfirmation/OrderItemList/OrderItemList';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import ConstructorCarousel from 'components/ConstructorCarousel';
import OrderUtils from 'utils/Order';
import Address from 'components/Addresses/Address';
import userUtils from 'utils/User';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import GuestCheckoutSection from 'components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import StoreHours from 'components/Stores/StoreDetails/StoreHours';
import StoreAddress from 'components/Stores/StoreDetails/StoreAddress';
import OrderSummary from 'components/Checkout/OrderSummary/OrderSummary';
import storeUtils from 'utils/Store';
import postCheckoutUtils from 'utils/PostCheckout';
import store from 'store/Store';
import actions from 'Actions';
import mediaUtils from 'utils/Media';
import agentAwareUtils from 'utils/AgentAware';
import FulfillmentStatus from 'components/OrderConfirmation/FulfillmentStatus';
import PromoNotifications from 'components/OrderConfirmation/PromoNotifications';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import { CURBSIDE_PICKUP_ID } from 'utils/CurbsidePickup';
import SddSections from 'components/OrderConfirmation/SddSections';
import AlternatePickup from 'components/Checkout/Sections/AlternatePickup';
import PickupPerson from 'components/SharedComponents/AccessPoint/PickupPerson/PickupPerson';
import SDUBanner from 'components/OrderConfirmation/SDUBanner';
import { leftColWidth } from 'components/SharedComponents/AccessPoint/PickupPerson/constants';
import SmsOptInBanner from 'components/SmsOptInBanner';
import { colors } from 'style/config';
import RoktAdPlacement from 'components/RoktAdPlacement';
import { getRoktIdentifier } from 'utils/adUtils';
import myListsUtils from 'utils/MyLists';
import { MIN_ITEMS_PER_PAGE, MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE } from 'constants/sharableList';

import biApi from 'services/api/beautyInsider';
import LoveActions from 'actions/LoveActions';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import BiProfile from 'utils/BiProfile';
import checkoutUtils from 'utils/Checkout';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import CookieUtils from 'utils/Cookies';
import AddToBasketActions from 'actions/AddToBasketActions';
import Actions from 'actions/Actions';
import headersUtils from 'utils/Headers';
import { ORDER_TYPE } from 'constants/TestTarget';
import cmsApi from 'services/api/cms';
import { globalModals } from 'utils/globalModals';
import getModal from 'services/api/cms/getModal';
import ComponentList from 'components/Content/ComponentList';
import RichText from 'components/Content/RichText';
import contentConstants from 'constants/content';
import { getRefererLink } from 'analytics/utils/cmsReferer';
import { sendSOTLinkTrackingClickEvent } from 'analytics/utils/sotTracking';
import Empty from 'constants/empty';

const { CONTEXTS } = contentConstants;
const { BOPIS_ORDER_CONFIRMATION_CONTENT } = globalModals;
const { Media } = mediaUtils;
const { userXTimestampHeader } = headersUtils;
const { SHIPPING_GROUPS, isHalAddress, ROPIS_CONSTANTS } = OrderUtils;

const isBIAutoEnrollEnabled = Sephora.configurationSettings.isBIAutoEnrollEnabled && localeUtils.isUS();
const PURCHASE_EVENT_EXPIRY = Storage.MINUTES * 1;
const ROPIS_WHAT_TO_EXPECT_MEDIA_ID = 88400021;

const { HEADER_LEVEL_ORDER_STATUS } = ROPIS_CONSTANTS;

let readyForAnalytics;

class OrderConfirmation extends BaseClass {
    state = {
        orderDetails: {},
        header: {},
        biInfo: null,
        itemsInBasketCount: 0,
        showBirthdayForAutoEnrolled: false,
        showBeautyInsiderSection: false,
        biStatus: userUtils.types.NON_BI,
        hasAllTraits: false,
        contentData: null,
        biFormTestType: 'default',
        params: {}
    };

    componentDidMount() {
        Storage.session.removeItem(LOCAL_STORAGE.IS_BIREGISTER_MODAL_DISMISSED);
        store.dispatch(AddToBasketActions.setBasketType(''));
        const constructorPurchaseEventSent = Storage.local.getItem(LOCAL_STORAGE.CONSTRUCTOR_PURCHASE_EVENT_ORDER_CONF);

        store.setAndWatch(
            'order.orderDetails',
            this,
            orderData => {
                const orderDetails = orderData.orderDetails;

                if (!orderDetails.isInitialized) {
                    return;
                }

                if (orderDetails.biPoints) {
                    this.setBiInfo(orderDetails.biPoints);
                } else {
                    const profileId = store.getState().user?.profileId;

                    if (profileId) {
                        biApi.getBiPoints(profileId, BiProfile.SOURCES.ORDER_CONFIRMATION, this.state.orderDetails.header.orderId).then(biInfo => {
                            this.setBiInfo(biInfo);
                        });
                    }
                }

                this.setState({
                    pickupOrderStates: orderDetails.pickup && orderDetails.pickup.pickupOrderStates,
                    header: orderDetails.header
                });
                const orderId = orderDetails.header.orderId;
                const biAccountId = orderDetails.header?.profile?.beautyInsiderAccount?.biAccountId;
                const isRopisOrder = orderDetails.header?.isRopisOrder;
                const isBopisOrder = orderDetails.header?.isBopisOrder;
                const isSameDayOrder = orderDetails.header?.isSameDayOrder;
                const products = [];
                const digitalGiftMsgSid = orderDetails?.digitalGiftMsg?.sid;
                const languageSid = orderDetails?.digitalGiftMsg?.language_sid;

                this.setLastOrderType(isBopisOrder, isSameDayOrder);

                orderDetails.items.items.map(item => products.push({ id: item.sku.productId }));

                const params = { itemIds: products.map(a => a.id) };
                this.setState({ params: params });

                let items = [];
                orderDetails.items.items.forEach(item => {
                    const skuData = {
                        item_id: item.sku.productId,
                        variation_id: item.sku.skuId
                    };

                    if (item.qty === 1) {
                        items.push(skuData);
                    } else {
                        const newSkuData = new Array(item.qty).fill(skuData);
                        items = [...items, ...newSkuData];
                    }
                });

                // Referrer tracking
                digitalData.page.refererLink = getRefererLink();

                //PageLoad Analytics
                digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CHECKOUT;
                digitalData.page.pageInfo.pageName = isRopisOrder
                    ? anaConsts.PAGE_NAMES.RESERVE_CONFIRMATION
                    : isBopisOrder
                        ? anaConsts.PAGE_NAMES.BOPIS_CONFIRMATION
                        : isSameDayOrder
                            ? anaConsts.PAGE_NAMES.SAMEDAY_CONFIRMATION
                            : anaConsts.PAGE_NAMES.ORDER_CONFIRMATION;
                digitalData.page.pageInfo.language = localeUtils.getCurrentLanguage();

                if (digitalGiftMsgSid && languageSid) {
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            eVar130: `${languageSid}:${digitalGiftMsgSid}`,
                            eventStrings: [anaConsts.Event.ORDER_CONFIRMATION_GIFT_MESSAGE_ADDED]
                        }
                    });
                }

                // PL S@K Store ID tracking
                this.includeBopisOrderAnalytics(orderDetails);

                if (checkoutUtils.isGuestOrder()) {
                    digitalData.page.attributes.isGuestOrder = true;

                    if (orderDetails.header.guestProfile.isEmailRegistered) {
                        digitalData.page.attributes.isGuestEmailRegistered = true;
                    }

                    this.setState({ biFormTestType: 'popupModalWithPasswordFieldAndBI' });

                    store.setAndWatch('user', this, () => {
                        /*
                         * The conditional is placed inside the watcher's callback in order to avoid
                         * the undesired display of the BI register modal.
                         *
                         * That edge case can happen when you close/dismiss the modal but some call is
                         * *completed* _after_ the dismiss and then triggers this watcher. In that scenario,
                         * we have to check each time the callback is called. Also, calling the `Storage`
                         * directly withing the callback's scope avoids creating a closure that can hold
                         * imprecise data.
                         *
                         */

                        if (!Storage.session.getItem(LOCAL_STORAGE.IS_BIREGISTER_MODAL_DISMISSED)) {
                            const { isEmailRegistered, isNonBIRegisteredUser, email, isStoreBIMember } = orderDetails.header.guestProfile;
                            const shippingAddress = orderDetails.shippingGroups?.shippingGroupsEntries?.[0]?.shippingGroup?.address || Empty.Object;
                            const billingAddress = orderDetails.paymentGroups?.paymentGroupsEntries?.[0]?.paymentGroup?.address || Empty.Object;

                            if (CookieUtils.isRCPSCCEnabled() && isEmailRegistered) {
                                store.dispatch(
                                    Actions.showSignInModal({
                                        isOpen: true,
                                        email: email,
                                        isOrderConfirmation: true,
                                        extraParams: {
                                            orderId: orderId
                                        }
                                    })
                                );
                            } else {
                                store.dispatch(
                                    Actions.showBiRegisterModal({
                                        isOpen: true,
                                        extraParams: {
                                            isExistingUser: isEmailRegistered,
                                            isNonBIRegisteredUser: isNonBIRegisteredUser,
                                            guestEmail: email,
                                            guestProfileId: biAccountId,
                                            biPoints: orderDetails.items?.potentialBeautyBankPoints || '0',
                                            isStoreBIMember: isStoreBIMember,
                                            biFormTestType: 'popupModalWithPasswordFieldAndBI',
                                            orderId: orderId,
                                            biAccountId: biAccountId,
                                            firstName: billingAddress.firstName || shippingAddress.firstName || '',
                                            lastName: billingAddress.lastName || shippingAddress.lastName || ''
                                        }
                                    })
                                );
                            }
                        }
                    });
                }

                // Checkout button click ananytics
                const prevPageData = anaUtils.getPreviousPageData();

                if (
                    (isRopisOrder || isBopisOrder) &&
                    (prevPageData?.customData?.clickRopisCompleteReservation || prevPageData?.customData?.clickBopisPlaceOrder)
                ) {
                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            actionInfo: isBopisOrder ? anaConsts.LinkData.BOPIS_ORDER_COMPLETE : anaConsts.LinkData.ROPIS_RESERVATION_COMPLETE,
                            linkName: 'D=c55',
                            eventStrings: [anaConsts.Event.EVENT_71]
                        }
                    });
                }

                // UTS-561 Google Analytics ROPIS Reservation Event
                if (isRopisOrder) {
                    Sephora.analytics.promises.tagManagementSystemReady.then(() => {
                        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.ROPIS_ORDER));
                    });
                }

                // UTS-1563 BOPIS Reservation Event for analytics
                if (isBopisOrder) {
                    Sephora.analytics.promises.tagManagementSystemReady.then(() => {
                        processEvent.process(anaConsts.EVENT_NAMES.BOPIS_ORDER, {});
                    });
                    userXTimestampHeader();
                }

                if (isSameDayOrder) {
                    Sephora.analytics.promises.tagManagementSystemReady.then(() => {
                        window.dispatchEvent(new CustomEvent(anaConsts.EVENT_NAMES.SAME_DAY_ORDER));
                    });
                    userXTimestampHeader();
                }

                if (Sephora.configurationSettings.isNLPInstrumentationEnabled && constructorPurchaseEventSent === null) {
                    const giftCardSubTotal = orderDetails.priceInfo.giftCardSubtotal;
                    const orderSubTotal = orderDetails.priceInfo.merchandiseSubtotal;
                    this.fireConstructorPurchaseEvent(orderId, orderSubTotal, products, giftCardSubTotal, items);
                }

                // When customer journey started on affiliate links, some information needs to be stored for analytics to use.
                anaUtils.storeAffiliateGatewayParams({ orderId });

                readyForAnalytics();
            },
            true
        );

        store.setAndWatch('user', this, userData => {
            this.setState({
                userEmail: userData.user.login,
                //if bi auto enroll is enabled make sure user is BI before showing beautyInsiderSection
                //other wise we always show beauty insider section
                showBeautyInsiderSection: isBIAutoEnrollEnabled ? userUtils.isBI() : true,
                showBirthdayForAutoEnrolled: userUtils.isDefaultBIBirthDay() && isBIAutoEnrollEnabled,
                biStatus: userUtils.getBiStatus(),
                hasAllTraits: BiProfile.hasAllTraits()
            });
        });

        const subscriptions = store.setAndWatch('user', this, data => {
            if (data.user.profileId) {
                const isSharableListEnabled = myListsUtils.isSharableListEnabled();

                // unwatch
                subscriptions[0]();

                if (isSharableListEnabled) {
                    store.dispatch(LoveActions.getFlatLoveListSkusWithDetails({ force: false, options: { currentPage: 1 } }));
                    store.dispatch(
                        LoveActions.getLimitedLoveListItems({
                            force: false,
                            options: { itemsPerPage: MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE }
                        })
                    );
                    store.dispatch(LoveActions.getAllLists({ force: false, options: { itemsPerPage: MIN_ITEMS_PER_PAGE } }));
                    store.dispatch(LoveActions.getFlatLoveListSkusOverview(true, null, false));
                } else {
                    store.dispatch(LoveActions.getLovesList(data.user.profileId, null, true));
                }
            }
        });

        store.setAndWatch('basket', this, data => {
            if (data.basket) {
                this.setState({ itemsInBasketCount: data.basket.itemCount });
            }
        });

        Sephora.analytics.initialLoadDependencies.push(
            new Promise(resolve => {
                readyForAnalytics = resolve;
            })
        );

        const { sid } = this.props.globalModals[BOPIS_ORDER_CONFIRMATION_CONTENT] || {};

        if (sid) {
            const { country, channel, language } = Sephora.renderQueryParams;
            getModal({
                country,
                language,
                channel,
                sid
            }).then(data => {
                this.setState({
                    contentData: data?.data?.items
                });
            });
        } else {
            cmsApi.getMediaContent(ROPIS_WHAT_TO_EXPECT_MEDIA_ID).then(data => {
                this.setState({
                    contentData: data && data.regions && data.regions.content ? data.regions.content : null
                });
            });
        }

        // Clear storage as a safety check before confirming Split EDD experience availability.
        Storage.local.removeItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE);
    }

    includeBopisOrderAnalytics = (orderDetails = {}) => {
        const isPickupOrder = orderDetails?.header?.isRopisOrder || orderDetails?.header?.isBopisOrder;
        const storeDetails = orderDetails?.pickup?.storeDetails || {};

        if (isPickupOrder) {
            if (!digitalData.page.attributes.experienceDetails) {
                digitalData.page.attributes.experienceDetails = { storeId: storeDetails?.storeId };
            } else {
                digitalData.page.attributes.experienceDetails.storeId = storeDetails?.storeId;
            }
        }
    };

    componentWillUnmount() {
        Storage.local.removeItem(LOCAL_STORAGE.CONSTRUCTOR_PURCHASE_EVENT_ORDER_CONF);
        Storage.session.removeItem(LOCAL_STORAGE.IS_BIREGISTER_MODAL_DISMISSED);
    }

    fireConstructorPurchaseEvent = (orderId, orderSubTotal, products, giftCardSubTotal, items) => {
        let formatSubTotal = 0;

        if (orderSubTotal) {
            formatSubTotal = localeUtils.isFRCanada()
                ? orderSubTotal.substring(0, orderSubTotal.length - 2)
                : orderSubTotal.substring(1, orderSubTotal.length - 1);
        }

        let revenue = parseFloat(formatSubTotal);

        if (giftCardSubTotal && giftCardSubTotal.length) {
            const formatGiftCardSubTotal = giftCardSubTotal.substring(1, giftCardSubTotal.length - 1);
            revenue = revenue + parseFloat(formatGiftCardSubTotal);
        }

        function sendTrackPurchaseEvent() {
            // prettier-ignore
            window.ConstructorioTracker.trackPurchase({
                revenue: revenue,
                'order_id': orderId,
                items
            });
            Storage.local.setItem(LOCAL_STORAGE.CONSTRUCTOR_PURCHASE_EVENT_ORDER_CONF, true, PURCHASE_EVENT_EXPIRY);
        }

        if (window.ConstructorioTracker) {
            sendTrackPurchaseEvent();
        } else {
            window.addEventListener('cio.beacon.loaded', sendTrackPurchaseEvent);
        }
    };

    setDataForNextPage = action => {
        const linkData = this.getLinkData(action);
        sendSOTLinkTrackingClickEvent({
            eventData: { specificEventName: linkData, linkName: linkData, actionInfo: linkData, eventStrings: [anaConsts.Event.EVENT_71] },
            callback: () => {
                anaUtils.setNextPageData({ linkData: linkData });
            }
        });
    };

    getLinkData = action => {
        let returnValue = '';

        switch (action) {
            case 'OrderNumber':
                returnValue = 'order confirmation:order number';

                break;
            case 'ContinueShopping':
                returnValue = 'order confirmation:continue shopping';

                break;
            default:
                break;
        }

        return returnValue;
    };

    setLastOrderType = (isBopisOrder, isSameDayOrder) => {
        if (!userUtils.isAnonymous()) {
            let orderType = ORDER_TYPE.STANDARD;

            if (isBopisOrder) {
                orderType = ORDER_TYPE.BOPIS;
            } else if (isSameDayOrder) {
                orderType = ORDER_TYPE.SDD;
            }

            Storage.session.setItem(LOCAL_STORAGE.LAST_ORDER_TYPE, orderType);
        }
    };

    setBiInfo = biInfo => {
        if (biInfo) {
            this.setState({
                biInfo: {
                    previousBalance: biInfo.beautyBankPoints,
                    earnedPoints: biInfo.earnedPoints,
                    redeemedPoints: biInfo.redeemedPoints,
                    newBeautyBankBalance: biInfo.netBeautyBankPointsAvailable
                }
            });
        }
    };

    handelCancelOrderClick = () => {
        const { orderId } = this.state.orderDetails.header;
        OrderUtils.showOrderCancelationModal(orderId);
    };

    handleStoreDetailsClick = storeDetails => () => {
        store.dispatch(
            actions.showFindInStoreMapModal({
                isOpen: true,
                currentProduct: null,
                selectedStore: storeDetails
            })
        );
    };

    renderComponentList = () => {
        const { sid } = this.props.globalModals[BOPIS_ORDER_CONFIRMATION_CONTENT] || {};
        const { contentData } = this.state;

        return (
            <React.Fragment>
                <SectionDivider />
                {sid ? (
                    <ComponentList
                        items={contentData}
                        context={'Container'}
                        removeLastItemMargin={true}
                        removeFirstItemMargin={true}
                    />
                ) : (
                    <BccComponentList items={contentData} />
                )}
            </React.Fragment>
        );
    };

    showSplitEDD = shippingGroup => {
        const { isSplitEDDEnabled } = this.props;
        const shippingMethod = shippingGroup?.shippingMethod || Empty.Object;
        const result = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);

        return result;
    };

    sectionDividerProps = (index, shouldSddSectionsRenderSddOnly) => {
        const { isSplitEDDEnabled } = this.props;

        let result = Empty.Object;

        if (shouldSddSectionsRenderSddOnly || (index > 0 && isSplitEDDEnabled)) {
            result = {
                color: ['nearWhite', 'black'],
                height: [3, 2]
            };
        }

        return result;
    };

    renderRoktAdPlacement = orderDetails => {
        // Check global kill switch first
        if (!Sephora.configurationSettings.enableNonEndemicAdPlacement) {
            return null;
        }

        if (!Sephora.configurationSettings.roktAdPlacementAccountId) {
            return null;
        }

        // For CA locales (CA-FR and CA-EN), check enableNonEndemicForCanada flag
        const isCALocale = localeUtils.isCanada();

        if (isCALocale && !Sephora.configurationSettings.enableNonEndemicForCanada) {
            return null;
        }

        // For US orders, only check the global kill switch (which is already checked above)
        return (
            <Box marginTop={[16, 24, 24]}>
                <RoktAdPlacement
                    orderDetails={orderDetails}
                    identifier={getRoktIdentifier('confirmation')}
                    accountId={Sephora.configurationSettings.roktAdPlacementAccountId}
                />
            </Box>
        );
    };

    render() {
        const {
            regions = {
                content: [],
                right: []
            },
            sddBasketHasItems,
            isStandardAndSdd,
            isSplitEDDEnabled
        } = this.props;
        /* eslint-disable prefer-const */
        let {
            orderDetails = {},
            showBirthdayForAutoEnrolled,
            showBeautyInsiderSection,
            biStatus,
            hasAllTraits,
            userEmail,
            contentData,
            params
        } = this.state;
        /* eslint-enable prefer-const */

        if (!orderDetails.isInitialized) {
            return (
                <Loader
                    hasBg={false}
                    isFixed
                    isShown
                />
            );
        }

        const isCMSCheckoutConfirmationEnabled = Sephora.configurationSettings.isCMSCheckoutConfirmationEnabled;
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');
        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        let showBISectionWhenPointsPositive = true;

        if (this.state.biInfo && this.state.biInfo.earnedPoints <= 0 && this.state.biInfo.redeemedPoints <= 0) {
            showBISectionWhenPointsPositive = false;
        }

        const shippingGroupsEntries = orderDetails.shippingGroups.shippingGroupsEntries || [];
        const orderId = orderDetails.header.orderId;
        const biAccountId = orderDetails.header?.profile?.beautyInsiderAccount?.biAccountId;
        const isGuestOrder = orderDetails.header.isGuestOrder;
        const guestProfile = orderDetails.header.guestProfile;
        const availableBiPoints =
            orderDetails.items && (isGuestOrder ? orderDetails.items.potentialBeautyBankPoints : orderDetails.items.netBeautyBankPointsAvailable);

        //if order conf for guest checkout and user doesn't sign in / register
        //to profile that guest checkout was made with then orderdetails links to
        //guest order details, otherwise to private order details
        const orderDetailsBaseLink = `/profile/orderdetail/${orderId}?requestOrigin=${OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_CONFIRMATION_PAGE}`;
        const orderDetailsLink =
            isGuestOrder && userEmail !== guestProfile.email ? `${orderDetailsBaseLink}&guestEmail=${guestProfile.email}` : `${orderDetailsBaseLink}`;

        const isPickupOrder = orderDetails.header && (orderDetails.header.isRopisOrder || orderDetails.header.isBopisOrder);
        const pickupData = orderDetails.pickup || {};
        const isPickupOrderProcessing = isPickupOrder && orderDetails.header.status === HEADER_LEVEL_ORDER_STATUS.PROCESSING;
        const isSameDayOrder = orderDetails.header.isSameDayOrder;
        const shippingAddress = orderDetails.shippingGroups?.shippingGroupsEntries?.[0]?.shippingGroup?.address || {};
        const billingAddress = orderDetails.paymentGroups?.paymentGroupsEntries?.[0]?.paymentGroup?.address || {};

        shippingGroupsEntries.map(shippingGroup => {
            return shippingGroup?.shippingGroup?.items?.forEach(item => {
                // The order of items in orderDetails.items.items is not guaranteed.
                // We need to find the correct item using the skuId, not the index.
                const orderDetailsItems = orderDetails?.items?.items || Empty.Array;
                const targetItem = orderDetailsItems.find(odItem => odItem?.sku?.skuId === item?.sku?.skuId);

                if (!targetItem) {
                    return;
                }

                item.replenishmentAdjuster = targetItem?.sku?.replenishmentAdjuster || undefined;
                item.replenishmentAdjusterPrice = targetItem?.sku?.replenishmentAdjusterPrice || undefined;
                item.replenishmentAdjusterType = targetItem?.sku.replenishmentAdjusterType || undefined;
                item.replenishmentItemPrice = targetItem?.replenishmentItemPrice || undefined;
            });
        });

        //Notify AgentAware Chrome extension that a container for AgentAwareComponents was rendered.
        // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-cc-render
        if (!Sephora.isNodeRender) {
            // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-cc-render
            window.dispatchEvent(new CustomEvent('AgentAwareContainerRendered', { detail: { id: 'agent-aware-add-order-notes-button' } }));
        }

        /*
            The Order Confirmation page for Same Day orders does not display the
            ElectronicShippingGroup because the SddSections component only renders
            SameDayShippingGroup, HardGoodShippingGroup, and GiftCardShippingGroup
            (as implemented in DEF-1131).

            For Split EDD scenarios, we'll use SddSections to show Same Day order details
            (SameDayShippingGroup and SDUElectronicShippingGroup) while rendering the remaining
            shipping groups as we do for non-Same Day orders.
        */
        const isSDUOrderOnly = OrderUtils.isSDUOnlyOrder(orderDetails);
        const shouldSddSectionsRenderSddOnly = !isSDUOrderOnly && sddBasketHasItems && isSplitEDDEnabled;
        const shippingGroupsEntriesWithoutSameDayShippingGroup = shouldSddSectionsRenderSddOnly
            ? OrderUtils.removeShippingGroup(shippingGroupsEntries, SHIPPING_GROUPS.SAME_DAY)
            : null;
        const shouldRenderStandardShippingGroups =
            (!isPickupOrder && !sddBasketHasItems) || shippingGroupsEntriesWithoutSameDayShippingGroup?.length > 0;

        return (
            <div>
                <Container
                    hasLegacyWidth={true}
                    is='main'
                    paddingTop={5}
                >
                    <Grid
                        columns={[null, null, '1fr 308px']}
                        gap={[null, null, 5]}
                        alignItems='flex-start'
                    >
                        <div>
                            <Text
                                data-at={Sephora.debug.dataAt('we_got_it_title')}
                                is='h1'
                                fontSize='xl'
                                lineHeight='tight'
                                fontFamily='serif'
                                marginTop={[null, null, 5]}
                                marginBottom={4}
                            >
                                {getText(sddBasketHasItems ? 'thankYouHeader' : 'weGotItHeader')}
                            </Text>
                            <PromoNotifications
                                marginBottom={4}
                                qualifiedStyleProps={{
                                    marginX: [-2, 0]
                                }}
                            />
                            <Text
                                data-at={Sephora.debug.dataAt('pickup_order_number_title')}
                                is='p'
                                fontSize='md'
                                marginBottom={4}
                            >
                                <b>{getText(isPickupOrder ? 'pickupOrderNumberText' : 'orderNumberText')}:</b>{' '}
                                <Link
                                    onClick={this.setDataForNextPage.bind(this, 'OrderNumber')}
                                    href={orderDetailsLink}
                                    color='blue'
                                    underline={true}
                                    data-at={Sephora.debug.dataAt('confirmation_order_number')}
                                >
                                    {orderId}
                                </Link>
                            </Text>
                            <Text
                                data-at={Sephora.debug.dataAt('order_confirmation_message')}
                                is='p'
                                marginBottom={5}
                            >
                                {getText(
                                    isPickupOrder ? 'pickupOrderedMessageText' : sddBasketHasItems ? 'sameDayConfirmationText' : 'orderedMessageText'
                                )}
                                {isPickupOrder && <strong> {pickupData.email}</strong>}
                                {sddBasketHasItems && <strong> {userEmail}</strong>}
                                {'.'}
                            </Text>
                            {!isStandardAndSdd && orderDetails?.digitalGiftMsg?.email && (
                                <Text
                                    data-at={Sephora.debug.dataAt('order_confirmation_gift_message')}
                                    is='p'
                                    marginBottom={5}
                                >
                                    {getText('giftMessageMsg')}
                                    {<strong> {`${orderDetails.digitalGiftMsg.email} `}</strong>}
                                    {`${getText(sddBasketHasItems ? 'giftMessageSdd' : 'giftMessageStandard')}.`}
                                </Text>
                            )}
                            {this.props.showSDUBanner && <SDUBanner isUS={localeUtils.isUS()} />}
                            {isPickupOrder && (
                                <FulfillmentStatus
                                    isCheckout={true}
                                    marginBottom={4}
                                    pickupOrderStates={this.state.pickupOrderStates}
                                    isBopisOrder={true}
                                    isProcessing={isPickupOrderProcessing}
                                />
                            )}

                            {isGuestOrder &&
                            (!userEmail || guestProfile.email === userEmail) &&
                            this.state.biFormTestType !== 'popupModalWithPasswordFieldAndBI' ? (
                                    <GuestCheckoutSection
                                        isExistingUser={guestProfile.isEmailRegistered}
                                        isNonBIRegisteredUser={!guestProfile.isEmailRegistered || guestProfile.isNonBIRegisteredUser}
                                        guestEmail={guestProfile.email}
                                        guestProfileId={biAccountId}
                                        biPoints={availableBiPoints}
                                        isStoreBIMember={guestProfile.isStoreBIMember}
                                        editStore='GuestCheckoutSignIn'
                                        biFormTestType={this.state.biFormTestType}
                                        orderId={orderId}
                                        biAccountId={biAccountId}
                                        firstName={billingAddress.firstName || shippingAddress.firstName || ''}
                                        lastName={billingAddress.lastName || shippingAddress.lastName || ''}
                                    />
                                ) : (
                                    <Grid
                                        columns={[null, null, 2]}
                                        maxWidth={[null, null, 416]}
                                        gap={[3, null, 4]}
                                    >
                                        {!this.state.itemsInBasketCount || isPickupOrder ? (
                                            <Button
                                                variant='primary'
                                                onClick={this.setDataForNextPage.bind(this, 'ContinueShopping')}
                                                href='/'
                                                data-at={Sephora.debug.dataAt('confirmation_continue_shopping')}
                                            >
                                                {getText('continueShoppingButton')}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant='primary'
                                                href='/basket'
                                            >
                                                {getText('viewBasketButton')}
                                            </Button>
                                        )}
                                        {isPickupOrder && (
                                            <Button
                                                data-at={Sephora.debug.dataAt('cancel_your_order_btn')}
                                                variant='secondary'
                                                onClick={this.handelCancelOrderClick}
                                            >
                                                {getText('cancelOrderButton')}
                                            </Button>
                                        )}
                                        <div
                                            className={agentAwareUtils.applyShowAgentAwareClass()}
                                            style={{ display: 'none' }}
                                            id='agent-aware-add-order-notes-button'
                                        ></div>
                                    </Grid>
                                )}

                            {this.renderRoktAdPlacement(orderDetails)}

                            {isPickupOrder && (
                                <>
                                    <SmsOptInBanner isBOPIS />
                                    {this.getPickupSection(getText)}
                                </>
                            )}
                            {shippingGroupsEntries.length === 1 && !sddBasketHasItems && (
                                <div>
                                    <SectionDivider />
                                    {shippingGroupsEntries[0].shippingGroupType !== SHIPPING_GROUPS.ELECTRONIC &&
                                        this.getShipTo(shippingGroupsEntries[0], getText, isGuestOrder, 1)}
                                </div>
                            )}
                            {isPickupOrder && contentData && (
                                <Media
                                    greaterThan='sm'
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                >
                                    {this.renderComponentList()}
                                </Media>
                            )}
                        </div>

                        {!isPickupOrder &&
                            isDesktop &&
                            showBeautyInsiderSection &&
                            this.state.biInfo &&
                            !isGuestOrder &&
                            showBISectionWhenPointsPositive && (
                            <Box
                                lineHeight='tight'
                                paddingY={5}
                                paddingX={4}
                                borderRadius={1}
                                border={1}
                                borderColor='lightGray'
                                className={agentAwareUtils.applyHideAgentAwareClass()}
                            >
                                {this.state.biInfo ? (
                                    <BeautyInsiderSection
                                        showBirthdayForAutoEnrolled={showBirthdayForAutoEnrolled}
                                        biStatus={biStatus}
                                        hasAllTraits={hasAllTraits}
                                        biInfo={this.state.biInfo}
                                    />
                                ) : null}
                            </Box>
                        )}
                        {isPickupOrder && (
                            <div>
                                <Media
                                    lessThan='md'
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                >
                                    {contentData && this.renderComponentList()}
                                    <SectionDivider />
                                </Media>
                                <Box
                                    borderWidth={[null, null, 1]}
                                    borderColor='midGray'
                                    borderRadius={2}
                                    marginTop={[null, null, 5]}
                                    overflow='hidden'
                                >
                                    <Box
                                        borderWidth={[orderDetails.header.isRopisOrder && 2, null, 0]}
                                        borderColor='nearWhite'
                                        borderRadius={[orderDetails.header.isRopisOrder && 2, null, 0]}
                                        overflow='hidden'
                                    >
                                        <OrderSummary
                                            isConfirmation={true}
                                            isRopis={orderDetails.header.isRopisOrder}
                                            isBopis={orderDetails.header.isBopisOrder}
                                        />
                                    </Box>
                                </Box>
                            </div>
                        )}
                    </Grid>

                    {!isPickupOrder && regions.content?.length > 0 && (
                        <React.Fragment>
                            <SectionDivider />
                            <BccComponentList
                                items={regions.content}
                                className={agentAwareUtils.applyHideAgentAwareClass()}
                            />
                        </React.Fragment>
                    )}
                    {!sddBasketHasItems && !isPickupOrder && <SmsOptInBanner displayDivider />}
                    {sddBasketHasItems && (
                        <>
                            {/* SDD + STH order with HardGoodShippingGroup + GiftCardShippingGroup.
                            ElectronicShippingGroup is not rendered by this component.
                            It was developed that way under DEF-1131.
                            */}
                            <SddSections
                                isSameDayOrder={isSameDayOrder}
                                orderDetailsLink={orderDetailsLink}
                                biInfo={this.state.biInfo}
                                shouldRenderStandard={!shouldSddSectionsRenderSddOnly}
                            />
                        </>
                    )}
                    {shouldRenderStandardShippingGroups &&
                        (shippingGroupsEntriesWithoutSameDayShippingGroup || shippingGroupsEntries).map((shippingGroup, index, shippingGroups) => (
                            <div
                                key={index.toString()}
                                data-at={Sephora.debug.dataAt('shipment_area')}
                            >
                                {shippingGroups.length > 1 && (
                                    <React.Fragment>
                                        <SectionDivider {...this.sectionDividerProps(index, shouldSddSectionsRenderSddOnly)} />
                                        <Text
                                            is='h2'
                                            fontSize='md'
                                            marginBottom={5}
                                            lineHeight='tight'
                                            fontWeight='bold'
                                            css={{ textTransform: 'uppercase' }}
                                        >
                                            {getText('shipmentText', [index + 1])}
                                        </Text>
                                        {shippingGroup.shippingGroupType !== SHIPPING_GROUPS.ELECTRONIC && this.getShipTo(shippingGroup, getText)}
                                    </React.Fragment>
                                )}
                                {/* STH order only */}
                                <OrderItemList
                                    items={shippingGroup.shippingGroup.items}
                                    shippingGroup={shippingGroup.shippingGroup}
                                    shippingGroupType={shippingGroup.shippingGroupType}
                                    showSplitEDD={this.showSplitEDD(shippingGroup.shippingGroup)}
                                />
                                <Divider
                                    marginY={[4, null, 5]}
                                    css={{ borderBottom: `2px solid ${colors.black}` }}
                                />
                                <OrderTotal
                                    priceInfo={shippingGroup.shippingGroup.priceInfo}
                                    redeemedPoints={this.state.biInfo?.redeemedPoints}
                                    orderDetailsLink={orderDetailsLink}
                                    orderLocale={orderDetails.header.orderLocale}
                                />
                            </div>
                        ))}
                    {!isPickupOrder &&
                    isMobile &&
                    this.state.biInfo &&
                    showBeautyInsiderSection &&
                    !isGuestOrder &&
                    showBISectionWhenPointsPositive ? (
                            <div className={agentAwareUtils.applyHideAgentAwareClass()}>
                                <SectionDivider />
                                <BeautyInsiderSection
                                    showBirthdayForAutoEnrolled={showBirthdayForAutoEnrolled}
                                    biStatus={biStatus}
                                    hasAllTraits={hasAllTraits}
                                    biInfo={this.state.biInfo}
                                />
                            </div>
                        ) : null}
                    {!isPickupOrder && (regions.right?.length > 0 || this.props.data?.contentZone?.length > 0) ? (
                        <div className={agentAwareUtils.applyHideAgentAwareClass()}>
                            <SectionDivider />
                            {isCMSCheckoutConfirmationEnabled ? (
                                <ComponentList
                                    items={this.props.data?.contentZone}
                                    context={CONTEXTS.CONTAINER}
                                    removeLastItemMargin={true}
                                    removeFirstItemMargin={true}
                                />
                            ) : (
                                <BccComponentList
                                    items={regions.right}
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                />
                            )}
                        </div>
                    ) : null}
                    {!isPickupOrder && params?.itemIds?.length > 0 && (
                        <div className={agentAwareUtils.applyHideAgentAwareClass()}>
                            <SectionDivider className={agentAwareUtils.applyHideAgentAwareClass()} />
                            <ConstructorCarousel
                                podId={CONSTRUCTOR_PODS.ORDER_CONFIRMATION}
                                params={params}
                                formatValuePrice={true}
                                showPrice={true}
                                showReviews={true}
                                showLoves={true}
                                showBadges={true}
                                showMarketingFlags={true}
                                showTouts={true}
                                showArrows={true}
                                displayCount={isMobile ? 2 : 5}
                            />
                        </div>
                    )}
                </Container>
            </div>
        );
    }

    getPickupSection = getText => {
        const isRopisOrder = this.state.orderDetails.header?.isRopisOrder;
        const isBopisOrder = this.state.orderDetails.header?.isBopisOrder;

        if (!(isRopisOrder || isBopisOrder)) {
            return null;
        }

        const orderId = this.state.orderDetails.header?.orderId;
        const isAltPickupPersonEnabled = this.state.orderDetails?.header?.isAltPickupPersonEnabled;
        const isAltPickPersonEnabledAfterOrdPlace = this.state.orderDetails?.header?.isAltPickPersonEnabledAfterOrdPlace;
        const pickupData = this.state.orderDetails.pickup || {};
        const storeDetails = pickupData.storeDetails || null;
        const pickupMethods = pickupData.pickupMethods || [];
        const storeHoursDisplay =
            pickupData.storeDetails && pickupData.storeDetails.storeHours
                ? storeUtils.getStoreHoursDisplayArray(pickupData.storeDetails.storeHours)
                : [];

        const isInStorePickup = postCheckoutUtils.isInStorePickup(pickupMethods);
        const curbsideEnabled = storeUtils.isCurbsideEnabled(storeDetails, { isBopisOrder });
        const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails, { isBopisOrder });
        const showConciergeCurbsidePickupIndicator = curbsideEnabled && !isInStorePickup && conciergeCurbsideEnabled;
        const showCurbsidePickupIndicator = curbsideEnabled && !conciergeCurbsideEnabled;

        const [curbsideMapImageTab] = storeUtils.getCurbsidePickupInstructions(storeDetails);
        const contentfulCurbsideInstruction = pickupData?.content?.data?.curbsideInstruction;
        const isCurbsideDataAvailable = !!(contentfulCurbsideInstruction || curbsideMapImageTab);
        const showCurbsidePickupInstructions = !!(showCurbsidePickupIndicator && isCurbsideDataAvailable);
        const conciergePickupInstructions = showConciergeCurbsidePickupIndicator && storeUtils.getConciergePickupInstructions(storeDetails);

        return (
            <div>
                {storeDetails && (
                    <React.Fragment>
                        <SectionDivider />
                        <Text
                            is='h2'
                            data-at={Sephora.debug.dataAt('pickup_location_title')}
                            marginBottom={[3, 4]}
                            lineHeight='tight'
                            fontWeight='bold'
                            fontSize='md'
                        >
                            {getText('pickupLocation')}
                        </Text>
                        <Flex
                            lineHeight='tight'
                            marginBottom={1}
                            alignItems='baseline'
                            data-at={Sephora.debug.dataAt('store_name')}
                            justifyContent={['space-between', 'flex-start']}
                        >
                            <strong>{storeUtils.getStoreDisplayNameWithSephora(pickupData.storeDetails)}</strong>
                            <Text
                                display={['none', 'inline']}
                                marginX='.5em'
                                color='midGray'
                                children='|'
                            />
                            <Link
                                color='blue'
                                onClick={this.handleStoreDetailsClick(storeDetails)}
                                children={getText('storeDetails')}
                            />
                        </Flex>
                        {showCurbsidePickupIndicator && (
                            <CurbsidePickupIndicator
                                marginBottom={3}
                                dataAt='curbside_indicator_label'
                            />
                        )}
                        {showConciergeCurbsidePickupIndicator && (
                            <ConciergeCurbsidePickupIndicator
                                marginBottom={3}
                                dataAt='concierge_indicator_label'
                            />
                        )}
                        <Grid gap={3}>
                            <StoreAddress address={storeDetails.address} />
                            <StoreHours storeHoursDisplay={storeHoursDisplay} />
                        </Grid>
                        {showCurbsidePickupInstructions && (
                            <>
                                <Divider
                                    marginY={4}
                                    display={[null, null, 'none']}
                                />
                                <Grid
                                    key={CURBSIDE_PICKUP_ID}
                                    marginY={4}
                                    gap={4}
                                    alignItems='start'
                                    columns={[null, null, 2]}
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                >
                                    {contentfulCurbsideInstruction && <RichText content={contentfulCurbsideInstruction} />}
                                    {curbsideMapImageTab && (
                                        <BccComponentList
                                            isContained={false}
                                            items={curbsideMapImageTab}
                                            border={1}
                                            borderColor='lightGray'
                                            borderRadius={2}
                                            overflow='hidden'
                                        />
                                    )}
                                </Grid>
                            </>
                        )}
                        {conciergePickupInstructions && (
                            <>
                                <Divider
                                    marginY={4}
                                    display={[null, null, 'none']}
                                />
                                <Grid
                                    key='conciergeInfo'
                                    marginY={4}
                                    gap={4}
                                    alignItems='start'
                                    columns={[null, null, 2]}
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                >
                                    <BccComponentList
                                        isContained={false}
                                        items={conciergePickupInstructions}
                                    />
                                </Grid>
                            </>
                        )}
                    </React.Fragment>
                )}

                <SectionDivider />
                <Text
                    is='h2'
                    data-at={Sephora.debug.dataAt('contact_information_title')}
                    marginBottom={[3, 4]}
                    lineHeight='tight'
                    fontWeight='bold'
                    fontSize='md'
                >
                    {getText(isRopisOrder ? 'contactInfo' : 'pickupPerson')}
                </Text>
                <div data-at={Sephora.debug.dataAt('contact_information')}>
                    {`${pickupData.firstname} ${pickupData.lastName}`}
                    <br />
                    {pickupData.email}
                </div>
                {isAltPickupPersonEnabled && (
                    <AlternatePickup
                        marginY={5}
                        titleTextSize='md'
                        orderId={orderId}
                        isOrderConfirmation={true}
                        alternatePickupData={pickupData.altPickupPersonDetails}
                        allowEdit={false}
                        showAltPickupNote={isAltPickPersonEnabledAfterOrdPlace}
                    />
                )}
                {isBopisOrder && (
                    <Box
                        is='p'
                        backgroundColor='nearWhite'
                        paddingY={2}
                        paddingX={3}
                        marginTop={4}
                        borderRadius={2}
                        data-at={Sephora.debug.dataAt('email_or_photo_id_info')}
                    >
                        {getText('contactMessage1')}
                        <strong>{getText('confirmEmail')}</strong>
                        {getText('or')}
                        <strong>{getText('photoId')}</strong>
                        {getText('ready')}
                    </Box>
                )}
            </div>
        );
    };

    getShipTo = (entry, getText, isGuestOrder, columns = 2) => {
        const isPhysicalGiftCard = entry.shippingGroupType === SHIPPING_GROUPS.GIFT;
        const shippingGroup = entry.shippingGroup;
        const shipMethod = (shippingGroup && shippingGroup.shippingMethod) || {};
        const { promiseDate, promiseDateLabel, promiseDateRange } = shipMethod;
        const { header } = this.state;
        const showSplitEDD = this.showSplitEDD(shippingGroup);

        let dateToDeliver;

        if (promiseDate) {
            dateToDeliver = dateUtils.getPromiseDate(promiseDate);
        }

        if (showSplitEDD && promiseDateRange) {
            dateToDeliver = dateUtils.getPromiseDateRange(promiseDateRange);
        }

        const address = shippingGroup?.address;
        const hasHalAddress = isHalAddress(address);
        const isUS = localeUtils.isUS();
        const isCAOrder = header.orderLocale === 'CA';

        return (
            <Grid
                lineHeight='tight'
                gap={[5, null, showSplitEDD ? 5 : 4]}
                columns={[null, null, showSplitEDD ? columns : 2]}
                marginBottom={showSplitEDD ? 5 : 0}
            >
                <div data-at={Sephora.debug.dataAt('ship_to_container')}>
                    {hasHalAddress ? (
                        <Grid
                            columns={[`${leftColWidth}px 1fr`, 1]}
                            gap={0}
                        >
                            <Text
                                is='h2'
                                fontWeight='bold'
                            >
                                {getText(isCAOrder ? 'shipToPickupLocation' : 'shipToFeDexLocation')}
                            </Text>
                            <Address
                                address={address}
                                hasHalAddress={hasHalAddress}
                                isOrderConfirmation={true}
                            />
                        </Grid>
                    ) : (
                        <React.Fragment>
                            <Text
                                is='h2'
                                fontWeight='bold'
                                children={getText('shipTo')}
                            />
                            {shippingGroup && address ? <Address address={address} /> : null}
                        </React.Fragment>
                    )}
                </div>

                {!hasHalAddress && (
                    <div>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            children={isPhysicalGiftCard && isUS ? getText('estimatedDelivery') : promiseDateLabel || getText('estimatedDelivery')}
                        />
                        {isPhysicalGiftCard && isUS ? (
                            <span data-at={Sephora.debug.dataAt('shipping_method_description')}>
                                {showSplitEDD
                                    ? dateUtils.getEstimatedDeliveryDateRange(
                                        shipMethod.estimatedMinDeliveryDate,
                                        shipMethod.estimatedMaxDeliveryDate
                                    )
                                    : OrderUtils.getEstimatedDelivery(entry.shippingGroup)}
                            </span>
                        ) : (
                            <span data-at={Sephora.debug.dataAt('confirmation_estimated_delivery')}>
                                {dateToDeliver || OrderUtils.getEstimatedDelivery(entry.shippingGroup)}
                            </span>
                        )}
                    </div>
                )}

                {hasHalAddress && (
                    <PickupPerson
                        address={address}
                        isGuestOrder={isGuestOrder}
                        isCAOrder={isCAOrder}
                    />
                )}
            </Grid>
        );
    };
}

export default wrapComponent(OrderConfirmation, 'OrderConfirmation', true);
