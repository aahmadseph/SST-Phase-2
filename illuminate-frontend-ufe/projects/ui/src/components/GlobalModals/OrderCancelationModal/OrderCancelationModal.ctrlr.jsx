/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { forms } from 'style/config';
import Modal from 'components/Modal/Modal';
import { Box, Text, Button } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import Textarea from 'components/Inputs/Textarea/Textarea';
import localeUtils from 'utils/LanguageLocale';

import store from 'Store';
import Actions from 'Actions';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import resourceWrapper from 'utils/framework/resourceWrapper';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const MAX_REASON_TEXT_CHARS = 150;

class OrderCancelationModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            reasonCode: null,
            reasonText: '',
            showReasonTextError: false,
            isOtherReason: false
        };
        this.cancelationReasonText = React.createRef();
    }

    getText = (...args) => {
        return resourceWrapper(localeUtils.getLocaleResourceFile('components/GlobalModals/OrderCancelationModal/locales', 'OrderCancelationModal'))(
            ...args
        );
    };

    requestClose = () => {
        store.dispatch(Actions.showOrderCancelationModal(false, null));
    };

    cancelOrder = () => {
        const { reasonCode, reasonText } = this.state;
        const { orderId, selfCancelationReasons } = this.props;
        const requestObject = {
            orderId,
            reasonCode,
            otherReasonDescription: reasonText
        };
        const isDataValid = reasonCode && (reasonCode !== selfCancelationReasons.otherReasonCode || reasonText);

        this.setState({ showReasonTextError: !isDataValid });

        if (isDataValid) {
            checkoutApi.cancelOrder(requestObject).then(resp => {
                this.showCancelationResponse(resp);
            });
        }
    };

    showCancelationResponse = response => {
        store.dispatch(Actions.showOrderCancelationModal(false, null));

        const title = this.getText('title');
        const buttonText = this.getText('buttonText');
        const { responseCode, message } = response;

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title,
                message: responseCode === 2 ? this.getText('messageFailure', true, '/beauty/contact-us|style=primary') : message,
                buttonText,
                dataAt: 'self_cancel_confirm_popup',
                dataAtTitle: 'self_cancel_confirm_popup_title',
                dataAtMessage: 'self_cancel_confirm_popup_message',
                callback: () => {
                    checkoutApi.getOrderDetails(this.props.orderId).then(details => {
                        store.dispatch(OrderActions.updateOrder(details));
                    });
                }
            }),
            this.trackCancellationResponse(responseCode)
        );
    };

    trackCancellationResponse = responseCode => {
        // responseCode values in ILLUPH-134088, 1 - succesful, 2 - unsuccessful
        // do not need tracking for API errors or any errors (ILLUPH-135635);
        if ([1, 2].indexOf(responseCode) === -1) {
            return;
        }

        let actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:success`;
        let eventStrings = [anaConsts.Event.ORDER_CANCELLATION_SUCCESS];

        if (responseCode === 2) {
            actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:decline`;
            eventStrings = [anaConsts.Event.ORDER_CANCELLATION_DECLINE];
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo,
                linkName: actionInfo,
                eventStrings
            }
        });
    };

    componentDidMount() {
        const actionInfo = `${anaConsts.ACTION_INFO.ORDER_CANCELLATION}:request`;
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo,
                linkName: actionInfo,
                eventStrings: [anaConsts.Event.ORDER_CANCELLATION_REQUEST]
            }
        });
    }

    handleReasonChange = reason => () => {
        const { selfCancelationReasons } = this.props;
        const isOtherReason = reason.reasonCode === selfCancelationReasons.otherReasonCode;
        this.setState({
            reasonCode: reason.reasonCode,
            isOtherReason: isOtherReason
        });

        if (isOtherReason) {
            this.cancelationReasonText?.current && this.cancelationReasonText.current.focus();
        }
    };

    handleReasonTextChange = text => this.setState({ reasonText: text });

    render() {
        const { reasonCode, reasonText, showReasonTextError } = this.state;
        const { isOpen, selfCancelationReasons } = this.props;

        const isOtherReasonPresented =
            selfCancelationReasons.reasonCodes &&
            selfCancelationReasons.reasonCodes.some(reason => reason.reasonCode === selfCancelationReasons.otherReasonCode);
        const invalidReasonText = showReasonTextError && !reasonText && reasonCode === selfCancelationReasons.otherReasonCode;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                width={0}
                formProps={{
                    noValidate: true,
                    onSubmit: e => {
                        e.preventDefault();
                        this.cancelOrder();
                    }
                }}
            >
                <Modal.Header>
                    <Modal.Title>{this.getText('orderCancelationTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Box is='fieldset'>
                        <Text
                            is='legend'
                            fontWeight='bold'
                            marginBottom='.5em'
                        >
                            {this.getText('cancelationReason')}
                        </Text>
                        {selfCancelationReasons.reasonCodes &&
                            selfCancelationReasons.reasonCodes.map(reason => (
                                <Radio
                                    name='cancelationReason'
                                    paddingY='.5em'
                                    key={`reasonCode_${reason.reasonCode}`}
                                    checked={reasonCode === reason.reasonCode}
                                    onChange={this.handleReasonChange(reason)}
                                >
                                    {reason.description}
                                </Radio>
                            ))}
                        {isOtherReasonPresented && (
                            <Box marginLeft={`${forms.RADIO_SIZE + forms.RADIO_MARGIN}px`}>
                                <Textarea
                                    rows={4}
                                    tabIndex={reasonCode !== selfCancelationReasons.otherReasonCode ? '-1' : null}
                                    disabled={!this.state.isOtherReason}
                                    name='cancelationReasonText'
                                    invalid={invalidReasonText}
                                    message={invalidReasonText ? this.getText('reasonTextError') : null}
                                    maxLength={MAX_REASON_TEXT_CHARS}
                                    placeholder={this.getText('enterReasonHere')}
                                    handleChange={this.handleReasonTextChange}
                                    ref={this.cancelationReasonText}
                                />
                            </Box>
                        )}
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        disabled={!reasonCode}
                        type='submit'
                    >
                        {this.getText('cancelOrderButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(OrderCancelationModal, 'OrderCancelationModal', true);
