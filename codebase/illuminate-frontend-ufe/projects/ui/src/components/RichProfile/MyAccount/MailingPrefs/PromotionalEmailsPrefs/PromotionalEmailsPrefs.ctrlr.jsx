import React from 'react';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Divider, Button, Image, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Radio from 'components/Inputs/Radio/Radio';
import Select from 'components/Inputs/Select/Select';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import Modal from 'components/Modal/Modal';
import constants from 'components/constants';
import profileApi from 'services/api/profile';
import localeUtils from 'utils/LanguageLocale';
import Debounce from 'utils/Debounce';
import store from 'store/Store';
import profileConstants from 'services/api/profile/constants';

const { PROMOTIONAL_EMAILS_PREFS_COUNTRIES, PromotionalEmailsPrefsFrequency } = profileConstants;
const { CANADA_LEGAL_COPY } = constants;
const COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE = ['US', 'CA', 'PR'];
const userCountry = localeUtils.getCurrentCountry().toUpperCase();
const { getLocaleResourceFile } = localeUtils;

const CountryMap = (function (countryPairs) {
    const map = {};
    countryPairs.forEach(pair => {
        map[pair[0]] = pair[1];
    });

    return map;
}(PROMOTIONAL_EMAILS_PREFS_COUNTRIES));

class PromotionalEmailsPrefs extends BaseClass {
    state = {
        editMode: false,
        shouldShowZipPostalCodeInput: false,
        editedPrefs: null,
        prefs: null,
        formErrors: {},
        user: {}
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({ user: watchedUser });
                    this.setMailingPreferences(watchedUser);
                }
            }),
            this
        );
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.viewMode && this.props.viewMode) {
            this.switchToViewMode();
        }
    }

    // mailingPreferences need to be watched and loaded ondemand
    setMailingPreferences = user => {
        this._userProfileId = user.profileId;

        store.setAndWatch('mailingPreferences', this, ({ mailingPreferences }) => {
            try {
                const promotionalEmailPrefs = mailingPreferences.mailingPreferences.promotionalEmail;
                const shouldShowZipPostalCodeInput = COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.indexOf(promotionalEmailPrefs?.country) >= 0;

                this.setState({
                    editMode: false,
                    shouldShowZipPostalCodeInput,
                    editedPrefs: null,
                    prefs: promotionalEmailPrefs,
                    formErrors: {}
                });
            } catch (error) {
                Sephora.logger.verbose('Error in PromotionalEmailsPrefs.c', error);
            }
        });
    };

    switchToEditMode = () => {
        this.setState({
            editedPrefs: Object.assign({}, this.state.prefs),
            editMode: true
        });
        this.props.onExpand();
    };

    switchToViewMode = () => {
        this.setState({
            editedPrefs: null,
            editMode: false
        });
    };

    handleStatusChange = e => {
        const subscribed = e.currentTarget.value === '1';
        const countrySelected = this.state.editedPrefs.country;
        this.setState({
            editedPrefs: Object.assign({}, this.state.editedPrefs, { subscribed }),
            shouldShowZipPostalCodeInput: COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.indexOf(countrySelected) >= 0
        });
    };

    handleFrequencyChange = e => {
        this.setState({ editedPrefs: Object.assign({}, this.state.editedPrefs, { frequency: e.currentTarget.value }) });
    };

    handleCountryChange = e => {
        const countrySelected = e.currentTarget.value;

        this.setState({
            editedPrefs: Object.assign({}, this.state.editedPrefs, {
                country: countrySelected,
                zipPostalCode: ''
            }),
            shouldShowZipPostalCodeInput: COUNTRIES_THAT_REQUIRE_ZIP_POSTAL_CODE.indexOf(countrySelected) >= 0
        });
    };

    handleSeeSampleEmailClick = () => {
        this.setState({ showSampleEmail: true });
    };

    handleSeeSampleEmailDismiss = () => {
        this.setState({ showSampleEmail: false });
    };

    handleCancelClick = () => {
        this.setState({ editedPrefs: null });
        this.switchToViewMode();
    };

    handleUpdateClick = () => {
        this.setState({ formErrors: {} });

        const isFormValid = this.validateForm();

        if (isFormValid) {
            this.save();
        }
    };
    handleUpdateClickDebounce = Debounce.preventDoubleClick(this.handleUpdateClick, 3000);

    validateForm = () => {
        if (this.state.shouldShowZipPostalCodeInput && this.state.editedPrefs.subscribed) {
            return this._zipPostalCodeInput.validateError() === null;
        } else {
            return true;
        }
    };

    getPrefsFromForm = () => {
        return Object.assign({}, this.state.editedPrefs, {
            zipPostalCode: (this.state.shouldShowZipPostalCodeInput && this._zipPostalCodeInput && this._zipPostalCodeInput.getValue()) || null
        });
    };

    save = () => {
        // https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Profile+API
        const UPDATE_PROFILE_API_GENERAL_ERROR_CODE = -10300;

        var prefs = this.getPrefsFromForm();

        profileApi.setPromotionalEmailPreferences(this._userProfileId, prefs).then(
            () => {
                this.setState({ prefs });
                this.switchToViewMode();
            },
            data => {
                if (data.errorCode === UPDATE_PROFILE_API_GENERAL_ERROR_CODE) {
                    this.setState({ formErrors: { zipPostalCode: data.errorMessages } });
                    this.validateForm();
                }
            }
        );
    };

    shouldShowCanadaLegalCopy = () => {
        return userCountry === 'CA';
    };

    /* eslint-disable-next-line complexity */
    render = () => {
        const getText = getLocaleResourceFile(
            'components/RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs/locales',
            'PromotionalEmailsPrefs'
        );
        const EmailFrequencyDisplayMap = {
            [PromotionalEmailsPrefsFrequency.DAILY]: getText('allOffers'),
            [PromotionalEmailsPrefsFrequency.WEEKLY]: getText('weekly'),
            [PromotionalEmailsPrefsFrequency.MONTHLY]: getText('monthly')
        };

        const commonHeaderBlock = (
            <div>
                {Sephora.isMobile() && <Divider marginY={3} />}
                <Text
                    is='p'
                    marginBottom={2}
                >
                    {getText('sendSpecialOffers')}
                </Text>
                <Text
                    is='p'
                    marginBottom={3}
                >
                    <Link
                        color='blue'
                        onClick={this.handleSeeSampleEmailClick}
                    >
                        {getText('sampleEmail')}
                    </Link>
                </Text>
            </div>
        );

        const currentStatusBlock = this.state.prefs && (
            <Text
                is='p'
                marginBottom={2}
            >
                <b>{getText('status')}</b> {this.state.prefs.subscribed ? getText('subscribed') : getText('notSubscribed')}
            </Text>
        );

        const currentFrequencyBlock = this.state.prefs && this.state.prefs.frequency && (
            <Text
                is='p'
                marginBottom={2}
            >
                <b>{getText('frequency')}</b> {EmailFrequencyDisplayMap[this.state.prefs.frequency]}
            </Text>
        );

        const currentCountryBlock = this.state.prefs && this.state.prefs.country && (
            <Text
                is='p'
                marginBottom={2}
            >
                <b>{getText('country')}</b> {CountryMap[this.state.prefs.country]}
            </Text>
        );

        const currentZipPostalBlock = this.state.prefs && this.state.prefs.zipPostalCode && (
            <Text
                is='p'
                marginBottom={2}
            >
                <b>{getText('postalCode')}</b> {this.state.prefs.zipPostalCode}
            </Text>
        );

        return (
            this.state.prefs && (
                <LegacyGrid
                    gutter={3}
                    alignItems='baseline'
                    paddingY={5}
                >
                    <LegacyGrid.Cell width={Sephora.isMobile() ? 'fill' : '16em'}>
                        <Text
                            is='h2'
                            fontSize='md'
                            fontWeight='bold'
                            lineHeight='tight'
                        >
                            {getText('promotional')}
                            {Sephora.isDesktop() ? <br /> : ' '}
                            {getText('emails')}
                        </Text>
                    </LegacyGrid.Cell>

                    {this.state.editMode && (
                        <LegacyGrid.Cell
                            width={Sephora.isDesktop() ? 'fill' : null}
                            css={
                                Sephora.isMobile()
                                    ? {
                                        order: 2
                                    }
                                    : null
                            }
                        >
                            {commonHeaderBlock}

                            {currentStatusBlock}
                            <Box marginTop={2}>
                                <Radio
                                    name='subunsub'
                                    checked={this.state.editedPrefs.subscribed}
                                    value={1}
                                    onChange={e => this.handleStatusChange(e)}
                                >
                                    {getText('subscribe')}
                                </Radio>
                                <Radio
                                    name='subunsub'
                                    checked={!this.state.editedPrefs.subscribed}
                                    value={0}
                                    onChange={e => this.handleStatusChange(e)}
                                >
                                    {getText('unsubscribe')}
                                </Radio>
                            </Box>

                            {this.state.editedPrefs.subscribed && (
                                <div>
                                    <Divider marginY={3} />
                                    {currentFrequencyBlock}
                                    <Box marginTop={2}>
                                        <Radio
                                            name='freq'
                                            checked={this.state.editedPrefs.frequency === PromotionalEmailsPrefsFrequency.DAILY}
                                            onChange={e => this.handleFrequencyChange(e)}
                                            value={PromotionalEmailsPrefsFrequency.DAILY}
                                        >
                                            {getText('allOffers')}
                                        </Radio>
                                        <Radio
                                            name='freq'
                                            checked={this.state.editedPrefs.frequency === PromotionalEmailsPrefsFrequency.WEEKLY}
                                            onChange={e => this.handleFrequencyChange(e)}
                                            value={PromotionalEmailsPrefsFrequency.WEEKLY}
                                        >
                                            {getText('weekly')}
                                        </Radio>
                                        <Radio
                                            name='freq'
                                            checked={this.state.editedPrefs.frequency === PromotionalEmailsPrefsFrequency.MONTHLY}
                                            onChange={e => this.handleFrequencyChange(e)}
                                            value={PromotionalEmailsPrefsFrequency.MONTHLY}
                                        >
                                            {getText('monthly')}
                                        </Radio>
                                        <Divider marginY={3} />
                                    </Box>

                                    <Text is='p'>
                                        <b>{getText('postalCode')}</b> {getText('enterZip')}
                                    </Text>
                                    <Box marginTop={3}>
                                        <Select
                                            label={getText('country')}
                                            name='country'
                                            value={this.state.editedPrefs.country}
                                            onChange={this.handleCountryChange}
                                        >
                                            {PROMOTIONAL_EMAILS_PREFS_COUNTRIES.map(value => (
                                                <option
                                                    key={value[0]}
                                                    value={value[0]}
                                                >
                                                    {value[1]}
                                                </option>
                                            ))}
                                        </Select>
                                        {this.state.shouldShowZipPostalCodeInput && (
                                            <TextInput
                                                label={getText('zipCode')}
                                                name='zipPostalCode'
                                                ref={component => {
                                                    if (component !== null) {
                                                        this._zipPostalCodeInput = component;
                                                    }
                                                }}
                                                onChangeHook={() => {
                                                    this.state.formErrors.zipPostalCode = null;
                                                }}
                                                validate={zipPostalCode => {
                                                    if (FormValidator.isEmpty(zipPostalCode)) {
                                                        return getText('pleaseEnterZip');
                                                    }

                                                    return this.state.formErrors.zipPostalCode || null;
                                                }}
                                                value={this.state.editedPrefs.zipPostalCode}
                                            />
                                        )}
                                    </Box>
                                </div>
                            )}

                            <LegacyGrid
                                marginTop={5}
                                fill={true}
                                gutter={3}
                            >
                                <LegacyGrid.Cell>
                                    <Button
                                        variant='secondary'
                                        block={true}
                                        onClick={this.handleCancelClick}
                                    >
                                        {getText('cancel')}
                                    </Button>
                                </LegacyGrid.Cell>
                                <LegacyGrid.Cell>
                                    <Button
                                        variant='primary'
                                        block={true}
                                        onClick={this.handleUpdateClickDebounce}
                                    >
                                        {getText('save')}
                                    </Button>
                                </LegacyGrid.Cell>
                            </LegacyGrid>

                            {this.shouldShowCanadaLegalCopy() && (
                                <Text
                                    is='p'
                                    marginTop={3}
                                    fontSize='xs'
                                    color='gray'
                                >
                                    {CANADA_LEGAL_COPY}
                                </Text>
                            )}
                        </LegacyGrid.Cell>
                    )}

                    {!this.state.editMode && (
                        <LegacyGrid.Cell
                            width={Sephora.isDesktop() ? 'fill' : null}
                            css={
                                Sephora.isMobile()
                                    ? {
                                        order: 2
                                    }
                                    : null
                            }
                        >
                            {commonHeaderBlock}
                            {currentStatusBlock}
                            {this.state.prefs && this.state.prefs.subscribed && currentFrequencyBlock}
                            {this.state.prefs && this.state.prefs.subscribed && currentCountryBlock}
                            {this.state.prefs && this.state.prefs.subscribed && currentZipPostalBlock}
                        </LegacyGrid.Cell>
                    )}

                    <LegacyGrid.Cell
                        width='4em'
                        textAlign='right'
                        lineHeight='tight'
                    >
                        {this.state.editMode || (
                            <Link
                                color='blue'
                                paddingY={2}
                                marginY={-2}
                                onClick={this.switchToEditMode}
                            >
                                {getText('edit')}
                            </Link>
                        )}

                        <Modal
                            isOpen={this.state.showSampleEmail}
                            onDismiss={this.handleSeeSampleEmailDismiss}
                            width='auto'
                        >
                            <Modal.Body>
                                <Image
                                    src={'/img/ufe/email-samples/email-example-promo.jpg'}
                                    display='block'
                                    marginX='auto'
                                />
                            </Modal.Body>
                        </Modal>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            )
        );
    };
}

export default wrapComponent(PromotionalEmailsPrefs, 'PromotionalEmailsPrefs', true);
