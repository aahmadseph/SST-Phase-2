/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Text } from 'components/ui';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import localeUtils from 'utils/LanguageLocale';
const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Header/StoresContent/locales', 'StoresContent')(text, vars);
import storeUtils from 'utils/Store';

class PreferredStore extends BaseClass {
    state = {
        storeName: '',
        noNearbyStores: false
    };

    componentDidMount() {
        store.setAndWatch('user.preferredStoreInfo', this, userProfile => {
            const { preferredStoreInfo } = userProfile;
            this.setState({
                storeName: storeUtils.getStoreDisplayNameWithSephora(preferredStoreInfo),
                noNearbyStores: preferredStoreInfo && preferredStoreInfo.isDefault
            });
        });
    }

    render() {
        const { storeName, noNearbyStores } = this.state;

        return storeName || noNearbyStores ? (
            <Text
                {...this.props}
                children={noNearbyStores ? getText('chooseYourStore') : `${storeName}`}
                {...(noNearbyStores && { 'data-at': Sephora.debug.dataAt('choose_your_store_btn') })}
            />
        ) : null;
    }
}

PreferredStore.defaultProps = {
    hasSephora: true
};

export default wrapComponent(PreferredStore, 'PreferredStore', true);
