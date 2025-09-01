const buildRequestUrl = url => {
    const host = window.location.hostname;

    return `https://${host}${url}`;
};

const ufeApi = (url, options) => {
    const builtUrl = buildRequestUrl(url);
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))?.data;
    const { isSendAccessToken = false, sdnUfeAPIUserKey = '' } = window.Sephora?.configurationSettings || {};
    const defaultHeaders = {};

    if (accessToken && isSendAccessToken) {
        defaultHeaders['x-api-key'] = sdnUfeAPIUserKey;
        defaultHeaders['Seph-Access-Token'] = accessToken;
    }

    const { method = 'GET', headers = {}, body = undefined } = options;

    return fetch(builtUrl, { method, headers: { ...defaultHeaders, ...headers }, body });
};

export const fetchConfig = async () => {
    const config = await fetch('/gway/v1/dotcom/util/configuration?ch=web', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (config.ok) {
        const data = await config.json();
        // eslint-disable-next-line no-console

        if (data) {
            window.Sephora = { configurationSettings: data };
        }

        return data;
    }

    throw new Error('Failed to fetch configuration settings');
};

export const logout = email => {
    const enableAuthServiceLogout = window.Sephora?.configurationSettings?.enableAuthServiceLogout || false;
    const requestUrl = enableAuthServiceLogout ? '/gway/v1/dotcom/auth/v2/logout' : '/api/auth/logout';
    const options = {
        method: 'POST',
        headers: { 'x-requested-source': 'web', 'Content-type': 'application/json' }
    };

    if (enableAuthServiceLogout) {
        options.body = JSON.stringify({
            email
        });
    }

    return ufeApi(requestUrl, options);
};

const generateAuditNotesServiceBody = (commentType, commentDescription, orderId) => {
    const profileId = JSON.parse(localStorage.getItem('biAccountId'))?.data;
    const timeStamp = new Date().toISOString().split('.')[0] + 'Z';

    return {
        timeStamp: timeStamp,
        agentId: JSON.parse(localStorage.getItem('agentInfo'))?.cccId,
        type: 'Note',
        visibleBy: 'All',
        profileId: profileId,
        entityType: commentType === 'order' ? 'Order' : 'Profile',
        entityKey: commentType === 'order' ? orderId : profileId,
        body: {
            note: commentDescription,
            noteAction: null,
            onlineCreditRefundId: null
        },
        generateBy: 'manual',
        source: 'Mirror'
    };
};

export const addNote = async (commentType, commentDescription) => {
    const enableAuditNoteService = window.Sephora?.configurationSettings?.enableAuditNoteService || false;
    const requestUrl = enableAuditNoteService ? '/gway/audit-note' : '/api/util/comments';
    let orderId = '';

    if (commentType === 'order') {
        const params = new URL(document.location).searchParams;
        orderId = params.get('orderId');
    }

    const body = !enableAuditNoteService
        ? JSON.stringify({ commentType, commentDescription, orderId })
        : JSON.stringify(generateAuditNotesServiceBody(commentType, commentDescription, orderId));
    try {
        const response = await ufeApi(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });
        const data = await response.json();

        if (data.errorCode) {
            if (data.errorMessages) {
                const errorMessage = data.errorMessages.join();
                throw new Error(errorMessage);
            } else {
                throw new Error('Message was not saved please try again');
            }
        }

        return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getSkuDetails = skuId => {
    const requestUrl = '/api/v3/catalog/skus/' + skuId;

    return ufeApi(requestUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error('Something went wrong');
    });
};

export const addProductsToCart = ({ orderId = 'current', skuList = [] }) => {
    const requestUrl = '/api/shopping-cart/basket/items';

    return ufeApi(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, skuList })
    });
};

export const addBIRewardsToCart = data => {
    const requestUrl = '/api/bi/profile/rewards';

    return ufeApi(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
};

export const addSampleTocart = data => {
    const requestUrl = '/api/shopping-cart/basket/samples';

    return ufeApi(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
};

const isBiReward = product => {
    return product && !!product.biType && product.biType.toLowerCase() !== 'none';
};

const isSample = product => {
    return product.type === 'Sample';
};

export const addToCart = product => {
    if (isBiReward(product)) {
        return addBIRewardsToCart({
            biRewards: [product.skuId],
            biRewardsList: [{ skuId: product.skuId, productId: product.primaryProduct?.productId }]
        });
    }

    if (isSample(product)) {
        return addSampleTocart({
            sampleSkuIdList: [product.skuId],
            sampleSkuList: [{ skuId: product.skuId, productId: product.primaryProduct?.productId }]
        });
    }

    return addProductsToCart({
        skuList: [
            {
                isAcceptTerms: false,
                qty: 1,
                replenishmentSelected: false,
                replenishmentFrequency: '',
                skuId: product.skuId
            }
        ]
    });
};
