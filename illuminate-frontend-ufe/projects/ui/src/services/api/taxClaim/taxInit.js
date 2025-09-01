import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

/**
 *
 * @returns
 */

export const taxInit = async () => {
    const url = '/gway/v1/dotcom/creditmemo/initAppAndGetTaxCategories';
    const country = localeUtils.getCurrentCountry();
    const TAX = 'TAX';

    const options = {
        method: 'POST',
        body: JSON.stringify({ countryCode: country, type: TAX }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const data = await ufeApi.makeRequest(url, options);

        if (data.errorCode || data.err) {
            throw data;
        }

        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};
