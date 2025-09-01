import React from 'react';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import Actions from 'Actions';
import { Button, Link, Flex } from 'components/ui';
import Modal from 'components/Modal/Modal';
import { SIGNUP_MODAL_REQUIRED_TRAITS, profileCategories, CATEGORY_TYPE } from 'constants/beautyPreferences';
import BeautyProfileHeading from 'components/Header/BeautyPreferences/BeautyProfileHeading';
import TiledProfileContent from 'components/Header/BeautyPreferences/TiledProfileContent';
import BaseClass from 'components/BaseClass';
import urlUtils from 'utils/Url';
import Markdown from 'components/Markdown/Markdown';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import BeautyPreferencesBindings from 'analytics/bindingMethods/pages/beautyPreferences/BeautyPreferencesBindings';
import beautyUtils from 'utils/BeautyPreferences';
import ProfileActions from 'actions/ProfileActions';

class BeautyPreferencesModal extends BaseClass {
    selectedProfileCats = [];
    initialState = {
        skinTone: [],
        skinConcerns: [],
        ageRange: [],
        skinType: [],
        hairConcerns: [],
        hairType: [],
        hairTexture: [],
        hairColor: [],
        eyeColor: [],
        fragrancePreferences: [],
        shoppingPreferences: [],
        ingredientPreferences: []
    };

    state = {
        savedTraits: this.initialState,
        currentProfileCat: SIGNUP_MODAL_REQUIRED_TRAITS[0],
        currentProfileCatIndex: 0
    };

    constructor(props) {
        super(props);
        const refinements = beautyUtils.getDynamicRefinements() || [];
        this.selectedProfileCats = refinements.filter(cat => SIGNUP_MODAL_REQUIRED_TRAITS.indexOf(cat.type) > -1);
    }

    closeSavedModal = () => {
        store.dispatch(
            Actions.showBeautyPreferencesSavedModal({
                isOpen: false
            })
        );
    };

    requestClose = () => {
        const {
            savedTitle, savedMessage1, savedMessage2, savedMessage3, linkText, keepGoing, gotIt, isAtLeastOneAnswered
        } = this.props;
        const cancelCallback = () => {
            this.closeSavedModal();
        };
        const callback = () => {
            this.closeSavedModal();
            const analyticsData = {
                linkData: 'mysephora:bi signup spoke'
            };
            BeautyPreferencesBindings.keepGoing();
            anaUtils.setNextPageData(analyticsData);
            urlUtils.redirectTo('/profile/BeautyPreferences');
        };
        store.dispatch(Actions.showBeautyPreferencesModal({ isOpen: false }));
        isAtLeastOneAnswered &&
            store.dispatch(
                Actions.showBeautyPreferencesSavedModal({
                    isOpen: true,
                    close: cancelCallback,
                    savedTitle,
                    savedMessage1,
                    savedMessage2,
                    savedMessage3,
                    linkText,
                    keepGoing,
                    gotIt,
                    callback,
                    cancelCallback
                })
            );
    };

    saveTraits = () => {
        const { currentProfileCat, currentProfileCatIndex, savedTraits } = this.state;
        const { profileId } = this.props;
        const selectedOptions = savedTraits[currentProfileCat] || [];
        const category = this.selectedProfileCats[currentProfileCatIndex];
        const profileData = { biAccount: { customerPreference: {} }, profileId };

        if (category && category.key && category.syncedWorlds?.length) {
            category.syncedWorlds.forEach(worldKey => {
                profileData.biAccount.customerPreference[worldKey] = { [category.key]: selectedOptions };
            });
        } else if (category && category.key) {
            profileData.biAccount.customerPreference = { [category.worldKey]: { [category.key]: selectedOptions } };
        }

        store.dispatch(
            ProfileActions.updateBiAccount(profileData, () => {
                this.moveToNextQuestion();
            })
        );
    };

    moveToNextQuestion = () => {
        const { currentProfileCatIndex } = this.state;
        const isLastTrait = currentProfileCatIndex === SIGNUP_MODAL_REQUIRED_TRAITS.length - 1;
        const type = 'beauty preference saved';

        if (isLastTrait) {
            this.requestClose();
            this.fireAnalyticsBeautyPreferencesSpoke(type);
        } else {
            const nextIndex = currentProfileCatIndex === this.selectedProfileCats.length - 1 ? 0 : currentProfileCatIndex + 1;
            this.fireAnalyticsBeautyPreferencesSpoke(SIGNUP_MODAL_REQUIRED_TRAITS[nextIndex]);
            this.setState({
                currentProfileCat: this.selectedProfileCats[nextIndex].type,
                currentProfileCatIndex: nextIndex
            });
        }
    };

    moveToPreviousQuestion = () => {
        this.resetToPreviousTraits();
        const { currentProfileCatIndex } = this.state;
        const previousIndex = currentProfileCatIndex - 1;
        this.setState({
            currentProfileCat: this.selectedProfileCats[previousIndex].type,
            currentProfileCatIndex: previousIndex
        });
    };

    skipThisQuestion =
        ({ category }) =>
            () => {
                BeautyPreferencesBindings.skipModalQuestion({ accordionName: category.postSignupCategoryName });
                this.resetToPreviousTraits();
                this.moveToNextQuestion();
            };

    resetToPreviousTraits = () => {
        const { beautyPreferences } = this.props;

        if (beautyPreferences && Object.keys(beautyPreferences).length) {
            this.setState({
                savedTraits: beautyPreferences
            });
        } else {
            this.setState({ savedTraits: this.initialState });
        }
    };

    setBeautyPreferencesState = (profileCategory, singleSelect, profile) => {
        let currentCategory;

        currentCategory = [...this.state.savedTraits[profileCategory]] || [];
        const isSelected = currentCategory.some(item => item === profile);

        if (isSelected) {
            currentCategory = singleSelect ? [] : currentCategory.filter(category => category !== profile);
        } else {
            if (singleSelect) {
                currentCategory = [profile];
            } else {
                if (
                    currentCategory.find(item => item === CATEGORY_TYPE.NOT_SURE || item === CATEGORY_TYPE.NO_PREFERENCE) &&
                    [CATEGORY_TYPE.NOT_SURE, CATEGORY_TYPE.NO_PREFERENCE].indexOf(profile) < 0
                ) {
                    currentCategory = currentCategory.filter(
                        category => category !== CATEGORY_TYPE.NOT_SURE && category !== CATEGORY_TYPE.NO_PREFERENCE
                    );
                } else if (profile === CATEGORY_TYPE.NOT_SURE || profile === CATEGORY_TYPE.NO_PREFERENCE) {
                    currentCategory = [];
                }

                currentCategory.push(profile);
            }
        }

        this.setState({
            savedTraits: {
                ...this.state.savedTraits,
                [profileCategory]: currentCategory
            }
        });
    };

    fireAnalyticsBeautyPreferencesSpoke = type => {
        const { MY_SEPHORA } = anaConsts.PAGE_NAMES;
        const categoryName = profileCategories.find(item => item.type === type)?.postSignupCategoryName || type;
        const spokeText = 'bi signup spoke';

        return processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${MY_SEPHORA}:${spokeText}:${categoryName}:*`,
                pageType: MY_SEPHORA,
                pageDetail: `${spokeText}`,
                world: `${categoryName}`
            }
        });
    };

    componentDidMount() {
        const type = SIGNUP_MODAL_REQUIRED_TRAITS[0];
        this.fireAnalyticsBeautyPreferencesSpoke(type);
    }

    render() {
        const {
            isOpen, modalTitle, modalSubTitle1, modalSubTitle2, next, skipThisQuestion, done
        } = this.props;

        const { currentProfileCat, currentProfileCatIndex, savedTraits } = this.state;

        const isFirstTrait = currentProfileCatIndex === 0;
        const totalLength = SIGNUP_MODAL_REQUIRED_TRAITS.length;
        const isLastTrait = currentProfileCatIndex === totalLength - 1;
        const isTraitAnswred = (savedTraits[currentProfileCat] || [])?.length;
        const totalPages = totalLength;
        const currentPage = currentProfileCatIndex + 1;

        return (
            this.selectedProfileCats && (
                <Modal
                    isOpen={isOpen}
                    onDismiss={this.requestClose}
                    width={4}
                    hasBodyScroll={true}
                >
                    <Modal.Header>
                        {isFirstTrait || <Modal.Back onClick={this.moveToPreviousQuestion} />}
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        height={435}
                        paddingBottom={3}
                    >
                        {isFirstTrait && (
                            <>
                                <Markdown
                                    content={modalSubTitle1}
                                    lineHeight='tight'
                                    fontWeight='bold'
                                />
                                <Markdown
                                    content={modalSubTitle2}
                                    lineHeight='tight'
                                    marginBottom={2}
                                />
                            </>
                        )}
                        <BeautyProfileHeading
                            beautyPreferences={savedTraits}
                            refinement={this.selectedProfileCats[currentProfileCatIndex]}
                            expanded={true}
                            isPostSignupModal={true}
                            isFirstTrait={isFirstTrait}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                        <TiledProfileContent
                            refinement={this.selectedProfileCats[currentProfileCatIndex]}
                            selectedOptions={savedTraits[currentProfileCat]}
                            setBeautyPreferencesState={this.setBeautyPreferencesState}
                            isPostSignupModal={true}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Flex
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Link
                                color='blue'
                                padding={2}
                                margin={-2}
                                children={skipThisQuestion}
                                onClick={this.skipThisQuestion({ category: this.selectedProfileCats[currentProfileCatIndex] })}
                            />
                            <Button
                                hasMinWidth={true}
                                variant='primary'
                                onClick={this.saveTraits}
                                disabled={!isTraitAnswred}
                            >
                                {isLastTrait ? done : next}
                            </Button>
                        </Flex>
                    </Modal.Footer>
                </Modal>
            )
        );
    }
}

export default wrapComponent(BeautyPreferencesModal, 'BeautyPreferencesModal', true);
