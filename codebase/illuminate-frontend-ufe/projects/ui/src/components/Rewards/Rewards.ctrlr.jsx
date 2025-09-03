import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import { Box, Link } from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import RewardItem from 'components/Reward/RewardItem/RewardItem';
import bccUtils from 'utils/BCC';
import stringUtils from 'utils/String';
import RewardsCarousel from 'components/RichProfile/BeautyInsider/RewardsCarousel/RewardsCarousel';
import locationUtils from 'utils/Location';
import biUtils from 'utils/BiProfile';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import { UserInfoReady } from 'constants/events';

const { getLocaleResourceFile } = localeUtils;
const { keyGenerator, capitalize, embedHTML } = stringUtils;
const { IMAGE_SIZES } = bccUtils;
const getRewardsKey = keyGenerator('rewardsCarousel');
const getText = getLocaleResourceFile('components/Rewards/locales', 'Rewards');

class Rewards extends BaseClass {
    state = {
        rewardGroups: [],
        currentTab: null,
        isAnonymous: true,
        userStatus: null
    };

    getHeaderText = key => {
        const { userStatus, firstName, giftLastDateToRedeem } = this.state;

        const { rewardsLabels } = userUtils;

        const headerText = {
            line1: null,
            line2: key,
            line3: null
        };

        const innerText = embedHTML(/(\d*)/, giftLastDateToRedeem, 'strong');
        const { CELEBRATION_GIFT, BIRTHDAY_GIFT } = rewardsLabels;

        switch (key) {
            case biUtils.REWARD_GROUPS.CELEBRATION:
                headerText.line1 = CELEBRATION_GIFT.SUBTITLE.replace('{0}', userStatus);
                headerText.line2 = CELEBRATION_GIFT.TITLE;

                break;

            case biUtils.REWARD_GROUPS.BIRTHDAY:
                headerText.line1 = BIRTHDAY_GIFT.SUBTITLE.replace('{0}', capitalize(firstName));
                headerText.line2 = BIRTHDAY_GIFT.TITLE;
                headerText.line3 = { inner: innerText };

                break;

            default:
                break;
        }

        return headerText;
    };

    setRewards = rewards => {
        const rewardGroups = {};
        const biRewards = rewards.biRewardGroups || {};
        const complimentaryRewards = rewards.complimentary;

        if (complimentaryRewards && complimentaryRewards.length) {
            Object.assign(rewardGroups, { Complimentary: complimentaryRewards }, biRewards);
        } else {
            Object.assign(rewardGroups, biRewards);
        }

        const biRewardKeys = Object.keys(rewardGroups);
        const currentTab = biRewardKeys.length ? biRewardKeys[0] : '';

        this.setState(prevState => ({
            rewardGroups: rewardGroups,
            currentTab: prevState.currentTab || currentTab
        }));
    };

    showCurrentTabRewards = index => {
        this.setState({ currentTab: index });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.rewards?.rewards !== this.props.rewards?.rewards) {
            const newRewards = this.props.rewards?.rewards;

            if (newRewards) {
                const newRewardsWithoutRRC = Object.assign({}, newRewards.biRewardGroups);
                delete newRewardsWithoutRRC['Rouge Reward'];
                const updatedRewards = Object.assign({}, newRewards, { biRewardGroups: newRewardsWithoutRRC });
                this.setRewards(Object.assign({}, updatedRewards));
            }
        }
    }

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            this.setState({
                isAnonymous: userUtils.isAnonymous(),
                userStatus: userUtils.getRealTimeBiStatus(),
                firstName: userUtils.getProfileFirstName(),
                giftLastDateToRedeem: userUtils.getGiftLastDateToRedeem()
            });
        });
    }

    render() {
        const { currentTab, rewardGroups, isAnonymous } = this.state;

        const imageSize = Sephora.isMobile() ? IMAGE_SIZES[162] : IMAGE_SIZES[135];
        const isBasketPage = locationUtils.isBasketPage();

        let rewardsCarousels = [];
        let rewardTabs = [];

        if (Sephora.isMobile()) {
            rewardsCarousels = Object.keys(rewardGroups).map(key => {
                const headerText = this.getHeaderText(key);

                const rewardList = rewardGroups[key];

                return (
                    <Box
                        key={getRewardsKey(key)}
                        marginBottom={5}
                    >
                        <RewardsCarousel
                            items={rewardList}
                            title={headerText.line2}
                            subtitle={headerText.line1}
                            secondSubtitle={headerText.line3}
                            isAnonymous={isAnonymous}
                        />
                    </Box>
                );
            });
        } else {
            rewardTabs = Object.keys(rewardGroups).map(key => {
                const isCurrentTab = currentTab === key;

                const tabName = key === biUtils.REWARD_GROUPS.CELEBRATION ? getText('tierCelebrationGift') : key;

                let dataAt = 'reward_crsl_ttl';

                if (isCurrentTab) {
                    dataAt += '_selected';
                }

                return (
                    <Link
                        key={`rewardTab_${key}`}
                        onClick={() => this.showCurrentTabRewards(key)}
                        css={[{ textTransform: 'uppercase' }, isCurrentTab && { textDecoration: 'underline' }]}
                        color={isCurrentTab || 'gray'}
                        data-at={Sephora.debug.dataAt(dataAt)}
                    >
                        {tabName}
                    </Link>
                );
            });

            const rewardList = rewardGroups[currentTab];
            const headerText = this.getHeaderText(currentTab);

            if (rewardList) {
                const itemLength = rewardList ? rewardList.length : 0;
                const rewardsCarousel = (
                    <LegacyCarousel
                        displayCount={3}
                        totalItems={itemLength}
                        fillTrailedGap={true}
                        carouselMaxItems={12}
                        isFlexItem={true}
                        gutter={space[5]}
                        controlHeight={imageSize}
                        showArrows={Sephora.isDesktop()}
                        showTouts={true}
                    >
                        {rewardList.map((product, index) => (
                            <RewardItem
                                key={getRewardsKey(product.skuId || index)}
                                useAddToBasket={true}
                                showPrice={true}
                                isAnonymous={isAnonymous}
                                showMarketingFlags={true}
                                imageSize={imageSize}
                                isShortButton={true}
                                isBasketReward={isBasketPage}
                                rootContainerName={headerText.line2}
                                isCarousel={true}
                                {...product}
                            />
                        ))}
                    </LegacyCarousel>
                );
                rewardsCarousels.push(rewardsCarousel);
            }
        }

        return (
            <div>
                {Sephora.isDesktop() && <Box textAlign='center'>{rewardTabs}</Box>}
                {rewardsCarousels}
            </div>
        );
    }
}

export default wrapComponent(Rewards, 'Rewards', true);
