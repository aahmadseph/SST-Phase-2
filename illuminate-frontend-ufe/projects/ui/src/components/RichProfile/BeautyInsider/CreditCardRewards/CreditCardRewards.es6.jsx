import React from 'react';
import { space } from 'style/config';
import {
    Grid, Link, Box, Flex, Image, Text, Divider, Button
} from 'components/ui';
import { CCR_STATUS } from 'components/RichProfile/BeautyInsider/constants';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import analyticsUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
import BCC from 'utils/BCC';
import InfoButton from 'components/InfoButton/InfoButton';

import store from 'store/Store';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import { wrapComponent } from 'utils/framework';

class CreditCardRewards extends BaseClass {
    static redirectToBasket() {
        urlUtils.redirectTo('/basket');
    }

    static redirectToHomepage() {
        urlUtils.redirectTo('/');
    }

    static showInfoModal() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/CreditCardRewards/locales', 'CreditCardRewards');
        const mediaId = BCC.MEDIA_IDS.CREDIT_CARD_REWARDS;

        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId,
                titleDataAt: 'cc_rewards_modal_title',
                showMediaTitle: true,
                dismissButtonText: getText('modalButton'),
                dismissButtonDataAt: 'cc_rewards_modal_got_it_button',
                modalDataAt: 'cc_rewards_modal'
            })
        );
    }

    renderRewardsSection(getText, isRewardsEarned) {
        const { bankRewards } = this.props;
        const { rewardCertificates = [], rewardMessageList = [] } = bankRewards;
        const showViewMore = rewardCertificates.length > 3;
        const rewardsLeft = showViewMore ? bankRewards.numberOfRewardsAvailable - 3 : null;
        const rewardsList = showViewMore ? rewardCertificates.slice(0, 3) : rewardCertificates;

        return (
            <Box
                backgroundColor='nearWhite'
                borderRadius={2}
                paddingY={3}
                paddingX={5}
            >
                <Text
                    is='h3'
                    fontWeight='bold'
                    children={getText('listTitle')}
                />
                {isRewardsEarned ? (
                    rewardsList.map(reward => (
                        <React.Fragment key={reward.certificateNumber}>
                            <Divider marginY={3} />
                            <div data-at={Sephora.debug.dataAt('cc_reward_item')}>
                                <strong>{`$${reward.rewardAmount}`}</strong> {getText('creditCardReward')}
                                <br />
                                <Text
                                    color='gray'
                                    children={`Exp. ${reward.expireDate}`}
                                />
                            </div>
                        </React.Fragment>
                    ))
                ) : (
                    <React.Fragment>
                        <Divider marginY={3} />
                        {rewardMessageList && rewardMessageList.length ? rewardMessageList[2] : ''}
                    </React.Fragment>
                )}
                {showViewMore && (
                    <React.Fragment>
                        <Divider marginY={3} />
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='right'
                            href='/profile/CreditCard'
                            children={`${getText('view')} ${rewardsLeft} ${getText('more')}`}
                        />
                    </React.Fragment>
                )}
            </Box>
        );
    }

    renderNoRewardsEarned() {
        const { bankRewards = {} } = this.props;

        const { rewardMessageList = [] } = bankRewards;

        const messageParts = rewardMessageList[0] ? rewardMessageList[0].split('. ', 2) : [];

        return (
            <Box textAlign='center'>
                <Image
                    display='block'
                    size={128}
                    marginX='auto'
                    marginBottom={4}
                    src='/img/ufe/empty-cc.svg'
                />
                <Text
                    is='p'
                    data-at={Sephora.debug.dataAt('ccr_module_message')}
                >
                    {messageParts[0] ? `${messageParts[0]}.` : ''}
                    <br />
                    {messageParts[1] ? messageParts[1] : ''}
                </Text>
            </Box>
        );
    }

    render() {
        const { bankRewards } = this.props;

        const { ccRewardStatus, rewardMessageList = [] } = bankRewards;

        const isDesktop = Sephora.isDesktop();

        const isNoRewardsEarned = ccRewardStatus === CCR_STATUS.NOREWARDSEARNED;
        const isRewardsRedeemed = ccRewardStatus === CCR_STATUS.REWARDSREDEEMED;
        const isRewardsEarned = ccRewardStatus === CCR_STATUS.REWARDSEARNED;

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/CreditCardRewards/locales', 'CreditCardRewards');

        const applyCTA = (
            <Button
                marginTop={4}
                width={['100%', '22em']}
                variant='secondary'
                onClick={() => {
                    if (isRewardsRedeemed) {
                        CreditCardRewards.redirectToHomepage();
                    } else {
                        const prop55 = 'bi:credit card rewards:apply credit rewards in basket';
                        analyticsUtils.setNextPageData({ linkData: prop55 });
                        CreditCardRewards.redirectToBasket();
                    }
                }}
                children={isRewardsRedeemed ? rewardMessageList[3] : rewardMessageList[2]}
            />
        );

        return (
            <React.Fragment>
                <Grid
                    alignItems='baseline'
                    lineHeight='none'
                    marginBottom={[5, 6]}
                    columns={['1fr auto', '1fr auto 1fr']}
                >
                    <Box display={['none', 'block']} />
                    <Flex alignItems='baseline'>
                        <Image
                            display={[null, 'none']}
                            flexShrink={0}
                            alignSelf='center'
                            src='/img/ufe/icons/cc.svg'
                            marginRight={3}
                            width={24}
                            height={24}
                        />
                        <Text
                            is='h2'
                            fontFamily='serif'
                            fontSize={['xl', '2xl']}
                            marginRight='.25em'
                            data-at={Sephora.debug.dataAt('ccr_module_title')}
                            children={getText('title')}
                        />
                        <InfoButton onClick={CreditCardRewards.showInfoModal} />
                    </Flex>
                    <Flex justifyContent='flex-end'>
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='right'
                            data-at={Sephora.debug.dataAt('ccr_module_more')}
                            href='/profile/CreditCard'
                            children={getText('moreLink')}
                        />
                    </Flex>
                </Grid>
                {isNoRewardsEarned ? (
                    this.renderNoRewardsEarned()
                ) : (
                    <Box
                        lineHeight='tight'
                        {...(isDesktop && {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            maxWidth: 765,
                            marginX: 'auto'
                        })}
                    >
                        <div
                            css={
                                isDesktop && {
                                    flex: 1,
                                    textAlign: 'center',
                                    paddingRight: space[8]
                                }
                            }
                        >
                            <Text is='h3'>{rewardMessageList[0]}</Text>
                            {isRewardsEarned && (
                                <Text
                                    is='p'
                                    lineHeight='none'
                                    fontSize={80}
                                    fontFamily='serif'
                                    marginLeft={isDesktop && '-.25em'}
                                    marginBottom={isDesktop || 3}
                                    letterSpacing='-.025em'
                                >
                                    <Text
                                        verticalAlign='super'
                                        fontSize='.4em'
                                        children={'$'}
                                    />
                                    {userUtils.getRewardsAmount(bankRewards)}
                                </Text>
                            )}
                            {isDesktop && applyCTA}
                        </div>
                        <div css={isDesktop && { width: 311 }}>
                            {isRewardsEarned || isRewardsRedeemed ? (
                                this.renderRewardsSection(getText, isRewardsEarned)
                            ) : (
                                <Text is='h3'>{rewardMessageList[0]}</Text>
                            )}
                            {isDesktop || applyCTA}
                        </div>
                    </Box>
                )}
            </React.Fragment>
        );
    }
}

export default wrapComponent(CreditCardRewards, 'CreditCardRewards');
