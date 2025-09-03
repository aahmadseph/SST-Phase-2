import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Button, Divider, Image, Link
} from 'components/ui';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import analyticsUtils from 'analytics/utils';
import urlUtils from 'utils/Url';
import InfoButton from 'components/InfoButton/InfoButton';
import { CCR_STATUS } from 'components/RichProfile/BeautyInsider/constants';
import { globalModals, renderModal } from 'utils/globalModals';
import analyticsConstants from 'analytics/constants';
const {
    LinkData: { CCR_APPLY }
} = analyticsConstants;

const { CREDIT_CARD_REWARDS_INFO } = globalModals;

const renderNoRewardsEarned = content => {
    const { rewardMessageList = [] } = content;

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
};

const handleClick = ccRewardStatus => {
    if (ccRewardStatus === CCR_STATUS.REWARDSREDEEMED) {
        urlUtils.redirectTo('/');
    } else {
        analyticsUtils.setNextPageData({ linkData: CCR_APPLY });
        urlUtils.redirectTo('/basket');
    }
};

const leftContentZone = (content, isRewardsRedeemed) => {
    const { ccRewardStatus, rewardMessageList = [], rewardsTotal = 0 } = content;

    return (
        <Box width={['100%', 'auto']}>
            <Text
                is='p'
                children={rewardMessageList[0]}
            />
            <Text
                is='p'
                fontSize={[32, 40]}
                fontWeight='bold'
                children={`$${rewardsTotal}`}
            />
            <Button
                variant='secondary'
                hasMinWidth={true}
                onClick={() => {
                    handleClick(ccRewardStatus);
                }}
                name='applyBtn'
                marginTop={4}
                marginBottom={[4, 0]}
                width={['100%', 'auto']}
                data-at={Sephora.debug.dataAt('pfd_apply_in_basket')}
                children={isRewardsRedeemed ? rewardMessageList[3] : rewardMessageList[2]}
            />
        </Box>
    );
};

const rightContentZone = (content, isRewardsEarned) => {
    const { rewardCertificates = [], rewardMessageList = [] } = content;
    const showViewMore = rewardCertificates.length > 3;
    const rewards = showViewMore ? rewardCertificates.slice(0, 3) : rewardCertificates;

    return (
        <Box
            backgroundColor='nearWhite'
            height='100%'
            borderRadius={2}
        >
            <Box padding={4}>
                <Text
                    is='h4'
                    fontWeight='bold'
                    children={rewardMessageList[1]}
                />
                {isRewardsEarned ? (
                    rewards.map(reward => (
                        <div
                            data-at={Sephora.debug.dataAt('pfd_points_label')}
                            key={reward.certificateNumber}
                        >
                            <Divider marginY={3} />
                            <b>{`$${reward.rewardAmount}`}</b> {' Credit Card Reward'}
                            <br />
                            <Text
                                color='gray'
                                children={`Exp. ${reward.expireDate}`}
                            />
                        </div>
                    ))
                ) : (
                    <>
                        <Divider marginY={3} />
                        <Text children={rewardMessageList && rewardMessageList.length ? rewardMessageList[2] : ''} />
                    </>
                )}
                {showViewMore && (
                    <>
                        <Divider marginY={3} />
                        <Link
                            children='View More'
                            color='blue'
                            href='/CreditCard'
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};

const CreditCardRewards = ({ content, showMediaModal, globalModals: globalModalsData }) => {
    const isNoRewardsEarned = content?.ccRewardStatus === CCR_STATUS.NOREWARDSEARNED;
    const isRewardsEarned = content?.ccRewardStatus === CCR_STATUS.REWARDSEARNED;
    const isRewardsRedeemed = content?.ccRewardStatus === CCR_STATUS.REWARDSREDEEMED;

    const headerCtaTitle = () => {
        return (
            <InfoButton
                onClick={() => renderModal(globalModalsData[CREDIT_CARD_REWARDS_INFO], showMediaModal)}
                size={20}
            />
        );
    };

    return (
        <BeautyInsiderModuleLayout
            title='Credit Card Rewards'
            headerCtaTitle={headerCtaTitle}
            leftContentZone={isNoRewardsEarned ? renderNoRewardsEarned(content) : leftContentZone(content, isRewardsRedeemed)}
            rightContentZone={!isNoRewardsEarned && rightContentZone(content, isRewardsEarned)}
        />
    );
};

export default wrapFunctionalComponent(CreditCardRewards, 'CreditCardRewards');
