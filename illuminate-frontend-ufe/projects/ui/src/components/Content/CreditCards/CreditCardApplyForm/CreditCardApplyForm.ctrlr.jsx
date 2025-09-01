/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import userUtils from 'utils/User';
import decorators from 'utils/decorators';
import urlUtils from 'utils/Url';
import profileApi from 'services/api/profile';
import UI from 'utils/UI';
import apiUtils from 'utils/Api';
import CreditCardActions from 'actions/CreditCardActions';
import sessionExtensionService from 'services/SessionExtensionService';
import anaUtils from 'analytics/utils';
import helperUtils from 'utils/Helpers';
import localStorageConstants from 'utils/localStorage/Constants';
import { SEPHORA_CARD_TYPES, APPROVAL_STATUS } from 'constants/CreditCard';
import analyticsConstants from 'analytics/constants';
import ContentInformationRules from 'components/CreditCard/ApplyFlow/ContentInformationRules/ContentInformationRules';
import PersonalInformation from 'components/CreditCard/ApplyFlow/PersonalInformation/PersonalInformation';
import SecureInformation from 'components/CreditCard/ApplyFlow/SecureInformation/SecureInformation';
import OpeningAccount from 'components/CreditCard/ApplyFlow/OpeningAccount/OpeningAccount';
import ElectronicConsent from 'components/CreditCard/ApplyFlow/ElectronicConsent/ElectronicConsent';
import Logo from 'components/Logo/Logo';
import CompactFooter from 'components/Footer/CompactFooter';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import Banner from 'components/Content/Banner';
import CreditCardPostApplication from 'components/Content/CreditCards/CreditCardPostApplication';
import creditCardPageBindings from 'analytics/bindingMethods/pages/creditCard/creditCardPageBindings';
import {
    Grid, Container, Box, Flex, Text, Button
} from 'components/ui';
import Iovation from 'utils/Iovation';
import { UserInfoReady, PostLoad } from 'constants/events';
import RCPSCookies from 'utils/RCPSCookies';
import Empty from 'constants/empty';

const REALTIME_PRESCREEN_CONFIG = { MAX_COUNT: 3 };
const {
    EVENT_NAMES: { CREDIT_CARD_SIGNUP }
} = analyticsConstants;
const { CREDIT_CARD_REALTIME_PRESCREEN } = localStorageConstants;

class CreditCardApplyForm extends BaseClass {
    state = {
        isUserReady: false,
        address: {},
        birthday: {},
        showResponsePage: false,
        isConsentChecked: false,
        deviceData: false
    };

    componentDidMount() {
        const { isLandingPageEnabled } = Sephora.fantasticPlasticConfigurations;
        sessionExtensionService.setExpiryTimer(this.props.requestCounter);

        if (isLandingPageEnabled) {
            Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
                if (this.props.isSignedIn) {
                    this.prefillDataOrRegisterBI();
                } else {
                    this.props.openSignInModal({
                        isOpen: true,
                        callback: this.prefillDataOrRegisterBI,
                        errback: this.redirectToMarketing,
                        isCreditCardApply: true
                    });
                }
            });

            creditCardPageBindings.setApplyPageLoadAnalytics();

            // TODO: make CE story to store script URL in Sephora.configurationSettings
            // production URL will be: //mpsnare.iesnare.com/snare.js
            Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
                Iovation.loadIovationScript();

                if (this.props.isSignedIn) {
                    Iovation.getBlackboxString().then(blackBoxString => {
                        this.setState({ deviceData: blackBoxString });
                    });
                }
            });
        } else {
            urlUtils.redirectTo('/');
        }
    }

    componentDidUpdate(_prevProps, prevState) {
        if (!this.state.showResponsePage && this.state.isUserReady && this.state.isUserReady !== prevState.isUserReady) {
            creditCardPageBindings.setApplyPageLoadAnalytics();
        }
    }

    render() {
        const { nonPreApprovedContent, locales, postAppContent } = this.props;
        const { isPrivateLabel, isCoBranded, preapprovedBannerContent } = this.state;
        const isPreApproved = isPrivateLabel || isCoBranded;
        const pageHeader = this.getCCProgramName();
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
                            <Container>
                                {pageHeader && (
                                    <Grid
                                        marginTop={[5, 6]}
                                        alignItems='baseline'
                                        lineHeight='tight'
                                        columns={[null, '1fr auto 1fr']}
                                    >
                                        <Text
                                            is='h1'
                                            fontSize={['lg', 'xl']}
                                            fontWeight='bold'
                                        >
                                            {pageHeader}
                                        </Text>
                                        <Box display={['none', 'block']} />
                                    </Grid>
                                )}
                            </Container>
                            {this.state.showResponsePage || (
                                <>
                                    <Container>
                                        <Grid
                                            gap={[6, 5]}
                                            columns={[null, null, '1fr 400px']}
                                        >
                                            <div>
                                                <form
                                                    noValidate
                                                    onSubmit={e => this.submitButtonClick(e)}
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
                                                        marginTop={5}
                                                        children={locales.submitButton}
                                                        disabled={!this.state.isConsentChecked || !this.state.deviceData}
                                                    />
                                                </form>
                                            </div>
                                            <Box
                                                display='block'
                                                px={[4, null, 0]}
                                            >
                                                {preapprovedBannerContent ? (
                                                    <Banner {...preapprovedBannerContent} />
                                                ) : !isPreApproved && nonPreApprovedContent ? (
                                                    <Banner {...nonPreApprovedContent} />
                                                ) : null}
                                            </Box>
                                        </Grid>
                                    </Container>
                                </>
                            )}
                            {this.state.showResponsePage && (
                                <CreditCardPostApplication
                                    postAppContent={postAppContent}
                                    status={this.state.applicationStatus}
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
     * returns page title
     */
    getCCProgramName = () => {
        const { locales } = this.props;
        const isApplication = !this.state.showResponsePage;
        const isPreApprovedApplication = this.state.isPrivateLabel || this.state.isCoBranded;
        const isErrorResponse = this.state.showResponsePage && this.state.applicationStatus.name === APPROVAL_STATUS.ERROR;

        return isApplication || isErrorResponse || isPreApprovedApplication ? locales.ccProgramName : null;
    };

    /**
     * prefill data if user is BI or open registration modal
     * async callback since it is going to be called as a result
     * of showSignInWithMessagingModal execution
     */
    prefillDataOrRegisterBI = () => {
        if (this.props.isSignedIn) {
            const profileData = this.getUserDataFromProfile();

            if (this.props.isBI) {
                if (this.props.isPreApprovedForCreditCard) {
                    this.prefillUserDataFromPrescreenDetails(profileData);
                } else {
                    this.prefillUserDataFromCreditCards(profileData);
                }
            } else {
                this.props.openBiRegisterModal({
                    isOpen: true,
                    cancellationCallback: this.redirectToMarketing,
                    isCreditCardApply: true
                });
            }
        }
    };

    /**
     * prefill data from the profile state
     */
    getUserDataFromProfile = () => {
        const {
            firstName, lastName, birthMonth, birthDay, birthYear, email
        } = this.props.user?.beautyInsiderAccount || {};
        const { phoneNumber } = this.props.user;

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
            phone: phoneNumber,
            isUserReady: true
        };
    };

    /**
     * prefill data from the prescreening details
     * @param {*} profileData profile data
     */
    prefillUserDataFromPrescreenDetails = profileData => {
        const { profileId, beautyInsiderAccount } = this.props.user;

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
        let content = this.props.nonPreApprovedContent;

        if (isPrivateLabel) {
            content = this.props.privateLabelContent;
        }

        if (isCoBranded) {
            content = this.props.coBrandedLabelContent;
        }

        this.setState({ preapprovedBannerContent: content });
    };

    /**
     * prefill address details from credit card data and the rest from passed profileData
     * @param {*} profileData profile data
     */
    prefillUserDataFromCreditCards = profileData => {
        const { profileId, beautyInsiderAccount } = this.props.user;

        //CCAP Killswitch
        if (RCPSCookies.isRCPSCCAP()) {
            return profileApi
                .getCustomerInformation(beautyInsiderAccount?.biAccountId)
                .then(data => {
                    const { customerAccountInfo, customerPaymentInfo, customerPrescreenLookUpInfoOut } = data;
                    const { creditCardType, prescreenId } = customerPrescreenLookUpInfoOut || Empty.Object;

                    let isPrivateLabel, isCoBranded;

                    if (creditCardType) {
                        isPrivateLabel = creditCardType === SEPHORA_CARD_TYPES.PRIVATE_LABEL;
                        isCoBranded = creditCardType === SEPHORA_CARD_TYPES.CO_BRANDED;

                        this.showPreapprovedBanner(isPrivateLabel, isCoBranded);
                    }

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

            creditCardPageBindings.SubmitApplicationLinkTracking();

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

                    // Analytics - ILLUPH-110767
                    creditCardPageBindings.fireResultPageAnalytics(data);

                    // DoubleClick Pixel - ILLUPH-130682
                    anaUtils.fireEventForTagManager(CREDIT_CARD_SIGNUP, { detail: { status: data.status } });

                    store.dispatch(CreditCardActions.getCreditCardTargeters());
                })
                .catch(data => {
                    this.setState(this.getErrorResponseState(data));
                    creditCardPageBindings.fireResultPageAnalytics(data);
                    UI.scrollToTop();
                });
        }

        return null;
    };
    submitButtonClick = Debounce.preventDoubleClick(this.submitButtonClick);
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
                creditCardPageBindings.triggerErrorTracking(formErrors);
            }

            helperUtils.scrollTo(isPersonalInfoValid ? this.secureInformationForm : this.personalInformationForm);
        }

        return isPersonalInfoValid && isSecureInfoValid;
    };

    /**
     * form -> request object mapping
     */
    getRequestObject = () => {
        const { beautyInsiderAccount } = this.props.user;
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
}

export default wrapComponent(CreditCardApplyForm, 'CreditCardApplyForm', true);
