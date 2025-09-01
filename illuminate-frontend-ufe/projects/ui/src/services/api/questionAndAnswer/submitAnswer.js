import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
//https://confluence.sephora.com/wiki/display/ILLUMINATE/Submit+Answer+API

function submitAnswer(
    accessToken,
    productId,
    questionId,
    answerText,
    fp,
    isSephoraEmployee,
    isFreeProduct,
    isCommunityServiceEnabled = true,
    locale,
    biAccountId,
    nickname,
    profileId
) {
    let url = '/api/bazaarvoice/answer';
    let body = {
        productId,
        questionId,
        answerText,
        fp,
        isSephoraEmployee,
        isFreeProduct
    };

    const headers = {
        'Content-Type': 'application/json'
    };
    const sephAccessToken = RCPSCookies.isRCPSAuthEnabled() ? Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN) : accessToken;

    if (isCommunityServiceEnabled) {
        url = `/api/v1/community/bazaarvoice/answer?loc=${locale}`;
        body = {
            ...body,
            nickname,
            userId: profileId,
            crmId: biAccountId
        };

        headers.Authorization = 'Bearer ' + sephAccessToken;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default submitAnswer;
