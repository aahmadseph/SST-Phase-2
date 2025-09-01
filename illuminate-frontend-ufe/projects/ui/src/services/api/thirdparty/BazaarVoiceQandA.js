import Location from 'utils/Location.js';
import filterUtils from 'utils/Filters';
import BazarVoiceClient from 'services/api/thirdparty/BazarVoiceClient';

let qAndAReadConfig = Sephora.configurationSettings.bvApi_rich_profile;
const qAndAWriteConfig = Sephora.configurationSettings.bvApi_rwdQandA_write || {};

// Use this searchQandAClient for implementing search Q&A feature.
// It can be extracted to separate file, responsible for that feature.
let searchQandAReadConfig = Sephora.configurationSettings.bvApi_rich_profile;

function getBadgesFromLocationAndCampaign(answerData) {
    const isSephoraEmployee = answerData.CampaignId;
    const isFreeProduct = answerData.UserLocation;
    const badges = {};

    if (isSephoraEmployee === 'true') {
        badges.StaffContextBadge = { ContentType: 'ANSWER', Id: 'StaffContextBadge', BadgeType: 'Custom' };
    }

    if (isFreeProduct === 'true') {
        badges.IncentivizedReviewBadge = { ContentType: 'ANSWER', Id: 'IncentivizedReviewBadge', BadgeType: 'Custom' };
    }

    return badges;
}

function getBadges(answerData) {
    const badges = answerData.Badges;

    if (Object.keys(badges).length === 0) {
        return getBadgesFromLocationAndCampaign(answerData);
    } else {
        return answerData.Badges;
    }
}

function reviewsDataAdapter(data) {
    const copy = {};
    copy.totalResults = data.TotalResults;
    copy.results = data.Results.map(question => {
        copy.answers = question.AnswerIds.map(answer => {
            const answerData = data.Includes.Answers[answer];

            return {
                answerText: decodeURIComponent(answerData.AnswerText),
                submissionTime: answerData.SubmissionTime,
                userNickname: answerData.UserNickname,
                totalNegativeFeedbackCount: answerData.TotalNegativeFeedbackCount,
                totalPositiveFeedbackCount: answerData.TotalPositiveFeedbackCount,
                answerId: answerData.Id,
                badges: getBadges(answerData),
                badgesOrder: answerData.BadgesOrder
            };
        });

        return {
            questionId: question.Id,
            userNickname: question.UserNickname,
            questionDetails: decodeURIComponent(question.QuestionDetails),
            submissionTime: new Date(question.SubmissionTime),
            answers: copy.answers
        };
    });

    return copy;
}

function bazaarVoiceClientParamsQAndA() {
    if (Location.isProductPage()) {
        qAndAReadConfig = Sephora.isMobile()
            ? Sephora.configurationSettings.bvApi_rwdQandA_mWeb_read
            : Sephora.configurationSettings.bvApi_rwdQandA_desktop_read;
    }

    return {
        readConfig: qAndAReadConfig,
        writeConfig: qAndAWriteConfig,
        isEnabled: Sephora.configurationSettings.isBazaarVoiceEnabled
    };
}

/**
 * For more information look at:
 *https://developer.bazaarvoice.com/conversations-api/reference/v5.4/questions/question-display
 */
function QuestionAnswersandStats(productId, limit, sortQuestionBy, sortAnswerBy, offset) {
    const qAndAClient = new BazarVoiceClient(bazaarVoiceClientParamsQAndA());
    const type = 'Answers';
    const qsParams = {
        Filter: `ProductId:${productId}`,
        Sort: sortQuestionBy,
        Limit: limit,
        Offset: offset,
        Include: 'Products,Answers',
        Stats: 'Questions'
    };

    if (sortQuestionBy !== filterUtils.QUESTIONS_SORT_TYPES[2].value) {
        qsParams[`Sort_${type}`] = sortAnswerBy;
    }

    return qAndAClient
        .request({
            method: 'GET',
            url: '/data/questions.json',
            qsParams: qsParams
        })
        .then(data => reviewsDataAdapter(data));
}

/**
 * For more information look at:
 *https://developer.bazaarvoice.com/conversations-api/getting-started/display-fundamentals#full-text-search
 */
function searchQuestionsAnswers(productId, limit, keyword, offset) {
    if (Location.isProductPage()) {
        searchQandAReadConfig = Sephora.isMobile()
            ? Sephora.configurationSettings.bvApi_rwdQandA_mWeb_read
            : Sephora.configurationSettings.bvApi_rwdQandA_desktop_read;
    }

    const searchQandAClient = new BazarVoiceClient({
        readConfig: searchQandAReadConfig,
        isEnabled: Sephora.configurationSettings.isBazaarVoiceEnabled
    });
    const qsParams = {
        Filter: `ProductId:${productId}`,
        Search: keyword,
        Limit: limit,
        Offset: offset,
        Include: 'Answers'
    };

    return searchQandAClient
        .request({
            method: 'GET',
            url: '/data/questions.json',
            qsParams: qsParams
        })
        .then(data => reviewsDataAdapter(data));
}

/**
 * Submit feedback on whether a given Content was Positive or Negative
 *
 * For more information:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/feedback/feedback-submission
 *
 * @param contentType Valid contentTypes are: review | question | answer | review_comment
 * @param contentId Identification of the content
 * @param isPositive Use true for Positive Vote, otherwise it sends Negative Vote
 */
function submitFeedback(contentType, contentId, isPositive) {
    const qAndAClient = new BazarVoiceClient(bazaarVoiceClientParamsQAndA());
    const params = {
        FeedbackType: 'helpfulness',
        ContentType: contentType,
        ContentId: contentId,
        Vote: isPositive ? 'Positive' : 'Negative'
    };

    return qAndAClient.request({
        method: 'POST',
        url: '/data/submitfeedback.json',
        qsParams: params
    });
}

export default {
    QuestionAnswersandStats,
    searchQuestionsAnswers,
    submitFeedback
};
