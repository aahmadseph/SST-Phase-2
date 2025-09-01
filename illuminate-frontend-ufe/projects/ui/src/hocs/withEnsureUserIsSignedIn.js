import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import framework from 'utils/framework';
import actions from 'Actions';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import communityUtils from 'utils/Community';
import authentication from 'utils/Authentication';

const { getLink, getIsGuestParamValue } = urlUtils;
const { wrapHOC, wrapHOCComponent } = framework;
const fields = createStructuredSelector({ user: userSelector, auth: authSelector });

const functions = {
    showSignInModal: actions.showSignInModal
};

const withEnsureUserIsSignedIn = compose(
    wrapHOC(connect(fields, functions)),
    wrapHOC(WrappedComponent => {
        const isMyGalleryPage = WrappedComponent?.WrappedComponent?.displayName === 'MyGalleryPage';
        const isReservationDetailsPage = Location.isReservationDetailsPage();
        class EnsureUserIsSignedIn extends Component {
            async componentDidMount() {
                try {
                    if (this.props.auth.profileStatus !== userUtils.PROFILE_STATUS.LOGGED_IN) {
                        if (getIsGuestParamValue()) {
                            return;
                        }

                        if (isReservationDetailsPage) {
                            Location.navigateTo(null, '/happening/reservations');
                        }

                        await authentication.requireLoggedInAuthentication();

                        if (!userUtils.isSocial() && isMyGalleryPage) {
                            await authentication.requireLoggedInAuthentication();
                            communityUtils.showSocialRegistrationModal();
                        }
                    }
                } catch (err) {
                    if (isMyGalleryPage) {
                        const targetUrl = getLink('/community/gallery');
                        Location.navigateTo(null, targetUrl);
                    }
                }
            }

            render() {
                const {
                    // eslint-disable-next-line no-unused-vars
                    user,
                    ...propsToRender
                } = this.props;

                return <WrappedComponent {...propsToRender} />;
            }
        }

        return wrapHOCComponent(EnsureUserIsSignedIn, 'EnsureUserIsSignedIn', [WrappedComponent]);
    })
);

export { withEnsureUserIsSignedIn };
