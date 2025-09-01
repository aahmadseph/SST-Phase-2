/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Container } from 'components/ui';
import BaseClass from 'components/BaseClass';
import WorldHeader from 'components/BeautyPreferencesWorld/WorldHeader/WorldHeader';
import WorldRefinements from 'components/BeautyPreferencesWorld/WorldRefinements/WorldRefinements';
import urlUtils from 'utils/Url';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import { breakpoints } from 'style/config';
import RecommendationsCarousel from 'components/RecommendationsCarousel/RecommendationsCarousel';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesRedesigned/locales', 'BeautyPreferencesRedesigned');
import deepEqual from 'deep-equal';
import JSConfetti from 'thirdparty/confetti';
import Actions from 'Actions';
import store from 'store/Store';
import { CONFETTI_MOMENT_TWO_WAIT_MS } from 'constants/beautyPreferences';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { fontSizes } from 'style/config';

class BeautyPreferencesWorld extends BaseClass {
    state = {
        worldInfo: null,
        refinementOpened: null,
        worldRefinements: null
    };

    fetchProductRecommendations = () => {
        const { worldInfo } = this.state;

        const preFilterExpression = bpRedesignedUtils.mapBeautyPreferencesToRecsServiceValues(
            this.props.customerPreference?.[worldInfo?.key],
            worldInfo?.key
        );

        const payload = {
            worldKey: worldInfo?.key,
            numResults: 10 // Default number of results
        };

        this.props.fetchRecommendations({ ...payload, preFilterExpression });
    };

    componentDidMount() {
        this.loadWorldInfo();
        bpRedesignedUtils.executeWhenMasterListLoaded(() => {
            this.loadWorldInfo();
        });
        this.fetchColorIQLabDescriptionsIfNeeded();
        // Initialize confetti on a top-layer canvas so it renders above modal overlay
        this.createConfettiCanvas();
    }

    componentWillUnmount() {
        // Clean up the confetti canvas to avoid leaks when navigating away
        if (this.confettiCanvas?.parentNode) {
            this.confettiCanvas.parentNode.removeChild(this.confettiCanvas);
        }

        this.confettiCanvas = null;
        this.jsConfetti = null;
    }

    componentDidUpdate(prevProps) {
        // If colorIQ data changed, fetch lab descriptions
        if (prevProps.colorIQ !== this.props.colorIQ) {
            this.fetchColorIQLabDescriptionsIfNeeded();
        }

        if (!deepEqual(prevProps.customerPreference, this.props.customerPreference)) {
            this.fetchProductRecommendations();
        }
    }

    loadWorldInfo = () => {
        const navigatedWorldKey = urlUtils.getUrlLastFragment();
        const worldInfo = bpRedesignedUtils.getBeautyPreferencesWorldPageInfo(navigatedWorldKey);
        const { recommendations } = this.props;
        const currentPodId = `beautypreferences-${worldInfo?.key?.toLowerCase()}`;

        if (!worldInfo) {
            urlUtils.redirectTo('/profile/BeautyPreferences');
        } else {
            const worldRefinements = worldInfo.refinements;
            this.setState({ worldInfo, worldRefinements }, () => {
                // Find the first unfilled refinement and open it
                this.openFirstUnfilledRefinement();

                // Check if recommendations are already set on first page load
                if (this.props.customerPreference && (!recommendations || !recommendations[currentPodId])) {
                    this.fetchProductRecommendations();
                }
            });
        }
    };

    fetchColorIQLabDescriptionsIfNeeded = () => {
        const { colorIQ, fetchColorIQLabDescriptions } = this.props;

        if (colorIQ && Array.isArray(colorIQ) && colorIQ.length > 0) {
            // Check if any Color IQ entries are missing descriptions (raw data)
            const hasRawData = colorIQ.some(item => item.labValue && !item.description);

            if (hasRawData) {
                fetchColorIQLabDescriptions(colorIQ);
            }
        }
    };

    openFirstUnfilledRefinement = () => {
        const refinements = this.state.worldRefinements;

        if (!Array.isArray(refinements) || refinements.length === 0) {
            return;
        }

        // Find the first refinement that doesn't have customer preferences
        const firstUnfilledRefinement = refinements.find(refinement => !this.isRefinementOnCustomerPreference(refinement.key));

        if (firstUnfilledRefinement) {
            this.setState({ refinementOpened: firstUnfilledRefinement.key });
        } else {
            // If all refinements are filled, don't open any
            this.setState({ refinementOpened: null });
        }
    };

    toggleRefinementOpened = refinementKey => {
        if (refinementKey === this.state.refinementOpened) {
            this.setState({ refinementOpened: null });
        } else {
            this.setState({ refinementOpened: refinementKey });
        }
    };

    //Recursion function to find next unsaved refinement ends when refinement comes to be the same from the beginning
    openNextUnfilledRefinement = (refinementKey, initialRefinementKey) => {
        const nextRefinement = this.findNextRefinement(refinementKey);

        if (!nextRefinement) {
            return null;
        }

        if (refinementKey === initialRefinementKey) {
            const initialRefinement = this.state.worldRefinements?.find(refinement => refinement.key === refinementKey);

            if (initialRefinement && !this.isRefinementOnCustomerPreference(initialRefinement.key)) {
                return this.setState({ refinementOpened: initialRefinement.key });
            }

            return this.setState({ refinementOpened: null });
        }

        if (this.isRefinementOnCustomerPreference(nextRefinement.key)) {
            return this.openNextUnfilledRefinement(nextRefinement.key, initialRefinementKey ?? refinementKey);
        } else {
            return this.setState({ refinementOpened: nextRefinement.key });
        }
    };

    findNextRefinement = currentRefinementKey => {
        const refinements = this.state.worldRefinements;

        if (!Array.isArray(refinements) || refinements.length === 0) {
            return null;
        }

        const index = refinements.findIndex(r => r.key === currentRefinementKey);

        if (index < 0) {
            return null;
        }

        const nextIndex = (index + 1) % refinements.length;

        return refinements[nextIndex];
    };

    isRefinementOnCustomerPreference = refinementKey => {
        return bpRedesignedUtils.isRefinementPresentOnCustomerPreference(this.state.worldInfo?.key, refinementKey);
    };

    isSmallView = () => {
        return window?.matchMedia(breakpoints.smMax).matches;
    };

    showConfettiInfoModal = (title = '', message = '', buttonText = '', callback = null) => {
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title,
                message,
                buttonText,
                buttonWidth: '100%',
                footerDisplay: 'flex',
                footerJustifyContent: 'flex-end',
                bodyFooterPaddingX: 4,
                callback,
                cancelCallback: callback
            })
        );
    };

    createConfettiCanvas = () => {
        if (this.jsConfetti && this.confettiCanvas) {
            return;
        }

        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            // Ensure this canvas sits above any modal overlays otherwise confetti doesnt show like we want!
            zIndex: '99999'
        });
        document.body.appendChild(canvas);

        this.confettiCanvas = canvas;
        this.jsConfetti = new JSConfetti({ canvas });
    };

    showConfetti = () => {
        // Recreate canvas if needed
        if (!this.jsConfetti || !this.confettiCanvas?.isConnected) {
            this.createConfettiCanvas();
        }

        const isMobile = window.matchMedia(breakpoints.smMax).matches;
        this.jsConfetti?.addConfetti({
            emojis: ['💄', '✨', '🎉', '❤️', '🛍️'],
            emojiSize: isMobile ? 55 : 44,
            confettiNumber: 100,
            confettiRadius: 6
        });
    };

    // Show modal but text varies: (single world vs all worlds complete)
    displayConfettiMoment = (isAllWorldsComplete = false) => {
        // If isAllWorldsComplete === false -> SINGLE WORLD COMPLETE modal:
        //   title: confettiModalTitleOneWorld
        //   body:  confettiModalMessageOneWorld
        // If isAllWorldsComplete === true  -> ALL WORLDS COMPLETE modal:
        //   title: confettiModalTitleAllWords
        //   body:  confettiModalMessageAllWords
        const title = isAllWorldsComplete ? getText('confettiModalTitleAllWords') : getText('confettiModalTitleOneWorld');
        const message = isAllWorldsComplete ? getText('confettiModalMessageAllWords') : getText('confettiModalMessageOneWorld');
        const cta = getText('confettiModalButton');

        this.showConfettiInfoModal(title, message, cta);
        setTimeout(() => this.showConfetti(), CONFETTI_MOMENT_TWO_WAIT_MS);
    };

    // Device-scoped confetti
    hasSeenMoment1 = () => !!Storage.local.getItem(LOCAL_STORAGE.CONFETTI_SEEN_MOMENT_1);
    hasSeenMoment2 = () => !!Storage.local.getItem(LOCAL_STORAGE.CONFETTI_SEEN_MOMENT_2);
    markMoment1Seen = () => Storage.local.setItem(LOCAL_STORAGE.CONFETTI_SEEN_MOMENT_1, true);
    markMoment2Seen = () => Storage.local.setItem(LOCAL_STORAGE.CONFETTI_SEEN_MOMENT_2, true);

    /**
     *  Only show confetti 2 times per device
     * 1. One flag for any world that is completed
     *  - (other worlds should check this flag and it it is true, then don't trigger confetti again)
     * 2. One flag for all worlds completion
     */
    conditionallyDisplayConfetti = isAllWorldsComplete => {
        if (isAllWorldsComplete) {
            if (this.hasSeenMoment2()) {
                return;
            }

            this.displayConfettiMoment(true);
            this.markMoment2Seen();

            return;
        }

        // Single-world completion (moment 1)
        if (this.hasSeenMoment1()) {
            return;
        }

        this.displayConfettiMoment(false);
        this.markMoment1Seen();
    };

    onRefinementSave = async ({ refinement, refinementItemsSelected }) => {
        if (!refinement || !Array.isArray(refinementItemsSelected)) {
            throw new Error('No Refinement or selected items received');
        }

        const refinementKey = refinement.key;
        let data = null;

        if (refinement.syncedWorlds?.length) {
            data = refinement.syncedWorlds.map(worldKey => ({
                worldKey,
                refinementKey,
                refinementItemsKeys: refinementItemsSelected
            }));
        } else {
            const worldKey = this.state.worldInfo.key;
            data = [{ worldKey, refinementKey, refinementItemsKeys: refinementItemsSelected }];
        }

        try {
            await this.props.updateCustomerPreference(data);

            const { refinementsCount, completedRefinementsCount } = bpRedesignedUtils.beautyPreferencesWorldProgress(this.state.worldInfo);
            const isLastPref = refinementsCount > 0 && completedRefinementsCount === refinementsCount;
            const isEmptyAnswer = !(refinementItemsSelected?.length > 0);

            // Only trigger when a world is completed (or all worlds) and gate per-device with LS
            if (isLastPref && !isEmptyAnswer) {
                const allWorldsComplete = bpRedesignedUtils.areAllWorldsComplete();
                this.conditionallyDisplayConfetti(allWorldsComplete);
            }

            this.openNextUnfilledRefinement(refinementKey);
        } catch (error) {
            throw error;
        }
    };

    openBIJoinModal = () => {
        this.props.showBiRegisterModal({
            isOpen: true
        });
    };

    render() {
        const isWorldInfoAvailable = !!this.state.worldInfo;
        const { recommendations, isAnonymous } = this.props;

        if (!isWorldInfoAvailable) {
            return null;
        }

        const { refinementsCount, completedRefinementsCount } = bpRedesignedUtils.beautyPreferencesWorldProgress(this.state.worldInfo);
        const worldCustomerPreference = this.props.customerPreference?.[this.state.worldInfo?.key] || {};
        const currentPodId = `beautypreferences-${this.state.worldInfo?.key?.toLowerCase()}`;
        const productRecommendations = recommendations[currentPodId];
        const isAtLeastOneAnsweredForWorld = bpRedesignedUtils.isAtLeastOneAnsweredForWorld(
            this.props?.customerPreference,
            this.state.worldInfo?.key
        );
        const shouldDisplayWorldCarousel = isAtLeastOneAnsweredForWorld && !isAnonymous && productRecommendations?.recommendations?.length > 0;
        const carouselTitleFontSize = this.isSmallView() ? fontSizes.base : fontSizes.lg;

        return (
            <Container>
                <WorldHeader
                    worldName={this.state.worldInfo.value}
                    refinementsCount={refinementsCount}
                    completedRefinementsCount={completedRefinementsCount}
                />
                <WorldRefinements
                    refinements={this.state.worldRefinements}
                    refinementOpened={this.state.refinementOpened}
                    worldCustomerPreference={worldCustomerPreference}
                    worldValue={this.state.worldInfo.value}
                    toggleRefinementOpened={this.toggleRefinementOpened}
                    isSmallView={this.isSmallView()}
                    onRefinementSave={this.onRefinementSave}
                    onRefinementSkip={({ refinement }) => this.openNextUnfilledRefinement(refinement?.key)}
                    biAccount={this.props.biAccount}
                    colorIQ={this.props.colorIQ}
                    isBeautyInsider={this.props.isBIUser}
                    onJoinBeautyInsider={this.openBIJoinModal}
                    isAnonymous={isAnonymous}
                />
                {shouldDisplayWorldCarousel && (
                    <RecommendationsCarousel
                        worldKey={this.state.worldInfo?.key}
                        worldCustomerPreference={worldCustomerPreference}
                        subtitle={getText('bpRedesignSubtitle', [this.state.worldInfo?.key?.toLowerCase()])}
                        marginTop={4}
                        marginBottom={4}
                        customStyles={{ title: { fontSize: carouselTitleFontSize }, subtitle: { fontSize: fontSizes.base } }}
                        recommendations={productRecommendations}
                    />
                )}
            </Container>
        );
    }
}

export default wrapComponent(BeautyPreferencesWorld, 'BeautyPreferencesWorld', true);
