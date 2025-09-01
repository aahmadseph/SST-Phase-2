import updateBiAccount from 'services/api/beautyInsider/updateBiAccount';

function updateBeautyPreferences(data) {
    return updateBiAccount(data).then(response => {
        if (response.responseStatus === 200) {
            return Promise.resolve(response);
        }

        return Promise.reject(response);
    });
}

export default updateBeautyPreferences;
