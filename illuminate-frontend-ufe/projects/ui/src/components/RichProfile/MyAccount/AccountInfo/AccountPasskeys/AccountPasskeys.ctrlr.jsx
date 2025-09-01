/* eslint-disable max-len */
import React from 'react';
import store from 'store/Store';

import actions from 'actions/Actions';
import passkeysActions from 'actions/PasskeysActions';

import BaseClass from 'components/BaseClass';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import InfoButton from 'components/InfoButton';
import {
    Button, Divider, Link, Text
} from 'components/ui';

import dateUtils from 'utils/Date';
import { wrapComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { showPasskeysInfoModal } = actions;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountPasskeys/locales', 'AccountPasskeys');

class AccountPasskeys extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { isEditMode, setEditSection } = this.props;

        if (isEditMode && this.props.passkeys?.length === 0) {
            setEditSection('');
        }
    }

    componentDidMount() {
        this.handlePassKeyInfo();
    }

    handlePassKeyInfo = () => {
        if (this.props.hasIdentity) {
            passkeysActions.getPasskeysData();
        }
    };

    handleCloseButtonClick = () => {
        this.props.setEditSection('');
    };

    handleEditLinkClick = () => {
        this.props.setEditSection('passkeys');
    };

    handleInfoButtonClick = () => {
        store.dispatch(showPasskeysInfoModal({ isOpen: true }));
    };

    handleRemovePasskeysLinkClick = passkey => {
        const message = getModalText => (
            <div>
                {getModalText('pleaseConfirmYouWantToRemove')}{' '}
                <strong>{`${passkey?.metaInfo?.deviceName} ${getText('sephoraAppText')}` || ''}</strong> {getModalText('passkeyFromYourAccount')}
            </div>
        );

        return () => {
            const { firstName, lastName } = this.props.user;
            const userData = { firstName: firstName, lastName: lastName };
            passkeysActions.openRemovePasskeysModal(this.props.passkeys, passkey, message, userData);
        };
    };

    renderCancelButton = () => {
        return (
            <Button
                key='cancel_passkeys_action'
                data-at={Sephora.debug.dataAt('myaccount_cancel_button')}
                width={['100%', '12em']}
                onClick={this.handleCloseButtonClick}
                variant='secondary'
            >
                {getText('cancel')}
            </Button>
        );
    };

    renderPasskeys = () => {
        const isMobile = Sephora.isMobile();

        return this.props?.passkeys?.map(passkey => (
            <LegacyGrid.Cell
                key={passkey.passkeyId}
                marginBottom={4}
                width={isMobile ? 'fill' : 'fit'}
            >
                <LegacyGrid
                    fill={!isMobile}
                    gutter={2}
                    alignItems='center'
                >
                    <LegacyGrid.Cell width={isMobile ? 'fill' : 'fill'}>
                        <Text is='p'>{`${passkey?.metaInfo?.deviceName} ${getText('sephoraAppText')}`}</Text>

                        <Text
                            color='gray'
                            is='p'
                        >
                            {getText('createdOn')} {passkey.created ? dateUtils.getDateInMDYFormat(new Date(passkey.created)) : ''}
                        </Text>
                    </LegacyGrid.Cell>

                    <LegacyGrid.Cell width={isMobile ? 'fit' : 'fit'}>
                        <Link
                            color='blue'
                            paddingY={2}
                            marginY={-2}
                            onClick={this.handleRemovePasskeysLinkClick(passkey)}
                            data-at={Sephora.debug.dataAt('account_passkey_remove_button')}
                        >
                            {getText('remove')}
                        </Link>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </LegacyGrid.Cell>
        ));
    };

    render() {
        const { isEditMode } = this.props;

        const isDesktop = Sephora.isDesktop();

        const displayBlock = (
            <React.Fragment>
                <LegacyGrid
                    gutter={3}
                    data-at={Sephora.debug.dataAt('account_passkeys_field')}
                    alignItems='baseline'
                >
                    <LegacyGrid.Cell width={!isDesktop ? 85 : 1 / 4}>
                        <Text fontWeight='bold'>{getText('passkey')}</Text>
                    </LegacyGrid.Cell>

                    <LegacyGrid.Cell width='fill'>
                        <Text is='p'>
                            {this.props?.passkeys?.length > 0 ? (
                                <>
                                    {isDesktop ? getText('signInWithFaceFingerprintPin') : getText('signInWithFaceOrFingerprint')}
                                    {isDesktop && <br />}
                                    {isDesktop ? getText('orDevicePassword') : null}
                                </>
                            ) : (
                                getText('noPasskey')
                            )}
                            <InfoButton
                                isOutline
                                padding={0}
                                margin={0}
                                marginLeft={1}
                                onClick={this.handleInfoButtonClick}
                            />
                        </Text>
                    </LegacyGrid.Cell>

                    {this.props?.passkeys?.length > 0 && (
                        <LegacyGrid.Cell
                            alignSelf='center'
                            width='fit'
                        >
                            <Link
                                color='blue'
                                paddingY={2}
                                marginY={-2}
                                onClick={this.handleEditLinkClick}
                                data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                            >
                                {getText('edit')}
                            </Link>
                        </LegacyGrid.Cell>
                    )}
                </LegacyGrid>

                <Divider marginY={5} />
            </React.Fragment>
        );

        const editBlock = (
            <React.Fragment>
                <LegacyGrid
                    data-at={Sephora.debug.dataAt('account_passkeys_field')}
                    gutter={3}
                    alignItems='baseline'
                >
                    <LegacyGrid.Cell width={!isDesktop ? 85 : 1 / 4}>
                        <Text fontWeight='bold'>{getText('passkey')}</Text>
                    </LegacyGrid.Cell>

                    <LegacyGrid.Cell width='fill'>
                        <Text
                            is='p'
                            marginBottom={4}
                        >
                            {isDesktop ? getText('signInWithFaceFingerprintPin') : getText('signInWithFaceOrFingerprint')}
                            {isDesktop ? <br /> : null}
                            {isDesktop ? getText('orDevicePassword') : null}

                            <InfoButton
                                isOutline
                                padding={0}
                                margin={0}
                                marginLeft={1}
                                onClick={this.handleInfoButtonClick}
                            />
                        </Text>

                        {isDesktop && [this.renderPasskeys(this.props?.passkeys), this.renderCancelButton()]}
                    </LegacyGrid.Cell>
                </LegacyGrid>

                {!isDesktop && (
                    <LegacyGrid.Cell width='fill'>{[this.renderPasskeys(this.props?.passkeys), this.renderCancelButton()]}</LegacyGrid.Cell>
                )}

                <Divider marginY={5} />
            </React.Fragment>
        );

        return isEditMode ? editBlock : displayBlock;
    }
}

export default wrapComponent(AccountPasskeys, 'AccountPasskeys');
