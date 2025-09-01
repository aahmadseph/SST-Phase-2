import bazaarVoiceReview from 'services/api/thirdparty/BazaarVoice';
import bazaarVoiceAnswer from 'services/api/thirdparty/BazaarVoiceQandA';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const FEEDBACK_CONTENT_TYPES = {
    REVIEW: 'review',
    ANSWER: 'answer'
};

function sendAnalytics(prop55, contentId) {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: ['event71'],
            linkName: 'D=c55',
            actionInfo: prop55,
            reviewId: contentId
        }
    });
}

function handleVote(contentType, contentId, isPositive) {
    switch (contentType) {
        case FEEDBACK_CONTENT_TYPES.REVIEW: {
            bazaarVoiceReview.submitFeedback(contentType, contentId, isPositive);
            sendAnalytics(`review:${isPositive ? 'helpful' : 'unhelpful'}`, contentId);

            break;
        }
        case FEEDBACK_CONTENT_TYPES.ANSWER: {
            bazaarVoiceAnswer.submitFeedback(contentType, contentId, isPositive);
            sendAnalytics(`question and answer:${isPositive ? 'helpful' : 'unhelpful'}`, contentId);

            break;
        }
        default:
            break;
    }
}

export default {
    FEEDBACK_CONTENT_TYPES,
    handleVote
};
