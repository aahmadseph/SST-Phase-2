/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import FormValidator from 'utils/FormValidator';
import localeUtils from 'utils/LanguageLocale';
import Modal from 'components/Modal/Modal';
import {
    Text, Button, Grid, Box, Flex, Icon
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Textarea from 'components/Inputs/Textarea/Textarea';
import ThemeSelection from 'components/GlobalModals/AddGiftMessageModal/ThemeSelection';
import PreviewScreen from 'components/GlobalModals/AddGiftMessageModal/PreviewScreen';
import LanguageSelector from 'components/GlobalModals/AddGiftMessageModal/LanguageSelector';
import { colors } from 'style/config';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import BasketConstants from 'constants/Basket';

const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;
const { LANGUAGE_OPTIONS, ALL_TITLE } = BasketConstants;

class AddGiftMessageModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            screenPage: 0,
            updatedFields: { recipientName: false, yourName: false, recipientEmailAddress: false },
            giftMessagePayload: {
                recipientName: '',
                yourName: '',
                recipientEmailAddress: '',
                giftMessage: '',
                imageUrl: '',
                orderId: props.orderId,
                sid: '',
                themeFilter: ''
            },
            validFields: {
                recipientName: false,
                yourName: false,
                recipientEmailAddress: false
            },
            currentLanguage: '',
            errorMessage: ''
        };
    }

    componentDidMount() {
        const {
            languageThemes, isEditGiftMessage, getGiftMessage, orderId, getSwatchOptions
        } = this.props;
        const languageOptions = getSwatchOptions(languageThemes);
        const defaultLanguage = languageOptions && (localeUtils.isFrench() ? LANGUAGE_OPTIONS.FRENCH : languageOptions[0]?.key);

        if (isEditGiftMessage) {
            getGiftMessage(orderId).then(data => {
                const {
                    customerName, email, giftMessage, imageUrl, orderId: orderNumber, recipientName, sid, language_sid
                } = data;
                this.setState({
                    giftMessagePayload: {
                        recipientName,
                        yourName: customerName,
                        recipientEmailAddress: email,
                        giftMessage,
                        imageUrl,
                        orderId: orderNumber,
                        sid
                    },
                    currentLanguage: language_sid,
                    validFields: { recipientName: true, yourName: true, recipientEmailAddress: true }
                });
            });
        } else {
            this.setState({ ...this.state, currentLanguage: defaultLanguage });
        }

        this.fireAnalyticsAddGiftMessageModal();
    }

    changeLanguage = (e, typeSelected) => {
        e.preventDefault();
        this.setState({ currentLanguage: typeSelected });
    };

    setPropertiesFromThemeSelection = (previewUrl, selectedThemeId, selectedThemeFilter, altText) => {
        this.setState({
            giftMessagePayload: {
                ...this.state.giftMessagePayload,
                imageUrl: previewUrl,
                sid: selectedThemeId,
                themeFilter: selectedThemeFilter,
                altText
            }
        });
    };

    moveToNextScreen = () => {
        this.setState({ screenPage: this.state.screenPage + 1 }, () => {
            const { currentLanguage = '', giftMessagePayload = {} } = this.state;

            if (this.state?.screenPage === 1) {
                this.props.fireGiftMessageImageSelectAnalytics({ currentLanguage, giftMessagePayload });
            }

            this.fireAnalyticsAddGiftMessageModal();
        });
    };

    moveToPreviousScreen = () => {
        this.setState({ screenPage: this.state.screenPage - 1 }, () => {
            this.fireAnalyticsAddGiftMessageModal();
        });
    };

    errorCallback = () => {
        const { errorMessageRequest } = this.props;

        this.setState({ errorMessage: errorMessageRequest });
    };

    submitGiftMessage = () => {
        const { addGiftMessage, updateGiftMessage, isEditGiftMessage } = this.props;
        const { giftMessagePayload, currentLanguage } = this.state;
        const messageData = { ...giftMessagePayload, currentLanguage };

        return isEditGiftMessage ? updateGiftMessage(messageData) : addGiftMessage(messageData, this.errorCallback);
    };

    fireAnalyticsAddGiftMessageModal = () => {
        const { screenPage } = this.state;
        const { PAGE_NAMES, LinkData, ADD_GIFT_MESSAGE_MODAL_SCREENS } = anaConsts;
        const pageName = `${LinkData.MODAL}:${PAGE_NAMES.GIFT_MESSAGE}-${ADD_GIFT_MESSAGE_MODAL_SCREENS[screenPage]}:n/a:*`;
        const pageDetail = `${PAGE_NAMES.GIFT_MESSAGE}-${ADD_GIFT_MESSAGE_MODAL_SCREENS[screenPage]}`;

        return processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName,
                pageType: 'modal',
                pageDetail
            }
        });
    };

    validateRecipientName = firstName => {
        const { enterRecipientNameError, invalidNameError, fireErrorAnalytics } = this.props;
        const { updatedFields, validFields } = this.state;

        if (!updatedFields.recipientName) {
            return null;
        }

        if (FormValidator.isEmpty(firstName)) {
            if (validFields.recipientName) {
                this.setState({ validFields: { ...validFields, recipientName: false } });
            }

            fireErrorAnalytics(enterRecipientNameError);

            return enterRecipientNameError;
        }

        if (!FormValidator.isValidLength(firstName, 1, FIELD_LENGTHS.recipientName) || !FormValidator.isValidName(firstName)) {
            if (validFields.recipientName) {
                this.setState({ validFields: { ...validFields, recipientName: false } });
            }

            fireErrorAnalytics(invalidNameError);

            return invalidNameError;
        }

        if (!validFields.recipientName) {
            this.setState({ validFields: { ...validFields, recipientName: true } });
        }

        return null;
    };

    validateYourName = name => {
        const { enterYourNameError, invalidNameError, fireErrorAnalytics } = this.props;
        const { updatedFields, validFields } = this.state;

        if (!updatedFields.yourName) {
            return null;
        }

        if (FormValidator.isEmpty(name)) {
            if (validFields.yourName) {
                this.setState({ validFields: { ...validFields, yourName: false } });
            }

            fireErrorAnalytics(enterYourNameError);

            return enterYourNameError;
        }

        if (!FormValidator.isValidLength(name, 1, FIELD_LENGTHS.recipientName) || !FormValidator.isValidName(name)) {
            if (validFields.yourName) {
                this.setState({ validFields: { ...validFields, yourName: false } });
            }

            fireErrorAnalytics(enterYourNameError);

            return invalidNameError;
        }

        if (!validFields.yourName) {
            this.setState({ validFields: { ...validFields, yourName: true } });
        }

        return null;
    };

    validateRecipientEmailAddress = emailId => {
        const { enterRecipientEmailAddressError, invalidRecipientEmailAddressError, fireErrorAnalytics } = this.props;
        const { updatedFields, validFields } = this.state;

        if (!updatedFields.recipientEmailAddress) {
            return null;
        }

        if (FormValidator.isEmpty(emailId)) {
            if (validFields.recipientEmailAddress) {
                this.setState({ validFields: { ...validFields, recipientEmailAddress: false } });
            }

            fireErrorAnalytics(enterRecipientEmailAddressError);

            return enterRecipientEmailAddressError;
        }

        if (!FormValidator.isValidEmailAddress(emailId)) {
            if (validFields.recipientEmailAddress) {
                this.setState({ validFields: { ...validFields, recipientEmailAddress: false } });
            }

            fireErrorAnalytics(invalidRecipientEmailAddressError);

            return invalidRecipientEmailAddressError;
        }

        if (!validFields.recipientEmailAddress) {
            this.setState({ validFields: { ...validFields, recipientEmailAddress: true } });
        }

        return null;
    };

    setFormValues = event => {
        this.setState({
            giftMessagePayload: { ...this.state.giftMessagePayload, [`${event.currentTarget.name}`]: event.currentTarget.value }
        });

        if (!this.state.updatedFields[`${event.currentTarget.name}`]) {
            this.setState({
                updatedFields: { ...this.state.updatedFields, [`${event.currentTarget.name}`]: true }
            });
        }
    };

    setGiftMessage = message => {
        this.setState({ giftMessagePayload: { ...this.state.giftMessagePayload, giftMessage: message } });
    };

    validateForm = () => {
        const { recipientName, yourName, recipientEmailAddress } = this.state.validFields;

        return recipientName && yourName && recipientEmailAddress;
    };

    previewMessage = () => {
        this.setState({ updatedFields: { recipientName: true, yourName: true, recipientEmailAddress: true } });

        if (this.validateForm()) {
            this.moveToNextScreen();
        }
    };

    renderAddGiftForm = () => {
        const {
            recipientName, yourName, recipientEmailAddress, giftMessage, giftMessageTimingMsg
        } = this.props;
        const { giftMessagePayload } = this.state;

        const recipientNameErrors = this.validateRecipientName(giftMessagePayload.recipientName);
        const yourNameErrors = this.validateYourName(giftMessagePayload.yourName);
        const recipientEmailAddressErrors = this.validateRecipientEmailAddress(giftMessagePayload.recipientEmailAddress);

        return (
            <Box marginTop={4}>
                <Box
                    paddingY={2}
                    paddingX={3}
                    backgroundColor={colors.nearWhite}
                    marginBottom={4}
                >
                    <Text>{giftMessageTimingMsg}</Text>
                </Box>
                <TextInput
                    label={recipientName}
                    autoCorrect='off'
                    name='recipientName'
                    required={true}
                    maxLength={FIELD_LENGTHS.recipientName}
                    value={giftMessagePayload.recipientName}
                    onChange={this.setFormValues}
                    error={recipientNameErrors}
                    ref={c => {
                        this.recipientName = c;
                    }}
                    invalid={recipientNameErrors}
                />
                <TextInput
                    label={yourName}
                    autoCorrect='off'
                    name='yourName'
                    required={true}
                    maxLength={FIELD_LENGTHS.recipientName}
                    value={giftMessagePayload.yourName}
                    onChange={this.setFormValues}
                    error={yourNameErrors}
                    ref={c => {
                        this.yourName = c;
                    }}
                    invalid={yourNameErrors}
                />
                <TextInput
                    label={recipientEmailAddress}
                    autoCorrect='off'
                    name='recipientEmailAddress'
                    required={true}
                    value={giftMessagePayload.recipientEmailAddress}
                    onChange={this.setFormValues}
                    error={recipientEmailAddressErrors}
                    ref={c => {
                        this.recipientEmailAddress = c;
                    }}
                    invalid={recipientEmailAddressErrors}
                />
                <Textarea
                    label={giftMessage}
                    rows={3}
                    name='giftMessage'
                    value={giftMessagePayload.giftMessage}
                    handleChange={this.setGiftMessage}
                    maxLength={300}
                    ref={c => {
                        this.giftMessage = c;
                    }}
                />
            </Box>
        );
    };

    render() {
        const {
            isOpen,
            title,
            subTitleScreen1,
            subTitleScreen2,
            subTitleScreen3,
            next,
            closeAddGiftMessageModal,
            back,
            preview,
            languageThemes,
            save,
            isEditGiftMessage,
            getSwatchOptions
        } = this.props;
        const { screenPage, currentLanguage, errorMessage } = this.state;
        const languageOptions = getSwatchOptions(languageThemes);
        const showLanguageSelector = languageOptions && languageOptions.length > 1 && screenPage === 0;
        const allThemeTitle = currentLanguage === LANGUAGE_OPTIONS.FRENCH ? ALL_TITLE.FRENCH : ALL_TITLE.ENGLISH;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={closeAddGiftMessageModal}
                showDismiss={true}
                width={1}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingBottom={0}
                    overflowX={'hidden'}
                >
                    <Flex justifyContent='space-between'>
                        <strong>{screenPage === 0 ? subTitleScreen1 : screenPage === 1 ? subTitleScreen2 : subTitleScreen3}</strong>
                        {showLanguageSelector && (
                            <LanguageSelector
                                onSelect={(e, option) => this.changeLanguage(e, option)}
                                activeType={currentLanguage}
                                options={languageOptions}
                            />
                        )}
                    </Flex>
                    {screenPage === 0 ? (
                        <ThemeSelection
                            isEditMessage={isEditGiftMessage}
                            languageThemes={languageThemes}
                            setPropertiesFromThemeSelection={this.setPropertiesFromThemeSelection}
                            currentLanguage={currentLanguage}
                            selectedSid={this.state.giftMessagePayload.sid}
                            selectedImageUrl={this.state.giftMessagePayload.imageUrl}
                            allThemeTitle={allThemeTitle}
                            themeFilter={this.state.giftMessagePayload.themeFilter}
                        />
                    ) : screenPage === 1 ? (
                        this.renderAddGiftForm()
                    ) : (
                        <>
                            <PreviewScreen giftMessageData={this.state.giftMessagePayload} />
                            {errorMessage && (
                                <Flex
                                    alignItems='center'
                                    gap={2}
                                    lineHeight='tight'
                                    paddingBottom={4}
                                >
                                    <Icon
                                        name='alert'
                                        color='error'
                                        size={16}
                                        css={{ pointerEvents: 'none' }}
                                    />
                                    <Text color='red'>{errorMessage}</Text>
                                </Flex>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer paddingTop={4}>
                    {screenPage === 0 ? (
                        <Grid>
                            <Button
                                variant='primary'
                                onClick={this.moveToNextScreen}
                                children={next}
                            />
                        </Grid>
                    ) : (
                        <Grid
                            gap={4}
                            columns={2}
                        >
                            <Button
                                onClick={this.moveToPreviousScreen}
                                variant='secondary'
                                aria-label={back}
                                children={back}
                            />

                            {screenPage === 1 ? (
                                <Button
                                    onClick={this.previewMessage}
                                    variant='primary'
                                    aria-label={preview}
                                    children={preview}
                                />
                            ) : (
                                <Button
                                    onClick={this.submitGiftMessage}
                                    variant='primary'
                                    aria-label={save}
                                    children={save}
                                />
                            )}
                        </Grid>
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

AddGiftMessageModal.propTypes = {
    title: PropTypes.string.isRequired,
    subTitleScreen1: PropTypes.string.isRequired,
    subTitleScreen2: PropTypes.string.isRequired,
    subTitleScreen3: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    back: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired,
    save: PropTypes.string.isRequired,
    errorMessageRequest: PropTypes.string.isRequired
};

export default wrapComponent(AddGiftMessageModal, 'AddGiftMessageModal', true);
