import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Divider, Button, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Radio from 'components/Inputs/Radio/Radio';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import localeUtils from 'utils/LanguageLocale';
import FormsUtils from 'utils/Forms';
import constants from 'components/constants';
import profileApi from 'services/api/profile';
import js from 'utils/javascript';
let userCountry = localeUtils.getCurrentCountry().toUpperCase();
import Debounce from 'utils/Debounce';
import store from 'store/Store';
import watch from 'redux-watch';

const { CANADA_LEGAL_COPY } = constants;
const SUPPORTED_COUNTRIES_CODES = js.getObjectValuesSlowNDirty(localeUtils.COUNTRIES);

class PostalMailPrefs extends BaseClass {
    state = {
        editMode: false,
        editedPrefs: null,
        prefs: null,
        defaultCountryCode: null,
        shouldShowCanadaLegalCopy: false,
        countryList: [
            {
                countryCode: 'US',
                countryLongName: localeUtils.COUNTRY_LONG_NAMES['US']
            },
            {
                countryCode: 'CA',
                countryLongName: localeUtils.COUNTRY_LONG_NAMES['CA']
            }
        ],
        user: {}
    };

    componentDidMount() {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.setState({ user: watchedUser });
                    this.setPostalMailPreferences(watchedUser);
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

    setPostalMailPreferences = user => {
        this._userProfileId = user.profileId;

        // mailingPreferences need to be watched and loaded ondemand
        store.setAndWatch('mailingPreferences', this, ({ mailingPreferences }) => {
            try {
                const prefs = mailingPreferences.mailingPreferences.postalMail;
                const defaultCountryCode = SUPPORTED_COUNTRIES_CODES.indexOf(userCountry) >= 0 ? userCountry : 'US';

                //if there is no address, adapt the data
                if (prefs?.address && Object.keys(prefs?.address).length === 0) {
                    prefs.address.firstName = user.firstName;
                    prefs.address.lastName = user.lastName;
                }

                userCountry = prefs?.address?.country || userCountry;

                this.setState({
                    editMode: false,
                    editedPrefs: null,
                    address: prefs.address,
                    prefs: prefs,
                    shouldShowCanadaLegalCopy: userCountry === 'CA',
                    defaultCountryCode
                });
            } catch (error) {
                Sephora.logger.verbose('Error in PostMailPrefs.c', error);
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
        this.setState({ editedPrefs: Object.assign({}, this.state.editedPrefs, { subscribed: e.currentTarget.value === '1' }) });
    };

    handleCancelClick = () => {
        this.setState({ editedPrefs: null });
        this.switchToViewMode();
    };

    getPrefsFromForm = () => {
        return {
            subscribed: this.state.editedPrefs.subscribed,
            address: (this._addressFormComponent && this._addressFormComponent.getData().address) || {}
        };
    };

    handleUpdateClick = () => {
        const prefs = this.getPrefsFromForm();

        if (!prefs.subscribed && !this.state.prefs.subscribed) {
            this.switchToViewMode();
        } else {
            let isAddressFormValid = false;

            if (prefs.subscribed) {
                isAddressFormValid = this._addressFormComponent && this._addressFormComponent.validateForm();
            }

            if (!prefs.subscribed || (prefs.subscribed && isAddressFormValid)) {
                const { firstName = '', lastName = '' } = this.state?.address || {};
                profileApi
                    .setPostalMailPreferences(prefs)
                    .then(() => {
                        this.setState({
                            prefs: {
                                ...prefs,
                                address: {
                                    ...prefs?.address,
                                    firstName,
                                    lastName
                                }
                            }
                        });
                        this.switchToViewMode();
                    })
                    .catch(r => {
                        this._addressFormComponent.setState({ errorMessages: r.errorMessages });
                    });
            }
        }
    };

    handleUpdateClickDebounce = Debounce.preventDoubleClick(this.handleUpdateClick, 3000);

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/MailingPrefs/PostalMailPrefs/locales', 'PostalMailPrefs');

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
                            {getText('postalMail')}
                        </Text>
                    </LegacyGrid.Cell>
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
                        {Sephora.isMobile() && <Divider marginY={3} />}
                        <Text is='p'>
                            <b>{getText('status')}</b> {this.state.prefs.subscribed ? getText('subscribed') : getText('notSubscribed')}
                        </Text>
                        {this.state.editMode && (
                            <Box
                                is='form'
                                action=''
                                noValidate
                                marginTop={2}
                                onSubmit={e => {
                                    e.preventDefault();
                                    this.handleUpdateClickDebounce();
                                }}
                            >
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
                                {this.state.editedPrefs.subscribed && (
                                    <Box marginTop={5}>
                                        <AddressForm
                                            editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.PROFILE.POSTMAIL_PREF_ADDRESS)}
                                            isEditMode={true}
                                            address={this.state.editedPrefs.address}
                                            isPhoneFieldHidden={true}
                                            isFirstNameFieldDisabled={true}
                                            isLastNameFieldDisabled={true}
                                            country={this.state.defaultCountryCode}
                                            countryList={this.state.countryList}
                                            ref={comp => (this._addressFormComponent = comp)}
                                        />
                                    </Box>
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
                                            type='submit'
                                        >
                                            {getText('save')}
                                        </Button>
                                    </LegacyGrid.Cell>
                                </LegacyGrid>
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    color='gray'
                                    marginTop={2}
                                >
                                    {this.state.editedPrefs.subscribed && this.state.shouldShowCanadaLegalCopy
                                        ? CANADA_LEGAL_COPY
                                        : getText('outsideMail')}
                                </Text>
                            </Box>
                        )}
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell
                        width='4em'
                        textAlign='right'
                        lineHeight='tight'
                    >
                        {this.state.editMode || (
                            <Link
                                color='blue'
                                marginY={-2}
                                paddingY={2}
                                onClick={this.switchToEditMode}
                            >
                                {getText('edit')}
                            </Link>
                        )}
                    </LegacyGrid.Cell>
                </LegacyGrid>
            )
        );
    }
}

export default wrapComponent(PostalMailPrefs, 'PostalMailPrefs', true);
