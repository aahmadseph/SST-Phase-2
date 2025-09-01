/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import AdvocacyLanding from 'components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacyLanding';
import AdvocacySuccess from 'components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacySuccess';
import AdvocacyError from 'components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacyError/AdvocacyError';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import { getContent } from 'services/api/Content/getContent';
import biProfileUtils from 'utils/BiProfile';
import utilityApi from 'services/api/utility';
import decorators from 'utils/decorators';
import {
    CAMPAIGN_TYPE, SHARE, ERROR, PAGE_TYPES
} from 'components/Campaigns/Referrer/constants';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Empty from 'constants/empty';
import BIApi from 'services/api/beautyInsider';

const isRMSWithSDNEnabled = Sephora.configurationSettings.isRMSWithSDNEnabled;
const { LANDING, SUCCESS, ERROR_PAGE } = PAGE_TYPES;
class RwdAdvocacy extends BaseClass {
    state = {
        isLoading: true,
        errors: null,
        pageType: null,
        contentfulData: null,
        campaignData: null,
        hasCalledEnrolled: false,
        profileStatus: null,
        biAccountId: null,
        referrerCode: null,
        campaignCode: null,
        checksum: null,
        addToPromoSuccess: false
    };

    isFnF = code => {
        return code === CAMPAIGN_TYPE.FNF;
    };

    getUserId = () => {
        return biProfileUtils.getBiAccountId();
    };

    enrollUserATG = async (oldEnrollPayload, referralToken) => {
        try {
            // Make the API call to enroll the user
            const data = await decorators.withInterstice(utilityApi.enrollCampaign)(oldEnrollPayload, referralToken, true);

            // If the user is successfully enrolled
            if (data.enrolled) {
                this.getCampaignDates(data);
                this.setState({
                    pageType: SUCCESS,
                    isLoading: false
                });
            }
        } catch (err) {
            this.setErrorState(err?.errors?.errorCode || ERROR.CUSTOM_ADVOCACY_DOWN);
        } finally {
            this.setState({ hasCalledEnrolled: false });
        }
    };

    enrollUserSDN = async (enrollPayload, referralToken) => {
        // Prevent duplicate API calls if the promo call has already succeeded
        if (this.state.addToPromoSuccess) {
            return;
        }

        try {
            // Perform the API call to add user to promo
            const response = await decorators.withInterstice(utilityApi.addToPromotion)(enrollPayload, referralToken);

            // Handle non-200 responseStatus by throwing the error
            if (response.responseStatus !== 200 || response?.errors) {
                // Throw the entire response error to be caught in the catch block
                throw response;
            }

            // If addToPromo was successful (The addToPromo response indicates the user is enrolled)
            if (response.responseStatus === 200 && Boolean(response.enrolled) === true) {
                this.setState(prevState => ({
                    hasCalledEnrolled: true,
                    addToPromoSuccess: true,
                    campaignData: {
                        ...prevState.campaignData,
                        enrolled: true
                    }
                }));

                const userIsBi = userUtils.isBI();

                if (userIsBi) {
                    // enrolled is true from addToPromo and they are BI then show Success page
                    this.getCampaignDates();

                    return this.setState({ pageType: SUCCESS, isLoading: false });
                } else {
                    // enrolled is true from addToPromo but the user is NON-BI, we need to show them the landing page so they see BI Sign Up Insturctions
                    // before applying the promo
                    return this.setState({ pageType: LANDING, isLoading: false });
                }
            }
        } catch (err) {
            const errorCode = err?.errors?.errorCode || err?.errors?.[0]?.errorCode || ERROR.CUSTOM_ADVOCACY_DOWN;
            this.setErrorState(errorCode);
            this.setState({ addToPromoSuccess: false });
        } finally {
            this.setState({ hasCalledEnrolled: false });
        }
    };

    enrollUser = async isEnrolled => {
        const {
            campaignData: { referralToken },
            campaignCode,
            referrerCode,
            checksum,
            hasCalledEnrolled
        } = this.state;

        if (hasCalledEnrolled || isEnrolled) {
            return;
        }

        // This data is needed for RwdAdvocacy calls
        const profileId = Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID);
        let biDataObject = Empty.Object;
        BIApi.getBiProfile(profileId).then(biData => {
            if (biData?.email && biData?.biAccountId) {
                const userDemographicLoginData = {
                    email: biData.email,
                    firstName: biData.firstName || '',
                    lastName: biData.lastName || '',
                    signupDate: biData.signupDate || '',
                    biAccountId: biData.biAccountId
                };

                biDataObject = userDemographicLoginData;
            }

            const {
                email, firstName, lastName, signupDate, biAccountId
            } = biDataObject;

            // To be used elsewhere in this file
            this.setState({ biAccountId });

            const userId = this.getUserId();
            const enrollPayload = {
                referrerCode,
                campaignCode,
                refereeUsaId: userId || biAccountId,
                refereeEmail: userUtils.getProfileEmail() || email,
                refereeFirstName: userUtils.getProfileFirstName() || firstName,
                refereeLastName: userUtils.getProfileLastName() || lastName,
                registrationDate: userUtils.formatUserRegistrationDate() || signupDate
            };

            const oldEnrollPayload = {
                referrerCode,
                campaignCode,
                userId
            };

            if (Sephora.configurationSettings.isReferralShareLinkEnhancement) {
                enrollPayload.checksum = checksum;
                oldEnrollPayload.checksum = checksum;
            }

            isRMSWithSDNEnabled ? this.enrollUserSDN(enrollPayload, referralToken) : this.enrollUserATG(oldEnrollPayload, referralToken);
        });
    };

    // eslint-disable-next-line consistent-return
    validateCampaign = () => {
        const { enrolled } = this.state.campaignData || Empty.Object;
        const userIsAnonymous = userUtils.isAnonymous();
        const userIsBi = userUtils.isBI();
        const currentProfileStatus = this.state?.profileStatus;
        const currentBiAccountId = this.state?.biAccountId;

        // Using if else chain so only ONE of the following ever gets executed.
        if (enrolled && userIsBi) {
            // If they are enrolled then return asap
            this.getCampaignDates();

            return this.setState({ pageType: SUCCESS, isLoading: false });
        } else if (userIsAnonymous || (!userIsBi && !currentBiAccountId && currentProfileStatus !== 4)) {
            // If the user is anonymous OR if the user is not a BI user, does not have a BI account ID,
            // AND the profile status is not 4
            return this.setState({ pageType: LANDING, isLoading: false });
        } else if (!enrolled && !isRMSWithSDNEnabled) {
            // ATG FLOW for non-enrolled users
            this.enrollUser();
        } else if (!enrolled && isRMSWithSDNEnabled && this.state.addToPromoSuccess === false) {
            // SDN/RMS flow for non-enrolled users
            this.enrollUser();
        }
    };

    getCampaignDetailsATG = payload => {
        decorators
            .withInterstice(utilityApi.getAdvocacyLandingPageContent)(payload, true)
            .then(data => {
                this.setState(
                    {
                        campaignData: data
                    },
                    () => {
                        this.validateCampaign(true);
                    }
                );
            })
            .catch(err => {
                this.setErrorState(err?.errors?.errorCode || ERROR.CUSTOM_ADVOCACY_DOWN);
            });
    };

    getCampaignDetailsSDN = async payload => {
        // Prevent another call to validate if already successfully enrolled
        // Just show them the barcode
        if (this.state.addToPromoSuccess && this.state?.campaignData?.enrolled) {
            this.setState({
                pageType: SUCCESS,
                isLoading: false
            });

            return;
        }

        try {
            // Await the API call to get the campaign details
            const data = await decorators.withInterstice(utilityApi.getAdvocacyLandingPageContentSDN)(payload, true);
            this.setState({ campaignData: data });

            // This will be true if addToPromo was successful
            const { enrolled } = this.state.campaignData || Empty.Object;

            // If not yet enrolled, call enrollUser
            if (this.props.auth.profileStatus === 4 && !enrolled && !this.state.addToPromoSuccess) {
                // Make sure to wait for the enrollment to complete
                await this.enrollUser(enrolled);
            } else {
                this.validateCampaign();
            }
        } catch (err) {
            this.setErrorState(err?.errors[0]?.errorCode || ERROR.CUSTOM_ADVOCACY_DOWN);
        }
    };

    getCampaignDetails = async ({ campaignCode, referrerCode, checksum, biAccountId }) => {
        const refereeUsaId = biAccountId || Storage.local.getItem(LOCAL_STORAGE.BI_ACCOUNT_ID);

        const commonPayload = {
            campaignCode,
            referrerCode,
            checksum
        };

        const payloadSDN = { ...commonPayload, refereeUsaId };
        const payloadATG = { ...commonPayload, userId: biAccountId };

        // Call endpoint differs based on KS
        isRMSWithSDNEnabled ? this.getCampaignDetailsSDN(payloadSDN) : this.getCampaignDetailsATG(payloadATG);
    };

    getContentfulData = ({ campaignCode, referrerCode, checksum, biAccountId }) => {
        const { country, language } = Sephora.renderQueryParams;

        getContent({
            language,
            country,
            path: `/advocacy/${campaignCode}`
        })
            .then(({ data }) => {
                if (data) {
                    if (data.excludeCountry) {
                        this.setErrorState(ERROR.ERR_CAMP_REF_INVALID_COUNTRY);
                    } else {
                        this.setState(
                            {
                                contentfulData: data
                            },
                            () => {
                                this.getCampaignDetails({ campaignCode, referrerCode, checksum, biAccountId });
                            }
                        );
                    }
                } else {
                    this.setErrorState(ERROR.ERR_CAMP_REF_INVALID);
                }
            })
            .catch(_err => {
                this.setErrorState(ERROR.ERR_CAMP_REF_INVALID);
            });
    };

    getAdvocacyContentAndValidate = () => {
        const [page, referrerCode, campaignCode, checksum] = urlUtils.getPathStrings().slice(1);

        this.setState({
            referrerCode,
            campaignCode,
            checksum
        });

        if (page === SHARE && referrerCode && campaignCode) {
            if (this.props.isBiPointsAvailable !== undefined && !this.props.isBiPointsAvailable) {
                this.setErrorState(ERROR.CUSTOM_BI_DOWN);
            } else {
                const { profileStatus: profileStatusSaved, biAccountId: biAccountIdSaved, contentfulData } = this.state;
                const { beautyInsiderAccount: { biAccountId } = {} } = this.props.user;
                const { profileStatus } = this.props.auth;

                // If we have this data already, it means we already evaluated the campaign
                // If so, just return to avoid double evaluation
                if (profileStatus === profileStatusSaved && biAccountId === biAccountIdSaved) {
                    return;
                } else {
                    this.setState({
                        profileStatus,
                        biAccountId
                    });
                }

                const params = {
                    campaignCode,
                    referrerCode,
                    checksum,
                    biAccountId
                };

                if (!contentfulData) {
                    this.getContentfulData(params);
                } else {
                    this.getCampaignDetails(params);
                }
            }
        } else {
            this.setErrorState(ERROR.ERR_CAMP_REF_INVALID);
        }
    };

    componentDidMount() {
        const { isInitialized } = this.props.user || {};

        if (isInitialized) {
            this.getAdvocacyContentAndValidate();
        }
    }

    componentDidUpdate(prevProps) {
        // Don't re-evaluate if we've already reached a terminal state (SUCCESS or ERROR)
        if (this.state.pageType === PAGE_TYPES.SUCCESS || this.state.pageType === PAGE_TYPES.ERROR_PAGE) {
            return;
        }

        if (
            this.props.user?.isInitialized &&
            (!prevProps.user.isInitialized ||
                this.props.auth.profileStatus !== prevProps.auth.profileStatus ||
                prevProps.isBiPointsAvailable !== this.props.isBiPointsAvailable)
        ) {
            this.getAdvocacyContentAndValidate();
        }
    }

    getCampaignDates = (data = {}) => {
        const { startDate: rmsStartDate, expirationDate: rmsExpirationDate } = data;
        const { successPromoStartDate, successPromoEndDate } = this.state.contentfulData || {};

        const promoStartDate = rmsStartDate || successPromoStartDate;
        const promoEndDate = rmsExpirationDate || successPromoEndDate;

        this.setState({
            promoStartDate,
            promoEndDate
        });
    };

    setErrorState = errors => {
        this.setState({
            isLoading: false,
            pageType: ERROR_PAGE,
            errors
        });
    };

    onBiConversionSuccess = () => {
        // Update state to reflect BI conversion success
        this.setState({ pageType: SUCCESS, isLoading: false });
    };

    render() {
        const {
            globalHeroBanner,
            globalInvitationText,
            referralOfferDescription,
            referralDisclaimer,
            referralInstructions,
            successConfirmationText,
            successInstructions,
            successDiscountDescription,
            successDisclaimer,
            successCtaLink,
            successCouponCode
        } = this.state?.contentfulData || {};

        const {
            promoStartDate, promoEndDate, isLoading, pageType, errors
        } = this.state;

        const { referrerFirstName, barCodeText, campaignType } = this.state.campaignData || {};

        if (isLoading) {
            return null;
        } else {
            if (errors) {
                return (
                    <AdvocacyError
                        error={errors}
                        pageType={pageType}
                    />
                );
            }

            if (pageType === SUCCESS) {
                return (
                    <AdvocacySuccess
                        globalHeroBanner={globalHeroBanner}
                        globalInvitationText={globalInvitationText}
                        successConfirmationText={successConfirmationText}
                        successInstructions={successInstructions}
                        successDiscountDescription={successDiscountDescription}
                        successDisclaimer={successDisclaimer}
                        successCtaLink={successCtaLink}
                        successPromoStartDate={promoStartDate}
                        successPromoEndDate={promoEndDate}
                        successCouponCode={successCouponCode}
                        referrerFirstName={referrerFirstName}
                        pageType={pageType}
                    />
                );
            }

            if (pageType === LANDING) {
                return (
                    <AdvocacyLanding
                        globalHeroBanner={globalHeroBanner}
                        globalInvitationText={globalInvitationText}
                        referralOfferDescription={referralOfferDescription}
                        referralInstructions={referralInstructions}
                        referralDisclaimer={referralDisclaimer}
                        referrerFirstName={referrerFirstName}
                        barCodeText={barCodeText}
                        campaignType={campaignType}
                        isFnF={this.isFnF(campaignType)}
                        pageType={pageType}
                        onBiConversionSuccess={this.onBiConversionSuccess}
                    />
                );
            }
        }

        return null;
    }
}

export default wrapComponent(RwdAdvocacy, 'RwdAdvocacy', true);
