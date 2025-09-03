import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Button, Text } from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const FREE_PAYMENT = {
    Afterpay: {
        image: '/img/ufe/logo-afterpay-white.svg',
        alt: 'Afterpay',
        variant: 'primary',
        width: 92,
        height: 21
    },

    Klarna: {
        image: '/img/ufe/logo-klarna-no-border.svg',
        alt: 'Klarna',
        variant: 'primary',
        width: 53,
        height: 24
    },

    Paze: {
        image: '/img/ufe/logo-paze-white.svg',
        alt: 'Paze',
        variant: 'secondary',
        width: 53,
        height: 16,
        color: colors.pazeBlue,
        textColor: 'white'
    },

    Venmo: {
        image: '/img/ufe/payments/no-border/venmo.svg',
        alt: 'Venmo',
        variant: 'special',
        width: 65,
        height: 12,
        color: colors.venmoBlue,
        hoverColor: colors.venmoLightBlue,
        textColor: 'white'
    }
};

const FreePaymentButton = ({
    label, freePaymentName, orderTotal, withText, forProcessingText, logoAlt, ...rest
}) => {
    const payment = FREE_PAYMENT[freePaymentName];
    const isAfterpayCanada = freePaymentName === 'Afterpay' && localeUtils.isCanada();

    const getAccessibleLabel = () => {
        const baseLabel = `${label} ${withText} ${freePaymentName}`;

        if (orderTotal) {
            return `${baseLabel} ${forProcessingText} ${orderTotal}`;
        }

        return baseLabel;
    };

    return (
        <Button
            {...rest}
            variant={isAfterpayCanada ? 'special' : payment.variant}
            aria-label={getAccessibleLabel()}
            {...(payment.color &&
                !isAfterpayCanada && {
                css: {
                    backgroundColor: payment.color,
                    borderColor: payment.color,
                    color: payment.textColor,
                    '.no-touch &:hover': { backgroundColor: payment.hoverColor }
                }
            })}
        >
            <Text marginRight={1}>{label}</Text>
            {!isAfterpayCanada && (
                <Image
                    disableLazyLoad={true}
                    alt={`${payment.alt} ${logoAlt}`}
                    src={payment.image}
                    width={payment.width}
                    height={payment.height}
                    role='img'
                />
            )}
            {isAfterpayCanada && <Text>{freePaymentName}</Text>}
        </Button>
    );
};

export default wrapFunctionalComponent(FreePaymentButton, 'FreePaymentButton');
