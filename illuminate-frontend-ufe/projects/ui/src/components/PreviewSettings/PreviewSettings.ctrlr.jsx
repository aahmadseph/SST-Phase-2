/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import BaseClass from 'components/BaseClass';
import InputDate from 'components/Inputs/InputDate/InputDate';
import Radio from 'components/Inputs/Radio/Radio';
import {
    Box, Flex, Image, Text, Button, Divider
} from 'components/ui';
import CookieUtils from 'utils/Cookies';
import Location from 'utils/Location';
import dateUtils from 'utils/Date';
import ErrorMsg from 'components/ErrorMsg';
import ufeApi from 'services/api/ufeApi';
import ProfileAttributes from 'components/ProfileAttributes/ProfileAttributes';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UserActions from 'actions/UserActions';
import PersonalizationUtils from 'utils/Personalization';
import Empty from 'constants/empty';

const FORMAT_DATE = /(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2})/;

class PreviewSettings extends BaseClass {
    state = {
        calendarOpen: false,
        viewActive: true,
        viewOos: false,
        shouldSeePreview: true,
        isPreviewWithProfileToggleOn: false,
        disableSubmitBtn: false
    };

    iframeRef = React.createRef();

    formatDate = dateString => {
        const result = FORMAT_DATE.exec(dateString).map(Number);
        const d = new Date();
        d.setFullYear(result[1]);
        d.setMonth(result[2] - 1, result[3]);
        d.setHours(result[4]);
        d.setMinutes(result[5]);
        d.setSeconds(0);

        return (
            `${d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}/` +
            `${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}/` +
            `${d.getFullYear()} ${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:` +
            `${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:` +
            `${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`
        );
    };

    writePreviewCookie = date => {
        const { viewActive, viewOos } = this.state;
        const queryParams = new URLSearchParams(global.window?.location.search);
        const prvCookie = CookieUtils.read(CookieUtils.KEYS.P13N_PRV);
        const context = prvCookie?.split('|')[3] || queryParams.get('context') || Empty.String;
        const variation = prvCookie?.split('|')[4] || queryParams.get('variation') || Empty.String;

        const previewDetails = {
            date,
            viewActiveAssets: viewActive,
            includeOOS: viewOos,
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
        const date = this.dateTime.getValue(true);
        ufeApi.flushCache();

        const { user } = this.props;

        if (user.profileLocale) {
            CookieUtils.write(CookieUtils.KEYS.PREVIEW_COOKIE, date, 0);

            if (Location.isPreview()) {
                if (email.length && password.length && this.state.isPreviewWithProfileToggleOn) {
                    store.dispatch(
                        UserActions.loginForPreview(email, password, this.writePrvCookieAndSetLocation(date), reason => {
                            this.setState({
                                message: reason?.errorMessage
                            });
                        })
                    );
                } else {
                    this.writePrvCookieAndSetLocation(date);
                }
            } else {
                Location.reload();
            }
        } else {
            this.setState({
                message: 'An error occured. Please try again later.'
            });
        }
    };

    submitButtonClick = event => {
        event.preventDefault();

        if (this.state.isPreviewWithProfileToggleOn) {
            this.iframeRef.current?.handleSubmit();

            if (this.state.disableSubmitBtn) {
                return;
            }
        }

        const date = this.dateTime.getValue(true);
        const validDate = dateUtils.isValidDateTime(date);
        const rupexData = Storage.session.getItem(LOCAL_STORAGE.RUPEX_PREVIEW_DATA) || {};
        const { previewProfile: { email = '', password = '', clientId } = {} } = rupexData || {};

        if (validDate && date.toString() !== '') {
            const custAttributes = PersonalizationUtils.getCustomerAttributes(
                rupexData?.customer360,
                date,
                this.state.viewActive,
                this.state.viewOos,
                clientId
            );
            Storage.session.setItem(LOCAL_STORAGE.CUSTOMER_OBJECT, custAttributes);

            this.updatePreviewSettings(email, password);
        } else {
            this.setState({ message: 'Please enter a valid date.' });
        }
    };

    componentDidMount() {
        const prvCookie = CookieUtils.read(CookieUtils.KEYS.P13N_PRV);
        const parsedPrvCookie = PersonalizationUtils.parsePrvCookie(prvCookie);

        this.setState(
            {
                viewOos: parsedPrvCookie.includeOOS,
                viewActive: parsedPrvCookie.viewActiveAssets
            },
            () => {
                this.writePreviewCookie(dateUtils.generateCurrentDateTime());
            }
        );

        this.dateTime.setValue(dateUtils.generateCurrentDateTime());
    }

    setErrorMessage = message => {
        this.setState({
            message
        });
    };

    render() {
        const { isPreviewPersonalizationEnabled } = Sephora?.configurationSettings;

        return (
            <Flex
                border={12}
                borderColor='lightGray'
                minHeight='100%'
                alignItems='center'
                justifyContent='center'
                paddingY={6}
            >
                <Box
                    is='form'
                    width='100%'
                    onSubmit={e => this.submitButtonClick(e)}
                >
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/sephora-logo.svg'
                        display='block'
                        alt='Sephora'
                        width={[103, 147]}
                        height={28}
                        marginX={[4, 9]}
                    />
                    <Divider
                        marginTop={[5, 6]}
                        marginBottom={5}
                    />
                    <Box
                        maxWidth={320}
                        marginX={[4, 9]}
                    >
                        <Text
                            is='h1'
                            fontSize={['lg', 'xl']}
                            marginBottom={6}
                            fontWeight='bold'
                        >
                            Preview settings
                        </Text>
                        <Text
                            is='label'
                            display='block'
                            htmlFor='dateTime'
                            fontWeight='bold'
                            marginBottom={2}
                        >
                            Preview as of
                        </Text>
                        <InputDate
                            id='dateTime'
                            type='datetime-local'
                            isLarge={true}
                            ref={c => (this.dateTime = c)}
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
                        {this.state.message && <ErrorMsg children={this.state.message} />}
                        <Box
                            is='fieldset'
                            marginY={5}
                        >
                            <Text
                                is='legend'
                                fontWeight='bold'
                                marginBottom={2}
                            >
                                Show assets
                            </Text>
                            <Radio
                                name='previewActive'
                                checked={this.state.viewActive}
                                onChange={() => {
                                    this.setState({
                                        viewActive: true
                                    });
                                }}
                            >
                                Active
                            </Radio>
                            <Radio
                                name='previewActive'
                                checked={!this.state.viewActive}
                                onChange={() => {
                                    this.setState({
                                        viewActive: false
                                    });
                                }}
                            >
                                All
                            </Radio>
                        </Box>
                        <Box
                            is='fieldset'
                            marginY={5}
                        >
                            <Text
                                is='legend'
                                fontWeight='bold'
                                marginBottom={2}
                            >
                                View OOS items
                            </Text>
                            <Radio
                                name='viewOos'
                                checked={this.state.viewOos}
                                onChange={() => {
                                    this.setState({
                                        viewOos: true
                                    });
                                }}
                            >
                                Yes
                            </Radio>
                            <Radio
                                name='viewOos'
                                checked={!this.state.viewOos}
                                onChange={() => {
                                    this.setState({
                                        viewOos: false
                                    });
                                }}
                            >
                                No
                            </Radio>
                        </Box>
                    </Box>

                    {isPreviewPersonalizationEnabled && (
                        <ProfileAttributes
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
                    <Box marginX={[4, 9]}>
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            type='submit'
                            children='Submit'
                        />
                    </Box>
                </Box>
            </Flex>
        );
    }
}

export default wrapComponent(PreviewSettings, 'PreviewSettings', true);
