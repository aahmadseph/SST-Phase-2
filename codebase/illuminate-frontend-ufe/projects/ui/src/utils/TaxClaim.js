import languageLocaleUtils from 'utils/LanguageLocale';
import { CategoryType, CategoryTypeCA } from 'components/RichProfile/MyAccount/TaxClaim/constants';

const { getCurrentCountry } = languageLocaleUtils;

const TaxClaimUtils = {
    isTaxExemptionEnabled: () => {
        const { isTaxExemptionEnabled, isTaxExemptionEnabledUS, isTaxExemptionEnabledCA } = Sephora.configurationSettings;

        return (
            isTaxExemptionEnabled &&
            ((languageLocaleUtils.isUS() && isTaxExemptionEnabledUS) || (languageLocaleUtils.isCanada() && isTaxExemptionEnabledCA))
        );
    },
    isTaxExemptAddress: address => {
        return Boolean(address?.taxExemptCode);
    },
    /**
     * Build payload based on the category.
     * @param {string} category - The tax category to determine the payload structure.
     * @param {Object} data - The data to be included in the payload.
     * @returns {Object} The constructed payload.
     */
    buildTaxFormPayload: (category, data, firstName, lastName, additionalData) => {
        const normalizedCategory = category.toUpperCase();
        const countryCode = getCurrentCountry();

        const addressObject = {
            addressLine1: data.address1,
            addressLine2: data.address2,
            city: data.city,
            stateCode: data.state,
            postalCode: data.postalCode,
            countryCode
        };

        // Extract the first name and last name from data or fallback to provided values
        const effectiveFirstName = data.firstName || firstName;
        const effectiveLastName = data.lastName || lastName;

        switch (normalizedCategory) {
            case CategoryType.INDIGENOUS_AMERICAN:
                return {
                    indigenousAmericansInfo: {
                        ...(additionalData && typeof additionalData === 'object' ? additionalData : {}),
                        issueDate: data.issueDate,
                        expirationDate: data.expirationDate,
                        tribeId: data.tribeIdNumber || '',
                        tribeName: data.tribeName,
                        reservationName: data.tribeReserveName
                    }
                };

            case CategoryTypeCA.FIRST_NATION_MEMBERS:
                return {
                    firstNationMembersInfo: {
                        ...(additionalData && typeof additionalData === 'object' ? additionalData : {}),
                        issueDate: data.issueDate,
                        expirationDate: data.expirationDate,
                        alias: data.alias,
                        registrationNumber: data.registrationNumber,
                        registryGroupNumber: data.registryGroupNumber,
                        bandName: data.registryBandName,
                        reservationName: data.nameOfReservation
                    }
                };

            case CategoryType.DISABLED_VETERANS_OKLAHOMA:
                return {
                    disabledVeteransInfo: {
                        exemptionNumber: data.veteranExemptionNumber,
                        effectiveDate: data.veteranEffectiveDate,
                        address: addressObject,
                        ...(additionalData && typeof additionalData === 'object' ? additionalData : {})
                    }
                };

            case CategoryType.EXPORT_SALE_FREIGHT_FORWARDER:
                return {
                    exportSaleInfo: {
                        forwarderName: data.freightForwarderName,
                        forwarderCertNumber: data.freightForwarderCertNumber,
                        issueDate: data.issueDate,
                        expirationDate: data.expirationDate,
                        documentDescCode: data.documentDescCode
                    }
                };

            case CategoryType.NON_PROFIT_RELIGIOUS_CHARITABLE:
                return {
                    nonProfitInfo: {
                        position: data.organizationPosition,
                        organizationName: data.organizationName,
                        organizationUrl: data.organizationUrl,
                        taxExemptNumber: data.stateIssuedTaxExemptNumber,
                        organizationPhoneNumber: data.phoneNumber,
                        organizationAddress: addressObject,
                        creditCardFirstName: effectiveFirstName,
                        creditCardLastName: effectiveLastName,
                        isCreditCardIssuedByOrg: data.creditCardIssued
                    }
                };

            case CategoryType.RESELLER:
                return {
                    resellerInfo: {
                        position: data.organizationPosition,
                        businessName: data.organizationName,
                        businessUrl: data.organizationUrl,
                        businessType: data.organizationType,
                        taxPermitNumber: data.stateIssuedTaxExemptNumber,
                        businessPhoneNumber: data.phoneNumber,
                        businessAddress: addressObject,
                        creditCardFirstName: effectiveFirstName,
                        creditCardLastName: effectiveLastName,
                        isCreditCardIssuedByOrg: data.creditCardIssued
                    }
                };

            case CategoryType.STATE_LOCAL_EDUCATIONAL:
                return {
                    governmentPurchasesInfo: {
                        position: data.organizationPosition,
                        organizationName: data.organizationName,
                        organizationUrl: data.organizationUrl,
                        taxExemptNumber: data.stateIssuedTaxExemptNumber,
                        organizationPhoneNumber: data.phoneNumber,
                        organizationAddress: addressObject,
                        creditCardFirstName: effectiveFirstName,
                        creditCardLastName: effectiveLastName,
                        isCreditCardIssuedByOrg: data.creditCardIssued
                    }
                };
            case CategoryType.OTHER: {
                return null;
            }

            default:
                throw new Error('Unsupported category');
        }
    },
    getCachedOrderDetails: (state, orderNumber) => {
        const existingOrderDetails = state.page.taxClaim.orderDetails;

        if (existingOrderDetails && existingOrderDetails.orderId === orderNumber) {
            return existingOrderDetails;
        }

        return null;
    },
    getFinalSubmissionErrorCode: error => {
        if (error?.response?.data?.errorCode) {
            return error.response.data.errorCode;
        }

        if (error?.fault?.detail?.errorcode) {
            return error.fault.detail.errorcode;
        }

        if (error?.response?.errorCode) {
            return error.response.errorCode;
        }

        if (error?.errorCode) {
            return error.errorCode;
        }

        return error?.message || 'unknown';
    },
    deeplyCheckFormErrors: (obj, ignoreProps = new Set()) => {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }

        const ignoreSet = new Set(ignoreProps);

        for (const key in obj) {
            if (!ignoreSet.has(key)) {
                if ({}.hasOwnProperty.call(obj, key)) {
                    if (typeof obj[key] === 'boolean' && obj[key]) {
                        return true;
                    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        if (TaxClaimUtils.deeplyCheckFormErrors(obj[key], ignoreSet)) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
};

export default TaxClaimUtils;
