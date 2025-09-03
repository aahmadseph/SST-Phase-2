import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Flex, Image, Text, Box, Button, Divider
} from 'components/ui';
import { space } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import ProductSort from 'components/Product/ProductSort/ProductSort';
import PurchasesFilter from 'components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilter';
import PurchasedGroups from 'components/RichProfile/PurchaseHistoryList/PurchasedGroups/PurchasedGroups';
import * as PRODUCT_SORT_OPTIONS from 'components/Product/ProductSort/ProductSortOptions';
import * as PURCHASES_FILTER_OPTIONS from 'components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions';
import ListPageHeader from 'components/RichProfile/ListPageHeader/ListPageHeader';
import localeUtils from 'utils/LanguageLocale';
import ReplenProductItem from 'components/Product/ReplenProductItem/ReplenProductItem';
import store from 'Store';
import auth from 'utils/Authentication';
import Actions from 'Actions';
import ProductActions from 'actions/ProductActions';
import userUtils from 'utils/User';
import biApi from 'services/api/beautyInsider';
import { UserInfoReady } from 'constants/events';
import { mediaQueries } from 'style/config';
import { HEADER_VALUE } from 'constants/authentication';

const { showBiRegisterModal } = Actions;
const REPLEN_ITEMS_PER_SLIDE = 9;

class PurchaseHistoryList extends BaseClass {
    state = {
        itemsPerPage: 10,
        purchasedItemsCount: 0,
        filterOptions: PURCHASES_FILTER_OPTIONS.LIST
    };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, userData => {
                const isAnonymous = userUtils.isAnonymous();
                const isBI = userUtils.isBI();
                this.setState({
                    currentUserId: userData.user.profileId,
                    isAnonymous: isAnonymous,
                    isBI: isBI
                });
            });
        });

        store.watchAction(Actions.TYPES.UPDATE_PURCHASE_HISTORY_ITEM_COUNT, data => {
            this.setState({ purchasedItemsCount: data.purchasedItemsCount });
        });

        store.watchAction(ProductActions.TYPES.PURCHASES_FILTER_OPTIONS, data => {
            this.setState({ filterOptions: data.filterOptions });
        });

        //Analytics - ILLUPH-101468
        digitalData.page.category.pageType = 'user profile';
        digitalData.page.pageInfo.pageName = 'lists-purchases';

        const options = {
            includeNonBiUserPurchases: true,
            sortBy: 'recently',
            groupBy: 'frequencyAndDate',
            excludeSamples: true,
            excludeRewards: true,
            itemsPerPage: 21
        };

        const sortPurchasesByFrequency = userPurchases => {
            const sortedPurchases = [];
            userPurchases.forEach(currentPurchase => {
                if (sortedPurchases.length < 1) {
                    sortedPurchases.push(currentPurchase);
                } else {
                    const firstElement = sortedPurchases[0];

                    if (currentPurchase.frequency >= firstElement.frequency) {
                        sortedPurchases.unshift(currentPurchase);
                    } else {
                        sortedPurchases.push(currentPurchase);
                    }
                }
            });

            return sortedPurchases;
        };

        const sortPurchasesByDate = userPurchases => {
            userPurchases.sort((firstPurchase, secondPurchase) => {
                return new Date(secondPurchase.transactionDate) - new Date(firstPurchase.transactionDate);
            });

            return userPurchases;
        };

        const profileId = store.getState().user.profileId;

        if (profileId) {
            biApi.getPurchaseHistory(profileId, options).then(purchaseHistory => {
                const { purchasedItems } = purchaseHistory;
                this.setState({
                    sortedPurchases: sortPurchasesByFrequency(sortPurchasesByDate(purchasedItems))
                });
            });
        }
    }

    handleButtonClick = () => {
        const { isAnonymous } = this.state;

        if (isAnonymous) {
            auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
        } else {
            store.dispatch(showBiRegisterModal({ isOpen: true }));
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/PurchaseHistoryList/locales', 'PurchaseHistoryList');
        const {
            itemsPerPage, currentUserId, isAnonymous, isBI, purchasedItemsCount, sortedPurchases
        } = this.state;
        const isMobile = Sephora.isMobile();
        const hasPurchasedHistory = purchasedItemsCount > 0;
        const mobileLinkProps = {
            paddingX: 1,
            height: '3.5em',
            minWidth: '100%'
        };

        // ILLUPH-131086 Replen Carousel for Purchase History
        const isChallenger =
            this.props.testTarget &&
            this.props.testTarget.replenCarouselPurchaseHistory &&
            this.props.testTarget.replenCarouselPurchaseHistory.show &&
            !isMobile &&
            !localeUtils.isFRCanada();

        const replenItemsCarouselTitle = getText('replenItemsCarouselTitle');
        const replenItems = [];

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

        const hasReplenCarousel = isChallenger && replenItems && replenItems.length > 0;

        return (
            <main css={{ [mediaQueries.smMax]: { minHeight: '600px' }, marginBottom: '100px' }}>
                {hasReplenCarousel && (
                    <React.Fragment>
                        <ListPageHeader
                            hasDivider={false}
                            children={replenItemsCarouselTitle}
                        />
                        <LegacyContainer marginY={6}>
                            <LegacyCarousel
                                displayCount={REPLEN_ITEMS_PER_SLIDE}
                                showArrows={replenItems.length > REPLEN_ITEMS_PER_SLIDE}
                                showTouts={replenItems.length > REPLEN_ITEMS_PER_SLIDE}
                                totalItems={replenItems.length}
                                gutter={space[4]}
                                controlHeight={75}
                                isFlexItem={true}
                            >
                                {replenItems}
                            </LegacyCarousel>
                        </LegacyContainer>
                    </React.Fragment>
                )}
                <ListPageHeader
                    noMargin={isMobile}
                    hasLink={!hasReplenCarousel}
                    children={getText('buyItAgain')}
                />
                {currentUserId && isBI && (
                    <React.Fragment>
                        {hasPurchasedHistory && (
                            <React.Fragment>
                                {isMobile ? (
                                    <LegacyGrid
                                        position='relative'
                                        textAlign='center'
                                        fill={true}
                                        lineHeight='tight'
                                        borderBottom={1}
                                        borderColor='divider'
                                        marginBottom={4}
                                    >
                                        <LegacyGrid.Cell>
                                            <ProductSort
                                                mobileLinkProps={mobileLinkProps}
                                                sortOptions={PRODUCT_SORT_OPTIONS.LIST}
                                                ariaDescribedById={getText('sortDescribedById')}
                                                ariaDescribedByText={getText('sortDescribedByText')}
                                            />
                                        </LegacyGrid.Cell>
                                        <LegacyGrid.Cell
                                            borderLeft={1}
                                            borderColor='divider'
                                        >
                                            <PurchasesFilter
                                                mobileLinkProps={mobileLinkProps}
                                                filterOptions={this.state.filterOptions}
                                                ariaDescribedById={getText('filterDescribedById')}
                                                ariaDescribedByText={getText('filterDescribedByText')}
                                            />
                                        </LegacyGrid.Cell>
                                    </LegacyGrid>
                                ) : (
                                    <LegacyContainer>
                                        <Flex
                                            alignItems='center'
                                            justifyContent='flex-end'
                                        >
                                            <ProductSort
                                                sortOptions={PRODUCT_SORT_OPTIONS.LIST}
                                                ariaDescribedById={getText('sortDescribedById')}
                                                ariaDescribedByText={getText('sortDescribedByText')}
                                            />

                                            <Box
                                                width='1px'
                                                height='1.375em'
                                                backgroundColor='lightGray'
                                                marginX={4}
                                            />

                                            <PurchasesFilter
                                                filterOptions={this.state.filterOptions}
                                                ariaDescribedById={getText('filterDescribedById')}
                                                ariaDescribedByText={getText('filterDescribedByText')}
                                            />
                                        </Flex>
                                        <Divider marginY={4} />
                                    </LegacyContainer>
                                )}
                            </React.Fragment>
                        )}
                        <PurchasedGroups
                            currentUserId={currentUserId}
                            sortOptions={PRODUCT_SORT_OPTIONS.LIST}
                            filterOptions={this.state.filterOptions}
                            itemsPerPage={itemsPerPage}
                            rootContainerName='purchase lists'
                        />
                    </React.Fragment>
                )}

                {(isAnonymous || (currentUserId && !isBI)) && !hasPurchasedHistory && (
                    <LegacyContainer textAlign='center'>
                        <Image
                            src='/img/ufe/rich-profile/purchaseHistory.svg'
                            display='block'
                            marginX='auto'
                            size={128}
                            marginTop={7}
                            marginBottom={6}
                        />
                        {isAnonymous ? (
                            <Text
                                is='p'
                                marginBottom={5}
                                maxWidth='25em'
                                marginX='auto'
                            >
                                <b>{getText('signInMessage')}</b>
                                <br />
                                {getText('signInMessageDescription')}
                            </Text>
                        ) : (
                            <Text
                                is='p'
                                marginBottom={5}
                                fontWeight='bold'
                            >
                                {getText('beautyMemberMessage')}
                                <br />
                                {getText('beautyMemberMessageBr')}
                            </Text>
                        )}
                        <Button
                            variant='primary'
                            marginX='auto'
                            onClick={this.handleButtonClick}
                            hasMinWidth={true}
                            children={isAnonymous ? getText('signIn') : getText('joinNow')}
                        />
                    </LegacyContainer>
                )}
            </main>
        );
    }
}

export default wrapComponent(PurchaseHistoryList, 'PurchaseHistoryList', true);
