import React from 'react';
import store from 'store/Store';
import actions from 'actions/Actions';
import rrcUtils from 'utils/RrcTermsAndConditions';
import addToBasketActions from 'actions/AddToBasketActions';
import basketUtils from 'utils/Basket';
import UtilActions from 'utils/redux/Actions';
import Modal from 'components/Modal/Modal';
import RougeRewardCardButtons from 'components/GlobalModals/RougeRewardCardModal/RougeRewardCardButtons/RougeRewardCardButtons';
import localeUtils from 'utils/LanguageLocale';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class RougeRewardCardModal extends BaseClass {
    state = {
        isOpen: this.props.isOpen,
        sku: this.props.sku
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/RougeRewardCardModal/locales', 'RougeRewardCardModal');

        return (
            <Modal
                isOpen={this.state.isOpen}
                hasBodyScroll={true}
                onDismiss={this.requestClose}
                dataAt='RougeRewardCardModal'
            >
                <Modal.Header>
                    <Modal.Title>{getText('biTermsAndConditions')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <RougeRewardCardButtons
                        callback={this.props.callback}
                        currentSku={this.state.sku}
                        originalContext={this.props.analyticsContext}
                        isRougeExclusiveCarousel={this.props.isRougeExclusiveCarousel}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    componentDidMount() {
        //Logic to determine whether the terms are checked or not goes here.
        const areTermsAndConditionsAccepted = rrcUtils.areRRCTermsConditionsAccepted();

        if (areTermsAndConditionsAccepted) {
            store.dispatch(UtilActions.merge('termsConditions', 'isRRCTermsAndConditions', areTermsAndConditionsAccepted));
        }

        store.setAndWatch('basket.items', this, data => {
            // Check if RougeRewardCard item has been removed from basket
            if (basketUtils.itemListHasRougeRewardCard(this.state.items) && !basketUtils.itemListHasRougeRewardCard(data.items)) {
                store.dispatch(
                    addToBasketActions.showError([], null, [
                        {
                            type: 'rougeRewardCardRemoval',
                            message: `Rouge Reward has been removed from your basket as
                        you have not accepted the Terms and Conditions. If you would
                        like to redeem it, please add it to basket again and accept
                        the Terms and Conditions.`
                        }
                    ])
                );
            }

            this.setState({ items: data.items });
        });

        store.setAndWatch('termsConditions.isRRCTermsAndConditions', this, data => {
            this.setState({
                acceptTerms: data.isRRCTermsAndConditions,
                showError: !data.isRRCTermsAndConditions
            });
        });
    }

    requestClose = () => {
        let rougeRewardCard;
        const areTermsAndConditionsAccepted = rrcUtils.areRRCTermsConditionsAccepted();

        // If the user did not accept Terms and Conditions, remove Rouge Reward Card from basket
        if (!areTermsAndConditionsAccepted) {
            rougeRewardCard = basketUtils.getRougeRewardCardFromBasket();

            if (rougeRewardCard) {
                store.dispatch(addToBasketActions.removeItemFromBasket(rougeRewardCard, true, true));
            }
        }

        store.dispatch(
            actions.showRougeRewardCardModal({
                isOpen: false,
                sku: null
            })
        );
    };
}

export default wrapComponent(RougeRewardCardModal, 'RougeRewardCardModal');
