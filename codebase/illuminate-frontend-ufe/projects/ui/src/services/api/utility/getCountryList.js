import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Country+List+API

const COUNTRIES = [
    {
        countryCode: 'AR',
        countryLongName: 'Argentina'
    },
    {
        countryCode: 'AU',
        countryLongName: 'Australia'
    },
    {
        countryCode: 'BH',
        countryLongName: 'Bahrain'
    },
    {
        countryCode: 'BR',
        countryLongName: 'Brazil'
    },
    {
        countryCode: 'CA',
        countryLongName: 'Canada'
    },
    {
        countryCode: 'CN',
        countryLongName: 'China'
    },
    {
        countryCode: 'DK',
        countryLongName: 'Denmark'
    },
    {
        countryCode: 'FR',
        countryLongName: 'France'
    },
    {
        countryCode: 'DE',
        countryLongName: 'Germany'
    },
    {
        countryCode: 'HK',
        countryLongName: 'Hong Kong'
    },
    {
        countryCode: 'IN',
        countryLongName: 'India'
    },
    {
        countryCode: 'ID',
        countryLongName: 'Indonesia'
    },
    {
        countryCode: 'IQ',
        countryLongName: 'Iraq'
    },
    {
        countryCode: 'IE',
        countryLongName: 'Ireland'
    },
    {
        countryCode: 'IL',
        countryLongName: 'Israel'
    },
    {
        countryCode: 'IT',
        countryLongName: 'Italy'
    },
    {
        countryCode: 'JP',
        countryLongName: 'Japan'
    },
    {
        countryCode: 'KR',
        countryLongName: 'Korea'
    },
    {
        countryCode: 'MY',
        countryLongName: 'Malaysia'
    },
    {
        countryCode: 'MX',
        countryLongName: 'Mexico'
    },
    {
        countryCode: 'NZ',
        countryLongName: 'New Zealand'
    },
    {
        countryCode: 'NO',
        countryLongName: 'Norway'
    },
    {
        countryCode: 'RU',
        countryLongName: 'Russia'
    },
    {
        countryCode: 'SA',
        countryLongName: 'Saudi Arabia'
    },
    {
        countryCode: 'SE',
        countryLongName: 'Sweden'
    },
    {
        countryCode: 'CH',
        countryLongName: 'Switzerland'
    },
    {
        countryCode: 'TW',
        countryLongName: 'Taiwan'
    },
    {
        countryCode: 'TR',
        countryLongName: 'Turkey'
    },
    {
        countryCode: 'UA',
        countryLongName: 'Ukraine'
    },
    {
        countryCode: 'AE',
        countryLongName: 'United Arab Emirates'
    },
    {
        countryCode: 'GB',
        countryLongName: 'United Kingdom'
    },
    {
        countryCode: 'US',
        countryLongName: 'United States'
    },
    {
        countryCode: 'VE',
        countryLongName: 'Venezuela'
    }
];

function getCountryList() {
    const { isATGDecomCountriesEnabled } = Sephora.configurationSettings;

    if (isATGDecomCountriesEnabled) {
        return Promise.resolve(COUNTRIES);
    }

    const url = '/api/util/countries';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data.countries));
}

export default getCountryList;
