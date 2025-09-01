/* eslint-disable no-bitwise */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import actions from 'Actions';
import IconLock from 'components/LegacyIcon/IconLock';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import CreditCardUtils from 'utils/CreditCard';
import invoiceApi from 'services/api/invoice';
import {
    Container, Flex, Text, Box, Divider, Grid
} from 'components/ui';
import Logo from 'components/Logo/Logo';
import CompactFooter from 'components/Footer/CompactFooter';
import InvoiceDetails from 'components/Invoice/InvoiceDetails/InvoiceDetails';
import PaymentConfirmation from 'components/Invoice/PaymentConfirmation/PaymentConfirmation';
import InvoiceNoLongerAvailable from 'components/Invoice/InvoiceNoLongerAvailable/InvoiceNoLongerAvailable';
import SubmitPayment from 'components/Invoice/SubmitPayment/SubmitPayment.f';
import CCLogos from 'components/Invoice/CCLogos/CCLogos';
import withBillingAddressFormViewModel from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/withBillingAddressFormViewModel';
import withCreditCardFormViewModel from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/CreditCardForm/withCreditCardFormViewModel';
import BillingAddressFormComponent from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm';
import CreditCardFormComponent from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/CreditCardForm';

const { loadChaseTokenizer } = CreditCardUtils;

const BillingAddressForm = withBillingAddressFormViewModel(BillingAddressFormComponent);
const CreditCardForm = withCreditCardFormViewModel(CreditCardFormComponent);

const getText = localeUtils.getLocaleResourceFile('components/Invoice/locales', 'Invoice');

class Invoice extends BaseClass {
    state = {
        invoiceDetails: {},
        countries: [],
        submitPaymentResponse: {
            status: 'NOT AUTHORIZED'
        }
    };

    billingAddressFormRef = React.createRef();
    creditCardFormRef = React.createRef();

    get creditCardForm() {
        return this.creditCardFormRef.current;
    }

    get billingAddressForm() {
        return this.billingAddressFormRef.current;
    }

    componentDidMount() {
        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            loadChaseTokenizer();
        }

        const token = encodeURIComponent(urlUtils.getParams()?.token?.[0]);

        invoiceApi
            .getInvoice(token)
            .then(response => this.setState({ invoiceDetails: response }))
            .catch(e => this.setState({ invoiceDetails: e }));
    }

    render() {
        const { submitPaymentResponse, invoiceDetails } = this.state;
        const { status } = submitPaymentResponse;
        const { invoiceId } = invoiceDetails;
        const showPaymentConfirmation = invoiceId && status === 'PAID';
        const showInvoiceDetailsPage = invoiceId && status === 'NOT AUTHORIZED';
        const showInvoiceNoLongerAvailable = invoiceDetails?.errorCode;

        return (
            <Flex
                flexDirection='column'
                minHeight='100vh'
            >
                <Flex
                    justifyContent='center'
                    paddingY={[4, 6]}
                    boxShadow='0 1px 4px 0 var(--color-darken2)'
                >
                    <Logo />
                </Flex>
                <Box flex='1 0 auto'>
                    <Container paddingY={4}>
                        {showPaymentConfirmation && <PaymentConfirmation invoiceId={invoiceId} />}
                        {showInvoiceNoLongerAvailable && <InvoiceNoLongerAvailable />}
                        {showInvoiceDetailsPage && (
                            <Grid
                                alignItems='start'
                                columns={[null, '1fr 400px']}
                                gap={[null, 5]}
                            >
                                <div>
                                    <Text
                                        fontSize='xl'
                                        fontWeight='bold'
                                        is='h1'
                                    >
                                        {getText('invoice')}
                                    </Text>
                                    <Divider
                                        color='black'
                                        height={2}
                                        marginY={4}
                                    />
                                    <InvoiceDetails invoiceDetails={this.state.invoiceDetails} />
                                    <Divider
                                        color='black'
                                        height={2}
                                        marginTop={4}
                                    />
                                    <Flex
                                        alignItems='center'
                                        justifyContent='space-between'
                                    >
                                        <Text
                                            paddingY={4}
                                            fontSize='lg'
                                            fontWeight='bold'
                                            is='h2'
                                        >
                                            {getText('paymentMethod')}
                                        </Text>
                                        <Text>
                                            <IconLock
                                                fontSize='1.25em'
                                                marginRight='.5em'
                                                color='gray'
                                            />
                                            {getText('secure')}
                                        </Text>
                                    </Flex>
                                    <CCLogos />
                                    <CreditCardForm ref={this.creditCardFormRef} />
                                    <Text
                                        paddingY={4}
                                        fontWeight='bold'
                                        is='h3'
                                    >
                                        {getText('billingAddress')}
                                    </Text>
                                    <BillingAddressForm
                                        ref={this.billingAddressFormRef}
                                        addressLineTwoColor={'blue'}
                                    />
                                </div>
                                <SubmitPayment
                                    total={this.state.invoiceDetails?.invoiceAmountDisplay}
                                    submit={this.onSave}
                                />
                            </Grid>
                        )}
                    </Container>
                </Box>
                <CompactFooter />
            </Flex>
        );
    }

    onSave = () => {
        let creditCardData, billingAddressData;
        const { invoiceDetails } = this.state;
        const creditCardErrors = this.creditCardForm.validate();
        let formDataIsValid = !creditCardErrors.fields.length;
        const billingAddressErrors = this.billingAddressForm.validate();

        formDataIsValid &= !billingAddressErrors.fields.length;

        if (formDataIsValid) {
            creditCardData = {
                creditCard: this.creditCardForm.getCreditCard()
            };

            billingAddressData = this.billingAddressForm.getAddress();

            invoiceApi
                .submitInvoicePayment(creditCardData, billingAddressData, invoiceDetails)
                .then(response => this.setState({ submitPaymentResponse: response }))
                .catch(e => {
                    store.dispatch(
                        actions.showInfoModal({
                            isOpen: true,
                            title: getText('errorTitle'),
                            message: e?.errorMessages[0],
                            buttonText: getText('ok'),
                            isHtml: true
                        })
                    );
                });
        }
    };
}

export default wrapComponent(Invoice, 'Invoice', true);
