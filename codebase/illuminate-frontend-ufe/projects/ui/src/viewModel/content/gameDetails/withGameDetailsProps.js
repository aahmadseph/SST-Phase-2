import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import GameActions from 'actions/GameActions';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import { isBIUserSelector } from 'viewModel/selectors/user/isBIUserSelector';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/GameDetails/locales', 'GameDetails');

const localization = createStructuredSelector({
    downloadApp: getTextFromResource(getText, 'downloadApp'),
    congrats: getTextFromResource(getText, 'congrats'),
    nextLevel: getTextFromResource(getText, 'nextLevel', ['{0}', '{1}'])
});

const { wrapHOC } = FrameworkUtils;
const { onJoinTheChallenge, showGameCompletedModal } = GameActions;

const fields = createSelector(
    isAnonymousSelector,
    isBIUserSelector,
    localization,
    (_state, ownProps) => ownProps.datasource,
    (isAnonymous, isBIUser, locale, datasource) => {
        const { promoId, statusForAnalytics } = datasource;

        return {
            hideJoinCTACopy: !isAnonymous && !isBIUser,
            fireTaskDetailAnalytics: (taskPromoId, isTaskCtaCallback) => {
                enhancedContentPageBindings.fireTaskDetailAnalytics({ status: statusForAnalytics, gamePromoId: promoId, taskPromoId });

                // LOYLS-2757
                if (taskPromoId === 'GAM_Task_RBC_042424_14' && isTaskCtaCallback) {
                    enhancedContentPageBindings.fireLinkTrackingAnalytics({
                        actionInfo: 'gamification:download app - recycle empties', //prop55
                        linkName: 'D=c55'
                    });
                }
            },
            setTaskDetailCTAAnalytics: ({ taskPromoId, linkName }) => {
                enhancedContentPageBindings.setTaskDetailCTAAnalytics({ gamePromoId: promoId, taskPromoId, linkName });
            },
            fireJoinChallengeCTAAnalytics: gameId => {
                enhancedContentPageBindings.fireLinkTrackingAnalytics({
                    actionInfo: 'gamification:join challenge click', //prop55
                    eVar54: `${gameId}:n/a:${promoId}:n/a:${statusForAnalytics}:n/a`,
                    linkName: 'D=c55'
                });
            },
            fireRedeemPointsCTAAnalytics: gameId => {
                enhancedContentPageBindings.fireLinkTrackingAnalytics({
                    actionInfo: 'gamification:redeem points click', //prop55
                    eVar54: `${gameId}:n/a:${promoId}:n/a:${statusForAnalytics}:n/a`,
                    linkName: 'D=c55'
                });
            },
            localization: locale
        };
    }
);

const functions = {
    onJoinTheChallenge,
    showGameCompletedModal
};

const withGameDetailsProps = wrapHOC(connect(fields, functions));

export {
    withGameDetailsProps, fields, functions
};
