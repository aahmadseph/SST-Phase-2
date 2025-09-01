/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Grid, Text, Link, Divider, Flex
} from 'components/ui';
import Tooltip from 'components/Tooltip/Tooltip';
import InfoButton from 'components/InfoButton/InfoButton';
import { mediaQueries } from 'style/config';
import dateUtils from 'utils/Date';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import BCC from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import { globalModals, renderModal } from 'utils/globalModals';
import store from 'Store';
import Actions from 'Actions';
import isCCREnabled from 'utils/ccRewards';

const { TERMS_OF_SERVICE } = globalModals;

const getText = (text, vars) =>
    localeUtils.getLocaleResourceFile('components/Content/CreditCards/CreditCardRewards/locales', 'CreditCardRewards')(text, vars);

class CreditCardRewards extends BaseClass {
    renderReward = (price = '', expires = '') => {
        return (
            <>
                <Divider />
                <Text
                    is='p'
                    fontSize='md'
                    lineHeight='tight'
                    marginTop={3}
                >
                    <b>{`$${price}`}</b> {'Credit Card Reward'}
                </Text>
                <Text
                    is='p'
                    lineHeight='tight'
                    color='gray'
                    marginBottom={3}
                    children={`Expires ${expires.substring(0, expires.lastIndexOf('/'))}`}
                />
            </>
        );
    };

    renderRewardsBreakdown = () => {
        const availableRewards = this.props.rewards?.bankRewards?.rewardCertificates?.filter(reward => reward.available);
        const { firstPurchaseDiscountPercentOff = 0, ccFirstTimeDiscountExpireDate = '' } = this.props.rewards;
        let fpdExpiryDate = '';

        if (isCCREnabled()) {
            const fpdDateSplit = ccFirstTimeDiscountExpireDate?.substring(0, ccFirstTimeDiscountExpireDate?.lastIndexOf('T')).split('-');
            fpdExpiryDate = `${fpdDateSplit?.[1]}/${fpdDateSplit?.[2]}`;
        } else {
            fpdExpiryDate = ccFirstTimeDiscountExpireDate?.substring(0, ccFirstTimeDiscountExpireDate?.lastIndexOf('/'));
        }

        return (
            <>
                <Text
                    is='p'
                    fontWeight='bold'
                    lineHeight='tight'
                    children='Rewards Breakdown'
                    marginBottom={3}
                />
                {firstPurchaseDiscountPercentOff > 0 && (
                    <>
                        <Divider />
                        <Text
                            is='p'
                            fontSize='md'
                            lineHeight='tight'
                            marginTop={3}
                            fontWeight='bold'
                            children={`${firstPurchaseDiscountPercentOff}% off First Purchase `}
                        />
                        <Text
                            is='p'
                            lineHeight='tight'
                            color='gray'
                            marginBottom={3}
                            children={`Expires ${fpdExpiryDate}`}
                        />
                    </>
                )}
                {!availableRewards && firstPurchaseDiscountPercentOff === 0 && (
                    <>
                        <Divider />
                        <Text
                            is='p'
                            color='gray'
                            lineHeight='tight'
                            marginTop={3}
                            children='No rewards earned yet'
                        />
                    </>
                )}
                {availableRewards?.map(reward => this.renderReward(reward.rewardAmount, reward.expireDate))}
            </>
        );
    };

    renderMediaModal = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            this.props.showMediaModal({
                isOpen: true,
                mediaId: BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS
            });
        });
    };

    renderYourRewards = () => {
        let totalRewardsAmount = userUtils.getRewardsAmount(this.props.rewards.bankRewards);
        let showDollarSign = true;
        const { firstPurchaseDiscountPercentOff = 0 } = this.props.rewards;

        if (totalRewardsAmount === 0 && firstPurchaseDiscountPercentOff > 0) {
            totalRewardsAmount = `${firstPurchaseDiscountPercentOff}% off`;
            showDollarSign = false;
        }

        return (
            <div css={styles.container}>
                <Text
                    is='h1'
                    fontWeight='bold'
                    fontSize={['lg', 'xl']}
                    children='Your Rewards'
                    lineHeight='tight'
                />
                <Text
                    is='p'
                    color='gray'
                    children={`Available Now | As of ${dateUtils.formatDateMDY(new Date().toISOString(), true)}`}
                    lineHeight='tight'
                    marginBottom={4}
                />
                <Divider />
                <Text
                    is='p'
                    fontSize={'3xl'}
                    fontWeight='bold'
                    lineHeight='tight'
                    marginTop={4}
                    children={`${showDollarSign ? '$' : ''}${totalRewardsAmount}`}
                />
                <Button
                    variant='primary'
                    marginTop={4}
                    marginBottom={4}
                    width={['100%', 'unset']}
                    onClick={e => {
                        e.preventDefault();
                        urlUtils.redirectTo('/basket');
                    }}
                    disabled={totalRewardsAmount === 0}
                    children='Apply Rewards in Basket'
                />
                <Button
                    variant='secondary'
                    marginBottom={5}
                    width={['100%', 'unset']}
                    display={['block', 'none']}
                    onClick={e => {
                        e.preventDefault();
                        store.dispatch(Actions.showScanRewardCardModal({ isOpen: true }));
                    }}
                    disabled={this.props.isScanRewardsButtonDisabled}
                    children={getText('scanRewardsCard')}
                />
                {this.renderRewardsBreakdown()}
                <Text
                    is='p'
                    lineHeight='tight'
                    marginTop={5}
                >
                    Rewards will be applied to the merchandise subtotal.
                    <br />
                    <Link
                        color='blue'
                        onClick={this.renderMediaModal}
                    >
                        Terms & Conditions
                    </Link>
                </Text>
            </div>
        );
    };

    renderNextStatementEarningCard = () => {
        const { totalEarningsOnNextStatement = '0', nextStatementDate = '' } = this.props.rewards?.bankRewards || {};

        return (
            <div
                css={{
                    padding: '16px',
                    [mediaQueries.sm]: {
                        padding: '24px'
                    }
                }}
            >
                <Flex justifyContent='space-between'>
                    <div>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize='lg'
                            lineHeight='tight'
                            children={`Available ${dateUtils.formatDateMDY(nextStatementDate, true, true, false)}`}
                        />
                        <Text
                            is='p'
                            lineHeight='tight'
                            color='gray'
                            children='Earning on next statement'
                        />
                    </div>
                    <Tooltip content={'These rewards become available at the end of your next billing period.'}>
                        <InfoButton size={20} />
                    </Tooltip>
                </Flex>
                <Divider marginY={4} />
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize='3xl'
                    lineHeight='tight'
                    children={`$${totalEarningsOnNextStatement}`}
                />
            </div>
        );
    };

    renderYTDRewardsEarned = () => {
        const { ytdRewardsEarned, YTDRewardsEarned } = this.props.rewards?.bankRewards || {};
        const currentYearRewardsEarned = ytdRewardsEarned || YTDRewardsEarned || '0';

        return (
            <div
                css={{
                    padding: '16px',
                    [mediaQueries.sm]: {
                        padding: '24px'
                    }
                }}
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize='lg'
                    lineHeight='tight'
                    children='Year-to-Date Rewards Earned'
                />
                <Divider marginY={4} />
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize='3xl'
                    lineHeight='tight'
                    children={`$${currentYearRewardsEarned}`}
                />
            </div>
        );
    };

    render() {
        return (
            <Grid
                columns={[null, '67fr 33fr']}
                gap={[4, 5]}
                marginBottom={[6, 0]}
            >
                <Box
                    boxShadow={'light'}
                    borderRadius={2}
                >
                    {this.renderYourRewards()}
                </Box>
                <div>
                    <Box
                        boxShadow={'light'}
                        borderRadius={2}
                    >
                        {this.renderNextStatementEarningCard()}
                    </Box>
                    <Box
                        boxShadow={'light'}
                        borderRadius={2}
                        marginTop={[4, 5]}
                    >
                        {this.renderYTDRewardsEarned()}
                    </Box>
                </div>
            </Grid>
        );
    }
}

const styles = {
    container: {
        margin: '16px',
        [mediaQueries.sm]: {
            margin: '24px'
        }
    }
};

export default wrapComponent(CreditCardRewards, 'CreditCardRewards', true);
