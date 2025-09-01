/* eslint-disable max-len, no-console */
import apiUtil from 'utils/Api';
import cookieUtil from 'utils/Cookies';
import getLithiumSSOToken from 'services/api/profile/getLithiumSSOToken';
import userUtil from 'utils/User';
import Storage from 'utils/localStorage/Storage';
import localeUtils from 'utils/LanguageLocale';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

//TODO: 17.6 LITHIUM_API_TOKEN_COOKIE_NAME cookie name will need to be updated
const LITHIUM_API_HOST = Sephora.configurationSettings.communitySiteHost;
const LITHIUM_SESSION_KEY_COOKIE_NAME = 'LiSESSIONID';
// Since this is not really used, commenting this for now (see authenticate method below).
// const LITHIUM_BASIC_AUTH_KEY = Sephora.configurationSettings.lithiumApi.token;

const IS_LITHIUM_ENABLED = Sephora.configurationSettings.isLithiumEnabled;
const DEFAULT_BACKGROUND_URL = '/html/assets/coverphoto_default.jpg';
const BACKGROUND_PHOTO_DEFAULT = `https://${LITHIUM_API_HOST}${DEFAULT_BACKGROUND_URL}`;
const DEFAULT_AVATAR_URL =
    '/t5/image/serverpage/avatar-name/default-avatar/avatar-theme/sephora/avatar-collection/sephora/avatar-display-size/profile/version/2?xdesc=1.0';
const AVATAR_PHOTO_DEFAULT = `https://${LITHIUM_API_HOST}${DEFAULT_AVATAR_URL}`;

const LITHIUM_SSO_TOKEN_COOKIE_NAME = 'lithiumSSO:sephora.qa';

// Lithium API Doc: https://jira.sephora.com/wiki/display/ILLUMINATE/Lithium+API+-+UFE

/** ultimately makes the lithium api call
 * @param {object} options for api call
 * {
 *   @param {string} url for api request
 *   @param {string} method for api request
 *   @param {object} qsParams; i.e. queryString params for api call
 *
 *   May not be necessary:
 *   @param {object} params; i.e. data passed but not as queryString
 *   @param {object} headers; i.e. header options for api call
 * }
 */
function _lithiumApiRequest(options) {
    const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');

    if (IS_LITHIUM_ENABLED === false) {
        return Promise.reject(getText('lithiumApiRequestFailureReasonDisabled'));
    }

    const qsParams = Object.assign({}, options.qsParams, {
        'restapi.response_format': 'json',
        'profile.language': localeUtils.getCurrentLanguage().toLowerCase()
    });

    //attaches lithium api host to options.url for api call
    const opts = Object.assign({}, options, {
        url: 'https://' + LITHIUM_API_HOST + options.url,
        headers: options.headers,
        qsParams,
        params: options.params
    });

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .then(data => {
            let result;

            // For the time being, Lithium does not maintain solid structure
            // throughout its responses. That's why we need to look through
            // them carefully to tell if one is success or not.

            // NOTE: data.response exists in authentication response.
            if (data.response && data.response.status === 'success') {
                // eslint-disable-next-line no-param-reassign
                data = data.response;
                delete data.status;
                result = data;
            } else if (data.status === 'success') {
                delete data.status;
                result = data;
            } else if (data.status === 'error') {
                result = Promise.reject(data.error);
            } else {
                console.debug('Unexpected response from Lithium', data);
                result = Promise.reject(data);
            }

            return result;
        })
        .catch(reason => {
            let result;

            if (reason instanceof Error && reason.message === 'Failed to fetch') {
                // eslint-disable-next-line prefer-promise-reject-errors
                result = Promise.reject('cors 403');
            } else if (reason && reason.code === 302) {
                // Object {code: 302, message: "User authentication failed."}
                result = Promise.reject(getText('lithiumSessionExpired'));
            } else {
                result = Promise.reject(reason);
            }

            return result;
        });
}

/**
 * adds on lithium session key as an option for all lithium api calls
 */
function lithiumAuthenticatedApiRequest(options, addSessionKey = true) {
    let qsParams;

    if (addSessionKey) {
        const LITHIUM_SESSION_KEY = cookieUtil.read(LITHIUM_SESSION_KEY_COOKIE_NAME);

        qsParams = Object.assign({}, options.qsParams, { 'restapi.session_key': LITHIUM_SESSION_KEY });
    } else {
        qsParams = options.qsParams;
    }

    const opts = Object.assign({}, options, { qsParams });

    return _lithiumApiRequest(opts);
}

/**
 * uses current lithium sso token to make api call to get users lithium session key
 * will update cookie value with value returned from api call
 */
function authenticate() {
    const LITHIUM_API_TOKEN = Storage.local.getItem(LOCAL_STORAGE.LITHIUM_API_TOKEN);

    const opts = {
        url: '/restapi/vc/authentication/sessions/login',
        method: 'POST',

        // TODO (mykhaylo.gavrylyuk): Figure out why Lithium insisted on having
        // this. Allowing this header would result in OPTIONS request that would
        // fail with the below error.
        // --- Response to preflight request doesn't pass access control check:
        // --- No 'Access-Control-Allow-Origin' header is present on
        // --- the requested resource. Origin 'https://m-local.sephora.com' is
        // --- therefore not allowed access. If an opaque response serves your
        // --- needs, set the request's mode to 'no-cors' to fetch the resource
        // --- with CORS disabled.
        //
        //headers: {
        //    Authorization: `Basic ${LITHIUM_BASIC_AUTH_KEY}`
        //},

        qsParams: { 'sso.authentication_token': LITHIUM_API_TOKEN }
    };

    console.debug('Authenticating w/ Lithium...');

    return _lithiumApiRequest(opts).then(data => {
        cookieUtil.write(LITHIUM_SESSION_KEY_COOKIE_NAME, data.value.$);
    });
}

/**
 * essentially a wrapper for lithium api calls
 * pass in lithium api method you wish to make
 * wrapper will ensure user is fully authenticated on
 * lithium's side before making call
 */
function ensureUserIsAuthenticated(apiMethod) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-const
            let getSSOTokenAndTryAgain;
            let retryCount = 0;
            let getSSOTokenCount = 0;

            /**
             * function that actually executes apiMethod passed in
             *
             * if user is authenticated already, i.e. lithium session key is valid
             * api call will be made successfully.
             *
             * if api call fails, we attempt to authenticate user (getting new lithium session key)
             * after getting new lithium session key we will attempt to make lithium api call three times
             *
             * if authenticate call fails for some reason, we will try to get a new
             * lithium sso token and try it all again
             */
            function shoot() {
                console.debug('Shooting Lithium authed request', apiMethod.name, args);
                apiMethod(...args)
                    .then(resolve)
                    .catch(reason1 => {
                        console.debug('Lithium authed request failed', reason1);
                        authenticate()
                            .then(() => {
                                if (retryCount < 2) {
                                    retryCount += 1;
                                    shoot();
                                } else {
                                    reject(reason1);
                                }
                            })
                            .catch(() => {
                                if (getSSOTokenCount < 1) {
                                    getSSOTokenCount += 1;
                                    getSSOTokenAndTryAgain();
                                } else {
                                    reject(reason1);
                                }
                            });
                    });
            }

            /**
             * will get called once if authenticate call (getting lithium session key) fails
             * makes call to get updated lithium sso token, updates local storage and cookie
             * then will attempt to re-authenticate (get new lithium session key) and make
             * lithium api call again
             */
            getSSOTokenAndTryAgain = function () {
                console.debug('Shooting Lithium SSO Token request', apiMethod.name, args);
                getLithiumSSOToken(userUtil.getProfileId())
                    .then(token => {
                        Storage.local.setItem(LOCAL_STORAGE.LITHIUM_API_TOKEN, token);
                        //update cookie to new token for lithiums side
                        cookieUtil.write(LITHIUM_SSO_TOKEN_COOKIE_NAME, token, null, true, false);
                    })
                    .then(shoot)
                    .catch(reject);
            };

            const LITHIUM_SESSION_KEY = cookieUtil.read(LITHIUM_SESSION_KEY_COOKIE_NAME);

            if (!LITHIUM_SESSION_KEY || LITHIUM_SESSION_KEY === '0') {
                authenticate().then(shoot).catch(getSSOTokenAndTryAgain);
            } else {
                shoot();
            }
        });
    };
}

//manipulate data returned from lithium to something we can use
function fixTyposInSocialInfoDataKeys(data) {
    const copy = Object.assign({}, data);

    copy.socialProfile = copy.social_profile;
    copy.socialProfile.aboutMe = copy.socialProfile.about_me;
    copy.socialProfile.isBeingFollowed = copy.socialProfile.is_being_followed;
    copy.socialProfile.biBadgeUrl = copy.socialProfile.sephora_bi_badge;
    copy.socialProfile.engagementBadgeUrl = copy.socialProfile.rank_badge;

    const isFeaturedConversation = copy.recent_messages.length === 0;
    copy.conversationsData = {
        isFeaturedConversation: isFeaturedConversation,
        conversations: isFeaturedConversation ? [copy.featured_message] : copy.recent_messages,
        total: copy.totalposts
    };

    const isFeaturedGroups = copy.recent_groups.length === 0;
    copy.groupsData = {
        isFeaturedGroups: isFeaturedGroups,
        groups: isFeaturedGroups ? copy.featured_groups : copy.recent_groups,
        total: copy.totalgroups
    };

    delete copy.recent_messages;
    delete copy.totalgroups;
    delete copy.social_profile;
    delete copy.socialProfile.about_me;
    delete copy.socialProfile.sephora_bi_badge;
    delete copy.socialProfile.rank_badge;
    delete copy.featured_message;
    delete copy.recent_groups;
    delete copy.featured_groups;
    delete copy.socialProfile.is_being_followed;

    // Reset the avatar coordinates by removing them from the URL
    // TODO: Replace this with an API call once Lithium provides ones
    const COORDINATES_REGEX = /(\/image-coordinates)([^\?]*)/;

    if (copy.socialProfile.avatar && copy.socialProfile.avatar.match(COORDINATES_REGEX)) {
        copy.socialProfile.avatar = copy.socialProfile.avatar.replace(COORDINATES_REGEX, '');
    }

    return copy;
}

// if no background image is set on lithium's side
// update to sephora default image on our side
function ensureBackgroundPhotoIsPresent(data) {
    if (!data.socialProfile.background) {
        data.socialProfile.background = BACKGROUND_PHOTO_DEFAULT;
    }

    return data;
}

/**
 * get users social information
 * @param  {String} userNickname - users community nickname
 * @returns {Promise}
 */
let getAuthenticatedUserSocialInfo = function (userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/getuserrecentgroups',
        qsParams: { username: userNickname }
    })
        .then(data => data[`User_${userNickname}_Group_Info`])
        .then(fixTyposInSocialInfoDataKeys)
        .then(ensureBackgroundPhotoIsPresent);
};

/**
 * will either join or leave community group
 * @param  {String} groupId - unique id for community group
 * @param  {String} action - 'remove' or 'add'
 * @returns {Promise}
 */
let joinOrLeaveGroup = function (groupId, action) {
    /* eslint-disable camelcase */
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/mobile.group_membership',
        qsParams: {
            group_id: groupId,
            action: action
        }
    });
};

/**
 * update users social info biography
 * @param  {String} newBio - what to update bio to
 * @param  {String} userNickname - users community nickname
 * @returns {Promise}
 */
let updateUserSocialBio = function (newBio, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/profiles/name/biography/set`,
        qsParams: { value: newBio }
    });
};

/**
 * update users social instagram link
 * @param  {String} newInstagram - instagram link
 * @param  {String} userNickname - users community nickname
 * @returns {Promise}
 */
let updateUserSocialInstagram = function (newInstagram, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.instagram_url/set`,
        qsParams: { value: newInstagram }
    });
};

/**
 * update users social youtube link
 * @param  {String} newYoutube - youtube link
 * @param  {String} userNickname - users community nickname
 * @returns {Promise}
 */
let updateUserSocialYoutube = function (newYoutube, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.youtube_url/set`,
        qsParams: { value: newYoutube }
    });
};

/**
 * Update the lithium user's avatar
 * @param  {String} newAvatarUrl - The url of the avatar
 * @param  {String} userNickname - The lithium user name
 * @returns {Promise}
 */
let updateUserSocialAvatar = function (newAvatarUrl, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/profiles/name/url_icon/set`,
        qsParams: { value: newAvatarUrl }
    });
};

/**
 * Update the lithium user's background image
 * @param  {} newBackgroundUrl - The url of the background image
 * @param  {String} userNickname - The lithium user name
 */
let updateUserSocialBackground = function (newBackgroundUrl, userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${userNickname}/settings/name/profile.background_url/set`,
        qsParams: { value: newBackgroundUrl }
    });
};

/**
 * API call to get a list of the user's albums
 * @param  {String} userNickname - The lithium user name
 * @returns {Promise}
 */
let getUserAlbums = function (userNickname) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: `/restapi/v1/users/login/${userNickname}/media/albums/public`
    });
};

/**
 * API call to create a new album
 * @param  {String} userNickname - The lithium user name
 * @param  {String} title - The title of the album
 * @returns {Promise}
 */
let createAlbum = function (title) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: '/restapi/v1/media/albums/add',
        qsParams: { 'album.title': title }
    });
};

/**
 * API call to upload an image to an album
 * @param  {String} albumId - The ID of the album
 * @param  {Object} formData - Multi-part form data image
 * @returns {Promise}
 */
let uploadImageToAlbum = function (albumId, formData) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/media/albums/id/${albumId}/images/upload`,
        params: formData,
        isMultiPart: true
    });
};

/** follow a user api call
 * @param {string} user nickname of the current user using the site
 * @param {string} user nickname of the currently *viewed* user
 */
let followUser = function (currentUserNickname, userToFollowId) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${currentUserNickname}/addressbook/contacts/friends/add`,
        qsParams: { 'contacts.user': `/users/id/${userToFollowId}` }
    });
};

/** unfollow a user api call
 * @param {string} user nickname of the current user using the site
 * @param {string} user nickname of the currently *viewed* user
 */
let unfollowUser = function (currentUserNickname, userToUnfollowId) {
    return lithiumAuthenticatedApiRequest({
        method: 'POST',
        url: `/restapi/v1/users/login/${currentUserNickname}/addressbook/contacts/friends/remove`,
        qsParams: { 'contacts.user': `/users/id/${userToUnfollowId}` }
    });
};

/**
 * need separate lithium api call for public requests
 * since there is no need to authenticate user, i.e. we want
 * to make these calls for anyone. used primarily for public profie page.
 */
function lithiumPublicApiRequest(options) {
    if (IS_LITHIUM_ENABLED === false) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('Lithium is disabled');
    }

    const qsParams = Object.assign({}, options.qsParams, { 'restapi.response_format': 'json' });

    const opts = Object.assign({}, options, {
        url: 'https://' + LITHIUM_API_HOST + options.url,
        qsParams
    });

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .catch(reason => {
            let result;

            if (reason instanceof Error && reason.message === 'Failed to fetch') {
                // eslint-disable-next-line prefer-promise-reject-errors
                result = Promise.reject('cors 403');
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                result = Promise.reject();
            }

            return result;
        });
}

/**
 * get public user social info
 * @param  {String} userNickname - users community nickname
 * @returns {Promise}
 */
const getPublicUserSocialInfo = function (userNickname) {
    return lithiumPublicApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/getuserrecentgroups',
        qsParams: { username: userNickname }
    })
        .then(data => data[`User_${userNickname}_Group_Info`])
        .then(fixTyposInSocialInfoDataKeys)
        .then(ensureBackgroundPhotoIsPresent);
};

/**
 * update user community score
 * @param  {String} interactionType
 * @param  {String} incrementAmount
 * @returns {Promise}
 */
const incrementUserScore = function (interactionType, incrementAmount, userId = userUtil.getProfileId()) {
    return lithiumAuthenticatedApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/gamification/update_user_value',
        qsParams: {
            interaction_type: interactionType,
            increment_amount: incrementAmount,
            user_id: userId
        }
    });
};

/**
 * get list of followees or followers for user
 * @param  {String} userNickname
 * @param  {String} listToGet
 * @param {int} pageIndex
 * @param {int} pageSize
 * @returns {Promise}
 */
const getFolloweesOrFollowers = function (userNickname, listToGet, pageIndex = 1, pageSize = 40) {
    return lithiumPublicApiRequest({
        method: 'GET',
        url: '/sephora/plugins/custom/sephora/sephora/mobile.' + listToGet,
        qsParams: {
            nickname: userNickname,
            page_size: pageSize,
            page: pageIndex
        }
    });
};

const getCommunityUserId = function () {
    return lithiumPublicApiRequest({
        method: 'GET',
        url: `/restapi/vc/users/login/${userUtil.getNickname()}`
    });
};

const incrementUserScoreForPixlee = function (interactionType, incrementAmount) {
    getCommunityUserId()
        .then(data => {
            return lithiumAuthenticatedApiRequest(
                {
                    method: 'GET',
                    url: '/sephora/plugins/custom/sephora/sephora/update_user_value',
                    qsParams: {
                        interaction_type: interactionType,
                        increment_amount: incrementAmount,
                        user_id: data.response?.user?.id?.$
                    }
                },
                false
            );
        })
        .catch(err => console.log(err));
};

function noNicknameDataAdapter(data) {
    const copy = Object.assign({}, data);

    //once featured_groups comes back as an array
    //change this to copy.featured_groups without an array wrapper
    copy.groupsData = {
        isFeaturedGroups: true,
        groups: [copy.featured_group],
        total: 0
    };
    copy.conversationsData = {
        isFeaturedConversation: true,
        conversations: [copy.featured_message],
        total: 0
    };
    copy.totalGroups = 0;
    copy.socialProfile = {
        aboutMe: null,
        // TODO Can this be renamed into avatarUrl safely?
        avatar: AVATAR_PHOTO_DEFAULT,
        background: BACKGROUND_PHOTO_DEFAULT,
        youtube: null,
        instagram: null,
        follower: 0,
        following: 0
    };

    delete copy.featured_group;
    delete copy.featured_message;
    delete copy.user;
    delete copy.groups_joined;
    delete copy.user_message;

    return copy;
}

//gets default lithium social info for non-community private user profiles
function getNoNicknameUserSocialInfo() {
    return _lithiumApiRequest({
        url: '/sephora/plugins/custom/sephora/sephora/mobile.richprofile',
        method: 'GET'
    }).then(data => noNicknameDataAdapter(data.profile));
}

function isAvatarDefault(avatarLink) {
    return avatarLink.indexOf(DEFAULT_AVATAR_URL) > -1;
}

function isBackgroundDefault(backgroundLink) {
    return backgroundLink.indexOf(DEFAULT_BACKGROUND_URL) > -1;
}

getAuthenticatedUserSocialInfo = ensureUserIsAuthenticated(getAuthenticatedUserSocialInfo);
updateUserSocialBio = ensureUserIsAuthenticated(updateUserSocialBio);
updateUserSocialInstagram = ensureUserIsAuthenticated(updateUserSocialInstagram);
updateUserSocialYoutube = ensureUserIsAuthenticated(updateUserSocialYoutube);
joinOrLeaveGroup = ensureUserIsAuthenticated(joinOrLeaveGroup);
updateUserSocialAvatar = ensureUserIsAuthenticated(updateUserSocialAvatar);
updateUserSocialBackground = ensureUserIsAuthenticated(updateUserSocialBackground);
followUser = ensureUserIsAuthenticated(followUser);
unfollowUser = ensureUserIsAuthenticated(unfollowUser);
getUserAlbums = ensureUserIsAuthenticated(getUserAlbums);
createAlbum = ensureUserIsAuthenticated(createAlbum);
uploadImageToAlbum = ensureUserIsAuthenticated(uploadImageToAlbum);

export default {
    getAuthenticatedUserSocialInfo,
    getPublicUserSocialInfo,
    getFolloweesOrFollowers,
    joinOrLeaveGroup,
    updateUserSocialBio,
    updateUserSocialYoutube,
    updateUserSocialInstagram,
    updateUserSocialAvatar,
    updateUserSocialBackground,
    followUser,
    unfollowUser,
    getUserAlbums,
    createAlbum,
    uploadImageToAlbum,
    getNoNicknameUserSocialInfo,
    incrementUserScore,
    isAvatarDefault,
    isBackgroundDefault,
    fixTyposInSocialInfoDataKeys,
    ensureBackgroundPhotoIsPresent,
    incrementUserScoreForPixlee,
    AVATAR_PHOTO_DEFAULT,
    BACKGROUND_PHOTO_DEFAULT
};
