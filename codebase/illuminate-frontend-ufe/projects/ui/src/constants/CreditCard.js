/* eslint-disable max-len */

const USER_STATE = {
    NO_CARD: 'NO_CARD',
    IN_PROGRESS: 'IN_PROGRESS',
    CARD_NO_REWARDS: 'CARD_NO_REWARDS',
    CARD_AND_REWARDS: 'CARD_AND_REWARDS',
    CARD_CLOSED: 'CARD_CLOSED'
};

const APPROVAL_STATUS = {
    NEW_APPLICATION: 'NEW_APPLICATION',
    APPROVED: 'APPROVED',
    DECLINED: 'DECLINED',
    ERROR: 'ERROR',
    IN_PROGRESS: 'IN_PROGRESS',
    CLOSED: 'CLOSED'
};

const PRESCREEN_USER_RESPONSES = {
    DECLINED: 'DECLINED',
    ACCEPTED: 'ACCEPTED',
    NOT_ME: 'NOT_ME',
    NOT_OFFERED: 'NOT_OFFERED'
};

const MEDIA_IDS = {
    PRIVATE_LABEL: '74200022',
    CO_BRANDED: '74200023',
    NO_CARD: '73500024'
};

const SEPHORA_CARD_TYPES = {
    PRIVATE_LABEL: 'PLCC',
    PRIVATE_LABEL_TEMP: 'PLCCT',
    CO_BRANDED: 'CBVI',
    CO_BRANDED_TEMP: 'CBVIT'
};

const SEPHORA_CARD_LABELS = {
    PRIVATE_LABEL: 'PRIVATE_LABEL',
    CO_BRANDED: 'CO_BRANDED'
};

const LINKS = {
    PRINT_COPY: {
        CO_BRANDED: {
            QA: 'https://uat.comenity.net/legaldocs/sephora/legal-documents/cca',
            PROD: 'https://comenity.net/legaldocs/sephora/legal-documents/cca'
        },
        PRIVATE_LABEL: {
            QA: 'https://uat.comenity.net/legaldocs/sephora/legal-documents/cca',
            PROD: 'https://comenity.net/legaldocs/sephora/legal-documents/cca'
        }
    },
    ACCOUNT_TERMS: {
        CO_BRANDED: {
            QA: 'https://uat.comenity.net/sephoravisa/common/Legal/ESignDisclosure.xhtml',
            PROD: 'https://comenity.net/sephoravisa/common/Legal/ESignDisclosure.xhtml'
        },
        PRIVATE_LABEL: {
            QA: 'https://uat.comenity.net/sephoracard/common/Legal/ESignDisclosure.xhtml',
            PROD: 'https://comenity.net/sephoracard/common/Legal/ESignDisclosure.xhtml'
        }
    },
    FINANCIAL_TERMS: {
        CO_BRANDED: {
            QA: 'https://uat.comenity.net/sephoravisa/common/Legal/consent-disclosure.xhtml',
            PROD: 'https://comenity.net/sephoravisa/common/Legal/consent-disclosure.xhtml'
        },
        PRIVATE_LABEL: {
            QA: 'https://uat.comenity.net/sephoracard/common/Legal/consent-disclosure.xhtml',
            PROD: 'https://comenity.net/sephoracard/common/Legal/consent-disclosure.xhtml'
        }
    },
    MANAGE_CARD: {
        PRIVATE_LABEL: {
            QA: 'https://uat.comenity.net/sephoracard',
            PROD: 'https://comenity.net/sephoracard'
        },
        CO_BRANDED: {
            QA: 'https://uat.comenity.net/sephoravisa',
            PROD: 'https://comenity.net/sephoravisa'
        }
    }
};

const MANAGE_CREDIT_CARD_LINKS = {
    CBVI: 'https://duat.comenity.net/ac/sephoravisa/public/home',
    PLCC: 'https://duat.comenity.net/ac/sephoracard/public/home'
};

const PHONE_NUMBER_TYPES = {
    MOBILE: 'mobilePhone',
    ALTERNATE: 'alternatePhone'
};

const FC_CARD_LABELS = {
    VISA: 'VISA',
    MASTER: 'MAST',
    DISCOVER: 'DISC',
    AMEX: 'AMEX',
    SEPH: 'SEPH'
};

const CARD_NAMES = {
    AMEX: 'American Express',
    MASTER: 'MasterCard',
    DISCOVER: 'Discover'
};

export {
    PRESCREEN_USER_RESPONSES,
    USER_STATE,
    APPROVAL_STATUS,
    MEDIA_IDS,
    SEPHORA_CARD_TYPES,
    SEPHORA_CARD_LABELS,
    LINKS,
    PHONE_NUMBER_TYPES,
    MANAGE_CREDIT_CARD_LINKS,
    FC_CARD_LABELS,
    CARD_NAMES
};
