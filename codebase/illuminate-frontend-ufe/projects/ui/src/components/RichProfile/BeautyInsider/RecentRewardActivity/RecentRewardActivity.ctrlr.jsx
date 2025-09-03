import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import rewardActions from 'actions/RewardActions';
import safelyReadProp from 'analytics/utils/safelyReadProperty';

import {
    Grid, Link, Box, Flex, Image, Text, Button, Divider
} from 'components/ui';
import ProductListItem from 'components/Product/ProductListItem/ProductListItem';
import skuUtils from 'utils/Sku';

//I18n
import localeUtils from 'utils/LanguageLocale';

class RecentRewardActivity extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { recentRewards: [] };
    }

    componentDidMount() {
        const profileId = safelyReadProp('user.profileId', this.props);

        if (profileId) {
            store.dispatch(rewardActions.fetchRecentlyRedeemedRewards(profileId, { purchaseFilter: 'rewards' }));
        }

        store.setAndWatch('rewards.rewardsPurchasedGroups', this, value => {
            if (safelyReadProp('rewardsPurchasedGroups.length', value)) {
                this.setState({
                    //We call slice() here with no arguments to get a copy and not modify state directly
                    //slicing it to 4 unit so that we know, there are more than 3 item to show viewall links.
                    recentRewards: this.getMostRecentRewards(value.rewardsPurchasedGroups.slice(), 4)
                });
            }
        });
    }

    getMostRecentRewards = (rewardsPurchasedGroups, limit) => {
        const recentRewards = [];
        const groupsSortedByMostRecent = rewardsPurchasedGroups.sort(this.sortByMostRecent());

        while (groupsSortedByMostRecent.length && recentRewards.length !== limit) {
            const group = groupsSortedByMostRecent.pop();

            for (const item of group.purchasedItems) {
                if (recentRewards.length === limit) {
                    break;
                }

                item.sku.readableTransactionDate = group.transactionDate;

                recentRewards.push(item.sku);
            }
        }

        return recentRewards;
    };

    sortByMostRecent = () => {
        return function (a, b) {
            const dateA = new Date(safelyReadProp('transactionDate', a));
            const dateB = new Date(safelyReadProp('transactionDate', b));

            if (dateA < dateB) {
                return -1;
            }

            if (dateA > dateB) {
                return 1;
            }

            // dates are equal
            return 0;
        };
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/RichProfile/BeautyInsider/RecentRewardActivity/locales',
            'RecentRewardActivity'
        );
        const { recentRewards } = this.state;
        const hasRewards = recentRewards.length > 0;

        return (
            <div>
                <Grid
                    alignItems='baseline'
                    lineHeight='tight'
                    marginBottom={[5, 6]}
                    columns={['1fr auto', '1fr auto 1fr']}
                >
                    <Box display={['none', 'block']} />
                    <Text
                        is='h2'
                        fontFamily='serif'
                        fontSize={['xl', '2xl']}
                        data-at={Sephora.debug.dataAt('rr_title')}
                        children={getText('rewardsActivity')}
                    />
                    <Flex justifyContent='flex-end'>
                        {recentRewards.length > 3 && (
                            <Link
                                padding={2}
                                margin={-2}
                                arrowDirection='right'
                                href='/purchase-history?filterby=rewards'
                                data-at={Sephora.debug.dataAt('rr_view_all_btn')}
                                children={getText('viewAll')}
                            />
                        )}
                    </Flex>
                </Grid>
                {hasRewards &&
                    recentRewards.slice(0, 3).map((item, index) => (
                        <React.Fragment key={item.skuId}>
                            {index > 0 && <Divider marginY={4} />}
                            <ProductListItem
                                dataAt={skuUtils.isBiReward(item) ? 'rr_item' : 'rr_item_sku'}
                                sku={item}
                                isRecentRewardItemList={true}
                                showQuickLookOnMobile={true}
                            />
                        </React.Fragment>
                    ))}
                {hasRewards || (
                    <Box textAlign='center'>
                        <Image
                            display='block'
                            size={128}
                            marginX='auto'
                            marginBottom={4}
                            src='/img/ufe/no-redeemed.svg'
                        />
                        <Text
                            is='p'
                            marginBottom={5}
                            children={getText('noRewardsYet')}
                        />
                        <Button
                            data-at={Sephora.debug.dataAt('rr_browse_btn')}
                            variant='secondary'
                            width={['100%', '14.5em']}
                            href='/rewards'
                            children={getText('browseLinkText')}
                        />
                    </Box>
                )}
            </div>
        );
    }
}

export default wrapComponent(RecentRewardActivity, 'RecentRewardActivity', true);
