import store from 'Store';
import profileActions from 'actions/ProfileActions';
import userUtils from 'utils/User';
import authentication from 'utils/Authentication';
import actions from 'actions/Actions';
import urlUtils from 'utils/Url';
import watch from 'redux-watch';

const getCommunityUrl = function () {
    return `https://${Sephora.configurationSettings.communitySiteHost}`;
};

// api call requires a social provider but only accepts either 'lithium' or 'bv'
const PROVIDER_TYPES = {
    lithium: 'lithium',
    bv: 'bv'
};

const COMMUNITY_URLS = {
    CONVERSATIONS: '/t5/user/viewprofilepage/user-id/',
    GROUPS: '/t5/custom/page/page-id/GroupsLandingPage',
    FORUM: '/t5/forums/postpage/choose-node/true/interaction-style/forum',
    NOTIFICATIONS: '/t5/notificationfeed/page',
    MESSAGES: '/t5/notes/privatenotespage',
    PUBLIC_LOOKS_PROFILE: '/community/gallery/album/',
    MY_LOOKS_PROFILE: '/community/gallery/myprofile',
    ADD_PHOTO: '/community/gallery/add-photo',
    GALLERY: '/community/gallery',
    NEW_PUBLIC_LOOKS_PROFILE: '/community/gallery/users/',
    NEW_MY_LOOKS_PROFILE: '/community/gallery/mygallery'
};

const COMMUNITY_BADGES = {
    '/html/rank_icons/rank_newcomer': 'Newcomer',
    '/html/rank_icons/rank_newcomer-01': 'Newcomer',
    '/html/rank_icons/rank_newcomer-02': 'Newcomer',
    '/html/rank_icons/rank_newcomer-03': 'Newcomer',
    '/html/rank_icons/rank_rising-star': 'Rising Star',
    '/html/rank_icons/rank_rising-star-01': 'Rising Star',
    '/html/rank_icons/rank_rising-star-02': 'Rising Star',
    '/html/rank_icons/rank_rising-star-03': 'Rising Star',
    '/html/rank_icons/rank_rookie': 'Rookie',
    '/html/rank_icons/rank_rookie-01': 'Rookie',
    '/html/rank_icons/rank_rookie-02': 'Rookie',
    '/html/rank_icons/rank_rookie-03': 'Rookie',
    '/html/rank_icons/rank_go-getter': 'Go-Getter',
    '/html/rank_icons/rank_go-getter-01': 'Go-Getter',
    '/html/rank_icons/rank_go-getter-02': 'Go-Getter',
    '/html/rank_icons/rank_go-getter-03': 'Go-Getter',
    '/html/rank_icons/rank_boss': 'Boss',
    '/html/rank_icons/rank_boss-01': 'Boss',
    '/html/rank_icons/rank_boss-02': 'Boss',
    '/html/rank_icons/rank_boss-03': 'Boss',
    '/html/rank_icons/birole_insider': 'Insider',
    '/html/rank_icons/birole_vib': 'VIB',
    '/html/rank_icons/birole_rouge': 'Rouge',
    '/html/rank_icons/role_admin': 'Admin',
    '/html/rank_icons/role_mod': 'Mod'
};

const showRegistrationModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(
            actions.showRegisterModal({
                isOpen: true,
                callback: resolve,
                errback: reject
            })
        );
    });
};

const showBiRegisterModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(
            actions.showBiRegisterModal({
                isOpen: true,
                callback: resolve,
                isCommunity: true,
                cancellationCallback: reject
            })
        );
    });
};

// provider type arg is required for social register api call, it fails without it
// if socialProvider comes in as null, set it to lithium as default
const showSocialRegistrationModal = (socialProvider = PROVIDER_TYPES.lithium) => {
    return new Promise((resolve, reject) => {
        store.dispatch(profileActions.showSocialRegistrationModal(true, userUtils.isBI(), socialProvider));

        //when isLithiumSuccessful is set to true, we want to resolve promise to run
        //the 'then' code, when isLithiumSuccessful is set to false we want to reject
        //the promise so that we call the 'catch' code
        const socialInfoWatch = watch(store.getState, 'socialInfo.isLithiumSuccessful');
        store.subscribe(
            socialInfoWatch(isLithiumSuccessful => {
                if (isLithiumSuccessful) {
                    resolve();
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject();
                }
            }),
            { ignoreAutoUnsubscribe: true }
        );
    });
};

const showSocialReOptModal = () => {
    return new Promise((resolve, reject) => {
        store.dispatch(profileActions.showSocialReOptModal(true, resolve, reject));
    });
};

/**
 * user must be atleast recognized to launch social action
 * user must be fully signed in before launching any social registration modal
 * if user is not bi but is social, we launch bi registration modal
 * if user is not social, we launch social registration modal
 * if user needs to re opt their current social user, we launch the re opt modal
 * otherwise, we launch the social action
 * you can see how ensureUserIsReadyForSocialAction is implemented in:
 *  - AddReview/AddReviewCarousel/AddReviewCarousel.c.js
 *  - RichProfile/UserProfile/common/AboutMeSlideShow/AboutMeSlideshow.c.js
 */
const ensureUserIsReadyForSocialAction = function (socialProvider) {
    return authentication
        .requireRecognizedAuthentication()
        .then(() => {
            let promise = Promise.resolve();

            if (!userUtils.isBI() && userUtils.isSocial()) {
                promise = authentication.requireLoggedInAuthentication().then(() => showBiRegisterModal());
            } else if (!userUtils.isSocial()) {
                promise = authentication.requireLoggedInAuthentication().then(() => showSocialRegistrationModal(socialProvider));
            } else if (userUtils.needsSocialReOpt()) {
                promise = authentication.requireLoggedInAuthentication().then(() => showSocialReOptModal());
            }

            return promise;
        })
        .catch(reason => {
            // eslint-disable-next-line no-console
            console.debug('oops! user sign in required');

            return Promise.reject(reason);
        });
};

const socialCheckLink = function (url, socialProvider) {
    ensureUserIsReadyForSocialAction(socialProvider)
        .then(() => {
            urlUtils.redirectTo(url);
        })
        .catch(() => {});
};

//used for when user tries to signin from a lithium hosted page
const launchSocialSignInFlow = function () {
    //re-using ensureUserIsReadyForSocialAction since sign in flow is the same
    return ensureUserIsReadyForSocialAction();
};

//used for when user tries to register from a lithium hosted page
const launchSocialRegisterFlow = function () {
    //if user is registering, only option to open afterwards is
    //social registration modal, since new user will need nickname
    return showRegistrationModal().then(() => showSocialRegistrationModal());
};

const community = {
    getCommunityUrl,
    PROVIDER_TYPES,
    COMMUNITY_URLS,
    COMMUNITY_BADGES,
    socialCheckLink,
    ensureUserIsReadyForSocialAction,
    launchSocialSignInFlow,
    launchSocialRegisterFlow,
    showSocialRegistrationModal
};

export default community;
