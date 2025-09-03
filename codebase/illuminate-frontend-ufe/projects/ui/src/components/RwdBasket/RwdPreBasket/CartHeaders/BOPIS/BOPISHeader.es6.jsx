import React from 'react';
import store from 'store/Store';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Link, Text, Grid, Box, Flex
} from 'components/ui';
import FindInStoreMapModal from 'components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import StoreSwitcher from 'components/Header/StoreSwitcher';

import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import { SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';

import localeUtils from 'utils/LanguageLocale';
import storeUtils from 'utils/Store';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { refreshBasket } = RwdBasketActions;
const { getLocaleResourceFile } = localeUtils;
const { dispatch } = store;

class BOPISHeader extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { showStoreSwitcherModal: false, showStoreDetailsModal: false };
    }

    toggleStoreSwitcher = showStoreSwitcherModal => {
        this.setState({ showStoreSwitcherModal });

        if (showStoreSwitcherModal) {
            const pageType = anaConsts.PAGE_TYPES.BOPIS;
            const pageDetail = anaConsts.PAGE_DETAIL.STORE_SELECTION;
            const eventData = {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType: pageType,
                pageDetail: pageDetail,
                linkData: anaConsts.LinkData.VIEW_OTHER_STORES
            };
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
        }
    };

    toggleStoreDetailsModal = showStoreDetailsModal => this.setState({ showStoreDetailsModal });

    render() {
        const {
            pickupMessage, storeDetails, icon, showDetailsLink, isPickupMessageBold
        } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/RwdPreBasket/CartHeaders/BOPIS/locales', 'BOPISHeader');

        const showInStoreIndicator = storeDetails.isBopisable;
        const showCurbsidePickupIndicator = storeDetails.isBopisable && storeDetails.isCurbsideEnabled;

        return (
            <>
                {this.state.showStoreDetailsModal && (
                    <FindInStoreMapModal
                        isOpen={this.state.showStoreDetailsModal}
                        closeModal={() => this.toggleStoreDetailsModal(false)}
                        currentProduct={null}
                        selectedStore={storeDetails}
                    />
                )}
                {this.state.showStoreSwitcherModal && (
                    <StoreSwitcher
                        showStoreDetails={true}
                        onChange={() => {
                            dispatch({
                                type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                                payload: true
                            });
                            dispatch(refreshBasket()).then(() => {
                                dispatch({
                                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                                    payload: false
                                });
                            });
                        }}
                        onDismiss={() => this.toggleStoreSwitcher(false)}
                    />
                )}
                <Grid
                    columns={icon == null ? 'auto' : 'auto 1fr'}
                    alignItems={'flex-start'}
                    gap={3}
                >
                    {icon}
                    <div>
                        <Flex alignItems={'baseline'}>
                            <Link
                                onClick={() => this.toggleStoreSwitcher(true)}
                                arrowDirection={'down'}
                                fontWeight={'bold'}
                                fontSize={['base', 'md']}
                                data-at={Sephora.debug.dataAt('store_name_btn')}
                            >
                                {storeUtils.getStoreDisplayName(storeDetails)}
                            </Link>
                            {showDetailsLink && (
                                <React.Fragment>
                                    <Box
                                        display={['none', 'block']}
                                        width={'1px'}
                                        height={'1.25em'}
                                        alignSelf={'center'}
                                        marginX={2}
                                        backgroundColor={'lightGray'}
                                    />
                                    <Link
                                        padding={2}
                                        marginY={-2}
                                        marginRight={-2}
                                        marginLeft={['auto', -2]}
                                        color={'blue'}
                                        flexShrink={0}
                                        fontSize={['sm', 'base']}
                                        onClick={() => this.toggleStoreDetailsModal(true)}
                                    >
                                        {getText('storeDetails')}
                                    </Link>
                                </React.Fragment>
                            )}
                        </Flex>
                        {pickupMessage && (
                            <Text
                                is={'p'}
                                marginTop={'.125em'}
                                color={storeDetails.isBopisable ? 'green' : 'gray'}
                                fontSize={['sm', 'base']}
                                fontWeight={isPickupMessageBold ? 'bold' : null}
                                data-at={Sephora.debug.dataAt('bsk_bopis_label')}
                            >
                                {pickupMessage}
                            </Text>
                        )}
                        <Flex gap={2}>
                            {showInStoreIndicator && (
                                <CurbsidePickupIndicator
                                    children={getText('inStore')}
                                    marginTop={'0.25em'}
                                    fontSize={['sm', 'base']}
                                />
                            )}
                            {showCurbsidePickupIndicator && (
                                <CurbsidePickupIndicator
                                    marginTop={'0.25em'}
                                    fontSize={['sm', 'base']}
                                />
                            )}
                        </Flex>
                    </div>
                </Grid>
            </>
        );
    }
}

BOPISHeader.defaultProps = {
    icon: null,
    isPickupMessageBold: false
};

export default wrapComponent(BOPISHeader, 'BOPISHeader');
