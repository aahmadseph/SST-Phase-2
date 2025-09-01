/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Image } from 'components/ui';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import OrderActions from 'actions/OrderActions';
import creditCardType from 'credit-card-type';
import javascript from 'utils/javascript';
import store from 'store/Store';
import { PAYMENT_CARD_NUMBER_CHANGED } from 'constants/actionTypes/order';
import { PAYMENT_METHODS } from 'constants/PaymentMethods';

const { AFTERPAY, AFTERPAYCASHAPP } = PAYMENT_METHODS;
const cardsAccepted = javascript.getObjectValuesSlowNDirty(OrderUtils.PAYMENT_TYPE.CREDIT_CARD);

const LOGO_WIDTH = '1.5625em';
const LOGO_HEIGHT = '1em';

const CREDIT_CARDS_NOT_ALLOW_OUT_US = ['discover'];

function getImage(cardType) {
    let paymentMethod = cardType;

    if (Object.values(SEPHORA_CARD_TYPES).includes(cardType)) {
        // eslint-disable-next-line no-param-reassign
        paymentMethod = OrderUtils.PAYMENT_TYPE.CREDIT_CARD.sephora;
    }

    if (paymentMethod === AFTERPAY) {
        paymentMethod = localeUtils.isUS() ? AFTERPAYCASHAPP : AFTERPAY;
    }

    return '/img/ufe/payments/' + paymentMethod + '.svg';
}

class PaymentLogo extends BaseClass {
    constructor(props) {
        super(props);

        const { cardType, cardNumber = '', paymentGroupType = '' } = props;

        this.state = {
            cardType: cardType ? [cardType] : this.detectCardTypes(cardNumber, paymentGroupType)
        };
    }

    componentDidMount() {
        const paymentGroupsToDetect = ['CreditCardPaymentGroup'];
        const { listenToStore = true } = this.props;

        if (paymentGroupsToDetect.indexOf(this.props.paymentGroupType) !== -1 && listenToStore) {
            store.watchAction(PAYMENT_CARD_NUMBER_CHANGED, data => {
                const cardTypes = this.detectCardTypes(data.cardNumber, this.props.paymentGroupType);
                this.setState({ cardType: cardTypes }, () => store.dispatch(OrderActions.paymentCardsDetected(cardTypes)));
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cardType !== this.props.cardType) {
            this.setState({ cardType: [this.props.cardType] });
        }
    }

    detectCardTypes = (cardNumber, paymentGroupType) => {
        let cardTypes = [];

        if (paymentGroupType === OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD) {
            if (!cardNumber) {
                return cardTypes;
            }

            // First, try detecting if is a Sephora Card
            const sephoraCardType = OrderUtils.detectSephoraCard(cardNumber);

            if (sephoraCardType) {
                cardTypes = cardTypes.concat(sephoraCardType);
            } else {
                // If not a Sephora Card, try detecting the Card Network
                cardTypes = cardTypes
                    .concat(
                        creditCardType(cardNumber).map(cardInfo =>
                            cardInfo.type === 'unionpay' ? OrderUtils.PAYMENT_TYPE.CREDIT_CARD.discover : cardInfo.type
                        )
                    )
                    .filter(cardType => cardsAccepted.indexOf(cardType) >= 0);

                cardTypes = cardTypes.map(cardType => javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.CREDIT_CARD, cardType));
            }
        } else if (paymentGroupType) {
            cardTypes.push(javascript.getKeyByValue(OrderUtils.PAYMENT_TYPE.OTHER, paymentGroupType)); // payment group type as type of card
        }

        return cardTypes;
    };

    // Discover, paying with Gift Card
    render() {
        const { paymentGroupType, paymentType = OrderUtils.PAYMENT_TYPE.CREDIT_CARD, isMultiCardMode, ...restProps } = this.props;

        const isCanada = localeUtils.isCanada();

        if (!isMultiCardMode) {
            const hasDetectedCard = this.state.cardType.length > 0;
            const cardType = hasDetectedCard ? this.state.cardType[0] : 'placeholder';

            return (
                <Image
                    display='block'
                    src={getImage(cardType)}
                    alt={hasDetectedCard ? cardType : ''}
                    width={this.props.width || LOGO_WIDTH}
                    height={this.props.height || LOGO_HEIGHT}
                    data-at={Sephora.debug.dataAt('cc_logo')}
                    {...restProps}
                />
            );
        } else {
            return (
                <Flex>
                    {Object.keys(paymentType).map((creditType, index) => {
                        const isNotAllowedOutsideUS = isCanada && CREDIT_CARDS_NOT_ALLOW_OUT_US.indexOf(creditType) !== -1;

                        if (isCanada && creditType === OrderUtils.PAYMENT_TYPE.CREDIT_CARD.sephora) {
                            // UTS-2023 swap sephora card logo with debit card logo for canada only
                            // eslint-disable-next-line no-param-reassign
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
                                    opacity: this.props.isGrayed ? (this.state.cardType.indexOf(creditType) < 0 ? 0.3 : null) : null
                                }}
                                data-at={Sephora.debug.dataAt('cc_logo')}
                            />
                        );
                    })}
                </Flex>
            );
        }
    }
}

export default wrapComponent(PaymentLogo, 'PaymentLogo');
