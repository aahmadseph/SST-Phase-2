/* eslint-disable object-curly-newline */
import React from 'react';
import reduxStore from 'store/Store';
import { Flex } from 'components/ui';
import { wrapComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import Chunklet from 'components/Chunklet';
import MakeMyStoreConfirmationModal from 'components/Content/Happening/StoreDetails/MakeMyStoreConfirmationModal/MakeMyStoreConfirmationModal';
import profileApi from 'services/api/profile';
import { space } from 'style/config';
import LanguageLocale from 'utils/LanguageLocale';
import userActions from 'actions/UserActions';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import storeUtils from 'utils/Store';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import cookieUtils from 'utils/Cookies';

const getText = LanguageLocale.getLocaleResourceFile('components/Content/Happening/StoreDetails/Chunklets/locales', 'Chunklets');

class Chunklets extends BaseClass {
    state = {
        showConfirmationModal: false
    };

    fireSwitchStoreAnalytics = () => {
        const { store } = this.props;

        const storeName = storeUtils.getStoreDisplayNameWithSephora(store);
        const pageName = `${anaConsts.PAGE_TYPES.OLR}:${anaConsts.PAGE_NAMES.STORE_LOCATOR}:${storeName.toLowerCase()}:*store details`;

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: pageName,
                actionInfo: `${anaConsts.EVENT_NAMES.CHANGE_STORE}:${storeName.toLowerCase()}`,
                storeId: store?.storeId
            }
        });
    };

    onDismissHandler = () => this.setState({ showConfirmationModal: false });

    onStoreChangedHandler = () => {
        const { store } = this.props;

        profileApi.switchPreferredStore(store?.storeId, true);
        storeUtils.cacheStoreData(Object.assign({}, store, { isUserSelected: true }));
        reduxStore.dispatch(userActions.updatePreferredStore({ preferredStoreInfo: store }, !userUtils.isAnonymous(), true));

        if (Sephora.configurationSettings.setZipStoreCookie) {
            cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE_ID, store?.storeId, null, false, false);
        }

        this.fireSwitchStoreAnalytics();
        this.onDismissHandler();
    };

    render() {
        const { store, user, hugContainer } = this.props;
        const { showConfirmationModal } = this.state;

        const { storeId, address } = store;

        const storeName = storeUtils.getStoreDisplayNameWithSephora(store);
        const isKohlsStore = storeUtils.isStoreTypeKohls(store);
        const isPreferredStore = user?.preferredStoreInfo?.storeId === storeId;

        const chunklets = [
            {
                text: getText('getDirections'),
                image: '/img/ufe/happening/fluent-directions.svg',
                action: () => urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address)),
                show: true
            },
            {
                text: getText('callStore'),
                image: '/img/ufe/happening/fluent-call.svg',
                action: () => window.open(`tel:${address.phone.replace(/[^0-9]+/g, '')}`),
                show: true
            },
            {
                text: isPreferredStore ? getText('yourSelectedStore') : getText('makeMyStore'),
                image: '/img/ufe/happening/fluent-store.svg',
                action: () => this.setState({ showConfirmationModal: true }),
                show: !isKohlsStore,
                disabled: showConfirmationModal || isPreferredStore
            }
        ];

        return (
            <>
                <Flex
                    gap={2}
                    css={[styles.chucketContainer, hugContainer && styles.hugContainer]}
                >
                    {chunklets.map(({ text, image, action, show, disabled }, index) =>
                        !show ? null : (
                            <Chunklet
                                key={`store-information-chunklet-${index}`}
                                children={text}
                                iconSize={[20, null, 24]}
                                image={image}
                                minWidth={['fit-content', 'max-content']}
                                width={['unset', '190px']}
                                height='44px'
                                onClick={action}
                                disabled={disabled}
                                color={disabled ? 'gray' : 'inherit'}
                            />
                        )
                    )}
                </Flex>
                <MakeMyStoreConfirmationModal
                    isOpen={showConfirmationModal}
                    storeName={storeName}
                    onDismiss={this.onDismissHandler}
                    onSubmit={this.onStoreChangedHandler}
                />
            </>
        );
    }
}

const styles = {
    chucketContainer: {
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        margin: -space[1],
        padding: space[1],
        textOverflow: 'ellipsis'
    },
    hugContainer: {
        paddingLeft: space[4],
        paddingRight: space[4],
        marginLeft: space['-container'],
        marginRight: space['-container']
    }
};

Chunklets.propTypes = {
    hugContainer: PropTypes.bool
};

Chunklets.defaultProps = {
    hugContainer: true
};

export default wrapComponent(Chunklets, 'Chunklets');
