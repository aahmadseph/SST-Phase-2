/* eslint-disable object-curly-newline */

/* eslint-disable no-template-curly-in-string */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import urlUtils from 'utils/Url';
import biProfileUtils from 'utils/BiProfile';
import utilityApi from 'services/api/utility';
import { SHARE, ERROR, CAMPAIGN_TYPE, ACTION_TYPE } from './constants';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import userUtils from 'utils/User';
import LandingPage from './ReferrerViews/ReferrerLanding';
import SuccessPage from './ReferrerViews/ReferrerSuccess';
import ErrorMessage from './ReferrerViews/ReferrerError';
import analyticsUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import decorators from 'utils/decorators';
import { UserInfoReady } from 'constants/events';

function isBiSignUp(code) {
    return code === CAMPAIGN_TYPE.BISIGNUP;
}

function isFnF(code) {
    return code === CAMPAIGN_TYPE.FNF;
}

const isRMSWithSDNEnabled = Sephora.configurationSettings.isRMSWithSDNEnabled;

class Referrer extends BaseClass {
    state = {
        isDataReady: false,
        page: null,
        referrerCode: null,
        campaignCode: null,
        checksum: null,
        errors: null,
        showSuccess: false,
        hasCalledUpfrontValidation: false,
        hasCalledEnrolled: false,
        profileStatus: null,
        biAccountId: null
    };

    componentDidMount() {
        const [page, referrerCode, campaignCode, checksum] = urlUtils.getPathStrings().slice(1);
        const onLastLoadEvent = Sephora.Util.onLastLoadEvent;
        this.dispatch({
            type: ACTION_TYPE.SET_CAMPAIGN_DATA,
            payload: {
                page,
                referrerCode,
                campaignCode,
                checksum
            }
        });
        onLastLoadEvent(window, [UserInfoReady], () => {
            if (page === SHARE && referrerCode && campaignCode) {
                store.setAndWatch(['user', 'auth'], this, ({ user, auth }) => {
                    if (!userUtils.isAnonymous() && biProfileUtils.isBiDown()) {
                        // Show error if BI is down
                        this.dispatch({
                            type: ACTION_TYPE.SHOW_ERROR,
                            payload: ERROR.CUSTOM_BI_DOWN
                        });

                        return;
                    } else {
                        const { hasCalledUpfrontValidation, profileStatus: profileStatusSaved, biAccountId: biAccountIdSaved } = this.state;

                        const profileStatus = auth?.profileStatus;
                        const biAccountId = user?.beautyInsiderAccount?.biAccountId;

                        // If we have this data already, it means we already evaluated the campaign
                        // If so, just return to avoid double evaluation
                        if (profileStatus === profileStatusSaved && biAccountId === biAccountIdSaved) {
                            return;
                        } else {
                            // Reset Status
                            this.dispatch({ type: ACTION_TYPE.RESET });
                            // Save the data for evaluation
                            this.dispatch({
                                type: ACTION_TYPE.SET_CAMPAIGN_DATA,
                                payload: {
                                    profileStatus,
                                    biAccountId
                                }
                            });
                        }

                        if (!hasCalledUpfrontValidation) {
                            // Make the upfront validation call
                            this.getAdvocacyLandingPageContent({
                                referrerCode,
                                campaignCode,
                                checksum
                            });
                        } else {
                            this.validateCampaign(true);
                        }
                    }
                });
            } else {
                this.dispatch({
                    type: ACTION_TYPE.SHOW_ERROR,
                    payload: ERROR.ERR_CAMP_REF_INVALID
                });
            }
        });
    }

    dispatch = ({ type, payload }) => {
        switch (type) {
            case ACTION_TYPE.SHOW_ERROR:
                return this.setState({ errors: { errorCode: payload } });
            case ACTION_TYPE.SHOW_LANDING_PAGE:
                return this.setState({
                    isDataReady: true,
                    showSuccess: false
                });
            case ACTION_TYPE.SHOW_SUCCESS_PAGE:
                return this.setState({
                    isDataReady: true,
                    showSuccess: true
                });
            case ACTION_TYPE.SET_CAMPAIGN_DATA: {
                return this.setState({ ...payload });
            }
            case ACTION_TYPE.RESET: {
                return this.setState({
                    isDataReady: false,
                    showSuccess: false
                });
            }
            default:
                return null;
        }
    };

    enrollUser = () => {
        const { referralToken, referrerCode, campaignCode, checksum, hasCalledEnrolled } = this.state;

        if (hasCalledEnrolled) {
            return;
        }

        const userId = this.getUserId();
        // Enroll API needs the user to be fully signed in, so it will return FORBIDDEN if the user is recognized
        // so ufeApi will manually convert the user from profileStatus 4 to 2, and hitting this method again,
        // but this method is already on the queue to go through once signed in,
        // so we are avoiding adding it to queue again
        this.setState({ hasCalledEnrolled: true });
        const enrollPayload = {
            referrerCode,
            campaignCode,
            userId
        };

        if (Sephora.configurationSettings.isReferralShareLinkEnhancement) {
            enrollPayload.checksum = checksum;
        }

        decorators
            .withInterstice(utilityApi.enrollCampaign)(enrollPayload, referralToken)
            .then(data => {
                this.setCampaignData(data);
                this.formatDates(data);
                this.dispatch({ type: ACTION_TYPE.SHOW_SUCCESS_PAGE });
            })
            .catch(err => {
                this.setState({ hasCalledEnrolled: false });
                this.handleErrorFromApi(err);
            });
    };

    formatDates = (data = {}) => {
        const { startDate: rmsStartDate, expirationDate: rmsExpirationDate } = data;
        const { startDate: bccStartDate, expirationDate: bccExpirationDate, promoDisclaimer = '' } = this.state;
        const startDate = rmsStartDate || bccStartDate;
        const expirationDate = rmsExpirationDate || bccExpirationDate;
        const isCanada = localeUtils.isCanada();
        let formattedStartDate = '';
        let formattedExpirationDate = '';
        const parseDayOfWeek = (YYYY, MM, DD) => {
            const month = Number(MM) - 1;

            return dateUtils.getDayOfWeek(new Date(YYYY, month, DD), false, true);
        };
        const parseDate = date => {
            const [YYYY, MM, DD] = date.substr(0, 10).split('-');
            const YY = YYYY.substr(2);

            return isCanada ? `${parseDayOfWeek(YYYY, MM, DD)}, ${DD}/${MM}/${YY}` : `${parseDayOfWeek(YYYY, MM, DD)}, ${MM}/${DD}/${YY}`;
        };

        if (startDate) {
            formattedStartDate = parseDate(startDate);
        }

        if (expirationDate) {
            formattedExpirationDate = parseDate(expirationDate);
        }

        const disclaimerWithDates = promoDisclaimer.replace('${startDate}', formattedStartDate).replace('${endDate}', formattedExpirationDate);
        this.setCampaignData({
            startDate: formattedStartDate,
            expirationDate: formattedExpirationDate,
            promoDisclaimer: disclaimerWithDates
        });
    };

    getAdvocacyLandingPageContent = ({ referrerCode, campaignCode, checksum }) => {
        const userId = this.getUserId();

        const apiMethod = isRMSWithSDNEnabled ? utilityApi.getAdvocacyLandingPageContentSDN : utilityApi.getAdvocacyLandingPageContent;

        const payload = {
            referrerCode,
            campaignCode,
            checksum
        };

        // SDN uses refereeUsaId as userid instead of userId (ATG)
        const userIdProperty = isRMSWithSDNEnabled ? 'refereeUsaId' : 'userId';
        payload[userIdProperty] = userId;

        decorators
            .withInterstice(apiMethod)(payload)
            .then(data => {
                this.setCampaignData({
                    ...data,
                    hasCalledUpfrontValidation: true
                });
                this.validateCampaign();
            })
            .catch(this.handleErrorFromApi);
    };

    getUserId = () => {
        return biProfileUtils.getBiAccountId();
    };

    handleErrorFromApi = err => {
        this.dispatch({
            type: ACTION_TYPE.SHOW_ERROR,
            payload: isRMSWithSDNEnabled ? err?.errors[0]?.errorCode : err?.errors?.errorCode
        });
    };

    handleShopNowClick = () => {
        const { successCTALink = '/' } = this.state;
        const prop55 = anaConsts.LinkData.ADV_SHOP_NOW;
        analyticsUtils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            linkData: prop55
        });
        urlUtils.redirectTo(successCTALink);
    };

    setCampaignData = data => {
        this.dispatch({
            type: ACTION_TYPE.SET_CAMPAIGN_DATA,
            payload: { ...data }
        });
    };

    validateCampaign = callEnrollApi => {
        const { campaignType, enrolled } = this.state;
        const shouldEnrollUser = callEnrollApi || !enrolled;

        // Anonymous or Non-BI
        if (userUtils.isAnonymous() || !userUtils.isBI()) {
            this.dispatch({ type: ACTION_TYPE.SHOW_LANDING_PAGE });

            return;
        }

        if (isBiSignUp(campaignType)) {
            // BISIGNUP & User has just registered, we need to enroll them
            if (Sephora?.referrer?.hasRegister) {
                // clean the object
                Sephora.referrer.hasRegister = null;
                this.enrollUser();
            } else {
                // BISIGNUP & BI -> Error
                this.dispatch({
                    type: ACTION_TYPE.SHOW_ERROR,
                    payload: ERROR.CUSTOM_ALREADY_BI
                });
            }

            return;
        }

        if (shouldEnrollUser) {
            this.enrollUser();
        } else {
            this.formatDates();
            this.dispatch({ type: ACTION_TYPE.SHOW_SUCCESS_PAGE });
        }
    };

    render() {
        const { topBanner, showSuccess, isDataReady, errors, campaignType } = this.state;

        return (
            <LegacyContainer marginTop={Sephora.isDesktop() && 5}>
                {errors ? (
                    <ErrorMessage
                        handleShopNowClick={this.handleShopNowClick}
                        {...this.state}
                    />
                ) : (
                    <React.Fragment>
                        <BccComponentList items={topBanner} />
                        {isDataReady ? (
                            showSuccess ? (
                                <SuccessPage
                                    handleShopNowClick={this.handleShopNowClick}
                                    {...this.state}
                                />
                            ) : (
                                <LandingPage
                                    {...this.state}
                                    isFnF={isFnF(campaignType)}
                                    isBiSignUp={isBiSignUp(campaignType)}
                                />
                            )
                        ) : null}
                    </React.Fragment>
                )}
            </LegacyContainer>
        );
    }
}

export default wrapComponent(Referrer, 'Referrer', true);
