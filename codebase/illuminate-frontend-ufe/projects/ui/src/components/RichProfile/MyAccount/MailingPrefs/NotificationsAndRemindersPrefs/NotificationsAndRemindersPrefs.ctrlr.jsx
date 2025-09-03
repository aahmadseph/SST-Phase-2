import React from 'react';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Divider, Button, Image, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Radio from 'components/Inputs/Radio/Radio';
import Modal from 'components/Modal/Modal';
import constants from 'components/constants';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import Debounce from 'utils/Debounce';
import store from 'store/Store';

const { CANADA_LEGAL_COPY } = constants;
const { getLocaleResourceFile } = localeUtils;

const userCountry = localeUtils.getCurrentCountry().toUpperCase();

class NotificationsAndRemindersPrefs extends BaseClass {
    state = {
        editMode: false,
        editedPrefs: null,
        prefs: null,
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

    setMailingPreferences = user => {
        this._userProfileId = user.profileId;

        // mailingPreferences need to be watched and loaded ondemand
        store.setAndWatch('mailingPreferences', this, ({ mailingPreferences }) => {
            try {
                const notificationsAndReminders = mailingPreferences.mailingPreferences.notificationsAndReminders;

                this.setState({
                    editMode: false,
                    editedPrefs: null,
                    prefs: notificationsAndReminders
                });
            } catch (error) {
                Sephora.logger.verbose('Error in NotificationsAndRemindersPrefs.c', error);
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
        if (this.state.editMode) {
            this.setState({
                editedPrefs: null,
                editMode: false
            });
        }
    };

    handleStatusChange = e => {
        this.setState({ editedPrefs: Object.assign({}, this.state.editedPrefs, { subscribed: e.currentTarget.value === '1' }) });
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
        profileApi.setNotificationsAndRemindersPreferences(this.state.editedPrefs).then(() => {
            this.setState({ prefs: this.state.editedPrefs });
            this.switchToViewMode();
        });
    };

    handleUpdateClickDebounced = Debounce.preventDoubleClick(this.handleUpdateClick, 3000);

    shouldShowCanadaLegalCopy = () => {
        return userCountry === 'CA';
    };

    render() {
        const getText = getLocaleResourceFile(
            'components/RichProfile/MyAccount/MailingPrefs/NotificationsAndRemindersPrefs/locales',
            'NotificationsAndRemindersPrefs'
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
                            {getText('notifications')}
                            {Sephora.isDesktop() ? <br /> : ' '}
                            &amp; {getText('reminders')}
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
                        <Text
                            is='p'
                            marginBottom={2}
                        >
                            {getText('personalizedRecommendations')}
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
                        <Text is='p'>
                            <b>{getText('status')}</b> {this.state.prefs.subscribed ? getText('subscribed') : getText('notSubscribed')}
                        </Text>
                        {this.state.editMode && (
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
                                            onClick={this.handleUpdateClickDebounced}
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
                                    src={'/img/ufe/email-samples/email-example-notify.jpg'}
                                    display='block'
                                    marginX='auto'
                                />
                            </Modal.Body>
                        </Modal>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            )
        );
    }
}

export default wrapComponent(NotificationsAndRemindersPrefs, 'NotificationsAndRemindersPrefs');
