/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Image, Flex
} from 'components/ui';
import Chevron from 'components/Chevron';
import { fontSizes, colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Markdown from 'components/Markdown/Markdown';
import skuHelpers from 'utils/skuHelpers';
import * as rwdBasketCostants from 'constants/RwdBasket'; //TS-3142 - showApplyPointsForBazaarItems
import RougeExclusiveBadge from 'components/Badges/RougeExclusiveBadge';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/RewardsBazaar/locales', 'RewardsBazaar');
const { getRewardsBazaarRewards, openRewardsBazaarModal } = RwdBasketActions;
const {
    MAIN_BASKET_TYPES: { DC_BASKET }
} = rwdBasketCostants; //TS-3142 - showApplyPointsForBazaarItems

class RewardsBazaar extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const biAccountId = userUtils.getBiAccountId();
        const options = {
            userId: biAccountId || 'current'
        };
        getRewardsBazaarRewards(options);
    }

    // Arrow prevents needing to bind "this" in constructor
    handleClick = e => {
        this.fireModalOpenAnalyticsEvent();
        e.stopPropagation();
        openRewardsBazaarModal(true);
    };

    fireModalOpenAnalyticsEvent() {
        // Process event when delivery method is switched (INFL-4141)
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: anaConsts.PAGE_NAMES.BAZAAR_BASKET,
                pageType: anaConsts.PAGE_TYPES.BASKET,
                pageDetail: anaConsts.PAGE_DETAIL.REWARDS_BAZAAR
            }
        });
    }

    // Get the message to display in the RewardsBazaar component, such as:
    // - "0 rewards added"
    // - "1 reward added for Same-Day Delivery"
    // - "2 rewards added for Pickup and Ship to Home"
    // - "3 rewards added for Same-Day Delivery, Ship to Home, and Pickup"
    getRewardMessage(counts) {
        const fulfillmentMethods = [];

        if (counts.sameDayRewards.length > 0) {
            fulfillmentMethods.push(getText('sameDaySubtitle'));
        }

        if (counts.shipToHomeRewards.length > 0) {
            fulfillmentMethods.push(getText('getItShippedSubtitle'));
        }

        if (counts.bopisRewards.length > 0) {
            fulfillmentMethods.push(getText('pickupSubtitle'));
        }

        const totalRewards = counts.sameDayRewards.length + counts.shipToHomeRewards.length + counts.bopisRewards.length;

        // No rewards in basket
        if (totalRewards === 0) {
            return getText('zeroAdded');
        }

        // Dynamically format fulfillment method names
        let methodText;

        if (fulfillmentMethods.length === 1) {
            methodText = fulfillmentMethods[0];
        } else if (fulfillmentMethods.length === 2) {
            methodText = fulfillmentMethods.join(` ${getText('and')} `);
        } else {
            methodText = fulfillmentMethods.slice(0, -1).join(', ') + `, ${getText('and')} ` + fulfillmentMethods.slice(-1);
        }

        return `*${totalRewards}* ${getText('addedFor')} ${methodText}`;
    }

    render() {
        const rewards = this.props.rewardsByBasketList || [];
        const { basketType } = this.props; //TS-3142 - showApplyPointsForBazaarItems
        const getRewardMessage = this.getRewardMessage(skuHelpers.calculateRewardsCount({ rewards }));
        const showApplyPointsForRewards = !(localeUtils.isCanada() && Sephora.isMobile()) && basketType === DC_BASKET;

        return (
            <div>
                <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    padding={3}
                    fontSize={'sm'}
                    onClick={this.handleClick}
                >
                    <Flex
                        width={32}
                        height={32}
                        alignItems='center'
                        justifyContent='space-around'
                    >
                        <Image
                            disableLazyLoad={true}
                            src='/img/ufe/icons/reward-bazaar.svg'
                        />
                    </Flex>

                    <Flex
                        width='100%'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Box
                            marginRight={'auto'}
                            marginLeft={3}
                        >
                            <Text
                                is={'p'}
                                fontWeight='bold'
                                fontSize={fontSizes.base}
                            >
                                {getText(showApplyPointsForRewards ? 'applyBazaarPoints' : 'title')}
                            </Text>
                            <Flex
                                gap={1}
                                alignItems='center'
                            >
                                <Markdown content={getRewardMessage} />
                                {rougeExclusiveUtils.isRougeExclusiveForBasket() && <RougeExclusiveBadge />}
                            </Flex>
                        </Box>
                        <Chevron
                            direction='right'
                            size={fontSizes.base}
                            color={'#888'}
                        />
                    </Flex>
                </Flex>
                {this.props.showOmniRewardsNotice && (
                    <Flex
                        padding={2}
                        width='100%'
                    >
                        <Text
                            is='p'
                            padding={2}
                            backgroundColor={colors.lightBlue}
                            css={{ borderRadius: 2 }}
                            fontSize={fontSizes.sm}
                            dangerouslySetInnerHTML={{
                                __html: getText('omniRewardsNotice')
                            }}
                        />
                    </Flex>
                )}
            </div>
        );
    }
}

export default wrapComponent(RewardsBazaar, 'RewardsBazaar', true);
