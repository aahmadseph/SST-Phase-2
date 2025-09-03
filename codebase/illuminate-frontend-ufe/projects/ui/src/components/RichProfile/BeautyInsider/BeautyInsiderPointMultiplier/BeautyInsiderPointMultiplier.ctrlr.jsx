import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import Actions from 'Actions';
import { space } from 'style/config';
import {
    Link, Grid, Box, Flex, Image, Text, Button, Divider
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import Markdown from 'components/Markdown/Markdown';
import helperUtils from 'utils/Helpers';

import promoUtils from 'utils/Promos';
import bccUtils from 'utils/BCC';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';

const {
    MEDIA_IDS: { POINT_MULTIPLIER_MODAL }
} = bccUtils;
const getText = localeUtils.getLocaleResourceFile(
    'components/RichProfile/BeautyInsider/BeautyInsiderPointMultiplier/locales',
    'BeautyInsiderPointMultiplier'
);

class BeautyInsiderPointMultiplier extends BaseClass {
    isDesktop = Sephora.isDesktop();

    constructor(props) {
        super(props);
        this.state = {
            promoCode: this.props.promoCode,
            promoApplied: this.props.promoApplied
        };
    }

    componentDidMount() {
        store.setAndWatch('basket', this, value => {
            // Set promoApplied state to false if promo removed due to necessary
            // merch being removed from basket
            let pointMultiplier;
            const basket = value.basket || {};
            const appliedPromos = basket.appliedPromotions || [];

            if (appliedPromos.length) {
                pointMultiplier = appliedPromos.filter(promo => {
                    return promo.couponCode === this.props.promoCode;
                });
            }

            if (!pointMultiplier && this.state.promoApplied && basket.promoWarning) {
                this.setState({ promoApplied: false });
            }
        });
    }

    render() {
        const {
            pointMultiplierContentMsg, pointMultiplierHeading, promoCode, promoEndDate, userLevelPointMultiplier, userMultiplier
        } = this.props;

        return (
            <div>
                <Grid
                    alignItems='baseline'
                    marginBottom={[5, 7]}
                    lineHeight='none'
                    columns={['auto 1fr auto', '1fr auto 1fr']}
                >
                    <Box alignSelf='center'>
                        <Image
                            display={[null, 'none']}
                            src='/img/ufe/icons/multiplier.svg'
                            size={24}
                        />
                    </Box>
                    <Text
                        is='h2'
                        fontFamily='serif'
                        textAlign={[null, 'center']}
                        fontSize={['xl', '2xl']}
                        data-at={Sephora.debug.dataAt('pm_event_level')}
                        children={getText('pointMultiplier')}
                    />
                    <Flex justifyContent='flex-end'>
                        <Link
                            padding={2}
                            margin={-2}
                            arrowDirection='right'
                            children={getText('details')}
                            data-at={Sephora.debug.dataAt('pm_details_btn')}
                            onClick={BeautyInsiderPointMultiplier.triggerPointMultiplierModal}
                        />
                    </Flex>
                </Grid>
                <Box
                    lineHeight='tight'
                    {...(this.isDesktop && {
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
                            this.isDesktop && {
                                flex: 1,
                                paddingLeft: space[8],
                                paddingRight: space[6]
                            }
                        }
                    >
                        {BeautyInsiderPointMultiplier.renderDate({ promoEndDate })}
                        {BeautyInsiderPointMultiplier.renderContent({
                            userMultiplier,
                            pointMultiplierContentMsg,
                            promoCode
                        })}
                        {this.isDesktop && this.renderCallToAction()}
                    </div>
                    <div
                        css={this.isDesktop && { width: 311 }}
                        data-at={Sephora.debug.dataAt('pm_event_details_section')}
                    >
                        {BeautyInsiderPointMultiplier.renderDetails({
                            pointMultiplierHeading,
                            userLevelPointMultiplier
                        })}
                        {this.isDesktop || this.renderCallToAction()}
                    </div>
                </Box>
            </div>
        );
    }

    static triggerPointMultiplierModal() {
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: POINT_MULTIPLIER_MODAL,
                title: getText('pointMultiplierEventTitle'),
                dismissButtonText: getText('gotIt')
            })
        );
    }

    static renderDate(options) {
        return (
            <Flex marginBottom={4}>
                <Text
                    is='p'
                    lineHeight='none'
                    backgroundColor='black'
                    color='white'
                    fontSize='xs'
                    fontWeight='bold'
                    borderRadius={2}
                    padding='.25em .75em .375em'
                    data-at={Sephora.debug.dataAt('pm_expire_date')}
                    children={getText('ends', [options.promoEndDate])}
                />
            </Flex>
        );
    }

    static renderContent(options) {
        return (
            <React.Fragment>
                <Image
                    display='block'
                    height={16}
                    src={`/img/ufe/bi/logo-${options.userMultiplier.userType.toLowerCase()}.svg`}
                    data-at={Sephora.debug.dataAt('pm_user_status')}
                    alt={options.userMultiplier.userType}
                />
                <Text
                    is='p'
                    display='flex'
                    lineHeight='none'
                    fontSize={80}
                    marginTop='-.125em'
                    data-at={Sephora.debug.dataAt('pm_value')}
                    css={{ alignItems: 'baseline' }}
                >
                    <Text
                        fontFamily='serif'
                        letterSpacing='-.025em'
                        children={options.userMultiplier.multiplier.toLowerCase()}
                    />
                    <Text
                        fontSize='sm'
                        marginLeft={2}
                        children={getText('perDollar')}
                    />
                </Text>
                <Markdown
                    marginTop={2}
                    marginBottom={4}
                    data-at={Sephora.debug.dataAt('pm_coupon_msg')}
                    content={helperUtils.replaceDoubleAsterisks(options.pointMultiplierContentMsg)}
                />
            </React.Fragment>
        );
    }

    static renderDetails(options) {
        return (
            <Box
                backgroundColor='nearWhite'
                paddingX={4}
                paddingY={3}
                borderRadius={2}
            >
                <Markdown
                    data-at={Sephora.debug.dataAt('pm_event_details_label')}
                    content={helperUtils.replaceDoubleAsterisks(options.pointMultiplierHeading)}
                />
                {options.userLevelPointMultiplier.map(userLevel => (
                    <div
                        key={`pm_${userLevel.userType.toLowerCase()}_level`}
                        data-at={Sephora.debug.dataAt(`pm_${userLevel.userType.toLowerCase()}_level`)}
                    >
                        <Divider marginY={3} />
                        <b>{userLevel.userType}:</b> {userLevel.multiplier}{' '}
                        <Text
                            css={{ textTransform: 'lowercase' }}
                            children={getText('perDollar')}
                        />
                    </div>
                ))}
            </Box>
        );
    }

    applyPromo = () => {
        const { getBasicAnalyticsData } = promoUtils;
        promoUtils.getBasicAnalyticsData = (...args) => ({
            ...getBasicAnalyticsData(...args),
            actionInfo: 'bi:points multiplier:apply promo'
        });
        const restoreOriginalFunction = () => (promoUtils.getBasicAnalyticsData = getBasicAnalyticsData);
        promoUtils
            .applyPromo(this.state.promoCode)
            .then(data => {
                restoreOriginalFunction();
                this.setState({ promoApplied: !(data && data.errorCode) });
            })
            .catch(restoreOriginalFunction);
    };

    removePromo = () => {
        promoUtils.removePromo(this.state.promoCode).then(() => {
            this.setState({ promoApplied: false });
        });
    };

    renderCallToAction = () => {
        return this.state.promoApplied ? (
            <Button
                {...(this.isDesktop
                    ? { hasMinWidth: true }
                    : {
                        marginTop: 4,
                        block: true
                    })}
                variant='secondary'
                onClick={this.removePromo}
                data-at={Sephora.debug.dataAt('pm_apply_promo_button')}
            >
                <Box>
                    <Flex>
                        <IconCheckmark
                            fontSize='.875em'
                            marginRight={1}
                        />
                        <Text
                            css={{ textTransform: 'capitalize' }}
                            data-at={Sephora.debug.dataAt('pm_applied_label')}
                            fontWeight='bold'
                        >
                            {getText('applied')}
                        </Text>
                    </Flex>
                    <Link
                        color='blue'
                        padding={2}
                        margin={-2}
                        css={{ textTransform: 'capitalize' }}
                        fontWeight='normal'
                        onClick={this.removePromo}
                        data-at={Sephora.debug.dataAt('pm_remove_label')}
                        children={getText('remove')}
                    />
                </Box>
            </Button>
        ) : (
            <Button
                {...(this.isDesktop
                    ? { hasMinWidth: true }
                    : {
                        marginTop: 4,
                        block: true
                    })}
                variant='secondary'
                onClick={this.applyPromo}
                data-at={Sephora.debug.dataAt('pm_apply_promo_button')}
                children={getText('apply')}
            />
        );
    };
}

export default wrapComponent(BeautyInsiderPointMultiplier, 'BeautyInsiderPointMultiplier', true);
