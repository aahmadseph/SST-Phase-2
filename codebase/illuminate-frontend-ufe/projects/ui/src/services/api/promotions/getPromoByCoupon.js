import ufeApi from 'services/api/ufeApi';
// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Thirdparty+Promotion+API

function getPromoByCoupon(couponCode) {
    const url = `/api/promotions/coupons/${couponCode}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getPromoByCoupon;
