import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Divider, Link } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import IconCross from 'components/LegacyIcon/IconCross';
import CreditCardForm from 'components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/CreditCardForm';
import DateUtil from 'utils/Date';
import OrderUtils from 'utils/Order';
import creditCardUtils from 'utils/CreditCard';
import localeUtils from 'utils/LanguageLocale';
import agentAwareUtils from 'utils/AgentAware';
import ErrorMsg from 'components/ErrorMsg';
import { Grid, Button } from 'components/ui';
import utilityApi from 'services/api/utility';
import profileApi from 'services/api/profile';
import store from 'store/Store';
import UtilActions from 'utils/redux/Actions';
import errorsUtils from 'utils/Errors';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

class CreditCards extends BaseClass {
    state = {
        isEditMode: false,
        isAddCard: false,
        editCardId: null,
        user: {}
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        store.setAndWatch('user', this, ({ user: watchedUser }) => {
            if (this.state.user.profileId !== watchedUser.profileId) {
                this.setState({
                    user: watchedUser
                });

                this.setCountryList(watchedUser);
            }
        });
    }

    setCountryList = user => {
        this.userProfileId = user.profileId;

        utilityApi.getCountryList().then(billingCountries => {
            this.billingCountries = billingCountries;
        });
    };

    showAddCardForm = () => {
        this.setState({
            isAddCard: true,
            isEditMode: false
        });
    };

    cancelAddOrEditCardCallback = () => {
        this.setState({
            isAddCard: false,
            isEditMode: false
        });
    };

    updateCardsCallback = () => {
        profileApi.getCreditCardsFromProfile(this.userProfileId).then(data => {
            store.dispatch(UtilActions.merge('order', 'paymentOptions', data));
            this.setState({
                isAddCard: false,
                isEditMode: false
            });
        });
    };

    chooseDefaultCreditCard = creditCardId => {
        profileApi.setDefaultCreditCardOnProfile(creditCardId).then(() => {
            profileApi.getCreditCardsFromProfile(this.userProfileId).then(data => {
                store.dispatch(UtilActions.merge('order', 'paymentOptions', data));
            });
        });
    };

    deleteCreditCard = (creditCard, allCreditCards) => {
        if (creditCard.isDefault && allCreditCards[1]) {
            //need to set next card in list to default before deleting.
            profileApi.setDefaultCreditCardOnProfile(allCreditCards[1].creditCardId).then(() => {
                profileApi
                    .removeCreditCardFromProfile(this.userProfileId, creditCard.creditCardId)
                    .then(() => {
                        this.updateCardsCallback();
                    })
                    .catch(errorData => errorsUtils.collectAndValidateBackEndErrors(errorData, this));
            });
        } else {
            profileApi
                .removeCreditCardFromProfile(this.userProfileId, creditCard.creditCardId)
                .then(() => {
                    this.updateCardsCallback();
                })
                .catch(errorData => errorsUtils.collectAndValidateBackEndErrors(errorData, this));
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/Payments/CreditCards/locales', 'CreditCards');

        const { creditCards, defaultPayment } = this.props;
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        return (
            <div>
                {creditCards && creditCards.length
                    ? creditCards.map(card => (
                        <div
                            key={card.creditCardId}
                            data-at={Sephora.debug.dataAt('saved_credit_card')}
                        >
                            {this.state.isEditMode && card.creditCardId === this.state.editCardId ? (
                                <CreditCardForm
                                    creditCardIsDefaultPayment={creditCardIsDefaultPayment}
                                    isEditMode={true}
                                    creditCard={card}
                                    allCreditCards={creditCards}
                                    userProfileId={this.userProfileId}
                                    countryList={this.billingCountries}
                                    country={card.address.country}
                                    cancelAddOrEditCardCallback={this.cancelAddOrEditCardCallback}
                                    updateCardsCallback={this.updateCardsCallback}
                                />
                            ) : (
                                <>
                                    <LegacyGrid>
                                        <LegacyGrid.Cell width='fill'>
                                            {creditCardUtils.showExpiredMessage(card) && (
                                                <ErrorMsg marginBottom={2}>{getText('thisCardHasExpired')}</ErrorMsg>
                                            )}
                                            <Text
                                                is='p'
                                                marginBottom={2}
                                                lineHeight='tight'
                                                color={creditCardUtils.tokenMigrationFailed(card) && 'gray'}
                                            >
                                                {getText('cardDescText', [
                                                    creditCardUtils.getCardName(card.cardType),
                                                    creditCardUtils.shortenCardNumber(card.cardNumber)
                                                ])}
                                                <br />
                                                {getText('cardExpirationText', [
                                                    DateUtil.getShortenedMonth(card.expirationMonth),
                                                    card.expirationYear
                                                ])}
                                            </Text>
                                            {creditCardIsDefaultPayment && card.isDefault ? (
                                                <Text
                                                    is='p'
                                                    color='gray'
                                                >
                                                    {getText('defaultCreditCard')}
                                                </Text>
                                            ) : (
                                                creditCardUtils.tokenMigrationDisabledOrSucceed(card) && (
                                                    <Checkbox onClick={() => this.chooseDefaultCreditCard(card.creditCardId)}>
                                                        {getText('makeDefaultCreditCard')}
                                                    </Checkbox>
                                                )
                                            )}
                                        </LegacyGrid.Cell>
                                        <LegacyGrid.Cell
                                            width='4em'
                                            textAlign='right'
                                        >
                                            {!OrderUtils.isSephoraTempCardType(card) && creditCardUtils.tokenMigrationDisabledOrSucceed(card) && (
                                                <Link
                                                    color='blue'
                                                    lineHeight='tight'
                                                    paddingY={2}
                                                    marginY={-2}
                                                    onClick={() => {
                                                        this.setState({
                                                            isEditMode: true,
                                                            isAddCard: false,
                                                            editCardId: card.creditCardId
                                                        });
                                                    }}
                                                >
                                                    {getText('edit')}
                                                </Link>
                                            )}
                                        </LegacyGrid.Cell>
                                    </LegacyGrid>
                                    {creditCardUtils.tokenMigrationFailed(card) && (
                                        <Grid
                                            columns='1fr auto'
                                            fontSize='sm'
                                            lineHeight='tight'
                                            backgroundColor='nearWhite'
                                            alignItems='center'
                                            padding={3}
                                            borderRadius={2}
                                            marginTop={30}
                                        >
                                            <Text>{card.message}</Text>
                                            <Button
                                                variant='secondary'
                                                size='xs'
                                                children={getText('gotIt')}
                                                onClick={() => {
                                                    this.deleteCreditCard(card, creditCards);
                                                }}
                                            />
                                        </Grid>
                                    )}
                                </>
                            )}
                            <Divider marginY={Sephora.isMobile() ? 4 : 5} />
                        </div>
                    ))
                    : null}
                {!this.state.isAddCard ? (
                    <Link
                        hoverSelector='.linkTarget'
                        display='flex'
                        padding={2}
                        margin={-2}
                        onClick={this.showAddCardForm}
                        className={agentAwareUtils.applyHideAgentAwareClassToTiers(['1', '2'])}
                    >
                        <IconCross
                            fontSize='md'
                            marginRight={2}
                            marginTop='.125em'
                        />
                        <div>
                            <span className='linkTarget'>{getText('addCreditCard')}</span>
                            {localeUtils.isCanada() && (
                                <Text
                                    display='block'
                                    fontSize='sm'
                                    color='gray'
                                >
                                    {getText('debitCardDisclaimer')}
                                </Text>
                            )}
                        </div>
                    </Link>
                ) : (
                    <CreditCardForm
                        cancelAddOrEditCardCallback={this.cancelAddOrEditCardCallback}
                        updateCardsCallback={this.updateCardsCallback}
                        userProfileId={this.userProfileId}
                        countryList={this.billingCountries}
                        country={localeUtils.getCurrentCountry().toUpperCase()}
                    />
                )}
            </div>
        );
    }
}

const CreditCardsComponent = wrapComponent(CreditCards, 'CreditCards', true);

export default withEnsureUserIsSignedIn(CreditCardsComponent);
