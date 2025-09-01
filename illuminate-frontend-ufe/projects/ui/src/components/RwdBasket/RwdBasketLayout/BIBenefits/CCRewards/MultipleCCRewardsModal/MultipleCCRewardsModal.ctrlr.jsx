import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import dateUtils from 'utils/Date';
import promoUtils from 'utils/Promos';
import isFunction from 'utils/functions/isFunction';
import {
    Button, Text, Divider, Grid, Icon, Link, Flex, Box
} from 'components/ui';
import {
    fontSizes, fontWeights, space, colors
} from 'style/config';
import Modal from 'components/Modal/Modal';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile(
    'components/RwdBasket/RwdBasketLayout/BIBenefits/CCRewards/MultipleCCRewardsModal/locales',
    'MultipleCCRewardsModal'
);

class MultipleCCRewardsModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    close = () => {
        this.props.closeMultipleCCRewardsModal();
    };

    renderApply = ({
        rewardData, appliedRewardsCount, hasError = null, isFirstPurchaseDiscount = false, hasRemainingBalanceWarning = false
    }) => {
        return rewardData.isApplied ? (
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
                        promoUtils.removePromo(rewardData.certificateNumber.toLowerCase(), promoUtils.CTA_TYPES.CCR);
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
                disabled={(!isFirstPurchaseDiscount && appliedRewardsCount >= 3) || hasError || hasRemainingBalanceWarning}
                data-at={Sephora.debug.dataAt('apply_btn')}
                onClick={e => {
                    e.preventDefault();
                    promoUtils.applyPromo(rewardData.certificateNumber.toLowerCase(), null, promoUtils.CTA_TYPES.CCR);
                }}
            >
                {getText('apply')}
            </Button>
        );
    };

    renderAvailableAndAppliedText = () => {
        const { availableRewardsTotal, appliedRewardsTotal, firstTimeCCDiscount } = this.props;
        const { frictionlessCheckout } = Sephora.configurationSettings || {};

        return (
            <Text
                is='p'
                fontSize={'14px'}
                fontWeight='normal'
            >
                {firstTimeCCDiscount && (
                    <Text>
                        <strong>{`${firstTimeCCDiscount.shortDisplayName} `}</strong>
                        {getText(firstTimeCCDiscount.isApplied ? 'applied' : 'available').toLowerCase()}
                    </Text>
                )}
                {firstTimeCCDiscount && (availableRewardsTotal > 0 || appliedRewardsTotal > 0) && <strong>{' • '}</strong>}
                {appliedRewardsTotal > 0 && (
                    <Text>
                        <strong>{`$${appliedRewardsTotal} ${frictionlessCheckout?.global?.isEnabled ? getText('off') : ''} `}</strong>
                        {getText('applied').toLowerCase()}
                    </Text>
                )}
                {(appliedRewardsTotal === 0 || !firstTimeCCDiscount) && availableRewardsTotal > 0 && (
                    <Text>
                        <strong>
                            {appliedRewardsTotal !== 0 && !firstTimeCCDiscount ? ' • ' : ''}
                            {`$${availableRewardsTotal} ${frictionlessCheckout?.global?.isEnabled ? getText('off') : ''} `}
                        </strong>
                        {getText('available')}
                    </Text>
                )}
            </Text>
        );
    };

    renderCCReward = (reward, index) => {
        const {
            ccRemainingBalanceMessage, error, appliedRewardsCount, rewardCertificates, firstTimeCCDiscount, hasRemainingBalanceWarning
        } =
            this.props;

        const errorMessage = error?.errorMessages?.length ? error.errorMessages.join(' ') : null;
        const errorPromoCode = error?.promoCode ? error.promoCode.toLowerCase() : null;
        const hasError = errorMessage && errorPromoCode === reward.certificateNumber.toLowerCase();

        return (
            <div key={reward.certificateNumber}>
                {index === 0 && ccRemainingBalanceMessage ? (
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
                            children={ccRemainingBalanceMessage}
                        />
                    </Flex>
                ) : null}
                {index === 0 && firstTimeCCDiscount && this.renderFirstPurchaseDiscount(errorMessage, errorPromoCode)}
                {index === 0 && rewardCertificates.length > 2 && (
                    <Text
                        is='p'
                        fontSize='sm'
                        marginBottom={2}
                        color={colors.gray}
                        children={`${getText('selectThree')}:`}
                    />
                )}
                <Grid
                    lineHeight='tight'
                    columns='auto 1fr'
                    justifyItems='end'
                >
                    <p>
                        <Text
                            display='block'
                            dangerouslySetInnerHTML={{
                                __html: getText('creditCardReward', [reward.rewardAmount])
                            }}
                        />
                        <Text
                            display='block'
                            fontSize={fontSizes.sm}
                            dangerouslySetInnerHTML={{
                                __html: getText('expiry', [dateUtils.getDateInMMDDYYFormat(reward.expireDate)])
                            }}
                        />
                    </p>
                    {this.renderApply({ rewardData: reward, appliedRewardsCount, hasError, hasRemainingBalanceWarning })}
                </Grid>
                {rewardCertificates.length > 3 && appliedRewardsCount === 3 && index === 2 ? (
                    <Flex
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginY={3}
                        paddingX={3}
                        paddingY={2}
                        borderRadius={2}
                    >
                        <Text
                            is='p'
                            alignSelf='center'
                            data-at={Sephora.debug.dataAt('warning_label')}
                        >
                            {getText('maxRewardsReached')}
                        </Text>
                    </Flex>
                ) : null}
                {hasError && (
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
                        {errorMessage}
                    </Text>
                )}
                {index < rewardCertificates.length - 1 && (
                    <Divider
                        marginY={3}
                        marginX={[-4, -6]}
                    />
                )}
            </div>
        );
    };

    renderCCRewards = () => {
        const { rewardCertificates } = this.props;

        return rewardCertificates.map((reward, index) => <>{this.renderCCReward(reward, index)}</>);
    };

    renderFirstPurchaseDiscount = (errorMessage, errorPromoCode) => {
        const { rewardCertificates, appliedRewardsCount, firstTimeCCDiscount } = this.props;
        const hasError = errorMessage?.length && errorPromoCode === firstTimeCCDiscount.certificateNumber.toLowerCase();

        return (
            <>
                <Grid
                    lineHeight='tight'
                    columns='auto 1fr'
                    justifyItems='end'
                >
                    <p>
                        <Text
                            display='block'
                            dangerouslySetInnerHTML={{
                                __html: getText('firstTimeDiscount', [firstTimeCCDiscount.shortDisplayName])
                            }}
                        />
                        <Text
                            display='block'
                            fontSize={fontSizes.sm}
                            dangerouslySetInnerHTML={{
                                __html: getText('expiry', [dateUtils.getDateInMMDDYYFormat(firstTimeCCDiscount.expireDate)])
                            }}
                        />
                    </p>
                    {this.renderApply({ rewardData: firstTimeCCDiscount, appliedRewardsCount, hasError, isFirstPurchaseDiscount: true })}
                </Grid>
                {hasError && (
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
                        {errorMessage}
                    </Text>
                )}
                <Divider
                    thick={true}
                    marginTop={3}
                    marginBottom={rewardCertificates.length > 2 ? 2 : 3}
                    marginX={[-4, -6]}
                />
            </>
        );
    };

    render() {
        const { orderSubTotal, grossSubTotal, infoModalCallback } = this.props;
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
                <Modal.Header {...(frictionlessCheckout?.global?.isEnabled && { paddingBottom: 3 })}>
                    <Modal.Title>{getText('title')} </Modal.Title>
                    {this.renderAvailableAndAppliedText()}
                </Modal.Header>
                <Modal.Body
                    overflowX='hidden'
                    paddingBottom={4}
                    paddingTop={3}
                    {...(frictionlessCheckout?.global?.isEnabled && { paddingX: 4 })}
                >
                    {this.renderCCRewards()}
                </Modal.Body>
                <Modal.Footer {...(frictionlessCheckout?.global?.isEnabled && { paddingX: 4, paddingY: 2 })}>
                    <Flex
                        width='100%'
                        justifyContent={'space-between'}
                        fontWeight='bold'
                    >
                        <Text>{getText('orderSubTotal')}</Text>
                        <Box
                            is='span'
                            alignItems='baseline'
                            display='inline-flex'
                            gap={1}
                        >
                            {grossSubTotal && (
                                <Text
                                    color={colors.gray}
                                    fontWeight={fontWeights.normal}
                                    css={{ textDecoration: 'line-through' }}
                                    children={grossSubTotal}
                                />
                            )}
                            <Text children={orderSubTotal} />
                        </Box>
                    </Flex>
                    <Text
                        is='p'
                        fontSize={frictionlessCheckout?.global?.isEnabled ? 'xs' : 'sm'}
                        marginTop={2}
                        color={colors.gray}
                    >
                        {getText(frictionlessCheckout?.global?.isEnabled ? 'ccMessageWithoutStar' : 'ccMessage')}
                        {isFunction(infoModalCallback) && (
                            <>
                                <Link
                                    color='blue'
                                    children={`${getText('clickHere')}.`}
                                    underline={true}
                                    onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                                />
                            </>
                        )}
                    </Text>
                    <Divider
                        marginY={3}
                        marginX={frictionlessCheckout?.global?.isEnabled ? -4 : [-4, -6]}
                    />
                    {frictionlessCheckout?.global?.isEnabled ? (
                        <Button
                            variant='primary'
                            width='100%'
                            onClick={this.close}
                            children={getText('done')}
                        />
                    ) : (
                        <Grid justifyContent={['center', 'end']}>
                            <Button
                                variant='primary'
                                width={['97vw', 120]}
                                block={true}
                                onClick={this.close}
                                children={getText('done')}
                            />
                        </Grid>
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(MultipleCCRewardsModal, 'MultipleCCRewardsModal', true);
