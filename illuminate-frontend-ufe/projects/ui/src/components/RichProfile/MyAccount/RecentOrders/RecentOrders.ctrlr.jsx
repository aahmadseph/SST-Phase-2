import React from 'react';
import BaseClass from 'components/BaseClass';
import watch from 'redux-watch';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Divider, Button, Link, Flex
} from 'components/ui';
import { space } from 'style/config';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import TrackOrderButton from 'components/RichProfile/MyAccount/TrackOrderButton/TrackOrderButton';
import localeUtils from 'utils/LanguageLocale';
import ReplenProductItem from 'components/Product/ReplenProductItem/ReplenProductItem';
import OrderStatusDisplayName from 'components/RichProfile/MyAccount/OrderDetail/OrderStatusDisplayName/OrderStatusDisplayName';
import store from 'store/Store';
import OrdersActions from 'actions/OrdersActions';
import OrderUtils from 'utils/Order';
import UrlUtils from 'utils/Url';
import sessionExtensionService from 'services/SessionExtensionService';
import biApi from 'services/api/beautyInsider';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

const NUM_ORDERS_PER_PAGE = 50;
const DATE_CELL_WIDTH = '15%';
const NUMBER_CELL_WIDTH = '19%';
const TYPE_CELL_WIDTH = '19%';
const STATUS_CELL_WIDTH = '15%';
const TRACKING_CELL_WIDTH = '32%';
const FS_GUTTER_SIZE = 5;
const MW_GUTTER_SIZE = 3;
const MW_ROW_SPACE = 2;
const MW_LABEL_CELL_WIDTH = '40%';

class RecentOrders extends BaseClass {
    state = {
        numOrders: null,
        numPagesRetrieved: 0,
        numPagesTotal: null,
        recentOrders: null,
        sortPurchases: [],
        isUserReady: false,
        user: {}
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({
                        user: watchedUser
                    });
                    this.getPurchaseHistoryByUser(watchedUser);
                }

                this.setState({
                    isUserReady: true
                });
            }),
            this
        );
    }

    getPurchaseHistoryByUser = user => {
        this._userProfileId = user.profileId;
        this.loadNextPage();
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);

        const options = {
            includeNonBiUserPurchases: true,
            sortBy: 'recently',
            groupBy: 'frequencyAndDate',
            excludeSamples: true,
            excludeRewards: true,
            itemsPerPage: 21
        };

        biApi.getPurchaseHistory(this._userProfileId, options).then(purchaseHistory => {
            const { purchasedItems } = purchaseHistory;
            this.setState({
                sortedPurchases: this.sortPurchasesByFrequency(this.sortPurchasesByDate(purchasedItems))
            });
        });
    };

    sortPurchasesByDate = userPurchases => {
        userPurchases.sort((firstPurchase, secondPurchase) => {
            return new Date(secondPurchase.transactionDate) - new Date(firstPurchase.transactionDate);
        });

        return userPurchases;
    };

    sortPurchasesByFrequency = userPurchases => {
        userPurchases.sort((firstPurchase, secondPurchase) => {
            return secondPurchase.frequency - firstPurchase.frequency;
        });

        return userPurchases;
    };

    handleViewDetailsClick = orderId => {
        UrlUtils.redirectTo(OrderUtils.getOrderDetailsUrl(orderId));
    };

    handleShowMoreClick = () => {
        this.loadNextPage();
    };

    nextPageLoadedCallback = (numOrders, orders, numPagesRetrieved) => {
        const numPagesTotal = Math.ceil(numOrders / NUM_ORDERS_PER_PAGE);
        const retrievedOrders = this.state.recentOrders || [];

        this.setState({
            numPagesRetrieved: numPagesRetrieved,
            numOrders: numOrders,
            numPagesTotal: numPagesTotal,
            recentOrders: retrievedOrders.concat(orders)
        });
    };

    loadNextPage = () => {
        const pageToRetrieve = this.state.numPagesRetrieved + 1;
        store.dispatch(
            OrdersActions.getRecentOrders(this._userProfileId, pageToRetrieve, NUM_ORDERS_PER_PAGE, this.nextPageLoadedCallback.bind(this))
        );
    };

    ordersLoaded = () => {
        return this.state.recentOrders !== null;
    };

    isUserAuthenticated = () => {
        return this.state.user && this.state.user.login;
    };

    render() {
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();

        const REPLEN_ITEMS_PER_SLIDE = isMobile ? 3 : 7;

        const { recentOrders, numPagesRetrieved, numPagesTotal, sortedPurchases } = this.state;

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/RecentOrders/locales', 'RecentOrders');
        const getTextViewAll = localeUtils.getLocaleResourceFile(
            'components/RichProfile/UserProfile/common/SectionContainer/locales',
            'SectionContainer'
        );

        // ILLUPH-131077 Replen Carousel, Create array of eligible items to display
        const replenItems = [];
        const replenItemsCarouselTitle = getText('replenItemsCarouselTitle');

        if (sortedPurchases && sortedPurchases.length > 0) {
            sortedPurchases.forEach(item => {
                const eligibleItem = !item.sku.isOutOfStock && item.sku.isActive && item.sku.actionFlags.isAddToBasket;

                if (eligibleItem) {
                    const replenItem = (
                        <ReplenProductItem
                            key={item.sku.skuId}
                            parentTitle={replenItemsCarouselTitle}
                            sku={item.sku}
                        />
                    );
                    replenItems.push(replenItem);
                }
            });
        }

        const findTrackingUrl = shipGroups => {
            let trackingUrl;

            for (const group of shipGroups) {
                if (group.trackingUrl !== undefined) {
                    trackingUrl = group.trackingUrl;

                    break;
                }
            }

            return trackingUrl;
        };

        return (
            <AccountLayout
                section='account'
                page='recent orders'
                title={getText('orders')}
                beforeTitle={
                    replenItems.length > 0 ? (
                        <>
                            <div data-at={Sephora.debug.dataAt('restock_past_purchases_carousel')}>
                                <Flex
                                    justifyContent='space-between'
                                    alignItems='baseline'
                                    lineHeight='tight'
                                    marginBottom={5}
                                >
                                    <Text
                                        is='h2'
                                        fontWeight='bold'
                                        fontSize='md'
                                        data-at={Sephora.debug.dataAt('product_carousel_title')}
                                        children={replenItemsCarouselTitle}
                                    />
                                    <Link
                                        arrowDirection='right'
                                        padding={2}
                                        margin={-2}
                                        href='/purchase-history'
                                        children={getTextViewAll('viewAll')}
                                        onClick={() => {
                                            const prop55 = `view all:${anaConsts.CAROUSEL_NAMES.REPLEN}`;
                                            digitalData.page.attributes.previousPageData.linkData = prop55;
                                            anaUtils.setNextPageData({ linkData: prop55 });
                                        }}
                                        data-at={Sephora.debug.dataAt('view_all_link')}
                                    />
                                </Flex>
                                <LegacyCarousel
                                    displayCount={REPLEN_ITEMS_PER_SLIDE}
                                    showArrows={isDesktop ? replenItems.length > REPLEN_ITEMS_PER_SLIDE : false}
                                    showTouts={replenItems.length > REPLEN_ITEMS_PER_SLIDE}
                                    totalItems={replenItems.length}
                                    gutter={space[4]}
                                    controlHeight={75}
                                    isFlexItem={true}
                                >
                                    {replenItems}
                                </LegacyCarousel>
                                <Divider
                                    marginTop={4}
                                    marginBottom={6}
                                />
                            </div>
                        </>
                    ) : null
                }
            >
                {!Sephora.isNodeRender && this.state.isUserReady && (
                    <React.Fragment>
                        {!this.isUserAuthenticated() && <PleaseSignInBlock />}

                        {this.isUserAuthenticated() && (
                            <Box
                                marginTop={5}
                                lineHeight='tight'
                            >
                                {this.ordersLoaded() && recentOrders.length === 0 && (
                                    <Text
                                        is='h2'
                                        fontSize='md'
                                    >
                                        {getText('noOrders')}
                                    </Text>
                                )}
                                {this.ordersLoaded() && recentOrders.length > 0 && (
                                    <React.Fragment>
                                        {isDesktop && (
                                            <React.Fragment>
                                                <LegacyGrid
                                                    fontSize='md'
                                                    fontWeight='bold'
                                                    gutter={FS_GUTTER_SIZE}
                                                >
                                                    <LegacyGrid.Cell width={DATE_CELL_WIDTH}>{getText('orderDate')}</LegacyGrid.Cell>
                                                    <LegacyGrid.Cell width={NUMBER_CELL_WIDTH}>{getText('orderNumber')}</LegacyGrid.Cell>
                                                    <LegacyGrid.Cell width={TYPE_CELL_WIDTH}>{getText('orderType')}</LegacyGrid.Cell>
                                                    <LegacyGrid.Cell width={STATUS_CELL_WIDTH}>{getText('status')}</LegacyGrid.Cell>
                                                    <LegacyGrid.Cell width={TRACKING_CELL_WIDTH}>{getText('details')}</LegacyGrid.Cell>
                                                </LegacyGrid>
                                                <Divider
                                                    marginTop={3}
                                                    marginBottom={5}
                                                />
                                            </React.Fragment>
                                        )}
                                        {/* eslint-disable-next-line complexity */}
                                        {recentOrders.map((order, idx) => (
                                            <div
                                                key={order.orderId}
                                                data-at={Sephora.debug.dataAt('item_row')}
                                            >
                                                {idx > 0 && <Divider marginY={5} />}
                                                <LegacyGrid gutter={FS_GUTTER_SIZE}>
                                                    <LegacyGrid.Cell width={isDesktop && DATE_CELL_WIDTH}>
                                                        {order.label && (
                                                            <Box
                                                                fontWeight='bold'
                                                                marginBottom={isMobile ? MW_ROW_SPACE : 1}
                                                                data-at={Sephora.debug.dataAt('3rd_party_order')}
                                                                children={order.label}
                                                            />
                                                        )}
                                                        <LegacyGrid
                                                            gutter={MW_GUTTER_SIZE}
                                                            marginBottom={MW_ROW_SPACE}
                                                        >
                                                            {isMobile && (
                                                                <LegacyGrid.Cell width={MW_LABEL_CELL_WIDTH}>
                                                                    <b>{getText('orderDate')}</b>
                                                                </LegacyGrid.Cell>
                                                            )}
                                                            <LegacyGrid.Cell
                                                                width='fill'
                                                                data-at={Sephora.debug.dataAt('order_date')}
                                                            >
                                                                {order.orderDate}
                                                            </LegacyGrid.Cell>
                                                        </LegacyGrid>
                                                    </LegacyGrid.Cell>
                                                    <LegacyGrid.Cell width={isDesktop && NUMBER_CELL_WIDTH}>
                                                        <LegacyGrid
                                                            gutter={MW_GUTTER_SIZE}
                                                            marginBottom={MW_ROW_SPACE}
                                                        >
                                                            {isMobile && (
                                                                <LegacyGrid.Cell width={MW_LABEL_CELL_WIDTH}>
                                                                    <b>{getText('orderNumber')}</b>
                                                                </LegacyGrid.Cell>
                                                            )}
                                                            <LegacyGrid.Cell
                                                                width='fill'
                                                                data-at={Sephora.debug.dataAt('order_number')}
                                                            >
                                                                {order.orderId}
                                                            </LegacyGrid.Cell>
                                                        </LegacyGrid>
                                                    </LegacyGrid.Cell>
                                                    {isDesktop && (
                                                        <LegacyGrid.Cell width={isDesktop && TYPE_CELL_WIDTH}>
                                                            <LegacyGrid
                                                                gutter={MW_GUTTER_SIZE}
                                                                marginBottom={MW_ROW_SPACE}
                                                            >
                                                                <LegacyGrid.Cell
                                                                    width='fill'
                                                                    paddingRight={1}
                                                                    data-at={Sephora.debug.dataAt('order_type')}
                                                                >
                                                                    {order.isSameDayOrder
                                                                        ? getText('sameDayOrder')
                                                                        : order.isBopisOrder
                                                                            ? getText('pickupOrder')
                                                                            : getText('standardOrder')}
                                                                </LegacyGrid.Cell>
                                                            </LegacyGrid>
                                                            {order.isSameDayOrder && order.standardOrderStatus && (
                                                                <LegacyGrid
                                                                    gutter={MW_GUTTER_SIZE}
                                                                    marginBottom={MW_ROW_SPACE}
                                                                >
                                                                    <LegacyGrid.Cell
                                                                        width='fill'
                                                                        data-at={Sephora.debug.dataAt('order_type')}
                                                                    >
                                                                        {getText('standardOrder')}
                                                                    </LegacyGrid.Cell>
                                                                </LegacyGrid>
                                                            )}
                                                        </LegacyGrid.Cell>
                                                    )}
                                                    <LegacyGrid.Cell width={isDesktop && STATUS_CELL_WIDTH}>
                                                        <LegacyGrid
                                                            gutter={MW_GUTTER_SIZE}
                                                            marginBottom={MW_ROW_SPACE}
                                                        >
                                                            {isMobile && (
                                                                <LegacyGrid.Cell width={MW_LABEL_CELL_WIDTH}>
                                                                    <b>
                                                                        {order.isSameDayOrder
                                                                            ? getText('sameDayOrder')
                                                                            : order.isBopisOrder
                                                                                ? getText('pickupOrder')
                                                                                : getText('standardOrder')}
                                                                    </b>
                                                                </LegacyGrid.Cell>
                                                            )}
                                                            <LegacyGrid.Cell
                                                                width='fill'
                                                                data-at={Sephora.debug.dataAt('order_status')}
                                                            >
                                                                <OrderStatusDisplayName
                                                                    orderStatusDisplayName={
                                                                        order.isSameDayOrder
                                                                            ? order.sameDayOrderStatusDisplayName
                                                                            : order.standardOrderStatusDisplayName
                                                                    }
                                                                    orderStatus={
                                                                        order.isSameDayOrder ? order.sameDayOrderStatus : order.standardOrderStatus
                                                                    }
                                                                />
                                                            </LegacyGrid.Cell>
                                                        </LegacyGrid>
                                                        {order.isSameDayOrder && order.standardOrderStatus && (
                                                            <LegacyGrid
                                                                gutter={MW_GUTTER_SIZE}
                                                                marginBottom={MW_ROW_SPACE}
                                                            >
                                                                {isMobile && (
                                                                    <LegacyGrid.Cell width={MW_LABEL_CELL_WIDTH}>
                                                                        <b>{getText('standardOrder')}</b>
                                                                    </LegacyGrid.Cell>
                                                                )}
                                                                <LegacyGrid.Cell
                                                                    width='fill'
                                                                    data-at={Sephora.debug.dataAt('order_status')}
                                                                >
                                                                    <OrderStatusDisplayName
                                                                        orderStatusDisplayName={order.standardOrderStatusDisplayName}
                                                                        orderStatus={order.standardOrderStatus}
                                                                    />
                                                                </LegacyGrid.Cell>
                                                            </LegacyGrid>
                                                        )}
                                                    </LegacyGrid.Cell>
                                                    <LegacyGrid.Cell
                                                        width={isDesktop && TRACKING_CELL_WIDTH}
                                                        paddingTop={isMobile ? 3 : null}
                                                    >
                                                        {!order.isSameDayOrder && order.buttonState && (
                                                            <TrackOrderButton
                                                                status={order.buttonState}
                                                                url={findTrackingUrl(order.shippingGroups)}
                                                            />
                                                        )}
                                                        <Box marginTop={order.buttonState && 4}>
                                                            <Button
                                                                variant='secondary'
                                                                block={true}
                                                                onClick={() => this.handleViewDetailsClick(order.orderId)}
                                                            >
                                                                {getText('viewDetails')}
                                                            </Button>
                                                        </Box>
                                                    </LegacyGrid.Cell>
                                                </LegacyGrid>
                                            </div>
                                        ))}

                                        {numPagesRetrieved < numPagesTotal && (
                                            <React.Fragment>
                                                <Divider marginY={5} />
                                                <Link
                                                    color='blue'
                                                    padding={3}
                                                    margin={-3}
                                                    onClick={this.handleShowMoreClick}
                                                >
                                                    {getText('showMore')}
                                                </Link>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                )}
                            </Box>
                        )}
                    </React.Fragment>
                )}
            </AccountLayout>
        );
    }
}

export const RecentOrdersComponent = wrapComponent(RecentOrders, 'RecentOrders', true);

export default withEnsureUserIsSignedIn(RecentOrdersComponent);
