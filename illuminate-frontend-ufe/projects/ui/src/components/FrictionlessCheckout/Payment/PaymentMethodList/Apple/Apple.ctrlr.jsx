import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import UIUtils from 'utils/UI';
import ApplePay from 'services/ApplePay';
import OrderUtils from 'utils/Order';
import { PAYMENT_LOGO_SIZE } from 'components/Checkout/constants';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/RwdCheckout/Sections/Payment/Display';
import { Grid, Divider } from 'components/ui';

const { isSMUI } = UIUtils;

const RADIO_NAME = 'payWithApplePay';

class Apple extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isApplePayEnabled: false,
            applePayType: null
        };
    }

    componentDidMount() {
        this.checkApplePayAvailability();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.orderDetails !== this.props.orderDetails) {
            this.checkApplePayAvailability();
        }
    }

    checkApplePayAvailability = () => {
        if (this.props.orderDetails) {
            ApplePay.getApplePaymentType(this.props.orderDetails).then(applePayType => {
                const isApplePayEnabled = applePayType !== ApplePay.TYPES.HIDDEN;
                this.setState({
                    isApplePayEnabled,
                    applePayType
                });
            });
        }
    };

    displayPayment = () => {
        const { payWithApplePay } = this.props.localization;

        return (
            <Grid
                columns='auto 1fr'
                gap={4}
                alignItems='center'
                lineHeight='tight'
            >
                <PaymentLogo
                    {...PAYMENT_LOGO_SIZE}
                    style={
                        isSMUI()
                            ? {
                                alignSelf: 'flex-start'
                            }
                            : null
                    }
                    paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.APPLEPAY}
                />
                <b>{payWithApplePay}</b>
            </Grid>
        );
    };

    render() {
        const { isApplePayEnabled } = this.state;
        const {
            isPayWithApplePay, hasAutoReplenishItem, isBopis, isSdd, handlePayWithApplePayClick, isApplePay
        } = this.props;

        if (isApplePay) {
            return this.displayPayment();
        }

        return isApplePayEnabled ? (
            <div>
                <Radio
                    paddingY={4}
                    dotOffset={0}
                    alignItems='center'
                    name={RADIO_NAME}
                    checked={isPayWithApplePay}
                    disabled={isSMUI() && hasAutoReplenishItem}
                    onClick={handlePayWithApplePayClick}
                >
                    <PaymentDisplay
                        isBopis={isBopis}
                        isSddOrder={isSdd}
                        isApplePay={true}
                        hasAutoReplenishItemInBasket={hasAutoReplenishItem}
                    />
                </Radio>
                <Divider />
            </div>
        ) : null;
    }
}

export default wrapComponent(Apple, 'Apple', true);
