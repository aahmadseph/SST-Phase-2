/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import UrlUtils from 'utils/Url';
import Empty from 'constants/empty';
import { Container } from 'components/ui';
import contentConstants from 'constants/content';
import ComponentList from 'components/Content/ComponentList';
import ShopYourStoreBindings from 'analytics/bindingMethods/pages/ShopYourStore/ShopYourStoreBindings';
import helpersUtils from 'utils/Helpers';
const { deferTaskExecution } = helpersUtils;
import { LANDING_PAGE } from 'constants/ShopYourStore';

const { CONTEXTS } = contentConstants;

class ShopMyStoreMain extends BaseClass {
    openStoreSwitcherTimeOut;

    // When Test #2100 (OMNX-90, OMNX-92) is decommissioned, uncomment the componentDidMount()
    // lifecycle method below to fetch data directly on mount instead of in componentDidUpdate.
    /*
    componentDidMount() {
        const { isInitialized, fetchShopMyStore } = this.props;

        if (!isInitialized) {
            fetchShopMyStore();
        }
    }
    */

    componentDidMount() {
        const {
            isInitialized, isBopisable, hasPreferredStore, showStoreSwitcherModal, showInterstice
        } = this.props;

        if (!hasPreferredStore) {
            deferTaskExecution(() => {
                showInterstice(true);
            });
            const fn = () => {
                showInterstice(false);
                showStoreSwitcherModal();
            };

            // If a preferred store is not available at page load,
            // wait N seconds before triggering the Store Switcher modal.
            this.openStoreSwitcherTimeOut = setTimeout(fn, LANDING_PAGE.TIMEOUT);
        }

        // Trigger page load tracking for SPA
        if (isInitialized) {
            ShopYourStoreBindings.shopMyStorePageLoad(isBopisable);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            pageKey, isBopisable, hasPreferredStore, isInitialized, isTestTargetReady, isShopYourStoreEnabled, fetchShopMyStore
        } = this.props;

        // Wait for Test & Target to be fully loaded so we can determine whether
        // the user is in the Challenger group. Based on that, either fetch the page data
        // or redirect to the Home page.
        // When Test #2100 (OMNX-90, OMNX-92) is decommissioned, remove this conditional
        // and move the data-fetching logic to componentDidMount instead.
        if (!prevProps.isTestTargetReady && isTestTargetReady) {
            if (!isShopYourStoreEnabled) {
                UrlUtils.redirectTo('/');
            } else if (!isInitialized) {
                fetchShopMyStore();
            }
        }

        if (pageKey !== prevProps.pageKey) {
            fetchShopMyStore();
        }

        // If the preferred store becomes available after page load,
        // clear the timeout that would trigger the Store Switcher modal.
        if (!prevProps.hasPreferredStore && hasPreferredStore) {
            clearInterval(this.openStoreSwitcherTimeOut);
        }

        // Trigger page load tracking for full (hard) page load
        if (!prevProps.isInitialized && isInitialized) {
            ShopYourStoreBindings.shopMyStorePageLoad(isBopisable);
        }
    }

    componentWillUnmount() {
        clearInterval(this.openStoreSwitcherTimeOut);
    }

    render() {
        const { isInitialized, content } = this.props;

        if (!isInitialized) {
            return null;
        }

        return (
            <Container
                key='ShopMyStoreMain'
                paddingTop={[4, 5]}
            >
                <ComponentList
                    items={content}
                    context={CONTEXTS.CONTAINER}
                />
            </Container>
        );
    }
}

ShopMyStoreMain.propTypes = {
    isInitialized: PropTypes.bool.isRequired,
    pageKey: PropTypes.string,
    hasPreferredStore: PropTypes.bool,
    showStoreSwitcherModal: PropTypes.func,
    showInterstice: PropTypes.func,
    fetchShopMyStore: PropTypes.func.isRequired
};

ShopMyStoreMain.propTypes = {
    isInitialized: false,
    pageKey: '',
    hasPreferredStore: true,
    showStoreSwitcherModal: Empty.Function,
    showInterstice: Empty.Function,
    fetchShopMyStore: Empty.Function
};

export default wrapComponent(ShopMyStoreMain, 'ShopMyStoreMain', true);
