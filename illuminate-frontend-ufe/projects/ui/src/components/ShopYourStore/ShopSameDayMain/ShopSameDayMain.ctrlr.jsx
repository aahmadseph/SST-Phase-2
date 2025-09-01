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

class ShopSameDayMain extends BaseClass {
    openShippingDeliveryLocationTimeOut;

    // When Test #2100 (OMNX-90, OMNX-92) is decommissioned, uncomment the componentDidMount()
    // lifecycle method below to fetch data directly on mount instead of in componentDidUpdate.
    /*
    componentDidMount() {
        const { isInitialized, fetchShopSameDay } = this.props;

        if (!isInitialized) {
            fetchShopSameDay();
        }
    }
    */
    componentDidMount() {
        const {
            isInitialized, sameDayAvailable, hasPreferredZipCode, showShippingDeliveryLocationModal, showInterstice
        } = this.props;

        if (!hasPreferredZipCode) {
            deferTaskExecution(() => {
                showInterstice(true);
            });
            const fn = () => {
                showInterstice(false);
                showShippingDeliveryLocationModal();
            };

            // If a preferred zip code is not available at page load,
            // wait N seconds before triggering the Shipping Delivery Location modal.
            this.openShippingDeliveryLocationTimeOut = setTimeout(fn, LANDING_PAGE.TIMEOUT);
        }

        // Trigger page load tracking for SPA
        if (isInitialized) {
            ShopYourStoreBindings.shopSameDayPageLoad(sameDayAvailable);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            pageKey,
            sameDayAvailable,
            hasPreferredZipCode,
            isInitialized,
            isTestTargetReady,
            isShopYourStoreEnabled,
            fetchShopSameDay,
            showShippingDeliveryLocationModal
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
                fetchShopSameDay();
            }
        }

        if (pageKey !== prevProps.pageKey) {
            fetchShopSameDay();
        }

        // If the preferred zip code becomes available after page load:
        // - Clear the timeout that would trigger the Shipping Delivery Location modal
        // - Dispatch an action to close the modal in case it's already open
        if (!prevProps.hasPreferredZipCode && hasPreferredZipCode) {
            clearInterval(this.openShippingDeliveryLocationTimeOut);
            showShippingDeliveryLocationModal(null, false);
        }

        // Trigger page load tracking for full (hard) page load
        if (!prevProps.isInitialized && isInitialized) {
            ShopYourStoreBindings.shopSameDayPageLoad(sameDayAvailable);
        }
    }

    componentWillUnmount() {
        clearInterval(this.openShippingDeliveryLocationTimeOut);
    }

    render() {
        const { isInitialized, content } = this.props;

        if (!isInitialized) {
            return null;
        }

        return (
            <Container
                key='ShopSameDayMain'
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

ShopSameDayMain.propTypes = {
    isInitialized: PropTypes.bool.isRequired,
    pageKey: PropTypes.string,
    hasPreferredZipCode: PropTypes.bool,
    showInterstice: PropTypes.func,
    showShippingDeliveryLocationModal: PropTypes.func,
    fetchShopSameDay: PropTypes.func.isRequired
};

ShopSameDayMain.propTypes = {
    isInitialized: false,
    pageKey: '',
    hasPreferredZipCode: true,
    showInterstice: Empty.Function,
    showShippingDeliveryLocationModal: Empty.Function,
    fetchShopSameDay: Empty.Function
};

export default wrapComponent(ShopSameDayMain, 'ShopSameDayMain', true);
