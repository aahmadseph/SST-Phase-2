/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Empty from 'constants/empty';
import Location from 'utils/Location';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
const { SHOP_STORE_AND_DELIVERY_CONTEXT_KEY } = LOCAL_STORAGE;

class StoreAndDeliverySLA extends BaseClass {
    fetchData(invalidateCache = false) {
        const { contextKey, fetchStoreAndDeliverySLA } = this.props;

        // Store the current contextKey for the upcoming API request.
        // Used later to determine if cached data should be invalidated on component mount.
        Storage.session.setItem(SHOP_STORE_AND_DELIVERY_CONTEXT_KEY, contextKey);

        fetchStoreAndDeliverySLA(invalidateCache);
    }

    componentDidMount() {
        const { isInitialized, contextKey } = this.props;

        if (!isInitialized) {
            const prevContextKey = Storage.session.getItem(SHOP_STORE_AND_DELIVERY_CONTEXT_KEY);
            // Invalidate cached API data to ensure fresh data is fetched.
            const invalidateCache = prevContextKey !== contextKey;

            this.fetchData(invalidateCache);
        }
    }

    componentDidUpdate(prevProps) {
        const { contextKey, isFlyoutOpen } = this.props;
        // Skip fetching data for Shop My Store and Shop Same-Day pages.
        // These landing pages already provide the required data for the Store & Delivery flyout.
        const isSYSPage = Location.isShopMyStorePage() || Location.isShopSameDayPage();

        if (isFlyoutOpen && !isSYSPage) {
            // Use cached API response if available.
            // A new backend request will only be made if the cache has expired.
            this.fetchData();
        } else if (prevProps.contextKey !== contextKey) {
            // Store or Zip Code has changed, force a backend call
            // to fetch updated Store & Delivery SLA information.
            const invalidateCache = true;
            this.fetchData(invalidateCache);
        }
    }

    render() {
        return <div />;
    }
}

StoreAndDeliverySLA.propTypes = {
    isInitialized: PropTypes.bool,
    contextKey: PropTypes.string,
    fetchStoreAndDeliverySLA: PropTypes.func
};

StoreAndDeliverySLA.propTypes = {
    isInitialized: false,
    contextKey: '',
    fetchStoreAndDeliverySLA: Empty.Function
};

export default wrapComponent(StoreAndDeliverySLA, 'StoreAndDeliverySLA', true);
