import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import dateUtils from 'utils/Date';
import promoUtils from 'utils/Promos';
import {
    Button, Text, Divider, Grid, Icon, Link, Flex
} from 'components/ui';
import { fontSizes, space, colors } from 'style/config';
import Modal from 'components/Modal/Modal';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';

const { getLocaleResourceFile, getCurrentCountry, isCanada } = LanguageLocaleUtils;
const { openMultipleRougeRewardsModal } = RwdBasketActions;

const getText = getLocaleResourceFile('components/GlobalModals/MultipleRougeRewardsModal/locales', 'MultipleRougeRewardsModal');

class MultipleRougeRewardsModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            differentCountryCouponCode: null
        };
    }

    close = () => {
        openMultipleRougeRewardsModal(false);
    };

    handleApplyPromo = (e, coupon) => {
        const differentCountry = getCurrentCountry().toUpperCase() !== coupon.country.toUpperCase();

        if (differentCountry) {
            this.setState({ differentCountryCouponCode: coupon.couponCode.toLowerCase() });
        } else {
            this.setState({ differentCountryCouponCode: null });
            e.preventDefault();
            promoUtils.applyPromo(coupon.couponCode.toLowerCase(), null, promoUtils.CTA_TYPES.RRC);
        }
    };

    renderApply = (rewardData, appliedRougeRewards, availableRougeRewards) => {
        const isApplied = Boolean(
            appliedRougeRewards.length &&
                appliedRougeRewards.filter(reward => reward.couponCode.toLowerCase() === rewardData.couponCode.toLowerCase()).length
        );
        const appliedCouponCodes = appliedRougeRewards.map(appliedRougeReward => appliedRougeReward.couponCode.toLowerCase());
        const appliedCoupon = availableRougeRewards.find(
            availableRougeReward => appliedCouponCodes.indexOf(availableRougeReward.couponCode.toLowerCase()) >= 0
        );

        return isApplied ? (
            <span>
                <Icon
                    name='checkmark'
                    size='1em'
                    css={{
                        position: 'absolute',
                        transform: `translateX(calc(-100% - ${space[1]}px))`
                    }}
                />
                <Text fontWeight='bold'>{getText('applied')}</Text>
                <Link
                    is='p'
                    fontSize='xs'
                    fontWeight='normal'
                    display='block'
                    color='blue'
                    onClick={e => {
                        e.preventDefault();
                        promoUtils.removePromo(rewardData.couponCode.toLowerCase());
                    }}
                    children={getText('remove')}
                />
            </span>
        ) : (
            <Button
                variant='secondary'
                minHeight='auto'
                width='48px'
                css={{ fontSize: fontSizes.sm }}
                disabled={Boolean(appliedCoupon)}
                data-at={Sephora.debug.dataAt('apply_btn')}
                onClick={e => {
                    this.handleApplyPromo(e, rewardData);
                }}
            >
                {getText('apply')}
            </Button>
        );
    };

    renderRougeReward = (reward, index) => {
        const { availableRougeRewards, appliedRougeRewards, promo, rrcRemainingBalanceMessage } = this.props;
        const { differentCountryCouponCode } = this.state;
        const error = promoUtils.extractError(promo, [promoUtils.CTA_TYPES.RRC]);
        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const errorPromoCode = error?.promoCode ? error.promoCode.toLowerCase() : null;
        const differentCountryMessage = isCanada() ? getText('switchToUS') : getText('switchToCA');

        return (
            <div key={reward.couponCode}>
                {index === 0 && rrcRemainingBalanceMessage ? (
                    <Flex
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginBottom={3}
                        paddingX={3}
                        paddingY={2}
                        borderRadius={2}
                    >
                        <Icon
                            name='alert'
                            color='midGray'
                            marginRight={2}
                            size={18}
                        />
                        <Text
                            is='p'
                            flex={1}
                            alignSelf='center'
                            data-at={Sephora.debug.dataAt('warning_label')}
                            children={rrcRemainingBalanceMessage}
                        />
                    </Flex>
                ) : null}
                <Grid
                    lineHeight='tight'
                    columns='auto 1fr'
                    justifyItems='end'
                >
                    <p>
                        <Text
                            display='block'
                            fontWeight='bold'
                            dangerouslySetInnerHTML={{
                                __html: getText('rougeRewardsSubText', [reward.denomination])
                            }}
                        />
                        <Text
                            display='block'
                            fontSize={fontSizes.sm}
                            dangerouslySetInnerHTML={{
                                __html: getText('rougeRewardsExpirationMessage', [dateUtils.getDateInMMDDYYFormat(reward.expirationDate)])
                            }}
                        />
                    </p>
                    {this.renderApply(reward, appliedRougeRewards, availableRougeRewards)}
                </Grid>
                {errorMessage && errorPromoCode === reward.couponCode.toLowerCase() && (
                    <Text
                        is='p'
                        alignSelf='center'
                        fontSize='sm'
                        color={colors.gray}
                        marginTop={2}
                        lineHeight='tight'
                        marginBottom={[2, 3]}
                        data-at={Sephora.debug.dataAt('warning_label')}
                    >
                        {differentCountryCouponCode ? differentCountryMessage : errorMessage}{' '}
                    </Text>
                )}
                {index < availableRougeRewards.length - 1 && (
                    <Divider
                        marginY={3}
                        marginX={[-4, -6]}
                    />
                )}
            </div>
        );
    };

    renderRougeRewards = () => {
        const { availableRougeRewards } = this.props;

        return availableRougeRewards.map((reward, index) => this.renderRougeReward(reward, index));
    };

    render() {
        const { frictionlessCheckout } = Sephora?.configurationSettings || {};

        return (
            <Modal
                isDrawer={true}
                width={0}
                hasBodyScroll={true}
                showDismiss={true}
                isOpen={this.props.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title children={frictionlessCheckout?.global?.isEnabled ? getText('checkoutTitle') : getText('title')} />
                    {frictionlessCheckout?.global?.isEnabled && (
                        <Text
                            is='p'
                            children={getText('subtitle')}
                        />
                    )}
                </Modal.Header>
                <Modal.Body
                    overflowX='hidden'
                    css={{
                        paddingTop: space[3],
                        paddingBottom: space[3]
                    }}
                >
                    {this.renderRougeRewards()}
                </Modal.Body>
                <Modal.Footer paddingY={[2, 2]}>
                    <Grid justifyContent={['center', 'end']}>
                        <Button
                            variant='primary'
                            width={['97vw', 120]}
                            block={true}
                            onClick={this.close}
                            children={getText('done')}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(MultipleRougeRewardsModal, 'MultipleRougeRewardsModal', true);
