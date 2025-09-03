import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Empty from 'constants/empty';
import Modal from 'components/Modal/Modal';
import { space, mediaQueries } from 'style/config';
import CreateNewListModal from 'components/CreateNewList';
import { LOVES_LIST_MAX, OTHER_LIST_MAX } from 'constants/sharableList';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import {
    Button, Flex, Box, Text, Grid, Icon, Link
} from 'components/ui';
import anaConsts from 'analytics/constants.js';
import store from 'store/Store';
import LoveActions from 'actions/LoveActions';
import Location from 'utils/Location';
import myListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import {
    MAX_ONLY_A_FEW_LEFT_IN_LOVES_LIST_FLYOUT,
    MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE,
    MAX_FLYOUT_RECENT_ITEMS,
    RECENT_ITEMS_PAGINATION_SIZE,
    MIN_ITEMS_PER_PAGE,
    MAX_ITEMS_PER_PAGE
} from 'constants/sharableList';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { USER_PROFILE } = anaConsts.PAGE_TYPES;
const { LOVES } = anaConsts.EVENT_NAMES;
class MyListsModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            skus: props.skuList,
            title: props.title,
            targetUrl: props.action?.targetUrl,
            isCreateNewListModal: false,
            listNameTextMessage: '',
            listNameTextError: false,
            isHidden: true,
            listErrorsById: {},
            ctaClickedById: {},
            hasClickedCtaOnceById: {},
            shouldDisplayImageById: {},
            isInListById: {},
            isDefaultListAdd: false,
            newListCreated: false,
            itemsCount: this.deriveCounts(props.myLists) || {},
            isLovesEventTriggered: false, //STAG analytics event purpose,
            apiCallInProgress: false,
            shouldCallLimitedItems: false
        };
    }

    deriveCounts = myLists => {
        return (
            myLists?.allLoves?.reduce((acc, list) => {
                acc[list.shoppingListId] = list.shoppingListItemsCount;

                return acc;
            }, {}) || {}
        );
    };

    toogleCreateNewListModal = () => {
        //Trigger STAG Analytics event
        if (!this.state?.isCreateNewListModal) {
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.CREATE_NEW_LIST
            });
        }

        this.setState(prevState => ({
            isCreateNewListModal: !prevState.isCreateNewListModal
        }));
    };

    handleLoveError = (error, listId) => {
        const { somethingWentWrong } = this.props.localization;
        const genericError = 'Failed to fetch';

        if (!error) {
            return;
        }

        const msg = (error?.message && !error.message.includes(genericError)) || error?.response?.data?.error || somethingWentWrong;
        myListsBindings.triggerErrorAnalytics({ errorMessage: msg });
        this.setState(prev => ({
            listErrorsById: {
                ...prev.listErrorsById,
                [listId]: msg
            },
            isInListById: {
                ...prev.isInListById,
                [listId]: false
            },
            apiCallInProgress: false
        }));
    };

    getShoppingListItems = (data, shoppingListId) => {
        const list = data?.allLoves?.find(({ shoppingListId: id }) => id === shoppingListId);

        if (!list?.shoppingListItems?.length) {
            return { skuIdString: '', shoppingListItemsCount: 0 };
        }

        const skuIdString = list.shoppingListItems.flatMap(item => (item.sku?.skuId ? [item.sku.skuId] : [])).join(',');

        return {
            skuIdString,
            shoppingListItemsCount: list.shoppingListItemsCount ?? list.shoppingListItems.length
        };
    };

    //check trgetSkuId available in the loves List
    checkSkuAvailableInList = (loves, targetSkuId) => {
        let isAvailable = false;

        // Iterate through each shopping list in allLoves
        for (const list of loves) {
            // Iterate through each item in shoppingListItems
            for (const item of list.shoppingListItems) {
                // Check if sku exists and add skuId to Set
                if (item.sku && item.sku.skuId) {
                    // Check if skuId matches targetSkuId
                    if (item.sku.skuId === targetSkuId) {
                        isAvailable = true;
                    }
                }
            }
        }

        return isAvailable;
    };

    addToList = (skuLoveData, listId = null, shoppingListName = null) => {
        const { addItemToSharableList, myLists = {} } = this.props;
        const payload = {
            source: 'productPage',
            productId: skuLoveData.productId,
            skuId: skuLoveData.skuId
        };
        const skuId = skuLoveData.skuId;

        const list = listId ? myLists.allLoves.find(l => l.shoppingListId === listId) : undefined;

        if (listId) {
            payload.shoppingListId = listId;
            payload.shoppingListName = shoppingListName;
        }

        const { skuIdString, shoppingListItemsCount } = this.getShoppingListItems(myLists, listId);

        const analyticsData = {
            skuIdString: skuIdString || '',
            shoppingListItemsCount: shoppingListItemsCount || null
        };

        return addItemToSharableList(
            payload,
            response => {
                if (list && !list.isDefault) {
                    myListsBindings.addToList({ skuId });
                } else {
                    myListsBindings.addToLove({ skuId });
                }

                this.setState(prev => ({
                    isInListById: {
                        ...prev.isInListById,
                        [listId]: true
                    },
                    imageDisplayFlag: {
                        ...prev.imageDisplayFlag,
                        [listId]: true
                    },
                    itemsCount: {
                        ...prev.itemsCount,
                        [listId]: prev.itemsCount[listId] + 1
                    },
                    ctaClickedById: {
                        ...prev.ctaClickedById,
                        [listId]: false
                    },
                    shouldDisplayImageById: {
                        ...prev.shouldDisplayImageById,
                        [listId]: true
                    },
                    listErrorsById: {
                        ...prev.listErrorsById,
                        [listId]: null
                    },
                    apiCallInProgress: false,
                    shouldCallLimitedItems: skuLoveData.isOnlyFewLeft
                }));
                //STAG Analytics
                ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                    eventName: anaConsts.EVENT_NAMES.LOVES.ADD_SKU_TO_LIST,
                    ...analyticsData,
                    ...(response || {})
                });
            },
            error => {
                this.handleLoveError(error, listId);
            }
        );
    };

    handleToggleLove = (skuLoveData, listId) => {
        const { myLists, localization, removeItemFromSharableList } = this.props;
        const { itemsCount, apiCallInProgress } = this.state;
        const list = myLists.allLoves.find(l => l.shoppingListId === listId);

        if (!list || apiCallInProgress) {
            return;
        }

        const skuId = skuLoveData.skuId;
        const productId = skuLoveData.productId;
        const hasStateEntry = Object.prototype.hasOwnProperty.call(this.state.isInListById, listId);
        const isSkuInList = hasStateEntry
            ? this.state.isInListById[listId]
            : list.shoppingListItems.some(item => item.sku.skuId === skuId && item.sku.productId === productId);

        this.setState(prev => ({
            hasClickedCtaOnceById: {
                ...prev.hasClickedCtaOnceById,
                [listId]: true
            },
            ctaClickedById: {
                ...prev.ctaClickedById,
                [listId]: true
            },
            listErrorsById: {
                ...prev.listErrorsById,
                [listId]: null
            },
            apiCallInProgress: true
        }));

        if (isSkuInList) {
            const productLoveData = {
                skuId: skuLoveData.skuId,
                productId: skuLoveData.productId,
                type: 'loves',
                id: listId
            };
            removeItemFromSharableList(
                productLoveData,
                () => {
                    if (list.isDefault) {
                        myListsBindings.removeFromLove({ skuId });
                    } else {
                        myListsBindings.removeFromList({ skuId });
                    }

                    this.setState(prev => ({
                        isInListById: {
                            ...prev.isInListById,
                            [listId]: false
                        },
                        itemsCount: {
                            ...prev.itemsCount,
                            [listId]: prev.itemsCount[listId] - 1 || 0
                        },
                        shouldDisplayImageById: {
                            ...prev.shouldDisplayImageById,
                            [listId]: false
                        },
                        ctaClickedById: {
                            ...prev.ctaClickedById,
                            [listId]: false
                        },
                        listErrorsById: {
                            ...prev.listErrorsById,
                            [listId]: null
                        },
                        apiCallInProgress: false,
                        shouldCallLimitedItems: skuLoveData.isOnlyFewLeft
                    }));
                },
                error => {
                    this.handleLoveError(error, listId);
                },
                skuLoveData.productId
            );
        } else {
            const isLovesListMaxedOut = itemsCount[list.shoppingListId] >= LOVES_LIST_MAX && list.isDefault === true;
            const isOtherListMaxedOut = itemsCount[list.shoppingListId] >= OTHER_LIST_MAX && list.isDefault === false;

            if (isLovesListMaxedOut || isOtherListMaxedOut) {
                const maxErrorMessage = localization.maxProductsSavedErrorMessage;

                myListsBindings.triggerErrorAnalytics({ errorMessage: maxErrorMessage });
                this.setState(prev => ({
                    ctaClickedById: {
                        ...prev.ctaClickedById,
                        [listId]: true
                    },
                    listErrorsById: {
                        ...prev.listErrorsById,
                        [listId]: maxErrorMessage
                    },
                    apiCallInProgress: false
                }));

                return;
            }

            this.addToList(skuLoveData, listId, list.shoppingListName);
        }
    };

    renderCTA = (skuLoveData, listId) => {
        const { myLists, localization } = this.props;
        const list = myLists.allLoves.find(l => l.shoppingListId === listId);

        if (!list) {
            return null;
        }

        const skuId = skuLoveData.skuId;
        const productId = skuLoveData.productId;
        const hasStateEntry = Object.prototype.hasOwnProperty.call(this.state.isInListById, listId);
        const isSkuInList = hasStateEntry
            ? this.state.isInListById[listId]
            : list.shoppingListItems.some(item => item.sku.skuId === skuId && item.sku.productId === productId);

        return (
            <Button
                variant='secondary'
                size='sm'
                css={{ alignSelf: 'center' }}
                onClick={() => this.handleToggleLove(skuLoveData, listId)}
                paddingY={0}
            >
                {!isSkuInList ? (
                    localization.add
                ) : (
                    <span>
                        <Icon
                            name='checkmark'
                            size='1em'
                            css={{
                                position: 'absolute',
                                transform: 'translateX(calc(-100% - 18px))'
                            }}
                            marginTop='1px'
                        />
                        <Text
                            fontSize='sm'
                            fontWeight='700'
                            display='block'
                            marginLeft={2}
                        >
                            {localization.added}
                        </Text>
                        <Text
                            fontSize='xs'
                            fontWeight='normal'
                            display='block'
                            color='blue'
                            marginLeft={2}
                        >
                            {localization.remove}
                        </Text>
                    </span>
                )}
            </Button>
        );
    };

    componentDidMount() {
        const { isLoveListUpdated, myLists, showCreateListModal, isPerfImprovementEnabled } = this.props;

        if (this.props.user?.beautyInsiderAccount?.biAccountId) {
            if (isPerfImprovementEnabled) {
                this.props.getAllListsSkusOverview({
                    callback: () => {
                        store.dispatch(LoveActions.setLoveListUpdated(false));
                    },
                    force: false,
                    options: {
                        skipProductDetails: true
                    }
                });
            } else {
                this.props.getAllLists({
                    callback: () => {
                        store.dispatch(LoveActions.setLoveListUpdated(false));
                    },
                    force: isLoveListUpdated
                });
            }
        }

        if (this.props.showCreateListModal) {
            this.toogleCreateNewListModal();
        } else {
            myListsBindings.pageLoadMyListModal({
                pageType: USER_PROFILE,
                eventName: LOVES.MY_LISTS_MODAL
            });
        }

        //STAG analytics
        if (myLists?.allLoves?.length && !showCreateListModal) {
            const data = ViewAllLovesBindings.formatShareableLists(myLists?.allLoves);
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_DISPLAYED,
                ...data,
                listsCount: myLists?.allLoves.length
            });
        }

        // IMPORTANT: This code is required by other stories/features—do not remove.
        // Retrieve data from IndexedDB and save it to component state
        // this.loadLoves();
    }

    // IMPORTANT: This code is required by other stories/features—do not remove.
    // Retrieve data from IndexedDB and save it to component state
    // Ensure to import Storage and initialize component’s state with `loves: {}`
    // loadLoves = async () => {
    //     console.log(' → _loadLoves start');
    //     const cacheKey = 'lovedItemsFlatListSkuOnly';

    //     try {
    //         const cached = await Storage.db.getItem(cacheKey);
    //         console.log(' → after getItem():', cached);

    //         if (cached) {
    //             console.log(' ✔ cache hit, rendering from IndexedDB', cached);
    //             this.setState({ loves: cached, loading: false });
    //         } else {
    //             console.log(' ⚠ no cache—fetching from API');
    //         }
    //     } catch (err) {
    //         console.error(' ✖ error in _loadLoves():', err);
    //         this.setState({ error: err, loading: false });
    //     }
    // };

    componentDidUpdate(prevProps) {
        const { myLists, skuLoveData, showCreateListModal } = this.props;

        if (myLists?.allLoves !== prevProps.myLists?.allLoves) {
            this.setState({ isHidden: false });
            this.setState({ itemsCount: this.deriveCounts(this.props.myLists) });
        }

        if (myLists?.allLoves !== prevProps.myLists?.allLoves && !this.state.isDefaultListAdd) {
            const loves = myLists?.allLoves?.filter(list => !list.isCreateList) || [];
            const skuId = skuLoveData.skuId;

            //STAG Analytics add to loves event purpose
            const skuAvailable = this.checkSkuAvailableInList(loves, skuId);
            this.setState({ isLovesEventTriggered: skuAvailable });

            if (loves.length === 1) {
                const items = loves[0].shoppingListItems || [];
                const alreadyInList = items.some(item => item.sku.skuId === skuId);

                if (alreadyInList) {
                    this.setState({ isDefaultListAdd: true });

                    return;
                }
            }

            if (myLists?.allLoves && loves.length <= 1 && !showCreateListModal) {
                const defaultList = loves[0] || {};
                const listId = defaultList.shoppingListId;
                const listName = defaultList.shoppingListName;
                myListsBindings.addToLove({ skuId: skuLoveData.skuId });

                this.setState({ isDefaultListAdd: true }, () => {
                    this.addToList(skuLoveData, listId, listName);
                });
            }
        }
    }

    handleNewListCreated = () => {
        const { isPerfImprovementEnabled } = this.props;
        this.setState({ newListCreated: true });

        if (isPerfImprovementEnabled) {
            this.props.getAllListsSkusOverview({
                callback: () => {
                    store.dispatch(LoveActions.setLoveListUpdated(false));
                },
                force: true,
                options: {
                    skipProductDetails: true
                }
            });
        }
    };

    updateItemsData = () => {
        const {
            getFlatLoveListSkusOverview, getFlatLoveListSkusWithDetails, getAllLists, user, getLimitedLoveListItems, isPerfImprovementEnabled
        } =
            this.props;
        const { ctaClickedById, newListCreated, shouldCallLimitedItems } = this.state;
        const hasListModifications = Object.keys(ctaClickedById).length > 0 || newListCreated;
        const isMyListsPage = Location.isMyListsPage();

        if (hasListModifications) {
            if (user?.beautyInsiderAccount?.biAccountId) {
                getAllLists({
                    force: true,
                    options: { itemsPerPage: isPerfImprovementEnabled ? MIN_ITEMS_PER_PAGE : MAX_ITEMS_PER_PAGE },
                    callback: async () => {
                        await Storage.db.removeItem(LOCAL_STORAGE.ALL_LOVE_LIST_SKU_ONLY);
                    }
                });
            }

            getFlatLoveListSkusOverview(true, null, true);
            getLimitedLoveListItems({
                refreshCache: shouldCallLimitedItems,
                options: {
                    itemsPerPage: isMyListsPage ? MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE : MAX_ONLY_A_FEW_LEFT_IN_LOVES_LIST_FLYOUT
                }
            });
            getFlatLoveListSkusWithDetails(
                response => {
                    this.handleStagLovesAnalaytics(response);
                },
                true,
                {
                    itemsPerPage: isMyListsPage ? RECENT_ITEMS_PAGINATION_SIZE : MAX_FLYOUT_RECENT_ITEMS,
                    currentPage: 1
                }
            );
        }
    };

    handleListClick = (e, targetUrl) => {
        e.preventDefault();
        const { showMyListsModal, setSkuLoveData } = this.props;

        showMyListsModal(false);
        setSkuLoveData({
            loveSource: null,
            skuId: null,
            productId: null
        });

        this.updateItemsData();

        if (targetUrl) {
            Location.navigateTo(e, `profile/Lists/${targetUrl}`);
        }
    };

    handleStagLovesAnalaytics = response => {
        const { skuLoveData, myLists } = this.props;
        const skuId = skuLoveData?.skuId;

        if (!skuId) {
            return;
        }

        let skuInfo = null;
        const skuIds = response
            .map(list => {
                const currentSkuId = list?.sku?.skuId;

                if (currentSkuId === skuId) {
                    skuInfo = list?.sku;
                }

                return currentSkuId;
            })
            .filter(Boolean);

        const eventAlreadyTriggered = this.state?.isLovesEventTriggered;

        if (skuInfo && !eventAlreadyTriggered) {
            ViewAllLovesBindings.triggerShareableListSOTAnalytics('love', skuId, skuInfo, skuIds);
        } else if (!skuInfo) {
            // Find skuInfo from myLists
            myLists?.allLoves.forEach(list => {
                list.shoppingListItems.forEach(item => {
                    if (item.sku && item.sku.skuId === skuId) {
                        skuInfo = item.sku;
                    }
                });
            });

            // If skuId is not in the list, trigger un-love event
            if (!skuIds.includes(skuId)) {
                ViewAllLovesBindings.triggerShareableListSOTAnalytics('un-love', skuId, skuInfo, skuIds);
            }
        }
    };

    handleClick = () => {
        const { showMyListsModal, setSkuLoveData, getShoppingListById } = this.props;
        const { ctaClickedById, newListCreated } = this.state;
        const hasListModifications = Object.keys(ctaClickedById).length > 0 || newListCreated;
        this.updateItemsData();

        if (hasListModifications) {
            if (Location.isMyCustomListPage()) {
                getShoppingListById();
            }
        } else {
            myListsBindings.cancelFlowListsModal();
        }

        showMyListsModal(false);
        this.setState({ newListCreated: false });
        setSkuLoveData({
            loveSource: null,
            skuId: null,
            productId: null
        });
    };

    render() {
        const {
            isOpen, localization, myLists, showMyListsModal, skuLoveData, skuLoveListImageData, isListLimitReached, imageDisplayFlag
        } =
            this.props;
        const {
            isCreateNewListModal, isHidden, listErrorsById, shouldDisplayImageById, hasClickedCtaOnceById, itemsCount
        } = this.state;
        const { title, done, createNewList } = localization;
        const modalTitle = isCreateNewListModal ? createNewList : title;

        const newSkuToAdd = {
            source: 'productPage',
            productId: skuLoveData.productId,
            skuId: skuLoveData.skuId
        };

        return (
            <>
                <Modal
                    isOpen={isOpen}
                    width={0}
                    isHidden={isHidden || isCreateNewListModal}
                    isDrawer={true}
                    hasBodyScroll={true}
                    onDismiss={this.handleClick}
                >
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        lineHeight='tight'
                        paddingBottom={4}
                        css={styles.mainListWrapper}
                    >
                        {myLists?.allLoves &&
                            myLists.allLoves
                                .filter(list => !list.isCreateList)
                                .map(list => {
                                    const listId = list.shoppingListId;
                                    const showImage = (imageDisplayFlag[listId] && !hasClickedCtaOnceById[listId]) || shouldDisplayImageById[listId];
                                    const count = itemsCount[list.shoppingListId] ?? list.shoppingListItemsCount;

                                    return (
                                        <Box
                                            key={listId}
                                            css={styles.myListItem}
                                        >
                                            <Grid
                                                columns={showImage ? 'auto 1fr 86px' : 'auto 86px'}
                                                alignItems='flex-start'
                                            >
                                                {showImage && (
                                                    <ProductImage
                                                        {...skuLoveListImageData}
                                                        increaseImageSizeGrid={false}
                                                    />
                                                )}

                                                <Box
                                                    fontSize='m'
                                                    css={{ alignSelf: 'center' }}
                                                >
                                                    <Text
                                                        css={{ whiteSpace: 'break-spaces' }}
                                                        is='h3'
                                                        display='block'
                                                        numberOfLines={2}
                                                        children={list.shoppingListName}
                                                    />
                                                    <Link
                                                        color='link'
                                                        children={`${count} ${count === 1 ? localization.item : localization.items}`}
                                                        onClick={e => this.handleListClick(e, list.shoppingListId)}
                                                    />
                                                </Box>

                                                {this.renderCTA(skuLoveData, listId)}
                                            </Grid>

                                            {listErrorsById[listId] && (
                                                <Box marginTop={4}>
                                                    <Text color='red'>{listErrorsById[listId]}</Text>
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                    </Modal.Body>
                    <Modal.Footer
                        hasBorder={true}
                        paddingX={[3, 3]}
                    >
                        <Flex css={styles.ctaContainer}>
                            <Button
                                variant='secondary'
                                css={styles.secondaryBtn}
                                onClick={this.toogleCreateNewListModal}
                            >
                                {createNewList}
                            </Button>
                            <Button
                                variant='primary'
                                css={styles.primaryBtn}
                                onClick={this.handleClick}
                            >
                                {done}
                            </Button>
                        </Flex>
                    </Modal.Footer>
                </Modal>

                {isCreateNewListModal && (
                    <CreateNewListModal
                        onDismiss={this.toogleCreateNewListModal}
                        isListLimitReached={isListLimitReached}
                        showCreateListModal={this.props.showCreateListModal}
                        showMyListsModal={showMyListsModal}
                        newSkuToAdd={newSkuToAdd}
                        handleNewListCreated={this.handleNewListCreated}
                    />
                )}
            </>
        );
    }
}

const styles = {
    mainListWrapper: {
        [mediaQueries.md]: {
            maxHeight: '55vmax'
        },
        '> div': {
            paddingBottom: space[4],
            paddingTop: space[4],
            borderBottom: '1px solid #eeeeee'
        },
        '> :last-child': {
            borderBottom: 'none',
            paddingBottom: 0
        }
    },
    myListItem: {
        ':first-child': {
            paddingTop: 0
        }
    },
    ctaContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 2
    },
    primaryBtn: {
        width: '100%'
    },
    secondaryBtn: {
        width: '100%'
    }
};

MyListsModal.propTypes = {
    isOpen: PropTypes.bool,
    myLists: PropTypes.object,
    showMyListsModal: PropTypes.func,
    getAllLists: PropTypes.func.isRequired,
    skuLoveData: PropTypes.object,
    skuLoveListImageData: PropTypes.object,
    isListLimitReached: PropTypes.bool,
    imageDisplayFlag: PropTypes.object
};

MyListsModal.defaultProps = {
    isOpen: false,
    myLists: Empty.Object,
    showMyListsModal: Empty.Function,
    getAllLists: Empty.Function,
    localization: Empty.Object
};

export default wrapComponent(MyListsModal, 'MyListsModal', true);
