import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Image, Divider, Button
} from 'components/ui';
import { space } from 'style/config';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import ProductListItem from 'components/Product/ProductListItem/ProductListItem';
import dateUtils from 'utils/Date';
import anaConsts from 'analytics/constants';
import store from 'Store';
import Actions from 'Actions';
import ProductActions from 'actions/ProductActions';
import BIApi from 'services/api/beautyInsider';
import urlUtils from 'utils/Url';
import processEvent from 'analytics/processEvent';
import skuUtils from 'utils/Sku';
import * as PURCHASES_FILTER_OPTIONS from 'components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions';
import * as PRODUCT_SORT_OPTIONS from 'components/Product/ProductSort/ProductSortOptions';
import localeUtils from 'utils/LanguageLocale';

const { formatDateMDY } = dateUtils;
const BREATH_SPACING = 5;

//SEPHORA_WEB_STORE_NAME is used due to BE returning SEPHORA .COM
//instead of Sephora.com or SEPHORA.COM, after BE fix [ILLUPH-106140], this won't be needed
const SEPHORA_WEB_STORE_NAME = 'SEPHORA .COM ';
const SEPHORA_DISPLAY_STORE_NAME = 'Sephora.com';

const storeDisplayNamesMap = {
    [SEPHORA_WEB_STORE_NAME]: SEPHORA_DISPLAY_STORE_NAME,
    [SEPHORA_WEB_STORE_NAME.replace(' ', '').trim()]: SEPHORA_DISPLAY_STORE_NAME
};

class PurchasedGroups extends BaseClass {
    state = {
        purchasedGroups: [],
        currentPage: 1,
        selectedSortOption: this.props.sortOptions[0].code,
        selectedFilterOption: this.props.filterOptions[0].code
    };

    componentDidMount() {
        const { itemsPerPage, currentUserId, sortOptions, filterOptions } = this.props;
        const filterByParam = urlUtils.getParamValueAsSingleString('filterby');
        const { currentPage } = this.state;

        const isRewards = filterByParam === 'rewards';

        this.getPurchasedGroups(
            currentUserId,
            isRewards ? PRODUCT_SORT_OPTIONS.RECENTLY.code : sortOptions[0].code,
            itemsPerPage,
            currentPage,
            isRewards ? PURCHASES_FILTER_OPTIONS.REWARDS.code : filterOptions[0].code
        );

        store.watchAction(ProductActions.TYPES.SELECT_SORT_OPTION, data => {
            const sortOption = data.sortOption;
            const filterOption = this.state.selectedFilterOption;
            this.setState(
                {
                    purchasedGroups: [],
                    selectedSortOption: sortOption.code
                },
                () => {
                    this.getPurchasedGroups(currentUserId, sortOption.code, itemsPerPage, 1, filterOption);
                    // Analytics - ILLUPH-101468
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            categoryFilters: ['sortby:' + sortOption.code],
                            pageDetail: digitalData.page.pageInfo.pageName,
                            pageType: digitalData.page.category.pageType,
                            pageName: digitalData.page.attributes.sephoraPageInfo.pageName
                        }
                    });
                }
            );
        });

        store.watchAction(ProductActions.TYPES.SELECT_FILTER_OPTION, data => {
            const filterOption = data.filterOption;
            const sortOption = this.state.selectedSortOption;
            this.setState(
                {
                    purchasedGroups: [],
                    selectedFilterOption: filterOption.code
                },
                () => {
                    this.getPurchasedGroups(currentUserId, sortOption, itemsPerPage, 1, filterOption.code);
                    // Analytics - ILLUPH-112118
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            categoryFilters: ['filterby:' + filterOption.name],
                            pageDetail: digitalData.page.pageInfo.pageName,
                            pageType: digitalData.page.category.pageType,
                            pageName: digitalData.page.attributes.sephoraPageInfo.pageName
                        }
                    });
                }
            );
        });
    }

    getPurchasedGroupName = (storeName, getText, isOnline) => {
        const suffix = getText('purchasedOnline');
        const storeAddendum = !storeDisplayNamesMap[storeName] ? (isOnline ? `${storeName} ${suffix}` : storeName) : '';

        return `${!isOnline && storeDisplayNamesMap[storeName] ? storeDisplayNamesMap[storeName] : ''}${storeAddendum}`;
    };

    getPurchasedGroups = (userId, sortBy, itemsPerPage, currentPage, purchaseFilter) => {
        const groupBy = sortBy !== this.props.sortOptions[0].code ? 'none' : 'storeAndDate';
        BIApi.getPurchaseHistory(userId, {
            sortBy,
            itemsPerPage,
            currentPage,
            groupBy,
            purchaseFilter
        })
            .then(data => {
                store.dispatch(Actions.updatePurchasedHistoryItemCount(data.purchasedItemsCount));
                const objectsToSent = data.purchasedGroups ? data.purchasedGroups : [{ purchasedItems: data.purchasedItems }];
                this.setPurchasedGroups(data, currentPage);
                this.getFilterOptions(objectsToSent);
            })
            .catch(console.error); // eslint-disable-line no-console
    };

    setPurchasedGroups = (data, page) => {
        const { sortOptions } = this.props;
        const { selectedSortOption = sortOptions[0].code } = this.state;
        let statePurchasedGroups = this.state.purchasedGroups.map(item => item);

        // No sort
        if (statePurchasedGroups.length > 0 && page > 1) {
            if (selectedSortOption !== sortOptions[0].code) {
                // Sort Active
                // this is for 'showMore' functionality
                data.purchasedItems.forEach(item => statePurchasedGroups[0].purchasedItems.push(item));
            } else {
                // this is for 'showMore' functionality
                // push the new groups to the purchasedGroups state if there is a page change
                // check in state purchasedGroups for already rendered groups
                // add new items to state purchasedGroup if same store and date
                // and remove group from API data
                statePurchasedGroups.forEach(stateGroup => {
                    data.purchasedGroups.forEach((group, groupIndex) => {
                        if (stateGroup.storeNumber === group.storeNumber && stateGroup.transactionDate === group.transactionDate) {
                            data.purchasedGroups.splice(groupIndex, 1);
                            group.purchasedItems.forEach(item => stateGroup.purchasedItems.push(item));
                        }
                    });
                });
                // set the rest of the groups
                data.purchasedGroups.forEach(group => {
                    statePurchasedGroups.push(group);
                });
            }
        } else {
            if (selectedSortOption !== sortOptions[0].code) {
                // Sort Active
                // When filter is active there is no purchaseGroups only PurchasedItems so,
                // create default one with only purchasedItems prop
                statePurchasedGroups = [{ purchasedItems: data.purchasedItems }];
            } else {
                statePurchasedGroups = data.purchasedGroups;
            }
        }

        this.setState({
            currentPage: page,
            purchasedGroups: statePurchasedGroups,
            purchasedItemsCount: data.purchasedItemsCount,
            hasNoPurchaseHistory: data.purchasedItemsCount === 0
        });
    };

    getPurchasedGroupDate = dateString => {
        if (localeUtils.isFRCanada()) {
            const datearray = dateString.split('/');
            const dateDMY = datearray[1] + '/' + datearray[0] + '/' + datearray[2];

            return formatDateMDY(dateDMY, true, true);
        }

        return formatDateMDY(dateString, true, true);
    };

    handleShowMoreClick = () => {
        const { selectedSortOption, selectedFilterOption, currentPage } = this.state;
        const { itemsPerPage, currentUserId, sortOptions, filterOptions } = this.props;
        const nextPage = currentPage + 1;
        const sortOption = selectedSortOption ? selectedSortOption : sortOptions[0].code;
        const filterOption = selectedFilterOption ? selectedFilterOption : filterOptions[0].code;

        this.getPurchasedGroups(currentUserId, sortOption, itemsPerPage, nextPage, filterOption);
    };

    getFilterOptions = purchasedGroups => {
        const filterOptions = this.filterOptions || new Set([PURCHASES_FILTER_OPTIONS.BOTH]);

        if (purchasedGroups.length > 0) {
            purchasedGroups.forEach(group => {
                const purchasedItems = group.purchasedItems;
                purchasedItems.forEach(item => {
                    if (skuUtils.isBiReward(item.sku)) {
                        filterOptions.add(PURCHASES_FILTER_OPTIONS.REWARDS);
                    } else if (item.isOnline) {
                        filterOptions.add(PURCHASES_FILTER_OPTIONS.ONLINE);
                    } else {
                        filterOptions.add(PURCHASES_FILTER_OPTIONS.STORE);
                    }
                });
            });
        }

        this.filterOptions = filterOptions;
        store.dispatch(ProductActions.purchasesFilterOptions([...filterOptions]));
    };

    getPurchasedGroupDate = dateString => {
        return formatDateMDY(dateString, true, true);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/PurchaseHistoryList/PurchasedGroups/locales', 'PurchasedGroups');
        const { itemsPerPage } = this.props;
        const isMobile = Sephora.isMobile();
        const { purchasedGroups, currentPage, purchasedItemsCount, hasNoPurchaseHistory } = this.state;

        return (
            <React.Fragment>
                {purchasedGroups && purchasedGroups.length > 0 && (
                    <React.Fragment>
                        {purchasedGroups.map((group, groupIndex) => {
                            const isGroupOnline = group && group.purchasedItems && group.purchasedItems[0] && group.purchasedItems[0].isOnline;

                            return (
                                <React.Fragment key={group.transactionDate || groupIndex.toString()}>
                                    {group.transactionDate && group.storeNumber && (
                                        <React.Fragment>
                                            {groupIndex !== 0 && (
                                                <Divider
                                                    marginY={4}
                                                    height={3}
                                                    color='nearWhite'
                                                />
                                            )}
                                            <LegacyContainer marginY={4}>
                                                <Text
                                                    is='p'
                                                    data-at={Sephora.debug.dataAt(getText('orderDateDataAt'))}
                                                    lineHeight='tight'
                                                    fontSize={!isMobile ? 'md' : null}
                                                >
                                                    {this.getPurchasedGroupDate(group.transactionDate)}
                                                    <br />
                                                    <span data-at={Sephora.debug.dataAt('order_channel')}>
                                                        {this.getPurchasedGroupName(group.storeName, getText, isGroupOnline)}
                                                    </span>
                                                </Text>
                                                <Divider marginY={4} />
                                            </LegacyContainer>
                                        </React.Fragment>
                                    )}
                                    {group.purchasedItems &&
                                        group.purchasedItems.length > 0 &&
                                        group.purchasedItems.map((item, index) => (
                                            <LegacyContainer key={`${item.sku.skuId}-${index}`}>
                                                {index > 0 && <Divider marginY={4} />}
                                                <ProductListItem
                                                    sku={item.sku}
                                                    isPurchaseHistoryItemList={true}
                                                    rootContainerName={this.props.rootContainerName}
                                                    productStringContainerName={anaConsts.COMPONENT_TITLE.PURCHASE_LISTS}
                                                />
                                            </LegacyContainer>
                                        ))}
                                </React.Fragment>
                            );
                        })}
                        ;
                        {purchasedItemsCount > currentPage * itemsPerPage && (
                            <LegacyContainer
                                textAlign='center'
                                marginBottom={`calc(${space[BREATH_SPACING]}px + var(--bottomNavHeight))`}
                            >
                                <Divider
                                    marginTop={4}
                                    marginBottom={BREATH_SPACING}
                                />
                                <Button
                                    variant='secondary'
                                    block={isMobile}
                                    hasMinWidth={true}
                                    marginX='auto'
                                    onClick={this.handleShowMoreClick}
                                    children={getText('showMoreMessage')}
                                />
                            </LegacyContainer>
                        )}
                    </React.Fragment>
                )}

                {hasNoPurchaseHistory && (
                    <LegacyContainer textAlign='center'>
                        <Image
                            src='/img/ufe/rich-profile/purchaseHistory.svg'
                            display='block'
                            marginX='auto'
                            size={128}
                            marginTop={7}
                            marginBottom={6}
                        />
                        <Text
                            is='p'
                            marginBottom={5}
                            maxWidth='25em'
                            marginX='auto'
                        >
                            <b>{getText('noPurchaseHistoryMessage')}</b>
                            <br />
                            {getText('purchaseBIMessage')}
                            <br />
                            {getText('listReferenceMessage')}
                        </Text>
                        <Button
                            variant='primary'
                            href='/'
                            hasMinWidth={true}
                            marginX='auto'
                            children={getText('startShoppingMessage')}
                        />
                    </LegacyContainer>
                )}
            </React.Fragment>
        );
    }
}

export default wrapComponent(PurchasedGroups, 'PurchasedGroups', true);
