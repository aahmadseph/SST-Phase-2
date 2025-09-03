import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import PublicProfile from 'components/RichProfile/UserProfile/PublicProfile/PublicProfile';
import PrivateProfile from 'components/RichProfile/UserProfile/PrivateProfile/PrivateProfile';
import MyProfile from 'components/RichProfile/UserProfile/MyProfile/MyProfile';
import CommunityError from 'components/RichProfile/CommunityError/CommunityError';
import PleaseSignInProfileBlock from 'components/RichProfile/UserProfile/PleaseSignInProfile';
import ufeApi from 'services/api/ufeApi';
import profileApi from 'services/api/profile';
import communityUtils from 'utils/Community';
import urlUtils from 'utils/Url';
import location from 'utils/Location';

const { getCallsCounter } = ufeApi;

class UserProfile extends BaseClass {
    state = {
        isMyProfile: null,
        userNickname: null,
        userExists: null,
        isError: false,
        showPleaseSignInBlock: false,
        isPrivate: false
    };

    componentDidMount() {
        const isMyProfile = location.isMyProfilePage();

        if (isMyProfile) {
            //checking query params for logging in /registering from community.sephora.com
            //if query param launchSocialSignInFlow is present, force socialSignInFlow
            //if query param launchSocialRegisterFlow is present, force socialRegisterFlow
            //whether flows are a success or not, redirect to redirectUrl available in params
            //if params aren't available proceed as normal with rendering of private profile
            const params = urlUtils.getParams();

            if (params.launchSocialSignInFlow && params.provider && params.nextpage) {
                communityUtils
                    .launchSocialSignInFlow()
                    .then(() => {
                        urlUtils.redirectTo(params.nextpage[0]);
                    })
                    .catch(() => {
                        urlUtils.redirectTo(params.nextpage[0]);
                    });
            } else if (params.launchSocialRegisterFlow && params.provider && params.nextpage) {
                communityUtils
                    .launchSocialRegisterFlow()
                    .then(() => {
                        urlUtils.redirectTo(params.nextpage[0]);
                    })
                    .catch(() => {
                        urlUtils.redirectTo(params.nextpage[0]);
                    });
            } else {
                this.setState({
                    isMyProfile,
                    showPleaseSignInBlock: false
                });

                //Analytics
                digitalData.page.category.pageType = 'cmnty profile';
                digitalData.page.pageInfo.pageName = 'my-profile';
            }
        } else {
            const nickname = this.getUserNicknameFromMyProfilePath(window.location.pathname);

            this.checkIfUserExists(nickname)
                .then(({ isPrivate }) => {
                    this.setState({
                        isPrivate: isPrivate,
                        isMyProfile,
                        userNickname: nickname,
                        userExists: true,
                        showPleaseSignInBlock: false
                    });
                })
                .catch(r => {
                    // There can be other reasons that we may have to handle.
                    // However, `false` is an explicit reason for when the nickname
                    // does not exist.
                    if (r === false) {
                        this.setState({
                            isMyProfile,
                            userNickname: nickname,
                            userExists: false,
                            showPleaseSignInBlock: false
                        });
                    }
                });
        }
    }

    checkIfUserExists = function (nickname) {
        return new Promise((yes, no) => {
            profileApi
                .getProfileIdentifiersByNickname(nickname)
                .then(yes)
                // eslint-disable-next-line prefer-promise-reject-errors
                .catch(data => data.errorCode === -2 && no(false));
        });
    };

    getUserNicknameFromMyProfilePath = function (path) {
        const m = path.match(/^\/users\/([^\/]+)/);

        return m && m[1];
    };

    setError = () => {
        this.setState({ isError: true });
    };

    render() {
        if (this.state.isError) {
            return <CommunityError />;
        } else if (this.state.showPleaseSignInBlock) {
            return <PleaseSignInProfileBlock />;
        } else if (this.state.isMyProfile) {
            return (
                <MyProfile
                    handleError={this.setError}
                    requestCounter={getCallsCounter()}
                />
            );
        } else if (this.state.userNickname) {
            if (this.state.userExists) {
                if (this.state.isPrivate) {
                    return <PrivateProfile />;
                } else {
                    return (
                        <PublicProfile
                            nickname={this.state.userNickname}
                            handleError={this.setError}
                        />
                    );
                }
            } else {
                return <CommunityError />;
            }
        } else {
            return null;
        }
    }
}

export default wrapComponent(UserProfile, 'UserProfile', true);
