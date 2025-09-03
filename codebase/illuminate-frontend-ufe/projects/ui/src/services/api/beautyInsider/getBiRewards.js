import getBiRewardsGroup from 'services/api/beautyInsider/getBiRewardsGroup';

const { getBiRewardsGroupForCheckout, getBiRewardsGroupForProfile, getBiRewardsGroupForSnapshot, getBiRewardsGroupForOrderConf } = getBiRewardsGroup;

//https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Rewards+API

//getBiRewards api call has been depreciated and now we use getBiRewardsGroup api call
function getBiRewards(source, options) {
    switch (source) {
        case 'checkout':
            return getBiRewardsGroupForCheckout(options);
        case 'profile':
            return getBiRewardsGroupForProfile(options);
        case 'snapshot':
            return getBiRewardsGroupForSnapshot();
        case 'orderConfirmation':
            return getBiRewardsGroupForOrderConf();
        default:
            // eslint-disable-next-line no-console
            console.error('source is not supported for getBiRewardsGroup api call');

            return null;
    }
}

export default getBiRewards;
