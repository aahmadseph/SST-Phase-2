import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import agentAwareUtils from 'utils/AgentAware';
import { Divider } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/RwdCheckout/Sections/Payment/Display';
import ErrorMsg from 'components/ErrorMsg';

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
    isGiftCardShow
}) => (
    <div className={agentAwareUtils.applyHideAgentAwareClass()}>
        <Radio
            paddingY={3}
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
                isGiftCardShow={isGiftCardShow}
            />
        </Radio>
        {errorMessage && <ErrorMsg children={errorMessage} />}
        {selected && <>{children}</>}
        {hideDivider || <Divider marginY={[null, 3]} />}
    </div>
);

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
