import userUtils from 'utils/User';
import actions from 'Actions';
import languageLocaleUtils from 'utils/LanguageLocale';
import sdnApi from 'services/api/sdn';
import { getEnhancedContent } from 'services/api/Content/getEnhancedContent';
import store from 'store/Store';
import spaUtils from 'utils/Spa';
import enhancedContentActions from 'actions/EnhancedContentActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import { HEADER_VALUE } from 'constants/authentication';

import gamificationUtils from 'utils/gamificationUtils';

const { normalizePath } = spaUtils;
const { getLocaleResourceFile, getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;
const getText = getLocaleResourceFile('actions/locales', 'GameActions');

const { showSignInModal, showInfoModal, showGameInfoModal, showBiRegisterModal } = actions;
const { gameOptIn, acknowledgeGameCompletion, getDetailedClientSummary } = sdnApi;

const GAMIFICATION_DYNAMIC_MODAL_STATUS_TIER_MIGRATION = 'gamificationDynamicModalStatusTierMigration';

const joinCtaCallback = dispatch => () => {
    const country = getCurrentCountry();
    const language = getCurrentLanguage();
    const path = normalizePath(location.pathname);
    const userId = store.getState().user.beautyInsiderAccount?.biAccountId;
    const isAnonymous = userUtils.isAnonymous();

    getEnhancedContent({
        country,
        language,
        path,
        userId,
        isAnonymous
    }).then(response => {
        if (response.data) {
            dispatch(enhancedContentActions.setEnhancedContentData(response.data));
        }
    });
};

const showGameJoinedModal = ({
    gameJoinedModalImage, gameJoinedModalTitle, gameJoinedModalDescription, gotItLabel, dispatch
}) => {
    return showGameInfoModal({
        isOpen: true,
        image: gameJoinedModalImage,
        title: gameJoinedModalTitle,
        description: gameJoinedModalDescription,
        ctaLabel: gotItLabel,
        showConfetti: true,
        ctaCallback: joinCtaCallback(dispatch),
        dismissCallback: joinCtaCallback(dispatch)
    });
};

const onJoinTheChallengeErrorTracking = (dispatch, promoId, callback) => {
    enhancedContentPageBindings.fireLinkTrackingAnalytics({
        pageName: `gamification:error:n/a:*challenge=${promoId}`,
        fieldErrors: ['gamification'], //prop28
        errorMessages: [getText('message')], //prop48
        linkName: 'D=c55'
    });

    dispatch(
        showInfoModal({
            isOpen: true,
            title: getText('title'),
            message: getText('message'),
            buttonText: getText('button'),
            callback: callback,
            cancelCallback: callback
        })
    );
};

const onJoinTheChallenge = (
    {
        gameId, gameJoinedModalImage, gameJoinedModalTitle, gameJoinedModalDescription, gotItLabel, promoId, gameEnded, taskId, taskPromoId
    },
    callback
) => {
    const onJoinTheChallengeAction = dispatch => {
        if (userUtils.isAnonymous()) {
            dispatch(
                showSignInModal({
                    isOpen: true,
                    analyticsData: {
                        linkData: 'gamification:sign-in'
                    },
                    extraParams: { headerValue: HEADER_VALUE.USER_CLICK },
                    callback: () => onJoinTheChallengeAction(dispatch),
                    errback: callback
                })
            );
        } else if (!userUtils.isBI()) {
            dispatch(
                showBiRegisterModal({
                    isOpen: true,
                    analyticsData: {
                        linkData: 'gamification:bi sign-up'
                    },
                    callback: () => onJoinTheChallengeAction(dispatch),
                    cancellationCallback: callback
                })
            );
        } else {
            const loyaltyId = store.getState().user.beautyInsiderAccount?.biAccountId;

            gameOptIn({ gameId, loyaltyId })
                .then(response => {
                    if (response?.responseStatus === 200) {
                        const analyticsTaskId = taskId || 'n/a';
                        const analyticsTaskPromoId = taskPromoId || 'n/a';
                        // eslint-disable-next-line valid-typeof
                        const analyticsState = typeof gameEnded === undefined ? 'n/a' : gameEnded ? 'history' : 'active';

                        enhancedContentPageBindings.fireLinkTrackingAnalytics({
                            actionInfo: 'gamification:joined challenge', //prop55
                            eVar54: `${gameId}:${analyticsTaskId}:${promoId}:${analyticsTaskPromoId}:joined:${analyticsState}`,
                            linkName: 'D=c55'
                        });

                        dispatch(
                            showGameJoinedModal({
                                gameJoinedModalImage,
                                gameJoinedModalTitle,
                                gameJoinedModalDescription,
                                gotItLabel,
                                dispatch
                            })
                        );
                        enhancedContentPageBindings.fireChallengeJoinConfirmationAnalytics(promoId);
                    } else {
                        const isOptInError = response.errors.find(error => error.errorCode === 'LGS_DUPLICATE_OPT_IN');

                        if (response.responseStatus !== 409 && !isOptInError) {
                            onJoinTheChallengeErrorTracking(dispatch, promoId, callback);
                        }
                    }
                })
                .catch(() => {
                    onJoinTheChallengeErrorTracking(dispatch, promoId, callback);
                });
        }
    };

    return onJoinTheChallengeAction;
};

const gameCompletedCTACallback = (gameId, loyaltyId) => () => {
    acknowledgeGameCompletion({ gameId, loyaltyId });
};

const showGameCompletedModal =
    ({
        gameId, gameCompletedModalImage, gameCompletedModalTitle, gameCompletedModalDescription, gotItLabel, promoId
    }) =>
        (dispatch, getState) => {
            const pageType = anaConsts.PAGE_TYPES.GAMIFICATION;
            const pageDetail = 'challenge-completed-confirmation';
            const pageName = `${pageType}:${pageDetail}:n/a:*challenge=${promoId}&task=n/a&state=completed`;
            const eVar54 = `${gameId}:n/a:${promoId}:n/a:completed:n/a`;

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageType,
                    pageDetail,
                    pageName,
                    eVar54
                }
            });

            const loyaltyId = getState().user.beautyInsiderAccount?.biAccountId;

            dispatch(
                showGameInfoModal({
                    isOpen: true,
                    image: gameCompletedModalImage,
                    title: gameCompletedModalTitle,
                    description: gameCompletedModalDescription,
                    ctaLabel: gotItLabel,
                    showConfetti: true,
                    ctaCallback: gameCompletedCTACallback(gameId, loyaltyId)
                })
            );
        };

const handleTaskModalCtaClick = options => {
    return async dispatch => {
        const {
            id,
            promoId,
            modalCopy,
            modalCtaLabel,
            modalImage,
            modalTitle,
            modalCtaDisabled,
            modalCtaAction,
            modalStatus,
            joinTheChallengeCtaLabel,
            joinTheChallengeCtaEnabled,
            showJoinCta,
            gameEnded,
            localization,
            features,
            setTaskDetailCTAAnalytics,
            fireTaskDetailAnalytics,
            gameIsCompleted,
            onJoinButtonClick
        } = options;

        let customModalStatus;

        if (!!features && features.some(feature => feature.handlerType === GAMIFICATION_DYNAMIC_MODAL_STATUS_TIER_MIGRATION)) {
            if (!showJoinCta && !gameEnded && modalStatus && !userUtils.isAnonymous()) {
                const biAccountId = userUtils.getBiAccountId();
                let summary;
                try {
                    summary = await getDetailedClientSummary(biAccountId);
                } catch (e) {
                    summary = null;
                }
                customModalStatus = gamificationUtils.buildTierMigrateCustomModalStatus(gameIsCompleted, modalStatus, localization, summary);
            }
        }

        dispatch(
            showGameInfoModal({
                isOpen: true,
                copy: modalCopy,
                modalStatus: customModalStatus,
                image: modalImage,
                title: modalTitle,
                ctaLabel: showJoinCta ? joinTheChallengeCtaLabel : modalCtaLabel,
                ctaDisabled: showJoinCta ? !joinTheChallengeCtaEnabled : modalCtaDisabled,
                ctaAction: showJoinCta ? undefined : modalCtaAction,
                ctaCallback: () =>
                    handleTaskCtaCallback(
                        id,
                        promoId,
                        modalCtaLabel,
                        setTaskDetailCTAAnalytics,
                        showJoinCta,
                        onJoinButtonClick,
                        fireTaskDetailAnalytics
                    )
            })
        );

        dispatch(fireTaskDetailAnalytics(promoId));
    };
};
const handleTaskCtaCallback = (
    taskId,
    promoId,
    modalCtaLabel,
    setTaskDetailCTAAnalytics,
    showJoinCta,
    onJoinButtonClick,
    fireTaskDetailAnalytics
) => {
    if (showJoinCta) {
        onJoinButtonClick({ taskId: taskId, taskPromoId: promoId });
    } else {
        setTaskDetailCTAAnalytics({ taskPromoId: promoId, linkName: modalCtaLabel });
        fireTaskDetailAnalytics(promoId, true);
    }
};

export default {
    onJoinTheChallenge,
    showGameCompletedModal,
    handleTaskModalCtaClick
};
