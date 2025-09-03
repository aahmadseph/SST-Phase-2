/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import withSuspenseLoadHoc from 'utils/framework/hocs/withSuspenseLoadHoc';
const RegisterForm = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RegisterModal/RegisterForm/RegisterForm'))
);
import { Box, Text, Link } from 'components/ui';
import AccordionButton from 'components/Checkout/AccordionButton';
import FormsUtils from 'utils/Forms';
import localeUtils from 'utils/LanguageLocale';
import ReCaptchaText from 'components/ReCaptchaText/ReCaptchaText';
import OrderActions from 'actions/OrderActions';
import store from 'store/Store';
import Location from 'utils/Location';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

const isBIAutoEnrollEnabled = Sephora.configurationSettings.isBIAutoEnrollEnabled && localeUtils.isUS();

class AccountCreationSection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            editName: false,
            inStoreUser: false
        };
        this.registerForm = null;
    }

    componentDidMount() {
        // if user is POS
        if (this.props.profile && this.props.profile.isStoreBiMember) {
            this.setState({ inStoreUser: true }, this.registerForm.inStoreUserHandler(this.props.profile));
        }
    }

    createAccount = () => {
        this.registerForm.validateCaptchaAndRegister(function () {
            store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname));
        }, INTERSTICE_DELAY_MS);
    };

    handleEditName = () => {
        this.setState({ editName: true });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/AccountCreation/locales', 'AccountCreation');
        const isMobile = Sephora.isMobile();
        const { profile } = this.props;

        const biData = {
            firstName: profile.firstName,
            lastName: profile.lastName
        };

        if (profile && profile.beautyInsiderAccount) {
            biData.bMon = profile.beautyInsiderAccount.birthMonth;
            biData.bDay = profile.beautyInsiderAccount.birthDay;
            biData.bYear = profile.beautyInsiderAccount.birthYear;
        }

        if (!profile.login) {
            return null;
        }

        const editName = this.state.editName || !profile.firstName || !profile.lastName;

        return (
            <form
                noValidate
                onSubmit={e => {
                    e.preventDefault();
                    this.createAccount();
                }}
            >
                <Text is='p'>
                    {getText('emailLabel')}:{' '}
                    <b
                        data-at={Sephora.debug.dataAt('account_email')}
                        children={profile.login}
                    />
                </Text>

                {editName || (
                    <Text is='p'>
                        {getText('nameLabel')}:{' '}
                        <b
                            data-at={Sephora.debug.dataAt('account_name')}
                            children={profile.firstName + ' ' + profile.lastName}
                        />
                        <Link
                            padding={2}
                            marginY={-2}
                            color='blue'
                            data-at={Sephora.debug.dataAt('account_edit')}
                            onClick={this.handleEditName}
                            children={getText('editLink')}
                        />
                    </Text>
                )}

                <Box marginTop={isMobile ? 4 : 5}>
                    <RegisterForm
                        editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.ACCOUNT_CREATION)}
                        presetLogin={profile.login}
                        biData={biData}
                        hideName={!editName}
                        hideEmail={true}
                        hideButton={true}
                        isCheckout={true}
                        inStoreUser={this.state.inStoreUser}
                        isBIAutoEnroll={isBIAutoEnrollEnabled}
                        ref={c => {
                            if (c !== null) {
                                this.registerForm = c;
                            }
                        }}
                    />
                </Box>

                <AccordionButton type='submit' />

                <ReCaptchaText marginTop={6} />
            </form>
        );
    }
}

export default wrapComponent(AccountCreationSection, 'AccountCreationSection');
