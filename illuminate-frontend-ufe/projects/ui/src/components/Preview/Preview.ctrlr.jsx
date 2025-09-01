/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Flex, Text, Button, Divider, Image
} from 'components/ui';
import store from 'store/Store';
import InputDate from 'components/Inputs/InputDate/InputDate';
import Radio from 'components/Inputs/Radio/Radio';
import IconCross from 'components/LegacyIcon/IconCross';
import ErrorMsg from 'components/ErrorMsg';
import ProfileAttributes from 'components/ProfileAttributes/ProfileAttributes';
import KillSwitchUrlToggle from 'components/Preview/KillSwitchUrlToggle';
import localeUtils from 'utils/LanguageLocale';
import CookieUtils from 'utils/Cookies';
import Location from 'utils/Location';
import ufeApi from 'services/api/ufeApi';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UserActions from 'actions/UserActions';
import PersonalizationUtils from 'utils/Personalization';
import { zIndices } from 'style/config';
import userUtils from 'utils/User';
import Empty from 'constants/empty';

/**
 * current datetime in ISO
 * b/c ios safari is the new IE6
 * non-standard printf 2000-01-01T00:00:00
 */
function generateIOS7Date() {
    const d = new Date();

    return (
        `${d.getFullYear()}-${d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}` +
        `-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}T` +
        `${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:00:00`
    );
}

class Preview extends BaseClass {
    state = {
        shouldSeePreview: false,
        assets: true,
        oosItems: false,
        dropdownOpen: false,
        calendarOpen: false,
        isPreviewWithProfileToggleOn: false,
        disableSubmitBtn: false
    };

    iframeRef = React.createRef();

    componentDidMount() {
        const shouldSeePreview =
            (Location.isOrderConfirmationPage() || (!Location.isCheckout() && !Location.isPreview())) &&
            CookieUtils.read(CookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE);

        this.setState({ shouldSeePreview }, () => {
            if (this.state.shouldSeePreview) {
                const selectedDate = CookieUtils.read(CookieUtils.KEYS.PREVIEW_COOKIE);
                const prvCookie = CookieUtils.read(CookieUtils.KEYS.P13N_PRV);

                const parsedPrvCookie = PersonalizationUtils.parsePrvCookie(prvCookie);

                const currentSelectedDate = selectedDate ? selectedDate : generateIOS7Date();
                this.date.setValue(currentSelectedDate);

                this.setState(
                    {
                        oosItems: parsedPrvCookie.includeOOS,
                        assets: parsedPrvCookie.viewActiveAssets
                    },
                    () => {
                        this.writePreviewCookie(currentSelectedDate);
                    }
                );
            }
        });
    }

    writePreviewCookie = date => {
        const { assets, oosItems } = this.state;
        const queryParams = new URLSearchParams(global.window?.location.search);
        const prvCookie = CookieUtils.read(CookieUtils.KEYS.P13N_PRV);
        const context = prvCookie?.split('|')[3] || queryParams.get('context') || Empty.String;
        const variation = prvCookie?.split('|')[4] || queryParams.get('variation') || Empty.String;

        const previewDetails = {
            date,
            viewActiveAssets: assets,
            includeOOS: oosItems,
            context,
            variation
        };

        const previewCookie = PersonalizationUtils.createPrvCookie(previewDetails);
        CookieUtils.write(CookieUtils.KEYS.P13N_PRV, previewCookie, null, false, false);
    };

    writePrvCookieAndSetLocation = date => {
        CookieUtils.write(CookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE, true);
        this.writePreviewCookie(date);
        Location.setLocation('/');
    };

    updatePreviewSettings = (email, password) => {
        const date = this.date.getValue(true);
        const { user } = this.props;

        if (user.profileLocale) {
            ufeApi.flushCache();
            this.setState({ message: 'Preview options set.' });
            CookieUtils.write(CookieUtils.KEYS.PREVIEW_COOKIE, date, 0);

            if (Location.isPreview()) {
                this.writePrvCookieAndSetLocation(date);
            } else {
                if (email.length && password.length && this.state.isPreviewWithProfileToggleOn) {
                    store.dispatch(
                        UserActions.loginForPreview(
                            email,
                            password,
                            (_data, extraParams = {}) => {
                                this.writePreviewCookie(date);

                                if (!extraParams?.isProfileLocaleChanged) {
                                    Location.reload();
                                }
                            },
                            reason => {
                                this.setState({
                                    message: reason?.errorMessage
                                });
                            }
                        )
                    );
                } else {
                    this.writePreviewCookie(date);
                    Location.reload();
                }
            }
        } else {
            this.setState({ message: 'An error occured.' });
        }
    };

    setPreview = () => {
        const date = this.date.getValue(true);
        const rupexData = Storage.session.getItem(LOCAL_STORAGE.RUPEX_PREVIEW_DATA) || {};

        if (!this.state.isPreviewWithProfileToggleOn && !userUtils.isAnonymous() && Sephora?.configurationSettings?.isPreviewPersonalizationEnabled) {
            Storage.session.removeItem(LOCAL_STORAGE.RUPEX_PREVIEW_DATA);
            Storage.session.removeItem(LOCAL_STORAGE.CUSTOMER_OBJECT);
            store.dispatch(UserActions.signOut());

            return;
        }

        if (this.state.isPreviewWithProfileToggleOn) {
            this.iframeRef.current?.handleSubmit();

            if (this.state.disableSubmitBtn) {
                return;
            }
        }

        if (date.toString() !== 'Invalid Date') {
            const { previewProfile: { email = '', password = '', clientId } = {} } = rupexData;

            const customerAttributes = PersonalizationUtils.getCustomerAttributes(
                rupexData?.customer360,
                date,
                this.state.assets,
                this.state.oosItems,
                clientId
            );
            Storage.session.setItem(LOCAL_STORAGE.CUSTOMER_OBJECT, customerAttributes);

            this.updatePreviewSettings(email, password);
        } else {
            this.setState({ message: 'Invalid Date - please change value' });
        }
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    setErrorMessage = message => {
        this.setState({
            message
        });
    };

    render() {
        const shouldSeePreview = this.state.shouldSeePreview;

        const getText = localeUtils.getLocaleResourceFile('components/Preview/locales', 'Preview');
        const { isPreviewPersonalizationEnabled } = Sephora?.configurationSettings;

        return shouldSeePreview ? (
            <Box
                backgroundColor='#04E3FF'
                position='fixed'
                bottom={['var(--bottomNavHeight)', null, 0]}
                left={0}
                zIndex='header'
                width={this.state.dropdownOpen ? ['100%', 367] : 270}
                height={'auto'}
                overflowY='auto'
                maxHeight={['93vh', '91vh', '100vh']}
                paddingBottom={this.state.dropdownOpen ? 0 : 3}
            >
                <Box
                    {...(this.state.dropdownOpen && {
                        position: 'sticky',
                        backgroundColor: '#04E3FF',
                        top: 0,
                        zIndex: zIndices.max
                    })}
                >
                    <Flex
                        justifyContent='space-between'
                        marginBottom={this.state.dropdownOpen ? 0 : 3}
                        paddingLeft={3}
                        paddingRight={3}
                        paddingTop={3}
                    >
                        <Text
                            fontSize='md'
                            fontWeight='bold'
                        >
                            {getText('previewSettings')}
                        </Text>
                        <Box
                            padding={2}
                            margin={-2}
                            lineHeight={0}
                            onClick={this.toggleDropdown}
                        >
                            <IconCross
                                x={this.state.dropdownOpen}
                                fontSize='md'
                            />
                        </Box>
                    </Flex>
                    {this.state.dropdownOpen && (
                        <Divider
                            marginTop={3}
                            marginBottom={4}
                        />
                    )}
                </Box>
                <Box
                    paddingLeft={3}
                    paddingRight={3}
                >
                    <InputDate
                        marginBottom={null}
                        ref={c => (this.date = c)}
                        type='datetime-local'
                        step='300'
                        onFocus={() =>
                            this.setState({
                                calendarOpen: true
                            })
                        }
                        onBlur={() =>
                            this.setState({
                                calendarOpen: false
                            })
                        }
                        customStyle={{
                            input: {
                                display: 'block'
                            }
                        }}
                    />
                </Box>
                <Box
                    marginTop={4}
                    paddingLeft={3}
                    paddingRight={3}
                    style={{
                        display: !this.state.dropdownOpen ? 'none' : null
                    }}
                >
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={1}
                    >
                        {getText('showAssets')}
                    </Text>
                    <Radio
                        name='previewAssets'
                        checked={this.state.assets}
                        value={1}
                        onChange={e =>
                            this.setState({
                                assets: e.currentTarget.value === '1'
                            })
                        }
                    >
                        {getText('active')}
                    </Radio>
                    <Radio
                        name='previewAssets'
                        checked={!this.state.assets}
                        value={0}
                        onChange={e =>
                            this.setState({
                                assets: e.currentTarget.value === '1'
                            })
                        }
                    >
                        {getText('all')}
                    </Radio>
                    <Box marginY={3}>
                        <Radio
                            name='previewOOS'
                            checked={!this.state.oosItems}
                            value={0}
                            onChange={e =>
                                this.setState({
                                    oosItems: e.currentTarget.value === '1'
                                })
                            }
                        >
                            {getText('viewOnActualInventory')}
                        </Radio>
                        <Radio
                            name='previewOOS'
                            checked={this.state.oosItems}
                            value={1}
                            onChange={e =>
                                this.setState({
                                    oosItems: e.currentTarget.value === '1'
                                })
                            }
                        >
                            {getText('viewAsInStock')}
                        </Radio>
                    </Box>
                    <KillSwitchUrlToggle getText={getText} />
                    {isPreviewPersonalizationEnabled && (
                        <ProfileAttributes
                            isModal={true}
                            handlePreviewWithProfileAttr={isOpen => {
                                this.setState({
                                    isPreviewWithProfileToggleOn: isOpen,
                                    disableSubmitBtn: isOpen
                                });
                            }}
                            disableSubmitBtn={isDisabled => {
                                this.setState({
                                    disableSubmitBtn: isDisabled
                                });
                            }}
                            setErrorMessage={message => this.setErrorMessage(message)}
                            ref={this.iframeRef}
                        />
                    )}
                </Box>
                <Box
                    position='sticky'
                    bottom={0}
                    backgroundColor='#04E3FF'
                    style={{
                        display: !this.state.dropdownOpen ? 'none' : null
                    }}
                >
                    <Divider marginBottom={3} />
                    {this.state.message && (
                        <Flex
                            paddingLeft={3}
                            gap={2}
                        >
                            <Image
                                disableLazyLoad={true}
                                src='/img/ufe/icons/warning.svg'
                                display='block'
                                width={16}
                                height={16}
                            />
                            <ErrorMsg
                                children={this.state.message}
                                fontSize='base'
                            />
                        </Flex>
                    )}
                    <Box
                        paddingLeft={3}
                        paddingRight={3}
                        paddingBottom={3}
                    >
                        <Button
                            variant='primary'
                            onClick={this.setPreview}
                            width={'100%'}
                        >
                            {getText('go')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        ) : null;
    }
}

export default wrapComponent(Preview, 'Preview', true);
