import creditCardUtils from 'utils/CreditCard';
import ufeApi from 'services/api/ufeApi';

const { getEncryptedCreditCardData } = creditCardUtils;

function submitInvoicePayment(creditCardData, billingAddressData, invoiceDetails) {
    const url = '/api/payments/invoice/payment';
    const encryptedCreditCardData = getEncryptedCreditCardData(creditCardData);

    if (encryptedCreditCardData.errorCode === -1) {
        return Promise.reject(encryptedCreditCardData);
    }

    const invoiceData = {
        billAddress: {
            ...billingAddressData,
            isInternational: undefined,
            formattedPhone: undefined
        },
        encryptedCCNumber: encryptedCreditCardData?.creditCard.encryptedCCNumber,
        encryptedCVV: encryptedCreditCardData?.creditCard.encryptedCVV,
        paymentRefData: encryptedCreditCardData?.creditCard.paymentRefData,
        expirationMonth: encryptedCreditCardData?.creditCard.expirationMonth,
        expirationYear: `20${encryptedCreditCardData?.creditCard.expirationYear}`,
        invoiceId: invoiceDetails?.invoiceId,
        invoiceAmount: invoiceDetails?.invoiceAmount,
        invoiceCurrency: invoiceDetails?.invoiceCurrency
    };

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(invoiceData)
        })
        .then(response => (response.errorCode ? Promise.reject(response) : response));
}

export default submitInvoicePayment;
