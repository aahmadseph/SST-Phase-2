/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ShipMethodsList from 'components/RwdCheckout/Sections/ShipOptions/ShipMethodsList';
import AccordionButton from 'components/Checkout/AccordionButton';
import ShippingCalculationInfoMessage from 'components/RwdCheckout/Shared/ShippingCalculationInfoMessage';
import ShippingAutoReplenishDeliveryInfoMessage from 'components/RwdCheckout/Shared/ShippingAutoReplenishDeliveryInfoMessage';
import agentAwareUtils from 'utils/AgentAware';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import SplitEDDChooseShippingMethod from 'components/SharedComponents/SplitEDD/SplitEDDChooseShippingMethod';
import CanadaPostStrikeCheckoutMessage from 'components/SharedComponents/CanadaPostStrike/CanadaPostStrikeCheckoutMessage';

import checkoutApi from 'services/api/checkout';
import Debounce from 'utils/Debounce';
import orderUtils from 'utils/Order';
import Location from 'utils/Location';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import Locale from 'utils/LanguageLocale';
import checkoutUtils from 'utils/Checkout';

class ShipOptionsForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { message: false };
    }

    saveForm = () => {
        const { shippingGroup } = this.props;
        const orderId = orderUtils.getOrderId();
        const checkedShippingMethod = this.shipMethodsList?.getData();
        const waiveShippingFee = this.state.message || false;
        this.setShippingMethod(shippingGroup, orderId, checkedShippingMethod, waiveShippingFee)
            .then(() => {
                this.props.sectionSaved(Location.getLocation().pathname);
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };
    saveFormDebounce = Debounce.preventDoubleClick(this.saveForm);

    setShippingMethod = (shippingGroup, orderId, newShipMethod) => {
        let shipOptionsSendData = {
            orderId,
            shippingGroupId: shippingGroup.shippingGroupId,
            shippingMethodId: newShipMethod.shippingMethodId
        };

        if (Sephora.isAgent && Sephora.isAgentAuthorizedRole) {
            //If it is Sephora Mirror and extension is installed, waive shipping and handling checkbox is displayed
            shipOptionsSendData = {
                ...shipOptionsSendData,
                waiveShippingFee: this.state.message || false
            };
            this.props.updateWaiveShipping(this.state.message || false);
        }

        return decorators.withInterstice(checkoutApi.setShippingMethod, INTERSTICE_DELAY_MS)(shipOptionsSendData);
    };

    checkPromoEligibility = checkedShippingMethod => {
        const getText = Locale.getLocaleResourceFile('components/RwdCheckout/Sections/ShipOptions/locales', 'ShipOptions');
        const { items = {} } = this.props.orderDetails;
        const { promoShippingMethods = [], appliedPromotions = [] } = items;

        const ineligibleShippingPromotions = appliedPromotions
            .filter(
                appliedPromo =>
                    appliedPromo.promoShippingMethods &&
                    appliedPromo.promoShippingMethods.every(promoMethod => promoMethod !== checkedShippingMethod.shippingMethodType)
            )
            .map(ineligiblePromo => ineligiblePromo.couponCode);

        const suffix = ineligibleShippingPromotions.length > 1 ? 's' : '';

        if (promoShippingMethods.length && ineligibleShippingPromotions.length) {
            const title = getText('confirmation');
            const buttonText = getText('continueButton');
            const warningMessage = getText('selectedDeliveryMethodMessage', [
                suffix,
                ineligibleShippingPromotions.join(', '),
                promoShippingMethods.join(', '),
                suffix
            ]);

            this.props.confirmModal({
                isOpen: true,
                title: title,
                message: warningMessage,
                buttonText: buttonText,
                callback: () => {
                    //store.dispatch(confirmModal(false));
                    this.saveFormDebounce();
                },
                showCancelButton: true
            });

            return false;
        }

        return true;
    };

    handleSaveForm = () => {
        const checkedShippingMethod = this.shipMethodsList?.getData();

        if (this.checkPromoEligibility(checkedShippingMethod)) {
            this.saveFormDebounce();
        }
    };

    handleCheckboxChange = e => this.setState({ message: e.target.checked });

    render() {
        const {
            orderHasReplen, allowUpdatedShippingCalculationsMsg, shippingGroup, shippingMethods, isSplitEDDEnabled, middleZone
        } = this.props;

        const showSplitEDD = isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups(shippingMethods);
        const isCanadaPostStrikeEnabled = !!Sephora?.configurationSettings?.canadaPostStrikeConfiguration?.isCanadaPostStrikeEnabled;

        return (
            <div>
                {orderHasReplen && <ShippingAutoReplenishDeliveryInfoMessage />}
                {allowUpdatedShippingCalculationsMsg && !isCanadaPostStrikeEnabled && <ShippingCalculationInfoMessage />}
                <CanadaPostStrikeCheckoutMessage
                    shippingGroup={shippingGroup}
                    middleZone={middleZone}
                    marginBottom={0}
                />
                {showSplitEDD ? (
                    <SplitEDDChooseShippingMethod
                        ref={comp => (this.shipMethodsList = comp)}
                        shippingMethodId={shippingGroup.shippingMethodId}
                        shippingGroup={shippingGroup}
                        shippingMethods={shippingMethods}
                    />
                ) : (
                    <ShipMethodsList
                        {...this.props}
                        expanded={true}
                        onRef={comp => (this.shipMethodsList = comp)}
                    />
                )}
                {Sephora.isAgent && !orderHasReplen && (
                    <div
                        style={{
                            display: 'none',
                            fontWeight: '700'
                        }}
                        className={agentAwareUtils.applyShowAgentAwareClass()}
                    >
                        <Checkbox
                            marginBottom={3}
                            marginTop={5}
                            checked={!!this.state.message}
                            data-at={Sephora.debug.dataAt('work_at_seph_checkbox')}
                            onClick={this.handleCheckboxChange}
                        >
                            Waive Shipping & Handling
                        </Checkbox>
                    </div>
                )}
                <AccordionButton onClick={this.handleSaveForm} />
            </div>
        );
    }
}

export default wrapComponent(ShipOptionsForm, 'ShipOptionsForm', true);
