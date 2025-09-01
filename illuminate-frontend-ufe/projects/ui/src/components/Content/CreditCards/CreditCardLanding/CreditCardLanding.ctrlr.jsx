/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import { USER_STATE } from 'constants/CreditCard';
import {
    Box, Button, Text, Link, Divider, Image
} from 'components/ui';
import mediaUtils from 'utils/Media';
import Banner from 'components/Content/Banner';
import contentConstants from 'constants/content';
import ComponentList from 'components/Content/ComponentList';
import CreditCardRewards from 'components/Content/CreditCards/CreditCardRewards';
import { MANAGE_CREDIT_CARD_LINKS } from 'constants/CreditCard';
import { mediaQueries } from 'style/config';
import creditCardPageBindings from 'analytics/bindingMethods/pages/creditCard/creditCardPageBindings';
import { Container } from 'components/ui';

const { CONTEXTS, BANNER_TYPES } = contentConstants;
const { Media } = mediaUtils;

class CreditCardLanding extends BaseClass {
    componentDidMount() {
        if (localeUtils.isCanada()) {
            urlUtils.redirectTo('/');
        }

        const { userCreditCardStatus } = this.props;

        creditCardPageBindings.setPageLoadAnalytics(userCreditCardStatus);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userCreditCardStatus !== prevProps.userCreditCardStatus) {
            creditCardPageBindings.setPageLoadAnalytics(this.props.userCreditCardStatus);
        }
    }

    renderNoCardSection = () => {
        const {
            nonCcContentZoneCollection: { nonCcContentZone },
            nonCcHeroZoneCollection: { nonCcHeroZone }
        } = this.props.content;

        const bannerData = nonCcHeroZone?.[0];

        return (
            <>
                {bannerData && (
                    <Banner
                        {...bannerData}
                        bannerType={BANNER_TYPES.HERO}
                        marginTop={0}
                        marginBottom={[6, 5]}
                        alignLeft
                    />
                )}
                <Container paddingX={[4, 0]}>
                    {nonCcContentZone && (
                        <ComponentList
                            enablePageRenderTracking={true}
                            trackingCount={1}
                            context={CONTEXTS.CONTAINER}
                            removeLastItemMargin={true}
                            removeFirstItemMargin={true}
                            items={nonCcContentZone}
                        />
                    )}
                </Container>
            </>
        );
    };

    renderCustomerSupportSection = () => {
        return (
            <>
                <Text
                    is='p'
                    lineHeight='tight'
                    marginBottom={5}
                >
                    {'Questions? We’re always here for you. Call customer support at '}
                    <Link
                        href={'tel:1-866-841-5037'}
                        color='blue'
                        underline={true}
                        children='1 866 841 5037'
                    />
                    {' | TDD/TTY'}
                    <Link
                        href={'tel:1-888-819-1918'}
                        color='blue'
                        underline={true}
                        children='1 888 819 1918'
                    />
                    {'.'}
                </Text>
                <Button
                    variant='primary'
                    onClick={e => {
                        e.preventDefault();
                        urlUtils.redirectTo('/');
                    }}
                    children='Continue Shopping'
                    minWidth={['100%', '224px']}
                    marginBottom={4}
                />
            </>
        );
    };

    renderInProgressSection = () => {
        return (
            <Box
                maxWidth={624}
                marginX={[4, 4, 0]}
                marginBottom={[7, 8]}
            >
                <Image
                    display='block'
                    size={[72, 96]}
                    marginBottom={4}
                    src='/img/ufe/credit-card/credit-card.svg'
                />
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize={['lg', 'xl']}
                    lineHeight='tight'
                    marginBottom={2}
                    children='Your credit card application is under review.'
                />
                <Text
                    is='p'
                    lineHeight='tight'
                    marginBottom={4}
                    children='Hang tight — Comenity Bank is currently reviewing your application, and you’ll be notified by mail within 10 business days. Thanks for your patience.'
                />
                {this.renderCustomerSupportSection()}
            </Box>
        );
    };

    approvedBannerButton = () => {
        const ccType = userUtils.getCreditCardType();
        const manageLink = MANAGE_CREDIT_CARD_LINKS[ccType?.toUpperCase()];

        return (
            <Button
                children='Pay My Bill'
                type='secondary'
                width={['fit-content', '114px']}
                css={{
                    borderRadius: '22px',
                    fontSize: '12px',
                    [mediaQueries.sm]: {
                        fontSize: '14px'
                    }
                }}
                marginTop={4}
                onClick={e => {
                    e.preventDefault();
                    urlUtils.redirectTo(manageLink);
                }}
            />
        );
    };

    renderApprovedSection = () => {
        const {
            ccContentZoneCollection: { ccContentZone },
            ccHeroZoneCollection: { ccHeroZone }
        } = this.props.content;

        const bannerData = ccHeroZone?.[0];

        return (
            <>
                {bannerData && (
                    <Banner
                        {...bannerData}
                        marginTop={0}
                        marginBottom={6}
                        bannerType={BANNER_TYPES.HERO}
                        alignLeft
                        customButton={this.approvedBannerButton}
                    />
                )}
                <Container paddingX={[4, 0]}>
                    <CreditCardRewards
                        rewards={this.props.ccRewards}
                        isScanRewardsButtonDisabled={
                            this.props.userCreditCardStatus === USER_STATE.CARD_NO_REWARDS ||
                            !userUtils.getRewardsAmount(this.props.ccRewards?.bankRewards)
                        }
                    />
                    <Media greaterThan='sm'>
                        <Divider
                            marginTop={6}
                            marginBottom={5}
                        />
                    </Media>
                    {ccContentZone && (
                        <ComponentList
                            enablePageRenderTracking={true}
                            trackingCount={1}
                            context={CONTEXTS.CONTAINER}
                            removeLastItemMargin={true}
                            removeFirstItemMargin={true}
                            items={ccContentZone}
                        />
                    )}
                </Container>
            </>
        );
    };

    renderClosedSection = () => {
        return (
            <Box
                maxWidth={624}
                marginX={[4, 4, 0]}
                marginBottom={[7, 8]}
            >
                <Image
                    display='block'
                    size={[72, 96]}
                    marginBottom={4}
                    src='/img/ufe/credit-card/account-closed.svg'
                />
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize={['lg', 'xl']}
                    lineHeight='tight'
                    marginBottom={2}
                    children='This account is not active.'
                />
                {this.renderCustomerSupportSection()}
            </Box>
        );
    };

    renderSignedInSection = () => {
        const { userCreditCardStatus } = this.props;

        return (
            <>
                {userCreditCardStatus === USER_STATE.NO_CARD && this.renderNoCardSection()}
                {userCreditCardStatus === USER_STATE.IN_PROGRESS && this.renderInProgressSection()}
                {(userCreditCardStatus === USER_STATE.CARD_NO_REWARDS || userCreditCardStatus === USER_STATE.CARD_AND_REWARDS) &&
                    this.renderApprovedSection()}
                {userCreditCardStatus === USER_STATE.CARD_CLOSED && this.renderClosedSection()}
            </>
        );
    };

    render() {
        return (
            <>
                {this.props.isAnonymous && this.renderNoCardSection()}
                {!this.props.isAnonymous && this.renderSignedInSection()}
            </>
        );
    }
}

export default wrapComponent(CreditCardLanding, 'CreditCardLanding', true);
