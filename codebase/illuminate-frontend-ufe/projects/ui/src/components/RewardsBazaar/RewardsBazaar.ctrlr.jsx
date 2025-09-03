/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import watch from 'redux-watch';
import userUtils from 'utils/User';
import biUtils from 'utils/BiProfile';
import helpersUtils from 'utils/Helpers';
import stringUtils from 'utils/String';
import basketUtils from 'utils/Basket';
import birbActions from 'actions/BIRBActions';
//I18n
import localeUtils from 'utils/LanguageLocale';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import locationUtils from 'utils/Location';

import BiInfoCard from 'components/RichProfile/BeautyInsider/BiInfoCard/BiInfoCard';
import RewardsGrid from 'components/RewardsBazaar/RewardsGrid/RewardsGrid';
import RewardsCarousel from 'components/RichProfile/BeautyInsider/RewardsCarousel/RewardsCarousel';
import { Divider } from 'components/ui';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import SetPageAnalyticsProps from 'components/Analytics';
import AnaConst from 'analytics/constants';
import BiWelcomeCard from 'components/RichProfile/BeautyInsider/BiWelcomeCard/BiWelcomeCard';

const { embedHTML } = stringUtils;
const getText = localeUtils.getLocaleResourceFile('components/RewardsBazaar/locales', 'RewardsBazaar');

class RewardsBazaar extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isUserBi: false,
            biRewardsCarrousels: [],
            biRewardsGrids: [],
            isUserReady: false,
            isUserAtleastRecognized: false
        };
        this.rewardsBazaar = React.createRef();
    }

    componentDidMount() {
        const watchBasket = watch(store.getState, 'basket');

        import('utils/framework/Events').then(module => {
            const Events = module.default;

            Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
                store.subscribe(
                    watchBasket((newBasket, prevBasket) => {
                        if (newBasket.netBeautyBankPointsAvailable !== prevBasket.netBeautyBankPointsAvailable) {
                            bindingMethods.setUserPropsWithCurrentData();
                        }

                        this.setState({ biPoints: basketUtils.getAvailableBiPoints(true) });
                    }),
                    this
                );

                store.setAndWatch('user', this, value => {
                    store.dispatch(birbActions.fetchBiRewards());

                    this.setState({
                        user: value.user,
                        isUserReady: true,
                        isUserBi: userUtils.isBI(),
                        isUserAtleastRecognized: userUtils.isUserAtleastRecognized()
                    });
                });
            });

            window.addEventListener('hashchange', this.scrollTo);

            store.setAndWatch('beautyInsider.biRewardGroups', this, data => {
                if (data.biRewardGroups) {
                    this.setBiRewards(data.biRewardGroups);
                }
            });
        });
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.scrollTo);
    }

    componentDidUpdate() {
        this.scrollTo();
    }

    setBiRewards = biRewardGroups => {
        const { rewardsLabels, getGiftLastDateToRedeem } = userUtils;

        const { REWARD_GROUPS } = biUtils;

        const { [REWARD_GROUPS.CELEBRATION]: celebrationGifts, [REWARD_GROUPS.BIRTHDAY]: birthdayGifts } = biRewardGroups;

        const rewardsGridsNames = [
            '50 Points',
            '100 Points',
            '250-499 Points',
            '500-749 Points',
            '750-2999 Points',
            '3000-4999 Points',
            '5000-19999 Points',
            '20000+ Points'
        ];

        const biRewardsCarrousels = [];
        const biRewardsGrids = [];

        Object.keys(biRewardGroups).forEach(key => {
            if (rewardsGridsNames.indexOf(key) >= 0 && biRewardGroups[key].length > 0) {
                biRewardsGrids.push({
                    items: biRewardGroups[key],
                    anchor: key.replace(/\s/g, '').toLowerCase(),
                    title: getText(key),
                    isAnonymous: userUtils.isAnonymous(),
                    isBIRBReward: true
                });
            }
        });

        if (celebrationGifts && !userUtils.isAnonymous()) {
            biRewardsCarrousels.push({
                anchor: 'complimentary',
                items: celebrationGifts,
                title: getText('chooseYour', [rewardsLabels.CELEBRATION_GIFT.TITLE]),
                subtitle: rewardsLabels.CELEBRATION_GIFT.SUBTITLE.replace('{0}', userUtils.getRealTimeBiStatus())
            });
        }

        if (birthdayGifts) {
            const { user } = this.state;

            const innerText = embedHTML(/(\d*)/, getGiftLastDateToRedeem(), 'strong');

            biRewardsCarrousels.push({
                anchor: 'birthdaygifts',
                items: birthdayGifts,
                title: rewardsLabels.BIRTHDAY_GIFT.TITLE,
                subtitle: rewardsLabels.BIRTHDAY_GIFT.SUBTITLE.replace('{0}', user.firstName),
                secondSubtitle: { inner: innerText }
            });
        }

        this.setState({
            biRewardsCarrousels: biRewardsCarrousels,
            biRewardsGrids: biRewardsGrids
        });
    };

    scrollTo = () => {
        const { current } = this.rewardsBazaar;
        const { hash } = locationUtils.getWindowLocation();

        if (current && hash) {
            helpersUtils.scrollTo(current, `[id='${hash.replace('#', '')}']`, 100, 0);
        }
    };

    renderDivider = () => {
        return (
            <Divider
                color='nearWhite'
                marginY={Sephora.isDesktop() ? 6 : 5}
                height={3}
            />
        );
    };

    renderRewardsCarousels = () => {
        const { biRewardsCarrousels } = this.state;

        return (
            !!biRewardsCarrousels &&
            biRewardsCarrousels.map((carousel, index) => {
                return (
                    <React.Fragment key={index.toString()}>
                        {index > 0 && this.renderDivider()}
                        <LegacyContainer>
                            <RewardsCarousel
                                badges={true}
                                {...carousel}
                            />
                        </LegacyContainer>
                    </React.Fragment>
                );
            })
        );
    };

    renderRewardsGrids = () => {
        const { biRewardsGrids } = this.state;

        return (
            biRewardsGrids && (
                <React.Fragment>
                    {this.renderDivider()}
                    {biRewardsGrids.map((grid, index) => {
                        return (
                            <LegacyContainer
                                key={index}
                                data-at={Sephora.debug.dataAt('reward_grid_container')}
                            >
                                {index > 0 && <SectionDivider />}
                                <RewardsGrid {...grid} />
                            </LegacyContainer>
                        );
                    })}
                </React.Fragment>
            )
        );
    };

    renderBccRegions = region => {
        const REGIONS = {
            TOP: 'right',
            BOTTOM: 'content'
        };

        const currentRegion = REGIONS[region];

        if (!(this.props.regions && this.props.regions[currentRegion])) {
            return null;
        }

        const isBottomRegion = region === 'BOTTOM';
        const WrapComp = Sephora.isMobile() || isBottomRegion ? LegacyContainer : React.Fragment;

        // Consider using a switch statement here if each section needs different wrappers
        // and/or styles. See renderBccRegions in BeautyInsider.jsx for exaples.
        return (
            <React.Fragment>
                {isBottomRegion && this.renderDivider()}
                <WrapComp>
                    <BccComponentList
                        disableLazyLoadCount={this.props.regions[currentRegion]?.length}
                        items={this.props.regions[currentRegion]}
                    />
                </WrapComp>
            </React.Fragment>
        );
    };

    renderBiInfoCard = () => {
        const { user, isUserBi, isUserAtleastRecognized } = this.state;

        const shouldRenderBiInfo = isUserAtleastRecognized && isUserBi;
        const isAnonymous = userUtils.isAnonymous();

        return (
            <React.Fragment>
                {shouldRenderBiInfo ? (
                    <BiInfoCard
                        user={user}
                        isMinimal={true}
                    />
                ) : (
                    <BiWelcomeCard
                        hasGraphic={false}
                        isAnonymous={isAnonymous}
                    />
                )}
            </React.Fragment>
        );
    };

    render() {
        const { isUserReady } = this.state;

        return (
            <main ref={this.rewardsBazaar}>
                <SetPageAnalyticsProps
                    pageType={AnaConst.PAGE_TYPES.USER_PROFILE}
                    pageName='rewards bazaar'
                />
                {isUserReady && this.renderBiInfoCard()}
                {this.renderBccRegions('TOP')}
                {this.state.biRewardsCarrousels.length > 0 && this.renderDivider()}

                {this.renderRewardsCarousels()}
                {this.renderRewardsGrids()}
                {this.renderBccRegions('BOTTOM')}
            </main>
        );
    }
}

export default wrapComponent(RewardsBazaar, 'RewardsBazaar');
