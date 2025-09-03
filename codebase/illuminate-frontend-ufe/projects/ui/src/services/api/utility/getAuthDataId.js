import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

function getAuthDataId() {
    const token = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
    let authId;

    if (token) {
        const tokenPayload = token.split('.')[1];
        const userTokenData = JSON.parse(atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/')));

        if (userTokenData?.AuthData?.biId) {
            authId = JSON.stringify(userTokenData?.AuthData?.biId).replace(/\"/g, '');
        } else {
            authId = JSON.stringify(userTokenData?.AuthData?.uuid).replace(/\"/g, '');
        }
    }

    return authId;
}

export default getAuthDataId;
