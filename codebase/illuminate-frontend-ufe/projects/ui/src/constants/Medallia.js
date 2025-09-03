import LanguageUtils from 'utils/LanguageLocale';

import PageTemplateType from 'constants/PageTemplateType';

const { COUNTRIES } = LanguageUtils;

const MEDALLIA_SURVEY_TYPES = {
    EMPLOYEE_FEEDBACK: 'EMPLOYEE_FEEDBACK',
    EVERGREEN: 'EVERGREEN'
};

const MEDALLIA_EVENTS = {
    FORM_DISPLAYED: 'MDigital_Form_Displayed',
    FORM_SUBMIT_FEEDBACK: 'MDigital_Submit_Feedback',
    FORM_CLOSE_NO_SUBMIT: 'MDigital_Form_Close_No_Submit'
};

const MEDALLIA_FORMS_SDK = {
    [COUNTRIES.CA]: 'https://resources.digital-cloud.medallia.com/wdcus/113927/onsite/embed.js',
    [COUNTRIES.US]: 'https://resources.digital-cloud.medallia.com/wdcus/114065/onsite/embed.js'
};

const MEDALLIA_SURVEYS_CONFIGS = {
    [MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK]: {
        formId: {
            [COUNTRIES.CA]: 15401,
            [COUNTRIES.US]: 15402
        },
        killSwitch: 'medallia.employeeSurvey.isEnabled',
        // Enabled pages
        pages: new Set([PageTemplateType.RwdBasket, PageTemplateType.Checkout, PageTemplateType.Confirmation, PageTemplateType.ProductPage])
    },
    [MEDALLIA_SURVEY_TYPES.EVERGREEN]: {
        formId: {
            [COUNTRIES.CA]: 5089,
            [COUNTRIES.US]: 5098
        },
        killSwitch: 'enableMedallia',
        // Disabled pages
        pages: new Set([
            PageTemplateType.Addresses,
            PageTemplateType.Checkout,
            PageTemplateType.EmailPostal,
            PageTemplateType.MyAccount,
            PageTemplateType.OrderDetails,
            PageTemplateType.Orders,
            PageTemplateType.PaymentMethods,
            PageTemplateType.Profile,
            PageTemplateType.ResetPassword
        ])
    }
};

export {
    MEDALLIA_EVENTS, MEDALLIA_FORMS_SDK, MEDALLIA_SURVEY_TYPES, MEDALLIA_SURVEYS_CONFIGS
};
