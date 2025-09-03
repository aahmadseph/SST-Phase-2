/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import watch from 'redux-watch';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import Iovation from 'utils/Iovation';
import userUtils from 'utils/User';
import decorators from 'utils/decorators';
import Actions from 'Actions';
import urlUtils from 'utils/Url';
import profileApi from 'services/api/profile';
import UI from 'utils/UI';
import cmsApi from 'services/api/cms';
import processEvent from 'analytics/processEvent';
import apiUtils from 'utils/Api';
import CreditCardActions from 'actions/CreditCardActions';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import sessionExtensionService from 'services/SessionExtensionService';
import anaUtils from 'analytics/utils';
import helperUtils from 'utils/Helpers';
import localStorageConstants from 'utils/localStorage/Constants';
import { SEPHORA_CARD_TYPES, MEDIA_IDS, APPROVAL_STATUS } from 'constants/CreditCard';
import analyticsConstants from 'analytics/constants';
import ContentInformationRules from 'components/CreditCard/ApplyFlow/ContentInformationRules/ContentInformationRules';
import PersonalInformation from 'components/CreditCard/ApplyFlow/PersonalInformation/PersonalInformation';
import SecureInformation from 'components/CreditCard/ApplyFlow/SecureInformation/SecureInformation';
import OpeningAccount from 'components/CreditCard/ApplyFlow/OpeningAccount/OpeningAccount';
import ElectronicConsent from 'components/CreditCard/ApplyFlow/ElectronicConsent/ElectronicConsent';
import ApplyFlowResponse from 'components/CreditCard/ApplyFlow/ApplyFlowResponse/ApplyFlowResponse';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import {
    Grid, Container, Link, Box, Flex, Text, Button, Divider
} from 'components/ui';
import Logo from 'components/Logo/Logo';
import CompactFooter from 'components/Footer/CompactFooter';
//Do not remove
import localeUtils from 'utils/LanguageLocale';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import { UserInfoReady, PostLoad } from 'constants/events';
import RCPSCookies from 'utils/RCPSCookies';
import Empty from 'constants/empty';

const { CREDIT_CARD_REALTIME_PRESCREEN } = localStorageConstants;
const {
    ASYNC_PAGE_LOAD,
    LINK_TRACKING_EVENT,
    Event: {
        SC_CREDIT_CARD_SUBMIT, SC_CREDIT_CARD_APPROVED, SC_CREDIT_CARD_PENDING, SC_CREDIT_CARD_ERROR, EVENT_71
    },
    EVENT_NAMES: { CREDIT_CARD_SIGNUP },
    PAGE_NAMES: { CREDIT_CARD_APPLICATION_START, CREDIT_CARD_APPLICATION_APPROVED, CREDIT_CARD_APPLICATION_PENDING },
    PAGE_TYPES: { CREDIT_CARD }
} = analyticsConstants;
const REALTIME_PRESCREEN_CONFIG = { MAX_COUNT: 3 };

const prop55 = 'creditcard:submit application';

class ApplyFlowMain extends BaseClass {
    state = {
        isUserReady: false,
        address: {},
        birthday: {},
        showResponsePage: false,
        isConsentChecked: false,
        deviceData: false
    };

    /**
     * returns page title
     */
    getCCProgramName = getTextFn => {
        const isApplication = !this.state.showResponsePage;
        const isPreApprovedApplication = this.state.isPrivateLabel || this.state.isCoBranded;
        const isErrorResponse = this.state.showResponsePage && this.state.applicationStatus.name === APPROVAL_STATUS.ERROR;

        return isApplication || isErrorResponse || isPreApprovedApplication ? getTextFn('ccProgramName') : null;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/locales', 'ApplyFlowMain');

        const { nonPreApprovedContent } = this.props;

        const { isPrivateLabel, isCoBranded, preapprovedBannerContent } = this.state;

        const isPreApproved = isPrivateLabel || isCoBranded;
        const pageHeader = this.getCCProgramName(getText);
        const isAdsRestricted = true;

        return (
            <Flex
                flexDirection='column'
                minHeight='100vh'
            >
                <Flex
                    flex='none'
                    justifyContent='center'
                    paddingY={[4, 6]}
                    boxShadow='0 1px 4px 0 var(--color-darken2)'
                >
                    <Logo />
                </Flex>
                <Box flex='1 0 auto'>
                    {this.state.isUserReady && (
                        <>
                            <Container hasLegacyWidth>
                                {pageHeader && (
                                    <Grid
                                        marginTop={[5, 6]}
                                        marginBottom={5}
                                        alignItems='baseline'
                                        lineHeight='tight'
                                        columns={[null, '1fr auto 1fr']}
                                    >
                                        <Box display={['none', 'block']}>
                                            <Link
                                                arrowPosition='before'
                                                arrowDirection='left'
                                                href='/creditcard'
                                                padding={3}
                                                margin={-3}
                                            >
                                                {getText('backLink')}
                                            </Link>
                                        </Box>
                                        <Text
                                            is='h1'
                                            textAlign='center'
                                            fontSize={['xl', '2xl']}
                                            fontFamily='serif'
                                        >
                                            {pageHeader}
                                        </Text>
                                        <Box display={['none', 'block']} />
                                    </Grid>
                                )}
                            </Container>
                            <Divider
                                display={['none', 'block']}
                                marginBottom={7}
                                thick={true}
                            />
                            {this.state.showResponsePage || (
                                <>
                                    <Container hasLegacyWidth>
                                        <Grid
                                            gap={[null, null, 7]}
                                            columns={[null, null, '1fr 343px']}
                                        >
                                            <div>
                                                <form
                                                    noValidate
                                                    onSubmit={e => this.submitButtonClickDebounce(e)}
                                                >
                                                    <ContentInformationRules
                                                        isPreApproved={isPreApproved}
                                                        isPrivateLabel={isPrivateLabel}
                                                        isCoBranded={isCoBranded}
                                                    />
                                                    <PersonalInformation
                                                        address={this.state.address}
                                                        email={this.state.email}
                                                        phone={this.state.phone}
                                                        isPreApproved={isPreApproved}
                                                        isAdsRestricted={isAdsRestricted}
                                                        errors={this.state.validationErrorsFromBackend}
                                                        ref={comp => (this.personalInformationForm = comp)}
                                                    />
                                                    <SecureInformation
                                                        birthday={this.state.birthday}
                                                        isAdsRestricted={isAdsRestricted}
                                                        ref={comp => (this.secureInformationForm = comp)}
                                                    />
                                                    <OpeningAccount isPrivateLabel={isPrivateLabel} />
                                                    <ElectronicConsent
                                                        isPreApproved={isPreApproved}
                                                        isPrivateLabel={isPrivateLabel}
                                                        isCoBranded={isCoBranded}
                                                        updateConsentStatus={this.updateConsentStatus}
                                                        checked={this.state.isConsentChecked}
                                                        ref={comp => (this.electronicConsentForm = comp)}
                                                    />
                                                    <Button
                                                        variant='primary'
                                                        type='submit'
                                                        children={getText('submitButton')}
                                                        disabled={!this.state.isConsentChecked || !this.state.deviceData}
                                                    />
                                                </form>
                                            </div>
                                            <Box display={['none', null, 'block']}>
                                                {preapprovedBannerContent ? (
                                                    <BccComponentList items={preapprovedBannerContent} />
                                                ) : !isPreApproved && nonPreApprovedContent ? (
                                                    <BccComponentList items={nonPreApprovedContent} />
                                                ) : null}
                                            </Box>
                                        </Grid>
                                    </Container>
                                </>
                            )}
                            {this.state.showResponsePage && (
                                <ApplyFlowResponse
                                    status={this.state.applicationStatus}
                                    welcomeBCCData={this.state.welcomeBCCData}
                                />
                            )}
                        </>
                    )}
                </Box>
                <PageRenderReport />
                <CompactFooter />
            </Flex>
        );
    }

    /**
     * ctrl
     */
    componentDidMount() {
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);

        const { isLandingPageEnabled } = Sephora.fantasticPlasticConfigurations;

        if (isLandingPageEnabled) {
            Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
                if (userUtils.isSignedIn()) {
                    this.prefillDataOrRegisterBI();
                } else {
                    store.dispatch(
                        Actions.showSignInWithMessagingModal({
                            isOpen: true,
                            callback: this.prefillDataOrRegisterBI,
                            errback: this.redirectToMarketing,
                            isCreditCardApply: true
                        })
                    );
                }
            });

            // Analytics - ILLUPH-109604
            digitalData.page.pageInfo.pageName = CREDIT_CARD_APPLICATION_START;
            digitalData.page.category.pageType = CREDIT_CARD;

            // TODO: make CE story to store script URL in Sephora.configurationSettings
            // production URL will be: //mpsnare.iesnare.com/snare.js
            Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
                Iovation.loadIovationScript();
                Iovation.getBlackboxString().then(blackBoxString => {
                    this.setState({ deviceData: blackBoxString });
                });
            });
        } else {
            urlUtils.redirectTo('/');
        }
    }

    /**
     * prefill data if user is BI or open registration modal
     * async callback since it is going to be called as a result
     * of showSignInWithMessagingModal execution
     */
    prefillDataOrRegisterBI = () => {
        if (userUtils.isBI()) {
            this.prefillUserData();
        } else {
            store.dispatch(
                Actions.showBiRegisterModal({
                    isOpen: true,
                    cancellationCallback: this.redirectToMarketing,
                    isCreditCardApply: true
                })
            );

            const userBIWatch = watch(store.getState, 'user.beautyInsiderAccount');
            const unsubscribe = store.subscribe(
                userBIWatch(() => {
                    this.prefillUserData();
                    unsubscribe();
                }),
                this
            );
        }
    };

    /**
     * prefill user data fn
     * called from prefillDataOrRegisterBI or as a callback of showBiRegisterModal
     */
    prefillUserData = () => {
        const profileData = this.getUserDataFromProfile();

        if (userUtils.isPreApprovedForCreditCard()) {
            this.prefillUserDataFromPrescreenDetails(profileData);
        } else {
            this.prefillUserDataFromCreditCards(profileData);
        }
    };

    /**
     * prefill data from the profile state
     */
    getUserDataFromProfile = () => {
        const {
            firstName, lastName, birthMonth, birthDay, birthYear, email
        } = userUtils.getBiAccountInfo();
        const userPhoneNumber = userUtils.getUserPhoneNumber();

        return {
            // names are preserved in:
            // prefillUserDataFromPrescreenDetails and prefillUserDataFromCreditCards
            address: {
                firstName: firstName,
                lastName: lastName
            },
            birthday: {
                bMon: birthMonth,
                bDay: birthDay,
                bYear: Number.parseInt(birthYear) > 1899 ? birthYear : ''
            },
            email: email,
            phone: userPhoneNumber,
            isUserReady: true
        };
    };

    /**
     * prefill data from the prescreening details
     * @param {*} profileData profile data
     */
    prefillUserDataFromPrescreenDetails = profileData => {
        const profileId = userUtils.getProfileId();
        const beautyInsiderAccount = userUtils.getBiAccountInfo();

        if (RCPSCookies.isRCPSCCAP()) {
            return profileApi
                .getCustomerInformation(beautyInsiderAccount?.biAccountId)
                .then(data => {
                    const { customerPrescreenLookUpInfoOut, customerAccountInfo, customerPaymentInfo } = data;
                    const { creditCardType, prescreenId } = customerPrescreenLookUpInfoOut || Empty.Object;

                    let isPrivateLabel, isCoBranded;

                    if (creditCardType) {
                        isPrivateLabel = creditCardType === SEPHORA_CARD_TYPES.PRIVATE_LABEL;
                        isCoBranded = creditCardType === SEPHORA_CARD_TYPES.CO_BRANDED;

                        this.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                    }

                    const profileInformation = {
                        address: {
                            firstName: customerAccountInfo.firstName,
                            lastName: customerAccountInfo.lastName
                        },
                        isPrivateLabel: isPrivateLabel,
                        isCoBranded: isCoBranded,
                        cardType: creditCardType,
                        preScreenID: prescreenId
                    };

                    if (customerPaymentInfo?.address) {
                        profileInformation.address = {
                            ...customerPaymentInfo.address,
                            ...profileInformation.address
                        };
                    } else {
                        const address = customerAccountInfo.addresses?.find(a => a.isDefault === true);

                        if (address) {
                            profileInformation.address = {
                                ...profileInformation.address,
                                address1: address.addressLine1,
                                city: address.city,
                                state: address.stateCode,
                                country: address.countryCode,
                                postalCode: address.postalCode,
                                phoneNumber: address.phoneNumber
                            };
                        }
                    }

                    this.setState(Object.assign({}, profileData, profileInformation));
                })
                .catch(() => {
                    this.setState(profileData);
                });
        }

        return profileApi
            .getPreScreenDetails(profileId)
            .then(data => {
                //  take names from profileData, not prescreen details
                const prescreenAddress = Object.assign({}, data.address, profileData.address);

                let isPrivateLabel, isCoBranded;

                // show preapproved banner
                if (data.cardType) {
                    isPrivateLabel = data.cardType === SEPHORA_CARD_TYPES.PRIVATE_LABEL;
                    isCoBranded = data.cardType === SEPHORA_CARD_TYPES.CO_BRANDED;
                    this.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                }

                this.setState(
                    Object.assign({}, profileData, {
                        address: prescreenAddress,
                        isPrivateLabel: isPrivateLabel,
                        isCoBranded: isCoBranded,
                        cardType: data.cardType,
                        preScreenID: data.preScreenID
                    })
                );
            })
            .catch(() => {
                this.setState(profileData);
            });
    };

    /**
     * requests data for preapproved banner and ets state to show it
     * ILLUPH-116738
     */
    showPreapprovedBanner = (isPrivateLabel, isCoBranded) => {
        let mediaId = MEDIA_IDS.NO_CARD;

        if (isPrivateLabel) {
            mediaId = MEDIA_IDS.PRIVATE_LABEL;
        }

        if (isCoBranded) {
            mediaId = MEDIA_IDS.CO_BRANDED;
        }

        cmsApi.getMediaContent(mediaId).then(data => {
            this.setState({ preapprovedBannerContent: data.regions && data.regions.right });
        });
    };

    /**
     * prefill address details from credit card data and the rest from passed profileData
     * @param {*} profileData profile data
     */
    prefillUserDataFromCreditCards = profileData => {
        const profileId = userUtils.getProfileId();
        const beautyInsiderAccount = userUtils.getBiAccountInfo();

        //CCAP Killswitch
        if (RCPSCookies.isRCPSCCAP()) {
            return profileApi
                .getCustomerInformation(beautyInsiderAccount?.biAccountId)
                .then(data => {
                    const { customerAccountInfo, customerPaymentInfo, customerPrescreenLookUpInfoOut } = data;
                    const { creditCardType, prescreenId } = customerPrescreenLookUpInfoOut || Empty.Object;

                    const profileInformation = {
                        email: customerAccountInfo.email,
                        address: {
                            firstName: customerAccountInfo.firstName,
                            lastName: customerAccountInfo.lastName
                        },
                        birthday: {
                            bDay: customerAccountInfo.birthDay,
                            bMon: customerAccountInfo.birthMonth
                        },
                        isUserReady: true,
                        cardType: creditCardType,
                        preScreenID: prescreenId
                    };

                    if (customerPaymentInfo?.address) {
                        profileInformation.address = {
                            ...customerPaymentInfo.address,
                            ...profileInformation.address
                        };
                        profileInformation.phone = customerPaymentInfo.address.phoneNumber;
                    } else {
                        const address = customerAccountInfo.addresses?.find(a => a.isDefault === true);

                        if (address) {
                            profileInformation.address = {
                                ...profileInformation.address,
                                address1: address.addressLine1,
                                city: address.city,
                                state: address.stateCode,
                                country: address.countryCode,
                                postalCode: address.postalCode,
                                phoneNumber: address.phoneNumber
                            };
                            profileInformation.phone = address.phoneNumber;
                        }
                    }

                    this.setState(profileInformation);
                })
                .catch(() => {
                    this.setState(profileData);
                });
        }

        return profileApi
            .getCreditCardsFromProfile(profileId)
            .then(data => {
                const defaultCreditCard = data.creditCards.filter(card => card.isDefault)[0];

                let creditCardAddress = {};

                if (defaultCreditCard) {
                    //  take names from profileData, not credit card details
                    creditCardAddress = Object.assign(defaultCreditCard.address, profileData.address);
                    this.setState(Object.assign(profileData, { address: creditCardAddress }));
                } else {
                    this.setState(profileData);
                }
            })
            .catch(() => {
                this.setState(profileData);
            });
    };

    /**
     * redirect fn
     */
    redirectToMarketing = () => {
        urlUtils.redirectTo('/creditcard');
    };

    /**
     * update consent state
     */
    updateConsentStatus = () => {
        this.setState(state => ({ isConsentChecked: !state.isConsentChecked }));
    };

    /**
     * form submit handler
     * @param {*} e event object
     */
    submitButtonClick = e => {
        e.preventDefault();

        if (this.validFormInput()) {
            //if user tries to apply for CC, we need to force update RTPS local storage
            //update so count is max count and inProgress is false and response is empty
            //so that RTPS popup doesn't appear after user has already tried to apply
            CreditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, {
                count: REALTIME_PRESCREEN_CONFIG.MAX_COUNT,
                inProgress: false,
                response: {}
            });

            const requestData = this.getRequestObject();

            // Analytics - ILLUPH-109604, UC-37
            processEvent.process(LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [EVENT_71, SC_CREDIT_CARD_SUBMIT],
                    linkName: prop55,
                    actionInfo: prop55,
                    pageDetail: CREDIT_CARD_APPLICATION_START
                }
            });

            let applyService = profileApi.applySephoraCreditCard;

            //CCAP Killswitch
            if (RCPSCookies.isRCPSCCAP()) {
                applyService = profileApi.submitCreditCardApplication;
            }

            decorators
                .withInterstice(
                    applyService,
                    0
                )(requestData)
                .then(data => {
                    if (data.status === APPROVAL_STATUS.ERROR) {
                        throw data;
                    }

                    this.setState(this.getSuccessResponseState(data));
                    UI.scrollToTop();

                    digitalData.page.pageInfo.pageName = this.getSuccessResponsePageName(data);

                    // Analytics - ILLUPH-110767
                    this.fireResultPageAnalytics(data);

                    // DoubleClick Pixel - ILLUPH-130682
                    anaUtils.fireEventForTagManager(CREDIT_CARD_SIGNUP, { detail: { status: data.status } });

                    store.dispatch(CreditCardActions.getCreditCardTargeters());
                })
                .catch(data => {
                    this.setState(this.getErrorResponseState(data));
                    this.fireResultPageAnalytics(data);
                    UI.scrollToTop();
                });
        }

        return null;
    };
    submitButtonClickDebounce = Debounce.preventDoubleClick(this.submitButtonClick);

    /**
     * vaildate the form
     */
    validFormInput = () => {
        ErrorsUtils.clearErrors();
        const isPersonalInfoValid = this.personalInformationForm.validateForm();
        const isSecureInfoValid = this.secureInformationForm.validateForm();

        if (!(isPersonalInfoValid && isSecureInfoValid)) {
            const formErrors = {
                fields: [],
                messages: []
            };
            const errors = store.getState().errors;
            const errorKeys = Object.keys(errors);

            errorKeys.forEach(key => {
                const fields = Object.keys(errors[key]);
                formErrors.fields = formErrors.fields.concat(fields);
                formErrors.messages = formErrors.messages.concat(
                    fields.map(fKey => {
                        return errors[key][fKey].message;
                    })
                );
            });

            if (formErrors.fields.length) {
                this.triggerErrorTracking(formErrors);
            }

            helperUtils.scrollTo(isPersonalInfoValid ? this.secureInformationForm : this.personalInformationForm);
        }

        return isPersonalInfoValid && isSecureInfoValid;
    };

    /**
     * form -> request object mapping
     */
    getRequestObject = () => {
        const beautyInsiderAccount = userUtils.getBiAccountInfo();
        const personalInfo = this.personalInformationForm.getData();
        const secureInfo = this.secureInformationForm.getData();

        // form -> request object mapping
        const obj = {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            phoneNumber: personalInfo.mobilePhone,
            email: personalInfo.email,
            address: personalInfo.address,
            birthdate: secureInfo.birthday,
            ssn: secureInfo.socialSecurity,
            incomeAmount: secureInfo.annualIncome,
            iovation: { blackBox: this.state.deviceData }
        };

        if (RCPSCookies.isRCPSCCAP()) {
            obj.loyaltyId = beautyInsiderAccount?.biAccountId;
        }

        if (personalInfo.alternatePhone) {
            obj.alternatePhoneNumber = personalInfo.alternatePhone;
        }

        if (userUtils.isPreApprovedForCreditCard() || RCPSCookies.isRCPSCCAP()) {
            obj.cardType = this.state.cardType;
            obj.preScreenID = this.state.preScreenID;
        }

        return obj;
    };

    getSuccessResponsePageName = response => {
        return response.status === APPROVAL_STATUS.APPROVED ? CREDIT_CARD_APPLICATION_APPROVED : CREDIT_CARD_APPLICATION_PENDING;
    };

    /**
     * response object -> state mapping
     * @param {*} response
     */
    getSuccessResponseState = response => {
        let state = null;

        try {
            if (response.status === APPROVAL_STATUS.APPROVED) {
                state = {
                    showResponsePage: true,
                    applicationStatus: {
                        name: APPROVAL_STATUS.APPROVED,

                        cardType: response.cardType,
                        creditLimit: response.creditLimit,
                        icon: response.icon,
                        title: response.statusTitle,
                        description: response.statusDescription,

                        firstPurchaseIncentive: response.firstPurchaseIncentive,
                        tempCardMessage: response.tempCardMessage,
                        aprMessage: response.aprMessage,
                        aprDetailsMessage: response.aprDetailsMessage,

                        bureauAddress: response.bureauAddress,
                        bureauCreditScore: response.bureauCreditScore,
                        bureauRejectReasons: response.bureauRejectReasons,

                        discountMessage: response.discountMessage,
                        defaultCardMessage: response.defaultCardMessage
                    },
                    welcomeBCCData: response.media && response.media.region2
                };
            } else {
                state = {
                    showResponsePage: true,
                    applicationStatus: {
                        name: APPROVAL_STATUS.IN_PROGRESS, // or DECLINED

                        pageHeader: response.pageHeader,
                        title: response.statusTitle,
                        icon: response.icon ? response.icon : null,
                        description: response.statusDescription
                    }
                };
            }
        } catch (error) {
            apiUtils.handleApiResponseMappingError(error);
        }

        return state;
    };

    /**
     * response object -> state mapping
     * @param {*} response
     */
    getErrorResponseState = response => {
        let state = null;

        try {
            const validationErrorsNum = typeof response.validationErrors === 'object' ? Object.keys(response.validationErrors).length : 0;

            if (validationErrorsNum > 0) {
                state = {
                    showResponsePage: false,
                    validationErrorsFromBackend: response.validationErrors
                };
            } else {
                state = {
                    showResponsePage: true,
                    applicationStatus: {
                        name: APPROVAL_STATUS.ERROR,

                        code: response.errorCode ? response.errorCode : null,
                        pageHeader: response.pageHeader,
                        title: response.statusTitle,
                        icon: response.icon ? response.icon : null,
                        description: response.statusDescription
                    }
                };
            }
        } catch (error) {
            apiUtils.handleApiResponseMappingError(error);
        }

        return state;
    };

    /**
     * analytics handler
     * @param {*} data
     */
    fireResultPageAnalytics = response => {
        let name = '';
        let eventName = '';
        let creditCardStatus = '';
        let cardType = 'n/a';
        let fireAnalytics = false;
        const status = response.status;

        if (status === APPROVAL_STATUS.APPROVED) {
            name = 'approved';
            eventName = SC_CREDIT_CARD_APPROVED;
            creditCardStatus = 'approval';
            cardType = response.cardType;
            fireAnalytics = true;
        } else if ([APPROVAL_STATUS.IN_PROGRESS, APPROVAL_STATUS.DECLINED].indexOf(status) > -1) {
            name = creditCardStatus = 'pending';
            eventName = SC_CREDIT_CARD_PENDING;
            fireAnalytics = true;
        } else if (response.errorCode) {
            name = creditCardStatus = 'error';
            eventName = SC_CREDIT_CARD_ERROR;
            fireAnalytics = true;
        }

        if (fireAnalytics) {
            const data = {
                eventStrings: [eventName],
                pageName: 'creditcard:application-' + name + ':n/a:*',
                pageDetail: 'application-' + name,
                pageType: CREDIT_CARD,
                creditCardStatus: 'creditcard:application ' + creditCardStatus + ':' + cardType,
                previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName
            };
            processEvent.process(ASYNC_PAGE_LOAD, { data });

            digitalData.page.attributes.sephoraPageInfo.pageName = 'creditcard:application-' + name + ':n/a:*';
            anaUtils.setNextPageData({
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                pageType: digitalData.page.category.pageType
            });
        }
    };

    /**
     * error handling
     * @param {Object} errorData Error information
     * @returns {void}
     */
    triggerErrorTracking = errorData => {
        errorData.fields[0] = 'creditcard:' + errorData.fields[0];
        errorData.messages[0] = 'creditcard:' + errorData.messages[0];
        const eventData = {
            data: {
                linkName: 'error',
                actionInfo: prop55,
                bindingMethods: linkTrackingError,
                eventStrings: [EVENT_71],
                fieldErrors: errorData.fields,
                errorMessages: errorData.messages
            }
        };
        processEvent.process(LINK_TRACKING_EVENT, eventData);
    };
}

export default wrapComponent(ApplyFlowMain, 'ApplyFlowMain');
