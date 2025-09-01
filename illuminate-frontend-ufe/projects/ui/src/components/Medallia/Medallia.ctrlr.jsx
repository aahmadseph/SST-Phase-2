import React from 'react';

import BaseClass from 'components/BaseClass';
import { Flex, Link } from 'components/ui';

import { wrapComponent } from 'utils/framework';
import LocaleUtils from 'utils/LanguageLocale';
import MedalliaUtils from 'utils/Medallia';
import gamificationUtils from 'utils/gamificationUtils';

import { MEDALLIA_SURVEY_TYPES } from 'constants/Medallia';
import { nebOnsiteLoaded, PostLoad } from 'constants/events';

const getText = (text, vars) => LocaleUtils.getLocaleResourceFile('components/Medallia/locales', 'Medallia')(text, vars);

class Medallia extends BaseClass {
    state = {
        enabledSurveyTypes: [],
        isSdkLoaded: false,
        prePath: null,
        surveyLoadedStatuses: {}
    };

    static getDerivedStateFromProps(props, state) {
        const { path } = props;
        const { prevPath, surveyLoadedStatuses } = state;

        if (!path || path === prevPath) {
            return null;
        }

        const newEnabledSurveyTypes = MedalliaUtils.getEnabledSurveys(path);
        const newSurveyStatuses = { ...surveyLoadedStatuses };

        const loadSurveyAndGetStatuses = surveyType => {
            if (!surveyLoadedStatuses[surveyType]) {
                newSurveyStatuses[surveyType] = MedalliaUtils.loadSurvey(surveyType);
            }
        };

        MedalliaUtils.runPerSurvey({
            callback: surveyType => loadSurveyAndGetStatuses(surveyType),
            enabledSurveyTypes: newEnabledSurveyTypes
        });

        return {
            enabledSurveyTypes: newEnabledSurveyTypes,
            prevPath: path,
            surveyLoadedStatuses: newSurveyStatuses
        };
    }

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            this.loadMedallia();
        });
    }

    componentWillUnmount() {
        const { enabledSurveyTypes } = this.state;

        MedalliaUtils.runPerSurvey({
            callback: surveyType => window.removeEventListener(nebOnsiteLoaded, () => this.loadSurveyAndStoreStatus(surveyType)),
            enabledSurveyTypes: enabledSurveyTypes
        });

        MedalliaUtils.removeSurveyEvents();
    }

    render() {
        const { enabledSurveyTypes, isSdkLoaded } = this.state;

        if (!isSdkLoaded) {
            return null;
        }

        return (
            <>
                {enabledSurveyTypes.includes(MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK) && (
                    <Flex
                        backgroundColor='lightBlue'
                        justifyContent='center'
                    >
                        <Link
                            children={getText('employeeFeedback')}
                            color='black'
                            onClick={this.handleSurveyOnClick(MEDALLIA_SURVEY_TYPES.EMPLOYEE_FEEDBACK)}
                            padding={3}
                            textAlign='center'
                        />
                    </Flex>
                )}

                {enabledSurveyTypes.includes(MEDALLIA_SURVEY_TYPES.EVERGREEN) && (
                    <Flex
                        backgroundColor='midGray'
                        justifyContent='center'
                    >
                        <Link
                            children={getText('evergreen')}
                            color='black'
                            fontWeight='bold'
                            onClick={this.handleSurveyOnClick(MEDALLIA_SURVEY_TYPES.EVERGREEN)}
                            padding={3}
                        />
                    </Flex>
                )}
            </>
        );
    }

    handleSurveyOnClick = surveyType => () => {
        const isSurveyLoaded = this.state.surveyLoadedStatuses[surveyType];

        if (!isSurveyLoaded) {
            return;
        }

        MedalliaUtils.showSurvey(surveyType, isSurveyLoaded);
    };

    loadMedallia = () => {
        const { enabledSurveyTypes, isSdkLoaded } = this.state;

        if (!enabledSurveyTypes.length && !gamificationUtils.shouldTriggerMedalliaSurvey()) {
            return;
        }

        const addEventAndLoadSurvey = surveyType => {
            window.addEventListener(nebOnsiteLoaded, () => this.loadSurveyAndStoreStatus(surveyType));
            this.loadSurveyAndStoreStatus(surveyType);
        };

        MedalliaUtils.runPerSurvey({
            callback: addEventAndLoadSurvey,
            enabledSurveyTypes: enabledSurveyTypes
        });

        if (!isSdkLoaded) {
            MedalliaUtils.loadSurveySdk();
            this.setState({ isSdkLoaded: true });
        }
    };

    loadSurveyAndStoreStatus = surveyType => {
        const newSurveyLoadedStatuses = MedalliaUtils.loadSurvey(surveyType);

        this.setState(prevState => ({
            surveyLoadedStatuses: {
                ...prevState.surveyLoadedStatuses,
                [surveyType]: newSurveyLoadedStatuses
            }
        }));
    };
}

export default wrapComponent(Medallia, 'Medallia', true);
