import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import dateUtils from 'utils/Date';
import store from 'store/Store';
import biRewardsApi from 'services/api/beautyInsider';
import userActions from 'actions/UserActions';
import {
    Grid, Box, Button, Text, Link, Divider
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Modal from 'components/Modal/Modal';

const INITIAL_STATE = {
    isModalOpen: false,
    unlinkAccountSuccess: null,
    unlinkAccountError: null,
    accountToUnlink: null
};

class AccountLinkedAccounts extends BaseClass {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    requestClose = unlinkAccountSuccess => {
        this.setState(INITIAL_STATE);

        if (unlinkAccountSuccess) {
            store.dispatch(userActions.getUserFull());
        }
    };

    unlinkAccount = ({ partnerName }) => {
        biRewardsApi
            .unlinkBiAccount({ partnerName })
            .then(data => {
                this.setState({ unlinkAccountSuccess: data });
            })
            .catch(err => {
                this.setState({ unlinkAccountError: err });
            });
    };

    openUnlinkModal = accountToUnlink => {
        this.setState({
            isModalOpen: true,
            accountToUnlink
        });
    };

    render() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountLinkedAccounts/locales', 'AccountLinkedAccounts')
        );
        const { user } = this.props;
        const { beautyInsiderAccount } = user;

        if (!beautyInsiderAccount || !beautyInsiderAccount.linkedAccountDetails) {
            return null;
        }

        const isMobile = Sephora.isMobile();
        const { isModalOpen, accountToUnlink, unlinkAccountSuccess, unlinkAccountError } = this.state;

        const footerColumns = isMobile && (unlinkAccountSuccess || unlinkAccountError) ? 1 : 2;
        const partnerName = (
            <span
                display='inline'
                css={{ textTransform: 'capitalize' }}
            >
                {accountToUnlink?.partnerName?.toLowerCase()}
            </span>
        );

        return (
            <>
                <LegacyGrid
                    gutter={3}
                    data-at={Sephora.debug.dataAt('account_linked_accounts_field')}
                    alignItems='baseline'
                >
                    <LegacyGrid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                        <Text
                            fontWeight='bold'
                            children={getText('linkedAccounts')}
                        />
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell width='fill'>
                        {beautyInsiderAccount.linkedAccountDetails.map(linkedAccount => (
                            <LegacyGrid
                                key={`linked_account_${linkedAccount.partnerID}`}
                                gutter={2}
                                data-at={Sephora.debug.dataAt('account_linked_accounts_field')}
                                alignItems='baseline'
                            >
                                <LegacyGrid.Cell width='fill'>
                                    <Text
                                        is='p'
                                        css={{ textTransform: 'capitalize' }}
                                    >
                                        {linkedAccount.partnerName.toLowerCase()}
                                    </Text>
                                    <Text
                                        is='p'
                                        fontSize='sm'
                                        marginBottom={3}
                                        children={`${getText('linkedOn')} ${dateUtils.getDateInFullYearFormat(linkedAccount.linkedDate)}`}
                                    />
                                </LegacyGrid.Cell>
                                <LegacyGrid.Cell width='fit'>
                                    <Link
                                        color='blue'
                                        paddingY={2}
                                        marginY={-2}
                                        onClick={() => this.openUnlinkModal(linkedAccount)}
                                    >
                                        {getText('unlink')}
                                    </Link>
                                </LegacyGrid.Cell>
                            </LegacyGrid>
                        ))}
                    </LegacyGrid.Cell>
                </LegacyGrid>
                <Divider marginY={5} />
                <Modal
                    isOpen={isModalOpen}
                    width={0}
                    onDismiss={this.requestClose}
                    isDrawer={true}
                >
                    <Modal.Header>
                        <Modal.Title>{getText('unlinkAccount')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {unlinkAccountSuccess && <p>{getText('unlinkSuccess', false, partnerName)}</p>}
                        {unlinkAccountError && (
                            <p>
                                {getText(
                                    'unlinkError',
                                    false,
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        color='blue'
                                        href={'/beauty/customer-service'}
                                        children={getText('chat')}
                                    />,
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        color='blue'
                                        href={'tel:18777374672'}
                                        children='1-877-SEPHORA'
                                    />
                                )}
                            </p>
                        )}
                        {!unlinkAccountSuccess && !unlinkAccountError && accountToUnlink && (
                            <>
                                <Text
                                    is='p'
                                    marginBottom={3}
                                    children={getText('areYouSure', false, partnerName)}
                                />
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Grid columns={footerColumns}>
                            <Box>
                                {(unlinkAccountSuccess || unlinkAccountError) && (
                                    <Button
                                        variant='primary'
                                        block={true}
                                        key={`cancelUnlinkAccount${accountToUnlink}`}
                                        onClick={() => this.requestClose(unlinkAccountSuccess)}
                                        children={getText('done')}
                                    />
                                )}

                                {!unlinkAccountSuccess && !unlinkAccountError && (
                                    <Button
                                        variant='secondary'
                                        block={true}
                                        key={`doneUnlinkAccount${accountToUnlink}`}
                                        onClick={() => this.requestClose()}
                                        children={getText('cancel')}
                                    />
                                )}
                            </Box>
                            <Box>
                                {!unlinkAccountSuccess && !unlinkAccountError && (
                                    <Button
                                        variant='primary'
                                        block={true}
                                        key={`unlinkAccount${accountToUnlink}`}
                                        disabled={!accountToUnlink}
                                        onClick={() => this.unlinkAccount(accountToUnlink)}
                                        children={getText('unlink')}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default wrapComponent(AccountLinkedAccounts, 'AccountLinkedAccounts', true);
