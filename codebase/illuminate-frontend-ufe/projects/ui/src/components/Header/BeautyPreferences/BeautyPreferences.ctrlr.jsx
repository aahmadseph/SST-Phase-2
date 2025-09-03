/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import auth from 'Authentication';
import deepEqual from 'deep-equal';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import beautyUtils from 'utils/BeautyPreferences';
import userUtils from 'utils/User';
import { wrapComponent } from 'utils/framework';
import mediaUtils from 'utils/Media';
import JSConfetti from 'thirdparty/confetti';
import { breakpoints } from 'style/config';
import {
    profileCategories,
    PREFERENCE_TYPES,
    CONFETTI_MOMENT_ONE_REQUIRED_TRAITS,
    CONFETTI_MOMENT_TWO_WAIT_MS,
    ACCEPTABLE_ANSWERED_TRAITS_CAROUSEL,
    CAROUSEL_ONE_TRAITS,
    CAROUSEL_REQUIRED_TRAITS,
    notSureOption,
    noPreferenceOptions
} from 'constants/beautyPreferences';
import Empty from 'constants/empty';
import {
    Container, Divider, Flex, Link, Button
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import ProfileCompletionStatus from 'components/Header/BeautyPreferences/ProfileCompletionStatus';
import BeautyProfileHeading from 'components/Header/BeautyPreferences/BeautyProfileHeading';
import TiledProfileContent from 'components/Header/BeautyPreferences/TiledProfileContent';
import SearchableProfileContent from 'components/Header/BeautyPreferences/SearchableProfileContent';
import RedirectProfileContent from 'components/Header/BeautyPreferences/RedirectProfileContent';
import ConfettiModalCompleteMessage from 'components/Header/BeautyPreferences/ConfettiModalCompleteMessage';
import ShoppingLinks from 'components/Header/BeautyPreferences/ShoppingLinks';
import PersonalizedPicks from 'components/Header/BeautyPreferences/PersonalizedPicks';
import Debounce from 'utils/Debounce';
import Actions from 'Actions';
import Loader from 'components/Loader/Loader';
import store from 'store/Store';
import gamificationUtils from 'utils/gamificationUtils';
import { QUIZ } from 'constants/gamification';
import { HEADER_VALUE } from 'constants/authentication';

const { compareArrayData } = beautyUtils;
const { Media } = mediaUtils;
const showInterstice = Actions.showInterstice;
const {
    PAGE_NAMES: { BEAUTY_PREFERENCES, MY_SEPHORA }
} = anaConsts;
const { completeQuizEvent } = gamificationUtils;

class BeautyPreferences extends BaseClass {
    state = {
        beautyPreferences: {
            skinTone: [],
            skinConcerns: [],
            ageRange: [],
            skinType: [],
            hairConcerns: [],
            hairType: [],
            hairColor: [],
            eyeColor: [],
            shoppingPreferences: [],
            ingredientPreferences: [],
            colorIQ: [],
            favoriteBrands: [],
            fragranceFamily: []
        },
        refinements: [],
        lastPref: null,
        hasUnlockedPicks: false,
        hasAnsweredAllPrefs: false,
        hasPendingPrefsAfterSignIn: null,
        isLoading: false,
        haveLabDescriptionsBeenFetched: false
    };

    jsConfetti = undefined;

    confettiOneTraitsCompleted = beautyPreferences => {
        const beautyPrefs = beautyPreferences || this.state.beautyPreferences;
        let beautyTraitsCompleted = 0;

        for (const key of CONFETTI_MOMENT_ONE_REQUIRED_TRAITS) {
            const len = beautyPrefs[key]?.length || 0;

            if (len > 0) {
                beautyTraitsCompleted++;
            }
        }

        return beautyTraitsCompleted;
    };

    completeQuizEventBeautyPreferences = () => {
        if (Sephora.configurationSettings.isGamificationEnabled && Sephora.configurationSettings.isGamificationEntryPointsEnabled) {
            completeQuizEvent(QUIZ.COMPLETE_BEAUTY_PREFERENCES);
        }
    };

    carouselTraitsCompleted = beautyPreferences => {
        const beautyPrefs = beautyPreferences || this.state.beautyPreferences;
        let beautyTraitsCompleted = 0;

        for (const key of CAROUSEL_REQUIRED_TRAITS) {
            const len = beautyPrefs[key]?.length || 0;

            if (len > 0) {
                beautyTraitsCompleted++;
            }
        }

        return beautyTraitsCompleted;
    };

    displayConfettiMomentOne = (name, nextCatType) => {
        const beautyTraitsCompleted = this.confettiOneTraitsCompleted();
        const isAllConfettiOneTraitsCompleted = beautyTraitsCompleted === CONFETTI_MOMENT_ONE_REQUIRED_TRAITS.length;

        if (isAllConfettiOneTraitsCompleted) {
            const { confettiModalTitle, confettiModalMessage, confettiModalButton, fireAnalyticsDataOverwrites } = this.props;

            this.showConfettiInfoModal(confettiModalTitle, confettiModalMessage, confettiModalButton);

            this.showConfetti();

            this.setState({ hasUnlockedPicks: true });

            const categoryName = profileCategories.find(item => item.type === nextCatType)?.name;
            const previousPageName = `${MY_SEPHORA}:accordion:${name}:*`;
            digitalData.page.attributes.previousPageData.pageName = previousPageName;

            // s.tl call overwrites
            fireAnalyticsDataOverwrites({
                actionInfo: `${MY_SEPHORA}:completion milestone 1`, // prop55
                previousPageName, // c6
                pageName: `${MY_SEPHORA}:accordion:${categoryName}:*`,
                pageType: MY_SEPHORA,
                pageDetail: 'accordion',
                world: name
            });
        }
    };

    displayConfettiMomentTwo = name => {
        const { fireAnalyticsDataOverwrites, confettiModalButton } = this.props;

        this.showConfettiInfoModal(null, <ConfettiModalCompleteMessage />, confettiModalButton);

        setTimeout(this.showConfetti, CONFETTI_MOMENT_TWO_WAIT_MS);

        this.completeQuizEventBeautyPreferences();

        // s.tl call overwrites
        fireAnalyticsDataOverwrites({
            actionInfo: `${MY_SEPHORA}:completion milestone 2`, // prop55
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName, // c6
            pageType: MY_SEPHORA,
            pageDetail: 'accordion',
            world: name
        });
    };

    getBeautyProfileContent = refinement => {
        const refinementKey = refinement.key || refinement.type;
        const selectedOptions = this.state.beautyPreferences[refinementKey] || [];
        const selectedData = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];

        return refinement.isRedirect ? (
            <RedirectProfileContent beautyPreferences={this.state.beautyPreferences} />
        ) : refinement.openModal ? (
            <SearchableProfileContent
                beautyPreferences={this.state.beautyPreferences}
                refinement={refinement}
                selectedOptions={selectedData}
                setBeautyPreferencesState={this.setBeautyPreferencesState}
                setSearchableBeautyPreferencesState={this.setSearchableBeautyPreferencesState}
            />
        ) : (
            <TiledProfileContent
                refinement={refinement}
                selectedOptions={selectedData}
                setBeautyPreferencesState={this.setBeautyPreferencesState}
            />
        );
    };

    handleClick = (item, name) => {
        const { setExpandedPreference, fireAnalytics, openAccordion } = this.props;
        const expanded = this.isExpanded(item);

        if (!expanded) {
            openAccordion({ accordionName: name });
            fireAnalytics(name, false, true);
        }

        setExpandedPreference(expanded ? '' : item);
    };

    isExpanded = item => {
        return this.props.expandedPreference === item;
    };

    proceedFurther = (category, nextCat) => {
        const nextCategory = category === nextCat ? '' : nextCat;
        this.props.setExpandedPreference(nextCategory);
    };

    renderBeautyPrefActions = (profileCategory, nextCatType) => {
        const { user, beautyPreferences } = this.props;
        const { canSkip, isRedirect, name, type } = profileCategory;
        const isColorIQ = type === PREFERENCE_TYPES.COLOR_IQ;
        const showSkipThisQues = canSkip && (!isColorIQ || (isColorIQ && beautyPreferences[type]?.length <= 0));

        return (
            <Flex
                justifyContent='center'
                columnGap={5}
                marginTop={!isColorIQ ? 4 : null}
                marginBottom={[4, 4, isColorIQ ? '20px' : 5]}
            >
                {showSkipThisQues && (
                    <Link
                        alignSelf='center'
                        color='blue'
                        onClick={() => {
                            this.skipToNextQuestion(type, nextCatType, name);
                        }}
                        children={this.props.skipThisQues}
                    />
                )}
                {user?.isInitialized &&
                    (user.profileId
                        ? userUtils.isBI()
                            ? this.renderSaveAndContinue(profileCategory, nextCatType, name)
                            : this.renderBISignUpToSave(type, isRedirect, name)
                        : this.renderSignInToSave(type, isRedirect))}
            </Flex>
        );
    };

    renderBeautyProfile = refinements => {
        const {
            beautyPreferences, isAllAnswered, allUnansweredPrefs, getNextUnansweredQuestion, expandedPreference
        } = this.props;

        return (
            refinements?.length > 0 &&
            refinements.map((refinement, index) => {
                const refinementKey = refinement.key;

                if (!refinementKey) {
                    return null;
                }

                const nextCat = getNextUnansweredQuestion(index, refinements, isAllAnswered, allUnansweredPrefs);
                const expanded = this.isExpanded(refinementKey);
                const isExpanded =
                    refinementKey === PREFERENCE_TYPES.COLOR_IQ && beautyPreferences[PREFERENCE_TYPES.COLOR_IQ]?.length ? false : expanded;

                return (
                    <div
                        key={refinementKey}
                        role='group'
                    >
                        {index === 0 && <Divider />}
                        <BeautyProfileHeading
                            beautyPreferences={beautyPreferences}
                            refinement={refinement}
                            expanded={expanded}
                            handleClick={this.handleClick}
                        />
                        {expandedPreference === refinementKey && (
                            <>
                                {this.getBeautyProfileContent(refinement)}
                                {this.renderBeautyPrefActions(refinement, nextCat)}
                            </>
                        )}
                        <ShoppingLinks
                            beautyPreferences={beautyPreferences}
                            category={refinement}
                            isExpanded={isExpanded}
                        />
                        <Divider />
                    </div>
                );
            })
        );
    };

    renderSaveAndContinue = (currentProfileCat, nextCatType, categoryName) => {
        const { beautyPreferences, hasUnlockedPicks, lastPref, hasPendingPrefsAfterSignIn } = this.state;
        const {
            updateBeautyPreferences,
            fireAnalytics,
            save,
            saveAndContinue,
            isAllAnswered,
            allUnansweredPrefs,
            isLastUnansweredIndex,
            user,
            apiErrorModalTitle,
            apiErrorModalMessage,
            errorButtonText
        } = this.props;
        const { type, name, isRedirect, singleSelect } = currentProfileCat;
        const isLastPref = isLastUnansweredIndex(type, isAllAnswered, allUnansweredPrefs);
        const selectedOptions = beautyPreferences[type] || (singleSelect ? '' : []);
        const buttonText = isAllAnswered || isLastPref ? save : saveAndContinue;
        const totalTraits = this.carouselTraitsCompleted();
        const shouldUpdateCarousel = ACCEPTABLE_ANSWERED_TRAITS_CAROUSEL.indexOf(totalTraits) > -1 && CAROUSEL_REQUIRED_TRAITS.indexOf(type) > -1;
        const isMatched = compareArrayData(beautyPreferences[type] || Empty.Array, this.props.beautyPreferences[type] || Empty.Array);
        const isEmptyAnswer = !(beautyPreferences[type] || Empty.Array)?.length;

        const callback = () => {
            this.proceedFurther(type, isLastPref ? '' : nextCatType);
            fireAnalytics(name, isLastPref, false, 'saveButton', nextCatType);
            !hasUnlockedPicks && !isLastPref && this.displayConfettiMomentOne(name, nextCatType);
            isLastPref && !isEmptyAnswer && this.displayConfettiMomentTwo(lastPref);
            shouldUpdateCarousel && this.triggerPersonalizedPicks(categoryName);

            const newState = {};

            if (isLastPref) {
                newState.lastPref = name;
            }

            if (hasPendingPrefsAfterSignIn) {
                newState.hasPendingPrefsAfterSignIn = null;
            }

            this.setState(newState);
        };

        // Wrap the handleSaveClick function with the preventDoubleClick function
        const DEBOUNCE_DELAY = 5000;
        const { isLoading } = this.state;
        const handleSaveClick = Debounce.preventDoubleClick(async ({ saveOnly }) => {
            // Bail out if still loading prev api call
            if (isLoading) {
                return;
            }

            this.props.saveAndContinueClick({
                beautyPreferences,
                selectedAccordionName: currentProfileCat.name,
                selectedAccordionValue: selectedOptions,
                saveOnly
            });

            try {
                this.setState({ isLoading: true });
                store.dispatch(showInterstice(true));
                await updateBeautyPreferences(
                    currentProfileCat,
                    user.profileId,
                    selectedOptions,
                    beautyPreferences,
                    callback,
                    apiErrorModalTitle,
                    apiErrorModalMessage,
                    errorButtonText
                );
            } catch (error) {
                Sephora.logger.verbose('[Error saving beauty preference]: ', error);
            } finally {
                this.setState({ isLoading: false });
                store.dispatch(showInterstice(false));
            }
        }, DEBOUNCE_DELAY);

        return !isRedirect ? (
            <>
                <Media at='xs'>
                    <Button
                        variant='primary'
                        disabled={isMatched || isLoading}
                        onClick={() => {
                            if (!isLoading) {
                                handleSaveClick({ saveOnly: isAllAnswered || isLastPref });
                            }
                        }}
                        size='sm'
                        width={isLastPref ? '120' : '140'}
                    >
                        {buttonText}
                    </Button>
                </Media>
                <Media greaterThan='xs'>
                    <Button
                        variant='primary'
                        disabled={isMatched || isLoading}
                        onClick={() => {
                            if (!isLoading) {
                                handleSaveClick({ saveOnly: isAllAnswered || isLastPref });
                            }
                        }}
                        width='174'
                    >
                        {buttonText}
                    </Button>
                </Media>
            </>
        ) : (
            isLoading && (
                <Loader
                    isShown={true}
                    isFixed={true}
                />
            )
        );
    };

    renderSignInToSave = (type, isRedirect) => {
        const { isAllAnswered, allUnansweredPrefs, isLastUnansweredIndex, expandedPreference } = this.props;
        const isLastPref = isLastUnansweredIndex(type, isAllAnswered, allUnansweredPrefs);
        const isSelected = this.state.beautyPreferences[type].length > 0;
        const selectedPrefs = isSelected ? this.state.beautyPreferences[type] : null;

        return (
            !isRedirect && (
                <>
                    <Media at='xs'>
                        <Button
                            variant='primary'
                            disabled={!isSelected}
                            onClick={() => this.signInHandler(expandedPreference, selectedPrefs)}
                            size='sm'
                            width={isLastPref ? '120' : '140'}
                        >
                            {this.props.signIn}
                        </Button>
                    </Media>
                    <Media greaterThan='xs'>
                        <Button
                            variant='primary'
                            disabled={!isSelected}
                            onClick={() => this.signInHandler(expandedPreference, selectedPrefs)}
                            width='174'
                        >
                            {this.props.signIn}
                        </Button>
                    </Media>
                </>
            )
        );
    };

    renderBISignUpToSave = (type, isRedirect) => {
        const { biSignIn, openRegisterBIModal } = this.props;
        const isSelected = this.state.beautyPreferences && this.state.beautyPreferences[type].length > 0;

        return (
            !isRedirect && (
                <>
                    <Media at='xs'>
                        <Button
                            variant='primary'
                            disabled={!isSelected}
                            onClick={openRegisterBIModal}
                            size='sm'
                            width='197'
                        >
                            {biSignIn}
                        </Button>
                    </Media>
                    <Media greaterThan='xs'>
                        <Button
                            variant='primary'
                            disabled={!isSelected}
                            onClick={openRegisterBIModal}
                            width='222'
                        >
                            {biSignIn}
                        </Button>
                    </Media>
                </>
            )
        );
    };

    setBeautyPreferencesState = (refinementKey, singleSelect, selectedRefinemenItemKey) => {
        let currentRefinement;

        currentRefinement = [...this.state.beautyPreferences[refinementKey]] || [];
        const isSelected = currentRefinement.some(item => item === selectedRefinemenItemKey);

        if (isSelected) {
            currentRefinement = singleSelect ? [] : currentRefinement.filter(itemKey => itemKey !== selectedRefinemenItemKey);
        } else {
            if (singleSelect) {
                currentRefinement = [selectedRefinemenItemKey];
            } else {
                const isNotSureItemSelected = currentRefinement.find(itemKey => itemKey.includes(notSureOption));
                const isNotPreferenceItemSelected = currentRefinement.find(itemKey => noPreferenceOptions.some(option => option.includes(itemKey)));
                const userIsSelectingNotSureNotPreferenceItem =
                    selectedRefinemenItemKey.includes(notSureOption) || noPreferenceOptions.some(option => option.includes(selectedRefinemenItemKey));

                if ((isNotSureItemSelected || isNotPreferenceItemSelected) && !userIsSelectingNotSureNotPreferenceItem) {
                    currentRefinement = currentRefinement.filter(
                        itemKey => !itemKey.includes(notSureOption) && !noPreferenceOptions.some(option => option.includes(itemKey))
                    );
                } else if (userIsSelectingNotSureNotPreferenceItem) {
                    currentRefinement = [];
                }

                currentRefinement.push(selectedRefinemenItemKey);
            }
        }

        return this.setState(prevState => ({
            beautyPreferences: {
                ...prevState.beautyPreferences,
                [refinementKey]: currentRefinement
            },
            ...(prevState.hasPendingPrefsAfterSignIn && { hasPendingPrefsAfterSignIn: { [refinementKey]: currentRefinement } })
        }));
    };

    setPageLoadAnalytics() {
        digitalData.page.category.pageType = MY_SEPHORA;
        digitalData.page.pageInfo.pageName = BEAUTY_PREFERENCES;
    }

    setSearchableBeautyPreferencesState = (refinementKey, refinementItemsKeys) => {
        const currentItemsKeys = refinementItemsKeys.filter(itemKey => !noPreferenceOptions.some(option => option.includes(itemKey)));

        return this.setState(prevState => ({
            beautyPreferences: {
                ...prevState.beautyPreferences,
                [refinementKey]: currentItemsKeys
            },
            ...(prevState.hasPendingPrefsAfterSignIn && { hasPendingPrefsAfterSignIn: { [refinementKey]: currentItemsKeys } })
        }));
    };

    showConfettiInfoModal = (title = '', message = '', buttonText = '', callback = null) => {
        const options = {
            isOpen: true,
            title,
            message,
            buttonText,
            buttonWidth: 165,
            footerDisplay: 'flex',
            footerJustifyContent: 'flex-end',
            bodyFooterPaddingX: 4,
            callback,
            cancelCallback: callback
        };

        this.props.showInfoModal(options);
    };

    showConfetti = () => {
        const isMobile = Sephora.isMobile() || window.matchMedia(breakpoints.xsMax).matches;

        const config = {
            emojis: ['💄', '✨', '🎉', '❤️', '🛍️'],
            emojiSize: isMobile ? 55 : 44,
            confettiNumber: 100,
            confettiRadius: 6
        };

        this.jsConfetti.addConfetti(config);
    };

    signInHandler = (expandedPreference, selectedPrefs) => {
        this.props.signInToSaveClick();

        return auth
            .requireAuthentication(
                undefined,
                undefined,
                { linkData: `${MY_SEPHORA}:${BEAUTY_PREFERENCES}:signin` },
                null,
                false,
                HEADER_VALUE.USER_CLICK
            )
            .then(() => {
                const userPrefs = this.props.beautyPreferences[expandedPreference];
                const isPrefsArray = Array.isArray(selectedPrefs);
                const selectedPrefsMergedWithUserPrefs = isPrefsArray ? [...new Set([...userPrefs, ...selectedPrefs])] : selectedPrefs;

                this.setState({ hasPendingPrefsAfterSignIn: { [expandedPreference]: selectedPrefsMergedWithUserPrefs } });
                this.props.setExpandedPreference(selectedPrefs ? expandedPreference : 'skinType');
            })
            .catch(() => {});
    };

    skipToNextQuestion = (category, nextCat, name) => {
        this.proceedFurther(category, nextCat);
        this.props.fireAnalytics(name, false, false, 'skipButton', nextCat);
        this.props.skipThisQuestionClick({ accordionName: name });
    };

    triggerPersonalizedPicks = categoryName => {
        const { fireAnalyticsDataOverwrites } = this.props;

        const previousPageName = `${MY_SEPHORA}:accordion:${categoryName}:*`;
        digitalData.page.attributes.previousPageData.pageName = previousPageName;

        if (this.carouselTraitsCompleted() === CAROUSEL_ONE_TRAITS) {
            fireAnalyticsDataOverwrites({
                actionInfo: `${MY_SEPHORA}:completion milestone 0`, // prop55
                previousPageName
            });
        }
    };

    openPrivacySettings = () => {
        const {
            beautyPreferences, privacySettings, openPrivacySettingsModal, socialProfile, closePrivacySettingsModal
        } = this.props;
        openPrivacySettingsModal(privacySettings, beautyPreferences, socialProfile, closePrivacySettingsModal);
    };

    userBeautyPreferences = (isUserBeautyPrefsKeysPresent, beautyPreferences, userBeautyTraitsCompleted) => {
        const { getNextUnansweredQuestion, setExpandedPreference, isFavoriteBrandsSpoke } = this.props;

        if (isUserBeautyPrefsKeysPresent) {
            const getPrevAsweredIndex = profileCategories.map(({ type }) => beautyPreferences[type])?.findIndex(val => !val?.length) - 1;
            const isAllAnsweredFromApi = Object.values(beautyPreferences).every(el => el.length);
            const allUnansweredPrefsFromApi = Object.keys(beautyPreferences).filter(key => !beautyPreferences[key]?.length);

            const nextCat = getNextUnansweredQuestion(getPrevAsweredIndex, profileCategories, isAllAnsweredFromApi, allUnansweredPrefsFromApi);
            setExpandedPreference(isFavoriteBrandsSpoke ? PREFERENCE_TYPES.FAVORITE_BRANDS : isAllAnsweredFromApi ? '' : nextCat);

            const isAllConfettiOneTraitsCompleted = userBeautyTraitsCompleted === CONFETTI_MOMENT_ONE_REQUIRED_TRAITS.length;
            this.setState({ hasUnlockedPicks: isAllConfettiOneTraitsCompleted });
        }
    };

    componentDidMount() {
        const {
            beautyPreferences, fetchGroupedBrandsList, isFavoriteBrandsSpoke, setExpandedPreference, isAllAnswered
        } = this.props;

        this.setPageLoadAnalytics();
        anaUtils.setNextPageData({ isMySephoraPage: true });
        const refinements = beautyUtils.getDynamicRefinements() || [];

        this.setState({ beautyPreferences, refinements });

        // load jsConfetti
        this.jsConfetti = new JSConfetti();

        // load brands
        fetchGroupedBrandsList();

        if (isFavoriteBrandsSpoke) {
            setExpandedPreference(PREFERENCE_TYPES.FAVORITE_BRANDS);
        }

        if (isAllAnswered) {
            this.completeQuizEventBeautyPreferences();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            beautyPreferences,
            setInitialBeautyPreferences,
            user,
            isAllAnswered,
            fetchColorIQLabDescriptions,
            isColorIQLastAnsweredTrait,
            setIsColorIQLastAnsweredTrait,
            brandNames,
            setFilteredOutUserFavoriteBrandIDs
        } = this.props;
        const isBI = userUtils.isBI();
        const isSignedIn = isBI && user?.profileId;
        const beautyPreferencesChanged = !deepEqual(prevProps.beautyPreferences, beautyPreferences);
        const colorIQWithHexAndDescription = beautyPreferences?.colorIQ.some(colorIQValue => !!colorIQValue.hexCode && !!colorIQValue.description);

        if (isSignedIn && beautyPreferences && !deepEqual(prevProps.beautyPreferences, beautyPreferences)) {
            const userBeautyTraitsCompleted = this.confettiOneTraitsCompleted(beautyPreferences);
            setInitialBeautyPreferences(beautyPreferences);

            const isUserBeautyPrefsKeysPresent = Object.keys(beautyPreferences).length;
            this.userBeautyPreferences(isUserBeautyPrefsKeysPresent, beautyPreferences, userBeautyTraitsCompleted);
        }

        if (
            isSignedIn &&
            brandNames &&
            prevProps.brandNames !== brandNames &&
            Object.keys(brandNames).length > 0 &&
            beautyPreferences[PREFERENCE_TYPES.FAVORITE_BRANDS].length > 0 &&
            prevProps.beautyPreferences[PREFERENCE_TYPES.FAVORITE_BRANDS] !== beautyPreferences[PREFERENCE_TYPES.FAVORITE_BRANDS]
        ) {
            setFilteredOutUserFavoriteBrandIDs(beautyPreferences, brandNames);
        }

        if ((beautyPreferencesChanged && beautyPreferences.length > 0) || (beautyPreferencesChanged && !colorIQWithHexAndDescription)) {
            fetchColorIQLabDescriptions(beautyPreferences);
        }

        if (isColorIQLastAnsweredTrait) {
            this.displayConfettiMomentTwo(PREFERENCE_TYPES.COLOR_IQ);
            setIsColorIQLastAnsweredTrait(false);
        }

        if (prevProps?.beautyPreferences !== beautyPreferences) {
            this.setState(prevState => ({
                beautyPreferences: {
                    ...beautyPreferences,
                    ...(prevState.hasPendingPrefsAfterSignIn && prevState.hasPendingPrefsAfterSignIn)
                },
                hasAnsweredAllPrefs: isAllAnswered
            }));
        }

        if (brandNames && prevProps?.brandNames !== brandNames) {
            setFilteredOutUserFavoriteBrandIDs(beautyPreferences, brandNames);
        }

        if (prevProps.isAllAnswered !== isAllAnswered) {
            this.completeQuizEventBeautyPreferences();
        }
    }

    render() {
        const { beautyPreferences, privacySettings, isAtLeastOneAnswered, refinements } = this.props;
        const showPrivacySettings = userUtils.isSocial() && isAtLeastOneAnswered;

        return (
            <Container>
                <ProfileCompletionStatus
                    hasAnsweredAllPrefs={this.state.hasAnsweredAllPrefs}
                    openPrivacySettings={this.openPrivacySettings}
                    showPrivacySettings={showPrivacySettings}
                    privacySettings={privacySettings}
                />
                {this.renderBeautyProfile(refinements)}
                <PersonalizedPicks
                    carouselTraitsCompleted={this.carouselTraitsCompleted(beautyPreferences)}
                    beautyPreferences={beautyPreferences}
                />
                {showPrivacySettings && (
                    <Media at='xs'>
                        <Link
                            alignSelf='center'
                            color='blue'
                            onClick={this.openPrivacySettings}
                            display='block'
                            marginTop={6}
                            marginX='auto'
                            children={privacySettings}
                        />
                    </Media>
                )}
            </Container>
        );
    }
}

export default wrapComponent(BeautyPreferences, 'BeautyPreferences', true);
