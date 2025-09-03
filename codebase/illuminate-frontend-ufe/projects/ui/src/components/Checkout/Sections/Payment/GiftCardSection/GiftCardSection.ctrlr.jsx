/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Flex, Link
} from 'components/ui';
import GiftCardExpandButton from 'components/Checkout/Sections/Payment/GiftCardSection/GiftCardExpandButton';
import GiftCardItem from 'components/Checkout/Sections/Payment/GiftCardSection/GiftCardItem/GiftCardItem';
import GiftCardForm from 'components/Checkout/Sections/Payment/GiftCardSection/GiftCardForm/GiftCardForm';
import InfoButton from 'components/InfoButton/InfoButton';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import Actions from 'Actions';
import orderUtils from 'utils/Order';
import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
const MORE_INFO_BCC_ID = '47500041';
import ErrorConstants from 'utils/ErrorConstants';
import { GIFT_CARD_APPLIED } from 'constants/actionTypes/order';
import { globalModals, renderModal } from 'utils/globalModals';

const { GIFT_CARD_CHECKOUT_INFO } = globalModals;

class GiftCardSection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: false,
            showForm: false,
            giftCardPaymentGroups: []
        };
    }

    componentDidMount() {
        store.setAndWatch('order.orderDetails.paymentGroups', this, data =>
            this.setState({
                giftCardPaymentGroups: (data.paymentGroups.paymentGroupsEntries || []).filter(
                    group => group.paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD
                ),
                showForm: false,
                errorMessage: false
            })
        );
        store.watchAction(GIFT_CARD_APPLIED, () => {
            this.updateOrderDebounce();
        });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            nextState.showForm !== this.state.showForm ||
            nextState.errorMessage !== this.state.errorMessage ||
            nextState.giftCardPaymentGroups.length !== this.state.giftCardPaymentGroups.length
        );
    };

    displayForm = () => {
        this.setState({ showForm: true });

        //Analytics
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [analyticsConsts.Event.EVENT_71],
                linkName: 'D=c55',
                actionInfo: `${analyticsConsts.PAGE_TYPES.CHECKOUT}:payment:gift card`
            }
        });
    };

    hideForm = () => {
        this.giftCardForm.clearForm();
        this.setState({ showForm: false }, () => {
            ReactDOM.findDOMNode(this.giftCardExpandButton).focus();
        });
    };

    updateOrder = () => {
        const {
            order: { isPlaceOrderDisabled }
        } = store.getState();
        const actionWithInterstice = decorators.withInterstice(checkoutApi.getOrderDetails, INTERSTICE_DELAY_MS);
        const orderId = orderUtils.getOrderId();
        actionWithInterstice(orderId)
            .then(orderData => {
                const updateOrderAction = OrderActions.updateOrder(orderData);

                store.dispatch(updateOrderAction);

                if (isPlaceOrderDisabled) {
                    const togglePlaceOrderDisabledAction = OrderActions.togglePlaceOrderDisabled(true);
                    store.dispatch(togglePlaceOrderDisabledAction);
                }

                ErrorsUtils.collectAndValidateBackEndErrors(orderData, this);
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    updateOrderDebounce = Debounce.preventDoubleClick(this.updateOrder);

    showError = message => {
        this.setState({
            showError: true,
            errorMessage: message
        });
    };

    openMoreInfoModal = () => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: MORE_INFO_BCC_ID,
                title: getText('moreInfoTitle')
            })
        );
    };

    validateErrorWithCode = () => {
        const { CHECKOUT_PAYMENT_GIFT_CARD_NOT_APPLIED } = ErrorConstants.ERROR_CODES;

        const validate = this.giftCardForm && this.giftCardForm.validateForm();

        if (!this.props.paymentDisplay && this.state.showForm === true && !validate) {
            return CHECKOUT_PAYMENT_GIFT_CARD_NOT_APPLIED;
        }

        return validate;
    };

    showGiftCardInfoModal = () => {
        renderModal(this.props.globalModals[GIFT_CARD_CHECKOUT_INFO], this.openMoreInfoModal);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');
        const isDesktop = Sephora.isDesktop();
        const { showForm, giftCardPaymentGroups, errorMessage } = this.state;
        const { paymentDisplay, hasAutoReplenishItemInBasket, hasSDUInBasket } = this.props;

        return (
            <div>
                {!paymentDisplay && (showForm || giftCardPaymentGroups.length > 0) && (
                    <Flex
                        lineHeight='tight'
                        alignItems='center'
                        marginTop={isDesktop ? 6 : 5}
                        marginBottom={isDesktop ? 5 : 4}
                    >
                        <Text
                            is='h2'
                            fontSize='md'
                            fontWeight='bold'
                            children={getText('giftCard')}
                        />
                        <InfoButton
                            aria-label={getText('howToUseCard')}
                            marginLeft={0}
                            onClick={this.showGiftCardInfoModal}
                        />
                    </Flex>
                )}

                {errorMessage && !hasAutoReplenishItemInBasket && !hasSDUInBasket && <ErrorMsg children={errorMessage} />}

                {!paymentDisplay &&
                    giftCardPaymentGroups &&
                    giftCardPaymentGroups.map((group, index) => (
                        <GiftCardItem
                            key={index.toString()}
                            giftCard={group.paymentGroup}
                        />
                    ))}

                {giftCardPaymentGroups.length < 2 ? (
                    !showForm ? (
                        <GiftCardExpandButton
                            ref={comp => (this.giftCardExpandButton = comp)}
                            aria-controls='giftcard_form'
                            onClick={this.displayForm}
                        />
                    ) : (
                        <React.Fragment>
                            <GiftCardForm
                                editSectionName={this.props.editSectionName}
                                ref={comp => (this.giftCardForm = comp)}
                            />
                            <Box
                                marginTop={3}
                                lineHeight='tight'
                            >
                                <Link
                                    aria-controls='giftcard_form'
                                    aria-label={getText('cancelText')}
                                    aria-expanded={true}
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    onClick={this.hideForm}
                                    children={getText('cancelLink')}
                                    data-at={Sephora.debug.dataAt('gc_cancel_btn')}
                                />
                            </Box>
                        </React.Fragment>
                    )
                ) : null}
            </div>
        );
    }
}

export default wrapComponent(GiftCardSection, 'GiftCardSection');
