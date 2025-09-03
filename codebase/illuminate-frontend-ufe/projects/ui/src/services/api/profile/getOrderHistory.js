import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Order+History+API

function getOrderHistory(userProfileId, page, limit) {
    const url = `/api/users/profiles/${userProfileId}/orders?` + `currentPage=${page}&` + `itemsPerPage=${limit}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data =>
        data.errorCode
            ? Promise.reject(data)
            : {
                numOrders: data.orderCount,
                orders: data.orders
            }
    );
}

export default getOrderHistory;
