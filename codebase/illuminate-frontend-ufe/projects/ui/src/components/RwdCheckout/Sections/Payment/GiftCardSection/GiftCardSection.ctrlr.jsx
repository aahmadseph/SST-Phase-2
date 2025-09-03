/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Flex, Link
} from 'components/ui';
import GiftCardExpandButton from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardExpandButton';
import GiftCardItem from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardItem';
import GiftCardForm from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardForm';
import InfoButton from 'components/InfoButton/InfoButton';
import ErrorMsg from 'components/ErrorMsg';
import store from 'store/Store';
import orderUtils from 'utils/Order';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
const MORE_INFO_BCC_ID = '47500041';
import ErrorConstants from 'utils/ErrorConstants';
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
        this.giftCardExpandButton = React.createRef();
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
        this.props.giftCardApplied(this);
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
            this.giftCardExpandButton.current.focus();
        });
    };

    updateOrder = () => {
        const {
            order: { isPlaceOrderDisabled }
        } = store.getState();
        const orderId = orderUtils.getOrderId();
        this.props
            .getOrderDetails(orderId)
            .then(orderData => {
                this.props.updateOrder(orderData);

                if (isPlaceOrderDisabled) {
                    this.props.togglePlaceOrderDisabled(true);
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
        this.props.showMediaModal({
            isOpen: true,
            mediaId: MORE_INFO_BCC_ID,
            title: this.props.localization.moreInfoTitle
        });
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
        const { showForm, giftCardPaymentGroups, errorMessage } = this.state;
        const {
            paymentDisplay,
            hasAutoReplenishItemInBasket,
            hasSDUInBasket,
            localization: {
                giftCard, howToUseCard, addGiftCard, cancelText, cancelLink
            }
        } = this.props;

        return (
            <div>
                {!paymentDisplay && (showForm || giftCardPaymentGroups.length > 0) && (
                    <Flex
                        lineHeight='tight'
                        alignItems='center'
                        marginTop={[5, 6]}
                        marginBottom={[4, 5]}
                    >
                        <Text
                            is='h2'
                            fontSize='md'
                            fontWeight='bold'
                            children={giftCard}
                        />
                        <InfoButton
                            aria-label={howToUseCard}
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
                            ref={this.giftCardExpandButton}
                            aria-controls='giftcard_form'
                            onClick={this.displayForm}
                            children={addGiftCard}
                        />
                    ) : (
                        <React.Fragment>
                            <GiftCardForm
                                editSectionName={this.props.editSectionName}
                                onRef={comp => (this.giftCardForm = comp)}
                            />
                            <Box
                                marginTop={3}
                                lineHeight='tight'
                            >
                                <Link
                                    aria-controls='giftcard_form'
                                    aria-label={cancelText}
                                    aria-expanded={true}
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    onClick={this.hideForm}
                                    children={cancelLink}
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
