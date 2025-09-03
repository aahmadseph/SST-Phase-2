//DMG is short for Digital Make Over Guide

const PAGE_SKUS_LIMIT = 45;

/*
 * function to take a list of dmg skus and combine them into the appropriate in store service they
 * belong to.
 * @params: an array of sku objects, in transaction order from newest to oldest
 * @return: an array of service objects
 */
function combineSkusIntoServices(skus) {
    const servicesList = [];
    let trackedDate;
    let newService;

    for (let i = 0; i < skus.length; i++) {
        if (skus[i].transactionDate === trackedDate) {
            newService.skus.push(skus[i]);
        } else {
            if (newService) {
                servicesList.push(newService);
            }

            trackedDate = skus[i].transactionDate;
            newService = {
                transactionDate: trackedDate,
                dateToDisplay: skus[i].dateToDisplay,
                serviceName: skus[i].serviceName,
                store: skus[i].store,
                skus: [skus[i]]
            };
        }
    }

    servicesList.push(newService);

    return servicesList;
}

export default {
    combineSkusIntoServices,
    PAGE_SKUS_LIMIT
};
