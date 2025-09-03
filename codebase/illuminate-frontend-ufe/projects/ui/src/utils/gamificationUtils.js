import sdnService from 'services/api/sdn';
import store from 'store/Store';
import cookieUtils from 'utils/Cookies';
import headerUtils from 'utils/Headers';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import locationUtils from 'utils/Location';
import StringUtils from 'utils/String';
import Helpers from 'utils/Helpers';

const { getParamValueAsSingleString } = urlUtils;
const { isGamesHubPage } = locationUtils;
const { userXTimestampHeader } = headerUtils;
const { challengeMessage } = sdnService;
const { appendDollarSign } = Helpers;

const createRequestBody = eventName => {
    const loyaltyId = store.getState().user.beautyInsiderAccount?.biAccountId;
    const sessionId = cookieUtils.read(cookieUtils.KEYS.SEPH_SESSION);
    const timestamp = userXTimestampHeader()['x-timestamp'];

    return {
        sourceSysCode: 'web',
        source: 'web',
        loyaltyId,
        event: {
            name: eventName,
            timestamp,
            propertiesMap: {
                ['visit_id']: sessionId
            }
        }
    };
};

const completeQuizEvent = quiz => {
    if (!userUtils.isAnonymous()) {
        const body = createRequestBody(quiz);

        // PATCH: If loyaltyId is null don't send the message LOYLS-1705
        if (body?.loyaltyId) {
            challengeMessage(body);
        }
    }
};

const shouldTriggerMedalliaSurvey = () => {
    const gameid = getParamValueAsSingleString('gameid');
    const promoid = getParamValueAsSingleString('promoid');

    return isGamesHubPage() && gameid && promoid;
};

// LOYLS-3049
const migrateTierCustomCopy = (isCompleted, localization) => {
    if (!userUtils.isAnonymous()) {
        let text = null;

        if (isCompleted || userUtils.isRouge()) {
            text = localization.congrats;
        } else if (userUtils.isInsider() || userUtils.isVIB()) {
            const nextTier = userUtils.getNextTierUser() || '';
            const biStatus = userUtils.getBiStatusText();
            text = StringUtils.format(localization.nextLevel, biStatus, nextTier);
        }

        return (
            text && {
                data: {},
                content: [
                    {
                        data: {},
                        marks: [{ type: 'bold' }],
                        value: text,
                        nodeType: 'text'
                    }
                ],
                nodeType: 'paragraph'
            }
        );
    }

    return null;
};

const buildTierMigrateCustomModalStatus = (isCompleted, modalStatus, localization, clientSummary) => {
    if (!userUtils.isAnonymous() && clientSummary?.currentTier && clientSummary?.nextTier) {
        const nextTier = clientSummary.nextTier;
        const currentTier = clientSummary.currentTier === 'BI' ? 'Insider' : clientSummary.currentTier;

        if (isCompleted || currentTier === 'ROUGE') {
            return localization.congrats;
        } else {
            const spentRequired = clientSummary.userTierDetails.find(i => i.name === nextTier)?.spendToQualify;

            return StringUtils.format(modalStatus, currentTier, appendDollarSign(spentRequired), nextTier);
        }
    }

    return null;
};

export default {
    completeQuizEvent,
    shouldTriggerMedalliaSurvey,
    migrateTierCustomCopy,
    buildTierMigrateCustomModalStatus
};
