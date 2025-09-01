/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import Actions from 'actions/Actions';
import ResetSessionExpiryActions from 'actions/ResetSessionExpiryActions';
import utilityApi from 'services/api/utility';
import sessionExtensionService from 'services/SessionExtensionService';
import refreshToken from 'services/api/accessToken/refreshToken';

import { Text, Button } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Modal from 'components/Modal/Modal';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import authenticationUtils from 'utils/Authentication';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const MINUTE = 60000;
let timer;

class ExtendSessionModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: MINUTE,
            isOpen: false
        };
    }

    componentDidMount() {
        this.setState({ timeRemaining: MINUTE });
        timer = setInterval(() => {
            if (this.state.timeRemaining <= 0) {
                clearInterval(timer);
                this.requestClose();
            } else {
                this.setState(prevState => {
                    return { timeRemaining: prevState.timeRemaining - 1000 };
                });
            }
        }, 1000);
    }

    requestClose = () => {
        clearInterval(timer);
        store.dispatch(Actions.showExtendSessionModal(false));
    };

    resetSessionExpiry = () => {
        const { isAtgSunsetEnabled } = Sephora.configurationSettings;

        const requestMethod = isAtgSunsetEnabled ? refreshToken.refreshToken : utilityApi.resetSessionExpiry;
        const methodOptions = isAtgSunsetEnabled
            ? [
                {
                    email: Storage.local.getItem(LOCAL_STORAGE.USER_EMAIL),
                    refreshToken: Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN)
                },
                { headers: { 'X-CAUSED-BY-URL': 'proactive_refresh' } }
            ]
            : null;

        requestMethod
            .apply(null, methodOptions)
            .then(async newAuthTokens => {
                if (isAtgSunsetEnabled && newAuthTokens && !Object.hasOwn(newAuthTokens, 'errors')) {
                    authenticationUtils.updateProfileStatus({
                        profileSecurityStatus: [newAuthTokens.profileSecurityStatus],
                        accessToken: [newAuthTokens.accessToken, newAuthTokens.atExp],
                        refreshToken: [newAuthTokens.refreshToken, newAuthTokens.rtExp]
                    });
                }

                store.dispatch(ResetSessionExpiryActions.resetSessionExpiry());
                this.requestClose();
                const { getCallsCounter } = (await import('services/api/ufeApi')).default;
                sessionExtensionService.setExpiryTimer(getCallsCounter());
            })
            .catch(() => {
                this.requestClose();
                store.dispatch(Actions.showExtendSessionFailureModal({ isOpen: true }));
            });
    };

    toMinsAndSecs = milliseconds => {
        const minutes = Math.floor(milliseconds / (60 * 1000));
        const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

        return [minutes, seconds];
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('extendSessionTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        lineHeight='tight'
                    >
                        {getText('sessionExpireText', this.toMinsAndSecs(this.state.timeRemaining))}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <LegacyGrid
                        fill={true}
                        gutter={4}
                    >
                        <LegacyGrid.Cell>
                            <Button
                                block={true}
                                onClick={this.requestClose}
                                variant='secondary'
                                children={getText('noThanks')}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell>
                            <Button
                                block={true}
                                onClick={this.resetSessionExpiry}
                                variant='primary'
                                children={getText('extendSessionButton')}
                            />
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(ExtendSessionModal, 'ExtendSessionModal');
