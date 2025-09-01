import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

/**
 * Submit a tax credit memo.
 * @param {Object} jsonData - The input data for the tax credit memo submission.
 * @param {File[]} files - Array of files to be uploaded.
 * @returns {Promise<Object>} The response data.
 */
export const submitFinalTaxForm = async (jsonData, files = []) => {
    const url = '/gway/v1/dotcom/creditmemo/submitTaxCreditMemo';
    const locale = localeUtils.getCurrentLanguageLocale();

    // Create FormData object
    const formData = new FormData();

    // Append files to FormData, if any
    files.forEach((file, index) => {
        formData.append(`document${index + 1}`, file);
    });

    // Append JSON data to FormData
    formData.append('jsonData', JSON.stringify(jsonData));

    // Set up the request options
    const options = {
        method: 'POST',
        body: formData,
        headers: {
            locale: locale
        }
    };

    try {
        const response = await ufeApi.makeRequest(url, options);

        if (response?.responseStatus === 500 || response?.fault) {
            throw new Error(response?.fault?.detail?.errorcode);
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
