/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Button, Text, Grid, Container
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import questionAnswerApi from 'services/api/questionAndAnswer';
import urlUtils from 'utils/Url';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

class UnsubscribeQuestionBody extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            requestSuccess: false,
            requestFailed: false,
            isCommunityServiceEnabled: false
        };
    }

    componentDidMount() {
        const isCommunityServiceEnabled = Sephora.configurationSettings?.isCommunityServiceEnabled;
        this.setState({
            isCommunityServiceEnabled
        });
    }

    stopNotification = () => {
        this.sendAnalytics(false, false);
        const { isCommunityServiceEnabled } = this.state;

        const subscriptionId = urlUtils.getParamsByName('subscriptionId');
        const questionId = urlUtils.getParamsByName('questionId');
        questionAnswerApi
            .unsubscribeQuestion(subscriptionId[0], questionId[0], isCommunityServiceEnabled)
            .then(() => {
                this.setState({
                    requestSuccess: true,
                    requestFailed: false
                });
            })
            .catch(() => {
                this.setState({
                    requestSuccess: false,
                    requestFailed: true
                });
            });
    };

    continueShoping = withouUnsubscribe => {
        this.sendAnalytics(true, withouUnsubscribe);
        setTimeout(() => urlUtils.redirectTo('/'), 500);
    };

    back = () => {
        urlUtils.redirectTo('/');
    };

    sendAnalytics = (continuePressed, withouUnsubscribe) => {
        const unsubscribeSuccess = 'questions&answers:unsubscribe-success:n/a:*';
        const continueShopping = 'unsubscribe-request:continue shopping';
        const prop55 = continuePressed ? continueShopping : unsubscribeSuccess;
        const pev2 = continuePressed && withouUnsubscribe ? continueShopping : unsubscribeSuccess;

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: prop55,
                linkName: pev2
            }
        });
    };

    render() {
        const { requestSuccess, requestFailed } = this.state;
        const successOrFailure = requestSuccess || requestFailed;

        return (
            <Container paddingTop={[4, 6]}>
                <Text
                    is='h1'
                    fontSize={['md', 'xl']}
                    fontWeight='bold'
                    lineHeight='tight'
                    marginBottom='1em'
                    data-at={Sephora.debug.dataAt('unsubscribe_question_title')}
                    children={
                        requestSuccess
                            ? getText('unsubscribeMessage')
                            : requestFailed
                                ? getText('submissionNotReceived')
                                : getText('stopEmailNotification')
                    }
                />
                <p
                    data-at={Sephora.debug.dataAt('unsubscribe_question_subtitle')}
                    children={requestSuccess ? getText('noLonger') : requestFailed ? getText('submissionWrong') : getText('areYouSure')}
                />
                <Grid
                    gap={4}
                    marginTop={[4, 6]}
                    columns={[null, 2]}
                    maxWidth={[null, 556]}
                >
                    <Button
                        data-at={Sephora.debug.dataAt('stop_sending_email_notification_btn')}
                        variant='primary'
                        {...(successOrFailure
                            ? {
                                onClick: requestSuccess ? () => this.continueShoping(false) : this.back,
                                children: requestSuccess ? getText('continueShopping') : getText('back')
                            }
                            : {
                                onClick: this.stopNotification,
                                children: getText('stopSending')
                            })}
                    />
                    {successOrFailure ? (
                        <div />
                    ) : (
                        <Button
                            variant='secondary'
                            data-at={Sephora.debug.dataAt('continue_shopping_btn')}
                            onClick={() => this.continueShoping(true)}
                            children={getText('continueShopping')}
                        />
                    )}
                </Grid>
            </Container>
        );
    }
}

export default wrapComponent(UnsubscribeQuestionBody, 'UnsubscribeQuestionBody', true);
