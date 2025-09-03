import ufeApi from 'services/api/ufeApi';
import Storage from 'utils/localStorage/Storage';
const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 86400000;
const DEFAULT_EXCHANGE_RATE = '1.32';
const EXCHANGE_RATE_DATA = 'EXCHANGE_RATE_DATA';

const setCachedData = data => {
    const exchangeRates = data || '1.357590000';
    Storage.local.setItem(EXCHANGE_RATE_DATA, exchangeRates, TWENTY_FOUR_HOURS_IN_MILLISECONDS);
};

const getCachedData = () => {
    return Storage.local.getItem(EXCHANGE_RATE_DATA);
};

const getExchangeRate = () => {
    if (!Sephora.configurationSettings.sdnUfeAPIUserKey) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject();
    }

    const exchangeRate = getCachedData();

    if (!exchangeRate) {
        const url = `/gway/v1/currency-converter-service/exchange-rate-usd-cad?apikey=${Sephora.configurationSettings.sdnUfeAPIUserKey}`;

        return ufeApi.makeRequest(url, { method: 'GET' }, { skipLoginPrompt: true }).then(data =>
            data.errorCode
                ? Promise.reject(data)
                : (() => {
                    // Verify the response from the API is valid
                    if (!data?.value) {
                        return Promise.reject(data);
                    }

                    const exchangeRates = data?.value;
                    setCachedData(exchangeRates);

                    return Promise.resolve(exchangeRates);
                })()
        );
    } else {
        return Promise.resolve(exchangeRate);
    }
};

const setupExchangeRate = () =>
    new Promise(resolve => {
        getExchangeRate()
            .then(exchangeRate => {
                window.exchangeRate = {
                    CAD: exchangeRate
                };
                resolve();
            })
            .catch(() => {
                // eslint-disable-next-line no-console
                console.log('Exchange rate service not available.');

                window.exchangeRate = {
                    CAD: DEFAULT_EXCHANGE_RATE
                };
            });
    });

export default setupExchangeRate;
