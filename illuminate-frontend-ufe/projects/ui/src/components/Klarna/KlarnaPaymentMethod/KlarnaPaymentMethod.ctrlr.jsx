import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Divider, Text } from 'components/ui';
import store from 'Store';
import checkoutApi from 'services/api/checkout';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import decorators from 'utils/decorators';
import UtilActions from 'utils/redux/Actions';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import klarnaUtils from 'utils/Klarna';
import KlarnaActions from 'actions/KlarnaActions';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import { forms } from 'style/config';
import DefaultPaymentCheckbox from 'components/RwdCheckout/Sections/Payment/Section/DefaultPaymentCheckbox';
import mediaUtils from 'utils/Media';

const { Media } = mediaUtils;

const KLARNA_LOAD_TIMEOUT = 15000;
const KLARNA_IFRAME_WRAPPER_ID = 'klarna_iframe_wrapper';

class KlarnaPaymentMethod extends BaseClass {
    constructor(props) {
        super(props);
        const orderDetails = store.getState().order.orderDetails;
        const isBopisOrder = orderDetails.header && orderDetails.header.isBopisOrder;

        this.state = {
            useMyShippingAddress: false,
            isBopisOrder
        };
    }

    timeout = null;

    initKlarna = () => {
        return new Promise((resolve, reject) => {
            checkoutApi
                .initializeKlarnaCheckout({ status: klarnaUtils.SESSION_STATUSES.UPDATE })
                .then(session => {
                    checkoutApi
                        .getOrderDetails(OrderUtils.getOrderId())
                        .then(order => {
                            store.dispatch(OrderActions.updateOrder(order));
                            resolve({
                                session,
                                order
                            });
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    };

    toggleCheckbox = () => {
        store.dispatch(KlarnaActions.toggleShipping(!this.state.useMyShippingAddress));
    };

    loadIframe = () => {
        const getText = localeUtils.getLocaleResourceFile('components/Klarna/KlarnaPaymentMethod/locales', 'KlarnaPaymentMethod');
        const onFailure = error => {
            // eslint-disable-next-line no-console
            console.error(error);
            clearTimeout(this.timeout);
            store.dispatch(KlarnaActions.showError(getText('iframeError'), true));
        };
        store.dispatch(UtilActions.merge('klarna', 'isReady', false));

        return decorators
            .withInterstice(this.initKlarna, INTERSTICE_DELAY_MS)()
            .then(data => {
                if (this.isUnmounted) {
                    return;
                }

                if (!data.session || !data.session.clientToken) {
                    onFailure({ reason: 'clientToken' });
                }

                // call reject if klarna API is not responding
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    onFailure({ reason: 'timeout' });
                }, KLARNA_LOAD_TIMEOUT);

                klarnaUtils
                    .load(KLARNA_IFRAME_WRAPPER_ID, data.session.clientToken)
                    .then(() => {
                        store.dispatch(UtilActions.merge('klarna', 'isReady', true));
                    })
                    .catch(error => {
                        onFailure(error);
                    })
                    .finally(() => {
                        clearTimeout(this.timeout);
                    });
            })
            .catch(err => {
                store.dispatch(Actions.showInterstice(false));
                onFailure(err);
            });
    };

    componentDidMount() {
        store.setAndWatch('order.orderDetails.priceInfo.creditCardAmount', this, null, true);
        store.setAndWatch('order.orderDetails.priceInfo.paypalAmount', this, null, true);
        store.setAndWatch('klarna.useMyShippingAddress', this, null, true);
    }

    componentWillUnmount() {
        // if component is unmount -> void loadCallId and prevent new calls from being started
        // so the callbacks of Klarna.Payments.load() will not be handled
        klarnaUtils.loadCallId = 0;
        this.isUnmounted = true;
        clearTimeout(this.timeout);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.creditCardAmount !== this.state.creditCardAmount || this.state.paypalAmount) {
            this.loadIframe();
        }
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Klarna/KlarnaPaymentMethod/locales', 'KlarnaPaymentMethod');
        const { isAnonymous, isFrictionless } = this.props;

        return (
            <>
                {!isFrictionless && (
                    <Box
                        fontSize={['xl', '2xl']}
                        marginBottom={[4, 3]}
                    ></Box>
                )}
                <Box
                    id={KLARNA_IFRAME_WRAPPER_ID}
                    marginY={[0, 1]}
                    maxWidth={410}
                    minHeight={'auto'}
                    {...(isFrictionless && { marginLeft: [0, 6] })}
                ></Box>
                {!isAnonymous && (
                    <Media lessThan='sm'>
                        <Divider marginY={4} />
                    </Media>
                )}
                <Box
                    marginLeft={[0, forms.RADIO_SIZE + forms.RADIO_MARGIN]}
                    {...(isFrictionless && { marginBottom: [4, 0] })}
                >
                    {!this.state.isBopisOrder && (
                        <Checkbox
                            paddingY={3}
                            checked={!!this.state.useMyShippingAddress}
                            onClick={this.toggleCheckbox}
                        >
                            {getText('myBillingAddrIsTheSame')}
                        </Checkbox>
                    )}
                    {!isAnonymous && <DefaultPaymentCheckbox paymentName={'klarna'} />}
                    <Text
                        is='p'
                        key='klarnaLegalNotice'
                        fontSize='sm'
                        children={getText('legalNotice')}
                    />
                </Box>
            </>
        );
    }
}

export default wrapComponent(KlarnaPaymentMethod, 'KlarnaPaymentMethod', true);
