import languageLocaleUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UserUtils from 'utils/User';
import Empty from 'constants/empty';

const { COUNTRIES } = languageLocaleUtils;

// Do not use this method on billing addresses since AVS shoutd not be enabled on billing addresses
function hasAVS(country) {
    return Sephora.configurationSettings.enableAddressValidation && (country === COUNTRIES.CA || country === COUNTRIES.US);
}

function formatZipPostalCode(inputData, divider, leftLength, totalLength) {
    let formatZipPostal = inputData;

    if (formatZipPostal) {
        if (formatZipPostal.length > leftLength && formatZipPostal.indexOf(divider) === -1) {
            // adds a hyphen/space if zip/postal code is missing one and needs it
            // calls autoFill function if zip/postal code after hyphen/space is 10/6 characters long
            formatZipPostal = `${formatZipPostal.slice(0, leftLength)}${divider}` + `${formatZipPostal.slice(leftLength, totalLength)}`;
        } else if (formatZipPostal.length === leftLength + 1) {
            // remove hyphen/space in zip/postal code if user removes the chars to right of divider
            if (formatZipPostal.slice(0, leftLength).indexOf(divider) !== -1) {
                formatZipPostal = formatZipPostal.replace(divider, '');
            }

            formatZipPostal = formatZipPostal.slice(0, leftLength);
        } else if (formatZipPostal.slice(0, leftLength).indexOf(divider) !== -1) {
            //remove hyphen/space if user deletes numbers in zip code well before hyphen/space
            formatZipPostal = formatZipPostal.replace(divider, '');

            if (formatZipPostal.length > leftLength) {
                formatZipPostal = `${formatZipPostal.slice(0, leftLength)}${divider}` + `${formatZipPostal.slice(leftLength, totalLength)}`;
            }
        }
    }

    return formatZipPostal;
}

// Removes the extra 4 digits of a zipcode
function formatZipCode(zip) {
    return (zip || '').split('-')[0];
}

function updateLocalDefaultShippingAddressData(defaultSAData) {
    const { defaultSACountryCode, defaultSAZipCode } = defaultSAData;
    const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA) || Empty.Object;

    if (userData?.profile) {
        Object.assign(userData.profile, {
            defaultSACountryCode,
            defaultSAZipCode
        });

        Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userData, UserUtils.USER_DATA_EXPIRY);
    }
}

export default {
    hasAVS,
    formatZipPostalCode,
    formatZipCode,
    updateLocalDefaultShippingAddressData
};
