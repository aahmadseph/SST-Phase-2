const resources = {
    ctaApply: 'Apply',
    ctaApplied: 'Applied',
    ctaRemove: 'Remove',
    ctaUrl: 'Shop Now',
    ctaAppOnly: 'App Exclusive',
    ctaStoreOnly: 'In Store Only',
    seeDetails: 'See details',
    insider: 'Beauty Insider members only.',
    vib: 'Rouge & VIB only.',
    rouge: 'Rouge members only.',
    ends: 'Ends',
    appOnly: 'App only',
    onlineOnly: 'Online only',
    storeOnly: 'In store only',
    inStoreOrOnline: 'In store & online',
    daysLeft: 'Days Left',
    dayLeft: 'Day Left',
    lastDay: 'Last Day',
    viewAll: 'View all'
};

export default function getResource(label) {
    return resources[label];
}
