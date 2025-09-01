/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import watch from 'redux-watch';
import auth from 'Authentication';
import actions from 'Actions';
import wizardActions from 'actions/WizardActions';
import beautyPreferencesActions from 'actions/BeautyPreferencesActions';
import BeautyPreferencesWorldActions from 'actions/BeautyPreferencesWorldActions';
import analyticsConstants from 'analytics/constants';
import beautyPreferencesUtils from 'utils/BeautyPreferences';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import userUtils from 'utils/User';
import Debounce from 'utils/Debounce';
import { mediaQueries } from 'style/config';
import Modal from 'components/Modal/Modal';
import { Link, Button, Flex } from 'components/ui';
import {
    COLORIQ_BP_PAGE_COMPONENT_NAME,
    COLORIQ_SPOKE_COMPONENT_NAME
} from 'constants/beautyPreferences';
import { HEADER_VALUE } from 'constants/authentication';

const { fireAnalyticsDataOverwrites, updateBeautyPreferences, setExpandedPreference } = beautyPreferencesActions;
const { getColorIQWizardNextUnansweredQuestion } = beautyPreferencesUtils;
const {
    PAGE_DETAIL: { SHADE_FINDER, SHADE_FINDER_LANDING },
    PAGE_NAMES: { BEAUTY_PREFERENCES, MY_SEPHORA, SHADE_FINDER_MATCH_FOUND },
    PAGE_TYPES: { PRODUCT }
} = analyticsConstants;

const BACK_BUTTON_HEIGHT = 60;

class Wizard extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            colorIQ: {},
            colorIQPref: {}
        };
    }

    getContent = page => {
        const { modalTitle, content, isActive, ...props } = this.props;
        const contentComponent = Object.assign({}, content[page]);
        contentComponent.props = Object.assign({}, contentComponent.props, props);

        return contentComponent;
    };

    componentDidMount() {
        const wizardWatcher = watch(store.getState, 'wizard');
        store.subscribe(
            wizardWatcher(wizardData => {
                this.setState(prevState => {
                    const newState = { ...prevState };

                    if (wizardData) {
                        if (wizardData.currentPage !== undefined) {
                            newState.currentPage = wizardData.currentPage;
                        }

                        if (wizardData.labCode || wizardData.labValue) {
                            newState.colorIQPref.labValue = wizardData.labCode || wizardData.labValue;
                        }

                        newState.colorIQ = {
                            hexShadeCode: wizardData.hexShadeCode,
                            shade: wizardData.shade,
                            desc: wizardData.desc
                        };
                    }

                    return newState;
                });
            }),
            this
        );
    }

    dismissModal = () => {
        store.dispatch(actions.showWizard(false));

        if (this.props.resetOnClose) {
            this.goToFirstPage(false);
        }
    };

    getCapturedColorIQPref = () => {
        const colorIQPref = this.state.colorIQPref;

        // ColorIQ spoke added new attributes needed in localStorage for INFL-1544
        if (!this.props.isMySephoraPage) {
            const colorIQ = this.state.colorIQ;
            colorIQPref.hexCode = colorIQ.hexShadeCode;
            colorIQPref.shadeDesc = colorIQ.shade;

            return colorIQPref.labValue && colorIQPref.hexCode && colorIQPref.shadeDesc ? colorIQPref : null;
        }

        return colorIQPref.labValue ? colorIQPref : null;
    };

    saveHandler = Debounce.preventDoubleClick(() => {
        const { isMySephoraPage, isSignedIn, isBI, openRegisterBIModal } = this.props;
        const { currentPage } = this.state;
        const stayOnResultsPage = () => {
            store.dispatch(wizardActions.changeCurrentPage(currentPage));
        };

        return isMySephoraPage
            ? isSignedIn
                ? isBI
                    ? this.saveAndContinue()
                    : openRegisterBIModal(stayOnResultsPage)
                : this.signInHandler()
            : this.seeMatchingProducts();
    }, 2000);

    seeMatchingProducts = () => {
        const { resultsCallback } = this.props;
        const capturedColorIQPref = this.getCapturedColorIQPref();

        if (capturedColorIQPref) {
            Storage.local.setItem(LOCAL_STORAGE.CAPTURED_COLOR_IQ_PREF, capturedColorIQPref, userUtils.USER_DATA_EXPIRY);
        }

        return resultsCallback();
    };

    saveAndContinue = () => {
        const {
            user,
            beautyPreferences,
            currentCategory,
            apiErrorModalTitle,
            apiErrorModalMessage,
            errorButtonText,
            isColorIQLastAnsweredTrait,
            setIsColorIQLastAnsweredTrait
        } = this.props;
        const capturedColorIQPref = this.getCapturedColorIQPref();

        const successCallback = () => {
            store.dispatch(actions.showWizard(false));
            this.goToFirstPage(false);

            // setExpandedPreference for beautyPreferences store
            const nextCat = getColorIQWizardNextUnansweredQuestion(beautyPreferences);
            store.dispatch(setExpandedPreference(nextCat));

            setIsColorIQLastAnsweredTrait(isColorIQLastAnsweredTrait);
        };

        if (this.state.colorIQ?.hexShadeCode) {
            // Use BeautyPreferencesWorld action for BP World component
            if (this.props.componentName === COLORIQ_BP_PAGE_COMPONENT_NAME) {
                store.dispatch(
                    BeautyPreferencesWorldActions.saveColorIQ(
                        capturedColorIQPref,
                        successCallback
                    )
                );
            } else {
                // Use legacy action for original Beauty Preferences
                store.dispatch(
                    updateBeautyPreferences(
                        currentCategory,
                        user.profileId,
                        capturedColorIQPref,
                        beautyPreferences,
                        successCallback,
                        apiErrorModalTitle,
                        apiErrorModalMessage,
                        errorButtonText
                    )
                );
            }

            store.dispatch(
                fireAnalyticsDataOverwrites(
                    {
                        pageName: `${MY_SEPHORA}:${BEAUTY_PREFERENCES}:n/a:*`, // c6 (prop6)
                        previousPageName: `${PRODUCT}:${SHADE_FINDER_MATCH_FOUND}:n/a:*`, // c55 (prop55) async
                        linkData: `${SHADE_FINDER}:save and continue`,
                        pageType: MY_SEPHORA, // eVar93
                        pageDetail: BEAUTY_PREFERENCES // eVar94
                    },
                    true
                )
            );
        } else {
            const closeAPIErrorModal = () => store.dispatch(actions.showInfoModal({ isOpen: false }));

            store.dispatch(actions.showWizard(false));
            this.goToFirstPage(false);

            store.dispatch(
                actions.showInfoModal({
                    isOpen: true,
                    title: apiErrorModalTitle,
                    message: apiErrorModalMessage,
                    buttonText: errorButtonText,
                    callback: closeAPIErrorModal,
                    showCancelButton: false,
                    footerColumns: 1,
                    buttonWidth: [164, 126],
                    footerDisplay: 'flex',
                    footerJustifyContent: 'flex-end',
                    bodyFooterPaddingX: 4,
                    isHtml: false,
                    cancelCallback: closeAPIErrorModal
                })
            );
        }
    };

    signInHandler = () => {
        const { currentPage } = this.state;
        auth.requireAuthentication(
            undefined,
            undefined,
            {
                linkData: `${SHADE_FINDER}:signin` // c55 (prop55)
            },
            null,
            false,
            HEADER_VALUE.USER_CLICK
        )
            .then(() => {
                store.dispatch(wizardActions.changeCurrentPage(currentPage));
            })
            .catch(() => {});
    };

    goToFirstPage = (doNoFireAnalitycs = true) => {
        store.dispatch(wizardActions.changeCurrentPage(0));

        if (doNoFireAnalitycs) {
            store.dispatch(
                // s.t call overwrites
                fireAnalyticsDataOverwrites(
                    {
                        linkData: `${SHADE_FINDER}:retake`, // c55 (prop55) async
                        pageName: `${PRODUCT}:${SHADE_FINDER_LANDING}:n/a:*`,
                        pageType: PRODUCT, // eVar93
                        pageDetail: SHADE_FINDER_LANDING, // eVar94
                        previousPageName: `${PRODUCT}:${SHADE_FINDER_MATCH_FOUND}:n/a:*` // c6 (prop6)
                    },
                    true
                )
            );
        }
    };

    goToPreviousPage = () => {
        store.dispatch(wizardActions.goToPreviousPage());
    };

    render() {
        const {
            modalTitle, retake, back, saveButtonText, componentName
        } = this.props;

        const content = this.getContent(this.state.currentPage);
        const isFirstScreen = this.state.currentPage === 0;
        const isResultsScreen = this.state.currentPage === 4;
        const isColorIQFromBPPageOrSpoke = componentName === COLORIQ_BP_PAGE_COMPONENT_NAME || componentName === COLORIQ_SPOKE_COMPONENT_NAME;

        return (
            <Modal
                isOpen={this.props.isOpen}
                width={4}
                onDismiss={this.dismissModal}
                noScroll={true}
                customStyle={
                    isFirstScreen && {
                        /* vertically align the steps when height differs */
                        inner: {
                            [mediaQueries.sm]: {
                                marginBottom: BACK_BUTTON_HEIGHT
                            }
                        }
                    }
                }
            >
                <Modal.Header>
                    {isFirstScreen || <Modal.Back onClick={this.goToPreviousPage} />}
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    height={472}
                    display='flex'
                    flexDirection='column'
                    overflow='hidden'
                >
                    {content}
                </Modal.Body>
                {isFirstScreen ||
                    (isColorIQFromBPPageOrSpoke && (
                        <Modal.Footer
                            hasBorder={true}
                            paddingY={[0, 0]}
                        >
                            {isResultsScreen && isColorIQFromBPPageOrSpoke ? (
                                <Flex
                                    alignItems='center'
                                    justifyContent='space-between'
                                >
                                    <Link
                                        color='blue'
                                        height={BACK_BUTTON_HEIGHT}
                                        paddingX={4}
                                        marginX={-4}
                                        onClick={this.goToFirstPage}
                                        children={retake}
                                    />
                                    <Button
                                        variant='primary'
                                        onClick={this.saveHandler}
                                        marginTop={0}
                                        width={[243, 244]}
                                    >
                                        {saveButtonText}
                                    </Button>
                                </Flex>
                            ) : (
                                <Link
                                    color='blue'
                                    height={BACK_BUTTON_HEIGHT}
                                    paddingX={4}
                                    marginX={-4}
                                    onClick={this.goToPreviousPage}
                                    children={back}
                                />
                            )}
                        </Modal.Footer>
                    ))}
            </Modal>
        );
    }
}

export default wrapComponent(Wizard, 'Wizard', true);
