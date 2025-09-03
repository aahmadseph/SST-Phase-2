import MedalliaBindings from 'analytics/bindingMethods/components/medallia/MedalliaBindings';
import processEvent from 'analytics/processEvent';

import CookieUtils from 'utils/Cookies';
import LocaleUtils from 'utils/LanguageLocale';
import LoadScriptsUtils from 'utils/LoadScripts';
import SpaUtils from 'utils/Spa';

import analyticsConstants from 'analytics/constants';
import {
    MEDALLIA_EVENTS, MEDALLIA_FORMS_SDK, MEDALLIA_SURVEY_TYPES, MEDALLIA_SURVEYS_CONFIGS
} from 'constants/Medallia';

const formCloseNoSubmit = data => {
    const {
        detail: { Form_Type: formType, Form_ID: formId }
    } = data;

    const prop55 = analyticsConstants.MEDALLIA.FORM.DISMISSED;
    const pev2 = analyticsConstants.MEDALLIA.FORM.DISMISSED;
    const eVar77 = `${formId}:${getSurveyFormType(formType)}:n/a`;
    const eventData = {
        actionInfo: prop55,
        linkName: pev2,
        medalliaFormIdAndType: eVar77
    };

    processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
        data: eventData
    });

    MedalliaBindings.formDismissed({ formType, formId });
};

const formDisplayedEvent = data => {
    const {
        detail: { Form_Type: formType, Form_ID: formId }
    } = data;

    const prop55 = analyticsConstants.MEDALLIA.FORM.DISPLAYED;
    const pev2 = analyticsConstants.MEDALLIA.FORM.DISPLAYED;
    const eVar77 = `${formId}:${getSurveyFormType(formType)}:n/a`;
    const eventData = {
        actionInfo: prop55,
        linkName: pev2,
        medalliaFormIdAndType: eVar77
    };

    processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
        data: eventData
    });

    MedalliaBindings.formDisplayed({ formType, formId });
};

const formSubmitFeedback = data => {
    const {
        detail: { Form_Type: formType, Form_ID: formId }
    } = data;

    const prop55 = analyticsConstants.MEDALLIA.FORM.SUBMITTED;
    const pev2 = analyticsConstants.MEDALLIA.FORM.SUBMITTED;
    const eVar77 = `${formId}:${getSurveyFormType(formType)}:${data.detail.Feedback_UUID}`;
    const content = data.detail.Content || [];
    const nps = content.find(attr => attr.unique_name === 'Digital LTR', {});
    const satScore = content.find(attr => attr.unique_name === 'Digital OSAT', {});
    const eventData = {
        actionInfo: prop55,
        linkName: pev2,
        medalliaFormIdAndType: eVar77,
        eventStrings: [`${analyticsConstants.Event.EVENT_108}=${nps.value}`, `${analyticsConstants.Event.EVENT_109}=${satScore.value}`]
    };

    processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
        data: eventData
    });

    MedalliaBindings.formSubmitted({ formType, formId });
};

const getEnabledSurveys = currentPath => {
    const currentTemplate = SpaUtils.getSpaTemplateInfoByUrl(currentPath)?.template || Sephora.template;

    const isEmployeeSurveyEnabled =
        isSurveyKillSwitchEnabled(MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK) &&
        CookieUtils.isRCPSCCEnabled() &&
        isSurveyInPageEnabled(currentTemplate, MEDALLIA_SURVEYS_CONFIGS[MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK].pages);
    const isEvergreenSurveyEnabled =
        isSurveyInPageDisabled(currentTemplate, MEDALLIA_SURVEYS_CONFIGS[MEDALLIA_SURVEY_TYPES.EVERGREEN].pages) &&
        isSurveyKillSwitchEnabled(MEDALLIA_SURVEY_TYPES.EVERGREEN);

    const enabledSurveys = [];

    if (isEmployeeSurveyEnabled) {
        enabledSurveys.push(MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK);
    }

    if (isEvergreenSurveyEnabled) {
        enabledSurveys.push(MEDALLIA_SURVEY_TYPES.EVERGREEN);
    }

    return enabledSurveys;
};

const getSurveyFormType = type => {
    switch (type) {
        case 'AlwaysOn':
        case 'TriggeredByCode':
            return 'always on';
        default:
            return type.toLowerCase();
    }
};

const getSurveyNumber = surveyType => {
    const currentCountry = LocaleUtils.getCurrentCountry();

    return MEDALLIA_SURVEYS_CONFIGS[surveyType].formId[currentCountry];
};

const isSurveyInPageEnabled = (template, pages) => {
    return pages.has(template);
};

const isSurveyInPageDisabled = (template, pages) => {
    return !pages.has(template);
};

const isSurveyKillSwitchEnabled = surveyType => {
    const getConfigValue = keys =>
        keys.split('.').reduce((object, currentKey) => {
            return object ? object[currentKey] : null;
        }, Sephora.configurationSettings);

    return getConfigValue(MEDALLIA_SURVEYS_CONFIGS[surveyType].killSwitch);
};

const loadSurvey = surveyType => {
    if (!surveyType || !window.KAMPYLE_ONSITE_SDK) {
        return null;
    }

    return window.KAMPYLE_ONSITE_SDK.loadForm(getSurveyNumber(surveyType));
};

const loadSurveySdk = async () => {
    const currentCountry = LocaleUtils.getCurrentCountry();
    LoadScriptsUtils.loadScripts([MEDALLIA_FORMS_SDK[currentCountry]], () => setUpSurveyEvents(), true);
};

const removeSurveyEvents = () => {
    Object.keys(MEDALLIA_EVENTS).forEach(key => {
        window.removeEventListener(MEDALLIA_EVENTS[key], runEventsCallbacks);
    });
};

const runEventsCallbacks = data => {
    const selectedCallback = MEDALLIA_FORM_EVENTS[data.type];

    if (!selectedCallback) {
        return null;
    }

    return selectedCallback(data);
};

const runPerSurvey = ({ enabledSurveyTypes, callback = surveyType => surveyType }) => {
    if (!enabledSurveyTypes.length) {
        return;
    }

    enabledSurveyTypes.forEach(surveyType => {
        callback(surveyType);
    });
};

const setUpSurveyEvents = () => {
    Object.keys(MEDALLIA_EVENTS).forEach(key => {
        window.addEventListener(MEDALLIA_EVENTS[key], runEventsCallbacks);
    });
};

const showSurvey = (surveyType, isSurveyLoaded) => {
    const prop55 = analyticsConstants.MEDALLIA.FEEDBACK.LET_US_KNOW;
    const pev2 = analyticsConstants.MEDALLIA.FEEDBACK.LET_US_KNOW;

    processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
        data: {
            actionInfo: prop55,
            linkName: pev2
        }
    });

    MedalliaBindings.feedbackClick();

    if (!isSurveyLoaded || !surveyType || !window.KAMPYLE_ONSITE_SDK) {
        return null;
    }

    return window.KAMPYLE_ONSITE_SDK.showForm(getSurveyNumber(surveyType));
};

const MEDALLIA_FORM_EVENTS = {
    [MEDALLIA_EVENTS.FORM_DISPLAYED]: formDisplayedEvent,
    [MEDALLIA_EVENTS.FORM_SUBMIT_FEEDBACK]: formSubmitFeedback,
    [MEDALLIA_EVENTS.FORM_CLOSE_NO_SUBMIT]: formCloseNoSubmit
};

export default {
    getEnabledSurveys,
    getSurveyNumber,
    isSurveyKillSwitchEnabled,
    loadSurvey,
    loadSurveySdk,
    removeSurveyEvents,
    runPerSurvey,
    showSurvey
};
