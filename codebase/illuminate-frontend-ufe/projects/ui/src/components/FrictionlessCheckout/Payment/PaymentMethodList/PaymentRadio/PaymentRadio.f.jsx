import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import agentAwareUtils from 'utils/AgentAware';
import { Divider, Text } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/FrictionlessCheckout/Payment/Display';
import ErrorMsg from 'components/ErrorMsg';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import StringUtils from 'utils/String';
import { PAYMENT_TYPES } from 'constants/RwdBasket';

const { getPaymentSectionProps } = FrictionlessUtils;

const PaymentRadio = ({
    paymentName,
    defaultPayment,
    selected,
    disabled,
    checkoutEnabled,
    onClick,
    children,
    errorMessage,
    hideDivider,
    installmentValue,
    fieldsetName,
    locales
}) => {
    const paymentSectionProps = getPaymentSectionProps(paymentName, checkoutEnabled);

    return (
        <div className={agentAwareUtils.applyHideAgentAwareClass()}>
            <Radio
                paddingY={4}
                dotOffset={0}
                name={fieldsetName || paymentName}
                checked={selected}
                disabled={disabled}
                onClick={!selected ? onClick : null}
                isPaymentRadio
            >
                <PaymentDisplay
                    defaultPayment={defaultPayment}
                    paymentName={paymentName}
                    selected={selected}
                    checkoutEnabled={checkoutEnabled}
                    installmentValue={installmentValue}
                    disabled={disabled}
                />
            </Radio>
            {paymentName && paymentName !== PAYMENT_TYPES.PAY_VENMO && selected && (
                <Text
                    is='p'
                    fontSize='sm'
                    marginBottom={2}
                    marginLeft={[6]}
                    data-at={Sephora.debug.dataAt(`${paymentSectionProps.paymentService}_not_combinable_msg`)}
                    children={StringUtils.format(locales.paymentGiftCardMessage, paymentSectionProps.paymentService)}
                />
            )}
            {errorMessage && <ErrorMsg children={errorMessage} />}
            {selected && <>{children}</>}
            {hideDivider || <Divider {...(selected && { marginTop: [null, 3] })} />}
        </div>
    );
};

PaymentRadio.propTypes = {
    paymentName: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    errorMessage: PropTypes.string,
    hideDivider: PropTypes.bool,
    installmentValue: PropTypes.string
};

export default wrapFunctionalComponent(PaymentRadio, 'PaymentRadio');
