export const CategoryType = {
    INDIGENOUS_AMERICAN: 'IA',
    RESELLER: 'R',
    NON_PROFIT_RELIGIOUS_CHARITABLE: 'NPRCO',
    DISABLED_VETERANS_OKLAHOMA: 'DVIFO',
    EXPORT_SALE_FREIGHT_FORWARDER: 'ESFFF',
    STATE_LOCAL_EDUCATIONAL: 'SLGEI',
    OTHER: 'O'
};

export const CategoryTypeCA = {
    FIRST_NATION_MEMBERS: 'FA',
    OTHER: 'O'
};

export const EpsCodeToCategoryType = {
    '01': CategoryTypeCA.FIRST_NATION_MEMBERS,
    '02': CategoryTypeCA.OTHER,
    '03': CategoryType.INDIGENOUS_AMERICAN,
    '04': CategoryType.DISABLED_VETERANS_OKLAHOMA,
    '05': CategoryType.EXPORT_SALE_FREIGHT_FORWARDER,
    '06': CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE,
    '07': CategoryType.STATE_LOCAL_EDUCATIONAL,
    '08': CategoryType.RESELLER,
    '09': CategoryType.OTHER
};

export const FreightForwarderType = {
    ZIP_CODE: 'My ship to Zip Code is 34249',
    FLORIDA: 'I am shipping to a Florida Freight Forwarder and I am uploading a Certificate of Forwarding Agent Address.',
    CERTIFICATE:
        'If you do not have a Certificate of Forwarding Agent Address and are using a zip code designated by the Florida Department of Revenue as tax exempt, other than 34249, please attach a copy of the letter from the Florida D.O.R. authorizing this zip code as tax exempt'
};

export const TaxClaimAddressValues = {
    ADDRESS1: 'address1',
    ADDRESS2: 'address2',
    CITY: 'city',
    STATE: 'state',
    ZIP_CODE: 'zipCode',
    POSTAL_CODE: 'postalCode',
    OKLAHOMA: 'Oklahoma',
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    COUNTRY: 'country',
    PHONE_NUMBER: 'phoneNumber'
};
