import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Shipping+Countries+List+API

const SHIPPING_COUNTRIES = [
    {
        countryCode: 'US',
        countryLongName: 'United States'
    },
    {
        countryCode: 'CA',
        countryLongName: 'Canada',
        currency: {
            code: 'CAD',
            name: 'Canada',
            symbol: '$'
        }
    }
];

function getShippingCountryList() {
    const { isATGDecomCountriesEnabled } = Sephora.configurationSettings;

    if (isATGDecomCountriesEnabled) {
        return Promise.resolve(SHIPPING_COUNTRIES);
    }

    const url = '/api/util/shippingCountries';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data.countries));
}

export default getShippingCountryList;
