import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+State+List+API

const STATES = {
    US: {
        en: [
            {
                description: 'select a state/region',
                name: ''
            },
            {
                description: 'AA - Armed Forces America',
                name: 'AA'
            },
            {
                description: 'AE - Armed Forces Europe',
                name: 'AE'
            },
            {
                description: 'AK - Alaska',
                name: 'AK'
            },
            {
                description: 'AL - Alabama',
                name: 'AL'
            },
            {
                description: 'AP - Armed Forces Pacific',
                name: 'AP'
            },
            {
                description: 'AR - Arkansas',
                name: 'AR'
            },
            {
                description: 'AZ - Arizona',
                name: 'AZ'
            },
            {
                description: 'CA - California',
                name: 'CA'
            },
            {
                description: 'CO - Colorado',
                name: 'CO'
            },
            {
                description: 'CT - Connecticut',
                name: 'CT'
            },
            {
                description: 'DC - District of Columbia',
                name: 'DC'
            },
            {
                description: 'DE - Delaware',
                name: 'DE'
            },
            {
                description: 'FL - Florida',
                name: 'FL'
            },
            {
                description: 'GA - Georgia',
                name: 'GA'
            },
            {
                description: 'HI - Hawaii',
                name: 'HI'
            },
            {
                description: 'IA - Iowa',
                name: 'IA'
            },
            {
                description: 'ID - Idaho',
                name: 'ID'
            },
            {
                description: 'IL - Illinois',
                name: 'IL'
            },
            {
                description: 'IN - Indiana',
                name: 'IN'
            },
            {
                description: 'KS - Kansas',
                name: 'KS'
            },
            {
                description: 'KY - Kentucky',
                name: 'KY'
            },
            {
                description: 'LA - Louisiana',
                name: 'LA'
            },
            {
                description: 'MA - Massachusetts',
                name: 'MA'
            },
            {
                description: 'MD - Maryland',
                name: 'MD'
            },
            {
                description: 'ME - Maine',
                name: 'ME'
            },
            {
                description: 'MI - Michigan',
                name: 'MI'
            },
            {
                description: 'MN - Minnesota',
                name: 'MN'
            },
            {
                description: 'MO - Missouri',
                name: 'MO'
            },
            {
                description: 'MS - Mississippi',
                name: 'MS'
            },
            {
                description: 'MT - Montana',
                name: 'MT'
            },
            {
                description: 'NC - North Carolina',
                name: 'NC'
            },
            {
                description: 'ND - North Dakota',
                name: 'ND'
            },
            {
                description: 'NE - Nebraska',
                name: 'NE'
            },
            {
                description: 'NH - New Hampshire',
                name: 'NH'
            },
            {
                description: 'NJ - New Jersey',
                name: 'NJ'
            },
            {
                description: 'NM - New Mexico',
                name: 'NM'
            },
            {
                description: 'NV - Nevada',
                name: 'NV'
            },
            {
                description: 'NY - New York',
                name: 'NY'
            },
            {
                description: 'OH - Ohio',
                name: 'OH'
            },
            {
                description: 'OK - Oklahoma',
                name: 'OK'
            },
            {
                description: 'OR - Oregon',
                name: 'OR'
            },
            {
                description: 'PA - Pennsylvania',
                name: 'PA'
            },
            {
                description: 'PR - Puerto Rico',
                name: 'PR'
            },
            {
                description: 'PW - Palau',
                name: 'PW'
            },
            {
                description: 'RI - Rhode Island',
                name: 'RI'
            },
            {
                description: 'SC - South Carolina',
                name: 'SC'
            },
            {
                description: 'SD - South Dakota',
                name: 'SD'
            },
            {
                description: 'TN - Tennessee',
                name: 'TN'
            },
            {
                description: 'TX - Texas',
                name: 'TX'
            },
            {
                description: 'UT - Utah',
                name: 'UT'
            },
            {
                description: 'VA - Virginia',
                name: 'VA'
            },
            {
                description: 'VT - Vermont',
                name: 'VT'
            },
            {
                description: 'WA - Washington',
                name: 'WA'
            },
            {
                description: 'WI - Wisconsin',
                name: 'WI'
            },
            {
                description: 'WV - West Virginia',
                name: 'WV'
            },
            {
                description: 'WY - Wyoming',
                name: 'WY'
            }
        ],
        fr: [
            {
                description: 'sélectionner un État / une région',
                name: ''
            },
            {
                description: 'AA - Forces armées américaines',
                name: 'AA'
            },
            {
                description: 'AE - Forces armées - Europe',
                name: 'AE'
            },
            {
                description: 'AK - Alaska',
                name: 'AK'
            },
            {
                description: 'AL - Alabama',
                name: 'AL'
            },
            {
                description: 'AP - Forces armées - Pacifique',
                name: 'AP'
            },
            {
                description: 'AR - Arkansas',
                name: 'AR'
            },
            {
                description: 'AZ - Arizona',
                name: 'AZ'
            },
            {
                description: 'CA - Californie',
                name: 'CA'
            },
            {
                description: 'CO - Colorado',
                name: 'CO'
            },
            {
                description: 'CT - Connecticut',
                name: 'CT'
            },
            {
                description: 'DC - District de Columbia',
                name: 'DC'
            },
            {
                description: 'DE - Delaware',
                name: 'DE'
            },
            {
                description: 'FL - Floride',
                name: 'FL'
            },
            {
                description: 'GA - Georgie',
                name: 'GA'
            },
            {
                description: 'HI - Hawaï',
                name: 'HI'
            },
            {
                description: 'IA - Iowa',
                name: 'IA'
            },
            {
                description: 'ID - Idaho',
                name: 'ID'
            },
            {
                description: 'IL - Illinois',
                name: 'IL'
            },
            {
                description: 'IN - Indiana',
                name: 'IN'
            },
            {
                description: 'KS - Kansas',
                name: 'KS'
            },
            {
                description: 'KY - Kentucky',
                name: 'KY'
            },
            {
                description: 'LA - Louisiane',
                name: 'LA'
            },
            {
                description: 'MA - Massachusetts',
                name: 'MA'
            },
            {
                description: 'MD - Maryland',
                name: 'MD'
            },
            {
                description: 'ME - Maine',
                name: 'ME'
            },
            {
                description: 'MI - Michigan',
                name: 'MI'
            },
            {
                description: 'MN - Minnesota',
                name: 'MN'
            },
            {
                description: 'MO - Missouri',
                name: 'MO'
            },
            {
                description: 'MS - Mississippi',
                name: 'MS'
            },
            {
                description: 'MT - Montana',
                name: 'MT'
            },
            {
                description: 'NC - Caroline du Nord',
                name: 'NC'
            },
            {
                description: 'ND - Dakota du Nord',
                name: 'ND'
            },
            {
                description: 'NE - Nebraska',
                name: 'NE'
            },
            {
                description: 'NH - New Hampshire',
                name: 'NH'
            },
            {
                description: 'NJ - New Jersey',
                name: 'NJ'
            },
            {
                description: 'NM - Nouveau-Mexique',
                name: 'NM'
            },
            {
                description: 'NV - Nevada',
                name: 'NV'
            },
            {
                description: 'NY - New York',
                name: 'NY'
            },
            {
                description: 'OH - Ohio',
                name: 'OH'
            },
            {
                description: 'OK - Oklahoma',
                name: 'OK'
            },
            {
                description: 'OR - Oregon',
                name: 'OR'
            },
            {
                description: 'PA - Pennsylvanie',
                name: 'PA'
            },
            {
                description: 'PR - Puerto Rico',
                name: 'PR'
            },
            {
                description: 'PW - Palaos',
                name: 'PW'
            },
            {
                description: 'RI - Rhode Island',
                name: 'RI'
            },
            {
                description: 'SC - Caroline du Sud',
                name: 'SC'
            },
            {
                description: 'SD - Dakota du Sud',
                name: 'SD'
            },
            {
                description: 'TN - Tennessee',
                name: 'TN'
            },
            {
                description: 'TX - Texas',
                name: 'TX'
            },
            {
                description: 'UT - Utah',
                name: 'UT'
            },
            {
                description: 'VA - Virginie',
                name: 'VA'
            },
            {
                description: 'VT - Vermont',
                name: 'VT'
            },
            {
                description: 'WA - Washington',
                name: 'WA'
            },
            {
                description: 'WI - Wisconsin',
                name: 'WI'
            },
            {
                description: 'WV - Virginie occidentale',
                name: 'WV'
            },
            {
                description: 'WY - Wyoming',
                name: 'WY'
            }
        ]
    },
    CA: {
        en: [
            {
                description: 'select a province',
                name: ''
            },
            {
                description: 'AB - Alberta',
                name: 'AB'
            },
            {
                description: 'BC - British Columbia',
                name: 'BC'
            },
            {
                description: 'MB - Manitoba',
                name: 'MB'
            },
            {
                description: 'NB - New Brunswick',
                name: 'NB'
            },
            {
                description: 'NL - Newfoundland and Labrador',
                name: 'NL'
            },
            {
                description: 'NS - Nova Scotia',
                name: 'NS'
            },
            {
                description: 'NT - Northwest Territories',
                name: 'NT'
            },
            {
                description: 'NU - Nunavut',
                name: 'NU'
            },
            {
                description: 'ON - Ontario',
                name: 'ON'
            },
            {
                description: 'PE - Prince Edward Island',
                name: 'PE'
            },
            {
                description: 'QC - Quebec',
                name: 'QC'
            },
            {
                description: 'SK - Saskatchewan',
                name: 'SK'
            },
            {
                description: 'YT - Yukon',
                name: 'YT'
            }
        ],
        fr: [
            {
                description: 'sélectionner une province',
                name: ''
            },
            {
                description: 'AB - Alberta',
                name: 'AB'
            },
            {
                description: 'BC - Colombie-Britannique',
                name: 'BC'
            },
            {
                description: 'MB - Manitoba',
                name: 'MB'
            },
            {
                description: 'NB - Nouveau-Brunswick',
                name: 'NB'
            },
            {
                description: 'NL - Terre-Neuve-et-Labrador',
                name: 'NL'
            },
            {
                description: 'NS - Nouvelle-Écosse',
                name: 'NS'
            },
            {
                description: 'NT - Territoires du Nord-Ouest',
                name: 'NT'
            },
            {
                description: 'NU - Nunavut',
                name: 'NU'
            },
            {
                description: 'ON - Ontario',
                name: 'ON'
            },
            {
                description: 'PE - Île-du-Prince-Édouard',
                name: 'PE'
            },
            {
                description: 'QC - Québec',
                name: 'QC'
            },
            {
                description: 'SK - Saskatchewan',
                name: 'SK'
            },
            {
                description: 'YT - Yukon',
                name: 'YT'
            }
        ]
    }
};

function getStateList(countryCode) {
    const { isATGDecomCountriesEnabled } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;

    if (isATGDecomCountriesEnabled) {
        return Promise.resolve(STATES[countryCode || country][language] || []);
    }

    const url = `/api/util/countries/${countryCode}/states`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data.states));
}

export default getStateList;
