import React from 'react';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import { fontSizes, lineHeights } from 'style/config';
import { Box, Divider, Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import CreditCards from 'components/RichProfile/MyAccount/Payments/CreditCards/CreditCards';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import GiftCards from 'components/GiftCards';
import OtherPayments from 'components/RichProfile/MyAccount/Payments/OtherPayments/OtherPayments';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import DefaultPayment from 'components/RichProfile/MyAccount/Payments/DefaultPayment';
import sessionExtensionService from 'services/SessionExtensionService';
import paymentActions from 'actions/PaymentsActions';
import creditCardUtils from 'utils/CreditCard';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

const { loadChaseTokenizer } = creditCardUtils;

class Payments extends BaseClass {
    state = {
        user: {},
        isUserReady: false
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({
                        user: watchedUser,
                        isUserReady: true
                    });
                    this.getCreditCardsData(watchedUser);
                }
            }),
            this
        );
    }

    getCreditCardsData = user => {
        this.userProfileId = user.profileId;
        this.storeCredits = user.storeCredits;

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            loadChaseTokenizer();
        }

        store.dispatch(paymentActions.getCreditCardsFromProfile(this.userProfileId));
        store.setAndWatch('order.paymentOptions', this, null, true);
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);
    };

    removeDefaultPayment = defaultPayment => {
        store.dispatch(paymentActions.removeDefaultPaymentFromProfile(this.userProfileId, defaultPayment));
    };

    isUserAuthenticated = () => {
        return !!this.state.user && !!this.state.user.login;
    };

    isUserReady = () => {
        return this.state.isUserReady;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/Payments/locales', 'Payments');

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();

        const subheadDivider = isMobile ? <Divider marginY={4} /> : null;

        const subheadColWidth = isDesktop ? '16em' : null;
        const contentColWidth = isDesktop ? 'fill' : null;
        const getExpDateView = expirationDate => {
            const expDateObj = dateUtils.getDateObjectFromString(expirationDate);

            return expDateObj ? dateUtils.getDateInMDYFormat(expDateObj) : null;
        };

        const { paymentOptions } = this.state;
        const afterpayOrKlaraIsDefault = paymentOptions?.defaultPayment === 'klarna' || paymentOptions?.defaultPayment === 'afterpay';

        return (
            <AccountLayout
                section='account'
                page='payments'
                title={getText('paymentsAndCredits')}
            >
                {!Sephora.isNodeRender && this.isUserReady() && (
                    <React.Fragment>
                        {this.isUserAuthenticated() || <PleaseSignInBlock />}

                        {this.isUserAuthenticated() && (
                            <Box paddingY={5}>
                                <LegacyGrid>
                                    <LegacyGrid.Cell width={subheadColWidth}>
                                        <Text
                                            data-at={Sephora.debug.dataAt('form_title')}
                                            is='h2'
                                            css={styles.subhead}
                                        >
                                            {getText('creditCards')}
                                        </Text>
                                        {subheadDivider}
                                    </LegacyGrid.Cell>
                                    <LegacyGrid.Cell width={contentColWidth}>
                                        {paymentOptions?.creditCards && (
                                            <CreditCards
                                                creditCards={paymentOptions?.creditCards}
                                                defaultPayment={paymentOptions?.defaultPayment}
                                            />
                                        )}
                                    </LegacyGrid.Cell>
                                </LegacyGrid>

                                {(paymentOptions?.paypal || afterpayOrKlaraIsDefault) && (
                                    <React.Fragment>
                                        <SectionDivider />
                                        <LegacyGrid>
                                            <LegacyGrid.Cell width={subheadColWidth}>
                                                <Text
                                                    is='h2'
                                                    css={styles.subhead}
                                                >
                                                    {getText('otherPayments')}
                                                </Text>
                                                {subheadDivider}
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell width={contentColWidth}>
                                                {paymentOptions?.paypal && (
                                                    <OtherPayments
                                                        userProfileId={this.userProfileId}
                                                        paypalEmail={paymentOptions?.paypal.email}
                                                    />
                                                )}
                                                {paymentOptions?.paypal && afterpayOrKlaraIsDefault && (
                                                    <Divider marginY={Sephora.isMobile() ? 4 : 5} />
                                                )}
                                                {afterpayOrKlaraIsDefault && (
                                                    <DefaultPayment
                                                        onDeleteClick={this.removeDefaultPayment}
                                                        defaultPaymentName={paymentOptions?.defaultPayment}
                                                    />
                                                )}
                                            </LegacyGrid.Cell>
                                        </LegacyGrid>
                                    </React.Fragment>
                                )}

                                {this.storeCredits && this.storeCredits.length > 0 && (
                                    <React.Fragment>
                                        <SectionDivider />
                                        <LegacyGrid data-at={Sephora.debug.dataAt('ac_section')}>
                                            <LegacyGrid.Cell width={subheadColWidth}>
                                                <Text
                                                    is='h2'
                                                    css={styles.subhead}
                                                >
                                                    {getText('accountCredits')}
                                                </Text>
                                                {subheadDivider}
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell
                                                width={contentColWidth}
                                                lineHeight='tight'
                                            >
                                                {this.storeCredits.length
                                                    ? this.storeCredits.map((storeCredit, index) => (
                                                        <Text
                                                            key={storeCredit.expirationDate}
                                                            data-at={Sephora.debug.dataAt('account_credit')}
                                                            is='p'
                                                            marginTop={index > 0 && 4}
                                                        >
                                                            <Text data-at={Sephora.debug.dataAt('ac_amount')}>{storeCredit.amount}</Text>
                                                            <br />
                                                            {storeCredit.expirationDate ? (
                                                                <Text data-at={Sephora.debug.dataAt('ac_expires')}>
                                                                    {getText('expires') + ' '}
                                                                    {getExpDateView(storeCredit.expirationDate)}
                                                                </Text>
                                                            ) : null}
                                                        </Text>
                                                    ))
                                                    : null}
                                            </LegacyGrid.Cell>
                                        </LegacyGrid>
                                    </React.Fragment>
                                )}

                                <SectionDivider />

                                <LegacyGrid>
                                    <LegacyGrid.Cell width={subheadColWidth}>
                                        <Text
                                            is='h2'
                                            css={styles.subhead}
                                        >
                                            {getText('giftCards')}
                                        </Text>
                                        {subheadDivider}
                                    </LegacyGrid.Cell>
                                    <LegacyGrid.Cell width={contentColWidth}>
                                        <GiftCards />
                                    </LegacyGrid.Cell>
                                </LegacyGrid>
                            </Box>
                        )}
                    </React.Fragment>
                )}
            </AccountLayout>
        );
    }
}

const styles = {
    subhead: {
        fontSize: fontSizes.md,
        fontWeight: 'var(--font-weight-bold)',
        lineHeight: lineHeights.tight
    }
};

export const PaymentsComponent = wrapComponent(Payments, 'Payments', true);

export default withEnsureUserIsSignedIn(PaymentsComponent);
