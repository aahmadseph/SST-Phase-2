import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BuyNowPayLater from 'components/GlobalModals/BuyNowPayLaterModal/BuyNowPayLater';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class BuyNowPayLaterModal extends BaseClass {
    getText = (text, vars) => getLocaleResourceFile('components/GlobalModals/BuyNowPayLaterModal/locales', 'BuyNowPayLater')(text, vars);

    requestClose = () => {
        const { callback } = this.props;

        if (callback && typeof callback === 'function') {
            callback();
        }

        store.dispatch(Actions.showBuyNowPayLaterModal({ isOpen: false }));
    };

    render() {
        return (
            <BuyNowPayLater
                getText={this.getText}
                requestClose={this.requestClose}
                {...this.props}
            />
        );
    }
}

export default wrapComponent(BuyNowPayLaterModal, 'BuyNowPayLaterModal');
