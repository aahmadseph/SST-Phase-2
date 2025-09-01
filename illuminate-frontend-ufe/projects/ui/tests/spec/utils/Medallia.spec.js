const { any, createSpy } = jasmine;

const LoadScriptsUtils = require('utils/LoadScripts').default;
const LocaleUtils = require('utils/LanguageLocale').default;
const MedalliaUtils = require('utils/Medallia').default;

const MedalliaConstants = require('constants/Medallia');

const { MEDALLIA_FORMS_SDK, MEDALLIA_SURVEY_TYPES, MEDALLIA_SURVEYS_CONFIGS } = MedalliaConstants;

describe('Medallia utils', () => {
    describe('loadSurveySdk', () => {
        beforeEach(() => {
            Sephora.renderQueryParams.country = undefined;

            spyOn(LoadScriptsUtils, 'loadScripts').and.callFake((...args) => {
                args[1]();
            });
        });

        it('should load the US SDK by default', () => {
            MedalliaUtils.loadSurveySdk();
            expect(LoadScriptsUtils.loadScripts).toHaveBeenCalledWith([MEDALLIA_FORMS_SDK[LocaleUtils.COUNTRIES.US]], any(Function), true);
        });

        it('should load the Canadian SDK', () => {
            Sephora.renderQueryParams.country = LocaleUtils.COUNTRIES.CA;

            MedalliaUtils.loadSurveySdk();
            expect(LoadScriptsUtils.loadScripts).toHaveBeenCalledWith([MEDALLIA_FORMS_SDK[LocaleUtils.COUNTRIES.CA]], any(Function), true);
        });

        it('should load the US SDK', () => {
            Sephora.renderQueryParams.country = LocaleUtils.COUNTRIES.US;

            MedalliaUtils.loadSurveySdk();
            expect(LoadScriptsUtils.loadScripts).toHaveBeenCalledWith([MEDALLIA_FORMS_SDK[LocaleUtils.COUNTRIES.US]], any(Function), true);
        });
    });

    describe('isSurveyKillSwitchEnabled', () => {
        beforeEach(() => {
            Sephora.configurationSettings = {
                ...Sephora.configurationSettings,
                enableMedallia: false,
                medallia: {
                    employeeSurvey: {
                        isEnabled: false
                    }
                }
            };
        });

        it('should return "true" when "medalia.employeeSurvey.isEnabled" is enabled', () => {
            Sephora.configurationSettings.medallia.employeeSurvey.isEnabled = true;
            const result = MedalliaUtils.isSurveyKillSwitchEnabled(MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK);
            expect(result).toBeTrue();
        });

        it('should return "true" when "enableMedallia" is enabled', () => {
            Sephora.configurationSettings.enableMedallia = true;
            const result = MedalliaUtils.isSurveyKillSwitchEnabled(MEDALLIA_SURVEY_TYPES.EVERGREEN);
            expect(result).toBeTrue();
        });
    });

    describe('loadSurvey', () => {
        beforeEach(() => {
            window.KAMPYLE_ONSITE_SDK = undefined;
        });

        it('should not load the survey if the SDK is not loaded', () => {
            const result = MedalliaUtils.loadSurvey('test-form-id');
            expect(result).toBeNull();
        });

        it('should load the Employee Feedback survey when "surveyType" is provided', () => {
            window.KAMPYLE_ONSITE_SDK = { loadForm: createSpy('loadForm').and.returnValue(true) };
            const surveyType = MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK;
            const currentCountry = LocaleUtils.COUNTRIES.US;

            MedalliaUtils.loadSurvey(surveyType);

            expect(window.KAMPYLE_ONSITE_SDK.loadForm).toHaveBeenCalledWith(MEDALLIA_SURVEYS_CONFIGS[surveyType].formId[currentCountry]);
        });

        it('should load the Evergreen survey when "surveyType" is provided', () => {
            window.KAMPYLE_ONSITE_SDK = { loadForm: createSpy('loadForm').and.returnValue(true) };
            const surveyType = MEDALLIA_SURVEY_TYPES.EVERGREEN;
            const currentCountry = LocaleUtils.COUNTRIES.US;

            MedalliaUtils.loadSurvey(surveyType);

            expect(window.KAMPYLE_ONSITE_SDK.loadForm).toHaveBeenCalledWith(MEDALLIA_SURVEYS_CONFIGS[surveyType].formId[currentCountry]);
        });
    });

    describe('showSurvey', () => {
        beforeEach(() => {
            window.KAMPYLE_ONSITE_SDK = undefined;
        });

        it('should not show the survey if the SDK is not loaded', () => {
            const result = MedalliaUtils.showSurvey('test-form-id', true);
            expect(result).toBeNull();
        });

        it('should not show the survey if "isSurveyLoaded" is false', () => {
            window.KAMPYLE_ONSITE_SDK = { showForm: createSpy('showForm').and.returnValue(true) };

            const result = MedalliaUtils.showSurvey('test-form-id', false);
            expect(result).toBeNull();
        });

        it('should show the Employee Feedback survey when "surveyType" is provided', () => {
            window.KAMPYLE_ONSITE_SDK = { showForm: createSpy('showForm').and.returnValue(true) };
            const surveyType = MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK;
            const currentCountry = LocaleUtils.COUNTRIES.US;

            MedalliaUtils.showSurvey(surveyType, true);

            expect(window.KAMPYLE_ONSITE_SDK.showForm).toHaveBeenCalledWith(MEDALLIA_SURVEYS_CONFIGS[surveyType].formId[currentCountry]);
        });

        it('should show the Evergreen survey when "surveyType" is provided', () => {
            window.KAMPYLE_ONSITE_SDK = { showForm: createSpy('showForm').and.returnValue(true) };
            const surveyType = MEDALLIA_SURVEY_TYPES.EVERGREEN;
            const currentCountry = LocaleUtils.COUNTRIES.US;

            MedalliaUtils.showSurvey(surveyType, true);

            expect(window.KAMPYLE_ONSITE_SDK.showForm).toHaveBeenCalledWith(MEDALLIA_SURVEYS_CONFIGS[surveyType].formId[currentCountry]);
        });
    });
});
