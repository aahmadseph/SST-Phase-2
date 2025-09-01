import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { measure } from 'style/config';
import {
    Box, Text, Button, Link
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorMsg from 'components/ErrorMsg';
import ErrorConstants from 'utils/ErrorConstants';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import utilityApi from 'services/api/checkout';
import urlUtils from 'utils/Url';
import ErrorsUtils from 'utils/Errors';
import userUtils from 'utils/User';
import auth from 'utils/Authentication';
import { HEADER_VALUE } from 'constants/authentication';
import OrderUtils from 'utils/Order';

const { getLocaleResourceFile } = localeUtils;
const constants = {
    urls: {
        ORDER_DETAILS_PAGE: '/profile/orderdetail/',
        ORDER_SIGNED_PAGE: '/profile/MyAccount/Orders'
    }
};

class OrderStatusLookup extends BaseClass {
    state = {
        showSignInText: false,
        emailInvalid: false,
        orderIdInvalid: false,
        isReady: false
    };

    componentDidMount() {
        store.setAndWatch('user', this, () => {
            this.setState({ showSignInText: this.showSignInText() });
        });
        this.props.userIsInitialized && this.props.validateUserStatus(this.setReadyState);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userIsInitialized && prevProps.userIsInitialized !== this.props.userIsInitialized) {
            this.props.validateUserStatus(this.setReadyState);
        }
    }

    setReadyState = () => {
        this.setState({ isReady: true });
    };

    /**
     * returns boolean show or hide the signin text under the form
     */
    showSignInText = () => {
        return !userUtils.isSignedIn();
    };

    /**
     * resets a state of the component
     */
    resetErrorState = () => {
        this.setState({ error: null });
    };

    /**
     *
     * @param {*} msg text error message
     */
    setErrorState = msg => {
        this.setState({ error: msg });
    };

    /**
     * validates form input and calls
     * @param {*} orderId
     * @param {*} email
     */
    isValid = (orderIdInput, emailInput) => {
        ErrorsUtils.clearErrors();
        ErrorsUtils.collectClientFieldErrors([orderIdInput, emailInput]);

        return !ErrorsUtils.validate();
    };

    /**
     * checks order with API
     */
    checkOrder = e => {
        e.preventDefault();

        const orderId = this.orderIdInput.getValue();
        const email = this.emailInput.getValue();

        if (this.isValid(this.orderIdInput, this.emailInput)) {
            this.requestAPI(orderId, email);
        }
    };

    /**
     * requests order data from API by params
     * @param {*} orderId
     * @param {*} email
     */
    requestAPI = (orderId, email) => {
        utilityApi
            .getGuestOrderDetails(orderId, email, OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_DETAILS_PAGE)
            .then(() => {
                const guestEmailParamString = email ? '?guestEmail=' + email : '';
                urlUtils.redirectTo(constants.urls.ORDER_DETAILS_PAGE + orderId + guestEmailParamString);
            })
            .catch(response => {
                this.setErrorState(response.errorMessages[0]);
            });
    };

    /**
     * opens signin modal and redirects user to an order list page
     */
    signInHandler = () => {
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK)
            .then(() => {
                urlUtils.redirectTo(constants.urls.ORDER_SIGNED_PAGE);
            })
            .catch(() => {});
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/MyAccount/OrderStatusLookup/locales', 'OrderStatusLookup');

        if (Sephora.isNodeRender || !this.state.isReady) {
            return null;
        }

        return (
            <Box
                data-at={Sephora.debug.dataAt('order_status_lookup')}
                borderRadius={2}
                border={1}
                borderColor='midGray'
                paddingX={4}
                paddingY={5}
                maxWidth={350}
            >
                <Text
                    is='h2'
                    fontSize='xl'
                    lineHeight='tight'
                    fontFamily='serif'
                    marginBottom={4}
                    children={getText('titleLabel')}
                />
                {this.state.error && (
                    <ErrorMsg
                        marginBottom={4}
                        children={this.state.error}
                    />
                )}
                <form
                    noValidate
                    onSubmit={this.checkOrder}
                >
                    <TextInput
                        name='orderNumber'
                        label={getText('orderNumberInputLabel')}
                        autoOff={true}
                        required={true}
                        type='tel'
                        value={(this.orderIdInput && this.orderIdInput.getValue()) || ''}
                        ref={comp => (this.orderIdInput = comp)}
                        invalid={this.state.orderIdInvalid}
                        validateError={orderIdInput => {
                            if (FormValidator.isEmpty(orderIdInput)) {
                                return ErrorConstants.ERROR_CODES.ORDER_ID_EMPTY;
                            }

                            if (!FormValidator.isNumeric(orderIdInput)) {
                                return ErrorConstants.ERROR_CODES.ORDER_ID_INVALID;
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        name='email'
                        label={getText('emailInputLabel')}
                        autoOff={true}
                        required={true}
                        type='email'
                        value={(this.emailInput && this.emailInput.getValue()) || ''}
                        ref={comp => (this.emailInput = comp)}
                        invalid={this.state.emailInvalid}
                        validateError={email => {
                            if (FormValidator.isEmpty(email)) {
                                return ErrorConstants.ERROR_CODES.EMAIL_EMPTY;
                            } else if (!FormValidator.isValidEmailAddress(email)) {
                                return ErrorConstants.ERROR_CODES.EMAIL_INVALID;
                            }

                            return null;
                        }}
                    />
                    <Button
                        variant='primary'
                        block={true}
                        type='submit'
                        children={getText('submitButtonLabel')}
                    />
                </form>

                {this.state.showSignInText && (
                    <Text
                        is='p'
                        marginTop={4}
                        lineHeight='tight'
                        maxWidth={measure[0]}
                    >
                        {getText('signInText1')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            onClick={this.signInHandler}
                        >
                            {getText('signInLinkText')}
                        </Link>{' '}
                        {getText('signInText2')}
                    </Text>
                )}
            </Box>
        );
    }
}

export default wrapComponent(OrderStatusLookup, 'OrderStatusLookup', true);
