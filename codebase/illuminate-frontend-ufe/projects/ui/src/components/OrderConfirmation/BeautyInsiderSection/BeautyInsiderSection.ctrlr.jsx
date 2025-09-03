/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Text, Divider, Button
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import MyBeautyBank from 'components/OrderConfirmation/BeautyInsiderSection/MyBeautyBank/MyBeautyBank';
import BiRegisterForm from 'components/BiRegisterForm/BiRegisterForm';
import SubscribeEmail from 'components/SubscribeEmail/SubscribeEmail';
import userUtils from 'utils/User';
import store from 'store/Store';
import userActions from 'actions/UserActions';
import locationUtils from 'utils/Location';
import profileApi from 'services/api/profile';
import anaUtils from 'analytics/utils';
import biApi from 'services/api/beautyInsider';
import Actions from 'Actions';
import scEvent from 'analytics/constants';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const showInterstice = Actions.showInterstice;

class BeautyInsiderSection extends BaseClass {
    state = {
        subscribeSephoraEmail: false
    };

    analyticsToApply = () => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                pageDetail: digitalData.page.pageInfo.pageName,
                pageType: digitalData.page.category.pageType,
                eventStrings: [scEvent.REGISTRATION_WITH_BI, scEvent.REGISTRATION_SUCCESSFUL]
            }
        });
    };

    componentDidMount() {
        if (localeUtils.isCanada()) {
            profileApi.getCurrentProfileEmailSubscriptionStatus().then(subscribed => {
                if (subscribed) {
                    this.subscribeEmail.setChecked(true);
                }
            });
        }
    }

    getOptionParams = biFormData => {
        const optionParams = {};

        if (localeUtils.isCanada() && this.subscribeEmail) {
            optionParams.subscription = { subScribeToEmails: this.subscribeEmail.getValue() };
        }

        optionParams.isJoinBi = !!biFormData;
        optionParams.biAccount = biFormData;

        return optionParams;
    };

    biRegister = () => {
        const biFormData = this.biRegForm.getBIDate();
        const hasErrors = this.biRegForm.validateForm();
        const biInfo = this.props.biInfo;

        if (!hasErrors) {
            const optionParams = this.getOptionParams(biFormData);

            if (biInfo && biInfo.earnedPoints) {
                optionParams.updateBiPoints = true;
            }

            if (this.props.showBirthdayForAutoEnrolled) {
                store.dispatch(showInterstice(true));
                biApi
                    .updateBiAccount(optionParams, locationUtils.isOrderConfirmationPage())
                    .then(() => {
                        store.dispatch(userActions.getUserFull());
                        store.dispatch(showInterstice(false));
                    })
                    .catch(response => {
                        if (response?.errors?.biBirthDayInput) {
                            this.biRegForm.setErrorState(response.errors.biBirthDayInput.join());
                        }

                        store.dispatch(showInterstice(false));
                    });
            } else {
                store.dispatch(showInterstice(true));
                biApi
                    .createBiAccount(optionParams)
                    .then(data => {
                        if (data?.biAccountId) {
                            Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, data.biAccountId);
                        }

                        store.dispatch(userActions.getUserFull(null, this.analyticsToApply));
                        store.dispatch(showInterstice(false));
                    })
                    .catch(response => {
                        if (response?.errors?.biBirthDayInput) {
                            this.biRegForm.setErrorState(response.errors.biBirthDayInput.join());
                        }

                        store.dispatch(showInterstice(false));
                    });
            }
        }
    };

    setDataForNextPage = () => {
        anaUtils.setNextPageData({ linkData: 'order confirmation:edit profile' });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/BeautyInsiderSection/locales', 'BeautyInsiderSection');
        const { showBirthdayForAutoEnrolled, biInfo = {}, biStatus, hasAllTraits } = this.props;

        const statusDisplay = userUtils.displayBiStatus(biStatus);
        const isCanada = localeUtils.isCanada();
        const showSubscribeEmail = !showBirthdayForAutoEnrolled && isCanada;

        const subscribeEmailComponent = (
            <SubscribeEmail
                checked={this.state.subscribeSephoraEmail || isCanada}
                disabled={false}
                ref={c => {
                    if (c !== null) {
                        this.subscribeEmail = c;
                    }
                }}
            />
        );

        const joinBIorUpdateBirthday = (
            <React.Fragment>
                <BiRegisterForm
                    isOrderConfirmation={true}
                    isCanadaCheckout={isCanada}
                    showBirthdayForAutoEnrolled={showBirthdayForAutoEnrolled}
                    signUpPoints={biInfo.earnedPoints}
                    ref={c => {
                        if (c !== null) {
                            this.biRegForm = c;
                        }
                    }}
                    subscribeEmail={showSubscribeEmail && subscribeEmailComponent}
                />
                <Box marginTop={4}>
                    <Button
                        variant='primary'
                        block={true}
                        data-at={Sephora.debug.dataAt('join_beauty_insider')}
                        onClick={this.biRegister}
                    >
                        {getText(showBirthdayForAutoEnrolled ? 'submit' : 'joinBI')}
                    </Button>
                </Box>
                {showBirthdayForAutoEnrolled && (
                    <React.Fragment>
                        <Divider
                            marginTop={5}
                            marginBottom={4}
                        />
                        <MyBeautyBank {...biInfo} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );

        return (
            <div>
                {biStatus !== userUtils.types.NON_BI && !showBirthdayForAutoEnrolled ? (
                    <React.Fragment>
                        <Image
                            disableLazyLoad={true}
                            display='block'
                            alt={statusDisplay}
                            src={'/img/ufe/bi/logo-' + statusDisplay.toLowerCase() + '.svg'}
                            width={184}
                            height={28}
                            marginBottom={3}
                            marginX='auto'
                        />
                        {!hasAllTraits && (
                            <div>
                                <Text
                                    is='p'
                                    textAlign='center'
                                    marginBottom={3}
                                >
                                    {getText('tellUsText')}
                                </Text>
                                <Button
                                    variant='secondary'
                                    block={true}
                                    onClick={this.setDataForNextPage}
                                    href='/profile/me?edit=true'
                                >
                                    {getText('finishYourProfile')}
                                </Button>
                                <Divider
                                    marginTop={5}
                                    marginBottom={4}
                                />
                            </div>
                        )}
                        <MyBeautyBank {...biInfo} />
                    </React.Fragment>
                ) : (
                    joinBIorUpdateBirthday
                )}
            </div>
        );
    }
}

export default wrapComponent(BeautyInsiderSection, 'BeautyInsiderSection');
