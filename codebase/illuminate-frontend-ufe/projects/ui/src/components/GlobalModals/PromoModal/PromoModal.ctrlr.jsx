import React from 'react';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Button, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import Promos from 'components/Promos/Promos';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import anaUtils from 'analytics/utils';

import Actions from 'Actions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import promoUtils from 'utils/Promos';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';
import Location from 'utils/Location';
import analyticsConstants from 'analytics/constants';

const { hasHalAddress } = OrderUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const {
    ACTION_INFO: { APPLY_PROMO_POINTS_MULTIPLIER, APPLY_PROMO_POINTS_MULTIPLIER_FROM },
    USER_INPUT: { ENTER_PROMO }
} = analyticsConstants;

class PromoModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            minimumSelected: false,
            msgPromosSkuList: []
        };
    }
    componentDidMount() {
        const location = this.props.location;

        if (location) {
            // Analytics - ILLUPH-95714
            const eventStrings = [];

            if (location === anaConsts.PAGE_TYPES.CHECKOUT) {
                // Analytics https://jira.sephora.com/browse/ET-398
                eventStrings.push(anaConsts.Event.SC_CHECKOUT);

                if (hasHalAddress()) {
                    eventStrings.push(anaConsts.Event.EVENT_247);
                }
            }

            BasketBindings.multiPromo({ location, eventStrings });
        }

        store.setAndWatch('promo', this, data => {
            const { msgPromosSkuList } = data.promo;
            const selectedSkus = msgPromosSkuList.filter(x => x.couponCode === this.props.promoCode);
            const minimumSelected = !this.props.minMsgSkusToSelect || selectedSkus.length >= this.props.minMsgSkusToSelect;
            this.setState({ minimumSelected, msgPromosSkuList });
        });
    }

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');

        return (
            <Modal
                width={4}
                hasBodyScroll={true}
                showDismiss={false}
                isOpen={this.props.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title
                        data-at={Sephora.debug.dataAt('add_promo_modal_title')}
                        children={this.props.instructions}
                    />
                </Modal.Header>
                <Modal.Body maxHeight={492}>
                    <Promos promos={this.props} />
                </Modal.Body>
                <Modal.Footer>
                    <Flex
                        justifyContent='space-between'
                        lineHeight='tight'
                    >
                        <Link
                            color='blue'
                            marginRight={4}
                            flexShrink={0}
                            onClick={this.close}
                            children={getText('cancel')}
                            data-at={Sephora.debug.dataAt('cancel_button')}
                        />
                        <Button
                            data-at={Sephora.debug.dataAt('done_button')}
                            variant='primary'
                            width={[169, 120]}
                            block={true}
                            onClick={this.isDone}
                            disabled={!this.state.minimumSelected}
                            children={getText('done')}
                        />
                    </Flex>
                </Modal.Footer>
            </Modal>
        );
    }

    isDone = () => {
        const isFrictionlessCheckoutPage = Location.isFrictionlessCheckoutPage();
        const { msgPromosSkuList } = this.state;
        const selectedSkuList = msgPromosSkuList
            .filter(elem => elem.couponCode === this.props.promoCode)
            .map(promoItem => {
                return promoItem.skuId;
            });

        if (this.props.promoCode) {
            if (selectedSkuList.length) {
                promoUtils.submitMsgPromos(this.props.promoCode, selectedSkuList).then(data => {
                    if (this.props.successCallback) {
                        this.props.successCallback();
                    }

                    let actionInfo = APPLY_PROMO_POINTS_MULTIPLIER;
                    const pageSourceName = anaUtils.getCustomPageSourceName();

                    if (pageSourceName) {
                        actionInfo = `${APPLY_PROMO_POINTS_MULTIPLIER_FROM} ${pageSourceName}`;
                    }

                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            eventStrings: [anaConsts.Event.EVENT_71],
                            linkName: APPLY_PROMO_POINTS_MULTIPLIER,
                            actionInfo,
                            userInput: `${isFrictionlessCheckoutPage ? ENTER_PROMO : ''}${this.props.promoCode.toLowerCase()}`,
                            internalCampaign: `${anaConsts.CONTEXT.BEAUTY_OFFERS}:${this.props.promoCategoryTitle}:${this.props.promoTitleText}:apply`
                        }
                    });
                    store.dispatch(RwdBasketActions.updateBasket({ newBasket: data }));
                });
            } else {
                promoUtils.removePromo(this.props.promoCode);
            }
        }

        store.dispatch(Actions.showPromoModal(false));
    };

    close = () => {
        this.props.promoCode && promoUtils.removePromo(this.props.promoCode);
        store.dispatch(Actions.showPromoModal(false));
    };
}

export default wrapComponent(PromoModal, 'PromoModal', true);
