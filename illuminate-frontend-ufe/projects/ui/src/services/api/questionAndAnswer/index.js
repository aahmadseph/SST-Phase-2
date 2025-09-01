const accessToken = 'AUTH_ACCESS_TOKEN';
import accessTokenApi from 'services/api/accessToken/accessToken';
import submitQuestion from 'services/api/questionAndAnswer/submitQuestion';
import submitAnswer from 'services/api/questionAndAnswer/submitAnswer';
import getQuestionById from 'services/api/questionAndAnswer/getQuestionById';
import unsubscribeQuestion from 'services/api/questionAndAnswer/unsubscribeQuestion';

export default {
    submitQuestion,
    submitAnswer: accessTokenApi.withAccessToken(submitAnswer, accessToken),
    getQuestionById,
    unsubscribeQuestion
};
