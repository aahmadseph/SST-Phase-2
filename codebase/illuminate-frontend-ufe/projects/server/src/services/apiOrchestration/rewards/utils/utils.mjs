export const getOptionsWithClientHeaders = (request, headersStringArray) => {
    const { ...clonedOptions } = request.apiOptions;
    headersStringArray.forEach(headerName => {
        if (headerName in request.headers) {
            clonedOptions.headers[headerName] = request.headers[headerName];
        }
    });

    return clonedOptions;
};


export const getRewardsTypesFromUserElegibleRewards = (userElegibleRewards) => {
    if (userElegibleRewards?.rewards?.length){
        const elegibleRewardsTypes = userElegibleRewards.rewards.map((reward)=>reward.type);
        const uniqueElegibleRewardsTypes = [...new Set(elegibleRewardsTypes)];

        return uniqueElegibleRewardsTypes.join().toLowerCase();
    } else {
        return '';
    }
};
