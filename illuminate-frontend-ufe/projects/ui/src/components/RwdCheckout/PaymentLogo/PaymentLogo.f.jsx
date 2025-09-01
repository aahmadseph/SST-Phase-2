import React, { useState, useEffect } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import creditCardType from 'credit-card-type';
import javascript from 'utils/javascript';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';
import { Flex, Image } from 'components/ui';
import { PAYMENT_METHODS } from 'constants/PaymentMethods';

const LOGO_WIDTH = '1.5625em';
const LOGO_HEIGHT = '1em';
const CREDIT_CARDS_NOT_ALLOW_OUT_US = ['discover'];
const cardsAccepted = javascript.getObjectValuesSlowNDirty(OrderUtils.PAYMENT_TYPE.CREDIT_CARD);
const { AFTERPAY, AFTERPAYCASHAPP } = PAYMENT_METHODS;

const detectCardTypes = (cardNumber, paymentGroupType) => {
    let cardTypes = [];

    if (paymentGroupType === OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD) {
        if (!cardNumber) {
            return cardTypes;
        }

        const sephoraCardType = OrderUtils.detectSephoraCard(cardNumber);

        if (sephoraCardType) {
            cardTypes = cardTypes.concat(sephoraCardType);
        } else {
            cardTypes = cardTypes
                .concat(
                    creditCardType(cardNumber).map(cardInfo =>
                        cardInfo.type === 'unionpay' ? OrderUtils.PAYMENT_TYPE.CREDIT_CARD.discover : cardInfo.type
                    )
                )
                .filter(type => cardsAccepted.indexOf(type) >= 0);

            cardTypes = cardTypes.map(type => javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.CREDIT_CARD, type));
        }
    } else if (paymentGroupType) {
        cardTypes.push(javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.OTHER, paymentGroupType));
    }

    return cardTypes;
};

const PaymentLogo = props => {
    const [cardType, setCardType] = useState(props.cardType ? [props.cardType] : detectCardTypes(props.cardNumber, props.paymentGroupType));

    useEffect(() => {
        const paymentGroupsToDetect = ['CreditCardPaymentGroup'];
        const { listenToStore = true } = props;

        if (paymentGroupsToDetect.indexOf(props.paymentGroupType) !== -1 && listenToStore) {
            const unsubscribe = RwdCheckoutActions.paymentNumberUpdated(detectCardTypes, props.paymentGroupType);

            return () => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        }

        return undefined;
    }, [props.paymentGroupType, props.listenToStore, RwdCheckoutActions.paymentNumberUpdated]);

    useEffect(() => {
        if (props.cardType && props.cardType !== cardType[0]) {
            setCardType([props.cardType]);
        }
    }, [props.cardType]);

    const getImage = card => {
        let cardStr = card;

        if (Object.values(SEPHORA_CARD_TYPES).includes(card)) {
            cardStr = OrderUtils.PAYMENT_TYPE.CREDIT_CARD.sephora;
        }

        if (cardStr === AFTERPAY) {
            cardStr = localeUtils.isUS() ? AFTERPAYCASHAPP : AFTERPAY;
        }

        return '/img/ufe/payments/' + cardStr + '.svg';
    };

    const renderLogo = () => {
        const { paymentGroupType, paymentType = OrderUtils.PAYMENT_TYPE.CREDIT_CARD, isMultiCardMode, ...restProps } = props;
        const isCanada = localeUtils.isCanada();

        if (!isMultiCardMode) {
            const hasDetectedCard = cardType.length > 0;
            const cardTypeValue = hasDetectedCard ? cardType[0] : 'placeholder';

            return (
                <Image
                    display='block'
                    src={getImage(cardTypeValue)}
                    alt={hasDetectedCard ? cardTypeValue : ''}
                    width={props.width || LOGO_WIDTH}
                    height={props.height || LOGO_HEIGHT}
                    data-at={Sephora.debug.dataAt('cc_logo')}
                    {...restProps}
                />
            );
        } else {
            return (
                <Flex>
                    {Object.keys(paymentType).map((type, index) => {
                        const isNotAllowedOutsideUS = isCanada && CREDIT_CARDS_NOT_ALLOW_OUT_US.indexOf(type) !== -1;
                        let creditType = type;

                        if (isCanada && creditType === OrderUtils.PAYMENT_TYPE.CREDIT_CARD.sephora) {
                            creditType = 'debit';
                        }

                        return isNotAllowedOutsideUS ? null : (
                            <Image
                                key={index.toString()}
                                display='block'
                                src={getImage(creditType)}
                                alt={creditType}
                                marginRight='.25em'
                                width={LOGO_WIDTH}
                                height={LOGO_HEIGHT}
                                style={{
                                    opacity: props.isGrayed ? (cardType.indexOf(creditType) < 0 ? 0.3 : null) : null
                                }}
                                data-at={Sephora.debug.dataAt('cc_logo')}
                            />
                        );
                    })}
                </Flex>
            );
        }
    };

    return renderLogo();
};

export default wrapFunctionalComponent(PaymentLogo, 'PaymentLogo');
