import basketUtils from 'utils/Basket';
import helperUtils from 'utils/Helpers';
import languageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile, isFrench } = languageLocaleUtils;

const { capitalizeFirstLetter } = helperUtils;

const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');
const getTextFreq = getLocaleResourceFile('components/GlobalModals/DeliveryFrequencyModal/locales', 'DeliveryFrequencyModal');

const REPLENISHMENT_DISCOUNT_TYPES = {
    AMOUNT: 'A',
    PERCENTAGE: 'P'
};

function formatCurrency(amount, qty) {
    const calculateAmount = parseFloat(amount * qty).toFixed(2);

    return isFrench() ? `${calculateAmount.replace('.', ',')} $` : `$${calculateAmount}`;
}

function formatSavingAmountString(
    currentSku,
    qty = 1,
    displayDiscountOnly = false,
    discountTypeShowOff = true,
    discountTypeShowSave = false,
    isAcceleratedPromotion = null
) {
    const {
        replenishmentAdjuster = currentSku.discountAmount || '',
        replenishmentAdjusterPrice = currentSku.discountedPrice || '',
        replenishmentAdjusterType = currentSku.discountType || ''
    } = currentSku;
    const currencyFormatted = formatCurrency(parseFloat(basketUtils.removeCurrency(replenishmentAdjusterPrice)), qty);

    // We get either A or P as replenishmentAdjusterType from the API
    // A means "Amount" -> $
    // P means "Percentage" -> %
    // Based on that, we display the saving amount
    // If we recive a percentage, we need to get rid of the decimals
    const isDiscountTypeAmount = replenishmentAdjusterType === REPLENISHMENT_DISCOUNT_TYPES.AMOUNT;
    const discountAmountFormatted = formatCurrency(parseFloat(basketUtils.removeCurrency(replenishmentAdjuster)), qty);
    const discountPercentFormatted = `${replenishmentAdjuster.split('.')[0]}%`;

    const displayDiscount = isDiscountTypeAmount ? discountAmountFormatted : discountPercentFormatted;

    const displayPriceAndDiscount = `${currencyFormatted || ''} (${
        isDiscountTypeAmount
            ? `${getText('save')} ${discountAmountFormatted}`
            : `${discountTypeShowSave ? `${getText('save')} ` : ''}${discountPercentFormatted}${discountTypeShowOff ? ' off' : ''}`
    })${isAcceleratedPromotion ? '*' : ''}`;

    return displayDiscountOnly ? displayDiscount : displayPriceAndDiscount;
}

function formatAcceleratedPromoDiscountString(acceleratedPromotion = {}, qty = 1) {
    const { discountType = '', discountAmount = '' } = acceleratedPromotion;

    // We get either A or P as discountType from the API
    // A means "Amount" -> $
    // P means "Percentage" -> %
    // If we recive a percentage, we need to get rid of the decimals
    const isDiscountTypeAmount = discountType === REPLENISHMENT_DISCOUNT_TYPES.AMOUNT;
    const discountAmountFormatted = formatCurrency(parseFloat(basketUtils.removeCurrency(discountAmount)), qty);
    const discountPercentFormatted = `${discountAmount.split('.')[0]}%`;

    return isDiscountTypeAmount ? discountAmountFormatted : discountPercentFormatted;
}

function formatFrequencyType(num = 2, type = '', isLowerCase = false) {
    const frequencyType = isLowerCase ? type.toLowerCase() : capitalizeFirstLetter(type.toLowerCase());

    return num > 1 ? frequencyType : frequencyType.slice(0, -1);
}

function sortAnnualSavingsInfo(data = []) {
    return data.reduce((acc, { annualSavings, frequencyNumber, frequencyType }) => {
        acc[frequencyType] = {
            ...acc[frequencyType],
            [frequencyNumber]: annualSavings
        };

        return acc;
    }, {});
}

function calculateAdjusterPrice(amount, qty) {
    if (!amount) {
        return null;
    }

    return basketUtils.getCurrency(amount) + Number(Number(basketUtils.removeCurrency(amount) * qty)).toFixed(2);
}

function extractReplenishFrequency(item, autoReplenishItems) {
    let autoReplenishFrequency = '';

    if (autoReplenishItems && autoReplenishItems.length > 0) {
        autoReplenishItems.forEach(subscriptionItem => {
            autoReplenishFrequency = item.sku.skuId === subscriptionItem.sku.skuId ? subscriptionItem.replenishmentFrequency : autoReplenishFrequency;
        });
    }

    return autoReplenishFrequency;
}

function formatLegalCopy(discountPercentage, childOrderCount) {
    const discountPercentFormatted = `${discountPercentage.split('.')[0]}%`;

    return `*${discountPercentFormatted} ${getTextFreq('legalCopy1')} ${childOrderCount} ${getTextFreq('legalCopy2')}`;
}

function getReplenFrequencyNumAndType(item = {}) {
    const { isReplenishment, replenishmentFrequency } = item;
    const [replenishmentFreqType = '', replenishmentFreqNum = 0] =
        isReplenishment && replenishmentFrequency ? replenishmentFrequency?.split(':') : [];

    return { replenishmentFreqNum: parseInt(replenishmentFreqNum), replenishmentFreqType };
}

function getFormattedDeliveryFrequency(item) {
    const { replenishmentFreqType, replenishmentFreqNum } = getReplenFrequencyNumAndType(item);

    return `${replenishmentFreqNum} ${formatFrequencyType(replenishmentFreqNum, replenishmentFreqType, true)}`;
}

export default {
    formatSavingAmountString,
    formatFrequencyType,
    sortAnnualSavingsInfo,
    calculateAdjusterPrice,
    extractReplenishFrequency,
    formatCurrency,
    formatLegalCopy,
    REPLENISHMENT_DISCOUNT_TYPES,
    formatAcceleratedPromoDiscountString,
    getReplenFrequencyNumAndType,
    getFormattedDeliveryFrequency
};
