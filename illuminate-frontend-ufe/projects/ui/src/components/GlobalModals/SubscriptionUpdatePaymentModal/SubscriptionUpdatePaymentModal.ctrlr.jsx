import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { wrapComponent } from 'utils/framework';
import CreditCardUtils from 'utils/CreditCard';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import PaymentDisplay from 'components/Checkout/Sections/Payment/Display/PaymentDisplay';
import IconCross from 'components/LegacyIcon/IconCross';
import ErrorMsg from 'components/ErrorMsg';
import ErrorConstants from 'utils/ErrorConstants';
import FormValidator from 'utils/FormValidator';
import ErrorsUtils from 'utils/Errors';
import agentAwareUtils from 'utils/AgentAware';
import TextInput from 'components/Inputs/TextInput/TextInput';
import {
    space, colors, fontSizes, forms
} from 'style/config';
import {
    Link, Grid, Button, Divider, Box, Text
} from 'components/ui';

const LOGO_SIZE = {
    width: 50,
    height: 32
};
class SubscriptionUpdatePaymentModal extends BaseClass {
    state = {
        isHidden: true,
        selectedCreditCardId: null,
        updatedSecurityCode: ''
    };

    componentDidMount() {
        const { profileId, loadCreditCardList, fireGenericErrorAnalytics } = this.props;

        loadCreditCardList(
            profileId,
            'replenishment',
            () => {
                this.setState({
                    isHidden: false
                });
            },
            fireGenericErrorAnalytics
        );
    }

    handleSelectCreditCard = creditCard => () => {
        this.setState({
            selectedCreditCardId: creditCard.creditCardId,
            selectedCreditCard: creditCard,
            updatedSecurityCode: ''
        });
    };

    updateSecurityCode = e => {
        const securityCode = e.target.value;
        this.setState({
            updatedSecurityCode: securityCode
        });
    };

    securityCodeValidation = securityCode => {
        const { selectedCreditCardId, selectedCreditCard } = this.state;
        const { currentSubscription } = this.props;

        if (!selectedCreditCard || currentSubscription.paymentId === selectedCreditCardId) {
            return null;
        }

        if (FormValidator.isEmpty(securityCode)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE;
        } else if (securityCode.length < CreditCardUtils.getSecurityCodeLength(selectedCreditCard.cardType)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH;
        }

        return null;
    };

    handleOnSave = () => {
        const { selectedCreditCard, updatedSecurityCode, selectedCreditCardId } = this.state;

        const { currentSubscription } = this.props;

        if (!selectedCreditCardId || currentSubscription.paymentId === selectedCreditCardId) {
            this.props.onModalClose('saveUpdateMethod');

            return;
        }

        this.props.updateSubscriptionTypePayment({ selectedCreditCard, updatedSecurityCode, selectedCreditCardId, state: this.state });
    };

    handleOnRemoveClick = creditCard => () => {
        const { onRemoveClick, creditCards, subscriptionType, currentSubscription } = this.props;

        return onRemoveClick({
            creditCard,
            creditCards,
            analyticsKey: 'removeCard',
            subscriptionType,
            currentSubscription
        });
    };

    handleOnEditCard = creditCard => () => {
        const { handleEditCard, creditCardList, creditCards } = this.props;

        handleEditCard(creditCard, creditCardList, creditCards);
    };

    handleAddNewCardModal = () => {
        const { handleAddCardModal } = this.props;
        handleAddCardModal(false, 'addCard');
    };

    render() {
        const {
            creditCardList,
            isOpen,
            updatePaymentMethod,
            gotIt,
            remove,
            edit,
            addNewCardTitle,
            cancel,
            save,
            cvc,
            CVCDescription,
            isDisabled,
            currentSubscription,
            expiredCreditCardMsg
        } = this.props;

        const { selectedCreditCardId, selectedCreditCard, updatedSecurityCode } = this.state;

        const { isHidden } = this.state;

        const promptCVV = selectedCreditCardId && currentSubscription.paymentId !== selectedCreditCardId;

        const securityCodeErrors = this.securityCodeValidation(updatedSecurityCode || selectedCreditCard?.securityCode);

        return (
            <Modal
                width={0}
                onDismiss={this.props.onModalClose}
                isOpen={isOpen}
                isHidden={isHidden}
                isDrawer={true}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title children={updatePaymentMethod} />
                </Modal.Header>
                <Modal.Body>
                    {creditCardList && creditCardList.length > 0
                        ? creditCardList.map((creditCard, index) => (
                            <React.Fragment key={`cc_wrapper_${index}`}>
                                {CreditCardUtils.showExpiredMessage(creditCard) && (
                                    <ErrorMsg
                                        lineHeight='none'
                                        marginBottom={1}
                                        paddingTop={2}
                                        children={expiredCreditCardMsg}
                                    />
                                )}
                                <div key={`cc_${index}`}>
                                    <Radio
                                        css={styles.creditCardContainer}
                                        checked={
                                            selectedCreditCardId
                                                ? creditCard.creditCardId === selectedCreditCardId
                                                : creditCard.creditCardId === currentSubscription.paymentId
                                        }
                                        disabled={isDisabled(creditCard) || CreditCardUtils.tokenMigrationFailed(creditCard)}
                                        onClick={this.handleSelectCreditCard(creditCard)}
                                    >
                                        <PaymentDisplay
                                            creditCard={creditCard}
                                            showDefault={creditCard.isDefault}
                                        />
                                    </Radio>
                                    {CreditCardUtils.tokenMigrationFailed(creditCard) ? (
                                        <Grid
                                            columns='1fr auto'
                                            fontSize='sm'
                                            lineHeight='tight'
                                            backgroundColor='nearWhite'
                                            alignItems='center'
                                            padding={3}
                                            borderRadius={2}
                                            marginTop={10}
                                        >
                                            <Text>{creditCard.message}</Text>
                                            <Button
                                                variant='secondary'
                                                size='xs'
                                                children={gotIt}
                                                onClick={this.handleOnRemoveClick(creditCard)}
                                            />
                                        </Grid>
                                    ) : (
                                        <Box css={styles.editRemoveLink}>
                                            <Link
                                                css={styles.blueLink}
                                                onClick={this.handleOnRemoveClick(creditCard)}
                                            >
                                                {remove}
                                            </Link>
                                            <Text
                                                marginX='.5em'
                                                children='|'
                                            />
                                            <Link
                                                css={styles.blueLink}
                                                onClick={this.handleOnEditCard(creditCard)}
                                            >
                                                {edit}
                                            </Link>
                                        </Box>
                                    )}

                                    {promptCVV && selectedCreditCardId === creditCard.creditCardId && (
                                        <>
                                            <Text
                                                is='p'
                                                marginX='2.3em'
                                                marginTop='1em'
                                            >
                                                {CVCDescription}
                                            </Text>
                                            <Grid
                                                marginTop={3}
                                                marginBottom={3}
                                                marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN}
                                                columns={2}
                                                gap={4}
                                            >
                                                <TextInput
                                                    marginBottom={null}
                                                    autoComplete='cc-csc'
                                                    autoCorrect='off'
                                                    data-at={Sephora.debug.dataAt('cvv_input')}
                                                    error={securityCodeErrors && ErrorsUtils.getMessage(securityCodeErrors)}
                                                    infoLabel='More info about CVV'
                                                    inputMode='numeric'
                                                    invalid={securityCodeErrors}
                                                    label={cvc}
                                                    maxLength={CreditCardUtils.getSecurityCodeLength(selectedCreditCard?.cardType)}
                                                    name='securityCode'
                                                    onChange={this.updateSecurityCode}
                                                    onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                                    pattern='\d*'
                                                    ref={this.cvvRef}
                                                    required={true}
                                                    validateError={this.securityCodeValidation}
                                                    value={updatedSecurityCode}
                                                />
                                            </Grid>
                                            <Divider />
                                        </>
                                    )}
                                    <Divider />
                                </div>
                            </React.Fragment>
                        ))
                        : null}
                    <Box>
                        <Link
                            css={styles.addCard}
                            data-at={Sephora.debug.dataAt('add_new_credit_card')}
                            onClick={this.handleAddNewCardModal}
                            className={agentAwareUtils.applyHideAgentAwareClassToTiers(['1', '2'])}
                        >
                            <IconCross fontSize={forms.RADIO_SIZE} />
                            <Box
                                css={styles.newCardIcon}
                                fontSize={LOGO_SIZE}
                                aria-hidden
                            >
                                <PaymentLogo />
                            </Box>
                            <div>
                                <Text
                                    css={styles.inlineBlock}
                                    children={addNewCardTitle}
                                />
                            </div>
                        </Link>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Grid
                        columns={2}
                        gap={3}
                    >
                        <Button
                            onClick={this.props.onModalClose}
                            variant='secondary'
                        >
                            {cancel}
                        </Button>
                        <Button
                            onClick={!securityCodeErrors ? this.handleOnSave : undefined}
                            variant='primary'
                        >
                            {save}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    creditCardContainer: {
        alignItems: 'center',
        marginTop: `${space[2]}px`,
        marginBottom: `${space[2]}px`
    },
    editRemoveLink: {
        marginTop: `${space[2]}px`,
        marginBottom: `${space[2]}px`,
        marginLeft: `${space[6]}px`
    },
    blueLink: {
        color: `${colors.blue}`,
        fontSize: `${fontSizes.base}px`
    },
    inlineBlock: {
        display: 'inline-block',
        fontWeight: 'bold',
        fontSize: `${fontSizes.base}px`,
        lineHeight: 'tight'
    },
    addCard: {
        display: 'flex',
        alignItems: 'center',
        padding: `${space[3]}px ${space[5]}px ${space[3]}px 0`,
        marginTop: `${space[1]}px`,
        marginBottom: `${space[1]}px`
    },
    newCardIcon: {
        marginLeft: `${forms.RADIO_MARGIN}px`,
        marginRight: `${space[4]}px`
    }
};

SubscriptionUpdatePaymentModal.defaultProps = {};

SubscriptionUpdatePaymentModal.propTypes = {
    creditCardList: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    handleUpdatePaymentModal: PropTypes.func.isRequired,
    updatePaymentMethod: PropTypes.string.isRequired,
    gotIt: PropTypes.string.isRequired,
    remove: PropTypes.string.isRequired,
    edit: PropTypes.string.isRequired,
    addNewCardTitle: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
    save: PropTypes.string.isRequired,
    cvc: PropTypes.string.isRequired,
    updateSecurityCode: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired
};

export default wrapComponent(SubscriptionUpdatePaymentModal, 'SubscriptionUpdatePaymentModal', true);
