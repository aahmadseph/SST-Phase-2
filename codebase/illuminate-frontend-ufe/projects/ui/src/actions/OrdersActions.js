import profileApi from 'services/api/profile';

function getRecentOrders(userProfileId, page, limit, successCallback) {
    return function () {
        return profileApi.getOrderHistory(userProfileId, page, limit).then(function (data) {
            successCallback(data.numOrders, data.orders, page);
        });
    };
}

export default { getRecentOrders };
