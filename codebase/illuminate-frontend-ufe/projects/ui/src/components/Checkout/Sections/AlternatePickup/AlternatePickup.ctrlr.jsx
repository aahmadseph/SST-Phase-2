import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Grid, Link, Text, Button
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import resourceWrapper from 'utils/framework/resourceWrapper';
import OrderUtils from 'utils/Order';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import localeUtils from 'utils/LanguageLocale';
import CheckoutApi from 'services/api/checkout';
import store from 'store/Store';
import Actions from 'Actions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/Checkout/Sections/AlternatePickup/locales', 'AlternatePickup'));
const ALT_PICKUP_ID = 'altpickup';
const INITIAL_STATE = {
    altPickupCaptured: false,
    editMode: false,
    firstName: null,
    lastName: null,
    email: null
};

function fireAnalytics(analyticsActionInfo, type = anaConsts.LINK_TRACKING_EVENT) {
    const isLinkTracking = type === anaConsts.LINK_TRACKING_EVENT;
    const isPageLoad = type === anaConsts.ASYNC_PAGE_LOAD;

    const payload = {
        data: {
            pageName: anaConsts.ALT_PICKUP.PAGE_NAME
        }
    };

    if (isLinkTracking) {
        payload.data.linkName = analyticsActionInfo;
        payload.data.actionInfo = analyticsActionInfo;
    } else if (isPageLoad) {
        payload.data.linkData = analyticsActionInfo;
        payload.data.previousPageName = digitalData.page.attributes.previousPageData.pageName;
    }

    return processEvent.process(type, payload);
}

class AlternatePickup extends BaseClass {
    state = {
        ...INITIAL_STATE
    };

    requestOriginParam = () => (!this.props.isCheckout ? OrderUtils.ORDER_DETAILS_REQUESTS_ORIGIN.ORD_DETAILS_PAGE : '');

    toggleEditMode = () => {
        const { isOrderDetails, isOmsAckedForAltPickupUpdate } = this.props;

        if (isOrderDetails && !isOmsAckedForAltPickupUpdate) {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    footerColumns: [1, 2],
                    title: getText('alternatePickupPerson'),
                    message: getText('cannotModifyMessage'),
                    buttonText: getText('ok')
                })
            );

            return;
        }

        this.setState(
            prevState => ({ editMode: !prevState.editMode }),
            () => {
                const { altPickupCaptured, editMode } = this.state;

                if (altPickupCaptured && editMode) {
                    // Edit
                    fireAnalytics(anaConsts.ALT_PICKUP.EDIT, anaConsts.ASYNC_PAGE_LOAD);
                } else if (!altPickupCaptured && editMode) {
                    // Add
                    fireAnalytics(anaConsts.ALT_PICKUP.ADD, anaConsts.ASYNC_PAGE_LOAD);
                }
            }
        );
    };

    handleRemove = () => {
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: getText('removeAltPickupTitle'),
                message: getText('removeAltPickupMessage'),
                buttonText: getText('remove'),
                showCancelButtonLeft: true,
                callback: () => this.removeAltPickupAndResetState(),
                isHtml: true
            })
        );
    };

    removeAltPickupAndResetState = () => {
        CheckoutApi.removeAlternatePickupPerson(this.props.orderId, this.requestOriginParam())
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                fireAnalytics(anaConsts.ALT_PICKUP.REMOVE);
            })
            .catch(error => {
                this.showErrorModal(error);
            });
    };

    handleSave = () => {
        const isValid = this.validateForm();

        if (isValid) {
            const altPickupData = {
                firstName: this.firstNameInput.getValue(),
                lastName: this.lastNameInput.getValue(),
                email: this.emailInput.getValue(),
                orderId: this.props.orderId
            };
            const { altPickupCaptured } = this.state;
            const { isOrderDetails } = this.props;
            const altPickupApi = altPickupCaptured ? 'updateAlternatePickupPerson' : 'addAlternatePickupPerson';

            CheckoutApi[altPickupApi](altPickupData, this.requestOriginParam())
                .then(data => {
                    this.setState(
                        {
                            altPickupCaptured: true,
                            editMode: false,
                            ...altPickupData
                        },
                        () => {
                            /* First time captured in Order Details */
                            if (!altPickupCaptured && isOrderDetails) {
                                const fullName = `${data.firstName} ${data.lastName}`;
                                store.dispatch(
                                    Actions.showInfoModal({
                                        isOpen: true,
                                        footerColumns: [1, 2],
                                        title: getText('addedAlternatePickup'),
                                        message: getText('addedAlternatePickupMsg', false, <strong>{fullName}</strong>),
                                        buttonText: getText('ok')
                                    })
                                );
                            }

                            fireAnalytics(anaConsts.ALT_PICKUP.SAVE);
                        }
                    );
                })
                .catch(error => {
                    this.showErrorModal(error);
                });
        }
    };

    showErrorModal = error => {
        if (error?.errorCode === -1) {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    footerColumns: [1, 2],
                    title: getText('alternatePickupPerson'),
                    message: error.errorMessages[0] || getText('genericErrorMessage'),
                    buttonText: getText('ok')
                })
            );
        } else {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    footerColumns: [1, 2],
                    title: getText('alternatePickupPerson'),
                    message: getText('genericErrorMessage'),
                    buttonText: getText('ok')
                })
            );
        }
    };

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.firstNameInput, this.lastNameInput, this.emailInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        return !ErrorsUtils.validate(fieldsForValidation);
    };

    formTitle = () => {
        const { editMode, altPickupCaptured } = this.state;
        const { compactView, allowEdit } = this.props;
        const showEditButton = allowEdit && altPickupCaptured && !editMode;
        const showRemoveButton = editMode && altPickupCaptured;

        return (
            <Grid
                marginBottom={4}
                gap={1}
                columns={[compactView && showRemoveButton ? 1 : '1fr auto', '1fr auto']}
                alignItems='center'
            >
                <Text
                    is='h2'
                    fontSize={this.props.titleTextSize}
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('alt_pickup_person_title')}
                >
                    {getText('alternatePickup')}
                </Text>
                {showEditButton && (
                    <Link
                        key='editBtn'
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.toggleEditMode}
                    >
                        {getText('edit')}
                    </Link>
                )}
                {showRemoveButton && (
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.handleRemove}
                    >
                        {getText('remove')}
                    </Link>
                )}
            </Grid>
        );
    };

    formBody = () => {
        const { firstName, lastName, email } = this.state;
        const { compactView, isCheckout } = this.props;

        return (
            <Box>
                <Grid
                    columns={[compactView ? 1 : 2, 2]}
                    gap={[compactView ? 0 : 3, 3]}
                >
                    <TextInput
                        required={true}
                        name='firstName'
                        label={getText('firstName')}
                        value={firstName}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        ref={comp => (this.firstNameInput = comp)}
                        validateError={firstname => {
                            if (FormValidator.isEmpty(firstname)) {
                                return ErrorConstants.ERROR_CODES.FIRST_NAME;
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        required={true}
                        name='lastName'
                        label={getText('lastName')}
                        value={lastName}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        ref={comp => (this.lastNameInput = comp)}
                        validateError={lastname => {
                            if (FormValidator.isEmpty(lastname)) {
                                return ErrorConstants.ERROR_CODES.LAST_NAME;
                            }

                            return null;
                        }}
                    />
                </Grid>
                <Grid
                    columns={[1, compactView ? 1 : 2]}
                    gap={3}
                >
                    <InputEmail
                        required={true}
                        label={getText('email')}
                        name='email'
                        login={email}
                        ref={comp => (this.emailInput = comp)}
                    />
                </Grid>

                <Box
                    marginTop={3}
                    marginBottom={5}
                >
                    <Button
                        key={'saveBtn'}
                        marginRight={4}
                        variant='primary'
                        onClick={this.handleSave}
                    >
                        {getText(!isCheckout ? 'save' : 'saveAndContinue')}
                    </Button>
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.toggleEditMode}
                    >
                        {getText('cancel')}
                    </Link>
                </Box>
            </Box>
        );
    };

    alternatePickupPerson = () => {
        const { firstName, lastName, email } = this.state;

        return (
            <>
                <p data-at={Sephora.debug.dataAt('alt_person_name')}>{`${firstName} ${lastName}`}</p>
                <p data-at={Sephora.debug.dataAt('alt_person_email')}>{email}</p>
            </>
        );
    };

    componentDidMount() {
        const { alternatePickupData } = this.props;

        if (alternatePickupData?.firstName && alternatePickupData?.lastName && alternatePickupData?.email) {
            this.setState({
                altPickupCaptured: true,
                firstName: alternatePickupData?.firstName,
                lastName: alternatePickupData?.lastName,
                email: alternatePickupData?.email
            });
        }
    }

    render() {
        const components = [];
        const {
            alternatePickupData, isOrderConfirmation, orderId, showAltPickupNote, ...boxProps
        } = this.props;
        const { altPickupCaptured, editMode } = this.state;

        const altPickupNote = translationKey => {
            if (!showAltPickupNote) {
                return null;
            }

            const orderDetailsLink = (
                <Link
                    display='inline'
                    color='blue'
                    href={OrderUtils.getOrderDetailsUrl(orderId) + `#${ALT_PICKUP_ID}`}
                    children={getText('orderDetails')}
                />
            );

            return (
                <Text
                    data-at={Sephora.debug.dataAt('alt_pickup_person_message')}
                    key='altPickupNote'
                    is='div'
                    marginTop={4}
                >
                    {getText(translationKey, false, orderDetailsLink)}
                </Text>
            );
        };

        if (isOrderConfirmation) {
            if (alternatePickupData) {
                components.push(this.formTitle());
                components.push(this.alternatePickupPerson());
                components.push(altPickupNote('updateAltPickup'));
            } else {
                components.push(altPickupNote('addAltPickup'));
            }
        } else {
            if (!editMode && !altPickupCaptured) {
                components.push(
                    <Link
                        key='addBtn'
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={this.toggleEditMode}
                    >
                        {getText('addAlternatePickup')}
                    </Link>
                );
            } else {
                components.push(this.formTitle());

                if (editMode) {
                    components.push(this.formBody());
                } else {
                    components.push(this.alternatePickupPerson());
                }
            }
        }

        return (
            <Box
                id={ALT_PICKUP_ID}
                {...boxProps}
            >
                {components}
            </Box>
        );
    }
}

AlternatePickup.propTypes = {
    alternatePickupData: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string
    }),
    compactView: PropTypes.bool,
    allowEdit: PropTypes.bool,
    isCheckout: PropTypes.bool,
    showAltPickupNote: PropTypes.bool
};

AlternatePickup.defaultProps = {
    compactView: false,
    allowEdit: true,
    isCheckout: false,
    showAltPickupNote: true
};

export default wrapComponent(AlternatePickup, 'AlternatePickup', true);
