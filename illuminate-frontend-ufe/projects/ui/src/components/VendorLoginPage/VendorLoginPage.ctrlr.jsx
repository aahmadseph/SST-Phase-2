/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import formValidator from 'utils/FormValidator';
import sdnLogin from 'services/api/sdn/sdnLogin';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import scEvent from 'analytics/constants';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

import { colors, fontSizes, forms, lineHeights, space } from 'style/config';
import { Box, Text, Divider, Button, Link, Icon } from 'components/ui';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorList from 'components/ErrorList';
import LanguageLocale from 'utils/LanguageLocale';

import Logo from 'components/Logo/Logo';

const { getLocaleResourceFile } = LanguageLocale;

const ResponseStatusCode = {
    UNAUTHORIZE: 401,
    REDIRECT: 301
};

class VendorLoginPage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};
        this.loginInput = null;
        this.passwordInput = null;

        if (!Sephora.isNodeRender) {
            // Analytics - ILLUPH-124816
            digitalData.page.pageInfo.pageName = 'sign in-vendor';
            digitalData.page.category.pageType = 'sign in';

            this.isValid = this.isValid.bind(this);
            this.signIn = this.signIn.bind(this);
            this.failureTracking = this.failureTracking.bind(this);
        }
    }

    isValid = () => {
        const fieldsForValidation = [this.loginInput, this.passwordInput];
        const errors = formValidator.getErrors(fieldsForValidation);

        //Analytics
        if (errors.fields.length) {
            this.failureTracking(errors.fields, errors.messages);
        }

        return !errors.fields.length;
    };

    signIn = () => {
        // Clear any previous errors if present
        const { isAttentiveLogin } = this.props;
        this.setState({ errorMessages: null });

        if (this.isValid()) {
            const userId = this.loginInput.getValue();
            const password = this.passwordInput.getValue();
            sdnLogin(userId, password)
                .then(response => {
                    if (isAttentiveLogin && response.responseStatus === ResponseStatusCode.UNAUTHORIZE) {
                        Promise.resolve(
                            anaUtils.setNextPageData({
                                events: [scEvent.SIGN_IN_ATTEMPT, scEvent.EVENT_239]
                            })
                        ).then(() => {
                            window.location.replace(response.location);
                        });
                    }

                    if (!isAttentiveLogin && response.responseStatus === ResponseStatusCode.REDIRECT) {
                        Promise.resolve(
                            anaUtils.setNextPageData({
                                events: [scEvent.SIGN_IN_ATTEMPT, scEvent.EVENT_239]
                            })
                        ).then(() => {
                            window.location.replace(response.location);
                        });
                    }
                })
                .catch(e => {
                    this.failureTracking(['username', 'password'], e.errorMessages);
                    // Only need to handle errors as successful sign in will trigger a redirect
                    this.setState({ errorMessages: e.errorMessages });
                });
        }
    };

    failureTracking = (fields, messages) => {
        const analyticsData = {
            linkName: 'signin:vendor:error',
            bindingMethods: linkTrackingError,
            eventStrings: [scEvent.SIGN_IN_ATTEMPT, scEvent.SIGN_IN_FAILED],
            fieldErrors: fields,
            errorMessages: messages
        };
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: analyticsData });
    };

    render() {
        const { isAttentiveLogin } = this.props;
        const getText = getLocaleResourceFile('components/VendorLoginPage/locales', 'VendorLoginPage');

        return (
            <LegacyContainer paddingY={7}>
                <Box
                    is='form'
                    maxWidth='24.5em'
                    marginX='auto'
                    lineHeight='tight'
                    noValidate
                    onSubmit={e => {
                        e.preventDefault();
                        this.signIn();
                    }}
                >
                    {isAttentiveLogin ? (
                        <React.Fragment>
                            <svg
                                width={55}
                                height={64}
                                aria-hidden={true}
                                viewBox='0 0 55 64'
                                fill={colors.red}
                            >
                                <path d='M28 37.5v20.7H5.9V16.8H17s-.8-.4-1-2.6c0-2.3.8-3.1.8-3.3h-15c-1 0-1.8.8-1.8 1.8v49.2C0 63.2.8 64 1.8 64h30.4c1 0 1.8-.8 1.8-1.8V37.1s-2.7.8-6 .4z' />
                                <path d='M10.5 54h12.9c.2 0 .4-.2.4-.4v-2.9c0-.2-.2-.4-.4-.4H10.5c-.2 0-.7.2-.4.6v2.7c0 .2.2.4.4.4zM38.7 0c-8.6 0-15.9 6.9-15.9 15.8 0 2.1.4 3.7 1 5.6.4 1.2 1.2 3.3 1.8 4.5.2.8 1.2 2.7-.8 5.6 0 0 3.5 0 6.2-2.1l2.9 1c1.4.4 3.3.8 5.1.8 8.6 0 15.9-7.1 15.9-15.8S47.6 0 38.7 0zm3.6 19.7c0 1-1.1 1.8-2.1 1.8h-6.6c-1.2 0-2.1-.8-2.1-1.8 0-1.2 1-2.1 2.1-2.1h6.6c.9 0 2.3 1 2.1 2.1zm2-3.9H33.5c-1.2 0-2.1-.8-2.1-2.1s1-2.1 2.1-2.1h10.7c1 0 2.1.8 2.1 2.1s-1 2.1-2 2.1z' />
                            </svg>
                            <Divider
                                marginTop={3}
                                marginBottom={5}
                            />
                            <Text
                                is='h1'
                                fontSize='md'
                                fontWeight='bold'
                            >
                                {getText('restockMessage')}
                            </Text>
                            <Text
                                is='p'
                                marginTop={3}
                                marginBottom={6}
                            >
                                {getText('reorderMessage')}
                            </Text>
                        </React.Fragment>
                    ) : (
                        <Box
                            marginBottom={5}
                            marginTop={5}
                        >
                            <Logo />
                        </Box>
                    )}

                    <ErrorList errorMessages={this.state.errorMessages} />

                    <InputEmail
                        label={getText('emailLabel')}
                        name='username'
                        ref={c => {
                            if (c !== null) {
                                this.loginInput = c;
                            }
                        }}
                    />
                    <Box
                        position='relative'
                        minHeight={forms.HEIGHT + space[2] + fontSizes.sm * lineHeights.tight}
                    >
                        <TextInput
                            marginBottom={null}
                            required={true}
                            autoComplete='current-password'
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck={false}
                            type={this.state.showPassword ? 'text' : 'password'}
                            name='password'
                            label={getText('passwordLabel')}
                            infoLink={{
                                ['aria-label']: this.state.showPassword ? getText('hidePasswordLabel') : getText('showPasswordLabel'),
                                color: this.state.showPassword || 'gray',
                                onClick: () =>
                                    this.setState({
                                        showPassword: !this.state.showPassword
                                    }),
                                lineHeight: 0,
                                children: <Icon name={this.state.showPassword ? 'eye' : 'eyeCrossed'} />
                            }}
                            ref={c => {
                                if (c !== null) {
                                    this.passwordInput = c;
                                }
                            }}
                            validate={password => {
                                if (FormValidator.isEmpty(password)) {
                                    return getText('emptyPassword');
                                }

                                return null;
                            }}
                        />
                        {isAttentiveLogin && (
                            <Link
                                href='/'
                                target='_blank'
                                position='absolute'
                                right={0}
                                top={forms.HEIGHT + space[2]}
                                padding={2}
                                margin={-2}
                                fontSize='sm'
                            >
                                {getText('forgotPassword')}
                            </Link>
                        )}
                    </Box>
                    <Button
                        marginY={5}
                        variant='primary'
                        type='submit'
                        hasMinWidth={true}
                        children={getText('signIn')}
                    />

                    {isAttentiveLogin && (
                        <React.Fragment>
                            <Text is='p'>
                                {getText('noAccount')}{' '}
                                <Link
                                    color='blue'
                                    underline={true}
                                    target='_blank'
                                    href='/'
                                    children={getText('createAccount')}
                                />
                            </Text>
                            <Text
                                is='p'
                                marginTop={6}
                                fontSize='sm'
                                color='gray'
                                children={getText('disclaimer')}
                            />
                        </React.Fragment>
                    )}
                </Box>
                <Box
                    textAlign='center'
                    fontSize='sm'
                    color='gray'
                >
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        underline={true}
                        target='_blank'
                        href='/beauty/privacy-policy'
                        children={getText('privacyPolicy')}
                    />
                    {' & '}
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        underline={true}
                        target='_blank'
                        href='/beauty/terms-conditions-beauty-insider'
                        children={getText('beautyInsiderTerms')}
                    />
                </Box>
            </LegacyContainer>
        );
    }
}

export default wrapComponent(VendorLoginPage, 'VendorLoginPage', true);
